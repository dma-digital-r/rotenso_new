import { fields } from "@keystatic/core";

// Shared Keystatic field builders. Images live in public/images/<dir>/ and are
// stored in YAML as "/images/<dir>/<file>".

export const image = (label: string, dir = "home") =>
  fields.image({
    label,
    directory: `public/images/${dir}`,
    publicPath: `/images/${dir}/`,
    validation: { isRequired: false },
  });

export const link = (label: string) =>
  fields.object(
    {
      label: fields.text({ label: "Tekst" }),
      href: fields.text({ label: "Adres (np. /pl/klimatyzacja)" }),
    },
    { label },
  );

// Optional manual framing, in % of the frame — mirrors the image crop set in Figma.
// Leave empty to fill the frame ("cover").
export const crop = () =>
  fields.object(
    {
      x: fields.number({ label: "Przesunięcie X (%)" }),
      y: fields.number({ label: "Przesunięcie Y (%)" }),
      w: fields.number({ label: "Szerokość (%)" }),
      h: fields.number({ label: "Wysokość (%)" }),
    },
    { label: "Kadrowanie (opcjonalne)" },
  );

const acSlide = (label: string) =>
  fields.object(
    {
      title: fields.text({ label: "Tytuł sekcji" }),
      switchLabel: fields.text({ label: "Przełącznik (np. „Klimatyzacje dla firm”)" }),
      background: image("Tło"),
      backgroundCrop: crop(),
      products: fields.array(
        fields.object({
          name: fields.text({ label: "Nazwa (kafelek)" }),
          thumb: image("Miniatura urządzenia"),
          subtitle: fields.text({ label: "Podtytuł" }),
          text: fields.text({ label: "Opis", multiline: true }),
          priceSymbols: fields.text({
            label: "Cena „Już od” — symbole zestawu z feedu",
            description:
              "Najniższa moc modelu, symbole połączone plusem, np. M26XI R15 + M26XO R15 (IDU + ODU). Cena brutto liczona raz na dobę z feedu i zaokrąglona w górę do pełnej złotówki. Puste pole = bez ceny. Na stronach zagranicznych cena nigdy się nie wyświetla.",
          }),
          cta: link("Przycisk"),
        }),
        { label: "Modele", itemLabel: (p) => p.fields.name.value || "Model" },
      ),
      configurator: fields.object(
        {
          question: fields.text({ label: "Pytanie" }),
          cta: fields.text({ label: "Tekst CTA", multiline: true }),
          href: fields.text({ label: "Adres" }),
        },
        { label: "Kafelek konfiguratora" },
      ),
    },
    { label },
  );

