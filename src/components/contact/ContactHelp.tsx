"use client";

import Link from "next/link";
import { useState } from "react";
import type { Ui } from "@/i18n/ui";
import type { ContactContent } from "@/lib/content";

const field =
  "h-[49px] w-full rounded-[8px] border border-grey-dd bg-[#f5f5f5] px-[20px] text-[16px] leading-[24px] text-rotenso-grey placeholder:text-rotenso-grey focus:border-rotenso-grey focus:outline-none";

// Pill icons (24px, stroke), white on the active pill.
const ICONS: Record<string, React.ReactNode> = {
  question: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .8-1 1.5v.4M12 16.5v.01" />
    </>
  ),
  grid: (
    <>
      <rect x="4" y="4" width="6.5" height="6.5" rx="1" />
      <rect x="13.5" y="4" width="6.5" height="6.5" rx="1" />
      <rect x="4" y="13.5" width="6.5" height="6.5" rx="1" />
      <rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3.5l7 2.5v5.5c0 4.3-3 7.6-7 9-4-1.4-7-4.7-7-9V6l7-2.5z" />
      <path d="M9 12l2 2 4-4" />
    </>
  ),
  headset: (
    <>
      <path d="M5 14v-2a7 7 0 0 1 14 0v2" />
      <rect x="3.5" y="13" width="3.5" height="5.5" rx="1.5" />
      <rect x="17" y="13" width="3.5" height="5.5" rx="1.5" />
      <path d="M19 18.5c0 1.4-1.6 2-4 2h-2" />
    </>
  ),
  gear: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3v2.5M12 18.5V21M3 12h2.5M18.5 12H21M5.6 5.6l1.8 1.8M16.6 16.6l1.8 1.8M5.6 18.4l1.8-1.8M16.6 7.4l1.8-1.8" />
    </>
  ),
  dots: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M8 12h.01M12 12h.01M16 12h.01" strokeWidth="2.2" />
    </>
  ),
};

