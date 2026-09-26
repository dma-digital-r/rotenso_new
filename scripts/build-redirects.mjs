// Builds the old rotenso.com → new site URL map, so nothing indexed today is lost at launch.
//   npm run seo:redirects
// Inputs (docs/seo/): the SEO specialist's product sheet (struktura-linkow-produkty.csv) and the
// old sitemap URL lists (*-sitemap.txt, from https://rotenso.com/pl/sitemap_index.xml).
// Outputs:
//   src/seo/redirects.json — 301 redirects used by next.config.ts (old path → new path)
//   docs/seo/mapa-adresow.csv — every old URL, its new address and whether that page exists yet

import { existsSync, readdirSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";

const LANGS = ["pl", "en", "de", "fr", "cs", "it", "uk"];
const dir = "docs/seo";
const slugs = JSON.parse(readFileSync(`${dir}/product-slugs.json`, "utf8"));
const csv = readFileSync(`${dir}/struktura-linkow-produkty.csv`, "utf8").split(/\r?\n/).slice(1);
const base = (u) => decodeURIComponent(u.replace(/\/+$/, "").split("/").pop());
// Kept percent-encoded (as requested by browsers), e.g. Ukrainian slugs.
const path = (u) => new URL(u).pathname.replace(/\/+$/, "") || "/";

// Old product slug → new SEO slug.
const productMap = new Map();
for (const line of csv) {
  const [oldUrl, newUrl] = line.split(",");
  if (oldUrl?.startsWith("http")) productMap.set(base(oldUrl), base(newUrl || oldUrl));
}
const newSlugs = new Set(Object.values(slugs));
function newProduct(old) {
  if (productMap.has(old)) return productMap.get(old);
  if (newSlugs.has(old)) return old;
  if (slugs[old]) return slugs[old];
  const noRev = old.replace(/-r\d+$/, "");
  if (noRev !== old) return newProduct(noRev);
  if (old.endsWith("-x-multi")) return newProduct(old.replace(/-x-multi$/, "-multi"));
  if (old === "teta-2") return newProduct("teta");
  return null;
}
// Discontinued or placeholder products: sent to the closest category.
const PRODUCT_FALLBACK = {
  cleo: "/pl", ione: "/pl", piura: "/pl", qube: "/pl", wint: "/pl", "oczyszczacz-aero": "/pl", orta: "/pl/klimatyzacja/split",
  "versu-silver": "/pl/klimatyzacja/designerskie", "versu-gold": "/pl/klimatyzacja/designerskie", hiro: "/pl/klimatyzacja/multi-split",
  tenji: "/pl/produkt/klimatyzator-kasetonowy-rotenso-tenji-cc", "agregaty-skraplajace-rotenso-rahu": "/pl/systemy-rvf",
};

// Filter button of the guides list, in its ASCII form (redirect Location headers must be ASCII).
const GUIDE_CATEGORY = { klimatyzacja: "klimatyzacja", "pompy-ciepla": "pompy-ciepla", rekuperacja: "rekuperacja", "rvf-vrf": "systemy-vrf-rvf", media: "z-zycia-firmy", "akademia-rotenso": "z-zycia-firmy" };
const PRODUCT_CATEGORY = {
  "klimatyzatory": "/pl/klimatyzacja", "klimatyzatory/pokojowe": "/pl/klimatyzacja/split", "klimatyzatory/komercyjne": "/pl/klimatyzacja/sufitowe",
  "klimatyzatory/multi-split": "/pl/klimatyzacja/multi-split", "pompy-ciepla": "/pl/pompy-ciepla", "pompy-ciepla/typu-split": "/pl/pompy-ciepla/split",
  "pompy-ciepla/typu-monoblock": "/pl/pompy-ciepla/monoblock", "pompy-ciepla/typu-all-in-split": "/pl/pompy-ciepla/all-in",
  "pompy-ciepla/zbiorniki-cwu": "/pl/pompy-ciepla/zbiorniki", "pompy-ciepla/zbiorniki-buforowe": "/pl/pompy-ciepla/zbiorniki",
  "systemy-rvf": "/pl/systemy-rvf", "systemy-rvf/jednostki-zewnetrzne": "/pl/systemy-rvf/jednostki-zewnetrzne",
  "systemy-rvf/jednostki-wewnetrzne": "/pl/systemy-rvf/jednostki-wewnetrzne", "agregaty-do-central": "/pl/systemy-rvf",
  "agregaty-do-central/agregaty-skraplajace-rahu": "/pl/systemy-rvf", "agregaty-do-central/agregaty-skraplajace-rvf-ahu": "/pl/systemy-rvf",
};
// Old pages by the meaning of their slug (any language). Tools and legal pages keep their address.
const PAGE_RULES = [
  [/^(home(-pl|-2)?|sklep|shop)$/, (l) => `/${l}`],
  [/^(o-nas(-2)?|about-us|ueber-uns|a-propos-de-nous|su-di-noi|про-нас)$/, (l) => `/${l}/o-nas`],
  [/^(kontakt(-1|-2)?|contact-us|kontaktieren-sie-uns|contactez-nous|contatto|kontaktujte-nas|звязатися-з-нами)$/, (l) => `/${l}/kontakt`],
  [/^(heat-pumps|waermepumpen|pompes-a-chaleur|pompe-di-calore|tepelna-cerpadla|теплові-насоси)$/, (l) => `/${l}/pompy-ciepla`],
  [/^(air-conditioners|klimaanlagen|klimatizace|condizionatori-daria|кондиціонери)$/, (l) => `/${l}/klimatyzacja`],
  [/^(ventilation-systems|beluftungsysteme|ventilacni-systemy|systemes-de-ventilation|sistema-di-ventilazione|теплові-насоси-2)$/, (l) => `/${l}/rekuperacja`],
  [/^(vrf-systems|vrf-systeme(-3)?|systemes-vrf-2|vrf-systemy(-3)?|sistemi-vrf(-3)?|vrf-системи(-3)?|systemy-klimatyzacji-rvf-vrf-rotenso)$/, (l) => `/${l}/systemy-rvf`],
  [/^(download|herunterladen|stahnout|scarica|завантажити|do-pobrania)$/, (l) => `/${l}/do-pobrania`],
  [/^(distribution(-2)?|vertrieb|distribuce|distribuzione|розподіл|dystrybucja)$/, (l) => `/${l}/dystrybucja`],
  [/^(personal-data|personenbezogene-daten|dati-personali|osobni-udaje|персональні-дані|przetwarzanie-danych-osobowych)$/, (l) => `/${l}/przetwarzanie-danych-osobowych`],
  [/^(poradnik)$/, (l) => `/${l}/poradnik`],
  [/^(partnerzy-handlowi)$/, (l) => `/${l}/znajdz-instalatora`],
  [/(katalog|catalog|brochure|broschure|brozur|buklet|ulotka|folder|flipbook|cennik|rotenso-catalogues|instrukcja-obslugi)/, (l) => `/${l}/katalogi`],
];

const read = (n) => (existsSync(`${dir}/${n}-sitemap.txt`) ? readFileSync(`${dir}/${n}-sitemap.txt`, "utf8").split(/\r?\n/).filter(Boolean) : []);
const guides = new Set(readdirSync("content/pl/guides").map((f) => f.replace(/\.mdoc$/, "")));
const products = new Set(readdirSync("content/pl/products").map((f) => f.replace(/\.yaml$/, "")));

// Does the target page exist on the new site right now?
function built(target) {
  const [p] = target.split("?");
  const parts = p.split("/").filter(Boolean);
  const [lang, a, b] = parts;
  if (!LANGS.includes(lang)) return false;
  if (parts.length === 1) return true;
  if (parts.length === 2) return ["o-nas", "poradnik", "systemy-rvf"].includes(a) || guides.has(a);
  if (a === "produkt" && parts.length === 3) return products.has(b);
  return false;
}

const rows = [];
const add = (oldUrl, target, note = "") => rows.push({ old: oldUrl, from: path(oldUrl), to: target, note });

for (const u of read("post")) {
  const s = base(u);
  add(u, `/pl/${s}`, guides.has(s) ? "poradnik — ten sam adres" : "WPIS BRAK W IMPORCIE");
}
for (const u of read("product")) {
  const s = base(u);
  if (/szablon/.test(s)) add(u, "/pl", "szablon WordPress — nie do indeksowania");
  else if (s === "shop") add(u, "/pl", "");
  else {
    const n = newProduct(s);
    add(u, n ? `/pl/produkt/${n}` : PRODUCT_FALLBACK[s] ?? "/pl", n ? "" : "produkt wycofany / do decyzji");
  }
}
// Old product links used inside the guides (not always in the sitemap any more).
const linked = new Set();
for (const f of readdirSync("content/pl/guides")) {
  for (const m of readFileSync(`content/pl/guides/${f}`, "utf8").matchAll(/rotenso\.com\/(?:pl\/)?produkt\/([a-z0-9_-]+)/g)) linked.add(m[1]);
}
for (const s of linked) {
  const n = newProduct(s);
  const u = `https://rotenso.com/pl/produkt/${s}/`;
  if (!rows.some((r) => r.from === path(u))) add(u, n ? `/pl/produkt/${n}` : PRODUCT_FALLBACK[s] ?? "/pl", "link z treści poradnika");
}
for (const line of csv) {
  const [oldUrl] = line.split(",");
  if (!oldUrl?.startsWith("http")) continue;
  const n = newProduct(base(oldUrl));
  if (!rows.some((r) => r.from === path(oldUrl))) add(oldUrl, `/pl/produkt/${n}`, "z arkusza SEO");
}
for (const u of read("product_cat")) {
  const key = path(u).replace(/^\/pl\/kategoria-produktu\//, "");
  add(u, PRODUCT_CATEGORY[key] ?? "/pl", PRODUCT_CATEGORY[key] ? "" : "kategoria wycofana");
}
for (const u of read("category")) {
  const c = base(u);
  add(u, GUIDE_CATEGORY[c] ? `/pl/poradnik?kategoria=${GUIDE_CATEGORY[c]}` : "/pl/poradnik");
}
for (const u of read("post_tag")) add(u, "/pl/poradnik", "tag");
for (const u of read("pdfviewer")) add(u, "/pl/katalogi");
for (const u of read("page")) {
  const p = path(u);
  const [lang, ...rest] = p.split("/").filter(Boolean);
  const s = rest.join("/");
  if (!s) {
    add(u, `/${lang}`, "strona główna — ten sam adres");
    continue;
  }
  const slug = decodeURIComponent(s);
  const rule = PAGE_RULES.find(([re]) => re.test(slug));
  add(u, rule ? rule[1](lang) : p, rule ? "" : "zachować adres (strona do zbudowania)");
}

// De-duplicate (the old sitemaps repeat some pages).
const seen = new Set();
const unique = rows.filter((r) => (seen.has(r.from) ? false : seen.add(r.from)));

const redirects = unique
  .filter((r) => r.from !== r.to.split("?")[0] || r.to.includes("?"))
  .map((r) => ({ source: r.from, destination: r.to }));
mkdirSync("src/seo", { recursive: true });
writeFileSync("src/seo/redirects.json", JSON.stringify(redirects, null, 1) + "\n");

const esc = (v) => (/[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v);
const header = "Stary adres,Nowy adres,Przekierowanie 301,Strona już istnieje,Uwagi";
const lines = unique.map((r) =>
  [r.old, `https://rotenso.com${r.to}`, r.from === r.to.split("?")[0] && !r.to.includes("?") ? "nie (ten sam adres)" : "tak", built(r.to) ? "tak" : "nie", r.note].map(esc).join(","),
);
writeFileSync(`${dir}/mapa-adresow.csv`, "﻿" + [header, ...lines].join("\n") + "\n");

const missing = unique.filter((r) => !built(r.to));
console.log(`Adresów: ${unique.length}, przekierowań 301: ${redirects.length}, docelowa strona jeszcze nie istnieje: ${missing.length}`);
console.log(`Poradników bez importu: ${unique.filter((r) => r.note === "WPIS BRAK W IMPORCIE").length}`);
