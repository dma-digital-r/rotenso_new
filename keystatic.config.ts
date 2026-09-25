import { collection, config, fields, singleton } from "@keystatic/core";
import { locales, localeLabels, type Locale } from "./src/i18n/config";

// Every language keeps its own copy of the content under content/<lang>/.
// PL is edited by hand; other languages are filled by the DeepL script and can
// then be corrected here — corrected files are not overwritten on the next run.

function homeSingleton(lang: Locale) {
  return singleton({
    label: `Strona główna (${lang.toUpperCase()})`,
    path: `content/${lang}/home`,
    format: { data: "yaml" },
    schema: {
      heroTitle: fields.text({ label: "Hero — tytuł" }),
      heroText: fields.text({ label: "Hero — opis", multiline: true }),
      seoTitle: fields.text({ label: "SEO — tytuł" }),
      seoDescription: fields.text({ label: "SEO — opis", multiline: true }),
    },
  });
}

function productsCollection(lang: Locale) {
  return collection({
    label: `Produkty (${lang.toUpperCase()})`,
    slugField: "name",
    path: `content/${lang}/products/*`,
    format: { data: "yaml" },
    schema: {
      name: fields.slug({ name: { label: "Nazwa" } }),
      category: fields.select({
        label: "Kategoria",
        options: [
          { label: "Klimatyzacja", value: "klimatyzacja" },
          { label: "Rekuperacja", value: "rekuperacja" },
          { label: "Pompa ciepła", value: "pompa-ciepla" },
          { label: "Akcesoria", value: "akcesoria" },
        ],
        defaultValue: "klimatyzacja",
      }),
      tagline: fields.text({ label: "Hasło pod nazwą" }),
      description: fields.text({ label: "Opis", multiline: true }),
    },
  });
}

export default config({
  storage: { kind: "local" },
  ui: {
    brand: { name: "Rotenso" },
    navigation: Object.fromEntries(
      locales.map((lang) => [
        localeLabels[lang],
        [`home_${lang}`, `products_${lang}`],
      ]),
    ),
  },
  singletons: Object.fromEntries(
    locales.map((lang) => [`home_${lang}`, homeSingleton(lang)]),
  ),
  collections: Object.fromEntries(
    locales.map((lang) => [`products_${lang}`, productsCollection(lang)]),
  ),
});
