import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AssistantCards } from "@/components/assistant/AssistantCards";
import { FramedImage } from "@/components/ui/FramedImage";
import { isLocale, locales, type Locale } from "@/i18n/config";
import { getUi } from "@/i18n/ui";
import { getAssistant } from "@/lib/content";

export const dynamicParams = false;
export const generateStaticParams = () => locales.map((lang) => ({ lang }));

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const data = await getAssistant(lang);
  return { title: { absolute: data.seoTitle }, description: data.seoDescription };
}

// Figma: "Doboromierz Start" — full-width photo behind the header, title and three assistant cards.
export default async function AssistantPage({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const ui = getUi(lang as Locale);
  const data = await getAssistant(lang);

  return (
    <main className="relative min-h-[1080px] overflow-hidden pt-[118px] pb-[186px] text-white">
      <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden bg-[#2c3a44] [&>*]:scale-105 [&>*]:blur-[12px]">
        <FramedImage src={data.background} sizes="100vw" preload />
      </div>
      <div className="mx-auto w-[1300px] max-w-[calc(100%-32px)]">
        <nav aria-label="Breadcrumb" className="text-[12px] leading-[normal]">
          <Link href={`/${lang}`} className="hover:underline">
            {ui.crumbHome}
          </Link>
          {" / "}
          <span aria-current="page">{ui.crumbAssistant}</span>
        </nav>
        <div className="mt-[70px] flex flex-col items-center gap-[10px] text-center font-light">
          <h1 className="text-h1 leading-[1.2]">{data.title}</h1>
          {data.text && <p className="text-h3 leading-[1.36]">{data.text}</p>}
        </div>
        <AssistantCards cards={data.cards} />
      </div>
    </main>
  );
}
