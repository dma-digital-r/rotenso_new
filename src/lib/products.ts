import "server-only";
import type { Entry } from "@keystatic/core/reader";
import { productsCollection } from "../../keystatic.config";
import { defaultLocale, type Locale } from "@/i18n/config";
import { reader } from "./content";
import { documentsFor, productCardOf, type ProductDocument } from "./documents";
import { getRotensoProducts, newerRevision, setPrice, type FeedProduct } from "./productFeed";
import { buildSpecs, type SpecGroup } from "./specs";

export type ProductEntry = Entry<ReturnType<typeof productsCollection>>;

/** One capacity of a family (e.g. "2,6 kW"), with everything the page shows for it. */
export type ProductVariant = {
  label: string;
  symbols: string;
  /** Gross price in PLN (set; indoor unit only for Multi Split) — Polish site only, null elsewhere or if missing. */
  price: number | null;
  specs: SpecGroup[];
  /** Dimension drawings of this capacity, falling back to the product's defaults. */
  dimensions: { indoor: string | null; outdoor: string | null; remote: string | null };
  documents: ProductDocument[];
  images: string[];
};

/** RVF: an indoor unit that works with this system (CMS symbol + texts, photo and card from the feed). */
export type IndoorUnit = { symbol: string; name: string; text: string; image: string | null; card: string | null };

export type ProductPage = {
  slug: string;
  entry: ProductEntry;
  variants: ProductVariant[];
  indoor: IndoorUnit[];
};

const collectionFor = (lang: Locale) => reader.collections[`products_${lang}`];

export async function listProducts(lang: Locale) {
  return (await collectionFor(lang).all()) as { slug: string; entry: ProductEntry }[];
}

async function readProduct(lang: Locale, slug: string): Promise<ProductEntry | null> {
  const own = (await collectionFor(lang).read(slug)) as ProductEntry | null;
  if (own) return own;
  // Languages without their own copy show the Polish one until it is translated.
  return lang === defaultLocale ? null : ((await collectionFor(defaultLocale).read(slug)) as ProductEntry | null);
}

const unitsOf = (feed: Map<string, FeedProduct>, symbols: string) =>
  symbols
    .split("+")
    .map((s) => feed.get(s.trim().toUpperCase()))
    .filter(Boolean) as FeedProduct[];

// Split sets are written "indoor + outdoor"; single-unit products have one symbol.
function splitUnits(units: FeedProduct[]) {
  const idu = units.find((u) => /wewn/i.test(u.name)) ?? units[0];
  const odu = units.find((u) => /zewn/i.test(u.name) && u !== idu) ?? units[1];
  return { idu, odu };
}

// "RVF-28V5IWM R11" → "RVF-V5IWM": the model series without capacity and revision.
const seriesOf = (symbol: string) => {
  const m = symbol.trim().toUpperCase().match(/^([A-Z]+-)\d+(\w+?)(?: R\d+)?$/);
  return m ? m[1] + m[2] : null;
};

export async function getProductPage(lang: Locale, slug: string): Promise<ProductPage | null> {
  const entry = await readProduct(lang, slug);
  if (!entry) return null;

  let feed = new Map<string, FeedProduct>();
  try {
    feed = await getRotensoProducts();
  } catch (e) {
    console.error("[produkty] feed niedostępny:", (e as Error).message);
  }

  // Only the newest revision may be shown — flag CMS symbols that have a newer one in the feed.
  for (const s of entry.variants.flatMap((v) => v.symbols.split("+"))) {
    const newer = newerRevision(feed, s);
    if (newer) console.warn(`[produkty] ${entry.name}: ${s.trim()} ma nowszą rewizję w feedzie — ${newer}`);
  }

  const variants = entry.variants.map((v) => {
    const units = unitsOf(feed, v.symbols);
    const { idu, odu } = splitUnits(units);
    return {
      label: v.label,
      symbols: v.symbols,
      // Multi Split: indoor unit only — the outdoor unit's price depends on the configuration.
      price: lang !== "pl" ? null : entry.system === "multi" ? (idu ? setPrice(feed, idu.symbol) : null) : setPrice(feed, v.symbols),
      specs: buildSpecs(idu, odu),
      dimensions: {
        indoor: v.dimensions.indoor ?? entry.dimensions.indoor,
        outdoor: v.dimensions.outdoor ?? entry.dimensions.outdoor,
        remote: v.dimensions.remote ?? entry.dimensions.remote,
      },
      documents: documentsFor([idu, odu], lang),
      // Feed photos: indoor unit first, then outdoor unit, without duplicates.
      images: [...new Set([...(idu?.images ?? []), ...(odu?.images ?? [])])],
    };
  });

  // RVF indoor units: always the newest revision of the CMS symbol.
  const indoor = entry.rvf.indoor.items.map((it) => {
    const typed = it.symbol.trim().toUpperCase();
    const symbol = newerRevision(feed, typed) ?? typed;
    if (symbol !== typed) console.warn(`[produkty] ${entry.name}: jednostka ${typed} ma nowszą rewizję w feedzie — użyto ${symbol}`);
    const unit = feed.get(symbol);
    if (typed && !unit && feed.size) console.warn(`[produkty] ${entry.name}: brak jednostki ${typed} w feedzie`);
    // Photo and sheet of this capacity, else of another capacity of the same series
    // (RVF-28V5IWM → RVF-22V5IWM, RVF-36V5IWM…): the units look the same, the sheet covers the series.
    const series = seriesOf(symbol);
    const siblings = [...feed.values()].filter((u) => u !== unit && series && seriesOf(u.symbol) === series);
    const image = it.image ?? unit?.images[0] ?? siblings.find((u) => u.images.length)?.images[0] ?? null;
    const card = productCardOf(unit, lang) ?? siblings.map((u) => productCardOf(u, lang)).find(Boolean) ?? null;
    return { symbol, name: it.name, text: it.text, image, card };
  });

  return { slug, entry, variants, indoor };
}
