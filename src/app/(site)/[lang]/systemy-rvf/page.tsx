import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { InvestmentHelp } from "@/components/investments/InvestmentHelp";
import { InvestmentHero, Projects, Solutions, WhyUs } from "@/components/investments/InvestmentSections";
import { Faq } from "@/components/product/Faq";
import { FeatureSlider } from "@/components/product/FeatureSlider";
import { FramedImage } from "@/components/ui/FramedImage";
import { isLocale, locales, type Locale } from "@/i18n/config";
import { getUi } from "@/i18n/ui";
import { getInvestments } from "@/lib/content";

export const dynamicParams = false;
export const generateStaticParams = () => locales.map((lang) => ({ lang }));

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const data = await getInvestments(lang);
  return { title: { absolute: data.seoTitle }, description: data.seoDescription };
}

// Figma: "Inwestycje v06" (5172:75884) — opened from the menu (Inwestycje → Systemy RVF/VRF →
// Dowiedz się więcej).
export default async function InvestmentsPage({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const ui = getUi(lang as Locale);
  const data = await getInvestments(lang);
  const { systems } = data;

  return (
    <main className="pb-[150px]">
      <InvestmentHero data={data.hero} lang={lang} ui={ui} />

      {/* "Poznaj 3 rodzaje systemów": 900px photo band (40% navy overlay), title 221px in; the
          1340×754 slides start 516px into the band and reach below it. */}
      <div className="mt-[50px]">
        <FeatureSlider
          ui={ui}
          autoplay={false}
          slides={systems.slides.map((s) => ({ image: s.image, video: s.video, title: s.title, text: s.text }))}
          background={
            <div key="bg" className="absolute inset-x-0 top-0 h-[900px] overflow-hidden bg-[#0d232f]">
              <FramedImage src={systems.background} sizes="100vw" />
              <span className="absolute inset-0 bg-[#0d232f]/40" />
            </div>
          }
          header={
            <div key="header" className="relative flex h-[516px] flex-col items-center pt-[221px] text-center font-light text-white">
              <h2 className="text-h1 leading-[1.2] whitespace-pre-line">{systems.title}</h2>
              {systems.text && <p className="mt-[10px] text-h3 leading-[1.36]">{systems.text}</p>}
            </div>
          }
        />
      </div>

      <InvestmentHelp data={data.help} lang={lang} ui={ui} />
      <Projects data={data.projects} ui={ui} />
      <WhyUs items={data.why} />
      <Solutions data={data.solutions} />
      <Faq items={data.faq.map((q) => ({ question: q.question, answer: q.answer }))} ui={ui} button={data.faqButton.label ? data.faqButton : undefined} />
    </main>
  );
}