export const homeSchema = {
  seoTitle: fields.text({ label: "SEO — tytuł" }),
  seoDescription: fields.text({ label: "SEO — opis", multiline: true }),

  heroSlides: fields.array(
    fields.object({
      tab: fields.text({ label: "Nazwa na pasku postępu" }),
      title: fields.text({ label: "Tytuł" }),
      text: fields.text({ label: "Opis", multiline: true }),
      primary: link("Przycisk czerwony"),
      secondary: link("Przycisk biały"),
      background: image("Tło (1820×930)"),
    }),
    { label: "Hero — slajdy", itemLabel: (s) => s.fields.tab.value || "Slajd" },
  ),

  idea: fields.object(
    {
      title: fields.text({ label: "Tytuł", multiline: true }),
      text: fields.text({ label: "Opis", multiline: true }),
      background: image("Tło (1920×1080)"),
    },
    { label: "Sekcja „komfort”" },
  ),

  acHome: acSlide("Klimatyzacje — dom"),
  acBusiness: acSlide("Klimatyzacje — firmy"),

  wentilo: fields.object(
    {
      title: fields.text({ label: "Tytuł sekcji" }),
      productName: fields.text({ label: "Nazwa produktu" }),
      text: fields.text({ label: "Opis", multiline: true }),
      cta: link("Przycisk"),
      configurator: fields.object(
        {
          question: fields.text({ label: "Pytanie" }),
          cta: fields.text({ label: "Tekst CTA" }),
          href: fields.text({ label: "Adres" }),
        },
        { label: "Kafelek konfiguratora" },
      ),
      background: image("Tło (1820×880)"),
      media: image("Zdjęcie/plakat wideo (860×540)"),
      video: fields.text({ label: "Wideo — adres pliku (opcjonalnie)" }),
      kingfisherWebm: fields.text({
        label: "Zimorodek — wideo WebM (Chrome, Edge, Firefox)",
        description: "WebM VP9 z przezroczystością. Odtwarzane bez dźwięku, w pętli, 5× szybciej.",
      }),
      kingfisherMov: fields.text({
        label: "Zimorodek — wideo MOV (Safari)",
        description: "MOV HEVC z przezroczystością. Dopóki film się nie odtwarza, widać zdjęcie ptaka.",
      }),
    },
    { label: "Rekuperacja (Wentilo)" },
  ),

  heatPumps: fields.object(
    {
      title: fields.text({ label: "Tytuł" }),
      text: fields.text({ label: "Opis", multiline: true }),
      configurator: fields.object(
        {
          question: fields.text({ label: "Pytanie" }),
          cta: fields.text({ label: "Tekst CTA" }),
          href: fields.text({ label: "Adres" }),
        },
        { label: "Kafelek konfiguratora" },
      ),
      tiles: fields.array(
        fields.object({
          title: fields.text({ label: "Tytuł", multiline: true }),
          text: fields.text({ label: "Opis pod kafelkiem", multiline: true }),
          image: image("Zdjęcie (970×545)"),
          cta: link("Przycisk"),
        }),
        { label: "Kafelki", itemLabel: (t) => t.fields.title.value || "Kafelek" },
      ),
    },
    { label: "Pompy ciepła" },
  ),

  rvf: fields.object(
    {
      title: fields.text({ label: "Tytuł" }),
      text: fields.text({ label: "Opis", multiline: true }),
      cta: link("Przycisk"),
      image: image("Zdjęcie (1190×700)"),
    },
    { label: "Systemy RVF / VRF" },
  ),

  guides: fields.object(
    {
      title: fields.text({ label: "Tytuł" }),
      text: fields.text({ label: "Opis", multiline: true }),
      readLabel: fields.text({ label: "Przycisk na karcie" }),
      more: link("Przycisk pod sliderem"),
      items: fields.array(
        fields.object({
          category: fields.text({ label: "Kategoria" }),
          title: fields.text({ label: "Tytuł" }),
          image: image("Zdjęcie (420×236)"),
          imageCrop: crop(),
          href: fields.text({ label: "Adres" }),
        }),
        { label: "Poradniki", itemLabel: (g) => g.fields.title.value || "Poradnik" },
      ),
    },
    { label: "Praktyczna wiedza (poradniki)" },
  ),

  installer: fields.object(
    {
      title: fields.text({ label: "Tytuł" }),
      text: fields.text({ label: "Opis" }),
      placeholder: fields.text({ label: "Podpowiedź w wyszukiwarce" }),
    },
    { label: "Znajdź instalatora" },
  ),

  social: fields.object(
    {
      title: fields.text({ label: "Tytuł" }),
      youtubeFeed: fields.text({
        label: "Filmy — feed kanału YouTube (RSS)",
        description:
          "Górny pasek pokazuje najnowsze filmy i Shorts z kanału (Shorts w węższych, pionowych kafelkach), odświeżane raz na dobę. Lista „Filmy” poniżej jest używana tylko wtedy, gdy feed jest pusty lub niedostępny.",
      }),
      videos: fields.array(
        fields.object({
          image: image("Miniatura filmu (640×360)"),
          href: fields.text({ label: "Link do filmu" }),
        }),
        { label: "Filmy (górny pasek)", itemLabel: (v) => v.fields.href.value || "Film" },
      ),
      posts: fields.array(
        fields.object({
          image: image("Post (4:5, np. 1080×1350)"),
          href: fields.text({ label: "Link do posta" }),
        }),
        {
          label: "Posty (dolny pasek) — zapasowe",
          description:
            "Dolny pasek pokazuje najnowsze posty z Instagrama (token INSTAGRAM_ACCESS_TOKEN), odświeżane raz na dobę. Ta lista jest używana tylko, gdy Instagram jest niedostępny.",
          itemLabel: (p) => p.fields.href.value || "Post",
        },
      ),
    },
    { label: "Odkryj nas na Social Media" },
  ),

  seo: fields.object(
    {
      title: fields.text({ label: "Tytuł" }),
      subtitle: fields.text({ label: "Podtytuł" }),
      text: fields.text({ label: "Tekst", multiline: true }),
      background: image("Tło (1920×1080)"),
    },
    { label: "Sekcja SEO (o marce)" },
  ),
};

