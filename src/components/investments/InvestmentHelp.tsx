"use client";

import { useState } from "react";
import { FramedImage } from "@/components/ui/FramedImage";
import type { Ui } from "@/i18n/ui";
import type { InvestmentsContent } from "@/lib/content";

type Data = InvestmentsContent["help"];

const field =
  "h-[49px] w-full rounded-[8px] border border-grey-dd bg-[#f5f5f5] px-[20px] text-[16px] leading-[24px] text-rotenso-grey placeholder:text-rotenso-grey focus:border-rotenso-grey focus:outline-none";
// Figma "Oferujemy pomoc przy projekcie" / "Formularz Inwestycje v4": photo band, investor /
// designer switch, then two 530-wide cards — photo card (title + text, per tab) and the lead form.
// (The investor cost calculator from Inwestycje v06 was dropped: no price formula exists.)
export function InvestmentHelp({ data, lang, ui }: { data: Data; lang: string; ui: Ui }) {
  const [tab, setTab] = useState<"investor" | "designer">("investor");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [consentOpen, setConsentOpen] = useState(false);
  const designer = tab === "designer";
  const card = designer
    ? { image: data.designerImage, title: data.designerTitle, text: data.designerText, form: data.designerFormTitle }
    : { image: data.investorImage, title: data.investorTitle, text: data.investorText, form: data.formTitle };

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

      <div className="mx-auto mt-[50px] flex w-[1080px] max-w-[calc(100%-32px)] gap-[20px] text-rotenso-grey">
        <div className="flex w-[530px] shrink-0 flex-col overflow-hidden rounded-[16px] bg-white">
          <div className="relative h-[275px] shrink-0 bg-grey-dd">
            <FramedImage src={card.image} sizes="530px" />
          </div>
          <div className="flex flex-col gap-[10px] px-[30px] pt-[30px] pb-[40px]">
            <p className="text-h3 leading-[1.36] font-light">{card.title}</p>
            <p className="text-[16px] leading-[24px] whitespace-pre-line">{card.text}</p>
          </div>
        </div>

        <div className="flex flex-1 flex-col rounded-[16px] bg-white p-[30px]">
          <p className="text-h3 leading-[1.36] font-light">{card.form}</p>
          {state === "sent" ? (
            <p role="status" className="mt-[30px] text-[16px] leading-[24px] font-bold">
              {data.success}
            </p>
          ) : (
            <form onSubmit={submit} className="mt-[30px] flex flex-col gap-[11px]">
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
