import { Button } from "@/components/ui/Button";
import type { Ui } from "@/i18n/ui";

// Figma: "FAQ" (5172:81570) — 860 wide, 40px title, white bordered accordion items (the first
// one open), then "BTN L Red" (5172:81569) 100px below, leading to the quote form.
// FAQPage structured data helps the answers show up in search and AI results.
export function Faq({
  items,
  ui,
  button,
}: {
  items: readonly { question: string; answer: string }[];
  ui: Ui;
  /** Button under the questions — default "Zapytaj o montaż" → the quote form. */
  button?: { label: string; href: string };
}) {
  if (!items.length) return null;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((q) => ({
      "@type": "Question",
      name: q.question,
      acceptedAnswer: { "@type": "Answer", text: q.answer },
    })),
  };
  return (
    <section className="mx-auto mt-[150px] w-[860px] max-w-[calc(100%-32px)] text-rotenso-grey">
      <h2 className="text-center text-h2 leading-[1.2] font-light">{ui.faqTitle}</h2>
      <div className="mt-[50px] flex flex-col gap-[10px]">
        {items.map((q, i) => (
          <details key={q.question} open={i === 0} className="group rounded-[16px] border border-grey-dd bg-white px-[20px] py-[15px]">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-[30px] text-[18px] leading-[24.5px] [&::-webkit-details-marker]:hidden">
              {q.question}
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden className="shrink-0 transition-transform group-open:rotate-180">
                <path d="M6 9L12 15L18 9" stroke="#546670" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </summary>
            <p className="mt-[30px] text-[16px] leading-[24px] whitespace-pre-line">{q.answer}</p>
          </details>
        ))}
      </div>
      <div className="mt-[100px] flex justify-center">
        <Button variant="l-red" href={button?.href ?? "#wycena"} className="min-w-[419px]">
          {button?.label ?? ui.askInstall}
        </Button>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    </section>
  );
}