// Guides (blog) — imported from the old WordPress site (scripts/import-wordpress.mjs),
// then edited here. The home page shows the newest ones in "Praktyczna wiedza".
export const guideCategories = [
  "Klimatyzacja",
  "Pompy ciepła",
  "Rekuperacja",
  "RVF/VRF",
  "Dla domu",
  "Dla mieszkania",
  "Dla biznesu",
  "Poradnik",
  "Akademia Rotenso",
  "Media",
  "Case study",
] as const;

export const guideSchema = {
  title: fields.slug({ name: { label: "Tytuł" }, slug: { label: "Adres (slug)" } }),
  date: fields.date({ label: "Data publikacji" }),
  categories: fields.multiselect({
    label: "Kategorie",
    options: guideCategories.map((c) => ({ label: c, value: c })),
  }),
  excerpt: fields.text({ label: "Zajawka", multiline: true }),
  image: image("Zdjęcie główne", "guides"),
  imageAlt: fields.text({ label: "Opis zdjęcia (alt)" }),
  sourceUrl: fields.text({
    label: "Adres na starej stronie",
    description: "Karta na stronie głównej prowadzi tu, dopóki nie powstanie podstrona poradnika.",
  }),
  content: fields.markdoc({
    label: "Treść",
    options: {
      // Headings keep their anchors so "Z tego artykułu dowiesz się" links (#co-to-cwu) work.
      heading: {
        levels: [2, 3, 4, 5, 6],
        schema: { id: fields.text({ label: "Kotwica (id) — do linków ze spisu treści" }) },
      },
    },
  }),
};

// Product families (one page per family, e.g. "Mirai"). Technical data, prices, photos and
// download files come from the product feed; marketing content is edited here.
export const productKinds = [
  { label: "Klimatyzacja — High Premium", value: "ac-high-premium" },
  { label: "Klimatyzacja — Premium", value: "ac-premium" },
  { label: "Klimatyzacja — Basic", value: "ac-basic" },
  { label: "Pompa ciepła", value: "heat-pump" },
  { label: "Systemy RVF", value: "rvf" },
  { label: "Rekuperacja", value: "recuperation" },
] as const;

export const productCategories = [
  { label: "Klimatyzacja", value: "klimatyzacja" },
  { label: "Pompy ciepła", value: "pompy-ciepla" },
  { label: "Rekuperacja", value: "rekuperacja" },
  { label: "Systemy RVF", value: "systemy-rvf" },
] as const;

