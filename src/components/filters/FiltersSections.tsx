import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { FramedImage } from "@/components/ui/FramedImage";
import type { Ui } from "@/i18n/ui";
import type { FiltersContent } from "@/lib/content";

// Figma: "Akcesoria Filtry Wentilo v02" — sections of the Wentilo filters page.

export const GREY_BG = "bg-[linear-gradient(115deg,#cccccc,#ffffff_50%,#cccccc)]";

export function Heading({ title, text, className = "" }: { title: string; text?: string; className?: string }) {
  return (
    <div className={`mx-auto flex w-[1300px] max-w-[calc(100%-32px)] flex-col items-center gap-[10px] text-center font-light ${className}`}>
      <h2 className="text-h1 leading-[1.2]">{title}</h2>
      {text && <p className="text-h3 leading-[1.36] whitespace-pre-line">{text}</p>}
    </div>
  );
}

// Photo behind the top bar fading into white, breadcrumb, then the 1820×650 hero (r32) with a
// 530-wide dark glass box: title, subtitle, text and the button to the shop section.
export function FiltersHero({ data, lang, ui }: { data: FiltersContent; lang: string; ui: Ui }) {
  const { hero } = data;
  return (
    <section className="relative pt-[156px]">
      <div aria-hidden className="absolute inset-x-0 top-0 -z-10 h-[500px] overflow-hidden bg-[#2c3a44]">
        <FramedImage src={data.background} sizes="100vw" preload className="object-[50%_40%]" />
        <span className="absolute inset-x-0 bottom-0 h-[150px] bg-[linear-gradient(to_bottom,rgb(255_255_255/0),#fff)]" />
      </div>
      <nav aria-label="Breadcrumb" className="absolute top-[112px] left-1/2 w-[1300px] max-w-[calc(100%-32px)] -translate-x-1/2 text-[12px] leading-[normal] text-white">
        <Link href={`/${lang}`} className="hover:underline">
          {ui.crumbHome}
        </Link>
        {" / "}
        <Link href={`/${lang}/produkty`} className="hover:underline">
          {ui.crumbProducts}
        </Link>
        {" / "}
        <Link href={`/${lang}/akcesoria`} className="hover:underline">
          {ui.crumbAccessories}
        </Link>
        {" / "}
        <span aria-current="page">{data.crumb}</span>
      </nav>
      <div className="relative mx-[50px] h-[650px] overflow-hidden rounded-[32px] bg-[#c4c4c4]">
        <FramedImage src={hero.image} sizes="100vw" preload />
        <div className="relative mx-auto h-full w-[1300px] max-w-[calc(100%-32px)]">
          <div className="absolute top-[154px] left-0 flex w-[530px] max-w-full flex-col items-start rounded-[32px] bg-black/50 p-[30px] text-white backdrop-blur-[20px]">
            <h1 className="text-h1 leading-[1.2] font-light">{hero.title}</h1>
            {hero.subtitle && <p className="mt-[10px] text-h3 leading-[1.36] font-light">{hero.subtitle}</p>}
            {hero.text && <p className="mt-[10px] text-[16px] leading-[24px]">{hero.text}</p>}
            {hero.cta.label && (
              <Button variant="m-red" href={hero.cta.href} className="mt-[30px]">
                {hero.cta.label}
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// "Poznaj rodzaje filtrów": three 420-wide columns — photo 236, 40px title, text.
export function FilterTypes({ data }: { data: FiltersContent["types"] }) {
  if (!data.items.length) return null;
  return (
    <section className="mt-[150px] text-rotenso-grey">
      <Heading title={data.title} text={data.text} />
      <div className="mx-auto mt-[50px] flex w-[1300px] max-w-[calc(100%-32px)] flex-wrap justify-center gap-[20px]">
        {data.items.map((t) => (
          <div key={t.title} className="w-[420px]">
            <div className="relative h-[236px] overflow-hidden">
              <FramedImage src={t.image} sizes="420px" />
            </div>
            <h3 className="mt-[30px] px-[30px] text-h2 leading-[1.2] font-light">{t.title}</h3>
            <p className="mt-[20px] px-[30px] text-[16px] leading-[24px] whitespace-pre-line">{t.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// "Dlaczego wymieniać filtry?" on the grey gradient band: three cards — photo (r16), title, text.
export function WhyReplace({ data }: { data: FiltersContent["why"] }) {
  if (!data.items.length) return null;
  return (
    <section className={`mt-[150px] py-[110px] text-rotenso-grey ${GREY_BG}`}>
      <Heading title={data.title} text={data.text} />
      <div className="mx-auto mt-[50px] flex w-[1300px] max-w-[calc(100%-32px)] flex-wrap justify-center gap-[20px]">
        {data.items.map((w) => (
          <div key={w.title} className="w-[420px]">
            <div className="relative h-[236px] overflow-hidden rounded-[16px] bg-[#c4c4c4]">
              <FramedImage src={w.image} sizes="420px" />
            </div>
            <h3 className="mt-[30px] px-[30px] text-h2 leading-[1.2] font-light">{w.title}</h3>
            <p className="mt-[20px] px-[30px] text-[16px] leading-[24px] whitespace-pre-line">{w.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

