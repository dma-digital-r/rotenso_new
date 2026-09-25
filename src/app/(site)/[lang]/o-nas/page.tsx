import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AboutHero, Career, Certificates, Company, ContactCta, Heading, International, Mission, Production, Stats } from "@/components/about/AboutSections";
import { RecentlyViewed } from "@/components/about/RecentlyViewed";
import { Timeline } from "@/components/about/Timeline";
import { Guides } from "@/components/home/Guides";
import { FramedImage } from "@/components/ui/FramedImage";
import { TileSlider } from "@/components/ui/TileSlider";
import { isLocale, locales, type Locale } from "@/i18n/config";
import { getUi } from "@/i18n/ui";
import { getAbout, getLatestGuides, getSettings } from "@/lib/content";

export const dynamicParams = false;
export const generateStaticParams = () => locales.map((lang) => ({ lang }));

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const about = await getAbout(lang);
  return { title: { absolute: about.seoTitle }, description: about.seoDescription };
}

// Figma: "O nas v03" (5172:76530).
export default async function AboutPage({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const ui = getUi(lang as Locale);
  const [about, settings, guides] = await Promise.all([getAbout(lang), getSettings(lang), getLatestGuides(lang as Locale)]);
  const { ecosystem } = about;

  return (
    <main>
      <AboutHero data={about.hero} lang={lang} ui={ui} />
      <Stats items={about.stats} />
      <Company data={about.company} ui={ui} />

      {/* "Kompleksowy ekosystem": 1121px photo that starts 392px under the top of the company box. */}
      <section className="relative pt-[128px]">
        <div className="absolute inset-x-0 -top-[392px] h-[1121px] overflow-hidden bg-rotenso-grey">
          <FramedImage src={ecosystem.background} sizes="100vw" />
          <span className="absolute inset-0 bg-black/20" />
        </div>
        <Heading title={ecosystem.title} text={ecosystem.text} white className="relative" />
        <div className="relative mt-[150px]">
          <TileSlider
            ui={ui}
            tiles={ecosystem.tiles.map((t) => ({ image: t.image, title: t.title, text: t.text, cta: t.cta }))}
          />
        </div>
      </section>

      <Production data={about.production} ui={ui} />
      <Mission data={about.mission} />
      <International data={about.international} />
      <Timeline data={about.timeline} ui={ui} />
      <Guides boxed data={{ ...about.articles, items: guides }} ui={ui} />
      <Certificates data={about.certificates} />
      <Career data={about.career} />

      <section className="mt-[150px] text-rotenso-grey">
        <div className="mx-auto flex w-[1300px] max-w-[calc(100%-32px)] flex-col items-center gap-[20px] text-center">
          <div className="flex flex-col items-center gap-[10px] font-light">
            <p className="text-h3 leading-[1.36]">{about.showroom.kicker}</p>
            <h2 className="text-h1 leading-[1.2]">{about.showroom.title}</h2>
          </div>
          <p className="w-[960px] max-w-full text-[16px] leading-[24px]">{about.showroom.text}</p>
        </div>
        <div className="mt-[50px]">
          <TileSlider ui={ui} tiles={about.showroom.images.map((i) => ({ image: i.image, title: i.title }))} />
        </div>
      </section>

      <RecentlyViewed title={about.recent.title} text={about.recent.text} button={about.recent.button} />
      <ContactCta data={about.contact} settings={settings} />
    </main>
  );
}