export const productSchema = {
  name: fields.slug({ name: { label: "Nazwa (np. Mirai)" }, slug: { label: "Adres (slug)" } }),
  kind: fields.select({ label: "Rodzaj karty produktu", options: productKinds, defaultValue: "ac-high-premium" }),
  category: fields.select({ label: "Kategoria (adres strony)", options: productCategories, defaultValue: "klimatyzacja" }),
  categoryLabel: fields.text({ label: "Nad nazwą w hero (np. Klimatyzacja)" }),
  tagline: fields.text({ label: "Hasło w hero" }),
  heroImage: image("Zdjęcie hero (1920×1030)", "products"),
  description: fields.text({ label: "Opis w sekcji zakupowej", multiline: true }),
  variants: fields.array(
    fields.object({
      label: fields.text({ label: "Moc (np. 2,6 kW)" }),
      symbols: fields.text({
        label: "Symbole z feedu",
        description:
          "Jednostka wewnętrzna + zewnętrzna, np. M26XI R15 + M26XO R15. Z nich strona bierze cenę (tylko PL), parametry, zdjęcia i pliki do pobrania.",
      }),
      dimensions: fields.object(
        {
          indoor: image("Wymiary — jednostka wewnętrzna", "products"),
          outdoor: image("Wymiary — jednostka zewnętrzna", "products"),
          remote: image("Wymiary — pilot", "products"),
        },
        { label: "Rysunki wymiarowe tej mocy (Specyfikacja) — puste = domyślne produktu" },
      ),
    }),
    { label: "Moce", itemLabel: (v) => v.fields.label.value || "Moc" },
  ),
  purchaseIntro: fields.object(
    {
      kicker: fields.text({ label: "Nadtytuł (np. Klimatyzacja idealna)" }),
      title: fields.text({ label: "Tytuł (np. do twojego domu lub twojej firmy)" }),
      text: fields.text({ label: "Tekst pod tytułem" }),
      background: image("Tło (rozmyte zdjęcie)", "products"),
    },
    { label: "Sekcja zakupowa — nagłówek" },
  ),
  arLink: link("Kafelek „Zobacz jak wygląda ten model w twoim pomieszczeniu”"),
  accessoriesLink: link("Kafelek „Zobacz akcesoria pasujące do tego modelu”"),
  gallery: fields.array(image("Zdjęcie", "products"), {
    label: "Galeria — wizualizacje",
    description:
      "Pokazywane w sekcji e-commerce jako pierwsze, w tej kolejności. Po nich strona dokłada zdjęcia z feedu wybranej mocy (jednostka wewnętrzna, potem zewnętrzna).",
  }),
  family: fields.object(
    {
      label: fields.text({ label: "Nazwa tej wersji na przełączniku (np. Mirai)" }),
      other: link("Druga wersja (np. Mirai Multi)"),
      canonical: fields.text({
        label: "Adres oryginału (canonical)",
        description: "Tylko na kopii, np. na Mirai Multi: /pl/klimatyzacja/mirai. Na oryginale zostaw puste.",
      }),
    },
    { label: "Wersje (Split / Multi)" },
  ),
  siblings: fields.array(
    fields.object({ name: fields.text({ label: "Nazwa" }), image: image("Miniatura", "products"), href: fields.text({ label: "Adres" }) }),
    { label: "Pozostałe modele z tej serii (np. kolory)", itemLabel: (s) => s.fields.name.value || "Model" },
  ),
  dimensions: fields.object(
    {
      indoor: image("Wymiary — jednostka wewnętrzna", "products"),
      outdoor: image("Wymiary — jednostka zewnętrzna", "products"),
      remote: image("Wymiary — pilot", "products"),
    },
    { label: "Rysunki wymiarowe — domyślne (gdy moc nie ma własnych)" },
  ),
  featureGroups: fields.array(
    fields.object({
      title: fields.text({ label: "Grupa (np. Zdrowie i czystość)" }),
      items: fields.array(
        fields.object({
          name: fields.text({ label: "Cecha" }),
          tooltip: fields.text({ label: "Podpowiedź po najechaniu (opcjonalnie)", multiline: true }),
        }),
        { label: "Cechy", itemLabel: (i) => i.fields.name.value || "Cecha" },
      ),
    }),
    { label: "Cechy produktu (Specyfikacja)", itemLabel: (g) => g.fields.title.value || "Grupa" },
  ),
  intro: fields.object(
    {
      image: image("Kadr / zdjęcie (1920×1080)", "products"),
      video: fields.text({
        label: "Film (adres MP4, opcjonalnie)",
        description: "Np. z Bunny. Gdy jest — odtwarza się w pętli bez dźwięku zamiast zdjęcia.",
      }),
      title: fields.text({ label: "Tytuł" }),
      text: fields.text({ label: "Tekst", multiline: true }),
      more: fields.text({ label: "Napis nad strzałką (np. Poznaj model Mirai)" }),
    },
    { label: "Sekcja „Intro Video 180” (pod paskiem produktu)" },
  ),
  feature: fields.object(
    {
      show: fields.checkbox({ label: "Pokaż sekcję", defaultValue: true }),
      background: image("Tło (1920×1030)", "products"),
      unitImage: image("Jednostka (przezroczysty PNG, 530×220)", "products"),
      airflow: image("Nawiew (na czarnym tle — nakładany trybem „screen”)", "products"),
      kicker: fields.text({ label: "Nadtytuł" }),
      title: fields.text({ label: "Tytuł", multiline: true }),
      text: fields.text({ label: "Tekst", multiline: true }),
    },
    { label: "Sekcja „Cecha” (panel na zdjęciu)" },
  ),
  featureSlides: fields.array(
    fields.object({
      image: image("Zdjęcie (1340×754)", "products"),
      title: fields.text({ label: "Tytuł" }),
      text: fields.text({ label: "Tekst", multiline: true }),
    }),
    { label: "Slajder cech (duże slajdy)", itemLabel: (s) => s.fields.title.value || "Slajd" },
  ),
  splitVsMulti: fields.checkbox({
    label: "Pokaż sekcję „Split czy Multi Split?”",
    description: "Treść sekcji jest wspólna — Ustawienia → Split czy Multi Split.",
    defaultValue: false,
  }),
  advantages: fields.object(
    {
      title: fields.text({ label: "Tytuł (np. Poznaj więcej atutów)" }),
      items: fields.array(
        fields.object({
          image: image("Zdjęcie (970×545)", "products"),
          title: fields.text({ label: "Tytuł" }),
          text: fields.text({ label: "Opis pod aktywnym kafelkiem", multiline: true }),
        }),
        { label: "Kafelki slajdera", itemLabel: (s) => s.fields.title.value || "Atut" },
      ),
      grid: fields.array(
        fields.object({
          image: image("Zdjęcie", "products"),
          title: fields.text({ label: "Tytuł" }),
          text: fields.text({ label: "Opis po kliknięciu „+” (puste = bez przycisku)", multiline: true }),
        }),
        {
          label: "Siatka pod slajderem (4 kafelki: szeroki, wąski / wąski, szeroki)",
          itemLabel: (s) => s.fields.title.value || "Kafelek",
        },
      ),
    },
    { label: "Atuty" },
  ),
  videos: fields.array(
    fields.object({
      url: fields.text({ label: "Link do filmu YouTube" }),
      title: fields.text({ label: "Tytuł" }),
      text: fields.text({ label: "Opis", multiline: true }),
    }),
    {
      label: "Multimedia — filmy o produkcie",
      description: "Miniatury pobierane z YouTube. Docelowo lista może być uzupełniana automatycznie (YouTube API).",
      itemLabel: (v) => v.fields.title.value || "Film",
    },
  ),
  faq: fields.array(
    fields.object({
      question: fields.text({ label: "Pytanie" }),
      answer: fields.text({ label: "Odpowiedź", multiline: true }),
    }),
    { label: "Pytania i odpowiedzi (FAQ)", itemLabel: (q) => q.fields.question.value || "Pytanie" },
  ),
  seoTitle: fields.text({ label: "SEO — tytuł" }),
  seoDescription: fields.text({ label: "SEO — opis", multiline: true }),
};

