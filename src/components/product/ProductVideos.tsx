"use client";

import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import type { Ui } from "@/i18n/ui";
import { PlayPause } from "./PlayPause";

const CARD_MS = 8000;
const SIDE_W = 420;
const GAP = 50;

export type ProductVideo = { id: string; href: string; image: string; title: string; text: string };

// Figma: "Multimedia" (5172:81592). The active film card is 530 wide (image 530×298, 25px
// title, red timer under the image, pause), centred; its neighbours are 420 wide at 50% opacity,
// 30px lower, with smaller type. Cards rotate on the timer; the active one opens YouTube.
export function ProductVideos({ videos, channelHref, ui }: { videos: ProductVideo[]; channelHref: string; ui: Ui }) {
  const count = videos.length;
  const [index, setIndex] = useState(count > 1 ? 1 : 0);
  const [paused, setPaused] = useState(false);
  if (!count) return null;
  const go = (i: number) => setIndex((i + count) % count);

  return (
    <section className="mt-[117px] text-rotenso-grey">
      <h2 className="text-center text-h1 leading-[1.2] font-light">{ui.multimedia}</h2>
      <div className="relative mt-[50px] h-[508px] overflow-x-clip">
        <div
          className="absolute top-0 left-[calc(50%-260px)] flex items-start gap-[50px] transition-transform duration-700"
          style={{ transform: `translateX(${-index * (SIDE_W + GAP)}px)` }}
        >
          {videos.map((v, i) => {
            const active = i === index;
            return (
              <div
                key={v.id + i}
                onClick={active ? undefined : () => go(i)}
                className={`shrink-0 transition-all duration-700 ${active ? "w-[530px]" : "mt-[30px] w-[420px] cursor-pointer opacity-50 hover:opacity-70"}`}
              >
                <a
                  href={v.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  tabIndex={active ? 0 : -1}
                  onClick={active ? undefined : (e) => e.preventDefault()}
                  aria-label={v.title}
                  className="relative block aspect-video overflow-hidden rounded-[16px] bg-[#c4c4c4]"
                >
                  <Image src={v.image} alt="" fill sizes="530px" className="object-cover" />
                  {active && (
                    <span className="absolute inset-x-0 bottom-0 h-[5px]">
                      <span
                        key={index}
                        className="hero-progress absolute inset-y-0 left-0 bg-rotenso-red"
                        style={{ animationDuration: `${CARD_MS}ms`, animationPlayState: paused ? "paused" : "running" }}
                        onAnimationEnd={() => go(index + 1)}
                      />
                    </span>
                  )}
                </a>
                {active && (
                  <div className="relative">
                    <PlayPause paused={paused} onToggle={() => setPaused((p) => !p)} ui={ui} className="absolute -top-[49px] right-[20px]" />
                  </div>
                )}
                <div className={active ? "flex flex-col gap-[10px] p-[30px]" : "flex flex-col gap-[5px] px-[23px] pt-[20px]"}>
                  <h3
                    className={`font-light whitespace-pre-line ${active ? "text-[25px] leading-[34px]" : "text-[18.75px] leading-[25.5px]"}`}
                  >
                    {v.title}
                  </h3>
                  <p className={`line-clamp-3 whitespace-pre-line ${active ? "text-[16px] leading-[24px]" : "text-[12px] leading-[18px]"}`}>
                    {v.text}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {channelHref && (
        <div className="mt-[50px] flex justify-center">
          <Button variant="m-red" href={channelHref}>
            {ui.moreVideos}
          </Button>
        </div>
      )}
    </section>
  );
}

