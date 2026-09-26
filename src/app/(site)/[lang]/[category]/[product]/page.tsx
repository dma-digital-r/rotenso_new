import { diagonalGradient } from "@/components/home/SectionBackdrop";
import { FramedImage } from "@/components/ui/FramedImage";
import { TileSlider } from "@/components/ui/TileSlider";
import { existsSync } from "node:fs";
import path from "node:path";
import { RememberProduct } from "@/components/about/RecentlyViewed";
import { Advantages } from "@/components/product/Advantages";
import { Faq } from "@/components/product/Faq";
import { FeaturePanel } from "@/components/product/FeaturePanel";
import { FeatureSlider } from "@/components/product/FeatureSlider";
import { IntroVideo } from "@/components/product/IntroVideo";
import { ProductBar } from "@/components/product/ProductBar";
import { ProductHero } from "@/components/product/ProductHero";
import { PremiumIntro } from "@/components/product/PremiumIntro";
import { ProductVideos } from "@/components/product/ProductVideos";
import { Purchase } from "@/components/product/Purchase";
import { QuoteForm } from "@/components/product/QuoteForm";
import { SocialWidget } from "@/components/product/SocialWidget";
import { SplitVsMulti } from "@/components/product/SplitVsMulti";
import { getHome, getSettings } from "@/lib/content";
import { getInstagramPosts } from "@/lib/instagram";
import { loadProduct, productMetadata, productStaticParams } from "@/lib/productRoute";
import { getVideosByLinks } from "@/lib/youtube";

export const revalidate = 86400;
export const dynamicParams = false;
export const generateStaticParams = productStaticParams;

type Props = { params: Promise<{ lang: string; category: string; product: string }> };

export async function generateMetadata({ params }: Props) {
  return productMetadata(params);
}

// Newest Instagram posts; the home page's CMS list is the fallback.
async function loadPosts(fallback: readonly { href: string; image: string | null; title?: string }[]) {
  try {
    const posts = await getInstagramPosts();
    return posts.length >= 3 ? posts : fallback;
  } catch (e) {
    console.error("[instagram] feed niedostępny — lista z panelu:", (e as Error).message);
    return fallback;
  }
}

async function loadVideos(items: readonly { url: string; title: string; text: string }[]) {
  try {
    return await getVideosByLinks(items);
  } catch (e) {
    console.error("[youtube] miniatury niedostępne:", (e as Error).message);
    return [];
  }
}

