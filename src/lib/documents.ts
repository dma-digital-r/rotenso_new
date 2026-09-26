import type { Locale } from "@/i18n/config";
import type { FeedProduct } from "./productFeed";

// Download files of a product. The feed marks every file as lang "PL"; the real language is
// in its description ("Karta katalogowa" / "Product data sheet" / "Katalogkarte"…), so each
// description is mapped to a document type + language. For every type the page shows the
// file in its own language, else English (the Polish site also falls back to English).
// Polish-only documents are not offered abroad. Drawings (DWG) are language-neutral.

type DocLang = Locale | "any";
const KNOWN: Record<string, { type: string; lang: DocLang }> = {
  "Deklaracja zgodności": { type: "conformity", lang: "pl" },
  "Declaration of Conformity": { type: "conformity", lang: "en" },
  "Karta gwarancyjna": { type: "warranty", lang: "pl" },
  "Karta katalogowa": { type: "catalogue", lang: "pl" },
  "Product data sheet": { type: "catalogue", lang: "en" },
  Katalogkarte: { type: "catalogue", lang: "de" },
  "Fiche de catalogue": { type: "catalogue", lang: "fr" },
  "Katalogová karta": { type: "catalogue", lang: "cs" },
  "Katalozhna kartka": { type: "catalogue", lang: "uk" },
  "Karta produktu": { type: "fiche", lang: "pl" },
  "Product fiche": { type: "fiche", lang: "en" },
  "Instrukcja obsługi": { type: "userManual", lang: "pl" },
  "User manual": { type: "userManual", lang: "en" },
  Benutzerhandbuch: { type: "userManual", lang: "de" },
  "Instrukcja obsługi sterownika": { type: "controllerManual", lang: "pl" },
  "Operation manual for controller": { type: "controllerManual", lang: "en" },
  "Etykieta energetyczna": { type: "energyLabel", lang: "pl" },
  "Energy Label": { type: "energyLabel", lang: "en" },
  "Atest higieniczny": { type: "hygiene", lang: "pl" },
  "Hygienic certificate": { type: "hygiene", lang: "en" },
  "Instrukcja montażu i obsługi": { type: "installManual", lang: "pl" },
  "Installation and operating manual": { type: "installManual", lang: "en" },
  "Instrukcja obsługi WiFi": { type: "wifiManual", lang: "pl" },
  "WiFi user manual": { type: "wifiManual", lang: "en" },
  "WiFi-Benutzerhandbuch": { type: "wifiManual", lang: "de" },
  "Service manual": { type: "serviceManual", lang: "en" },
  "Technical data": { type: "technicalData", lang: "en" },
  "Capacity tables": { type: "capacityTables", lang: "en" },
  "Kody błędów": { type: "errorCodes", lang: "pl" },
  "Normy głośności": { type: "noise", lang: "pl" },
  "Instrukcja obsługi B2B": { type: "b2bManual", lang: "pl" },
  "DWG jednostka wewnętrzna": { type: "dwgIndoor", lang: "any" },
  "DWG jednostka zewnętrzna": { type: "dwgOutdoor", lang: "any" },
};

export type ProductDocument = { label: string; url: string; ext: string };

export function documentsFor(units: (FeedProduct | undefined)[], lang: Locale): ProductDocument[] {
  const byType = new Map<string, { label: string; url: string; lang: DocLang }[]>();
  const order: string[] = [];
  for (const u of units) {
    if (!u) continue;
    for (const a of u.attachments) {
      const known = KNOWN[a.label];
      // Unnamed or unknown files: keep them, as Polish documents under their own name.
      const type = known?.type ?? (a.label || "file");
      const docLang = known?.lang ?? "pl";
      if (!byType.has(type)) {
        byType.set(type, []);
        order.push(type);
      }
      const list = byType.get(type)!;
      if (!list.some((d) => d.url === a.url)) list.push({ label: a.label || "Dokument", url: a.url, lang: docLang });
    }
  }

  const out: ProductDocument[] = [];
  for (const type of order) {
    const files = byType.get(type)!;
    const pick = (l: DocLang) => files.filter((f) => f.lang === l);
    const chosen = files.some((f) => f.lang === "any")
      ? pick("any")
      : [pick(lang), pick("en")].find((l) => l.length) ?? [];
    for (const f of chosen) out.push({ label: f.label, url: f.url, ext: (f.url.split(".").pop() ?? "").toUpperCase() });
  }
  // The same document for the indoor and the outdoor unit (e.g. two warranty cards): name them apart.
  const counts = new Map<string, number>();
  out.forEach((d) => counts.set(d.label, (counts.get(d.label) ?? 0) + 1));
  const seen = new Map<string, number>();
  return out.map((d) => {
    if ((counts.get(d.label) ?? 0) < 2) return d;
    const n = (seen.get(d.label) ?? 0) + 1;
    seen.set(d.label, n);
    return { ...d, label: `${d.label} (${n === 1 ? "jedn. wewn." : "jedn. zewn."})` };
  });
}

/**
 * "Pobierz kartę produktu" of an RVF indoor unit: its catalogue sheet ("Karta katalogowa" /
 * "Product data sheet"…) in the page's language, else English, else Polish (Polish site only),
 * else the "Technical data" file. Null when the feed has none of them.
 */
export function productCardOf(unit: FeedProduct | undefined, lang: Locale): string | null {
  if (!unit) return null;
  const files = unit.attachments.map((a) => ({ url: a.url, ...(KNOWN[a.label] ?? { type: a.label, lang: "pl" as DocLang }) }));
  for (const type of ["catalogue", "technicalData"]) {
    const of = files.filter((f) => f.type === type);
    const hit = of.find((f) => f.lang === lang) ?? of.find((f) => f.lang === "en") ?? (lang === "pl" ? of[0] : undefined);
    if (hit) return hit.url;
  }
  return null;
}
