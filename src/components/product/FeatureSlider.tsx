"use client";

import { useState, type ReactNode } from "react";
import { diagonalGradient } from "@/components/home/SectionBackdrop";
import { Media, SlideTimer } from "@/components/ui/Media";
import type { Ui } from "@/i18n/ui";
import { PlayPause } from "./PlayPause";

const SLIDE_MS = 8000;
const SLIDE_W = 1340;
const GAP = 20;

type Slide = { image: string | null; video?: string | null; title: string; text: string };

// Figma: "Mirai Cechy Slider v3" (5172:81671) on the grey-white gradient "Rectangle 33"
// (527px, starts where "Cecha" ends). 1340×754 slides 50px from the left edge, the next one
// peeking in; glass panel bottom-left, pause bottom-right, red timer along the bottom edge and
// a 1300px progress line under the track.
// "background"/"header" (Inwestycje): a photo band with a title above the slides instead of the
// gradient; "autoplay={false}": no pause button or red timer (only the progress line).
export function FeatureSlider({
  slides,
  ui,
  background,
  header,
  autoplay = true,
}: {
  slides: Slide[];
  ui: Ui;
  background?: ReactNode;
  header?: ReactNode;
  autoplay?: boolean;
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const count = slides.length;
  if (!count) return null;
  const go = (i: number) => {
    setProgress(0);
    setIndex((i + count) % count);
  };

  return (
    <section className={`relative ${header ? "" : "pt-[150px]"}`}>
      {background ?? <div className="absolute inset-x-0 top-0 h-[527px]" style={{ backgroundImage: diagonalGradient(527) }} />}
      {header}
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
              {/* A film plays once and moves the slider on; a photo waits SLIDE_MS. */}
              <Media image={s.image} video={s.video} sizes="1340px" playing={i === index && !paused} loop={count < 2 || !autoplay} onProgress={i === index ? setProgress : undefined} onEnded={() => go(index + 1)} />
              <div className="absolute bottom-[50px] left-[50px] flex w-[540px] flex-col gap-[20px] rounded-[32px] bg-black/50 p-[30px] text-white backdrop-blur-[20px]">
                <h3 className="text-h2 leading-[1.2] font-light">{s.title}</h3>
                <p className="text-[16px] leading-[24px] whitespace-pre-line">{s.text}</p>
              </div>
              {i === index && autoplay && (
                <>
                  <PlayPause paused={paused} onToggle={() => setPaused((p) => !p)} ui={ui} className="absolute right-[50px] bottom-[50px]" />
                  <SlideTimer ms={SLIDE_MS} film={!!s.video} progress={progress} paused={paused} onDone={() => go(index + 1)} slideKey={index} />
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