// Figma "Kontakt v03": "Zanim do nas napiszesz..." (750 wide: topic pills, numbered accordion,
// the first question open) beside "Formularz kontaktowy" (500 wide).
export function ContactHelp({ faq, form, lang, ui }: { faq: ContactContent["faq"]; form: ContactContent["form"]; lang: string; ui: Ui }) {
  const [cat, setCat] = useState(0);
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [consentOpen, setConsentOpen] = useState(false);
  const items = faq.categories[cat]?.items ?? [];
  const all = faq.categories.flatMap((c) => c.items);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: all.map((q) => ({ "@type": "Question", name: q.question, acceptedAnswer: { "@type": "Answer", text: q.answer } })),
  };

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    setState("sending");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...Object.fromEntries(data), consent: data.get("consent") === "on", form: "contact", lang, page: window.location.href }),
      });
      setState(res.ok ? "sent" : "error");
    } catch {
      setState("error");
    }
  }

  return (
    <section id="formularz" className="mx-auto mt-[100px] flex w-[1300px] max-w-[calc(100%-32px)] scroll-mt-[120px] gap-[50px] text-rotenso-grey">
      <div className="w-[750px] shrink-0">
        <h2 className="text-h2 leading-[1.2] font-light">{faq.title}</h2>
        {faq.text && <p className="mt-[10px] text-h3 leading-[1.36] font-light">{faq.text}</p>}
        {faq.categories.length > 1 && (
          <div role="tablist" className="mt-[30px] flex flex-wrap gap-[10px]">
            {faq.categories.map((c, i) => (
              <button
                key={c.name}
                type="button"
                role="tab"
                aria-selected={i === cat}
                onClick={() => setCat(i)}
                className={`inline-flex h-[36px] cursor-pointer items-center gap-[5px] rounded-[18px] border border-rotenso-grey pr-[15px] pl-[5px] text-[14px] leading-[normal] font-bold transition-colors ${
                  i === cat ? "bg-rotenso-grey text-white" : "bg-white hover:text-rotenso-red"
                }`}
              >
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  {ICONS[c.icon]}
                </svg>
                {c.name}
              </button>
            ))}
          </div>
        )}
        <div className="mt-[30px] flex flex-col gap-[10px]">
          {items.map((q, i) => (
            <details key={`${cat}-${i}`} open={i === 0} className="group rounded-[16px] border border-grey-dd bg-white px-[25px]">
              <summary className="flex min-h-[57px] cursor-pointer list-none items-center justify-between gap-[30px] text-[18px] leading-[24.5px] font-bold [&::-webkit-details-marker]:hidden">
                {i + 1}. {q.question}
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden className="shrink-0 transition-transform group-open:rotate-180">
                  <path d="M6 9L12 15L18 9" stroke="#546670" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </summary>
              <p className="-mt-[5px] pb-[16px] text-[16px] leading-[24px] whitespace-pre-line">{q.answer}</p>
            </details>
          ))}
        </div>
        {all.length > 0 && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />}
      </div>

      <div className="flex-1">
        <h2 className="text-h2 leading-[1.2] font-light">{form.title}</h2>
        {form.text && <p className="mt-[10px] text-h3 leading-[1.36] font-light">{form.text}</p>}
        {state === "sent" ? (
          <p role="status" className="mt-[30px] text-[16px] leading-[24px] font-bold">
            {form.success}
          </p>
        ) : (
          <form onSubmit={submit} className="mt-[30px] flex flex-col gap-[20px]">
            <div className="relative">
              <select name="topic" required defaultValue="" aria-label={form.topic} className={`${field} cursor-pointer appearance-none`}>
                <option value="" disabled>
                  {form.topic}
                </option>
                {form.topics.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden className="pointer-events-none absolute top-[13px] right-[20px]">
                <path d="M6 9L12 15L18 9" stroke="#546670" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="grid grid-cols-2 gap-[20px]">
              <input name="name" required autoComplete="name" placeholder={form.name} aria-label={form.name} className={field} />
              <input name="email" type="email" required autoComplete="email" placeholder={form.email} aria-label={form.email} className={field} />
              <input name="phone" type="tel" autoComplete="tel" pattern="[+\d][\d\s\-]{7,}" placeholder={form.phone} aria-label={form.phone} className={field} />
              <input name="postcode" autoComplete="postal-code" placeholder={form.postcode} aria-label={form.postcode} className={field} />
            </div>
            <textarea
              name="message"
              required
              rows={4}
              maxLength={3000}
              placeholder={form.message}
              aria-label={form.message}
              className="h-[119px] w-full resize-none rounded-[8px] border border-grey-dd bg-[#f5f5f5] px-[20px] py-[12px] text-[16px] leading-[24px] text-rotenso-grey placeholder:text-rotenso-grey focus:border-rotenso-grey focus:outline-none"
            />
            <input name="website" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
            <div className="flex flex-col gap-[20px] text-[12px] leading-[16.3px]">
              <label className="flex cursor-pointer items-start gap-[10px]">
                <input
                  name="consent"
                  type="checkbox"
                  required
                  className="size-[20px] shrink-0 cursor-pointer appearance-none rounded-[4px] border border-rotenso-grey bg-white bg-center bg-no-repeat checked:bg-rotenso-grey checked:bg-[url(/icons/check.svg)] checked:bg-[length:12px]"
                />
                <span className="pt-[2px]">
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
                  )}{" "}
                  *
                </span>
              </label>
              {consentOpen && (
                <p className="whitespace-pre-line">
                  {form.consentFull}
                  {form.consentMore.label && (
                    <>
                      {"  "}
                      <Link href={form.consentMore.href} className="underline hover:text-rotenso-red">
                        {form.consentMore.label}
                      </Link>
                    </>
                  )}
                </p>
              )}
              {form.privacy.label && (
                <Link href={form.privacy.href} className="self-start underline hover:text-rotenso-red">
                  {form.privacy.label}
                </Link>
              )}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[12px] leading-[16.3px]">
                <span className="text-rotenso-red">{form.required.slice(0, 1)}</span>
                {form.required.slice(1)}
              </span>
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
    </section>
  );
}
