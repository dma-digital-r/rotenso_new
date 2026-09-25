import type { Metadata } from "next";
import { AcSlider } from "@/components/home/AcSlider";
import { Guides } from "@/components/home/Guides";
import { HeatPumps } from "@/components/home/HeatPumps";
import { HeroSlider } from "@/components/home/HeroSlider";
import { Idea } from "@/components/home/Idea";
import { Installer } from "@/components/home/Installer";
import { PendingSection } from "@/components/home/PendingSection";
import { Rvf } from "@/components/home/Rvf";
import { Wentilo } from "@/components/home/Wentilo";
import type { Locale } from "@/i18n/config";
import { getHome } from "@/lib/content";

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
  const home = await getHome(lang as Locale);

  return (
    <main>
      <HeroSlider slides={home.heroSlides} />
      <Idea idea={home.idea} />
      <AcSlider home={home.acHome} business={home.acBusiness} />
      <Wentilo wentilo={home.wentilo} />
      <HeatPumps data={home.heatPumps} />
      <Rvf rvf={home.rvf} />
      <Guides data={home.guides} />
      <Installer data={home.installer} lang={lang} />

      <div className="relative mt-[250px]">
        {/* Rectangle 33: backdrop from y 8167, 1156px tall. */}
        <div className="bg-section-fade absolute inset-x-0 top-[-100px] -z-10 h-[1156px]" />
        <PendingSection label="Sekcja „Odkryj nas na Social Media” — czeka na dane z Figmy" height={956} fullBleed />
      </div>
      <PendingSection
        label="Sekcja SEO „Rotenso — Innowacyjne systemy HVAC” — czeka na dane z Figmy"
        height={1080}
        className="mt-[100px]"
        fullBleed
      />
    </main>
  );
}
