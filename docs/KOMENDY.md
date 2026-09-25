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

## Formularz „Zapytaj o wycenę”
- Zgłoszenia idą na `/api/lead`, a stamtąd — metodą POST w formacie JSON — pod adres z `.env.local` → `LEAD_WEBHOOK_URL` (np. webhook CRM albo automatyzacji maili).
- Dopóki `LEAD_WEBHOOK_URL` nie jest ustawiony, formularz uczciwie pokazuje komunikat błędu (nic nie ginie po cichu).
- Pełną treść zgody RODO wpisuje się w panelu (Ustawienia → formularz → „Zgoda — pełna treść”); wtedy pojawia się „rozwiń”.

## Figma (dla programisty)
| Polecenie | Co robi |
|---|---|
| `node --env-file=.env.local scripts/figma-fetch.mjs <id-węzła>` | Pobiera dane i zdjęcia elementu z Figmy (token `FIGMA_TOKEN`). |

## Sekrety (plik `.env.local`, nie trafia na GitHub)
`PRODUCT_FEED_*` (feed produktów), `INSTALLERS_FEED_*` (instalatorzy), `BUNNY_*` (zdjęcia/wideo),
`FIGMA_TOKEN`, `DEEPL_API_KEY`, `INSTAGRAM_ACCESS_TOKEN`, `LEAD_WEBHOOK_URL` (formularz wyceny).
