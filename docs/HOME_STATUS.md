# Strona główna — status (2026-09-25)

Źródło: Figma „Main Page v09” (5172:70322), 1920×11007. Referencyjny render: `docs/figma-ref/home-full.png`.
Pozycje sekcji sprawdzone w przeglądarce przy 1920 px: zgodne z Figmą do „Poradników” co do piksela,
na dole strony różnica 4 px (zaokrąglenia ułamkowych wysokości tekstu).

## Gotowe
| Sekcja | Figma | Interakcje |
|---|---|---|
| Top Bar (menu, wyszukiwarka, Konfigurator, Dla instalatora, język) | 5172:70663 | przełącznik 7 języków (rozwinięcie niezaprojektowane — prosta lista) |
| Hero, 4 slajdy + pasek czasu | 5172:70639 | autoplay 7 s, pasek postępu, strzałki, pauza, klik w zakładkę |
| „Klimatyzacja Rotenso to komfort…” | 5172:70623 | — |
| Klimatyzacje dla Ciebie / dla firm | 5172:70638 / 70635 | przesuwanie całego slidera (CTA), 6 modeli z autoplay 6 s, strzałki |
| Wentilo ICON + zimorodek | 5172:70583 / 70620 | pauza wideo, pasek postępu wideo |
| Pompy ciepła | 5172:70579 | klik w kafelek rozwija go (970 px), strzałki, pasek |
| Systemy RVF / VRF | 5172:70571 | — |
| Praktyczna wiedza (10 poradników) | 5172:70555 | przewijanie, strzałki, pasek postępu |
| Znajdź instalatora | 5172:70435 | checkboxy, filtry, lista z własnym paskiem przewijania (mapa statyczna — docelowo feed + MapLibre) |
| Odkryj nas na Social Media | 5172:70335 | dwa paski w pętli (filmy w lewo, posty w prawo), pauza po najechaniu |
| SEO „Rotenso — Innowacyjne systemy HVAC” | 5172:70327 | — |
| Przycisk AI Chat | 5172:70664 | na razie link do kontaktu |
| Tła sekcji (Rectangle 7 / 32 / 33) | 5172:70325 / 70323 / 70324 | gradient przeliczony dokładnie z Figmy |
| Stopka | 5172:70326 | rok aktualizuje się sam |

## Brakuje
| Element | Uwagi |
|---|---|
| Tła slajdów hero 2–4 (Rekuperacja, Pompy ciepła, Systemy RVF) | nie ma ich w projekcie — do dodania w panelu |
| Mega menu „Produkty” (5172:83010) i rozwinięta wyszukiwarka | do pobrania `scripts/figma-fetch.mjs` |
| Wideo zamiast zdjęć (hero, Wentilo) | w Figmie są zdjęcia; wideo od pracownika → Bunny Stream |

## Do decyzji / treści
- Slajd „Klimatyzacje dla firm” w Figmie ma tylko tło — brak listy modeli i panelu. Układ jest gotowy; modele do dodania w panelu.
- Modele 2–6 w „Klimatyzacje dla Ciebie” mają tylko nazwę — opisy i ceny do uzupełnienia.
- Opisy pod kafelkami pomp ciepła to „Lorem ipsum” z projektu. Linki social media to strony główne serwisów — do podmiany na profile Rotenso.
- Top bar przewija się razem ze stroną (brak wersji „przyklejonej” w projekcie strony głównej).
- Wersja mobilna (375 px) — osobny etap; do tego czasu min. szerokość 1400 px.
