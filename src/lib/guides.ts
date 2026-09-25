import "server-only";
import type { Entry } from "@keystatic/core/reader";
import { blogSingleton, guidesCollection } from "../../keystatic.config";
import { defaultLocale, type Locale } from "@/i18n/config";
import { reader, typesetDeep } from "./content";

type GuideEntry = Entry<ReturnType<typeof guidesCollection>>;
export type BlogContent = Entry<ReturnType<typeof blogSingleton>>;

/** A guide as a card on lists (everything except the article body). */
export type GuideSummary = {
  slug: string;
  href: string;
  title: string;
  date: string;
  categories: string[];
  tags: string[];
  excerpt: string;
  image: string | null;
  /** Card label: the name of the first list filter the guide belongs to (e.g. "Pompy ciepła"). */
  label: string;
};

const orphans = (lang: Locale) => lang === "pl" || lang === "cs";

export async function getBlog(lang: Locale): Promise<BlogContent> {
  const entry = (await reader.singletons[`blog_${lang}`].read()) ?? (await reader.singletons[`blog_${defaultLocale}`].read());
  if (!entry) throw new Error("Missing content/pl/blog.yaml");
  return typesetDeep(entry as BlogContent, orphans(lang));
}

// Languages without their own guides show the Polish ones until they are translated.
async function readAll(lang: Locale) {
  const own = (await reader.collections[`guides_${lang}`].all()) as { slug: string; entry: GuideEntry }[];
  return own.length || lang === defaultLocale
    ? own
    : ((await reader.collections[`guides_${defaultLocale}`].all()) as { slug: string; entry: GuideEntry }[]);
}

function labelFor(categories: readonly string[], filters: BlogContent["filters"]) {
  const hit = filters.find((f) => f.categories.some((c) => categories.includes(c)));
  return hit?.label ?? categories.find((c) => c !== "Poradnik") ?? categories[0] ?? "";
}

/** All listed guides, newest first. Imported WordPress pages without a category are left out. */
export async function getGuideList(lang: Locale): Promise<GuideSummary[]> {
  const [all, blog] = await Promise.all([readAll(lang), getBlog(lang)]);
  return all
    .filter(({ entry }) => entry.date && entry.categories.length)
    .sort((a, b) => String(b.entry.date).localeCompare(String(a.entry.date)))
    .map(({ slug, entry }) =>
      typesetDeep(
        {
          slug,
          href: `/${lang}/poradniki/${slug}`,
          title: entry.title,
          date: String(entry.date),
          categories: [...entry.categories],
          tags: [...(entry.tags ?? [])],
          excerpt: entry.excerpt,
          image: entry.image,
          label: labelFor(entry.categories, blog.filters),
        },
        orphans(lang),
      ),
    );
}

/** One guide with its article body (Markdoc document) — the language's own or the Polish one. */
export async function getGuide(lang: Locale, slug: string): Promise<(Omit<GuideEntry, "content"> & { content: { node: import("@markdoc/markdoc").Node } }) | null> {
  const read = (l: Locale) => reader.collections[`guides_${l}`].read(slug, { resolveLinkedFiles: true });
  const entry = (await read(lang)) ?? (lang === defaultLocale ? null : await read(defaultLocale));
  return entry as never;
}

/** Picks by slug in the CMS order; slugs that no longer exist are skipped. */
export function pickGuides(list: GuideSummary[], slugs: readonly (string | null)[]) {
  return slugs.map((s) => list.find((g) => g.slug === s)).filter(Boolean) as GuideSummary[];
}
