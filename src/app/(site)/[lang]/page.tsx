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
import { getHome, getLatestGuides, getSettings, type HomeContent } from "@/lib/content";
import { getRotensoProducts, setPrice } from "@/lib/productFeed";
import { getInstagramPosts } from "@/lib/instagram";
import { getChannelVideos } from "@/lib/youtube";

// Prices come from the product feed — regenerate the page at most once a day.
export const revalidate = 86400;

// Only the Polish site shows prices. A feed error hides prices instead of breaking the page.
async function loadPrices(lang: Locale, home: HomeContent): Promise<Record<string, number> | undefined> {
  if (lang !== "pl") return undefined;
  try {
    const products = await getRotensoProducts();
    const prices: Record<string, number> = {};
    for (const p of [...home.acHome.products, ...home.acBusiness.products]) {
      const value = p.priceSymbols ? setPrice(products, p.priceSymbols) : null;
      if (value != null) prices[p.priceSymbols] = value;
      else if (p.priceSymbols) console.warn(`[ceny] brak w feedzie: ${p.name} (${p.priceSymbols})`);
    }
    return prices;
  } catch (e) {
    console.error("[ceny] feed niedostępny — ceny ukryte:", (e as Error).message);
    return undefined;
  }
}

// Social Media strip: newest channel videos; the CMS list is the fallback.
async function loadVideos(home: HomeContent) {
  const fallback = home.social.videos;
  if (!home.social.youtubeFeed) return fallback;
  try {
    const videos = await getChannelVideos(home.social.youtubeFeed);
    return videos.length >= 2 ? videos : fallback;
  } catch (e) {
    console.error("[youtube] feed niedostępny — lista z panelu:", (e as Error).message);
    return fallback;
  }
}

// Social Media lower strip: newest Instagram posts; the CMS list is the fallback.
async function loadPosts(home: HomeContent) {
  const fallback = home.social.posts;
  try {
    const posts = await getInstagramPosts();
    return posts.length >= 3 ? posts : fallback;
  } catch (e) {
    console.error("[instagram] feed niedostępny — lista z panelu:", (e as Error).message);
    return fallback;
  }
}

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
  const [prices, videos, posts, latestGuides] = await Promise.all([
    loadPrices(lang as Locale, home),
    loadVideos(home),
    loadPosts(home),
    getLatestGuides(lang as Locale),
  ]);
  // Newest imported guides; languages without guides yet keep the list from the CMS.
  const guides = latestGuides.length ? { ...home.guides, items: latestGuides } : home.guides;

  return (
    <main>
      <HeroSlider slides={home.heroSlides} ui={ui} />
      <Idea idea={home.idea} />
      <AcSlider home={home.acHome} business={home.acBusiness} ui={ui} prices={prices} />
      <Wentilo wentilo={home.wentilo} ui={ui} />
      <HeatPumps data={home.heatPumps} ui={ui} />
      <Rvf rvf={home.rvf} />
      <Guides data={guides} ui={ui} />
      <Installer data={home.installer} lang={lang} ui={ui} />

      <div className="relative mt-[250px]">
        {/* Rectangle 33: backdrop from y 8167, 1156px tall. */}
        <SectionBackdrop top={-100} height={1156} />
        <SocialMedia data={home.social} links={settings.social} videos={videos} posts={posts} />
      </div>
      <Seo seo={home.seo} />
    </main>
  );
}
