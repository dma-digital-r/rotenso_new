"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { FramedImage } from "@/components/ui/FramedImage";
import { Icon } from "@/components/ui/Icon";
import { PlayPause } from "@/components/product/PlayPause";
import type { Ui } from "@/i18n/ui";
import type { GuideSummary } from "@/lib/guides";

const SLIDE_MS = 7000;

// Figma: "Header M" (5172:77041) — 1820×650 rounded box, featured guides as slides: glass panel
// (label, 40px title, excerpt, "Przeczytaj") on the left, 150px dark fade at the bottom,
// 4 timer bars (267px) and arrows + pause bottom-right.
export function BlogHero({ slides, button, lang, ui }: { slides: GuideSummary[]; button: string; lang: string; ui: Ui }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = slides.length;
  if (!count) return null;
  const go = (i: number) => setIndex((i + count) % count);

  return (
    <section className="relative mx-[50px] mt-[15px] h-[650px] overflow-hidden rounded-[32px] bg-rotenso-grey">
      {slides.map((s, i) => (
        <div key={s.slug} aria-hidden={i !== index} className={`absolute inset-0 transition-opacity duration-700 ${i === index ? "opacity-100" : "opacity-0"}`}>
          <FramedImage src={s.image} sizes="100vw" preload={i === 0} />
        </div>
      ))}
      <span className="absolute inset-x-0 bottom-0 h-[150px] bg-[linear-gradient(to_top,rgb(0_0_0/0.7),rgb(0_0_0/0))]" />

      <div className="relative mx-auto h-full w-[1300px] max-w-[calc(100%-32px)]">
        <nav aria-label="Breadcrumb" className="absolute top-[95px] left-0 text-[12px] leading-[normal] text-white">
          <Link href={`/${lang}`} className="hover:underline">
            {ui.crumbHome}
          </Link>
          {" / "}
          <span aria-current="page">{ui.crumbGuides}</span>
        </nav>

        {slides.map((s, i) => (
          <div
            key={s.slug}
            aria-hidden={i !== index}
            className={`absolute top-[calc(50%+35px)] left-0 flex w-[530px] -translate-y-1/2 flex-col items-start gap-[30px] rounded-[32px] bg-black/50 p-[30px] text-white backdrop-blur-[20px] transition-opacity duration-700 ${
              i === index ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
          >
            <div className="flex flex-col gap-[10px]">
              <div className="flex flex-col">
                <p className="text-[12px] leading-[16.3px]">{s.label}</p>
                {i === 0 ? <h1 className="line-clamp-3 text-h2 leading-[1.2] font-light">{s.title}</h1> : <h2 className="line-clamp-3 text-h2 leading-[1.2] font-light">{s.title}</h2>}
              </div>
              <p className="line-clamp-4 text-[16px] leading-[24px]">{s.excerpt}</p>
            </div>
            <Button variant="m-red" href={s.href}>
              {button}
            </Button>
          </div>
        ))}

        {count > 1 && (
          <div className="absolute inset-x-0 bottom-[20px] flex h-[30px] items-center gap-[28px]">
            {slides.map((s, i) => (
              <button key={s.slug} type="button" onClick={() => go(i)} aria-label={s.title} className="h-[30px] w-[267px] cursor-pointer">
                <span className={`relative block h-[3px] overflow-hidden rounded-[20px] bg-white ${i === index ? "" : "opacity-50"}`}>
                  {i === index && (
                    <span
                      key={index}
                      className="hero-progress absolute inset-y-0 left-0 rounded-[20px] bg-rotenso-red"
                      style={{ animationDuration: `${SLIDE_MS}ms`, animationPlayState: paused ? "paused" : "running" }}
                      onAnimationEnd={() => go(index + 1)}
                    />
                  )}
                </span>
              </button>
            ))}
            <div className="ml-auto flex items-center gap-[20px]">
              <div className="flex gap-[10px]">
                <button type="button" aria-label={ui.prevSlide} onClick={() => go(index - 1)} className="cursor-pointer opacity-50 hover:opacity-100">
                  <Icon name="arrow-w2-left" width={30} height={30} />
                </button>
                <button type="button" aria-label={ui.nextSlide} onClick={() => go(index + 1)} className="cursor-pointer opacity-50 hover:opacity-100">
                  <Icon name="arrow-w2-right" width={30} height={30} />
                </button>
              </div>
              <PlayPause paused={paused} onToggle={() => setPaused((p) => !p)} ui={ui} className="size-[30px] [&>svg]:size-[30px]" />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
