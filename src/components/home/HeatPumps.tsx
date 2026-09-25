"use client";

import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { SectionBackdrop } from "./SectionBackdrop";
import { SliderBar } from "@/components/ui/SliderBar";
import type { Ui } from "@/i18n/ui";
import type { HomeContent } from "@/lib/content";

// Active tile is 970 wide, the others 310, gap 20 → each step shifts the track by 330px.
const ACTIVE_W = 970;
const TILE_W = 310;
const STEP = TILE_W + 20;

// Figma: "Pompy Ciepła" (5172:70579) → component "Pompy ciepla" (1920×673).
// The active tile always sits at x = 475 (container + 165px); clicking another tile expands it.
export function HeatPumps({ data, ui }: { data: HomeContent["heatPumps"]; ui: Ui }) {
  const [index, setIndex] = useState(0);
  const tiles = data.tiles;
  const count = tiles.length;
  const active = tiles[index];

  return (
    <section className="relative mt-[150px]">
      {/* Rectangle 7: backdrop from y 3520 (350px above the title), 880px tall. */}
      <SectionBackdrop top={-350} height={880} />

      <h2 className="text-center text-[72px] leading-[1.2] font-light text-rotenso-grey">{data.title}</h2>
      <p className="mx-auto mt-[20px] w-[860px] max-w-[calc(100%-32px)] text-center text-[25px] leading-[normal] font-light text-rotenso-grey">
        {data.text}
      </p>

      <div className="relative mt-[50px] h-[673px] overflow-hidden">
        <div
          className="absolute top-0 left-[calc((100%-1300px)/2+165px)] flex h-[545px] gap-[20px] transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(${-index * STEP}px)` }}
        >
          {tiles.map((t, i) => {
            const isActive = i === index;
            return (
              <div
                key={i}
                role={isActive ? undefined : "button"}
                tabIndex={isActive ? undefined : 0}
                aria-label={isActive ? undefined : t.title.replace("\n", " ")}
                onClick={() => setIndex(i)}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setIndex(i)}
                className={`relative h-[545px] shrink-0 overflow-hidden rounded-[32px] transition-[width] duration-500 ease-in-out ${
                  isActive ? "" : "cursor-pointer"
                }`}
                style={{ width: isActive ? ACTIVE_W : TILE_W }}
              >
                {t.image && <Image src={t.image} alt="" fill sizes="970px" className="object-cover" />}
                <div className="absolute inset-x-0 bottom-0 h-[120px] rounded-b-[32px] bg-gradient-to-t from-black to-transparent opacity-70" />
                <h3
                  className={`absolute bottom-[30px] text-white transition-all duration-500 ${
                    isActive
                      ? "left-[30px] text-[40px] leading-[1.2] font-light whitespace-nowrap"
                      : "inset-x-0 text-center text-[25px] leading-[normal] font-light whitespace-pre-line"
                  }`}
                >
                  {isActive ? t.title.replace("\n", " ") : t.title}
                </h3>
                {isActive && (
                  <a
                    href={data.configurator.href}
                    className="absolute right-[20px] bottom-[20px] flex w-[340px] items-center justify-center rounded-[8px] p-[20px] backdrop-blur-[10px]"
                    style={{ backgroundImage: "linear-gradient(145.76deg, rgb(84, 102, 112) 0%, rgb(26, 35, 40) 100%)" }}
                  >
                    <span className="flex min-w-px flex-1 flex-col items-start justify-center gap-[10px] text-[14px] text-white">
                      <span className="text-trim leading-[normal]">{data.configurator.question}</span>
                      <span className="text-trim leading-[1.2] font-bold">{data.configurator.cta}</span>
                    </span>
                    <span className="relative h-[24px] w-[35px] shrink-0">
                      <span className="absolute inset-[-0.83%_-0.57%]">
                        <Icon name="ico-pompa" width={35} height={24} className="size-full" />
                      </span>
                    </span>
                  </a>
                )}
              </div>
            );
          })}
        </div>

        {/* "Opis" row under the active tile (y 565). */}
        {active && (
          <div className="absolute top-[565px] left-[calc((100%-1300px)/2+165px)] flex w-[970px] items-start gap-[60px] px-[30px]">
            <p className="min-w-px flex-1 self-stretch text-[16px] leading-[24px] text-rotenso-grey">{active.text}</p>
            <Button variant="m-red" href={active.cta.href}>
              {active.cta.label}
            </Button>
          </div>
        )}

        <div className="absolute top-[643px] left-1/2 -translate-x-1/2">
          <SliderBar
            progress={count > 1 ? index / (count - 1) : 0}
            thumbWidth={1190 / Math.max(count, 1)}
            onPrev={() => setIndex((i) => Math.max(0, i - 1))}
            onNext={() => setIndex((i) => Math.min(count - 1, i + 1))}
            prevDisabled={index === 0}
            nextDisabled={index === count - 1}
            labels={ui}
          />
        </div>
      </div>
    </section>
  );
}
