"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { FramedImage, MissingMedia } from "@/components/ui/FramedImage";
import { Media } from "@/components/ui/Media";
import { SliderBar } from "@/components/ui/SliderBar";
import type { Ui } from "@/i18n/ui";
import type { InvestmentsContent } from "@/lib/content";

// Figma: "Inwestycje v06" (5172:75884) — sections of the Systemy RVF / investments page.

export function InvestmentHero({ data, lang, ui }: { data: InvestmentsContent["hero"]; lang: string; ui: Ui }) {
  return (
    <section className="relative mx-[50px] mt-[15px] h-[calc(100svh-30px)] min-h-[560px] overflow-hidden rounded-[32px] bg-rotenso-grey">
      <Media image={data.image} video={data.video} sizes="100vw" preload />
      <div className="relative mx-auto h-full w-[1300px] max-w-[calc(100%-32px)]">
        <nav aria-label="Breadcrumb" className="absolute top-[95px] left-0 text-[12px] leading-[normal] text-white">
          <Link href={`/${lang}`} className="hover:underline">
            {ui.crumbHome}
          </Link>
          {" / "}
          <Link href={`/${lang}/produkty`} className="hover:underline">
            {ui.crumbProducts}
          </Link>
          {" / "}
          <span aria-current="page">{data.title}</span>
        </nav>
        <div className="absolute top-[calc(50%+35px)] left-0 flex w-[530px] -translate-y-1/2 flex-col items-start gap-[30px] rounded-[32px] bg-black/50 px-[30px] pt-[30px] pb-[40px] text-white backdrop-blur-[20px]">
          <div className="flex flex-col gap-[10px]">
            <div className="font-light">
              <h1 className="text-h1 leading-[1.2]">{data.title}</h1>
              {data.subtitle && <p className="text-h3 leading-[1.36]">{data.subtitle}</p>}
            </div>
            <p className="text-[16px] leading-[24px]">{data.text}</p>
          </div>
          {data.cta.label && (
            <Button variant="m-red" href={data.cta.href}>
              {data.cta.label}
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}

const CARD = 310;
const STEP = CARD + 20;

// "Nasze realizacje": kingfisher on the right, title, category pills (grey bar, active dark),
// 310×485 photo cards scrolling sideways (dark fade + title; "+" shows the description).
export function Projects({ data, ui }: { data: InvestmentsContent["projects"]; ui: Ui }) {
  const [cat, setCat] = useState(0);
  const [open, setOpen] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
  const track = useRef<HTMLDivElement>(null);
  const items = data.categories[cat]?.items ?? [];
  if (!data.categories.length) return null;

  const update = () => {
    const el = track.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setProgress(max > 0 ? el.scrollLeft / max : 0);
  };
  const choose = (i: number) => {
    setCat(i);
    setOpen(null);
    track.current?.scrollTo({ left: 0 });
    setProgress(0);
  };

  return (
    <section className="relative mt-[221px] text-rotenso-grey">
      <Image
        src="/images/investments/kingfisher-right.png"
        alt=""
        width={350}
        height={350}
        sizes="350px"
        className="pointer-events-none absolute -top-[267px] left-[calc(50%+470px)] drop-shadow-[50px_50px_25px_rgba(0,0,0,0.25)]"
      />
      <div className="mx-auto flex w-[1300px] max-w-[calc(100%-32px)] flex-col items-center gap-[10px] text-center">
        <h2 className="text-h1 leading-[1.2] font-light">{data.title}</h2>
        {data.subtitle && <p className="text-h3 leading-[1.36] font-light">{data.subtitle}</p>}
        {data.text && <p className="text-[16px] leading-[24px]">{data.text}</p>}
      </div>

      <div role="tablist" className="mx-auto mt-[50px] flex h-[50px] w-[1300px] max-w-[calc(100%-32px)] items-center justify-between rounded-[25px] bg-grey-f0 px-[5px]">
        {data.categories.map((c, i) => (
          <button
            key={c.name}
            type="button"
            role="tab"
            aria-selected={i === cat}
            onClick={() => choose(i)}
            className={`h-[40px] flex-1 cursor-pointer rounded-[20px] text-[16px] leading-[normal] transition-colors ${i === cat ? "bg-rotenso-grey text-white" : "hover:text-rotenso-red"}`}
          >
            {c.name}
          </button>
        ))}
      </div>

      <div
        ref={track}
        onScroll={update}
        className="mt-[50px] -mb-[60px] flex snap-x snap-mandatory scroll-px-[max(16px,calc((100%-1300px)/2))] gap-[20px] overflow-x-auto px-[max(16px,calc((100%-1300px)/2))] pb-[60px] scrollbar-none"
      >
        {items.map((it, i) => {
          const shown = open === i;
          return (
            <div key={`${cat}-${i}`} className="relative h-[485px] w-[310px] shrink-0 snap-start overflow-hidden rounded-[32px] bg-grey-dd shadow-dark-l">
              <FramedImage src={it.image} sizes="310px" />
              <span className="absolute inset-0 bg-[linear-gradient(to_top,rgb(0_0_0/0.6),rgb(0_0_0/0)_45%)]" />
              <h3 className="absolute inset-x-[20px] bottom-[30px] text-center text-h3 leading-[1.36] font-light text-white">{it.title}</h3>
              {it.text && (
                <>
                  <div className={`absolute inset-0 flex items-end bg-black/50 p-[30px] pb-[90px] text-[16px] leading-[24px] text-white backdrop-blur-[20px] transition-opacity ${shown ? "opacity-100" : "pointer-events-none opacity-0"}`}>
                    {it.text}
                  </div>
                  <button
                    type="button"
                    onClick={() => setOpen(shown ? null : i)}
                    aria-expanded={shown}
                    aria-label={shown ? ui.close : ui.moreInfo}
                    className="absolute top-[20px] right-[20px] size-[30px] cursor-pointer rounded-full bg-white transition-transform hover:scale-105"
                  >
                    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" aria-hidden className={`transition-transform ${shown ? "rotate-45" : ""}`}>
                      <path d="M15 9V21M9 15H21" stroke="#546670" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </button>
                </>
              )}
            </div>
          );
        })}
      </div>
      <div className="mx-auto mt-[35px] w-[1300px] max-w-[calc(100%-32px)]">
        <SliderBar
          progress={progress}
          thumbWidth={Math.max(130, 1190 / Math.max(1, items.length / 4))}
          onPrev={() => track.current?.scrollBy({ left: -STEP, behavior: "smooth" })}
          onNext={() => track.current?.scrollBy({ left: STEP, behavior: "smooth" })}
          prevDisabled={progress <= 0.001}
          nextDisabled={progress >= 0.999}
          labels={{ prev: ui.prev, next: ui.next }}
        />
      </div>
    </section>
  );
}

// Three 420-wide cards: photo 236 (r16), centred 25px title and short text.
export function WhyUs({ items }: { items: InvestmentsContent["why"] }) {
  if (!items.length) return null;
  return (
    <section className="mx-auto mt-[250px] flex w-[1300px] max-w-[calc(100%-32px)] justify-center gap-[20px] text-center text-rotenso-grey">
      {items.map((w) => (
        <div key={w.title} className="flex w-[420px] flex-col items-center">
          <div className="relative h-[236px] w-full overflow-hidden rounded-[16px] bg-[#c4c4c4]">
            <FramedImage src={w.image} sizes="420px" />
          </div>
          <h3 className="mt-[40px] text-h3 leading-[1.36] font-light">{w.title}</h3>
          <p className="mt-[10px] w-[320px] text-[16px] leading-[24px]">{w.text}</p>
        </div>
      ))}
    </section>
  );
}

// "Nasze rozwiązania": second kingfisher top-left, title; below a 310-wide list of segments
// (icon + name, active dark), a divider, the segment's big title, text and recommended product,
// and the 770×770 photo on the right.
export function Solutions({ data }: { data: InvestmentsContent["solutions"] }) {
  const [active, setActive] = useState(Math.min(1, data.segments.length - 1));
  const seg = data.segments[active];
  if (!seg) return null;
  return (
    <section className="relative mt-[250px] pt-[221px] pb-[150px] text-rotenso-grey">
      <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(115deg,#cccccc,#ffffff_50%,#cccccc)]" />
      <Image
        src="/images/investments/kingfisher-left.png"
        alt=""
        width={350}
        height={350}
        sizes="350px"
        className="pointer-events-none absolute top-[14px] left-[121px] drop-shadow-[50px_50px_25px_rgba(0,0,0,0.25)]"
      />
      <div className="mx-auto flex w-[1300px] max-w-[calc(100%-32px)] flex-col items-center gap-[10px] text-center font-light">
        <h2 className="text-h1 leading-[1.2]">{data.title}</h2>
        {data.text && <p className="text-h3 leading-[1.36] whitespace-pre-line">{data.text}</p>}
      </div>

      <div className="mt-[180px] flex gap-[50px] px-[50px]">
        <ul className="flex w-[310px] shrink-0 flex-col gap-[5px]">
          {data.segments.map((s, i) => (
            <li key={s.name}>
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-pressed={i === active}
                className={`flex min-h-[50px] w-full cursor-pointer items-center gap-[15px] rounded-[8px] px-[20px] py-[10px] text-left text-[16px] leading-[21.8px] transition-colors ${
                  i === active ? "bg-rotenso-grey text-white" : "hover:bg-white/60"
                }`}
              >
                {s.icon ? (
                  <Image src={s.icon} alt="" width={20} height={20} className={`size-[20px] shrink-0 ${i === active ? "brightness-0 invert" : ""}`} />
                ) : (
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden className="shrink-0">
                    <path d="M3 18V4.5L10 2L17 4.5V18M3 18H17M7 7H8M12 7H13M7 10.5H8M12 10.5H13M8.5 18V14.5H11.5V18" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
                  </svg>
                )}
                <span className="whitespace-pre-line">{s.name}</span>
              </button>
            </li>
          ))}
        </ul>
        <span aria-hidden className="w-px shrink-0 self-stretch bg-white" />
        <div className="flex min-w-0 flex-1 gap-[50px]">
          <div className="flex w-[480px] shrink-0 flex-col pt-[190px]">
            <h3 className="text-h1 leading-[1.2] font-light whitespace-pre-line">{seg.title}</h3>
            {seg.text && <p className="mt-[20px] text-[16px] leading-[24px] whitespace-pre-line">{seg.text}</p>}
            {seg.product.name && (
              <div className="mt-[30px] flex items-center gap-[20px]">
                <span className="relative size-[120px] shrink-0 overflow-hidden rounded-[8px] bg-white">
                  {seg.product.image && <Image src={seg.product.image} alt={seg.product.name} fill sizes="120px" className="object-contain" />}
                </span>
                <div className="flex flex-col items-start gap-[10px] text-[16px] leading-[24px]">
                  <p>
                    {data.recommend}
                    <br />
                    <strong>{seg.product.name}</strong>
                  </p>
                  {seg.product.href && (
                    <Button variant="s-red" href={seg.product.href}>
                      {data.more}
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="relative ml-auto aspect-square w-[770px] max-w-full shrink overflow-hidden rounded-[32px] bg-white/50">
            {seg.image ? <FramedImage src={seg.image} sizes="770px" /> : <MissingMedia label={`Zdjęcie segmentu „${seg.name}” — do dodania w panelu`} dark={false} />}
          </div>
        </div>
      </div>
    </section>
  );
}
