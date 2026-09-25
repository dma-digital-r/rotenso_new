import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { FramedImage } from "@/components/ui/FramedImage";
import type { Ui } from "@/i18n/ui";
import type { ProductEntry } from "@/lib/products";

// Figma: "Header" of "Klimatyzacja High Premium v04" (5172:81724) — full-bleed photo
// (1030px at 1080 → 100svh − 50px), breadcrumb under the top bar, centred glass panel.
export function ProductHero({
  product,
  lang,
  ui,
  categoryHref,
}: {
  product: ProductEntry;
  lang: string;
  ui: Ui;
  categoryHref: string;
}) {
  return (
    <section className="relative h-[calc(100svh-50px)] min-h-[600px] overflow-hidden">
      <FramedImage src={product.heroImage} alt={product.name} sizes="100vw" preload />
      <div className="relative mx-auto h-full w-[1300px] max-w-[calc(100%-32px)]">
        <nav aria-label="Breadcrumb" className="absolute top-[110px] left-0 text-[12px] leading-[normal] text-white">
          <Link href={`/${lang}`} className="hover:underline">
            {ui.crumbHome}
          </Link>
          {" / "}
          <Link href={`/${lang}/produkty`} className="hover:underline">
            {ui.crumbProducts}
          </Link>
          {" / "}
          <Link href={categoryHref} className="hover:underline">
            {product.categoryLabel}
          </Link>
          {" / "}
          <span aria-current="page">{product.name}</span>
        </nav>

        <div className="absolute top-1/2 left-0 flex w-[530px] -translate-y-1/2 flex-col gap-[30px] rounded-[32px] bg-black/50 px-[30px] pt-[30px] pb-[50px] text-white backdrop-blur-[20px]">
          <div className="flex flex-col gap-[10px] font-light">
            <div>
              <p className="text-[20px] leading-[normal]">{product.categoryLabel}</p>
              <h1 className="text-h1 leading-[1.2]">{product.name}</h1>
            </div>
            <p className="text-h3 leading-[normal]">{product.tagline}</p>
          </div>
          <div className="flex items-start gap-[10px]">
            <Button variant="m-red" href="#wycena">
              {ui.askInstall}
            </Button>
            <Button variant="m-white" href={`/${lang}/znajdz-instalatora`}>
              {ui.findInstaller}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

// Subpages (Specyfikacja, Do pobrania): a 120px photo band behind the top bar (Figma "Top BG").
export function ProductTopBand() {
  return (
    <div className="relative h-[120px] overflow-hidden bg-rotenso-grey">
      <FramedImage src="/images/products/top-band.jpg" sizes="100vw" preload />
    </div>
  );
}
