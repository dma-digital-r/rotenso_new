"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Media } from "@/components/ui/Media";
import type { AssistantContent } from "@/lib/content";

// Figma "Doboromierz Start": three 420×524 cards (r32) — photo, centred title, text and
// buttons ("Rozpocznij"; the AC card has two — Split and Multi Split tools); on hover the card's background film plays ("Hover odtwarzane wideo w tle").
export function AssistantCards({ cards }: { cards: AssistantContent["cards"] }) {
  const [hover, setHover] = useState<number | null>(null);
  return (
    <div className="mt-[50px] flex flex-wrap justify-center gap-[20px]">
      {cards.map((c, i) => (
        <div
          key={c.title}
          onMouseEnter={() => setHover(i)}
          onMouseLeave={() => setHover(null)}
          onFocus={() => setHover(i)}
          onBlur={() => setHover(null)}
          className="relative flex h-[524px] w-[420px] flex-col items-center justify-center overflow-hidden rounded-[32px] bg-rotenso-grey px-[30px] text-center text-white shadow-dark-l"
        >
          <Media image={c.image} video={c.video || undefined} sizes="420px" playing={hover === i} />
          <span aria-hidden className="absolute inset-0 bg-black/20" />
          <div className="relative flex flex-col items-center">
            <h2 className="text-[calc(48px*var(--heading-scale))] leading-[1.2] font-light whitespace-pre-line">{c.title}</h2>
            {c.text && <p className="mt-[20px] text-[16px] leading-[24px]">{c.text}</p>}
            {c.buttons.length > 0 && (
              <div className="mt-[30px] flex flex-wrap justify-center gap-[10px]">
                {c.buttons.map((b) => (
                  <Button key={b.href} variant="m-red" href={b.href}>
                    {b.label}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