const footerColumn = fields.object({
  heading: link("Nagłówek"),
  links: fields.array(link("Link"), {
    label: "Linki",
    itemLabel: (l) => l.fields.label.value || "Link",
  }),
});

export const settingsSchema = {
  nav: fields.array(link("Pozycja menu"), {
    label: "Menu główne",
    itemLabel: (l) => l.fields.label.value || "Pozycja",
  }),
  searchPlaceholder: fields.text({ label: "Wyszukiwarka — podpowiedź" }),
  configurator: link("Przycisk „Konfigurator”"),
  installer: link("Przycisk „Dla instalatora”"),
  footerColumns: fields.array(footerColumn, {
    label: "Stopka — kolumny",
    itemLabel: (c) => c.fields.heading.fields.label.value || "Kolumna",
  }),
  aiChat: link("Przycisk czatu (prawy dolny róg)"),
  contactHeading: fields.text({ label: "Stopka — nagłówek kontaktu" }),
  phone: fields.text({ label: "Telefon" }),
  email: fields.text({ label: "E-mail" }),
  contactForm: link("Przycisk formularza"),
  navigate: link("Przycisk „Nawiguj”"),
  social: fields.object(
    {
      facebook: fields.text({ label: "Facebook" }),
      youtube: fields.text({ label: "YouTube" }),
      instagram: fields.text({ label: "Instagram" }),
      tiktok: fields.text({ label: "TikTok" }),
      spotify: fields.text({ label: "Spotify" }),
      linkedin: fields.text({ label: "LinkedIn" }),
    },
    { label: "Social media" },
  ),
  splitVsMulti: fields.object(
    {
      title: fields.text({ label: "Tytuł" }),
      split: fields.object(
        { image: image("Grafika", "products"), title: fields.text({ label: "Tytuł" }), text: fields.text({ label: "Tekst", multiline: true }) },
        { label: "Split" },
      ),
      multi: fields.object(
        { image: image("Grafika", "products"), title: fields.text({ label: "Tytuł" }), text: fields.text({ label: "Tekst", multiline: true }) },
        { label: "Multi Split" },
      ),
    },
    { label: "Karty produktów — „Split czy Multi Split?”" },
  ),
  quoteForm: fields.object(
    {
      title: fields.text({ label: "Tytuł" }),
      text: fields.text({ label: "Tekst pod tytułem", multiline: true }),
      background: image("Tło", "forms"),
      step1: fields.text({ label: "Krok 1 — tekst", multiline: true }),
      phone: fields.text({ label: "Pole: telefon" }),
      email: fields.text({ label: "Pole: e-mail" }),
      postcode: fields.text({ label: "Pole: kod pocztowy" }),
      contactTime: fields.text({ label: "Pole: pora kontaktu" }),
      contactTimes: fields.array(fields.text({ label: "Opcja" }), { label: "Pora kontaktu — opcje", itemLabel: (o) => o.value || "Opcja" }),
      consent: fields.text({ label: "Zgoda — skrót (widoczny)" }),
      consentFull: fields.text({
        label: "Zgoda — pełna treść (po kliknięciu „rozwiń”)",
        description: "Do uzupełnienia przez dział prawny. Puste = brak przycisku „rozwiń”.",
        multiline: true,
      }),
      required: fields.text({ label: "Dopisek (np. *pola wymagane)" }),
      submit: fields.text({ label: "Przycisk" }),
      success: fields.text({ label: "Komunikat po wysłaniu", multiline: true }),
      error: fields.text({ label: "Komunikat błędu", multiline: true }),
      step2Image: image("Krok 2 — zdjęcie", "forms"),
      step2: fields.text({ label: "Krok 2 — tekst", multiline: true }),
      step3Image: image("Krok 3 — zdjęcie", "forms"),
      step3: fields.text({ label: "Krok 3 — tekst", multiline: true }),
    },
    { label: "Karty produktów — formularz „Zapytaj o wycenę”" },
  ),
  copyright: fields.text({
    label: "Stopka — prawa autorskie",
    description: "{rok} zostanie zastąpione bieżącym rokiem",
    multiline: true,
  }),
};

