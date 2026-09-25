"use client";

import { useState } from "react";
import { FramedImage } from "@/components/ui/FramedImage";
import type { Ui } from "@/i18n/ui";
import { PlayPause } from "./PlayPause";

const SLIDE_MS = 8000;
const SLIDE_W = 1340;
const GAP = 20;

type Slide = { image: string | null; title: string; text: string };

// Figma: "Mirai Cechy Slider v3" (5172:81671) on the grey-white gradient "Rectangle 33"
// (527px, starts where "Cecha" ends). 1340×754 slides 50px from the left edge, the next one
// peeking in; glass panel bottom-left, pause bottom-right, red timer along the bottom edge and
// a 1300px progress line under the track.
export function FeatureSlider({ slides, ui }: { slides: Slide[]; ui: Ui }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = slides.length;
  if (!count) return null;
  const go = (i: number) => setIndex((i + count) % count);

  return (
    <section className="relative pt-[150px]">
      <div className="absolute inset-x-0 top-0 h-[527px] bg-[linear-gradient(112deg,#cccccc,#ffffff_50%,#cccccc)]" />
      <div className="relative h-[754px] overflow-x-clip">
        <div
          className="absolute top-0 left-[50px] flex gap-[20px] transition-transform duration-700"
          style={{ transform: `translateX(${-index * (SLIDE_W + GAP)}px)` }}
        >
          {slides.map((s, i) => (
            <div
              key={i}
              aria-hidden={i !== index}
              onClick={i !== index ? () => go(i) : undefined}
              className={`relative h-[754px] w-[1340px] shrink-0 overflow-hidden rounded-[32px] bg-grey-dd ${i !== index ? "cursor-pointer" : ""}`}
            >
              <FramedImage src={s.image} sizes="1340px" />
              <div className="absolute bottom-[50px] left-[50px] flex w-[540px] flex-col gap-[20px] rounded-[32px] bg-black/50 p-[30px] text-white backdrop-blur-[20px]">
                <h3 className="text-h2 leading-[1.2] font-light">{s.title}</h3>
                <p className="text-[16px] leading-[24px]">{s.text}</p>
              </div>
              {i === index && (
                <>
                  <PlayPause paused={paused} onToggle={() => setPaused((p) => !p)} ui={ui} className="absolute right-[50px] bottom-[50px]" />
                  <span className="absolute inset-x-0 bottom-0 h-[5px]">
                    <span
                      key={index}
                      className="hero-progress absolute inset-y-0 left-0 bg-rotenso-red"
                      style={{ animationDuration: `${SLIDE_MS}ms`, animationPlayState: paused ? "paused" : "running" }}
                      onAnimationEnd={() => go(index + 1)}
                    />
                  </span>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
      {/* Progress line: 1300px, 50px left of centre in Figma (x 260 at 1920). */}
      <div className="relative mt-[50px] ml-[calc(50%-700px)] h-[4px] w-[1300px] max-w-[calc(100%-32px)]">
        <span className="absolute inset-x-0 top-[1px] h-[2px] rounded-[2px] bg-grey-dd" />
        <span
          className="absolute top-0 h-[4px] rounded-[3px] bg-rotenso-red transition-[left] duration-700"
          style={{ width: `${100 / count}%`, left: `${(index * 100) / count}%` }}
        />
      </div>
    </section>
  );
}
