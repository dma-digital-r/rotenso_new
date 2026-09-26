"use client";

import { useState } from "react";
import { FramedImage } from "@/components/ui/FramedImage";
import type { Ui } from "@/i18n/ui";
import type { FiltersContent } from "@/lib/content";

// "Kup filtry iCare": text, model switch (grey bar, active dark) and the model's filters —
// 310-wide white cards (photo 310×174, title, text, shop button) in rows of three.
export function FilterShop({ data }: { data: FiltersContent["shop"] }) {
  const [model, setModel] = useState(0);
  if (!data.models.length) return null;
  const items = data.models[model]?.items ?? [];
  return (
    <section id="kup" className="mt-[150px] scroll-mt-[120px] text-rotenso-grey">
      <div className="mx-auto flex w-[860px] max-w-[calc(100%-32px)] flex-col items-center text-center">
        <h2 className="text-h1 leading-[1.2] font-light">{data.title}</h2>
        {data.text && <p className="mt-[10px] text-[16px] leading-[24px] whitespace-pre-line">{data.text}</p>}
        {data.prompt && <p className="mt-[24px] text-[16px] leading-[24px]">{data.prompt}</p>}
      </div>
      {data.models.length > 1 && (
        <div role="tablist" className="mx-auto mt-[40px] flex h-[50px] w-[640px] max-w-[calc(100%-32px)] items-center gap-[10px] rounded-[25px] bg-grey-f0 p-[5px]">
          {data.models.map((m, i) => (
            <button
              key={m.name}
              type="button"
              role="tab"
              aria-selected={i === model}
              onClick={() => setModel(i)}
              className={`h-[40px] flex-1 cursor-pointer rounded-[20px] text-[16px] leading-[normal] transition-colors ${i === model ? "bg-rotenso-grey text-white" : "hover:text-rotenso-red"}`}
            >
              {m.name}
            </button>
          ))}
        </div>
      )}
      <div className="mx-auto mt-[50px] grid w-[970px] max-w-[calc(100%-32px)] grid-cols-[repeat(auto-fill,310px)] justify-center gap-[20px]">
        {items.map((f, i) => (
          <div key={`${model}-${i}`} className="flex flex-col overflow-hidden rounded-[16px] bg-white shadow-dark-l">
            <div className="relative h-[174px] shrink-0 bg-grey-f0">
              <FramedImage src={f.image} sizes="310px" />
            </div>
            <div className="flex flex-1 flex-col items-start p-[30px]">
              <h3 className="text-h3 leading-[1.36] font-light">{f.title}</h3>
              {f.text && <p className="mt-[10px] text-[16px] leading-[24px] whitespace-pre-line">{f.text}</p>}
              {f.href && data.button && (
                <div className="mt-auto pt-[20px]">
                  <a
                    href={f.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-[41px] items-center rounded-[21px] bg-rotenso-red px-[18px] text-[16px] leading-[normal] font-bold whitespace-nowrap text-white transition-opacity hover:opacity-85"
                  >
                    <span className="text-trim">{data.button}</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

const youtubeId = (url: string) => url.match(/(?:youtu\.be\/|v=|shorts\/|embed\/)([\w-]{11})/)?.[1] ?? null;

// Instruction film, 970×545 (r32): poster with a play button; YouTube links play in an embed,
// MP4 files in the page's own player.
export function FilterVideo({ data, ui }: { data: FiltersContent["video"]; ui: Ui }) {
  const [playing, setPlaying] = useState(false);
  const yt = youtubeId(data.url);
  return (
    <div className="relative mx-auto mt-[50px] aspect-[970/545] w-[970px] max-w-[calc(100%-32px)] overflow-hidden rounded-[32px] bg-rotenso-grey">
      {playing && yt ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${yt}?autoplay=1&rel=0`}
          title={data.title}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          className="absolute inset-0 size-full border-0"
        />
      ) : playing ? (
        <video src={data.url} poster={data.poster ?? undefined} controls autoPlay playsInline className="absolute inset-0 size-full object-cover" />
      ) : (
        <>
          <FramedImage src={data.poster} sizes="970px" />
          {data.url && (
            <button type="button" onClick={() => setPlaying(true)} aria-label={ui.play} className="absolute inset-0 flex cursor-pointer items-center justify-center">
              <svg width="80" height="80" viewBox="0 0 80 80" fill="none" aria-hidden className="transition-transform hover:scale-105">
                <circle cx="40" cy="40" r="38.5" stroke="white" strokeWidth="3" />
                <path d="M32 26L56 40L32 54V26Z" fill="white" />
              </svg>
            </button>
          )}
        </>
      )}
    </div>
  );
}
