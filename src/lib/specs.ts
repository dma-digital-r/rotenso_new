import type { FeedProduct } from "./productFeed";

// Technical specification of a split air conditioner, built from feed attributes and grouped
// as in Figma ("Specyfikacja techniczna", 5172:81746). Values come from the indoor (IDU) and
// outdoor (ODU) unit of the selected capacity.

export type SpecRow = { label: string; sub?: string; value: string };
export type SpecGroup = { title: string; rows: SpecRow[] };

// "2.1" → "2,1" (Polish decimal comma), leaving fractions like 1/4” alone.
const formatValue = (v: string) => v.replace(/(\d)\.(\d)/g, "$1,$2").trim();

// "Prędkość wentylatora / (Wys./Śr./Ni./Ci.) (obr/min)" → label "Prędkość wentylatora (obr/min)",
// sub "Wys. / Śr. / Ni. / Ci."; names without such a qualifier are kept as they are.
function splitName(raw: string): { label: string; sub?: string } {
  const name = raw.replace(/\(\(([^()]*)\)\)/g, "($1)"); // "((mm))" → "(mm)"
  const m = name.match(/^(.+?) \/ \(([^)]+)\)\s*(\([^)]*\)+)?\s*$/);
  if (!m) return { label: name };
  const sub = m[2].replace(/×/g, " × ").replace(/\//g, " / ").replace(/\s+/g, " ").trim();
  return { label: m[3] ? `${m[1]} ${m[3]}` : m[1], sub };
}

// Nominal + range pairs shown as "2638 (999-4158)".
const PAIRS = (mode: "Chłodzenie" | "Grzanie") => [
  { label: "Wydajność (W)", nom: [`Wydajność / ${mode} / Nominalna (W)`], range: [`Wydajność / ${mode} / Min-Maks (W)`] },
  { label: "Pobór mocy (W)", nom: [`Pobór mocy / ${mode} / Nominalny (W)`, `Pobór mocy / ${mode} / Nominalna (W)`], range: [`Pobór mocy / ${mode} / Min-Maks (W)`] },
  { label: "Prąd pracy (A)", nom: [`Prąd pracy / ${mode} / Nominalna (A)`, `Prąd pracy / ${mode} / Nominalny (A)`], range: [`Prąd pracy / ${mode} / Min-Maks (A)`] },
];

const COOLING = ["Obciążenie chłodnicze (kW)", "SEER (W/W)", "Klasa wydajności energetycznej - chłodzenie", "Roczne zużycie energii - chłodzenie (kWh/a)"];
const HEATING = [
  "Obciążenie cieplne (Tbiv -7°C) (kW)",
  "SCOP (W/W)",
  "Klasa wydajności energetycznej - grzanie",
  "Roczne zużycie energii - grzanie (kWh/a)",
  "Deklarowana wydajność w warunkach ogrzewania / (średni sezon) (kW)",
  "Zapas mocy w warunkach ogrzewania / (średni sezon) (kW)",
];

// Attributes that belong to a named group whichever unit carries them (matched by prefix).
const BY_PREFIX: [string, string[]][] = [
  ["Czynnik chłodniczy", ["Czynnik chłodniczy", "Dodatkowa ilość czynnika"]],
  ["Instalacja - chłodnicza", ["Przyłącza rur", "Maksymalna długość instalacji", "Maksymalna różnica poziomów"]],
  ["Dane elektryczne", ["Rodzaj zasilania", "Zabezpieczenie", "Przewody", "Maksymalne zużycie energii", "Maksymalny prąd pracy"]],
  ["Zakres pracy", ["Zakres pracy"]],
];

// Never listed: identification and the "Cecha" compatibility flags (own group).
const SKIP = [/^Model$/, /^Seria Rotenso$/, /^Generacja$/, /^Jednostka (wewnętrzna|zewnętrzna)$/, /^Rodzaj rewersyjnej pompy ciepła$/, /^Kompatybilność z systemami$/, /^1:/];

export function buildSpecs(idu?: FeedProduct, odu?: FeedProduct): SpecGroup[] {
  const units = [idu, odu].filter(Boolean) as FeedProduct[];
  const first = (keys: string[]) => {
    for (const k of keys) for (const u of units) if (u.attributes[k]) return u.attributes[k];
    return undefined;
  };
  const used = new Set<string>();
  const take = (keys: string[]) => {
    keys.forEach((k) => used.add(k));
    return first(keys);
  };

  const modeGroup = (mode: "Chłodzenie" | "Grzanie", singles: string[]): SpecGroup => {
    const rows: SpecRow[] = [];
    for (const p of PAIRS(mode)) {
      const nom = take(p.nom);
      const range = take(p.range);
      if (nom) rows.push({ label: p.label, sub: range ? "Nom. (Min. - Maks.)" : undefined, value: formatValue(range ? `${nom} (${range})` : nom) });
    }
    for (const k of singles) {
      const v = take([k]);
      if (v) rows.push({ ...splitName(k), value: formatValue(v) });
    }
    return { title: mode, rows };
  };

  const groups: SpecGroup[] = [modeGroup("Chłodzenie", COOLING), modeGroup("Grzanie", HEATING)];

  const prefixed = new Map<string, SpecRow[]>(BY_PREFIX.map(([t]) => [t, []]));
  const groupOf = (name: string) => BY_PREFIX.find(([, ps]) => ps.some((p) => name.startsWith(p)))?.[0];
  // Inside a named group the group's own name is dropped: "Czynnik chłodniczy / Typ" → "Typ".
  const inGroup = (title: string, name: string) => {
    const s = splitName(name);
    const label = s.label.startsWith(`${title} / `) ? s.label.slice(title.length + 3) : s.label;
    return { ...s, label: label.charAt(0).toUpperCase() + label.slice(1) };
  };
  const unitRows = (u: FeedProduct | undefined, other?: FeedProduct): SpecRow[] => {
    if (!u) return [];
    const rows: SpecRow[] = [];
    const ean: SpecRow[] = [];
    for (const [name, value] of Object.entries(u.attributes)) {
      if (used.has(name) || !value || SKIP.some((r) => r.test(name))) continue;
      const g = groupOf(name);
      if (g) {
        const row = { ...inGroup(g, name), value: formatValue(value) };
        if (!prefixed.get(g)!.some((r) => r.label === row.label)) prefixed.get(g)!.push(row);
        continue;
      }
      // Same parameter with the same value on the other unit is listed only once (indoor unit).
      if (other && other.attributes[name] === value) continue;
      (name.startsWith("Kod produktu EAN") ? ean : rows).push({ ...splitName(name), value: formatValue(value) });
    }
    return [...rows, ...ean];
  };
  const iduRows = unitRows(idu);
  const oduRows = unitRows(odu, idu);
  if (iduRows.length) groups.push({ title: "Jednostka wewnętrzna", rows: iduRows });
  if (oduRows.length) groups.push({ title: "Jednostka zewnętrzna", rows: oduRows });
  for (const [title, rows] of prefixed) if (rows.length) groups.push({ title, rows });

  const compat = units[0]
    ? Object.entries(units[0].attributes)
        .filter(([k]) => /^1:/.test(k))
        .map(([k, v]) => ({ label: k, value: v }))
    : [];
  if (compat.length) groups.push({ title: "Kompatybilność z systemami", rows: compat });

  return groups.filter((g) => g.rows.length);
}
