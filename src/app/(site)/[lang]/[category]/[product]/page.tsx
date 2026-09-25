import { FramedImage } from "@/components/ui/FramedImage";
import { Advantages } from "@/components/product/Advantages";
import { Faq } from "@/components/product/Faq";
import { FeaturePanel } from "@/components/product/FeaturePanel";
import { FeatureSlider } from "@/components/product/FeatureSlider";
import { IntroVideo } from "@/components/product/IntroVideo";
import { ProductBar } from "@/components/product/ProductBar";
import { ProductHero } from "@/components/product/ProductHero";
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

  return (
    <main className="pb-[151px]">
      <ProductHero product={entry} lang={lang} ui={ui} categoryHref={`/${lang}/${entry.category}`} />
      <ProductBar product={entry} base={base} active="overview" ui={ui} lang={lang} />
      <IntroVideo intro={entry.intro} />
      {entry.feature.show && <FeaturePanel feature={entry.feature} />}
      <FeatureSlider slides={entry.featureSlides.map((s) => ({ image: s.image, title: s.title, text: s.text }))} ui={ui} />
      {entry.splitVsMulti && <SplitVsMulti data={settings.splitVsMulti} />}
      <Advantages
        title={entry.advantages.title}
        items={entry.advantages.items.map((s) => ({ image: s.image, title: s.title, text: s.text }))}
        grid={entry.advantages.grid.map((s) => ({ image: s.image, title: s.title, text: s.text }))}
        ui={ui}
      />

      {/* "Klimatyzacja idealna…" over a blurred photo (Figma 980px); the purchase block overlaps it.
          In Figma the lower row of the Atuty grid reaches 212px into this photo. */}
      <section id="kup" className={`relative scroll-mt-[160px] ${hasGrid ? "-mt-[212px]" : "mt-[150px]"}`}>
        <div className="absolute inset-x-0 top-0 -z-10 h-[980px] overflow-hidden bg-rotenso-grey">
          <FramedImage src={intro.background} sizes="100vw" />
        </div>
        <div className="flex flex-col items-center pt-[362px] text-center font-light text-white">
          <p className="text-h2 leading-[1.2]">{intro.kicker}</p>
          <h2 className="mt-[6px] text-h1 leading-[1.2]">{intro.title}</h2>
          <p className="mt-[20px] w-[860px] max-w-[calc(100%-32px)] text-h3 leading-[normal]">{intro.text}</p>
        </div>
        <div className="mt-[150px]">
          <Purchase
            name={entry.name}
            description={entry.description}
            cmsImages={gallery}
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
