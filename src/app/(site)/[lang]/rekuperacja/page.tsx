import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GREY_BG, Heading } from "@/components/filters/FiltersSections";
import { Faq } from "@/components/product/Faq";
import { FeatureSlider } from "@/components/product/FeatureSlider";
import { QuoteForm } from "@/components/product/QuoteForm";
import { SocialWidget } from "@/components/product/SocialWidget";
import { Button } from "@/components/ui/Button";
import { FramedImage } from "@/components/ui/FramedImage";
import { Media } from "@/components/ui/Media";
import { TileSlider } from "@/components/ui/TileSlider";
import { WentiloAbout, WentiloBar, WentiloControl, WentiloFamily, WentiloMechanical, WentiloRecovery, WentiloShop, WentiloVideos } from "@/components/wentilo/WentiloSections";
import { isLocale, locales, type Locale } from "@/i18n/config";
import { getUi } from "@/i18n/ui";
import { getHome, getSettings, getWentilo } from "@/lib/content";
import { getInstagramPosts } from "@/lib/instagram";
import { getWentiloModels } from "@/lib/wentilo";
import { getVideosByLinks } from "@/lib/youtube";

export const revalidate = 86400;
export const dynamicParams = false;
export const generateStaticParams = () => locales.map((lang) => ({ lang }));

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const data = await getWentilo(lang);
  return { title: { absolute: data.seoTitle }, description: data.seoDescription };
}

async function safe<T>(label: string, run: () => Promise<T>, fallback: T) {
  try {
    return await run();
  } catch (e) {
    console.error(`[${label}]`, (e as Error).message);
    return fallback;
  }
}

// Figma: "Wentilo v04" — the recuperation page (menu: Rekuperacja). The shop section
// ("Wybierz rekuperator": model / area / recovery / control choice + purchase) comes later.
export default async function WentiloPage({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const ui = getUi(lang as Locale);
  const [data, settings, home] = await Promise.all([getWentilo(lang as Locale), getSettings(lang as Locale), getHome(lang as Locale)]);
  const posts = await safe(
    "instagram",
    async () => {
      const p = await getInstagramPosts();
      return p.length >= 3 ? p : home.social.posts;
    },
    home.social.posts,
  );
  const groups = await Promise.all(
    data.videos.groups.map(async (g) => ({
      label: g.label,
      videos: (await safe("youtube", () => getVideosByLinks(g.items), [])).map((v) => ({ id: v.id, href: v.url, image: v.image, title: v.title, text: v.text })),
    })),
  );
  const models = await getWentiloModels(lang as Locale, data.shop.models);
  const { hero, icon, quote } = data;
  // The quote form takes its fields from Settings; this page only swaps texts and photos.
  const quoteData = { ...settings.quoteForm, ...Object.fromEntries(Object.entries(quote).filter(([, v]) => v)) } as typeof settings.quoteForm;

  return (
    <main className="pb-[151px] text-rotenso-grey">
      <section className="relative mx-[50px] mt-[15px] h-[calc(100svh-150px)] min-h-[700px] overflow-hidden rounded-[32px] bg-[#0d1b2a]">
        <Media image={hero.image} video={hero.video || undefined} sizes="100vw" preload />
        <div className="relative mx-auto h-full w-[1300px] max-w-[calc(100%-32px)]">
          <nav aria-label="Breadcrumb" className="absolute top-[95px] left-0 text-[12px] leading-[normal] text-white">
            <Link href={`/${lang}`} className="hover:underline">
              {ui.crumbHome}
            </Link>
            {" / "}
            <Link href={`/${lang}/produkty`} className="hover:underline">
              {ui.crumbProducts}
            </Link>
            {" / "}
            <span aria-current="page">{hero.kicker}</span>
          </nav>
          <div className="absolute top-1/2 left-0 flex w-[530px] -translate-y-1/2 flex-col items-start rounded-[32px] bg-black/50 p-[30px] pb-[50px] text-white backdrop-blur-[20px]">
            <h1 className="font-light">
              <span className="block text-[20px] leading-[normal]">{hero.kicker}</span>{" "}
              <span className="block text-h1 leading-[1.2]">{hero.title}</span>
            </h1>
            {hero.subtitle && <p className="mt-[10px] text-h3 leading-[1.36] font-light">{hero.subtitle}</p>}
            {hero.text && <p className="mt-[10px] text-[16px] leading-[24px]">{hero.text}</p>}
            <div className="mt-[30px] flex gap-[10px]">
              {hero.primary.label && (
                <Button variant="m-red" href={hero.primary.href}>
                  {hero.primary.label}
                </Button>
              )}
              {hero.secondary.label && (
                <Button variant="m-white" href={hero.secondary.href}>
                  {hero.secondary.label}
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      <WentiloBar items={data.bar} lang={lang} ui={ui} />
      <WentiloAbout data={data.about} ui={ui} />
      <WentiloMechanical data={data.mechanical} />

      {/* "Rekuperatory Rotenso Wentilo ICON": the dark band starts behind the cards above. */}
      <div id="zalety" className="relative -mt-[420px] scroll-mt-[80px]">
        <FeatureSlider
          ui={ui}
          slides={icon.slides.map((s) => ({ image: s.image, video: s.video, title: s.title, text: s.text }))}
          background={
            <div key="bg" className="absolute inset-x-0 top-0 -z-10 h-[1060px] overflow-hidden bg-[#1c2833]">
              <FramedImage src={icon.background} sizes="100vw" />
            </div>
          }
          header={
            <div key="header" className="relative flex flex-col items-center pt-[580px] pb-[80px] text-center font-light text-white">
              <h2 className="text-h1 leading-[1.2]">{icon.title}</h2>
              {icon.text && <p className="mt-[10px] w-[1080px] max-w-[calc(100%-32px)] text-h3 leading-[1.36]">{icon.text}</p>}
            </div>
          }
        />
      </div>

      <WentiloRecovery data={data.recovery} />

      {data.more.tiles.length > 0 && (
        <section className={`mt-[100px] pt-[110px] pb-[150px] ${GREY_BG}`}>
          <Heading title={data.more.title} />
          <div className="mt-[50px]">
            <TileSlider ui={ui} tiles={data.more.tiles.map((t) => ({ image: t.image, video: t.video || null, title: t.title, text: t.text }))} />
          </div>
        </section>
      )}

      <div id="opcje-sterowania" className="scroll-mt-[160px]">
        <WentiloControl data={data.control} ui={ui} />
      </div>
      <WentiloFamily data={data.family} />
      <WentiloShop data={data.shop} models={models} ui={ui} />
      <WentiloVideos groups={groups} more={data.videos.more} ui={ui} />
      <SocialWidget title={ui.socialTitle} posts={posts} links={settings.social} />
      <QuoteForm data={quoteData} product="Wentilo ICON" lang={lang} ui={ui} />
      <Faq items={data.faq.map((q) => ({ question: q.question, answer: q.answer }))} ui={ui} numbered />
    </main>
  );
}
