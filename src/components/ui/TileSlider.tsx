"use client";

import { useState } from "react";
import { PlayPause } from "@/components/product/PlayPause";
import type { Ui } from "@/i18n/ui";
import { Button } from "./Button";
import { FramedImage } from "./FramedImage";
import { SliderBar } from "./SliderBar";

const WIDE = 970;
const NARROW = 310;
const GAP = 20;
const SLIDE_MS = 8000;

export type Tile = { image: string | null; title?: string; text?: string; cta?: { label: string; href: string } };

// Figma "Produkty - o nas" / "Slider L": the active tile is 970×545 and centred, the others
// 310 wide; red timer and pause on the active tile; under the track an optional description row
// (text + button of the active tile) and the 1300px slider bar. Clicking a tile activates it.
export function TileSlider({ tiles, ui, autoplay = true }: { tiles: Tile[]; ui: Ui; autoplay?: boolean }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = tiles.length;
  if (!count) return null;
  const go = (i: number) => setIndex((i + count) % count);
  const active = tiles[index];
  const hasCaption = tiles.some((t) => t.text || t.cta?.label);

  return (
    <div>
      <div className="relative h-[545px] overflow-x-clip">
        <div
          className="absolute top-0 left-1/2 flex gap-[20px] transition-transform duration-500"
          style={{ transform: `translateX(${-(index * (NARROW + GAP) + WIDE / 2)}px)` }}
        >
          {tiles.map((t, i) => {
            const on = i === index;
            return (
              <div
                key={i}
                onClick={on ? undefined : () => go(i)}
                className={`relative h-[545px] shrink-0 overflow-hidden rounded-[32px] bg-[#c4c4c4] transition-[width] duration-500 ${on ? "" : "cursor-pointer"}`}
                style={{ width: on ? WIDE : NARROW }}
              >
                <FramedImage src={t.image} sizes="970px" />
                {t.title && (
                  <>
                    <span className="absolute inset-x-0 bottom-0 h-[120px] bg-[linear-gradient(to_top,rgb(0_0_0/0.7),rgb(0_0_0/0))]" />
                    <span
                      className={`absolute inset-x-[20px] bottom-[30px] text-center font-light text-white ${on ? "text-h2 leading-[1.2]" : "text-h3 leading-[1.36]"}`}
                    >
                      {t.title}
                    </span>
                  </>
                )}
                {on && autoplay && (
                  <>
                    <PlayPause paused={paused} onToggle={() => setPaused((p) => !p)} ui={ui} className="absolute right-[30px] bottom-[30px]" />
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
            );
          })}
        </div>
      </div>

      {hasCaption && (
        <div className="mx-auto mt-[20px] flex min-h-[48px] w-[970px] max-w-[calc(100%-32px)] items-start justify-between gap-[60px] px-[30px]">
          <p className="text-[16px] leading-[24px] text-rotenso-grey">{active.text}</p>
          {active.cta?.label && (
            <Button variant="m-red" href={active.cta.href}>
              {active.cta.label}
            </Button>
          )}
        </div>
      )}

      <div className="mx-auto mt-[30px] w-[1300px] max-w-[calc(100%-32px)]">
        <SliderBar
          progress={count > 1 ? index / (count - 1) : 0}
          thumbWidth={1190 / count}
          onPrev={() => go(index - 1)}
          onNext={() => go(index + 1)}
          labels={{ prev: ui.prev, next: ui.next }}
        />
      </div>
    </div>
  );
}
