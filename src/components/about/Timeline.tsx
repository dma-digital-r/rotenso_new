"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import type { Ui } from "@/i18n/ui";
import type { AboutContent } from "@/lib/content";

const PITCH = 550; // 310 column + 240 gap

// Figma: "Timeline" (5172:76647). Years in 310px columns, 550px apart, the active one at 100px
// left of the centre (x 860 at 1920). A grey line with 10px dots; the active year is red and
// bigger, with a 20px red dot and a red line leading to it. Arrows move one year at a time.
export function Timeline({ data, ui }: { data: AboutContent["timeline"]; ui: Ui }) {
  const [index, setIndex] = useState(0);
  const count = data.items.length;

  return (
    <section className="relative mt-[400px] text-rotenso-grey">
      <Icon name="about-swoosh" width={1077} height={859} className="pointer-events-none absolute -top-[99px] left-[50px] -z-10 opacity-10" />
      <div className="mx-auto flex w-[1300px] max-w-[calc(100%-32px)] flex-col items-center gap-[10px] text-center font-light">
        <h2 className="text-h1 leading-[1.2]">{data.title}</h2>
        <p className="text-h3 leading-[1.36]">{data.text}</p>
      </div>

      <div className="relative mt-[100px] h-[530px] overflow-x-clip">
        <span aria-hidden className="absolute top-[89px] left-[calc(50%-360px)] h-[2px] w-[7400px] bg-grey-dd" />
        <span aria-hidden className="absolute top-[89px] left-[calc(50%-360px)] h-[2px] w-[270px] bg-rotenso-red" />
        <ol
          className="absolute top-0 left-[calc(50%-100px)] flex gap-[240px] transition-transform duration-500"
          style={{ transform: `translateX(${-index * PITCH}px)` }}
        >
          {data.items.map((it, i) => {
            const on = i === index;
            return (
              <li key={it.year} className="relative w-[310px] shrink-0">
                <button
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-current={on}
                  className={`block cursor-pointer text-left ${on ? "text-h2 leading-[1.2] font-light text-rotenso-red" : "pt-[15px] text-h3 leading-[1.36]"}`}
                >
                  {it.year}
                </button>
                <span
                  aria-hidden
                  className={`absolute left-0 rounded-full ${on ? "top-[78px] size-[20px] bg-rotenso-red" : "top-[83px] size-[10px] bg-grey-dd"}`}
                />
                <div className="flex flex-col gap-[10px]" style={{ marginTop: on ? 80 : 78 }}>
                  <h3 className="text-h2 leading-[1.2] font-light">{it.title}</h3>
                  <p className="text-[16px] leading-[24px]">{it.text}</p>
                </div>
              </li>
            );
          })}
        </ol>
        <div className="absolute right-[calc(50%-650px)] bottom-0 flex gap-[20px]">
          <button type="button" aria-label={ui.prev} onClick={() => setIndex((i) => Math.max(0, i - 1))} disabled={index === 0} className="cursor-pointer disabled:cursor-default disabled:opacity-50">
            <Icon name="arrow-g2-left" width={30} height={30} />
          </button>
          <button type="button" aria-label={ui.next} onClick={() => setIndex((i) => Math.min(count - 1, i + 1))} disabled={index === count - 1} className="cursor-pointer disabled:cursor-default disabled:opacity-50">
            <Icon name="arrow-g2-right" width={30} height={30} />
          </button>
        </div>
      </div>
    </section>
  );
}
