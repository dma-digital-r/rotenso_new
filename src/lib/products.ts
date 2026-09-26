import "server-only";
import type { Entry } from "@keystatic/core/reader";
import { productsCollection } from "../../keystatic.config";
import { defaultLocale, type Locale } from "@/i18n/config";
import { reader } from "./content";
import { documentsFor, type ProductDocument } from "./documents";
import { getRotensoProducts, newerRevision, setPrice, type FeedProduct } from "./productFeed";
import { buildSpecs, type SpecGroup } from "./specs";

export type ProductEntry = Entry<ReturnType<typeof productsCollection>>;

/** One capacity of a family (e.g. "2,6 kW"), with everything the page shows for it. */
export type ProductVariant = {
  label: string;
  symbols: string;
  /** Gross "from" price in PLN — only on the Polish site, null elsewhere or if missing. */
  price: number | null;
  specs: SpecGroup[];
  /** Dimension drawings of this capacity, falling back to the product's defaults. */
  dimensions: { indoor: string | null; outdoor: string | null; remote: string | null };
  documents: ProductDocument[];
  images: string[];
};

export type ProductPage = {
  slug: string;
  entry: ProductEntry;
  variants: ProductVariant[];
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
      price: lang === "pl" ? setPrice(feed, v.symbols) : null,
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

  return { slug, entry, variants };
}
