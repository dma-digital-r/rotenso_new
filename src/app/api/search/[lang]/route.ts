import { isLocale, locales, type Locale } from "@/i18n/config";
import { getMenu, getSettings } from "@/lib/content";
import { getGuideList } from "@/lib/guides";
import type { SearchIndex, SearchProduct } from "@/lib/search";

// Search index of one language, generated at build time (static JSON) — see src/lib/search.ts.
export const dynamic = "force-static";
export const generateStaticParams = () => locales.map((lang) => ({ lang }));

export async function GET(_: Request, { params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) return Response.json({ error: "not-found" }, { status: 404 });
  const [menu, settings, guides] = await Promise.all([getMenu(lang as Locale), getSettings(lang as Locale), getGuideList(lang as Locale)]);

  // Every model shown in the mega menu, once per address; the text names its menu section.
  const products = new Map<string, SearchProduct>();
  for (const tab of menu.tabs)
    for (const cat of tab.categories)
      for (const section of cat.sections)
        for (const p of section.products) {
          if (!p.href || products.has(p.href)) continue;
          const text = [section.title || cat.label, p.tagline].filter(Boolean).join(". ");
          products.set(p.href, { name: p.name, text: text ? `${text}.` : "", href: p.href, image: p.image, group: tab.label });
        }

  const index: SearchIndex = {
    products: [...products.values()],
    guides: guides.map((g) => ({ title: g.title, excerpt: g.excerpt, href: g.href, image: g.image, label: g.label, categories: g.categories })),
    phrases: [...settings.searchPhrases],
  };
  return Response.json(index);
}
