import "server-only";
import { XMLParser } from "fast-xml-parser";

// Thermosilesia B2B product feed (XML, ~12 MB, all brands). We keep Rotenso products only.
// Credentials: PRODUCT_FEED_URL / PRODUCT_FEED_USERNAME / PRODUCT_FEED_PASSWORD in .env.local.

// Categories used on the site: air conditioning, heat pumps, heat recovery, RVF.
// Remote controls and filters will be added here later.
const CATEGORY_GROUPS: Record<string, string[]> = {
  klimatyzacja: ["Rotenso Klimatyzatory RAC", "Rotenso Klimatyzatory SCAC", "Rotenso Klimatyzatory Multi", "Rotenso Klimatyzatory Multi HN"],
  "pompy-ciepla": ["Rotenso Pompy ciepła", "Rotenso Pompy ciepła 2GW", "Rotenso Pompy ciepła pakiety", "Rotenso Pompy ciepła zbiorniki"],
  rekuperacja: ["Rotenso Rekuperatory Wentilo Icon"],
  rvf: ["Rotenso RVF IDU", "Rotenso RVF ODU"],
};
const categoryToGroup = new Map(
  Object.entries(CATEGORY_GROUPS).flatMap(([group, cats]) => cats.map((c) => [c, group] as const)),
);

export type FeedProduct = {
  id: string;
  symbol: string;
  name: string;
  category: string;
  group: string;
  /** Gross price in PLN. */
  price: number;
  stock: number;
  url: string;
  images: string[];
  attributes: Record<string, string>;
};

type RawAttr = { name?: string; value?: string | number };
type RawProduct = {
  id: string | number;
  producer?: string;
  symbol?: string | number;
  name?: string;
  category?: string;
  price?: string | number;
  stock?: string | number;
  url?: string;
  gallery?: { image?: string | string[] } | string;
  attributes?: { group?: { attribute?: RawAttr | RawAttr[] } | { attribute?: RawAttr | RawAttr[] }[] } | string;
};

const asArray = <T,>(v: T | T[] | undefined): T[] => (v == null ? [] : Array.isArray(v) ? v : [v]);

function normalize(p: RawProduct): FeedProduct | null {
  if (String(p.producer ?? "").trim() !== "Rotenso") return null;
  const category = String(p.category ?? "").trim();
  const group = categoryToGroup.get(category);
  if (!group) return null;
  const attributes: Record<string, string> = {};
  if (p.attributes && typeof p.attributes === "object") {
    for (const g of asArray(p.attributes.group)) {
      for (const a of asArray(g.attribute)) {
        if (a.name && !(a.name in attributes)) attributes[a.name] = String(a.value ?? "");
      }
    }
  }
  return {
    id: String(p.id),
    symbol: String(p.symbol ?? "").trim(),
    name: String(p.name ?? "").trim(),
    category,
    group,
    price: Number(p.price) || 0,
    stock: Number(p.stock) || 0,
    url: String(p.url ?? ""),
    images: typeof p.gallery === "object" ? asArray(p.gallery.image).map(String) : [],
    attributes,
  };
}

async function download(): Promise<Map<string, FeedProduct>> {
  const url = process.env.PRODUCT_FEED_URL?.split("?")[0];
  const username = process.env.PRODUCT_FEED_USERNAME;
  const password = process.env.PRODUCT_FEED_PASSWORD;
  if (!url || !username || !password) throw new Error("Product feed credentials missing (.env.local)");

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ username, password }),
    // Same daily rhythm as the page. The ~12 MB body exceeds Next's 2 MB data-cache limit,
    // so it is simply re-downloaded when the page regenerates (once a day).
    next: { revalidate: 86400 },
  });
  if (!res.ok) throw new Error(`Product feed ${res.status} ${res.statusText}`);
  const xml = await res.text();

  const parser = new XMLParser({ ignoreAttributes: true, parseTagValue: false, trimValues: true });
  const doc = parser.parse(xml) as { products?: { product?: RawProduct | RawProduct[] } };
  const bySymbol = new Map<string, FeedProduct>();
  for (const raw of asArray(doc.products?.product)) {
    const p = normalize(raw);
    if (p?.symbol) bySymbol.set(p.symbol.toUpperCase(), p);
  }
  return bySymbol;
}

// The page itself is regenerated at most once a day (revalidate in page.tsx); this memo just
// shares one download between the language versions rendered in the same run.
const TTL = 60 * 60 * 1000;
let memo: { at: number; data: Promise<Map<string, FeedProduct>> } | null = null;

export function getRotensoProducts(): Promise<Map<string, FeedProduct>> {
  if (!memo || Date.now() - memo.at > TTL) {
    const data = download();
    memo = { at: Date.now(), data };
    data.catch(() => (memo = null));
  }
  return memo.data;
}

/**
 * "From" price of a set given as symbols joined with "+", e.g. "M26XI R15 + M26XO R15"
 * (for splits: indoor + outdoor unit of the lowest capacity). Gross, rounded up to whole PLN.
 * Returns null if any symbol is missing, so no wrong price is ever shown.
 */
export function setPrice(products: Map<string, FeedProduct>, symbols: string): number | null {
  const parts = symbols
    .split("+")
    .map((s) => s.trim().toUpperCase())
    .filter(Boolean);
  if (!parts.length) return null;
  let sum = 0;
  for (const s of parts) {
    const p = products.get(s);
    if (!p || p.price <= 0) return null;
    sum += p.price;
  }
  return Math.ceil(Math.round(sum * 100) / 100);
}
