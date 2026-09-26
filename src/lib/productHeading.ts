// Product H1 per the SEO sheet, e.g. "Klimatyzator ścienny Rotenso Mirai": the model name is
// shown large (as in Figma), the rest as the small line above it — both inside one <h1>.
// Without a CMS value the Polish H1 is built from the address prefix; other languages keep the
// category label until the H1 is translated.
const PREFIX: [string, string][] = [
  ["klimatyzator-scienny-rotenso-", "Klimatyzator ścienny Rotenso"],
  ["klimatyzator-konsolowy-rotenso-", "Klimatyzator konsolowy Rotenso"],
  ["klimatyzator-kasetonowy-rotenso-", "Klimatyzator kasetonowy Rotenso"],
  ["klimatyzator-przypodlogowo-podsufitowy-rotenso-", "Klimatyzator przypodłogowo-podsufitowy Rotenso"],
  ["klimatyzator-kanalowy-rotenso-", "Klimatyzator kanałowy Rotenso"],
  ["klimatyzator-rotenso-", "Klimatyzator Rotenso"],
  ["pompa-ciepla-rotenso-", "Pompa ciepła Rotenso"],
  ["zbiornik-cwu-rotenso-", "Zbiornik CWU Rotenso"],
  ["zbiornik-buforowy-rotenso-", "Zbiornik buforowy Rotenso"],
];

export function productHeading({ lang, slug, name, seoH1, categoryLabel }: { lang: string; slug: string; name: string; seoH1: string; categoryLabel: string }) {
  if (seoH1 && seoH1.trim().endsWith(name)) return { kicker: seoH1.trim().slice(0, -name.length).trim(), name };
  if (lang === "pl") {
    const hit = PREFIX.find(([p]) => slug.startsWith(p));
    if (hit) return { kicker: hit[1], name };
  }
  return { kicker: categoryLabel, name };
}
