import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Node } from "@markdoc/markdoc";
import { RecentlyViewed } from "@/components/about/RecentlyViewed";
import { ArticleBody } from "@/components/blog/ArticleBody";
import { ArticleBoxLarge } from "@/components/blog/ArticleCard";
import { diagonalGradient } from "@/components/home/SectionBackdrop";
import { Button } from "@/components/ui/Button";
import { FramedImage } from "@/components/ui/FramedImage";
import { defaultLocale, isLocale, locales, type Locale } from "@/i18n/config";
import { getUi } from "@/i18n/ui";
import { getBlog, getGuide, getGuideList } from "@/lib/guides";

// Every language is prerendered. Until translated, other languages show the Polish text with a
// canonical link to the Polish page.
export const dynamicParams = false;
export async function generateStaticParams() {
  const all = await Promise.all(locales.map(async (lang) => (await getGuideList(lang)).map((g) => ({ lang, slug: g.slug }))));
  return all.flat();
}

type Props = { params: Promise<{ lang: string; slug: string }> };

async function load(params: Props["params"]) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) return null;
  const [entry, list] = await Promise.all([getGuide(lang, slug), getGuideList(lang)]);
  const summary = list.find((g) => g.slug === slug);
  if (!entry || !summary) return null;
  return { lang: lang as Locale, slug, entry, summary, list };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data = await load(params);
  if (!data) return {};
  const { lang, slug, summary } = data;
  return {
    title: summary.title,
    description: summary.excerpt,
    alternates: lang === defaultLocale ? undefined : { canonical: `/${defaultLocale}/poradniki/${slug}` },
    openGraph: { type: "article", title: summary.title, description: summary.excerpt, images: summary.image ? [summary.image] : undefined, publishedTime: summary.date },
  };
}

// No article template in Figma: the header follows "Header M" of the guides list (one slide),
// the text sits in an 860px column, then "Warto przeczytać" with related guides.
export default async function GuidePage({ params }: Props) {
  const data = await load(params);
  if (!data) notFound();
  const { lang, entry, summary, list } = data;
  const ui = getUi(lang);
  const blog = await getBlog(lang);
  const content = (typeof entry.content === "function" ? await (entry.content as () => Promise<{ node: Node }>)() : entry.content) as { node: Node };

  const related = list
    .filter((g) => g.slug !== summary.slug && g.categories.some((c) => c !== "Poradnik" && summary.categories.includes(c)))
    .slice(0, 3);
  const date = new Intl.DateTimeFormat(lang, { dateStyle: "long" }).format(new Date(summary.date));
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: summary.title,
    description: summary.excerpt,
    datePublished: summary.date,
    image: summary.image ?? undefined,
    inLanguage: "pl",
    publisher: { "@type": "Organization", name: "Rotenso" },
  };

  return (
    <main className="pb-[150px]">
      <section className="relative mx-[50px] mt-[15px] h-[650px] overflow-hidden rounded-[32px] bg-rotenso-grey">
        <FramedImage src={summary.image} alt={String(entry.imageAlt ?? "")} sizes="100vw" preload />
        <span className="absolute inset-x-0 bottom-0 h-[150px] bg-[linear-gradient(to_top,rgb(0_0_0/0.7),rgb(0_0_0/0))]" />
        <div className="relative mx-auto h-full w-[1300px] max-w-[calc(100%-32px)]">
          <nav aria-label="Breadcrumb" className="absolute top-[95px] left-0 text-[12px] leading-[normal] text-white">
            <Link href={`/${lang}`} className="hover:underline">
              {ui.crumbHome}
            </Link>
            {" / "}
            <Link href={`/${lang}/poradniki`} className="hover:underline">
              {ui.crumbGuides}
            </Link>
            {" / "}
            <span aria-current="page">{summary.title}</span>
          </nav>
          <div className="absolute top-[calc(50%+35px)] left-0 flex w-[530px] -translate-y-1/2 flex-col gap-[10px] rounded-[32px] bg-black/50 p-[30px] text-white backdrop-blur-[20px]">
            <p className="text-[12px] leading-[16.3px]">{summary.label}</p>
            <h1 className="text-h2 leading-[1.2] font-light">{summary.title}</h1>
            <p className="text-[12px] leading-[16.3px] opacity-80">
              {ui.published}: <time dateTime={summary.date}>{date}</time>
            </p>
          </div>
        </div>
      </section>

      <article className="mx-auto mt-[100px] w-[860px] max-w-[calc(100%-32px)]">
        <ArticleBody node={content.node} />
        {summary.tags.length > 0 && (
          <div className="mt-[50px] flex flex-wrap gap-[10px]">
            {summary.tags.map((t) => (
              <Button key={t} variant="s-outline" href={`/${lang}/poradniki?tag=${encodeURIComponent(t)}`}>
                #{t}
              </Button>
            ))}
          </div>
        )}
        <div className="mt-[50px] border-t border-grey-dd pt-[30px]">
          <Link href={`/${lang}/poradniki`} className="text-[16px] leading-[24px] text-rotenso-grey hover:text-rotenso-red">
            ← {blog.articleBack}
          </Link>
        </div>
      </article>

      {related.length > 0 && (
        <section className="mt-[150px] pt-[100px] pb-[150px]" style={{ backgroundImage: diagonalGradient(887) }}>
          <h2 className="text-center text-h1 leading-[1.2] font-light text-rotenso-grey">{blog.articleRelatedTitle}</h2>
          <div className="mx-auto mt-[50px] flex w-[1300px] max-w-[calc(100%-32px)] justify-center gap-[20px]">
            {related.map((g) => (
              <ArticleBoxLarge key={g.slug} g={g} readLabel={blog.readLabel} />
            ))}
          </div>
        </section>
      )}

      <RecentlyViewed title={blog.recent.title} text={blog.recent.text} button={blog.recent.button} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\u003c") }} />
    </main>
  );
}
