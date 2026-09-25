# Tłumaczenia

Źródłem jest wersja polska (`content/pl/`). Pozostałe języki (`en`, `de`, `fr`, `cs`, `it`, `uk`) są generowane
skryptem `scripts/translate.mjs` i można je potem poprawiać w panelu Keystatic („Strona główna (DE)” itd.).

## Jak to działa
1. Skrypt zbiera z plików PL wszystkie teksty (bez linków, zdjęć i nazw modeli).
2. Tłumaczy je (DeepL albo pamięć tłumaczeń z `scripts/translations/<język>.json`).
3. Zapisuje `content/<język>/*.yaml` o tej samej strukturze co PL. Linki `/pl/...` zamienia na `/<język>/...`.
4. W `content/.i18n-manifest.json` zapamiętuje, co wpisał w każdym polu.

**Ochrona ręcznych poprawek:** jeśli ktoś zmienił tłumaczenie w panelu, skrypt to wykrywa i tego pola już nie
nadpisuje — nawet gdy zmieni się tekst polski (w raporcie: „poprawionych ręcznie (zostawione)”).
Pole jest tłumaczone ponownie tylko wtedy, gdy zmienił się tekst PL, a tłumaczenia nikt nie ruszał.

## Uruchamianie
```
npm run translate                 # DeepL — wymaga DEEPL_API_KEY w .env.local
npm run translate:memory          # bez DeepL — z pamięci tłumaczeń w scripts/translations/
npm run translate -- --lang=de,fr # tylko wybrane języki
node scripts/translate.mjs --extract   # lista tekstów PL do tłumaczenia
```

## Zasady
- Nazwy marek i modeli (Rotenso, Wentilo ICON, Mirai, Versu…, RVF/VRF) nie są tłumaczone.
- Teksty interfejsu wpisane w kod (etykiety przycisków, opisy dla czytników ekranu, podpisy w wyszukiwarce
  instalatorów) są w `src/i18n/ui.ts`.
- Ceny („Już od: 2859 zł”) są przenoszone bez przeliczania waluty — do ustalenia cenniki dla innych krajów.
- Polski i czeski: jednoliterowe słowa (i, w, z, a, k, s, v…) są automatycznie sklejane z następnym wyrazem,
  żeby nie zostawały na końcu wiersza.
