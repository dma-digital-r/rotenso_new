"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { FramedImage } from "@/components/ui/FramedImage";
import { SliderBar } from "@/components/ui/SliderBar";
import { SectionBackdrop } from "./SectionBackdrop";
import type { Ui } from "@/i18n/ui";
import type { HomeContent } from "@/lib/content";

const CARD_STEP = 440; // 420 card + 20 gap

// Figma: "Poradnik" (5172:70555) — horizontally scrolling 420×436 cards, first card aligned with the container.
export function Guides({ data, ui }: { data: HomeContent["guides"]; ui: Ui }) {
  const scroller = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  const update = useCallback(() => {
    const el = scroller.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setProgress(max > 0 ? el.scrollLeft / max : 0);
  }, []);

  useEffect(() => {
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [update]);

  const scrollBy = (dir: 1 | -1) =>
    scroller.current?.scrollBy({ left: dir * CARD_STEP, behavior: "smooth" });

  return (
    <section className="relative mt-[150px]">
      {/* Rectangle 32: backdrop from y 5301 (500px above the title), 1427px tall. */}
      <SectionBackdrop top={-500} height={1427} />

      <div className="mx-auto flex w-[860px] max-w-[calc(100%-32px)] flex-col items-center gap-[30px] text-center font-light text-rotenso-grey">
        <h2 className="w-full text-h1 leading-[1.2]">{data.title}</h2>
        <p className="w-full text-h3 leading-[normal]">{data.text}</p>
      </div>

      <div
        ref={scroller}
        onScroll={update}
        className="mt-[50px] -mb-[60px] flex snap-x snap-mandatory scroll-px-[max(16px,calc((100%-1300px)/2))] gap-[20px] overflow-x-auto px-[max(16px,calc((100%-1300px)/2))] pb-[60px] scrollbar-none"
      >
        {data.items.map((g) => (
          <article
            key={g.title}
            className="relative h-[436px] w-[420px] shrink-0 snap-start drop-shadow-[30px_30px_25px_rgba(0,0,0,0.1)]"
          >
            <div className="absolute inset-x-0 top-0 h-[236px] overflow-hidden rounded-t-[32px]">
              <FramedImage src={g.image} crop={g.imageCrop} sizes="420px" fit="exact" />
            </div>
            <div className="absolute inset-x-0 bottom-0 h-[200px] rounded-b-[32px] bg-white" />
            <div className="absolute top-[266px] left-[30px] flex h-[139px] w-[360px] flex-col items-start gap-[20px]">
              <div className="flex w-full flex-col gap-[5px] leading-[normal] text-rotenso-grey">
                <p className="text-[12px]">{g.category}</p>
                <h3 className="text-h3 font-light">{g.title}</h3>
              </div>
              <Link
                href={g.href}
                className="inline-flex h-[30px] items-center justify-center overflow-clip rounded-[15px] border border-rotenso-grey px-[15px] py-[10px] text-[12px] leading-[normal] font-bold whitespace-nowrap text-rotenso-grey after:absolute after:inset-0 hover:opacity-85"
              >
                <span className="text-trim">{data.readLabel}</span>
              </Link>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-[50px] flex justify-center">
        <SliderBar
          progress={progress}
          thumbWidth={130}
          trackColor="#d9d9d9"
          onPrev={() => scrollBy(-1)}
          onNext={() => scrollBy(1)}
          prevDisabled={progress <= 0.001}
          nextDisabled={progress >= 0.999}
          labels={ui}
        />
      </div>

      <div className="mt-[35px] flex justify-center">
        <Button variant="m-red" href={data.more.href}>
          {data.more.label}
        </Button>
      </div>
    </section>
  );
}
