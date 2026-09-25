import "server-only";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, locales, type Locale } from "@/i18n/config";
import { getUi } from "@/i18n/ui";
import { getProductPage, listProducts } from "./products";

type Params = Promise<{ lang: string; category: string; product: string }>;

// Product pages are prerendered for every language; prices refresh daily with the feed.
export async function productStaticParams() {
  const products = await listProducts("pl");
  return locales.flatMap((lang) => products.map((p) => ({ lang, category: p.entry.category, product: p.slug })));
}

export async function loadProduct(params: Params) {
  const { lang, category, product } = await params;
  if (!isLocale(lang)) notFound();
  const page = await getProductPage(lang, category, product);
  if (!page) notFound();
  const base = `/${lang}/${category}/${product}`;
  return { lang: lang as Locale, category, page, base, ui: getUi(lang as Locale) };
}

export async function productMetadata(params: Params, suffix?: string): Promise<Metadata> {
  const { lang, category, product } = await params;
  if (!isLocale(lang)) return {};
  const page = await getProductPage(lang, category, product);
  if (!page) return {};
  const { entry } = page;
  const title = entry.seoTitle || `${entry.categoryLabel} Rotenso ${entry.name}`;
  // A copy (e.g. Mirai Multi) points search engines to the original split page.
  const canonical = entry.family.canonical ? entry.family.canonical.replace(/^\/pl(?=\/)/, `/${lang}`) : undefined;
  return {
    title: { absolute: suffix ? `${title} — ${suffix}` : title },
    description: entry.seoDescription || entry.description,
    alternates: canonical ? { canonical } : undefined,
  };
}
