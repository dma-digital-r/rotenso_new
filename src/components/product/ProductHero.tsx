import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { FramedImage, MissingMedia } from "@/components/ui/FramedImage";
import type { Ui } from "@/i18n/ui";
import type { ProductEntry } from "@/lib/products";

// Figma: "Header" of "Klimatyzacja High Premium v04" (5172:81724) — full-bleed photo
// (1030px at 1080 → 100svh − 50px), breadcrumb under the top bar, centred glass panel.
export function ProductHero({
  product,
  lang,
  ui,
  categoryHref,
  boxed = false,
  kicker,
  rvf = false,
}: {
  product: ProductEntry;
  lang: string;
  ui: Ui;
  categoryHref: string;
  /** Premium: rounded 1820-wide box like the home hero (Figma "Klimatyzacja Premium v02"). */
  boxed?: boolean;
  /** Small line above the name inside the H1 (see productHeading). */
  kicker?: string;
  /** RVF outdoor units (Figma "Inwestycje Produkt v03"): 930px box, subtitle + text, one button. */
  rvf?: boolean;
}) {
  return (
    <section
      className={
        rvf
          ? "relative mx-[50px] mt-[15px] h-[calc(100svh-150px)] min-h-[700px] overflow-hidden rounded-[32px] bg-rotenso-grey"
          : boxed
            ? "relative mx-[50px] mt-[15px] h-[calc(100svh-30px)] min-h-[560px] overflow-hidden rounded-[32px] bg-rotenso-grey"
            : "relative h-[calc(100svh-50px)] min-h-[600px] overflow-hidden"
      }
    >
      {/* The hero is a film (muted, looping); the photo is its poster and the fallback. */}
      {product.heroVideo ? (
        <video
          src={product.heroVideo}
          poster={product.heroImage ?? undefined}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="absolute inset-0 size-full object-cover"
        />
      ) : product.heroImage ? (
        <FramedImage
          src={product.heroImage}
          alt={product.name}
          sizes="100vw"
          preload
        />
      ) : (
        <MissingMedia label="Film / zdjęcie hero — do dodania w panelu" />
      )}
      <div className="relative mx-auto h-full w-[1300px] max-w-[calc(100%-32px)]">
        <nav
          aria-label="Breadcrumb"
          className={`absolute ${boxed || rvf ? "top-[95px]" : "top-[110px]"} left-0 text-[12px] leading-[normal] text-white`}
        >
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

        {rvf ? (
          <div className="absolute top-1/2 left-0 flex w-[530px] -translate-y-1/2 flex-col items-start rounded-[32px] bg-black/50 p-[30px] text-white backdrop-blur-[20px]">
            <h1 className="font-light">
              <span className="block text-[20px] leading-[normal]">
                {kicker ?? product.categoryLabel}
              </span>{" "}
              <span className="block text-h1 leading-[1.2]">
                {product.name}
              </span>
            </h1>
            {product.tagline && (
              <p className="mt-[10px] text-h3 leading-[1.36] font-light">
                {product.tagline}
              </p>
            )}
            {product.description && (
              <p className="mt-[10px] text-[16px] leading-[24px] whitespace-pre-line">
                {product.description}
              </p>
            )}
            <Button variant="m-red" href="#kontakt" className="mt-[30px]">
              {ui.askProduct}
            </Button>
          </div>
        ) : (
          <div className="absolute top-1/2 left-0 flex w-[530px] -translate-y-1/2 flex-col gap-[30px] rounded-[32px] bg-black/50 px-[30px] pt-[30px] pb-[50px] text-white backdrop-blur-[20px]">
            <div className="flex flex-col gap-[10px] font-light">
              <h1>
                <span className="block text-[20px] leading-[normal]">
                  {kicker ?? product.categoryLabel}
                </span>{" "}
                <span className="block text-h1 leading-[1.2]">
                  {product.name}
                </span>
              </h1>
              {/* Premium: a 16px paragraph instead of the 25px slogan. */}
              <p
                className={
                  boxed
                    ? "text-[16px] leading-[24px] font-normal"
                    : "text-h3 leading-[normal]"
                }
              >
                {product.tagline}
              </p>
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
        )}
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
