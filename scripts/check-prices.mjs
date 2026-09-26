// Shows how the "Już od" prices on the home page are calculated from the product feed.
//   npm run prices
// For every model: the symbols set in the CMS, each unit's gross price and stock, and the total
// (rounded up to whole PLN). Flags missing symbols and units that are out of stock.

import { readFile } from "node:fs/promises";
import { XMLParser } from "fast-xml-parser";
import yaml from "js-yaml";

const url = process.env.PRODUCT_FEED_URL?.split("?")[0];
const { PRODUCT_FEED_USERNAME: username, PRODUCT_FEED_PASSWORD: password } = process.env;
if (!url || !username || !password) throw new Error("Brak PRODUCT_FEED_* w .env.local");

const res = await fetch(url, { method: "POST", body: new URLSearchParams({ username, password }) });
if (!res.ok) throw new Error(`Feed ${res.status}`);
const doc = new XMLParser({ ignoreAttributes: true, parseTagValue: false }).parse(await res.text());
const bySymbol = new Map();
for (const p of [].concat(doc.products.product)) {
  // Clearance items ("Wyprzedaż …") are single returned units — never part of the price.
  if (String(p.producer).trim() === "Rotenso" && !/wyprzeda/i.test(String(p.name))) bySymbol.set(String(p.symbol).trim().toUpperCase(), p);
}

const home = yaml.load(await readFile("content/pl/home.yaml", "utf8"));
for (const [label, slide] of [["Klimatyzacje dla Ciebie", home.acHome], ["Klimatyzacje dla firm", home.acBusiness]]) {
  console.log(`\n${label}`);
  for (const m of slide.products) {
    if (!m.priceSymbols) {
      console.log(`  ${m.name}: bez ceny (puste pole)`);
      continue;
    }
    let sum = 0;
    let ok = true;
    const parts = m.priceSymbols.split("+").map((s) => s.trim());
    const lines = parts.map((s) => {
      const p = bySymbol.get(s.toUpperCase());
      if (!p) {
        ok = false;
        return `      ${s}: BRAK W FEEDZIE`;
      }
      sum += Number(p.price);
      const [, base, rev] = s.toUpperCase().match(/^(.*) R(\d+)$/) ?? [];
      const newer = base && [...bySymbol.keys()].filter((k) => k.startsWith(`${base} R`) && Number(k.split(" R").at(-1)) > Number(rev));
      if (newer?.length) console.log(`      ⚠ ${s}: w feedzie jest nowsza rewizja ${newer.join(", ")} — strona pokazuje tylko najnowszą`);
      const stock = Number(p.stock);
      return `      ${s}: ${Number(p.price).toFixed(2)} zł brutto, stan ${stock}${stock <= 0 ? "  ⚠ brak na stanie" : ""}`;
    });
    console.log(`  ${m.name}: ${ok ? `Już od: ${Math.ceil(Math.round(sum * 100) / 100)} zł` : "CENA UKRYTA (brak symbolu)"}`);
    lines.forEach((l) => console.log(l));
  }
}
