"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
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
export function WentiloControl({ data, ui }: { data: WentiloContent["control"]; ui: Ui }) {
  const [open, setOpen] = useState(false);
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
        {data.button.label && (data.button.href || data.compare.rows.length > 0) && (
          <Button
            variant="s-outline-white"
            href={data.button.href || undefined}
            onClick={data.button.href ? undefined : () => setOpen(true)}
            aria-haspopup={data.button.href ? undefined : "dialog"}
            className="mt-[30px] !px-[18px] !py-[12px] !text-[16px]"
          >
            {data.button.label}
          </Button>
        )}
      </div>
      {open && <CompareDialog data={data.compare} onClose={() => setOpen(false)} ui={ui} />}
    </section>
  );
}

// Figma "Popup iEDGE": white 1300 window (r32) over the page dimmed to 70% black — title, two
// system columns and the comparison rows (grey every other row).
function CompareDialog({ data, onClose, ui }: { data: WentiloContent["control"]["compare"]; onClose: () => void; ui: Ui }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (!dialog.open) dialog.showModal();
    const root = document.documentElement;
    const overflow = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = overflow;
    };
  }, []);
  const cell = (title: string, text: string) => (
    <>
      {title && <span className="block font-bold">{title}</span>}
      {text && <span className="block whitespace-pre-line">{text}</span>}
    </>
  );
  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      aria-labelledby="compare-title"
      className="m-auto max-h-[calc(100svh-40px)] w-[1300px] max-w-[calc(100%-32px)] overflow-y-auto overscroll-contain rounded-[32px] bg-white px-[50px] pt-[50px] pb-[40px] text-rotenso-grey backdrop:bg-[rgb(0_0_0/0.7)]"
    >
      <button type="button" onClick={onClose} aria-label={ui.close} className="absolute top-[30px] right-[30px] flex size-[30px] cursor-pointer items-center justify-center">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
          <path d="M3 3L13 13M13 3L3 13" stroke="#546670" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      </button>
      <h2 id="compare-title" className="text-center text-h3 leading-[1.36] font-light whitespace-pre-line">
        {data.title}
      </h2>
      <table className="mt-[40px] w-full border-collapse text-[16px] leading-[24px]">
        <thead>
          <tr className="border-b border-rotenso-grey">
            <th className="w-[210px]" />
            <th className="px-[20px] pb-[10px] text-center font-bold whitespace-pre-line">{data.standardHead}</th>
            <th className="px-[20px] pb-[10px] text-center font-bold whitespace-pre-line">{data.smartHead}</th>
          </tr>
        </thead>
        <tbody>
          {data.rows.map((r, i) => (
            <tr key={i} className={i % 2 ? "" : "bg-[#f3f3f3]"}>
              <th scope="row" className="px-[10px] py-[20px] text-left font-bold">
                {r.label}
              </th>
              <td className="px-[20px] py-[20px] text-center">{cell(r.standardTitle, r.standardText)}</td>
              <td className="px-[20px] py-[20px] text-center">{cell(r.smartTitle, r.smartText)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </dialog>
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


// "Wybierz rekuperator" (Figma "wentilo e-commerce"): white card with Opis / Specyfikacja /
// Do pobrania for every Wentilo ICON model in the feed. The final selectors (area, recovery,
// control system), the control panel choice and the price are still to come.
const HOUSING_ORDER = ["IT", "IS", "IC"];
export function WentiloShop({
  data,
  models,
  ui,
}: {
  data: WentiloContent["shop"];
  models: import("@/lib/wentilo").WentiloModel[];
  ui: Ui;
}) {
  const [tab, setTab] = useState<"opis" | "spec" | "files">("opis");
  const [openTech, setOpenTech] = useState<number | null>(0);
  const [openParts, setOpenParts] = useState({ tech: true, mount: true, spec: true });
  // Temporary model choice (all Wentilo ICON models from the feed) until the final selectors —
  // area, recovery type, control system — are specified.
  const [index, setIndex] = useState(0);
  const model = models[index] ?? models[0];
  if (!model) return null;
  const half = Math.ceil(model.specs.length / 2);
  const toggle = (id: keyof typeof openParts) => setOpenParts((p) => ({ ...p, [id]: !p[id] }));

  return (
    <section id="wybierz" className="mt-[150px] scroll-mt-[160px] text-rotenso-grey">
      <div className="mx-auto flex w-[1300px] max-w-[calc(100%-32px)] flex-col items-center gap-[10px] text-center font-light">
        <h2 className="text-h1 leading-[1.2]">{data.title}</h2>
        {data.text && <p className="text-h3 leading-[1.36]">{data.text}</p>}
      </div>
      <div className="mx-[20px] mt-[50px] rounded-[32px] bg-white p-[30px] shadow-dark-l">
        <div role="tablist" className="flex h-[50px] w-[470px] max-w-full items-center gap-[5px] rounded-[25px] bg-grey-f0 p-[5px]">
          {(
            [
              ["opis", data.tabDescription],
              ["spec", ui.tabSpecs],
              ["files", ui.tabDownloads],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={tab === key}
              onClick={() => setTab(key)}
              className={`h-[40px] flex-1 cursor-pointer rounded-[20px] text-[16px] leading-[normal] transition-colors ${tab === key ? "bg-rotenso-grey text-white" : "hover:text-rotenso-red"}`}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="mt-[30px] flex flex-wrap items-center gap-[10px]">
          {HOUSING_ORDER.filter((h) => models.some((m) => m.housing === h)).map((h) => {
            const on = model.housing === h;
            return (
              <button
                key={h}
                type="button"
                aria-pressed={on}
                onClick={() => setIndex(models.findIndex((m) => m.housing === h))}
                className={`h-[40px] cursor-pointer rounded-[20px] border px-[20px] text-[16px] leading-[normal] transition-colors ${
                  on ? "border-rotenso-grey bg-rotenso-grey text-white" : "border-rotenso-grey hover:text-rotenso-red"
                }`}
              >
                Wentilo ICON {h}
              </button>
            );
          })}
          <div className="relative">
            <select
              value={index}
              onChange={(e) => setIndex(Number(e.target.value))}
              aria-label={data.title}
              className="h-[40px] cursor-pointer appearance-none rounded-[8px] border border-grey-dd bg-[#f5f5f5] pr-[45px] pl-[15px] text-[16px] leading-[normal]"
            >
              {models.map((m, i) =>
                m.housing === model.housing ? (
                  <option key={m.prefix} value={i}>
                    {m.prefix}
                  </option>
                ) : null,
              )}
            </select>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden className="pointer-events-none absolute top-[8px] right-[12px]">
              <path d="M6 9L12 15L18 9" stroke="#546670" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
        <h3 className="mt-[30px] text-h2 leading-[1.2] font-light">{model.name}</h3>

        {tab === "opis" && model.description && <p className="mt-[20px] max-w-[860px] text-[16px] leading-[24px] whitespace-pre-line">{model.description}</p>}

        {tab === "spec" && (
          <>
            {data.technologies.length > 0 && (
              <Part title={data.technologiesTitle} open={openParts.tech} onToggle={() => toggle("tech")}>
                <div className="grid grid-cols-5 gap-[10px]">
                  {data.technologies.map((t, i) => {
                    const on = openTech === i && !!t.long;
                    return (
                      <div key={t.name} className="relative flex min-h-[155px] flex-col items-center justify-center rounded-[16px] border border-grey-dd px-[20px] py-[20px] text-center">
                        {t.long && (
                          <button
                            type="button"
                            onClick={() => setOpenTech(on ? null : i)}
                            aria-expanded={on}
                            aria-label={on ? ui.close : ui.moreInfo}
                            className="absolute top-[15px] right-[15px] cursor-pointer"
                          >
                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden className={`transition-transform ${on ? "rotate-45" : ""}`}>
                              <path d="M9 2V16M2 9H16" stroke="#546670" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                          </button>
                        )}
                        {!on && t.icon && <Image src={t.icon} alt="" width={40} height={34} className="h-[34px] w-auto" />}
                        <p className="mt-[8px] text-[25px] leading-[normal] font-light">{t.name}</p>
                        <p className={on ? "mt-[8px] text-[12px] leading-[16px]" : "mt-[6px] text-[16px] leading-[22px]"}>{on ? t.long : t.short}</p>
                      </div>
                    );
                  })}
                </div>
              </Part>
            )}
            {data.mounts.length > 0 && (
              <Part title={data.mountTitle} open={openParts.mount} onToggle={() => toggle("mount")}>
                <div className="flex justify-center gap-[60px]">
                  {data.mounts.map((m) => (
                    <div key={m.title} className="flex w-[600px] flex-col items-center text-center">
                      <div className="relative h-[338px] w-full">
                        <FramedImage src={m.image} sizes="600px" className="!object-contain" />
                      </div>
                      <p className="mt-[20px] text-h3 leading-[1.36] font-light">{m.title}</p>
                      <p className="text-[16px] leading-[24px]">{m.text}</p>
                    </div>
                  ))}
                </div>
              </Part>
            )}
            {model.specs.length > 0 && (
              <Part title={data.specTitle} open={openParts.spec} onToggle={() => toggle("spec")}>
                <div className="grid grid-cols-2 gap-x-[40px]">
                  {[model.specs.slice(0, half), model.specs.slice(half)].map((col, c) => (
                    <dl key={c}>
                      {col.map((r, i) => (
                        <div key={i} className="flex gap-[20px] border-b border-grey-dd py-[10px] text-[16px] leading-[24px]">
                          <dt className="w-[62%]">{r.label}</dt>
                          <dd className="flex-1">{r.value}</dd>
                        </div>
                      ))}
                    </dl>
                  ))}
                </div>
              </Part>
            )}
          </>
        )}

        {tab === "files" &&
          (model.downloads.length ? (
            model.downloads.map((d) => (
              <div key={d.symbol} className="mt-[50px]">
                <p className="text-[25px] leading-[normal] font-bold">{d.symbol}</p>
                {d.documents.length ? (
                  <ul className="mt-[20px] grid grid-cols-4 gap-[20px]">
                    {d.documents.map((doc) => (
                      <li key={doc.url}>
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex h-[60px] items-center gap-[10px] rounded-[8px] border border-rotenso-grey px-[20px] font-bold transition-colors hover:bg-grey-f0"
                        >
                          <span className="line-clamp-2 flex-1 text-[16px] leading-[20px]">{doc.label}</span>
                          <Image src="/icons/download.svg" alt="" width={24} height={24} />
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-[20px] text-[16px] leading-[24px]">{ui.noDownloads}</p>
                )}
              </div>
            ))
          ) : (
            <p className="mt-[30px] text-[16px] leading-[24px]">{ui.noDownloads}</p>
          ))}
      </div>
    </section>
  );
}

function Part({ title, open, onToggle, children }: { title: string; open: boolean; onToggle: () => void; children: React.ReactNode }) {
  return (
    <div className="mt-[50px]">
      <button type="button" onClick={onToggle} aria-expanded={open} className="flex cursor-pointer items-center gap-[15px] text-[25px] leading-[normal] font-bold">
        {title}
        <svg width="14" height="8" viewBox="0 0 14 8" fill="none" aria-hidden className={`transition-transform ${open ? "" : "rotate-180"}`}>
          <path d="M1 7L7 1L13 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && <div className="mt-[30px]">{children}</div>}
    </div>
  );
}
