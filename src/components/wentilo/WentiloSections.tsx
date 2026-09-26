"use client";

import Image from "next/image";
import { useState } from "react";
import { PlayPause } from "@/components/product/PlayPause";
import { ProductVideos, type ProductVideo } from "@/components/product/ProductVideos";
import { Button } from "@/components/ui/Button";
import { FramedImage } from "@/components/ui/FramedImage";
import { Media, SlideTimer } from "@/components/ui/Media";
import type { Ui } from "@/i18n/ui";
import type { WentiloContent } from "@/lib/content";

// Figma: "Wentilo v04" — sections of the Wentilo recuperation page.

// Frosted bar under the hero (sticks under the top bar): section shortcuts, CTAs, comparison.
export function WentiloBar({ items, lang, ui }: { items: WentiloContent["bar"]; lang: string; ui: Ui }) {
  const [first, ...rest] = items;
  const extra = rest.length > 3 ? rest.slice(3) : [];
  const main = [first, ...rest.slice(0, 3)].filter(Boolean);
  return (
    <div className="sticky top-[85px] z-30 mx-auto mt-[80px] w-[1300px] max-w-[calc(100%-32px)] pt-[20px]">
      <div className="flex h-[50px] items-center justify-between rounded-[8px] bg-white/80 px-[20px] shadow-[0_4px_10px_rgba(0,0,0,0.15)] backdrop-blur-[20px]">
        <nav className="flex h-[30px] items-center gap-[20px] text-[16px] leading-[normal] text-rotenso-grey">
          {main.map((b, i) => (
            <a key={b.href} href={b.href} className={i === 0 ? "font-bold" : "hover:text-rotenso-red"}>
              {b.label}
            </a>
          ))}
          {extra.length > 0 && <span aria-hidden className="h-[30px] w-px bg-rotenso-grey" />}
          {extra.map((b) => (
            <a key={b.href} href={b.href} className="hover:text-rotenso-red">
              {b.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-[20px] text-[16px] leading-[normal] text-rotenso-grey">
          <div className="flex items-center gap-[10px]">
            <Button variant="s-red" href="#wycena">
              {ui.askInstall}
            </Button>
            <Button variant="s-red" href={`/${lang}/znajdz-instalatora`} className="bg-rotenso-grey!">
              {ui.findInstaller}
            </Button>
          </div>
          <span className="flex items-center gap-[10px]">
            {ui.compare}: 0/3
            <svg width="12" height="6" viewBox="0 0 12 6" fill="none" aria-hidden>
              <path d="M1 1L6 5L11 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
      </div>
    </div>
  );
}

// "Co to jest rekuperacja?": photo band, glass text box (420) beside the 860×484 film with pause
// and red timer; the kingfisher flies out of the band's lower-left corner.
export function WentiloAbout({ data, ui }: { data: WentiloContent["about"]; ui: Ui }) {
  const [playing, setPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  return (
    <section id="o-rekuperacji" className="relative -mt-[70px] h-[960px] scroll-mt-[80px]">
      <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden bg-[#10251c]">
        <FramedImage src={data.background} sizes="100vw" />
      </div>
      <div className="mx-auto w-[1300px] max-w-[calc(100%-32px)] pt-[150px] text-white">
        <h2 className="text-center text-h1 leading-[1.2] font-light">{data.title}</h2>
        <div className="mt-[50px] flex gap-[20px]">
          <div className="w-[420px] shrink-0 rounded-[32px] bg-black/50 p-[30px] backdrop-blur-[20px]">
            <p className="text-h2 leading-[1.2] font-light">{data.boxTitle}</p>
            <p className="mt-[10px] text-h3 leading-[1.36] font-light whitespace-pre-line">{data.boxSubtitle}</p>
            <p className="mt-[20px] text-[16px] leading-[24px] whitespace-pre-line">{data.boxText}</p>
          </div>
          <div className="relative h-[484px] flex-1 overflow-hidden rounded-[16px] bg-rotenso-grey">
            <Media image={data.image} video={data.video || undefined} sizes="860px" playing={playing} onProgress={setProgress} />
            {data.video && (
              <>
                <PlayPause paused={!playing} onToggle={() => setPlaying((p) => !p)} ui={ui} className="absolute right-[30px] bottom-[30px]" />
                <SlideTimer ms={0} film progress={progress} paused={!playing} onDone={() => {}} slideKey="about" />
              </>
            )}
          </div>
        </div>
      </div>
      <Image
        src="/images/wentilo/kingfisher-left.webp"
        alt=""
        width={437}
        height={437}
        className="pointer-events-none absolute bottom-[-160px] left-[183px] z-10 drop-shadow-[50px_50px_25px_rgba(0,0,0,0.25)]"
      />
    </section>
  );
}

// "Wentylacja mechaniczna": three white cards (photo 236, title, text); a dark band starts
// behind their lower half and carries on into the "Wentilo ICON" section.
export function WentiloMechanical({ data }: { data: WentiloContent["mechanical"] }) {
  return (
    <section className="relative mt-[150px] text-rotenso-grey">
      <div className="mx-auto flex w-[1300px] max-w-[calc(100%-32px)] flex-col items-center gap-[10px] text-center font-light">
        <h2 className="text-h1 leading-[1.2]">{data.title}</h2>
        {data.text && <p className="text-h3 leading-[1.36]">{data.text}</p>}
      </div>
      <div className="relative mx-auto mt-[50px] flex w-[1300px] max-w-[calc(100%-32px)] justify-center gap-[20px]">
        {data.items.map((c) => (
          <div key={c.title} className="flex w-[420px] flex-col overflow-hidden rounded-[32px] bg-white shadow-dark-l">
            <div className="relative h-[236px] shrink-0 bg-grey-dd">
              <FramedImage src={c.image} sizes="420px" />
            </div>
            <div className="px-[30px] pt-[30px] pb-[50px]">
              <h3 className="text-h2 leading-[1.2] font-light whitespace-pre-line">{c.title}</h3>
              <p className="mt-[20px] text-[16px] leading-[24px]">{c.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// "Odzysk ciepła i wilgoci": light rounded 1820 box with leaves and a kingfisher; white tab card
// (420) on the left, the tab's 860×484 photo on the right.
export function WentiloRecovery({ data }: { data: WentiloContent["recovery"] }) {
  const [tab, setTab] = useState(0);
  const cur = data.tabs[tab];
  if (!cur) return null;
  return (
    <section className="relative mx-[50px] mt-[150px] rounded-[32px] bg-[#eef1f6] pt-[110px] pb-[155px] text-rotenso-grey">
      <div aria-hidden className="absolute inset-0 overflow-hidden rounded-[32px]">
        <FramedImage src={data.background} sizes="100vw" />
      </div>
      <Image src="/images/wentilo/recovery-leaves.webp" alt="" width={1400} height={750} aria-hidden className="pointer-events-none absolute -bottom-[60px] -left-[50px] w-[760px]" />
      <Image
        src="/images/wentilo/kingfisher-right.webp"
        alt=""
        width={350}
        height={350}
        aria-hidden
        className="pointer-events-none absolute top-[0px] right-[40px] w-[350px] drop-shadow-[50px_50px_25px_rgba(0,0,0,0.25)]"
      />
      <div className="relative mx-auto w-[1300px] max-w-[calc(100%-32px)]">
        <div className="flex flex-col items-center gap-[10px] text-center font-light">
          <h2 className="text-h1 leading-[1.2]">{data.title}</h2>
          {data.text && <p className="text-h3 leading-[1.36]">{data.text}</p>}
        </div>
        <div className="mt-[50px] flex items-start gap-[20px]">
          <div className="min-h-[484px] w-[420px] shrink-0 rounded-[32px] bg-white p-[30px] shadow-dark-l">
            {data.tabs.length > 1 && (
              <div role="tablist" className="flex h-[50px] items-center gap-[5px] rounded-[25px] bg-grey-f0 p-[5px]">
                {data.tabs.map((t, i) => (
                  <button
                    key={t.label}
                    type="button"
                    role="tab"
                    aria-selected={i === tab}
                    onClick={() => setTab(i)}
                    className={`h-[40px] flex-1 cursor-pointer rounded-[20px] text-[14px] leading-[normal] transition-colors ${i === tab ? "bg-rotenso-grey text-white" : "hover:text-rotenso-red"}`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            )}
            <p className="mt-[20px] text-h2 leading-[1.2] font-light">{cur.title}</p>
            <p className="mt-[20px] text-[14px] leading-[21px] whitespace-pre-line">{cur.text}</p>
          </div>
          <div className="relative h-[484px] flex-1 overflow-hidden rounded-[32px] bg-grey-dd">
            <FramedImage key={tab} src={cur.image} sizes="860px" />
          </div>
        </div>
      </div>
    </section>
  );
}

// "Systemy sterowania": dark 1820 box; two glass cards (150px icon, title, text), a note and a
// white outline button.
export function WentiloControl({ data }: { data: WentiloContent["control"] }) {
  return (
    <section id="sterowanie" className="relative mx-[50px] mt-[100px] scroll-mt-[160px] overflow-hidden rounded-[32px] bg-[#071722] py-[120px] text-white">
      <div aria-hidden className="absolute inset-0">
        <FramedImage src={data.background} sizes="100vw" />
      </div>
      <div className="relative mx-auto flex w-[1300px] max-w-[calc(100%-32px)] flex-col items-center text-center">
        <h2 className="text-h1 leading-[1.2] font-light">{data.title}</h2>
        {data.text && <p className="mt-[10px] text-h3 leading-[1.36] font-light">{data.text}</p>}
        <div className="mt-[50px] flex w-full gap-[20px] text-left">
          {data.items.map((it) => (
            <div key={it.title} className="flex flex-1 gap-[30px] rounded-[32px] bg-black/40 p-[30px] backdrop-blur-[20px]">
              <div className="relative size-[150px] shrink-0 overflow-hidden rounded-[16px] border border-white/70">
                <FramedImage src={it.icon} sizes="150px" />
              </div>
              <div>
                <p className="text-h3 leading-[1.36] font-light">{it.title}</p>
                <p className="mt-[10px] text-[16px] leading-[24px]">{it.text}</p>
              </div>
            </div>
          ))}
        </div>
        {data.note && <p className="mt-[50px] text-[16px] leading-[24px]">{data.note}</p>}
        {data.button.label && data.button.href && (
          <Button variant="s-outline-white" href={data.button.href} className="mt-[30px] !px-[18px] !py-[12px] !text-[16px]">
            {data.button.label}
          </Button>
        )}
      </div>
    </section>
  );
}

// "Rodzina rekuperatorów Wentilo": photo of the models on the warm band, then one card per
// model — area, text, capacities, mounting options (buttons switch the photo).
export function WentiloFamily({ data }: { data: WentiloContent["family"] }) {
  return (
    <section id="modele" className="relative mt-[50px] scroll-mt-[80px] bg-[#f3f3f3] pb-[150px] text-rotenso-grey">
      <div className="relative h-[1080px] overflow-hidden bg-[#9c948d]">
        <FramedImage src={data.background} sizes="100vw" />
        <div className="relative mx-auto flex w-[1300px] max-w-[calc(100%-32px)] flex-col items-center pt-[110px] text-center font-light text-white">
          <h2 className="text-h1 leading-[1.2]">{data.title}</h2>
          {data.text && <p className="mt-[10px] text-h3 leading-[1.36] whitespace-pre-line">{data.text}</p>}
        </div>
      </div>
      <div className="relative mx-auto -mt-[170px] flex w-[1300px] max-w-[calc(100%-32px)] justify-center gap-[20px]">
        {data.models.map((m) => (
          <ModelCard key={m.name} model={m} />
        ))}
      </div>
    </section>
  );
}

function ModelCard({ model }: { model: WentiloContent["family"]["models"][number] }) {
  const [mount, setMount] = useState(0);
  const cur = model.mounts[mount];
  return (
    <div className="flex w-[420px] flex-col rounded-[32px] bg-[#f3f3f3] p-[30px] shadow-dark-l">
      <h3 className="text-h2 leading-[1.2] font-light">{model.name}</h3>
      {model.area && <p className="mt-[10px] text-[16px] leading-[24px] font-bold">{model.area}</p>}
      {model.text && <p className="mt-[20px] text-[16px] leading-[24px]">{model.text}</p>}
      {model.capacities.length > 0 && (
        <>
          <p className="mt-[20px] text-h3 leading-[1.36] font-light">{model.capacityTitle}</p>
          <p className="mt-[5px] text-[16px] leading-[24px]">{model.capacityText}</p>
          <div className="mt-[10px] flex">
            {model.capacities.map((c, i) => (
              <span key={c} className={`flex-1 py-[6px] text-center text-[16px] leading-[24px] ${i ? "border-l border-rotenso-grey" : ""}`}>
                {c}
              </span>
            ))}
          </div>
        </>
      )}
      {model.mounts.length > 0 && (
        <>
          <p className="mt-[20px] text-h3 leading-[1.36] font-light">{model.mountTitle}</p>
          <div role="tablist" className="mt-[10px] flex gap-[10px]">
            {model.mounts.map((mo, i) => (
              <button
                key={mo.label}
                type="button"
                role="tab"
                aria-selected={i === mount}
                onClick={() => setMount(i)}
                className={`h-[40px] flex-1 cursor-pointer rounded-[4px] border text-[16px] leading-[normal] transition-colors ${
                  i === mount ? "border-rotenso-grey bg-rotenso-grey text-white" : "border-grey-dd bg-white hover:text-rotenso-red"
                }`}
              >
                {mo.label}
              </button>
            ))}
          </div>
          <div className="relative mt-[10px] h-[202px] overflow-hidden rounded-[16px] bg-grey-dd">
            <FramedImage key={mount} src={cur?.image ?? null} sizes="360px" />
          </div>
        </>
      )}
    </div>
  );
}

// "Multimedia" with one tab per model; each tab is the product-page video carousel.
export function WentiloVideos({ groups, more, ui }: { groups: { label: string; videos: ProductVideo[] }[]; more: { label: string; href: string }; ui: Ui }) {
  const [tab, setTab] = useState(Math.min(1, Math.max(0, groups.length - 1)));
  const cur = groups[tab];
  if (!cur) return null;
  const header = (
    <>
      <h2 className="text-center text-h1 leading-[1.2] font-light">{ui.multimedia}</h2>
      {groups.length > 1 && (
        <div role="tablist" className="mx-auto mt-[30px] flex h-[50px] w-[640px] max-w-[calc(100%-32px)] items-center gap-[10px] rounded-[25px] bg-grey-f0 p-[5px]">
          {groups.map((g, i) => (
            <button
              key={g.label}
              type="button"
              role="tab"
              aria-selected={i === tab}
              onClick={() => setTab(i)}
              className={`h-[40px] flex-1 cursor-pointer rounded-[20px] text-[16px] leading-[normal] transition-colors ${i === tab ? "bg-rotenso-grey text-white" : "hover:text-rotenso-red"}`}
            >
              {g.label}
            </button>
          ))}
        </div>
      )}
    </>
  );
  return <ProductVideos key={tab} videos={cur.videos} channelHref={more.href} ui={{ ...ui, moreVideos: more.label || ui.moreVideos }} header={header} />;
}

