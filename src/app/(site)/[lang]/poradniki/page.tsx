import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RecentlyViewed } from "@/components/about/RecentlyViewed";
import { ArticleBox, ArticleBoxLarge } from "@/components/blog/ArticleCard";
import { BlogHero } from "@/components/blog/BlogHero";
import { BlogList } from "@/components/blog/BlogList";
import { diagonalGradient } from "@/components/home/SectionBackdrop";
import { isLocale, locales, type Locale } from "@/i18n/config";
import { getUi } from "@/i18n/ui";
import { getBlog, getGuideList, pickGuides } from "@/lib/guides";

export const dynamicParams = false;
export const generateStaticParams = () => locales.map((lang) => ({ lang }));

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const blog = await getBlog(lang);
  return { title: { absolute: blog.seoTitle }, description: blog.seoDescription };
}

// Figma: "Blog Poradnik v03" (5172:76810).
export default async function GuidesPage({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const ui = getUi(lang as Locale);
  const [blog, guides] = await Promise.all([getBlog(lang), getGuideList(lang)]);

  // Header: picked guides, or the 4 newest. "Warto przeczytać" is always picked by hand.
  const featured = blog.featured.length ? pickGuides(guides, blog.featured) : guides.slice(0, 4);
  const recommended = pickGuides(guides, blog.recommended);
  // The first 2 header slides are what most visitors see, so the unfiltered list skips them.
  const hidden = featured.slice(0, 2).map((g) => g.slug);
  const popular = pickGuides(guides, blog.popular);

  return (
    <main className="pb-[150px]">
      <BlogHero slides={featured} button={blog.featuredButton} lang={lang} ui={ui} />

      {recommended.length > 0 && (
        <section className="mt-[50px] pt-[100px] pb-[150px]" style={{ backgroundImage: diagonalGradient(887) }}>
          <h2 className="text-center text-h1 leading-[1.2] font-light text-rotenso-grey">{blog.recommendedTitle}</h2>
          <div className="mx-auto mt-[50px] flex w-[1300px] max-w-[calc(100%-32px)] justify-center gap-[20px]">
            {recommended.map((g) => (
              <ArticleBoxLarge key={g.slug} g={g} readLabel={blog.readLabel} />
            ))}
          </div>
        </section>
      )}

      <div className="mx-auto mt-[100px] flex w-[1300px] max-w-[calc(100%-32px)] flex-col items-center gap-[20px] text-center text-rotenso-grey">
        <h2 className="text-h1 leading-[1.2] font-light">{blog.title}</h2>
        <p className="text-[16px] leading-[24px]">{blog.text}</p>
      </div>

      <BlogList guides={guides} hideUnfiltered={hidden} labels={blog} ui={ui} />

      {popular.length > 0 && (
        <section className="mt-[150px] py-[100px]" style={{ backgroundImage: diagonalGradient(692) }}>
          <h2 className="text-center text-h1 leading-[1.2] font-light text-rotenso-grey">{blog.popularTitle}</h2>
          <div className="mx-auto mt-[50px] flex w-[1300px] max-w-[calc(100%-32px)] justify-between gap-[20px]">
            {popular.map((g) => (
              <ArticleBox key={g.slug} g={g} />
            ))}
          </div>
        </section>
      )}

      <RecentlyViewed title={blog.recent.title} text={blog.recent.text} button={blog.recent.button} />
    </main>
  );
}
