import type { Metadata } from "next";
import { getHome } from "@/lib/content";
import type { Locale } from "@/i18n/config";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  const home = await getHome(lang as Locale);
  return {
    title: home?.seoTitle || "Rotenso",
    description: home?.seoDescription,
  };
}

export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  const home = await getHome(lang as Locale);

  return (
    <main className="mx-auto max-w-[1300px] px-4 py-24">
      <h1 className="text-h1 text-rotenso-grey">{home?.heroTitle}</h1>
      <p className="mt-6 max-w-xl text-body1">{home?.heroText}</p>
    </main>
  );
}
