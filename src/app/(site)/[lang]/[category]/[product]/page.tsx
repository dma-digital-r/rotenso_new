import { diagonalGradient } from "@/components/home/SectionBackdrop";
import { FramedImage } from "@/components/ui/FramedImage";
import { TileSlider } from "@/components/ui/TileSlider";
import { existsSync } from "node:fs";
import Link from "next/link";
import path from "node:path";
import { RememberProduct } from "@/components/about/RecentlyViewed";
import { Advantages } from "@/components/product/Advantages";
import { Alternatives, Benefits, FeatureRows } from "@/components/product/BasicSections";
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
  const slides = entry.featureSlides.map((s) => ({ image: s.image, video: s.video, title: s.title, subtitle: s.subtitle, text: s.text }));
  // "Ostatnio oglądane" card: the menu tile image of this model, else the first feed photo.
  const menuImage = `/images/menu/${page.slug}.png`;
  const thumb = existsSync(path.join(process.cwd(), "public", menuImage)) ? menuImage : (variants[0]?.images[0] ?? null);

  const basic = entry.kind === "ac-basic";
  const purchase = (
    <Purchase
      label={basic ? entry.categoryLabel : undefined}
      headingLevel={basic ? "h1" : "h2"}
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
  );
  const tiles = entry.featureTiles.map((t) => ({ image: t.image, video: t.video, title: t.title, text: t.text }));
  const advantages = (
    <Advantages
      title={entry.advantages.title}
      items={entry.advantages.items.map((s) => ({ image: s.image, video: s.video, title: s.title, text: s.text }))}
      grid={entry.advantages.grid.map((s) => ({ image: s.image, title: s.title, text: s.text }))}
      bird={!premium && !basic}
      autoplay={premium || basic}
      ui={ui}
    />
  );
  const tail = (
    <>
      <SocialWidget title={ui.socialTitle} posts={posts} links={settings.social} />
      <QuoteForm data={settings.quoteForm} product={entry.name} lang={lang} ui={ui} />
      <Faq items={entry.faq.map((q) => ({ question: q.question, answer: q.answer }))} ui={ui} />
    </>
  );
  const multimedia = (
    <ProductVideos
      videos={videos.map((v) => ({ id: v.id, href: v.url, image: v.image, title: v.title, text: v.text }))}
      channelHref={settings.social.youtube}
      ui={ui}
    />
  );

  if (basic) {
    // Figma "Klimatyzacja Basic v02": no hero. The page opens with the purchase block on a photo
    // that fades to white; then a rounded box with the product bar, title and feature tiles
    // (reaching below the box), films with text on a dark band, Split / Multi, "Dodatkowe
    // zalety", Multimedia, "Warto rozważyć", Social Media, quote form, FAQ.
    return (
      <main className="pb-[151px]">
        <RememberProduct product={{ href: base, name: entry.name, text: entry.tagline, image: thumb }} />
        <section id="kup" className="relative pt-[156px]">
          <div className="absolute inset-x-0 top-0 -z-10 h-[892px] overflow-hidden">
            <FramedImage src={intro.background} sizes="100vw" preload />
            <span className="absolute inset-0 bg-[linear-gradient(to_bottom,rgb(255_255_255/0)_35%,#ffffff_75%)]" />
          </div>
          <nav aria-label="Breadcrumb" className="absolute top-[110px] left-1/2 w-[1300px] max-w-[calc(100%-32px)] -translate-x-1/2 text-[12px] leading-[normal] text-white">
            <Link href={`/${lang}`} className="hover:underline">
              {ui.crumbHome}
            </Link>
            {" / "}
            <Link href={`/${lang}/produkty`} className="hover:underline">
              {ui.crumbProducts}
            </Link>
            {" / "}
            <Link href={`/${lang}/${entry.category}`} className="hover:underline">
              {entry.categoryLabel}
            </Link>
            {" / "}
            <span aria-current="page">{entry.name}</span>
          </nav>
          {purchase}
        </section>

        <ProductBar product={entry} base={base} active="overview" ui={ui} lang={lang} gap={231} />
        <section id="intro-video" className="relative -mt-[131px] scroll-mt-[85px]">
          <div className="relative mx-[50px] h-[895px] overflow-hidden rounded-[32px] bg-grey-f0">
            <FramedImage src={entry.intro.image} sizes="100vw" />
            <div className="relative mx-auto flex w-[1300px] max-w-[calc(100%-32px)] flex-col items-center pt-[255px] text-center font-light text-rotenso-grey">
              <h2 className="text-h1 leading-[1.2]">{entry.intro.title}</h2>
              {entry.intro.text && <p className="mt-[10px] text-h3 leading-[1.36]">{entry.intro.text}</p>}
              {entry.intro.body && <p className="mt-[30px] w-[860px] max-w-full text-[16px] leading-[24px] font-normal whitespace-pre-line">{entry.intro.body}</p>}
            </div>
          </div>
          {tiles.length > 0 && (
            <div className="relative -mt-[273px]">
              <TileSlider ui={ui} tiles={tiles} />
            </div>
          )}
        </section>

        <FeatureRows rows={entry.featureRows.map((r) => ({ image: r.image, video: r.video, title: r.title, text: r.text }))} ui={ui} />
        {entry.splitVsMulti && <SplitVsMulti data={settings.splitVsMulti} />}
        <Benefits title={entry.benefits.title} items={entry.benefits.items.map((b) => ({ image: b.image, title: b.title, text: b.text }))} />
        {advantages}
        {multimedia}
        <Alternatives
          title={entry.alternatives.title}
          text={entry.alternatives.text}
          items={entry.alternatives.items.map((a) => ({ kicker: a.kicker, name: a.name, text: a.text, image: a.image, href: a.href }))}
        />
        {tail}
      </main>
    );
  }

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
          {tiles.length > 0 && (
            <section className="relative mt-[150px]">
              <div aria-hidden className="absolute inset-x-0 -top-[592px] -z-10 h-[864px]" style={{ backgroundImage: diagonalGradient(864) }} />
              <TileSlider ui={ui} tiles={tiles} />
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
      {advantages}

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
        <div className={premium ? "" : "mt-[150px]"}>{purchase}</div>
      </section>

      {multimedia}
      {tail}
    </main>
  );
}
