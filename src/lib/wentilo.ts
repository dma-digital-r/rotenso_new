import "server-only";
import type { Locale } from "@/i18n/config";
import type { WentiloContent } from "./content";
import { documentsFor, type ProductDocument } from "./documents";
import { getRotensoProducts, isClearance, type FeedProduct } from "./productFeed";

// Rotenso has one recuperator, Wentilo ICON; the page covers all of it. The feed's
// "Rotenso Rekuperatory Wentilo Icon" products are its versions: "IT250 S1 AA" = housing IT,
// max 250 m³/h, version S1 (exchanger + control system — see the feed attributes "Rodzaj
// wymiennika" / "System sterowania"), side AA/AB. A model is the symbol without the side; its
// sides share one card.
const CATEGORY = "Rotenso Rekuperatory Wentilo Icon";
const HOUSINGS = ["IT", "IS", "IC"];

export type WentiloModel = {
  /** e.g. "IT250 S1" */
  prefix: string;
  housing: string;
  name: string;
  description: string;
  /** Feed parameters first, then the CMS rows the feed does not have. */
  specs: { label: string; value: string }[];
  /** One download list per side version (IT250 S1 AA, IT250 S1 AB). */
  downloads: { symbol: string; documents: ProductDocument[] }[];
};

// Feed attributes that name the product rather than describe it.
const SKIP = new Set(["Model", "Seria Rotenso", "Rodzaj obudowy", "Strona wykonania"]);

// "Wydajność maksymalna (m³/h)" + "250" → "Wydajność maksymalna", "250 m³/h".
function feedSpecs(unit: FeedProduct | undefined) {
  if (!unit) return [];
  return Object.entries(unit.attributes)
    .filter(([name, value]) => value && !SKIP.has(name))
    .map(([name, value]) => {
      const m = name.match(/^(.*?)\s*\(([^)]+)\)$/);
      return m ? { label: m[1], value: `${value} ${m[2]}` } : { label: name, value };
    });
}

const parse = (symbol: string) => symbol.toUpperCase().match(/^(I[TSC])(\d+) ([SE]\d) (A[AB])$/);

/**
 * Every Wentilo ICON model in the feed (demo units and clearance items left out), IT → IS → IC,
 * by capacity, then S1, S4, E1, E4. CMS entries (by prefix) add the description and the spec rows
 * the feed does not have; a CMS prefix missing from the feed is reported and skipped.
 */
export async function getWentiloModels(lang: Locale, cms: WentiloContent["shop"]["models"]): Promise<WentiloModel[]> {
  let feed = new Map<string, FeedProduct>();
  try {
    feed = await getRotensoProducts();
  } catch (e) {
    console.error("[wentilo] feed niedostępny:", (e as Error).message);
  }
  const byPrefix = new Map<string, FeedProduct[]>();
  for (const u of feed.values()) {
    if (u.category !== CATEGORY || !parse(u.symbol) || isClearance(u.name)) continue;
    const prefix = u.symbol.toUpperCase().split(" ").slice(0, 2).join(" ");
    byPrefix.set(prefix, [...(byPrefix.get(prefix) ?? []), u]);
  }
  for (const m of cms) {
    const p = m.prefix.trim().toUpperCase();
    if (p && feed.size && !byPrefix.has(p)) console.warn(`[wentilo] brak w feedzie: ${p}`);
  }

  const variantOrder = ["S1", "S4", "E1", "E4"];
  const key = (prefix: string) => {
    const [, housing, cap, variant] = prefix.match(/^(I[TSC])(\d+) ([SE]\d)$/) ?? [];
    return [HOUSINGS.indexOf(housing), Number(cap), variantOrder.indexOf(variant)];
  };
  const prefixes = [...byPrefix.keys()].sort((a, b) => {
    const [x, y] = [key(a), key(b)];
    return x[0] - y[0] || x[1] - y[1] || x[2] - y[2];
  });

  return prefixes.map((prefix) => {
    const units = byPrefix.get(prefix)!.sort((a, b) => a.symbol.localeCompare(b.symbol));
    const entry = cms.find((m) => m.prefix.trim().toUpperCase() === prefix);
    const fromFeed = feedSpecs(units[0]);
    const known = new Set(fromFeed.map((r) => r.label.toLowerCase()));
    const extra = (entry?.specs ?? []).filter((r) => r.label && r.value && !known.has(r.label.toLowerCase()));
    return {
      prefix,
      housing: prefix.slice(0, 2),
      name: entry?.name || `Wentilo ICON ${prefix}`,
      description: entry?.description ?? "",
      specs: [...fromFeed, ...extra],
      downloads: units.map((u) => ({ symbol: u.symbol, documents: documentsFor([u], lang) })),
    };
  });
}
