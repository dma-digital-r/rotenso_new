import { createReader, type Entry } from "@keystatic/core/reader";
import config, { aboutSingleton, assistantSingleton, filtersSingleton, wentiloSingleton, contactSingleton, investmentsSingleton, guidesCollection, homeSingleton, menuSingleton, settingsSingleton } from "../../keystatic.config";
import { defaultLocale, type Locale } from "@/i18n/config";

export const reader = createReader(process.cwd(), config);

export type HomeContent = Entry<ReturnType<typeof homeSingleton>>;
export type SettingsContent = Entry<ReturnType<typeof settingsSingleton>>;
export type MenuContent = Entry<ReturnType<typeof menuSingleton>>;
export type AboutContent = Entry<ReturnType<typeof aboutSingleton>>;
export type InvestmentsContent = Entry<ReturnType<typeof investmentsSingleton>>;
export type AssistantContent = Entry<ReturnType<typeof assistantSingleton>>;
export type FiltersContent = Entry<ReturnType<typeof filtersSingleton>>;
export type WentiloContent = Entry<ReturnType<typeof wentiloSingleton>>;
export type ContactContent = Entry<ReturnType<typeof contactSingleton>>;
type GuideEntry = Entry<ReturnType<typeof guidesCollection>>;

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

export function typesetDeep<T>(value: T, orphans: boolean): T {
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

export type GuideCard = {
  category: string;
  title: string;
  image: string | null;
  imageCrop: { x: null; y: null; w: null; h: null };
  href: string;
};

// Product areas shown as the card label ("Klimatyzacja | Rekuperacja"); other categories
// (Poradnik, Media, …) are used only when a post has none of these.
const AREAS = ["Klimatyzacja", "Rekuperacja", "Pompy ciepła", "RVF/VRF"];

/** Newest guides of a language, as cards for "Praktyczna wiedza". Empty if there are none. */
export async function getLatestGuides(lang: Locale, limit = 10): Promise<GuideCard[]> {
  const own = (await reader.collections[`guides_${lang}`].all()) as { slug: string; entry: GuideEntry }[];
  // Languages without their own guides show the Polish ones until they are translated.
  const all = own.length ? own : ((await reader.collections[`guides_${defaultLocale}`].all()) as typeof own);
  return all
    .filter((g) => g.entry.date && g.entry.categories.length)
    .sort((a, b) => String(b.entry.date).localeCompare(String(a.entry.date)))
    .slice(0, limit)
    .map(({ slug, entry }) => {
      const cats = [...entry.categories];
      const areas = AREAS.filter((a) => cats.includes(a as (typeof cats)[number]));
      const label = (areas.length ? areas : cats.slice(0, 1)).join(" | ").replace("RVF/VRF", "RVF / VRF");
      return typesetDeep(
        {
          category: label || "Poradnik",
          title: entry.title,
          image: entry.image,
          imageCrop: { x: null, y: null, w: null, h: null },
          href: `/${lang}/${slug}`,
        },
        needsOrphanFix.includes(lang),
      );
    });
}

export async function getSettings(lang: Locale): Promise<SettingsContent> {
  const entry =
    (await reader.singletons[`settings_${lang}`].read()) ??
    (await reader.singletons[`settings_${defaultLocale}`].read());
  if (!entry) throw new Error("Missing content/pl/settings.yaml");
  return typeset(lang, entry as SettingsContent);
}

export async function getMenu(lang: Locale): Promise<MenuContent> {
  const entry =
    (await reader.singletons[`menu_${lang}`].read()) ?? (await reader.singletons[`menu_${defaultLocale}`].read());
  return typeset(lang, (entry ?? { tabs: [] }) as MenuContent);
}

export async function getAbout(lang: Locale): Promise<AboutContent> {
  const entry =
    (await reader.singletons[`about_${lang}`].read()) ?? (await reader.singletons[`about_${defaultLocale}`].read());
  if (!entry) throw new Error("Missing content/pl/about.yaml");
  return typeset(lang, entry as AboutContent);
}

export async function getInvestments(lang: Locale): Promise<InvestmentsContent> {
  const entry =
    (await reader.singletons[`investments_${lang}`].read()) ?? (await reader.singletons[`investments_${defaultLocale}`].read());
  if (!entry) throw new Error("Missing content/pl/investments.yaml");
  return typeset(lang, entry as InvestmentsContent);
}

export async function getAssistant(lang: Locale): Promise<AssistantContent> {
  const entry = (await reader.singletons[`assistant_${lang}`].read()) ?? (await reader.singletons[`assistant_${defaultLocale}`].read());
  if (!entry) throw new Error("Missing content/pl/assistant.yaml");
  return typeset(lang, entry as AssistantContent);
}

export async function getFilters(lang: Locale): Promise<FiltersContent> {
  const entry = (await reader.singletons[`filters_${lang}`].read()) ?? (await reader.singletons[`filters_${defaultLocale}`].read());
  if (!entry) throw new Error("Missing content/pl/filters.yaml");
  return typeset(lang, entry as FiltersContent);
}

export async function getWentilo(lang: Locale): Promise<WentiloContent> {
  const entry = (await reader.singletons[`wentilo_${lang}`].read()) ?? (await reader.singletons[`wentilo_${defaultLocale}`].read());
  if (!entry) throw new Error("Missing content/pl/wentilo.yaml");
  return typeset(lang, entry as WentiloContent);
}

export async function getContact(lang: Locale): Promise<ContactContent> {
  const entry = (await reader.singletons[`contact_${lang}`].read()) ?? (await reader.singletons[`contact_${defaultLocale}`].read());
  if (!entry) throw new Error("Missing content/pl/contact.yaml");
  return typeset(lang, entry as ContactContent);
}
