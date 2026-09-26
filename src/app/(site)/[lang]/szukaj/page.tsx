import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { SearchResults } from "@/components/search/SearchResults";
import { FramedImage } from "@/components/ui/FramedImage";
import { isLocale, locales, type Locale } from "@/i18n/config";
import { getUi } from "@/i18n/ui";
import { getBlog } from "@/lib/guides";

export const dynamicParams = false;
export const generateStaticParams = () => locales.map((lang) => ({ lang }));

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  // Result pages are endless variations of one page — keep them out of search engines.
  return { title: `${getUi(lang as Locale).crumbSearch} - Rotenso`, robots: { index: false, follow: true } };
}

// Figma: "Wyniki wyszukiwania v1" / "v1-1" — 156px photo band behind the top bar, then the
// results (filtered in the browser from the static search index, see src/lib/search.ts).
export default async function SearchPage({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const ui = getUi(lang as Locale);
  const blog = await getBlog(lang as Locale);
  const guideFilters = blog.filters.map((f) => ({ label: f.label, categories: [...f.categories] }));

  return (
    <main className="pb-[150px]">
      <div className="relative h-[156px] overflow-hidden bg-[#2c3a44]">
        <FramedImage src="/images/assistant/bg.avif" sizes="100vw" preload className="object-[50%_42%]" />
        <nav aria-label="Breadcrumb" className="relative mx-auto w-[1300px] max-w-[calc(100%-32px)] pt-[112px] text-[12px] leading-[normal] text-white">
          <Link href={`/${lang}`} className="hover:underline">
            {ui.crumbHome}
          </Link>
          {" / "}
          <span aria-current="page">{ui.crumbSearch}</span>
        </nav>
      </div>
      <div className="mx-auto mt-[110px] w-[1300px] max-w-[calc(100%-32px)]">
        <Suspense fallback={<div className="h-[600px]" />}>
          <SearchResults lang={lang} ui={ui} guideFilters={guideFilters} />
        </Suspense>
      </div>
    </main>
  );
}
