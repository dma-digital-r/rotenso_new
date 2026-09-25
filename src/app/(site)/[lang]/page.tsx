import type { Metadata } from "next";
import { AcSlider } from "@/components/home/AcSlider";
import { Guides } from "@/components/home/Guides";
import { HeatPumps } from "@/components/home/HeatPumps";
import { HeroSlider } from "@/components/home/HeroSlider";
import { Idea } from "@/components/home/Idea";
import { Installer } from "@/components/home/Installer";
import { Rvf } from "@/components/home/Rvf";
import { SectionBackdrop } from "@/components/home/SectionBackdrop";
import { Seo } from "@/components/home/Seo";
import { SocialMedia } from "@/components/home/SocialMedia";
import { Wentilo } from "@/components/home/Wentilo";
import type { Locale } from "@/i18n/config";
import { getUi } from "@/i18n/ui";
import { getHome, getSettings } from "@/lib/content";

export async function generateMetadata({ params }: PageProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  const home = await getHome(lang as Locale);
  return {
    title: { absolute: home.seoTitle || "Rotenso" },
    description: home.seoDescription,
  };
}

// Figma: "Main Page v09" (5172:70322), 1920×11007. Vertical gaps below follow the frame's y coordinates.
export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  const [home, settings] = await Promise.all([getHome(lang as Locale), getSettings(lang as Locale)]);
  const ui = getUi(lang as Locale);

  return (
    <main>
      <HeroSlider slides={home.heroSlides} ui={ui} />
      <Idea idea={home.idea} />
      <AcSlider home={home.acHome} business={home.acBusiness} ui={ui} />
      <Wentilo wentilo={home.wentilo} ui={ui} />
      <HeatPumps data={home.heatPumps} ui={ui} />
      <Rvf rvf={home.rvf} />
      <Guides data={home.guides} ui={ui} />
      <Installer data={home.installer} lang={lang} ui={ui} />

      <div className="relative mt-[250px]">
        {/* Rectangle 33: backdrop from y 8167, 1156px tall. */}
        <SectionBackdrop top={-100} height={1156} />
        <SocialMedia data={home.social} links={settings.social} />
      </div>
      <Seo seo={home.seo} />
    </main>
  );
}
