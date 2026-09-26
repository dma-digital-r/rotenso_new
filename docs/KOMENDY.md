# Polecenia — lista robocza

Zbiór poleceń do obsługi portalu, uzupełniany na bieżąco. Na końcu projektu powstanie z tego
pełna dokumentacja dla marketingu. Polecenia wpisuje się w terminalu VS Code (Terminal → New Terminal)
w folderze projektu:

```
cd "C:\Users\Daniel Werner\Projekty\rotenso_new"
```

## Podgląd strony
| Polecenie | Co robi |
|---|---|
| `npm run dev` | Uruchamia podgląd na http://localhost:3000/pl (zmiany widać od razu). Zatrzymanie: `Ctrl+C`. |
| — | Panel treści: http://localhost:3000/keystatic (działa tylko na tym komputerze). |
| `npm run build` | Sprawdza, czy cała strona się buduje (przed publikacją). |

Gdy podgląd pokaże błąd „Jest worker…”: `Ctrl+C`, usuń folder `.next`, ponownie `npm run dev`.

## Wersja dla zespołu w sieci biurowej
| Polecenie | Co robi |
|---|---|
| `$env:NEXT_DIST_DIR=".next-lan"; npm run build` | Buduje wersję dla zespołu (PowerShell). |
| `$env:NEXT_DIST_DIR=".next-lan"; npx next start -H 0.0.0.0 -p 3001` | Udostępnia ją pod http://<IP-komputera>:3001/pl. |

Jednorazowo (PowerShell jako administrator) — otwarcie portu w zaporze:
```
New-NetFirewallRule -DisplayName "Rotenso podglad (3001)" -Direction Inbound -Protocol TCP -LocalPort 3001 -Action Allow -Profile Private,Public -RemoteAddress LocalSubnet
```

## Tłumaczenia
| Polecenie | Co robi |
|---|---|
| `npm run translate` | Tłumaczy zmienione teksty PL na pozostałe języki (DeepL, klucz `DEEPL_API_KEY`). Poprawek ręcznych nie nadpisuje. |
| `npm run translate -- --lang=de,fr` | To samo, tylko wybrane języki. |
| `npm run translate:memory` | Odbudowuje pliki językowe z zapisanych tłumaczeń (bez DeepL). |

## Ceny
| Polecenie | Co robi |
|---|---|
| `npm run prices` | Pokazuje, jak liczona jest cena „Już od” każdego modelu (ceny jednostek z feedu, stany, suma). |

## Poradniki (blog)
| Polecenie | Co robi |
|---|---|
| `npm run import:wordpress -- "C:\ścieżka\eksport.xml"` | Importuje wpisy z eksportu WordPressa. Dodaje tylko nowe, istniejących nie rusza. |

## Poradniki (blog)
- **Lista:** `/pl/poradniki` — nagłówek ze slajdami, „Warto przeczytać”, filtry kategorii, tagi, wyszukiwarka, stronicowanie (12 na stronę), „Najczęściej czytane”.
- **Panel → Poradniki — strona listy (PL):** wybór poradników do slajdów (puste = 4 najnowsze; 2 pierwsze slajdy nie powtarzają się na liście „Wszystkie”), „Warto przeczytać” (tylko ręcznie, puste = sekcja ukryta) i „Najczęściej czytane”, przyciski filtrów i przypisane im kategorie.
- **Panel → Poradniki (PL):** treść artykułów. Pole „Tagi” zasila filtr „#tagi” (przycisk pojawi się, gdy choć jeden poradnik ma tag).
- **Artykuł** (projekt: plik Figmy „Rotenso Podstrony”, ramka „Artykuły v.05”):
  - Szara ramka „Z tego artykułu dowiesz się” powstaje sama, gdy w treści jest akapit z tym tekstem, a zaraz pod nim lista.
  - „Spis treści” po lewej to nagłówki sekcji (poziom 2) z treści.
  - Pola „Podtytuł”, „Polecane produkty” i „Pytania i odpowiedzi” są opcjonalne — puste = sekcja ukryta.
  - Przycisk „Zadaj pytanie” i tytuł „Pozostałe artykuły” ustawia się w: Poradniki — strona listy.
