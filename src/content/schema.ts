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
          image: image("Post (310×310)"),
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
  copyright: fields.text({
    label: "Stopka — prawa autorskie",
    description: "{rok} zostanie zastąpione bieżącym rokiem",
    multiline: true,
  }),
};
