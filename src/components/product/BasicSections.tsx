"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { diagonalGradient } from "@/components/home/SectionBackdrop";
import { FramedImage } from "@/components/ui/FramedImage";
import { Media } from "@/components/ui/Media";
import type { Ui } from "@/i18n/ui";
import { PlayPause } from "./PlayPause";

// Figma: "Klimatyzacja Basic v02" (5172:71496), sections that exist only on Basic pages.

type Row = { image: string | null; video?: string | null; title: string; text: string };

// Film (860×484) + text on the dark gradient band (#7695A6 → #546670 → #3A4952), sides
// alternating. The pause icon and red line in Figma mark a looping film.
export function FeatureRows({ rows, ui }: { rows: Row[]; ui: Ui }) {
  if (!rows.length) return null;
  return (
    <section className="mt-[80px] bg-[linear-gradient(126deg,#7695a6,#546670_49.5%,#3a4952)] py-[150px]">
      <div className="mx-auto flex w-[1300px] max-w-[calc(100%-32px)] flex-col gap-[150px]">
        {rows.map((r, i) => (
          <FeatureRow key={i} row={r} flip={i % 2 === 1} ui={ui} />
        ))}
      </div>
    </section>
  );
}

function FeatureRow({ row, flip, ui }: { row: Row; flip: boolean; ui: Ui }) {
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  return (
    <div className={`flex items-center ${flip ? "flex-row-reverse" : ""}`}>
      <div className="relative h-[484px] w-[860px] shrink-0 overflow-hidden rounded-[32px] bg-[#c4c4c4] shadow-dark-l">
        <Media image={row.image} video={row.video} sizes="860px" playing={!paused} onProgress={setProgress} />
        {row.video && (
          <>
            <PlayPause paused={paused} onToggle={() => setPaused((p) => !p)} ui={ui} className="absolute right-[30px] bottom-[30px]" />
            <span className="absolute inset-x-0 bottom-0 h-[5px]">
              <span className="absolute inset-y-0 left-0 bg-rotenso-red" style={{ width: `${progress * 100}%` }} />
            </span>
          </>
        )}
      </div>
      <div className={`flex flex-1 flex-col gap-[20px] text-white ${flip ? "pr-[80px] pl-[30px]" : "pl-[50px]"}`}>
        <h3 className="text-h2 leading-[1.2] font-light whitespace-pre-line">{row.title}</h3>
        <p className="text-[16px] leading-[24px] whitespace-pre-line">{row.text}</p>
      </div>
    </div>
  );
}

// "Dodatkowe zalety": 3 cards 420 wide (photo 236 + white panel) on the grey-white gradient.
export function Benefits({ title, items }: { title: string; items: { image: string | null; title: string; text: string }[] }) {
  if (!items.length) return null;
  return (
    <section className="mt-[150px] pt-[100px] pb-[150px] text-rotenso-grey" style={{ backgroundImage: diagonalGradient(892) }}>
      <h2 className="text-center text-h1 leading-[1.2] font-light">{title}</h2>
      <div className="mx-auto mt-[50px] flex w-[1300px] max-w-[calc(100%-32px)] justify-center gap-[20px]">
        {items.map((b, i) => (
          <article key={i} className="flex w-[420px] flex-col overflow-hidden rounded-[32px] bg-white shadow-dark-l">
            <div className="relative h-[236px] bg-grey-dd">
              <FramedImage src={b.image} sizes="420px" />
            </div>
            <div className="flex flex-1 flex-col gap-[20px] p-[30px]">
              <h3 className="text-h2 leading-[1.2] font-light whitespace-pre-line">{b.title}</h3>
              <p className="text-[16px] leading-[24px] whitespace-pre-line">{b.text}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

type Alternative = { kicker: string; name: string; text: string; image: string | null; href: string };

// "Warto rozważyć": other models — packshot 360×176, a 40px reason ("Lepsze grzanie"), the model
// name and a short text; the column links to the model's page.
export function Alternatives({ title, text, items }: { title: string; text: string; items: Alternative[] }) {
  if (!items.length) return null;
  return (
    <section className="mt-[150px] text-rotenso-grey">
      <div className="mx-auto flex w-[1300px] max-w-[calc(100%-32px)] flex-col items-center gap-[10px] text-center font-light">
        <h2 className="text-h1 leading-[1.2]">{title}</h2>
        {text && <p className="text-h3 leading-[1.36]">{text}</p>}
      </div>
      <div className="mx-auto mt-[50px] grid w-[1300px] max-w-[calc(100%-32px)] grid-cols-3 gap-[20px]">
        {items.map((a, i) => (
          <Link key={i} href={a.href || "#"} className="group flex flex-col px-[30px]">
            <span className="relative h-[176px]">{a.image && <Image src={a.image} alt={a.name} fill sizes="360px" className="object-contain" />}</span>
            <span className="mt-[50px] text-h2 leading-[1.2] font-light">{a.kicker}</span>
            <span className="mt-[20px] text-h3 leading-[1.36] font-light transition-colors group-hover:text-rotenso-red">{a.name}</span>
            <span className="mt-[10px] text-[16px] leading-[24px]">{a.text}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
