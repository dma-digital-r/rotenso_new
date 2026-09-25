"use client";

import { useEffect, useState } from "react";
import type { TocItem } from "./ArticleBody";

// Figma: "Spis treści" column (310 wide, left of the text). Sticks under the top bar while
// reading; the section currently on screen is bold.
export function ArticleToc({ title, items }: { title: string; items: TocItem[] }) {
  const [active, setActive] = useState(items[0]?.id);

  useEffect(() => {
    const els = items.map((i) => document.getElementById(i.id)).filter(Boolean) as HTMLElement[];
    const onScroll = () => {
      const passed = els.filter((el) => el.getBoundingClientRect().top < 200);
      setActive((passed.at(-1) ?? els[0])?.id);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [items]);

  if (!items.length) return null;
  return (
    <nav aria-label={title} className="sticky top-[110px] flex w-[308px] flex-col gap-[20px] text-rotenso-grey">
      <p className="text-h3 leading-[1.36] font-light">{title}</p>
      <ol className="flex flex-col gap-[18px] text-[16px] leading-[24px]">
        {items.map((i) => (
          <li key={i.id}>
            <a href={`#${i.id}`} aria-current={active === i.id ? "location" : undefined} className={active === i.id ? "font-bold" : "hover:text-rotenso-red"}>
              {i.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
