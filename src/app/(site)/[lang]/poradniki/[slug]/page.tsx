import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleBody, prepareArticle } from "@/components/blog/ArticleBody";
import { ArticleToc } from "@/components/blog/ArticleToc";
import { Button } from "@/components/ui/Button";
import { FramedImage } from "@/components/ui/FramedImage";
import { Icon } from "@/components/ui/Icon";
import { defaultLocale, isLocale, locales, type Locale } from "@/i18n/config";
import { getUi } from "@/i18n/ui";
import { getBlog, getGuide, getGuideList } from "@/lib/guides";

// Every language is prerendered. Until translated, other languages show the Polish text with a
// canonical link to the Polish page.
export const dynamicParams = false;
export async function generateStaticParams() {
  const all = await Promise.all(locales.map(async (lang) => (await getGuideList(lang)).map((g) => ({ lang, slug: g.slug }))));
  return all.flat();
}

type Props = { params: Promise<{ lang: string; slug: string }> };

async function load(params: Props["params"]) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) return null;
  const [entry, list] = await Promise.all([getGuide(lang, slug), getGuideList(lang)]);
  const summary = list.find((g) => g.slug === slug);
  if (!entry || !summary) return null;
  return { lang: lang as Locale, slug, entry, summary, list };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data = await load(params);
  if (!data) return {};
  const { lang, slug, summary } = data;
  return {
    title: summary.title,
    description: summary.excerpt,
    alternates: lang === defaultLocale ? undefined : { canonical: `/${defaultLocale}/poradniki/${slug}` },
    openGraph: { type: "article", title: summary.title, description: summary.excerpt, images: summary.image ? [summary.image] : undefined, publishedTime: summary.date },
  };
}