// Mega menu ("Menu v04", Figma 5172:83010). Tabs → categories (left column) → centre sections
// with product tiles, a footer row of shortcut tiles and a right column (solutions + buttons).
export const menuIcons = [
  { label: "Brak", value: "" },
  { label: "Klimatyzator ścienny", value: "menu-scienne" },
  { label: "Wielopokojowe", value: "menu-wielopokojowe" },
  { label: "Sufitowe / przypodłogowe", value: "menu-sufitowe" },
  { label: "Kasetonowe", value: "menu-kasetonowe" },
  { label: "Systemy RVF", value: "menu-rvf" },
  { label: "Pompa niskotemperaturowa", value: "menu-pompa-niskotemp" },
  { label: "Pompa Split", value: "menu-pompa-split" },
  { label: "Pompa Monoblock", value: "menu-pompa-monoblock" },
  { label: "Pompy w kolorach", value: "menu-pompa-kolor" },
  { label: "Pompa All-in", value: "menu-pompa-allin" },
  { label: "Zbiorniki", value: "menu-zbiorniki" },
  { label: "Konfigurator (ikona z prawej, bez strzałki)", value: "menu-configurator" },
];

const menuProduct = fields.object({
  name: fields.text({ label: "Nazwa" }),
  tagline: fields.text({ label: "Hasło / opis", multiline: true }),
  href: fields.text({ label: "Adres strony produktu" }),
  image: image("Zdjęcie", "menu"),
  image2: image("Drugie zdjęcie (np. moduł wewnętrzny pompy ciepła — obok, z prawej)", "menu"),
  colors: fields.array(fields.text({ label: "Kolor (np. #737373)" }), {
    label: "Wersje kolorystyczne (kropki pod nazwą)",
    itemLabel: (c) => c.value || "Kolor",
  }),
});

