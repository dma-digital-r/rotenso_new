import { Icon } from "@/components/ui/Icon";
import { ProductBar } from "@/components/product/ProductBar";
import { ProductTopBand } from "@/components/product/ProductHero";
import { loadProduct, productMetadata, productStaticParams } from "@/lib/productRoute";

export const revalidate = 86400;
export const dynamicParams = false;
export const generateStaticParams = productStaticParams;

type Props = { params: Promise<{ lang: string; product: string }> };

export async function generateMetadata({ params }: Props) {
  return productMetadata(params, "do pobrania");
}

// Figma: "Klimatyzacja High Premium Do Pobrania" (5172:82131) — per capacity a 4-column grid of
// 310×60 buttons; files come from the product feed (<attachments>).
export default async function DownloadsPage({ params }: Props) {
  const { lang, page, base, ui } = await loadProduct(params);
  const { entry, variants } = page;
  return (
    <main>
      <ProductTopBand />
      <ProductBar product={entry} base={base} active="downloads" ui={ui} lang={lang} />
      <div className="mx-auto mt-[50px] w-[1300px] max-w-[calc(100%-32px)] pb-[150px] text-rotenso-grey">
        <h1 className="text-h2 leading-[1.2] font-light">{ui.tabDownloads}</h1>
        {variants.map((v) => (
          <section key={v.label} className="mt-[50px]">
            <h2 className="text-h3 leading-[normal] font-light">
              {entry.name} {v.label}
            </h2>
            {v.documents.length ? (
              <ul className="mt-[20px] grid grid-cols-4 gap-[20px]">
                {v.documents.map((d) => (
                  <li key={d.url}>
                    <a
                      href={d.url}
                      target="_blank"
                      rel="noopener"
                      download
                      title={`${d.label} (${d.ext})`}
                      className="flex h-[60px] items-center gap-[10px] rounded-[8px] border border-rotenso-grey px-[20px] transition-colors hover:bg-grey-f0"
                    >
                      <span className="line-clamp-2 flex-1 text-[16px] leading-[24px]">{d.label}</span>
                      <Icon name="download" width={24} height={24} />
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-[20px] text-[16px] leading-[24px]">{ui.noDownloads}</p>
            )}
          </section>
        ))}
      </div>
    </main>
  );
}
