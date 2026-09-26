import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContactHelp } from "@/components/contact/ContactHelp";
import { Branches, ContactHero, ContactMap } from "@/components/contact/ContactSections";
import { isLocale, locales, type Locale } from "@/i18n/config";
import { getUi } from "@/i18n/ui";
import { getContact } from "@/lib/content";

export const dynamicParams = false;
export const generateStaticParams = () => locales.map((lang) => ({ lang }));

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const data = await getContact(lang);
  return { title: { absolute: data.seoTitle }, description: data.seoDescription };
}

// Figma: "Kontakt v03".
export default async function ContactPage({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const ui = getUi(lang as Locale);
  const data = await getContact(lang);

  return (
    <main className="pb-[150px]">
      <ContactHero data={data.hero} lang={lang} ui={ui} />
      <ContactHelp faq={data.faq} form={data.form} lang={lang} ui={ui} />
      <ContactMap data={data.map} />
      <Branches data={data.branches} />
    </main>
  );
}
