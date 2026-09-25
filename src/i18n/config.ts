// PL is the source language; the others are produced by DeepL (see docs/TRANSLATIONS.md).
export const locales = ["pl", "en", "de", "fr", "cs", "it", "uk"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "pl";

export const localeLabels: Record<Locale, string> = {
  pl: "Polski",
  en: "English",
  de: "Deutsch",
  fr: "Français",
  cs: "Čeština",
  it: "Italiano",
  uk: "Українська",
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
