# Strona główna — status (2026-09-25)

Źródło: Figma „Main Page v09” (5172:70322), 1920×11007. Referencyjny render: `docs/figma-ref/home-full.png`.

## Gotowe (wymiary i odstępy wg współrzędnych z Figmy)
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
| Znajdź instalatora | 5172:70435 | checkboxy, filtry, lista z własnym paskiem przewijania (mapa statyczna) |
| Stopka | 5172:70326 | — |

## Brakuje — limit wywołań Figma MCP (plan Starter) wyczerpany
Do pobrania skryptem `scripts/figma-fetch.mjs` (token Figma) albo po odnowieniu limitu:

| Element | Node | Co brakuje |
|---|---|---|
| Tło slajdu hero „Klimatyzacje” (+ tła 3 kolejnych slajdów) | 5172:70641 | zdjęcie/wideo — pozostałe slajdy nie są w projekcie |
| Tło sekcji „komfort” (rodzina w kuchni) | 5172:70625 | zdjęcie |
| Wideo/zdjęcie domu w sekcji Wentilo | 5172:70613 | prawdopodobnie wideo |
| „Odkryj nas na Social Media” | 5172:70335 | cała sekcja |
| Sekcja SEO „Rotenso — Innowacyjne systemy HVAC” | 5172:70327 | cała sekcja |
| Przycisk „Ai Chat” | 5172:70664 | ikona i zachowanie |
| Tła sekcji (Rectangle 7 / 32 / 33) | 5172:70325 / 70323 / 70324 | dokładny gradient (teraz przybliżony z renderu) |
| Mega menu „Produkty” | 5172:83010 | cały komponent (16 wariantów) |
| Rozwinięta wyszukiwarka | 5172:94960 | dropdown z podpowiedziami |

## Do decyzji / treści
- Slajd „Klimatyzacje dla firm” w Figmie ma tylko tło — brak listy modeli i panelu. Układ jest gotowy (jak „dla Ciebie”); modele można dodać w panelu Keystatic.
- Modele 2–6 w „Klimatyzacje dla Ciebie” mają w projekcie tylko nazwę — opisy i ceny do uzupełnienia w panelu.
- Opisy pod kafelkami pomp ciepła to „Lorem ipsum” z projektu.
- Top bar przewija się razem ze stroną (w projekcie brak wersji „przyklejonej” dla strony głównej).
- Wersja mobilna (375 px) jest w Figmie — będzie osobnym etapem; do tego czasu strona ma min. szerokość 1400 px.
