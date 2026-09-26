"use client";

import { useState } from "react";
import { FramedImage } from "@/components/ui/FramedImage";
import type { Ui } from "@/i18n/ui";
import type { InvestmentsContent } from "@/lib/content";

type Data = InvestmentsContent["help"];

const field =
  "h-[49px] w-full rounded-[8px] border border-grey-dd bg-[#f5f5f5] px-[20px] text-[16px] leading-[24px] text-rotenso-grey placeholder:text-rotenso-grey focus:border-rotenso-grey focus:outline-none";
const small =
  "h-[40px] w-full rounded-[8px] border border-grey-dd bg-[#f5f5f5] px-[10px] text-[12px] leading-[16px] text-rotenso-grey placeholder:text-rotenso-grey focus:border-rotenso-grey focus:outline-none";

const pln = (v: number) => new Intl.NumberFormat("pl-PL", { maximumFractionDigits: 0 }).format(v);

// Figma: "Oferujemy pomoc przy projekcie" (Inwestycje v06) — photo band, investor / designer
// switch, a white 1080-wide card: cost calculator on the left (investor only, Polish site only —
// no prices abroad), lead form on the right. The calculator inputs travel with the lead.
export function InvestmentHelp({ data, lang, showPrices, ui }: { data: Data; lang: string; showPrices: boolean; ui: Ui }) {
  const [tab, setTab] = useState<"investor" | "designer">("investor");
  const [area, setArea] = useState("");
  const [rooms, setRooms] = useState("");
  const [building, setBuilding] = useState("");
  const [shown, setShown] = useState(false);
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [consentOpen, setConsentOpen] = useState(false);
  const designer = tab === "designer";
  const calculator = !designer && showPrices && data.prices.length > 0;
  const m2 = Number(area.replace(",", ".")) || 0;

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setState("sending");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...Object.fromEntries(form),
          consent: form.get("consent") === "on",
          form: "investment",
          audience: tab,
          area,
          rooms,
          buildingType: building,
          lang,
          page: window.location.href,
        }),
      });
      setState(res.ok ? "sent" : "error");
    } catch {
      setState("error");
    }
  }

  return (
    <section id="oferta" className="relative mt-[150px] scroll-mt-[120px] pt-[171px] pb-[101px]">
      <div className="absolute inset-0 -z-10 overflow-hidden bg-[#3f8fd0]">
        <FramedImage src={data.background} sizes="100vw" />
      </div>
      <h2 className="text-center text-h1 leading-[1.2] font-light text-white">{data.title}</h2>

      <div role="tablist" className="mx-auto mt-[40px] flex h-[50px] w-[640px] items-center gap-[10px] rounded-[25px] bg-white p-[5px]">
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
            className={`h-[40px] flex-1 cursor-pointer rounded-[20px] text-[12px] leading-[normal] transition-colors ${tab === key ? "bg-rotenso-grey text-white" : "text-rotenso-grey hover:bg-grey-f0"}`}
          >
            {label}
          </button>
        ))}
      </div>

      {!designer && <p className="mt-[50px] text-center text-h3 leading-[1.36] font-light text-white">{data.investorText}</p>}

      {/* Figma "Formularz Inwestycje v4": for designers two 530-wide cards side by side — photo
          card (title + text) and the form card — instead of the text line and the calculator. */}
      <div className={`mx-auto flex max-w-[calc(100%-32px)] text-rotenso-grey ${designer ? "mt-[50px] w-[1080px] gap-[20px]" : `mt-[40px] rounded-[16px] bg-white p-[30px] ${calculator ? "w-[1080px]" : "w-[600px]"}`}`}>
        {designer && (
          <div className="flex w-[530px] shrink-0 flex-col overflow-hidden rounded-[16px] bg-white">
            <div className="relative h-[275px] shrink-0 bg-grey-dd">
              <FramedImage src={data.designerImage} sizes="530px" />
            </div>
            <div className="flex flex-col gap-[10px] px-[30px] pt-[30px] pb-[40px]">
              <p className="text-h3 leading-[1.36] font-light">{data.designerTitle}</p>
              <p className="text-[16px] leading-[24px] whitespace-pre-line">{data.designerText}</p>
            </div>
          </div>
        )}
        {calculator && (
          <>
            <div className="flex w-[480px] shrink-0 flex-col">
              <div className="flex flex-col gap-[20px]">
                {(
                  [
                    [data.areaLabel, data.areaPlaceholder, area, setArea, "m²", "decimal"],
                    [data.roomsLabel, data.roomsPlaceholder, rooms, setRooms, "", "numeric"],
                  ] as const
                ).map(([label, ph, value, set, unit, mode]) => (
                  <label key={label} className="flex items-center gap-[20px] text-[12px] leading-[16px] font-bold">
                    <span className="w-[220px] whitespace-pre-line">{label}</span>
                    <span className="relative flex-1">
                      <input value={value} onChange={(e) => set(e.target.value)} inputMode={mode} placeholder={ph} className={small} />
                      {unit && <span className="absolute top-1/2 right-[12px] -translate-y-1/2 font-bold">{unit}</span>}
                    </span>
                  </label>
                ))}
                <label className="flex items-center gap-[20px] text-[12px] leading-[16px] font-bold">
                  <span className="w-[220px]">{data.buildingLabel}</span>
                  <span className="flex-1">
                    <input list="building-types" value={building} onChange={(e) => setBuilding(e.target.value)} placeholder={data.buildingPlaceholder} className={small} />
                    <datalist id="building-types">
                      {data.buildingTypes.map((t) => (
                        <option key={t} value={t} />
                      ))}
                    </datalist>
                  </span>
                </label>
              </div>
              <button
                type="button"
                onClick={() => setShown(true)}
                className="mt-[30px] h-[41px] cursor-pointer rounded-[20px] bg-rotenso-grey text-[16px] leading-[normal] font-bold text-white transition-opacity hover:opacity-85"
              >
                {data.showPrices}
              </button>
              <div className="mt-[40px] flex flex-col gap-[30px]" aria-live="polite">
                {data.prices.map((p) => {
                  const value = Math.max(p.from ?? 0, (p.perM2 ?? 0) * m2);
                  return (
                    <div key={p.name} className="flex items-baseline gap-[20px]">
                      <span className="w-[160px] text-[16px] leading-[24px] font-bold">{p.name}</span>
                      <span className="text-[16px]">{data.from}</span>
                      <span className={`text-h2 leading-none font-light transition-opacity ${shown ? "" : "opacity-30 blur-[6px] select-none"}`}>{pln(value)}</span>
                      <span className="flex flex-col text-[12px] leading-[14px]">
                        <span>zł</span>
                        <span>{data.net}</span>
                      </span>
                    </div>
                  );
                })}
              </div>
              <p className="mt-[40px] text-[12px] leading-[16px]">{data.priceNote}</p>
            </div>
            <span aria-hidden className="mx-[30px] w-px shrink-0 bg-grey-dd" />
          </>
        )}

        <div className={`flex flex-1 flex-col ${designer ? "rounded-[16px] bg-white p-[30px]" : ""}`}>
          <p className="text-h3 leading-[1.36] font-light">{designer ? data.designerFormTitle || data.formTitle : data.formTitle}</p>
          {!designer && data.formText && <p className="mt-[10px] text-[16px] leading-[24px] whitespace-pre-line">{data.formText}</p>}
          {state === "sent" ? (
            <p role="status" className="mt-[30px] text-[16px] leading-[24px] font-bold">
              {data.success}
            </p>
          ) : (
            <form onSubmit={submit} className={`${designer ? "mt-[30px]" : "mt-[20px]"} flex flex-col gap-[11px]`}>
              <input name="phone" type="tel" required autoComplete="tel" pattern="[+\d][\d\s\-]{7,}" placeholder={data.phone} aria-label={data.phone} className={field} />
              <input name="email" type="email" required autoComplete="email" placeholder={data.email} aria-label={data.email} className={field} />
              <input name="nip" required inputMode="numeric" placeholder={data.nip} aria-label={data.nip} className={field} />
              <div className="relative">
                <select name="contactTime" defaultValue="" aria-label={data.contactTime} className={`${field} cursor-pointer appearance-none`}>
                  <option value="">{data.contactTime}</option>
                  {data.contactTimes.map((t) => (
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
                  {data.consent}
                  {data.consentFull && (
                    <>
                      {"   "}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setConsentOpen((o) => !o);
                        }}
                        aria-expanded={consentOpen}
                        className="cursor-pointer font-bold underline"
                      >
                        {consentOpen ? ui.collapse : ui.expand}
                      </button>
                    </>
                  )}
                </span>
              </label>
              {consentOpen && <p className="pl-[30px] text-[12px] leading-[16.3px] whitespace-pre-line">{data.consentFull}</p>}
              <div className="mt-[10px] flex items-center justify-between">
                <span className="text-[12px] leading-[16.3px]">{data.required}</span>
                <button
                  type="submit"
                  disabled={state === "sending"}
                  className="inline-flex h-[41px] cursor-pointer items-center rounded-[21px] bg-rotenso-red px-[18px] text-[16px] leading-[normal] font-bold whitespace-nowrap text-white transition-opacity hover:opacity-85 disabled:opacity-60"
                >
                  <span className="text-trim">{state === "sending" ? ui.sending : data.submit}</span>
                </button>
              </div>
              {state === "error" && (
                <p role="alert" className="text-[12px] leading-[16.3px] text-rotenso-red">
                  {data.error}
                </p>
              )}
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
