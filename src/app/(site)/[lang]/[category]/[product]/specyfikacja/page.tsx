import { ProductBar } from "@/components/product/ProductBar";
import { ProductTopBand } from "@/components/product/ProductHero";
import { Specification } from "@/components/product/Specification";
import { loadProduct, productMetadata, productStaticParams } from "@/lib/productRoute";

export const revalidate = 86400;
export const dynamicParams = false;
export const generateStaticParams = productStaticParams;

type Props = { params: Promise<{ lang: string; category: string; product: string }> };

export async function generateMetadata({ params }: Props) {
  return productMetadata(params, "specyfikacja");
}

export default async function SpecificationPage({ params }: Props) {
  const { lang, page, base, ui } = await loadProduct(params);
  const { entry, variants } = page;
  return (
    <main>
      <ProductTopBand />
      <ProductBar product={entry} base={base} active="specs" ui={ui} lang={lang} />
      <Specification
        name={entry.name}
        variants={variants.map((v) => ({ label: v.label, specs: v.specs, dimensions: v.dimensions }))}
        featureGroups={entry.featureGroups.map((g) => ({ title: g.title, items: g.items.map((i) => ({ name: i.name, tooltip: i.tooltip })) }))}
        ui={ui}
      />
    </main>
  );
}