// Figma: "MMP-12000 / Artykuły v.05" (file Rotenso Podstrony, 5498:50176).
// Header S → "Z tego artykułu dowiesz się" box → table of contents (310) + text (970) →
// recommended products → FAQ + "Zadaj pytanie" → other articles.
export default async function GuidePage({ params }: Props) {
  const data = await load(params);
  if (!data) notFound();
  const { lang, entry, summary, list } = data;
  const ui = getUi(lang);
  const blog = await getBlog(lang);
  const { learn, toc, body } = prepareArticle(entry.content.node);
  const products = entry.products.items.filter((p) => p.name);

  const sameTopic = list.filter((g) => g.slug !== summary.slug && g.categories.some((c) => c !== "Poradnik" && summary.categories.includes(c)));
  const others = [...sameTopic, ...list.filter((g) => g.slug !== summary.slug && !sameTopic.includes(g))].slice(0, 9);
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: summary.title,
      description: summary.excerpt,
      datePublished: summary.date,
      image: summary.image ?? undefined,
      inLanguage: "pl",
      publisher: { "@type": "Organization", name: "Rotenso" },
    },
    ...(entry.faq.length
      ? [
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: entry.faq.map((q) => ({ "@type": "Question", name: q.question, acceptedAnswer: { "@type": "Answer", text: q.answer } })),
          },
        ]
      : []),
  ];

  return (
    <main className="pb-[150px] text-rotenso-grey">
      {/* Header S: 1820×500 photo, 20% darker; centred 860px glass panel with the title. */}
      <section className="relative mx-[50px] mt-[15px] flex h-[500px] items-center justify-center overflow-hidden rounded-[32px] bg-[#c4c4c4] pt-[50px]">
        <FramedImage src={summary.image} alt={String(entry.imageAlt ?? "")} sizes="100vw" preload />
        <span className="absolute inset-0 bg-black/20" />
        <nav aria-label="Breadcrumb" className="absolute top-[95px] left-1/2 w-[1300px] max-w-[calc(100%-32px)] -translate-x-1/2 text-[12px] leading-[normal] text-white">
          <Link href={`/${lang}`} className="hover:underline">
            {ui.crumbHome}
          </Link>
          {" / "}
          <Link href={`/${lang}/poradniki`} className="hover:underline">
            {ui.crumbGuides}
          </Link>
          {" / "}
          <span aria-current="page">{summary.label}</span>
        </nav>
        <div className="relative flex w-[860px] max-w-[calc(100%-32px)] flex-col gap-[10px] rounded-[32px] bg-black/50 px-[20px] pt-[20px] pb-[30px] text-center font-light text-white backdrop-blur-[20px]">
          <h1 className="text-h2 leading-[1.2]">{summary.title}</h1>
          {entry.subtitle && <p className="text-h3 leading-[1.36]">{entry.subtitle}</p>}
        </div>
      </section>

      {learn && (
        <section className="mx-auto mt-[45px] w-[1300px] max-w-[calc(100%-32px)] rounded-[32px] bg-grey-f0 px-[30px] pt-[38px] pb-[40px]">
          <div className="flex items-center gap-[15px]">
            <Icon name="guide-learn" width={44} height={45} />
            <h2 className="text-h2 leading-[1.2] font-light">{learn.title}</h2>
          </div>
          <ul className="mt-[31px] grid grid-flow-col grid-cols-2 gap-x-[84px] gap-y-[10px] pl-[26px] text-[16px] leading-[24px] [&_a]:hover:text-rotenso-red" style={{ gridTemplateRows: `repeat(${Math.ceil(learn.items.length / 2)}, auto)` }}>
            {learn.items.map((item, i) => (
              <li key={i} className="relative before:absolute before:top-[9px] before:-left-[20px] before:size-[6px] before:rounded-full before:bg-rotenso-grey">
                {item}
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="mx-auto mt-[45px] flex w-[1300px] max-w-[calc(100%-32px)] items-start gap-[22px]">
        <aside className="w-[308px] shrink-0 self-stretch">
          <ArticleToc title={ui.tableOfContents} items={toc} />
        </aside>
        <div className="min-w-0 flex-1">
          <ArticleBody>{body}</ArticleBody>

          {products.length > 0 && (
            <section className="mt-[100px]">
              <h2 className="text-center text-h1 leading-[1.2] font-light whitespace-pre-line">{entry.products.title}</h2>
              <div className="mt-[20px] grid grid-cols-3 gap-[20px]">
                {products.map((p) => (
                  <Link key={p.name} href={p.href || "#"} className="group flex flex-col">
                    <span className="relative h-[176px] overflow-hidden rounded-[16px]">
                      {p.image && <Image src={p.image} alt={p.name} fill sizes="310px" className="object-contain" />}
                    </span>
                    <span className="mt-[48px] text-h2 leading-[1.2] font-light">{p.kicker}</span>
                    <span className="mt-[20px] text-h3 leading-[1.36] font-light group-hover:text-rotenso-red">{p.name}</span>
                    <span className="mt-[10px] text-[16px] leading-[24px]">{p.text}</span>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {entry.faq.length > 0 && (
            <section className="mt-[100px]">
              <h2 className="text-center text-h2 leading-[1.2] font-light">{ui.faqTitle}</h2>
              <div className="mt-[50px] flex flex-col gap-[10px]">
                {entry.faq.map((q, i) => (
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
            </section>
          )}

          {blog.articleAsk.label && (
            <div className="mt-[76px] flex justify-center">
              <Button variant="l-red" href={blog.articleAsk.href} className="min-w-[310px]">
                {blog.articleAsk.label}
              </Button>
            </div>
          )}

          {others.length > 0 && (
            <section className="mt-[126px]">
              <h2 className="text-center text-h2 leading-[1.2] font-light">{blog.articleOthersTitle}</h2>
              <ul className="mt-[50px] flex flex-col gap-[10px]">
                {others.map((g) => (
                  <li key={g.slug}>
                    <Link
                      href={g.href}
                      className="flex min-h-[60px] items-center justify-between gap-[30px] rounded-[16px] border border-grey-dd bg-grey-f0 px-[20px] py-[15px] text-[18px] leading-[24.5px] transition-colors hover:text-rotenso-red"
                    >
                      {g.title}
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden className="shrink-0 -rotate-90">
                        <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    </main>
  );
}
