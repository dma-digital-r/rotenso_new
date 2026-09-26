import "server-only";
import type { Locale } from "@/i18n/config";
import type { WentiloContent } from "./content";
import { documentsFor, type ProductDocument } from "./documents";
import { getRotensoProducts, type FeedProduct } from "./productFeed";

export type WentiloModel = {
  name: string;
  description: string;
  /** Feed parameters first, then the CMS rows the feed does not have. */
  specs: { label: string; value: string }[];
  /** One download list per feed version (IT250 S1 AA, IT250 S1 AB…). */
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

/** Wentilo model cards: every feed version whose symbol starts with the CMS prefix. */
export async function getWentiloModels(lang: Locale, models: WentiloContent["shop"]["models"]): Promise<WentiloModel[]> {
  let feed = new Map<string, FeedProduct>();
  try {
    feed = await getRotensoProducts();
  } catch (e) {
    console.error("[wentilo] feed niedostępny:", (e as Error).message);
  }
  return models.map((m) => {
    const prefix = m.prefix.trim().toUpperCase();
    const units = [...feed.values()].filter((u) => prefix && u.symbol.toUpperCase().startsWith(`${prefix} `)).sort((a, b) => a.symbol.localeCompare(b.symbol));
    if (prefix && !units.length && feed.size) console.warn(`[wentilo] brak w feedzie: ${prefix}`);
    const fromFeed = feedSpecs(units[0]);
    const known = new Set(fromFeed.map((r) => r.label.toLowerCase()));
    const specs = [...fromFeed, ...m.specs.filter((r) => r.label && r.value && !known.has(r.label.toLowerCase()))];
    return {
      name: m.name || prefix,
      description: m.description,
      specs,
      downloads: units.map((u) => ({ symbol: u.symbol, documents: documentsFor([u], lang) })),
    };
  });
}
