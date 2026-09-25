import { collection, config, singleton } from "@keystatic/core";
import { locales, localeLabels, type Locale } from "./src/i18n/config";
import { guideSchema, homeSchema, menuSchema, productSchema, settingsSchema } from "./src/content/schema";

// Every language keeps its own copy of the content under content/<lang>/.
// PL is edited by hand; other languages are filled by the DeepL script and can
// then be corrected here — corrected files are not overwritten on the next run.

export function homeSingleton(lang: Locale) {
  return singleton({
    label: `Strona główna (${lang.toUpperCase()})`,
    path: `content/${lang}/home`,
    format: { data: "yaml" },
    schema: homeSchema,
  });
}

export function settingsSingleton(lang: Locale) {
  return singleton({
    label: `Menu i stopka (${lang.toUpperCase()})`,
    path: `content/${lang}/settings`,
    format: { data: "yaml" },
    schema: settingsSchema,
  });
}

export function menuSingleton(lang: Locale) {
  return singleton({
    label: `Mega menu (${lang.toUpperCase()})`,
    path: `content/${lang}/menu`,
    format: { data: "yaml" },
    schema: menuSchema,
  });
}

export function guidesCollection(lang: Locale) {
  return collection({
    label: `Poradniki (${lang.toUpperCase()})`,
    slugField: "title",
    path: `content/${lang}/guides/*`,
    format: { contentField: "content" },
    columns: ["title", "date"],
    schema: guideSchema,
  });
}

export function productsCollection(lang: Locale) {
  return collection({
    label: `Produkty (${lang.toUpperCase()})`,
    slugField: "name",
    path: `content/${lang}/products/*`,
    format: { data: "yaml" },
    columns: ["name", "kind"],
    schema: productSchema,
  });
}

export default config({
  storage: { kind: "local" },
  ui: {
    brand: { name: "Rotenso" },
    navigation: Object.fromEntries(
      locales.map((lang) => [
        localeLabels[lang],
        [`home_${lang}`, `settings_${lang}`, `menu_${lang}`, `guides_${lang}`, `products_${lang}`],
      ]),
    ),
  },
  singletons: Object.fromEntries(
    locales.flatMap((lang) => [
      [`home_${lang}`, homeSingleton(lang)],
      [`settings_${lang}`, settingsSingleton(lang)],
      [`menu_${lang}`, menuSingleton(lang)],
    ]),
  ),
  collections: Object.fromEntries(
    locales.flatMap((lang) => [
      [`guides_${lang}`, guidesCollection(lang)],
      [`products_${lang}`, productsCollection(lang)],
    ]),
  ),
});
