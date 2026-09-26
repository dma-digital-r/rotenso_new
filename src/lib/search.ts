// Site search: a small index per language (models from the mega menu + guides), served as static
// JSON by /api/search/<lang> and filtered in the browser by the header search box and /szukaj.

export type SearchProduct = { name: string; text: string; href: string; image: string | null; group: string };
export type SearchGuide = { title: string; excerpt: string; href: string; image: string | null; label: string; categories: string[] };
export type SearchIndex = { products: SearchProduct[]; guides: SearchGuide[]; phrases: string[] };

/** Lower case, no diacritics (ł → l too), single spaces. */
export const normalize = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/ł/g, "l")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();

// Crude stemming for inflected languages: "klimatyzatory" / "klimatyzatorem" still find
// "klimatyzator" — long words are matched by their first letters only.
const stem = (t: string) => (t.length > 5 ? t.slice(0, Math.max(5, t.length - 3)) : t);

export const queryTerms = (q: string) => normalize(q).split(" ").filter(Boolean).map(stem);

/** Score of a record for the query terms: 0 = not every term found. Title hits weigh more. */
function score(terms: string[], title: string, rest: string) {
  if (!terms.length) return 0;
  const t = normalize(title);
  const all = `${t} ${normalize(rest)}`;
  let total = 0;
  for (const term of terms) {
    if (!all.includes(term)) return 0;
    total += t.includes(term) ? (t.startsWith(term) || t.includes(` ${term}`) ? 4 : 3) : 1;
  }
  return total;
}

export function searchProducts(index: SearchIndex, q: string) {
  const terms = queryTerms(q);
  return index.products
    // The address carries the product type too (klimatyzator-scienny-rotenso-mirai).
    .map((p) => ({ p, s: score(terms, p.name, `${p.text} ${p.group} ${p.href.split("/").pop()}`) }))
    .filter((r) => r.s > 0)
    .sort((a, b) => b.s - a.s)
    .map((r) => r.p);
}

export function searchGuides(index: SearchIndex, q: string) {
  const terms = queryTerms(q);
  return index.guides
    .map((g) => ({ g, s: score(terms, g.title, `${g.excerpt} ${g.categories.join(" ")}`) }))
    .filter((r) => r.s > 0)
    .sort((a, b) => b.s - a.s)
    .map((r) => r.g);
}

/** Splits text into parts, marking the ones that match a query term (shown bold). */
export function highlight(text: string, q: string): { text: string; hit: boolean }[] {
  const terms = queryTerms(q);
  if (!terms.length) return [{ text, hit: false }];
  // Normalise character by character so positions in the normalised text match the original.
  const chars = [...text];
  const flat = chars.map((c) => normalize(c) || " ").join("");
  const marks = new Array(chars.length).fill(false);
  for (const term of terms) {
    let from = 0;
    for (;;) {
      const i = flat.indexOf(term, from);
      if (i < 0) break;
      const atWord = i === 0 || flat[i - 1] === " ";
      if (atWord) for (let k = i; k < i + term.length && k < marks.length; k++) marks[k] = true;
      from = i + 1;
    }
  }
  const out: { text: string; hit: boolean }[] = [];
  chars.forEach((c, i) => {
    const last = out[out.length - 1];
    if (last && last.hit === marks[i]) last.text += c;
    else out.push({ text: c, hit: marks[i] });
  });
  return out;
}

let cache: { lang: string; index: Promise<SearchIndex> } | null = null;

/** Loads the language's index once per page view. */
export function loadIndex(lang: string) {
  if (!cache || cache.lang !== lang) {
    cache = { lang, index: fetch(`/api/search/${lang}`).then((r) => (r.ok ? r.json() : { products: [], guides: [], phrases: [] })) };
  }
  return cache.index;
}