const menuSection = fields.object({
  title: fields.text({ label: "Tytuł (np. Klimatyzacje ścienne)" }),
  text: fields.text({ label: "Opis pod tytułem (opcjonalnie)", multiline: true }),
  button: link("Czerwony przycisk obok opisu (opcjonalnie, np. Dowiedz się więcej)"),
  cards: fields.select({
    label: "Kafelki",
    options: [
      { label: "Klimatyzatory ścienne (niskie zdjęcie 209×69)", value: "wall" },
      { label: "Wysokie zdjęcie (209×140)", value: "tall" },
    ],
    defaultValue: "wall",
  }),
  products: fields.array(menuProduct, { label: "Produkty", itemLabel: (p) => p.fields.name.value || "Produkt" }),
  seeAll: link("Kafelek „Zobacz wszystkie” (puste = bez kafelka)"),
});

const menuCategory = fields.object({
  label: fields.text({ label: "Nazwa w lewej kolumnie", multiline: true }),
  icon: fields.select({ label: "Ikona", options: menuIcons, defaultValue: "menu-scienne" }),
  sections: fields.array(menuSection, {
    label: "Sekcje środkowej kolumny (oddzielone kreską)",
    itemLabel: (s) => s.fields.title.value || "Sekcja",
  }),
  footer: fields.array(
    fields.object({
      label: fields.text({ label: "Tekst", multiline: true }),
      href: fields.text({ label: "Adres" }),
      icon: fields.select({ label: "Ikona", options: menuIcons, defaultValue: "" }),
    }),
    { label: "Kafelki na dole (skróty)", itemLabel: (f) => f.fields.label.value || "Skrót" },
  ),
  solutionsTitle: fields.text({ label: "Prawa kolumna — tytuł listy (np. Rozwiązania)" }),
  solutions: fields.array(link("Pozycja"), { label: "Prawa kolumna — lista", itemLabel: (l) => l.fields.label.value || "Pozycja" }),
  buttons: fields.array(link("Przycisk"), { label: "Prawa kolumna — przyciski", itemLabel: (l) => l.fields.label.value || "Przycisk" }),
});

export const menuSchema = {
  tabs: fields.array(
    fields.object({
      label: fields.text({ label: "Zakładka (np. Klimatyzacje)" }),
      href: fields.text({
        label: "Adres",
        description: "Zakładka bez kategorii (np. Rekuperacja) od razu przechodzi pod ten adres.",
      }),
      categories: fields.array(menuCategory, {
        label: "Kategorie (lewa kolumna) — pierwsza otwiera się domyślnie",
        itemLabel: (c) => c.fields.label.value || "Kategoria",
      }),
    }),
    {
      label: "Mega menu „Produkty” — zakładki",
      description: "Otwiera się po kliknięciu pierwszej pozycji menu głównego.",
      itemLabel: (t) => t.fields.label.value || "Zakładka",
    },
  ),
};

