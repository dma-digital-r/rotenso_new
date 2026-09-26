"use client";

import Image from "next/image";
import { useState } from "react";
import { diagonalGradient } from "@/components/home/SectionBackdrop";
import { FramedImage } from "@/components/ui/FramedImage";
import { Media, SlideTimer } from "@/components/ui/Media";
import { PlayPause } from "./PlayPause";
import { SliderBar } from "@/components/ui/SliderBar";
import type { Ui } from "@/i18n/ui";

type Item = { image: string | null; video?: string | null; title: string; text: string };

const WIDE = 970;
const NARROW = 310;
const GAP = 20;

// Figma: "Atuty" (5172:81642) + "Atuty GRID" (5172:81604) on the gradient "Rectangle 32"
// (1197px, from 410px below the title down to the purchase section).
// Slider: the active tile is 970 wide and centred, the others 310; its description sits under
// the track. Grid: 1300 wide, rows of 860+420 / 420+860, "+" reveals a description; the
// kingfisher sits on the top-left corner.
// "autoplay" (Premium, Basic): the active tile has a pause button and a red timer and the slider
// moves on by itself; tiles with a film play it.
export function Advantages({
  title,
  items,
  grid,
  bird = true,
  autoplay = false,
  ui,
}: {
  title: string;
  items: Item[];
  grid: Item[];
  bird?: boolean;
  autoplay?: boolean;
  ui: Ui;
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [open, setOpen] = useState<number | null>(null);
  const count = items.length;
  if (!count && !grid.length) return null;
  const next = () => {
    setProgress(0);
    setIndex((i) => (i + 1) % count);
  };

  return (
    <section className="relative z-10 mt-[150px] text-rotenso-grey">
      <div className="absolute inset-x-0 top-[410px] -z-10 h-[1197px]" style={{ backgroundImage: diagonalGradient(1197) }} />

      {count > 0 && (
        <>
          <h2 className="text-center text-h1 leading-[1.2] font-light">{title}</h2>
          <div className="relative mt-[50px] h-[545px] overflow-x-clip">
            <div
              className="absolute top-0 left-1/2 flex gap-[20px] transition-transform duration-500"
              style={{ transform: `translateX(${-(index * (NARROW + GAP) + WIDE / 2)}px)` }}
            >
              {items.map((it, i) => (
                <div
                  key={i}
                  role="button"
                  tabIndex={0}
                  onClick={() => setIndex(i)}
                  onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setIndex(i)}
                  aria-current={i === index}
                  className="relative h-[545px] shrink-0 cursor-pointer overflow-hidden rounded-[32px] bg-grey-dd transition-[width] duration-500"
                  style={{ width: i === index ? WIDE : NARROW }}
                >
                  <Media image={it.image} video={it.video} sizes="970px" playing={i === index && !paused} loop={!autoplay} onProgress={i === index ? setProgress : undefined} onEnded={next} />
                  <span className="absolute inset-x-0 bottom-0 h-[120px] bg-[linear-gradient(to_top,rgb(0_0_0/0.7),rgb(0_0_0/0))]" />
                  <span
                    className={`absolute inset-x-[20px] bottom-[30px] text-center font-light text-white ${
                      i === index ? "text-h2 leading-[1.2]" : "text-h3 leading-[1.36]"
                    }`}
                  >
                    {it.title}
                  </span>
                  {autoplay && i === index && (
                    <>
                      <PlayPause paused={paused} onToggle={() => setPaused((p) => !p)} ui={ui} className="absolute right-[30px] bottom-[30px]" />
                      <SlideTimer ms={8000} film={!!it.video} progress={progress} paused={paused} onDone={next} slideKey={index} />
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
          <p className="mx-auto mt-[20px] min-h-[48px] w-[860px] max-w-[calc(100%-32px)] text-center text-[16px] leading-[24px]">
            {items[index]?.text}
          </p>
          <div className="mx-auto mt-[30px] w-[1300px] max-w-[calc(100%-32px)]">
            <SliderBar
              progress={count > 1 ? index / (count - 1) : 0}
              thumbWidth={1190 / Math.max(count, 1)}
              onPrev={() => setIndex((i) => Math.max(0, i - 1))}
              onNext={() => setIndex((i) => Math.min(count - 1, i + 1))}
              prevDisabled={index === 0}
              nextDisabled={index === count - 1}
              labels={{ prev: ui.prev, next: ui.next }}
            />
          </div>
        </>
      )}

      {grid.length > 0 && (
        <div className="relative mx-auto w-[1300px] max-w-[calc(100%-32px)] pt-[150px]">
          <div className="flex flex-col gap-[20px]">
            {rows(grid).map((row, r) => (
              // Rows alternate: wide + narrow, then narrow + wide.
              <div key={r} className={`grid gap-[20px] ${r % 2 ? "grid-cols-[420fr_860fr]" : "grid-cols-[860fr_420fr]"}`}>
                {row.map((it, c) => {
                  const i = r * 2 + c;
                  const shown = open === i;
                  return (
                    <div key={i} className="relative h-[420px] overflow-hidden rounded-[32px] bg-grey-dd">
                      <FramedImage src={it.image} sizes={(r + c) % 2 ? "420px" : "860px"} />
                      <span className="absolute inset-x-0 bottom-0 h-[120px] bg-[linear-gradient(to_top,rgb(0_0_0/0.7),rgb(0_0_0/0))]" />
                      <h3 className="absolute bottom-[30px] left-[30px] text-h3 leading-[1.36] font-light text-white">{it.title}</h3>
                      {it.text && (
                        <>
                          <div
                            className={`absolute inset-0 flex items-end bg-black/50 p-[30px] pb-[80px] text-[16px] leading-[24px] text-white backdrop-blur-[20px] transition-opacity ${
                              shown ? "opacity-100" : "pointer-events-none opacity-0"
                            }`}
                          >
                            {it.text}
                          </div>
                          <button
                            type="button"
                            onClick={() => setOpen(shown ? null : i)}
                            aria-expanded={shown}
                            aria-label={shown ? ui.close : ui.moreInfo}
                            className="absolute top-[30px] right-[30px] size-[40px] cursor-pointer rounded-full bg-white transition-transform hover:scale-105"
                          >
                            <svg
                              width="40"
                              height="40"
                              viewBox="0 0 40 40"
                              fill="none"
                              aria-hidden
                              className={`transition-transform ${shown ? "rotate-45" : ""}`}
                            >
                              <path d="M20 13V27M13 20H27" stroke="#546670" strokeWidth="3" strokeLinecap="round" />
                            </svg>
                          </button>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
          {bird && <Image
            src="/images/home/kingfisher.png"
            alt=""
            width={300}
            height={300}
            sizes="300px"
            className="pointer-events-none absolute top-0 left-[41px] drop-shadow-[50px_50px_25px_rgba(0,0,0,0.25)]"
          />}
        </div>
      )}
    </section>
  );
}

const rows = <T,>(list: T[]) => Array.from({ length: Math.ceil(list.length / 2) }, (_, r) => list.slice(r * 2, r * 2 + 2));