- Na liście nie ma wpisów bez kategorii (strony z WordPressa: Kariera, Przetwarzanie danych).
- Inne języki pokazują polskie artykuły (z linkiem canonical do wersji PL), dopóki nie zostaną przetłumaczone.
- `npm run guides:images` — kopiuje zdjęcia i pliki podlinkowane w treści ze starego WordPressa na nową stronę (po imporcie nowych wpisów).

## Social media (automatycznie, raz na dobę)
- **YouTube** — górny pasek: najnowsze filmy i Shorts z kanału. Adres feedu: panel → Strona główna → Odkryj nas na Social Media → „Filmy — feed kanału YouTube”.
- **Instagram** — dolny pasek: najnowsze posty konta rotenso.official (Instagram API, aplikacja Meta „Rotenso – strona WWW”).
  - Pierwszy token: `.env.local` → `INSTAGRAM_ACCESS_TOKEN`. Strona sama go przedłuża co dobę i zapisuje najnowszy w `.cache/instagram-token.json`.
  - Gdyby posty przestały się pokazywać (np. zmiana hasła do Instagrama unieważnia token): Meta for Developers → aplikacja → Use cases → Instagram → API setup with Instagram login → Generate token → wkleić do `.env.local` i usunąć plik `.cache/instagram-token.json`.
  - Do tego czasu pasek pokazuje zapasowe grafiki z panelu.

## Karty produktów — gdzie co się edytuje
- **Panel → Produkty (PL) → np. Mirai**: hero, sekcja e-commerce, „Intro Video 180” (zdjęcie albo film MP4), „Cecha”, slajder cech, włącznik „Split czy Multi Split?”, Atuty (slajder + siatka z „+”), Multimedia (linki do filmów YouTube — miniatury pobierają się same), FAQ.
- **Panel → Ustawienia**: wspólna treść „Split czy Multi Split?” i formularza „Zapytaj o wycenę” (dla wszystkich kart).
- Pasek zdjęć nad „Odkryj nas na Social Media” to najnowsze posty z Instagrama (jak na stronie głównej).
- FAQ trafia też do danych strukturalnych (FAQPage) — pomaga w wynikach Google i odpowiedziach AI.

## Karty produktów — rodzaje
- **Rodzaj karty** (pole „Rodzaj karty produktu” w panelu) zmienia układ:
  - **High Premium** (np. Mirai): nagłówek na całą szerokość, „Intro Video 180”, sekcja „Cecha”, duży slajder cech.
  - **Premium** (np. Fresh): nagłówek w zaokrąglonym pudełku, tytuł na zdjęciu z nachodzącym szerokim slajderem, kafelki cech przed „Split czy Multi Split?”, bez zimorodka przy atutach.
- **Symbole z feedu:** zawsze najnowsza rewizja (liczba po „R”, np. R16). Przy budowaniu strony i w `npm run prices` pojawia się ostrzeżenie, jeśli w feedzie jest nowsza.
  - **Basic** (np. Roni): bez nagłówka — strona zaczyna się od sekcji zakupowej; potem pudełko z tytułem i kafelkami, filmy z tekstem na ciemnym tle, „Dodatkowe zalety”, „Warto rozważyć” (inne modele).
- **Pole „Jednostka wewnętrzna z przodu”** to zdjęcie na kafelku 180° w galerii.
- **Filmy:** hero, slajdy i kafelki mają pole „Film (adres MP4)”. Zdjęcie w tym samym miejscu jest okładką filmu (widać je, zanim film się wczyta). W Figmie ikona pauzy na obrazie = w tym miejscu jest film. Czerwona linia pokazuje postęp filmu; w slajderze po jego końcu przechodzi dalej.

## Zdjęcia — formaty
- W panelu można wgrywać JPG, PNG, WebP albo AVIF. Strona i tak wysyła przeglądarce **AVIF** (najlżejszy), a starszym przeglądarkom **WebP** — w rozmiarze dopasowanym do ekranu.
- Wgrywanie AVIF oszczędza miejsce w repozytorium; na wagę strony dla odwiedzających nie ma to wpływu.