// Figma: "Klimatyzacja High Premium v04" (5172:81567) — the product overview page.
// Sections in Figma order; the vertical gaps are the Figma distances between them.
export default async function ProductPage({ params }: Props) {
  const { lang, page, base, ui } = await loadProduct(params);
  const { entry, variants } = page;
  const [settings, home] = await Promise.all([getSettings(lang), getHome(lang)]);
  const [posts, videos] = await Promise.all([loadPosts(home.social.posts), loadVideos(entry.videos)]);
  const intro = entry.purchaseIntro;
  const gallery = entry.gallery.filter(Boolean) as string[];
  const hasGrid = entry.advantages.grid.length > 0;
  const premium = entry.kind === "ac-premium";
  const slides = entry.featureSlides.map((s) => ({ image: s.image, title: s.title, subtitle: s.subtitle, text: s.text }));
  // "Ostatnio oglądane" card: the menu tile image of this model, else the first feed photo.
  const menuImage = `/images/menu/${page.slug}.png`;
  const thumb = existsSync(path.join(process.cwd(), "public", menuImage)) ? menuImage : (variants[0]?.images[0] ?? null);

  return (
    <main className="pb-[151px]">
      <RememberProduct product={{ href: base, name: entry.name, text: entry.tagline, image: thumb }} />
      <ProductHero product={entry} lang={lang} ui={ui} categoryHref={`/${lang}/${entry.category}`} boxed={premium} />
      <ProductBar product={entry} base={base} active="overview" ui={ui} lang={lang} gap={premium ? 95 : 20} />
      {premium ? (
        // Premium (Figma "Klimatyzacja Premium v02"): intro and feature panel merged into one
        // section, then feature tiles (970/310) on the grey-white gradient.
        <>
          <PremiumIntro intro={entry.intro} slides={slides} ui={ui} />
          {entry.featureTiles.length > 0 && (
            <section className="relative mt-[150px]">
              <div aria-hidden className="absolute inset-x-0 -top-[592px] -z-10 h-[864px]" style={{ backgroundImage: diagonalGradient(864) }} />
              <TileSlider ui={ui} tiles={entry.featureTiles.map((t) => ({ image: t.image, title: t.title, text: t.text }))} />
            </section>
          )}
        </>
      ) : (
        <>
          <IntroVideo intro={entry.intro} />
          {entry.feature.show && <FeaturePanel feature={entry.feature} />}
          <FeatureSlider slides={slides} ui={ui} />
        </>
      )}
      {entry.splitVsMulti && <SplitVsMulti data={settings.splitVsMulti} />}
      <Advantages
        title={entry.advantages.title}
        items={entry.advantages.items.map((s) => ({ image: s.image, title: s.title, text: s.text }))}
        grid={entry.advantages.grid.map((s) => ({ image: s.image, title: s.title, text: s.text }))}
        bird={!premium}
        ui={ui}
      />

      {/* "Klimatyzacja idealna…" over a blurred photo (Figma 980px); the purchase block overlaps it.
          In Figma the lower row of the Atuty grid reaches 212px into this photo. */}
      <section id="kup" className={`relative scroll-mt-[160px] ${hasGrid && !premium ? "-mt-[212px]" : "mt-[150px]"}`}>
        <div className="absolute inset-x-0 top-0 -z-10 h-[980px] overflow-hidden bg-rotenso-grey">
          <FramedImage src={intro.background} sizes="100vw" />
        </div>
        {premium ? (
          // Premium: big title, 25px subtitle, 16px paragraph; the purchase block starts 500px down.
          <div className="flex h-[500px] flex-col items-center pt-[155px] text-center font-light text-white">
            <h2 className="text-h1 leading-[1.2]">{intro.title}</h2>
            <p className="mt-[10px] text-h3 leading-[1.36]">{intro.kicker}</p>
            <p className="mt-[20px] w-[860px] max-w-[calc(100%-32px)] text-[16px] leading-[24px] font-normal">{intro.text}</p>
          </div>
        ) : (
          <div className="flex flex-col items-center pt-[362px] text-center font-light text-white">
            <p className="text-h2 leading-[1.2]">{intro.kicker}</p>
            <h2 className="mt-[6px] text-h1 leading-[1.2]">{intro.title}</h2>
            <p className="mt-[20px] w-[860px] max-w-[calc(100%-32px)] text-h3 leading-[normal]">{intro.text}</p>
          </div>
        )}
        <div className={premium ? "" : "mt-[150px]"}>
          <Purchase
            name={entry.name}
            description={entry.description}
            cmsImages={gallery}
            packshot={entry.packshot}
            variants={variants.map((v) => ({ label: v.label, price: v.price, images: v.images }))}
            multi={entry.family.canonical ? undefined : entry.family.other}
            siblings={entry.siblings.map((s) => ({ name: s.name, image: s.image, href: s.href }))}
            arHref={entry.arLink.href}
            accessoriesHref={entry.accessoriesLink.href}
            lang={lang}
            ui={ui}
          />
        </div>
      </section>

      <ProductVideos
        videos={videos.map((v) => ({ id: v.id, href: v.url, image: v.image, title: v.title, text: v.text }))}
        channelHref={settings.social.youtube}
        ui={ui}
      />
      <SocialWidget title={ui.socialTitle} posts={posts} links={settings.social} />
      <QuoteForm data={settings.quoteForm} product={entry.name} lang={lang} ui={ui} />
      <Faq items={entry.faq.map((q) => ({ question: q.question, answer: q.answer }))} ui={ui} />
    </main>
  );
}
