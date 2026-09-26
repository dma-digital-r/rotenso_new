"use client";

import { useEffect, useState } from "react";
import { FramedImage } from "@/components/ui/FramedImage";
import type { Ui } from "@/i18n/ui";
import type { InvestmentsContent } from "@/lib/content";
import type { IndoorUnit, ProductEntry } from "@/lib/products";

// Figma: "Inwestycje Produkt v03" — sections of the RVF (outdoor unit) product page.

type Rvf = ProductEntry["rvf"];

// "Gdzie sprawdzi się ten system?": dark photo band, title, white tab bar, then 970×545 photos
// (r32) in a row starting 50px from the left edge; the active tab's photo comes first, its
// description under it. Clicking a photo or a tab activates it.
export function RvfUseCases({ data }: { data: Rvf["useCases"] }) {
  const [active, setActive] = useState(0);
  if (!data.items.length) return null;
  return (
    <section className="relative overflow-x-clip pt-[260px] text-rotenso-grey">
      <div aria-hidden className="absolute inset-x-0 top-0 -z-10 h-[955px] overflow-hidden bg-[#1d2a33]">
        <FramedImage src={data.background} sizes="100vw" />
      </div>
      <div className="mx-auto flex w-[1300px] max-w-[calc(100%-32px)] flex-col items-center gap-[10px] text-center font-light text-white">
        <h2 className="text-h1 leading-[1.2]">{data.title}</h2>
        {data.text && <p className="text-h3 leading-[1.36]">{data.text}</p>}
      </div>
      <div role="tablist" className="mx-auto mt-[150px] flex h-[50px] w-[1300px] max-w-[calc(100%-32px)] items-center gap-[10px] rounded-[25px] bg-white p-[5px]">
        {data.items.map((it, i) => (
          <button
            key={it.tab}
            type="button"
            role="tab"
            aria-selected={i === active}
            onClick={() => setActive(i)}
            className={`h-[40px] flex-1 cursor-pointer rounded-[20px] text-[16px] leading-[normal] transition-colors ${i === active ? "bg-rotenso-grey font-bold text-white" : "hover:text-rotenso-red"}`}
          >
            {it.tab}
          </button>
        ))}
      </div>
      <div className="mt-[50px] flex gap-[20px] pl-[50px] transition-transform duration-500" style={{ transform: `translateX(${-active * 990}px)` }}>
        {data.items.map((it, i) => (
          <button
            key={it.tab}
            type="button"
            onClick={() => setActive(i)}
            aria-label={it.tab}
            className="w-[970px] shrink-0 cursor-pointer text-left"
          >
            <span className="relative block h-[545px] overflow-hidden rounded-[32px] bg-grey-dd">
              <FramedImage src={it.image} sizes="970px" />
            </span>
            <span className="mt-[30px] block px-[90px] text-h3 leading-[1.36] font-light">{it.text}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

// "Dobierz jednostkę wewnętrzną": 310-wide cards — unit photo, name, text and the product sheet
// from the feed ("Pobierz kartę produktu", hidden when the feed has none).
export function RvfIndoor({ data, units, ui }: { data: Rvf["indoor"]; units: IndoorUnit[]; ui: Ui }) {
  if (!units.length) return null;
  return (
    <section className="mx-auto mt-[150px] w-[1300px] max-w-[calc(100%-32px)] text-rotenso-grey">
      <div className="flex flex-col items-center gap-[10px] text-center font-light">
        <h2 className="text-h1 leading-[1.2]">{data.title}</h2>
        {data.text && <p className="text-h3 leading-[1.36]">{data.text}</p>}
      </div>
      <div className="mt-[100px] grid grid-cols-[repeat(auto-fill,310px)] justify-between gap-x-[20px] gap-y-[70px]">
        {units.map((u, i) => (
          <div key={`${u.symbol}-${i}`} className="flex flex-col">
            <div className="relative h-[174px]">
              <FramedImage src={u.image} alt={u.name} sizes="310px" className="!object-contain" />
            </div>
            <h3 className="mt-[30px] text-h3 leading-[1.36] font-light">{u.name}</h3>
            {u.text && <p className="mt-[10px] text-[16px] leading-[24px] whitespace-pre-line">{u.text}</p>}
            {u.card && (
              <div className="mt-auto pt-[20px]">
                <a
                  href={u.card}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-[41px] items-center rounded-[21px] border border-rotenso-grey px-[18px] text-[16px] leading-[normal] font-bold whitespace-nowrap transition-colors hover:bg-rotenso-grey hover:text-white"
                >
                  <span className="text-trim">{ui.downloadCard}</span>
                </a>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

const field =
  "h-[49px] w-full rounded-[8px] border border-grey-dd bg-[#f5f5f5] px-[20px] text-[16px] leading-[24px] text-rotenso-grey placeholder:text-rotenso-grey focus:border-rotenso-grey focus:outline-none";

// "Rozwiązanie dla dużych obiektów": dark photo band with the title; below it a 1270-wide photo
// gallery (thumbnails with arrows) and the 530-wide lead card — investor / designer switch,
// texts and the investment form (field labels from Inwestycje → Oferujemy pomoc).
export function RvfLarge({ data, form, product, lang, ui }: { data: Rvf["large"]; form: InvestmentsContent["help"]; product: string; lang: string; ui: Ui }) {
  const [photo, setPhoto] = useState(0);
  const [tab, setTab] = useState<"investor" | "designer">("investor");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [consentOpen, setConsentOpen] = useState(false);
  const gallery = data.gallery.filter(Boolean) as string[];
  const go = (i: number) => setPhoto((i + gallery.length) % Math.max(1, gallery.length));

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const values = new FormData(e.currentTarget);
    setState("sending");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...Object.fromEntries(values), consent: values.get("consent") === "on", form: "investment", audience: tab, product, lang, page: window.location.href }),
      });
      setState(res.ok ? "sent" : "error");
    } catch {
      setState("error");
    }
  }

  return (
    <section id="kontakt" className="relative mt-[150px] scroll-mt-[100px] pt-[160px] text-rotenso-grey">
      <div aria-hidden className="absolute inset-x-0 top-0 -z-10 h-[980px] overflow-hidden bg-[#2c3a44]">
        <FramedImage src={data.background} sizes="100vw" />
      </div>
      <div className="mx-auto flex w-[1300px] max-w-[calc(100%-32px)] flex-col items-center text-center text-white">
        <h2 className="text-h1 leading-[1.2] font-light">{data.title}</h2>
        {data.subtitle && <p className="mt-[10px] text-h3 leading-[1.36] font-light">{data.subtitle}</p>}
        {data.text && <p className="mt-[20px] w-[640px] max-w-full text-[16px] leading-[24px] whitespace-pre-line">{data.text}</p>}
      </div>

      <div className="mt-[150px] flex items-start gap-[20px] px-[50px]">
        <div className="min-w-0 flex-1">
          <div className="relative aspect-[1270/714] overflow-hidden rounded-[32px] bg-rotenso-grey">
            {gallery.map((src, i) => (
              <div key={src + i} className={`absolute inset-0 transition-opacity duration-500 ${i === photo ? "opacity-100" : "opacity-0"}`}>
                <FramedImage src={src} sizes="(min-width: 1920px) 1270px, 66vw" />
              </div>
            ))}
          </div>
          {gallery.length > 1 && (
            <div className="mt-[20px] flex items-center gap-[10px]">
              <button type="button" onClick={() => go(photo - 1)} aria-label={ui.prevImage} className="shrink-0 cursor-pointer">
                <Arrow dir="left" />
              </button>
              <div className="flex min-w-0 flex-1 justify-center gap-[10px] overflow-hidden">
                {gallery.map((src, i) => (
                  <button
                    key={src + i}
                    type="button"
                    onClick={() => setPhoto(i)}
                    aria-label={`${i + 1}`}
                    aria-current={i === photo || undefined}
                    className={`relative aspect-[230/129] w-[230px] shrink cursor-pointer overflow-hidden rounded-[16px] transition-shadow ${i === photo ? "shadow-[0_10px_20px_rgba(0,0,0,0.35)]" : ""}`}
                  >
                    <FramedImage src={src} sizes="230px" />
                  </button>
                ))}
              </div>
              <button type="button" onClick={() => go(photo + 1)} aria-label={ui.nextImage} className="shrink-0 cursor-pointer">
                <Arrow dir="right" />
              </button>
            </div>
          )}
        </div>

        <div className="w-[530px] shrink-0 rounded-[32px] bg-white p-[30px] shadow-dark-l">
          <div role="tablist" className="flex h-[50px] items-center gap-[10px] rounded-[25px] bg-grey-f0 p-[5px]">
            {(
              [
                ["investor", data.investorTab],
                ["designer", data.designerTab],
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
          <p className="mt-[30px] text-h2 leading-[1.2] font-light">{tab === "investor" ? data.investorTitle : data.designerTitle}</p>
          <p className="mt-[10px] text-[16px] leading-[24px] whitespace-pre-line">{tab === "investor" ? data.investorText : data.designerText}</p>
          {data.helpTitle && <p className="mt-[20px] text-[18px] leading-[24.5px] font-bold">{data.helpTitle}</p>}
          {data.helpText && <p className="text-[16px] leading-[24px] whitespace-pre-line">{data.helpText}</p>}
          {data.formIntro && <p className="mt-[30px] text-[18px] leading-[24.5px] font-bold">{data.formIntro}</p>}
          {state === "sent" ? (
            <p role="status" className="mt-[20px] text-[16px] leading-[24px] font-bold">
              {form.success}
            </p>
          ) : (
            <form onSubmit={submit} className="mt-[20px] flex flex-col gap-[11px]">
              <input name="phone" type="tel" required autoComplete="tel" pattern="[+\d][\d\s\-]{7,}" placeholder={form.phone} aria-label={form.phone} className={field} />
              <input name="email" type="email" required autoComplete="email" placeholder={form.email} aria-label={form.email} className={field} />
              <input name="nip" required inputMode="numeric" placeholder={form.nip} aria-label={form.nip} className={field} />
              <div className="relative">
                <select name="contactTime" defaultValue="" aria-label={form.contactTime} className={`${field} cursor-pointer appearance-none`}>
                  <option value="">{form.contactTime}</option>
                  {form.contactTimes.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden className="pointer-events-none absolute top-[13px] right-[15px]">
                  <path d="M6 9L12 15L18 9" stroke="#546670" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <input name="website" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
              <label className="mt-[10px] flex cursor-pointer items-start gap-[10px] text-[12px] leading-[16.3px]">
                <input
                  name="consent"
                  type="checkbox"
                  required
                  className="size-[20px] shrink-0 cursor-pointer appearance-none rounded-[4px] border border-rotenso-grey bg-white bg-center bg-no-repeat checked:bg-rotenso-grey checked:bg-[url(/icons/check.svg)] checked:bg-[length:12px]"
                />
                <span>
                  {form.consent}
                  {form.consentFull && (
                    <>
                      {"   "}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setConsentOpen((o) => !o);
                        }}
                        aria-expanded={consentOpen}
                        className="cursor-pointer underline"
                      >
                        {consentOpen ? ui.collapse : ui.expand}
                      </button>
                    </>
                  )}
                </span>
              </label>
              {consentOpen && <p className="pl-[30px] text-[12px] leading-[16.3px] whitespace-pre-line">{form.consentFull}</p>}
              <div className="mt-[10px] flex items-center justify-between">
                <span className="text-[12px] leading-[16.3px]">{form.required}</span>
                <button
                  type="submit"
                  disabled={state === "sending"}
                  className="inline-flex h-[41px] cursor-pointer items-center rounded-[21px] bg-rotenso-red px-[18px] text-[16px] leading-[normal] font-bold whitespace-nowrap text-white transition-opacity hover:opacity-85 disabled:opacity-60"
                >
                  <span className="text-trim">{state === "sending" ? ui.sending : form.submit}</span>
                </button>
              </div>
              {state === "error" && (
                <p role="alert" className="text-[12px] leading-[16.3px] text-rotenso-red">
                  {form.error}
                </p>
              )}
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

function Arrow({ dir }: { dir: "left" | "right" }) {
  return (
    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" aria-hidden>
      <circle cx="15" cy="15" r="15" fill="#546670" />
      <path d={dir === "left" ? "M21 15H9M9 15L14 10M9 15L14 20" : "M9 15H21M21 15L16 10M21 15L16 20"} stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const REF_MS = 7000;

// "Referencje": the active reference is centred and larger (530×330 photo with a red timer),
// its neighbours 420×236 and faded; every 7 s the next one moves in. Clicking a neighbour
// activates it.
export function RvfReferences({ data }: { data: Rvf["references"] }) {
  const count = data.items.length;
  // As in Figma, the second reference starts in the middle with one neighbour on each side.
  const [active, setActive] = useState(Math.min(1, Math.max(0, count - 1)));
  useEffect(() => {
    if (count < 2) return;
    const t = setTimeout(() => setActive((a) => (a + 1) % count), REF_MS);
    return () => clearTimeout(t);
  }, [active, count]);
  if (!count) return null;

  // Offset that puts the active card's centre in the middle: cards are 420 wide (active 530), 50 apart.
  const before = active * 470;
  return (
    <section className="mt-[150px] overflow-x-clip text-rotenso-grey">
      <h2 className="text-center text-h1 leading-[1.2] font-light">{data.title}</h2>
      <div className="relative mt-[50px]">
        <div
          className="flex items-start gap-[50px] transition-transform duration-700"
          style={{ transform: `translateX(calc(50vw - ${before + 265}px))` }}
        >
          {data.items.map((r, i) => {
            const on = i === active;
            return (
              <button
                key={i}
                type="button"
                onClick={() => setActive(i)}
                aria-current={on || undefined}
                aria-label={r.title}
                className={`shrink-0 cursor-pointer text-left transition-all duration-700 ${on ? "w-[530px]" : "mt-[30px] w-[420px] opacity-40 hover:opacity-60"}`}
              >
                <span className={`relative block overflow-hidden rounded-[16px] bg-grey-dd transition-all duration-700 ${on ? "h-[330px]" : "h-[236px]"}`}>
                  <FramedImage src={r.image} sizes="530px" />
                  {on && count > 1 && (
                    <span key={active} aria-hidden className="absolute bottom-0 left-0 h-[4px] animate-[grow_7s_linear_forwards] bg-rotenso-red" />
                  )}
                </span>
                <span className={`mt-[20px] block px-[30px] font-light ${on ? "text-h3 leading-[1.36]" : "text-[18px] leading-[24px]"}`}>{r.title}</span>
                <span className={`mt-[10px] block px-[30px] ${on ? "text-[16px] leading-[24px]" : "text-[12px] leading-[16.3px]"}`}>{r.text}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
