import { createReader } from "@keystatic/core/reader";
import config from "../../keystatic.config";
import { defaultLocale, type Locale } from "@/i18n/config";

export const reader = createReader(process.cwd(), config);

// Falls back to PL when a translation does not exist yet.
export async function getHome(lang: Locale) {
  return (
    (await reader.singletons[`home_${lang}`].read()) ??
    (await reader.singletons[`home_${defaultLocale}`].read())
  );
}
