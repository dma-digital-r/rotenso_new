import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FilterShop, FilterVideo } from "@/components/filters/FiltersInteractive";
import { FilterTypes, FiltersHero, GREY_BG, Heading, WhyReplace } from "@/components/filters/FiltersSections";
import { Faq } from "@/components/product/Faq";
import { TileSlider } from "@/components/ui/TileSlider";
import { isLocale, locales, type Locale } from "@/i18n/config";
import { getUi } from "@/i18n/ui";
import { getFilters } from "@/lib/content";

export const dynamicParams = false;
export const generateStaticParams = () => locales.map((lang) => ({ lang }));

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const data = await getFilters(lang);
  return { title: { absolute: data.seoTitle }, description: data.seoDescription };
}

// Figma: "Akcesoria Filtry Wentilo v02" — opened from the menu (Rekuperacja → Filtry Wentilo).
export default async function FiltersPage({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const ui = getUi(lang as Locale);
  const data = await getFilters(lang);

  return (
    <main className="pb-[150px] text-rotenso-grey">
      <FiltersHero data={data} lang={lang} ui={ui} />
      <FilterTypes data={data.types} />

      {data.advantages.tiles.length > 0 && (
        <section className="mt-[150px]">
          <Heading title={data.advantages.title} text={data.advantages.text} />
          <div className="mt-[50px]">
            <TileSlider ui={ui} tiles={data.advantages.tiles.map((t) => ({ image: t.image, video: t.video || null, title: t.title, text: t.text }))} />
          </div>
        </section>
      )}

      <WhyReplace data={data.why} />
      <FilterShop data={data.shop} />

      {(data.video.poster || data.video.url) && (
        <section className={`mt-[150px] py-[110px] ${GREY_BG}`}>
          <Heading title={data.video.title} text={data.video.text} />
          <FilterVideo data={data.video} ui={ui} />
        </section>
      )}

      <Faq items={data.faq.map((q) => ({ question: q.question, answer: q.answer }))} ui={ui} button={null} numbered />
    </main>
  );
}
