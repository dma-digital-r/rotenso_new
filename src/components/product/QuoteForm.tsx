"use client";

import Image from "next/image";
import { useState } from "react";
import { FramedImage } from "@/components/ui/FramedImage";
import type { Ui } from "@/i18n/ui";
import type { SettingsContent } from "@/lib/content";

type Data = SettingsContent["quoteForm"];

const field =
  "h-[50px] w-full rounded-[8px] border border-grey-dd bg-[#f5f5f5] px-[20px] text-[16px] leading-[24px] text-rotenso-grey placeholder:text-rotenso-grey focus:border-rotenso-grey focus:outline-none";

// Figma: "Formularz wycena klimatyzacja" (5172:81590) — 1030px photo, white title and text,
// three white cards: the form (step 1, 420 wide) and steps 2 and 3 (310 wide, photo on top).
// Leads are posted to /api/lead.
export function QuoteForm({ data, product, lang, ui }: { data: Data; product: string; lang: string; ui: Ui }) {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [consentOpen, setConsentOpen] = useState(false);

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
          product,
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
    <section id="wycena" className="relative mt-[92px] h-[1030px] scroll-mt-[160px] overflow-hidden bg-rotenso-grey text-rotenso-grey">
      <FramedImage src={data.background} sizes="100vw" />
      <div className="relative flex flex-col items-center pt-[100px] text-center text-white">
        <h2 className="text-h1 leading-[1.2] font-light">{data.title}</h2>
        <p className="mt-[30px] w-[750px] max-w-[calc(100%-32px)] text-[16px] leading-[24px] whitespace-pre-line">{data.text}</p>
      </div>

      <div className="relative mx-auto mt-[50px] flex w-[1080px] max-w-[calc(100%-32px)] items-stretch justify-center gap-[20px]">
        <div className="flex min-h-[550px] w-[420px] shrink-0 flex-col gap-[30px] rounded-[16px] bg-white p-[30px]">
          <p className="text-[16px] leading-[24px] whitespace-pre-line">{data.step1}</p>
          {state === "sent" ? (
            <p role="status" className="text-[16px] leading-[24px] font-bold whitespace-pre-line">
              {data.success}
            </p>
          ) : (
            <form onSubmit={submit} className="flex flex-col gap-[30px]">
              <div className="flex flex-col gap-[10px]">
                <input name="phone" type="tel" required autoComplete="tel" pattern="[+\d][\d\s\-]{7,}" placeholder={data.phone} aria-label={data.phone} className={field} />
                <input name="email" type="email" required autoComplete="email" placeholder={data.email} aria-label={data.email} className={field} />
                <input name="postcode" required autoComplete="postal-code" placeholder={data.postcode} aria-label={data.postcode} className={field} />
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
                {/* Honeypot — hidden from people. */}
                <input name="website" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
              </div>

              <div className="flex flex-col gap-[10px]">
                <label className="flex cursor-pointer items-start gap-[10px] text-[12px] leading-[16.3px]">
                  <input
                    name="consent"
                    type="checkbox"
                    required
                    className="mt-0 size-[20px] shrink-0 cursor-pointer appearance-none rounded-[4px] border border-rotenso-grey bg-white bg-center bg-no-repeat checked:bg-rotenso-grey checked:bg-[url(/icons/check.svg)] checked:bg-[length:12px]"
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
              </div>

              <div className="flex items-center justify-between">
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

        {[
          [data.step2Image, data.step2],
          [data.step3Image, data.step3],
        ].map(([image, text], i) => (
          <div key={i} className="flex w-[310px] shrink-0 flex-col gap-[30px] overflow-hidden rounded-[16px] bg-white">
            <div className="relative h-[310px] bg-grey-dd">
              {image && <Image src={image} alt="" fill sizes="310px" className="object-cover" />}
            </div>
            <p className="px-[30px] pb-[30px] text-[16px] leading-[24px] whitespace-pre-line">{text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
