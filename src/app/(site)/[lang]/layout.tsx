import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import { notFound } from "next/navigation";
import { isLocale, locales } from "@/i18n/config";
import "../globals.css";

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin", "latin-ext", "cyrillic"],
  weight: ["300", "400", "600", "700"],
});

export const metadata: Metadata = {
  title: { default: "Rotenso", template: "%s | Rotenso" },
};

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  return (
    <html lang={lang} className={`${openSans.variable} antialiased`}>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
