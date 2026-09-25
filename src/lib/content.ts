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

// All languages: a short last word of a paragraph ("rok.", "domu.") never sits alone on the
// last line — it is glued to the word before it. Only for texts of 4+ words.
const widow = /\s+(\S{1,10})$/gm;

function typesetString(value: string, orphans: boolean): string {
  // Paths and URLs are left alone.
  if (value.startsWith("/") || value.startsWith("http")) return value;
  let out = orphans ? value.replace(orphan, "$1\u00A0") : value;
  // "RVF / VRF": a slash never starts or ends a line.
  out = out.replace(/ \/ /g, "\u00A0/\u00A0");
  out = out
    .split("\n")
    .map((line) => (line.trim().split(/\s+/).length >= 4 ? line.replace(widow, "\u00A0$1") : line))
    .join("\n");
  return out;
}

function typesetDeep<T>(value: T, orphans: boolean): T {
  if (typeof value === "string") return typesetString(value, orphans) as T;
  if (Array.isArray(value)) return value.map((v) => typesetDeep(v, orphans)) as T;
  if (value && typeof value === "object") {
    // Feed symbols must stay byte-for-byte as typed, or the price lookup fails.
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [k, k === "priceSymbols" ? v : typesetDeep(v, orphans)]),
    ) as T;
  }
  return value;
}

const typeset = <T>(lang: Locale, data: T) => typesetDeep(data, needsOrphanFix.includes(lang));

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