// "O nas v03" (Figma 5172:76530).
export const aboutSchema = {
  hero: fields.object(
    {
      image: image("Zdjęcie (1820×930)", "about"),
      video: fields.text({ label: "Film w tle (adres MP4, opcjonalnie)" }),
      title: fields.text({ label: "Tytuł" }),
      text: fields.text({ label: "Tekst", multiline: true }),
    },
    { label: "Nagłówek" },
  ),
  stats: fields.array(
    fields.object({ value: fields.text({ label: "Liczba (np. 25+)" }), label: fields.text({ label: "Opis" }) }),
    { label: "Liczby", itemLabel: (s) => `${s.fields.value.value} ${s.fields.label.value}` },
  ),
  company: fields.object(
    {
      background: image("Tło", "about"),
      title: fields.text({ label: "Tytuł" }),
      text: fields.text({ label: "Tekst", multiline: true }),
      videoImage: image("Kadr filmu", "about"),
      videoUrl: fields.text({ label: "Link do filmu (YouTube) — bez linku nie ma przycisku play" }),
    },
    { label: "Polska firma z globalną wizją" },
  ),
  ecosystem: fields.object(
    {
      background: image("Tło", "about"),
      title: fields.text({ label: "Tytuł" }),
      text: fields.text({ label: "Tekst", multiline: true }),
      tiles: fields.array(
        fields.object({
          image: image("Zdjęcie (970×545)", "about"),
          title: fields.text({ label: "Tytuł" }),
          text: fields.text({ label: "Opis pod aktywnym kafelkiem", multiline: true }),
          cta: link("Przycisk"),
        }),
        { label: "Kafelki", itemLabel: (t) => t.fields.title.value || "Kafelek" },
      ),
    },
    { label: "Kompleksowy ekosystem" },
  ),
  production: fields.object(
    {
      title: fields.text({ label: "Tytuł" }),
      text: fields.text({ label: "Tekst", multiline: true }),
      videoImage: image("Kadr filmu", "about"),
      videoUrl: fields.text({ label: "Link do filmu (YouTube) — bez linku nie ma przycisku play" }),
    },
    { label: "Produkcja i eksport" },
  ),
  mission: fields.object(
    { background: image("Tło", "about"), text: fields.text({ label: "Misja", multiline: true }) },
    { label: "Misja (cytat)" },
  ),
  international: fields.object(
    {
      title: fields.text({ label: "Tytuł" }),
      text: fields.text({ label: "Tekst", multiline: true }),
      map: image("Mapa", "about"),
      countries: fields.text({ label: "Kraje (oddzielone |)" }),
    },
    { label: "Sprzedaż międzynarodowa" },
  ),
  timeline: fields.object(
    {
      title: fields.text({ label: "Tytuł" }),
      text: fields.text({ label: "Tekst" }),
      items: fields.array(
        fields.object({ year: fields.text({ label: "Rok" }), title: fields.text({ label: "Tytuł" }), text: fields.text({ label: "Opis", multiline: true }) }),
        { label: "Historia", itemLabel: (i) => `${i.fields.year.value} — ${i.fields.title.value}` },
      ),
    },
    { label: "Historia marki (oś czasu)" },
  ),
  articles: fields.object(
    {
      title: fields.text({ label: "Tytuł" }),
      text: fields.text({ label: "Tekst" }),
      readLabel: fields.text({ label: "Przycisk na karcie" }),
      more: link("Przycisk pod sliderem"),
    },
    { label: "Artykuły (karty = najnowsze poradniki)" },
  ),
  certificates: fields.object(
    {
      title: fields.text({ label: "Tytuł" }),
      text: fields.text({ label: "Tekst", multiline: true }),
      logos: fields.array(
        fields.object({ image: image("Logo", "about"), name: fields.text({ label: "Nazwa (dla czytników ekranu)" }) }),
        { label: "Logotypy", itemLabel: (l) => l.fields.name.value || "Logo" },
      ),
    },
    { label: "Certyfikaty i nagrody" },
  ),
  career: fields.object(
    {
      background: image("Tło", "about"),
      title: fields.text({ label: "Tytuł", multiline: true }),
      text: fields.text({ label: "Tekst", multiline: true }),
      cta: link("Przycisk"),
    },
    { label: "Kariera" },
  ),
  showroom: fields.object(
    {
      kicker: fields.text({ label: "Nadtytuł" }),
      title: fields.text({ label: "Tytuł" }),
      text: fields.text({ label: "Tekst", multiline: true }),
      images: fields.array(
        fields.object({ image: image("Zdjęcie", "about"), title: fields.text({ label: "Podpis (opcjonalnie)" }) }),
        { label: "Zdjęcia", itemLabel: (i) => i.fields.title.value || "Zdjęcie" },
      ),
    },
    { label: "Showroom" },
  ),
  recent: fields.object(
    {
      title: fields.text({ label: "Tytuł" }),
      text: fields.text({ label: "Tekst" }),
      button: fields.text({ label: "Przycisk na karcie" }),
    },
    { label: "Ostatnio oglądane (pokazuje się tylko, gdy ktoś oglądał produkty)" },
  ),
  contact: fields.object(
    {
      background: image("Tło", "about"),
      title: fields.text({ label: "Tytuł" }),
      text: fields.text({ label: "Tekst", multiline: true }),
      address: fields.text({ label: "Adres", multiline: true }),
      cta: link("Przycisk"),
    },
    { label: "Kontakt (telefon i e-mail z Ustawień)" },
  ),
  seoTitle: fields.text({ label: "SEO — tytuł" }),
  seoDescription: fields.text({ label: "SEO — opis", multiline: true }),
};
