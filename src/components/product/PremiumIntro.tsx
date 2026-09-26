"use client";

import { useState } from "react";
import { FramedImage, MissingMedia } from "@/components/ui/FramedImage";
import type { Ui } from "@/i18n/ui";
import type { ProductEntry } from "@/lib/products";
import { PlayPause } from "./PlayPause";

const SLIDE_MS = 8000;

type Slide = { image: string | null; title: string; subtitle: string; text: string };

// Figma: "Klimatyzacja Premium v02" (5172:71463), from Daniel's screenshot — the High Premium
// "Intro Video 180" and "Cecha" merged: a photo band under the product bar with a centred white
// title, subtitle and paragraph, and a 1820-wide rounded slider (glass panel on the left, red
// timer along the bottom) that overlaps the lower part of the band.
// Positions from the Figma export (SVG/PDF): band starts 45px under the hero box, title 260px
// into it, slider 1820×880 from 622px; the band is 1060px tall.
export function PremiumIntro({ intro, slides, ui }: { intro: ProductEntry["intro"]; slides: Slide[]; ui: Ui }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = slides.length;
  const go = (i: number) => setIndex((i + count) % count);

  return (
    <section id="intro-video" className="relative -mt-[100px] scroll-mt-[85px] pt-[260px]">
      <div className="absolute inset-x-0 top-0 h-[1060px] overflow-hidden bg-rotenso-grey">
        {intro.image ? <FramedImage src={intro.image} sizes="100vw" /> : <MissingMedia label="Tło sekcji — do dodania w panelu" />}
        </div>

      <div className="relative mx-auto flex w-[1300px] max-w-[calc(100%-32px)] flex-col items-center text-center font-light text-white">
        <h2 className="text-h1 leading-[1.2]">{intro.title}</h2>
        {intro.text && <p className="mt-[10px] text-h3 leading-[1.36]">{intro.text}</p>}
        {intro.body && <p className="mt-[30px] w-[860px] max-w-full text-[16px] leading-[24px] font-normal whitespace-pre-line">{intro.body}</p>}
      </div>

      {count > 0 && (
        <div id="cecha" className="relative mx-[50px] mt-[147px] h-[880px] overflow-hidden rounded-[32px] bg-[#c4c4c4]">
          {slides.map((s, i) => (
            <div key={i} aria-hidden={i !== index} className={`absolute inset-0 transition-opacity duration-700 ${i === index ? "opacity-100" : "opacity-0"}`}>
              {s.image ? <FramedImage src={s.image} sizes="100vw" /> : <MissingMedia label={`Zdjęcie slajdu „${s.title.replace(/\n/g, " ")}” — do dodania w panelu`} />}
            </div>
          ))}
          <div className="relative mx-auto h-full w-[1300px] max-w-[calc(100%-32px)]">
            {slides.map((s, i) => (
              <div
                key={i}
                aria-hidden={i !== index}
                className={`absolute top-1/2 left-0 flex w-[530px] -translate-y-1/2 flex-col gap-[20px] rounded-[32px] bg-black/50 p-[30px] text-white backdrop-blur-[20px] transition-opacity duration-700 ${
                  i === index ? "opacity-100" : "pointer-events-none opacity-0"
                }`}
              >
                <div className="font-light">
                  <h3 className="text-h2 leading-[1.2] whitespace-pre-line">{s.title}</h3>
                  {s.subtitle && <p className="mt-[10px] text-h3 leading-[1.36]">{s.subtitle}</p>}
                </div>
                <p className="text-[16px] leading-[24px] whitespace-pre-line">{s.text}</p>
              </div>
            ))}
          </div>
          <PlayPause paused={paused} onToggle={() => setPaused((p) => !p)} ui={ui} className="absolute right-[50px] bottom-[50px]" />
          <span className="absolute inset-x-0 bottom-0 h-[5px]">
            <span
              key={index}
              className="hero-progress absolute inset-y-0 left-0 bg-rotenso-red"
              style={{ animationDuration: `${SLIDE_MS}ms`, animationPlayState: paused ? "paused" : "running" }}
              onAnimationEnd={() => go(index + 1)}
            />
          </span>
        </div>
      )}
    </section>
  );
}
