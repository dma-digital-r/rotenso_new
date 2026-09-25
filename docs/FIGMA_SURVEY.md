# Figma survey — Rotenso_VCS (2026-09-25)

File: https://www.figma.com/design/rvv91RlTgxgArSSr0KTOGu/Rotenso_VCS — one page "Design" (732:407).
Desktop frames are 1920 wide (content ~1300–1820), mobile frames 375 wide.
Hidden section "Poprzednie wersje" (4069:46252) = old versions, ignore.

## Design tokens (variables)
Colors: Rotenso Red #ED1C1A · Rotenso Grey #546670 · Light Rotenso Grey #839FAE · Grey #DDDDDD · Grey #F0F0F0 · White #FFFFFF
Font: Open Sans only.
- H1 72/1.2 Light (300) · H2 40/1.2 Light · H3 25 Light · S1 25 Light
- H4 18 Regular · Menu 16 Regular · Body 1 16/24 Regular · Body 2 12 Regular
Effect: Shadow Dark L — drop shadow #00000040, offset 30/30, blur 50.

## Shared components — "Stałe komponenety" (5172:94960)
Header (desktop: logo, Produkty / O nas / Poradniki / Katalogi / Kontakt, search, Konfigurator (red), Dla instalatora, lang PL),
mobile header + bottom tab bar (Klimatyzacje, Rekuperacja, [R], Pompy ciepła, Dla instalatora),
search dropdown (Wyszukiwania / Polecane produkty / Polecane artykuły), installer card, mobile accordion menu, footer (desktop + mobile).
Mega menu: "Menu v04" (5172:83010, 16 variants), "Menu Hover" (5172:67012), "Menu Mobile v1" (5172:85930).

## Desktop pages → planned templates
| Figma frame | id | Template |
|---|---|---|
| Main Page v09 | 5172:70322 | home |
| Klimatyzacja High Premium v04 (Mirai) | 5172:81567 | product (AC) |
|   … Specyfikacja / Do Pobrania | 5172:81741 / 5172:82131 | product tabs |
| Klimatyzacja Premium v02 | 5172:71463 | product (AC) |
| Klimatyzacja Basic v02 | 5172:71496 | product (AC) |
| Wentilo v04 | 5172:70665 | product (recuperation) |
| Pompy Ciepła v06 (+ Specyfikacja 2240:16568, Do Pobrania 5172:82225) | 5172:77286 | product (heat pump) |
| Akcesoria Filtry Wentilo v02 | 5172:71529 | product (accessory) |
| Inwestycje v06 | 5172:75884 | landing (investments) |
| Inwestycje Produkt v03 | 5172:76356 | investment product |
| Kategoria Produkty Klimatyzacje v02 | 5172:71670 | product list + filters |
| … Rozwiązania v02 | 5172:75628 | list by solution |
| … Multi Split v02 | 5172:74746 | product list |
| Kategoria Produkty Pompy Ciepła v01 | 5172:74876 | product list |
| Doboromierz Start / Rekuperacja v01 | 5172:75086 / 5172:71804 | sizing tool (interactive) |
| Konfigurator Rekuperacja (section) | 5172:92153 | configurator (interactive) |
| Asystent klima / reku / pompa | 5172:91228 / 91239 / 91250 | assistant panels |
| Porównywarka Klimatyzacja v03 (+ zmiana modelu, top bar) | 5172:71817 | comparator (interactive) |
| O nas v03 | 5172:76530 | static |
| Znajdź instalatora v02 (+ 3 map states) | 5172:93655 | installer map (interactive) |
| Blog Poradnik v03 | 5172:76810 | blog list |
| Wyniki wyszukiwania v1 (Produkty / Poradniki tabs) | 5172:93841 / 5172:151040 | search results |
| Podpowiedzi wyszukiwania v1 | 5172:77279 | search suggestions |
| Kontakt v03 | 5172:77102 | contact |
| Popups (Popup, Popup iEDGE, Formularz Inwestycje) | 5172:82922, 82933, 87211, 139870 | modals / forms |

Product cards: Box V variants (split, split+filter, multi split, heat pump, heat pump+filter) 5172:87251…87625; hover plays background video.

Every desktop page has a mobile counterpart (frames at y≈-15959, x from -11015 to 14384).

## Image specs noted in the design
Hero/section backgrounds 16:9 1920×1080 (some 1920×930 / 1920×1130), responsive crop; 1:1 tiles 500×500 or 1000×1000; menu tiles 600×400.
