import { FramedImage } from "@/components/ui/FramedImage";
import { ProductBar } from "@/components/product/ProductBar";
import { ProductHero } from "@/components/product/ProductHero";
import { Purchase } from "@/components/product/Purchase";
import { loadProduct, productMetadata, productStaticParams } from "@/lib/productRoute";

export const revalidate = 86400;
export const dynamicParams = false;
export const generateStaticParams = productStaticParams;

type Props = { params: Promise<{ lang: string; category: string; product: string }> };

export async function generateMetadata({ params }: Props) {
  return productMetadata(params);
}

// Figma: "Klimatyzacja High Premium v04" (5172:81567) — the product overview page.
export default async function ProductPage({ params }: Props) {
  const { lang, page, base, ui } = await loadProduct(params);
  const { entry, variants } = page;
  const intro = entry.purchaseIntro;
  const gallery = entry.gallery.filter(Boolean) as string[];

  return (
    <main>
      <ProductHero product={entry} lang={lang} ui={ui} categoryHref={`/${lang}/${entry.category}`} />
      <ProductBar product={entry} base={base} active="overview" ui={ui} lang={lang} />

      {/* "Klimatyzacja idealna…" over a blurred photo (Figma 980px); the purchase block overlaps it. */}
      <section id="kup" className="relative mt-[150px] scroll-mt-[160px]">
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
            gallery={gallery.length ? gallery : (variants[0]?.images ?? [])}
            variants={variants.map((v) => ({ label: v.label, price: v.price }))}
            multi={entry.family.canonical ? undefined : entry.family.other}
            siblings={entry.siblings.map((s) => ({ name: s.name, image: s.image, href: s.href }))}
            arHref={entry.arLink.href}
            accessoriesHref={entry.accessoriesLink.href}
            lang={lang}
            ui={ui}
          />
        </div>
      </section>
    </main>
  );
}
