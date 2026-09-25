import { createReader, type Entry } from "@keystatic/core/reader";
import config, { homeSingleton, settingsSingleton } from "../../keystatic.config";
import { defaultLocale, type Locale } from "@/i18n/config";

export const reader = createReader(process.cwd(), config);

export type HomeContent = Entry<ReturnType<typeof homeSingleton>>;
export type SettingsContent = Entry<ReturnType<typeof settingsSingleton>>;

// Polish and Czech typography: a one-letter word (i, w, z, a, o, u, k, s, v) must not end a
// line, so it is glued to the next word with a non-breaking space — the Figma copy does the
// same with manual line breaks.
const orphan = /(?<=^|[\s(„"])([aiouwzkvsAIOUWZKVS])\s+/g;
const needsOrphanFix: Locale[] = ["pl", "cs"];

function fixOrphans<T>(value: T): T {
  if (typeof value === "string") {
    // Paths and URLs are left alone.
    return (value.startsWith("/") || value.startsWith("http") ? value : value.replace(orphan, "$1 ")) as T;
  }
  if (Array.isArray(value)) return value.map(fixOrphans) as T;
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, fixOrphans(v)])) as T;
  }
  return value;
}

const typeset = <T>(lang: Locale, data: T) => (needsOrphanFix.includes(lang) ? fixOrphans(data) : data);

// Falls back to PL when a translation does not exist yet.
export async function getHome(lang: Locale): Promise<HomeContent> {
  const entry =
    (await reader.singletons[`home_${lang}`].read()) ??
    (await reader.singletons[`home_${defaultLocale}`].read());
  if (!entry) throw new Error("Missing content/pl/home.yaml");
  return typeset(lang, entry as HomeContent);
}

export async function getSettings(lang: Locale): Promise<SettingsContent> {
  const entry =
    (await reader.singletons[`settings_${lang}`].read()) ??
    (await reader.singletons[`settings_${defaultLocale}`].read());
  if (!entry) throw new Error("Missing content/pl/settings.yaml");
  return typeset(lang, entry as SettingsContent);
}
