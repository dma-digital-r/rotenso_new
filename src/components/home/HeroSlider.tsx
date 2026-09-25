"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { FramedImage, MissingMedia } from "@/components/ui/FramedImage";
import { Icon } from "@/components/ui/Icon";
import type { Ui } from "@/i18n/ui";
import type { HomeContent } from "@/lib/content";

const SLIDE_MS = 7000;
// Timer bars: 267.442px wide, 294.19px pitch (Figma "Timer" 5172:70643).
const BAR_W = 267.442;
const BAR_PITCH = 294.19;

// Figma: "Header" (5172:70639) — 1820×930 rounded box, 50px from the page edges.
export function HeroSlider({ slides, ui }: { slides: HomeContent["heroSlides"]; ui: Ui }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = slides.length;
  const go = (i: number) => setIndex((i + count) % count);

  return (
    <section className="relative mx-[50px] mt-[50px] h-[930px] overflow-hidden rounded-[32px] bg-[#3a4044]">
      {slides.map((s, i) => (
        <div
          key={s.tab}
          aria-hidden={i !== index}
          className={`absolute inset-0 transition-opacity duration-700 ${i === index ? "opacity-100" : "opacity-0"}`}
        >
          {s.background ? (
            <FramedImage src={s.background} sizes="100vw" preload={i === 0} />
          ) : (
            <MissingMedia label={`Tło slajdu „${s.tab}” — brak w projekcie, do dodania w panelu`} />
          )}
        </div>
      ))}

      {/* Rectangle 2: 150px strip at the bottom that darkens the timer area. */}
      <div className="absolute inset-x-0 bottom-0 h-[150px]">
        <FramedImage src="/images/home/hero-bottom.png" sizes="100vw" />
      </div>

      <div className="relative mx-auto h-full w-[1300px] max-w-[calc(100%-32px)]">
        {slides.map((s, i) => (
          <div
            key={s.tab}
            aria-hidden={i !== index}
            className={`absolute top-[290px] left-0 flex w-[530px] flex-col items-start gap-[30px] rounded-[32px] bg-black/50 px-[30px] pt-[30px] pb-[50px] text-white backdrop-blur-[10px] transition-opacity duration-700 ${
              i === index ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
          >
            <div className="flex w-full flex-col gap-[10px] font-light">
              {i === 0 ? (
                <h1 className="text-[72px] leading-[1.2]">{s.title}</h1>
              ) : (
                <h2 className="text-[72px] leading-[1.2]">{s.title}</h2>
              )}
              <p className="text-[25px] leading-[normal]">{s.text}</p>
            </div>
            <div className="flex items-start gap-[10px]">
              <Button variant="m-red" href={s.primary.href} className="min-w-[173px]">
                {s.primary.label}
              </Button>
              <Button variant="m-white" href={s.secondary.href}>
                {s.secondary.label}
              </Button>
            </div>
          </div>
        ))}

        {/* Timer: bars at y 867, labels at y 876, controls at y 854 (relative to the box). */}
        {slides.map((s, i) => (
          <button
            key={s.tab}
            type="button"
            onClick={() => go(i)}
            className="absolute top-[867px] h-[33px] cursor-pointer text-left"
            style={{ left: i * BAR_PITCH, width: BAR_W }}
          >
            <span
              className={`absolute inset-x-0 top-0 h-[3px] overflow-hidden rounded-[20px] bg-white ${
                i === index ? "" : "opacity-50"
              }`}
            >
              {i === index && (
                <span
                  key={index}
                  className="hero-progress absolute inset-y-0 left-0 rounded-[20px] bg-rotenso-red"
                  style={{
                    animationDuration: `${SLIDE_MS}ms`,
                    animationPlayState: paused ? "paused" : "running",
                  }}
                  onAnimationEnd={() => go(index + 1)}
                />
              )}
            </span>
            <span
              className={`absolute top-[9px] left-0 text-[16px] leading-[24px] whitespace-nowrap text-white ${
                i === index ? "" : "opacity-50"
              }`}
            >
              {s.tab}
            </span>
          </button>
        ))}

        <div className="absolute top-[854px] left-[1180px] flex items-center">
          <button type="button" aria-label={ui.prevSlide} onClick={() => go(index - 1)} className="cursor-pointer">
            <Icon name="arrow-w2-left" width={30} height={30} />
          </button>
          <button type="button" aria-label={ui.nextSlide} onClick={() => go(index + 1)} className="ml-[10px] cursor-pointer">
            <Icon name="arrow-w2-right" width={30} height={30} />
          </button>
          <button
            type="button"
            aria-label={paused ? ui.resume : ui.pause}
            aria-pressed={paused}
            onClick={() => setPaused((p) => !p)}
            className="ml-[20px] cursor-pointer"
          >
            <Icon name="pause-white" width={30} height={30} className={paused ? "opacity-100" : ""} />
          </button>
        </div>
      </div>
    </section>
  );
}