## Strona „Inwestycje / Systemy RVF” (`/pl/systemy-rvf`)
- **Panel → Inwestycje / Systemy RVF (PL)**: nagłówek, 3 rodzaje systemów (slajdy), kalkulator + formularz, realizacje (kategorie), 3 karty, segmenty („Nasze rozwiązania”), FAQ.
- Otwiera ją przycisk „Dowiedz się więcej” w menu (Inwestycje → Systemy RVF/VRF).
- **Kalkulator**: pokazana cena = większa z „cena od” albo „zł za m²” × powierzchnia (ustawiasz w panelu). Tylko na stronie PL — na stronach zagranicznych kalkulatora i cen nie ma (nawet w kodzie strony).
- Zgłoszenia z formularza (z NIP i danymi z kalkulatora) idą tym samym kanałem co formularz wyceny: `LEAD_WEBHOOK_URL`.
- Ikony segmentów: pole „Ikona” przy segmencie (SVG); puste = ikona budynku.

## Formularz „Zapytaj o wycenę”
- Zgłoszenia idą na `/api/lead`, a stamtąd — metodą POST w formacie JSON — pod adres z `.env.local` → `LEAD_WEBHOOK_URL` (np. webhook CRM albo automatyzacji maili).
- Dopóki `LEAD_WEBHOOK_URL` nie jest ustawiony, formularz uczciwie pokazuje komunikat błędu (nic nie ginie po cichu).
- Pełną treść zgody RODO wpisuje się w panelu (Ustawienia → formularz → „Zgoda — pełna treść”); wtedy pojawia się „rozwiń”.

## Mega menu „Produkty”
- **Panel → Mega menu (PL)**: zakładki (Klimatyzacje, Rekuperacja, Pompy ciepła, Inwestycje, Filtry Wentilo) → kategorie w lewej kolumnie → sekcje z kafelkami produktów, kafelki-skróty na dole i prawa kolumna (Rozwiązania + przyciski).
- Menu otwiera **pierwsza pozycja menu głównego** (Ustawienia → Menu główne). Zakładka bez kategorii (np. Rekuperacja) działa jak zwykły link.
- Kafelek produktu: nazwa, hasło, zdjęcie (drugie zdjęcie = moduł wewnętrzny pompy ciepła), kropki kolorów (np. `#737373`).
- Po zmianie treści PL: `npm run translate` (lub `translate:memory`) — menu tłumaczy się razem ze stroną główną i ustawieniami.

## Strona „O nas”
- **Panel → O nas (PL)**: wszystkie sekcje (nagłówek, liczby, O firmie, Kompleksowy ekosystem, Produkcja i eksport, misja, mapa, oś czasu, certyfikaty, kariera, showroom, kontakt).
- Kafelki „Poznaj naszą markę” to automatycznie najnowsze poradniki (jak na stronie głównej).
- „Ostatnio oglądane” pokazuje się tylko osobie, która oglądała karty produktów. Lista jest zapisana w jej przeglądarce i nie trafia do nas.
- Przycisk play na kadrze filmu pojawia się dopiero po wpisaniu linku do filmu (YouTube).
- Telefon i e-mail w sekcji kontaktu pochodzą z Ustawień.

## Figma (dla programisty)
| Polecenie | Co robi |
|---|---|
| `node --env-file=.env.local scripts/figma-fetch.mjs <id-węzła>` | Pobiera dane i zdjęcia elementu z Figmy (token `FIGMA_TOKEN`). |
| `node --env-file=.env.local scripts/figma-svg.mjs nazwa=<id-węzła>` | Eksportuje ikonę z Figmy jako `public/icons/nazwa.svg`. |
| … `--file=<klucz pliku>` | Dla obu skryptów: inny plik Figmy niż główny (klucz z linku, po `/design/`). |

## Sekrety (plik `.env.local`, nie trafia na GitHub)
`PRODUCT_FEED_*` (feed produktów), `INSTALLERS_FEED_*` (instalatorzy), `BUNNY_*` (zdjęcia/wideo),
`FIGMA_TOKEN`, `DEEPL_API_KEY`, `INSTAGRAM_ACCESS_TOKEN`, `LEAD_WEBHOOK_URL` (formularz wyceny).
