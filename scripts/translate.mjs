// Translates content/pl/*.yaml into the other site languages.
//
//   node --env-file=.env.local scripts/translate.mjs              DeepL (needs DEEPL_API_KEY)
//   node scripts/translate.mjs --engine=memory                    use scripts/translations/<lang>.json
//   node scripts/translate.mjs --extract                          list PL strings that need translating
//   node scripts/translate.mjs --lang=de,fr                       only some languages
//
// Protection of manual edits: content/.i18n-manifest.json remembers, per field, a hash of
// the PL source and of the text this script wrote. A field is (re)translated only when it is
// new or its PL source changed AND nobody edited the translation since the last run.
// A field changed by hand in the CMS is never overwritten — it is listed as "kept".

import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import yaml from "js-yaml";

const FILES = ["home", "settings", "menu", "about"];
const TARGETS = ["en", "de", "fr", "cs", "it", "uk"];
const DEEPL_TARGET = { en: "EN-GB", de: "DE", fr: "FR", cs: "CS", it: "IT", uk: "UK" };

// Keys whose values are never translated (media, links, model names).
const SKIP_KEYS = new Set(["href", "image", "image2", "thumb", "background", "media", "video", "name", "priceSymbols", "icon", "cards"]);
// Brand and product names DeepL must leave untouched.
const KEEP_TERMS = [
  "Rotenso", "Wentilo ICON", "Wentilo", "Mirai", "Versu Cloth Caramel", "Versu Mirror R15",
  "Versu Pure", "Versu", "Luve Pro", "RVF", "VRF", "Split", "Multi Split", "Monoblock", "All-in",
];

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, v] = a.replace(/^--/, "").split("=");
    return [k, v ?? true];
  }),
);
const engine = args.engine ?? "deepl";
const targets = args.lang ? String(args.lang).split(",") : TARGETS;

const root = process.cwd();
const contentDir = path.join(root, "content");
const manifestPath = path.join(contentDir, ".i18n-manifest.json");
const hash = (s) => createHash("sha1").update(s).digest("hex").slice(0, 16);

const isTranslatable = (key, value) =>
  typeof value === "string" &&
  value.trim() !== "" &&
  !SKIP_KEYS.has(key) &&
  !/^(\/|https?:|mailto:|tel:|\+?\d[\d\s]+$)/.test(value) &&
  !/^[^\s@]+@[^\s@]+$/.test(value) &&
  !/^#[0-9a-f]{3,8}$/i.test(value) &&
  !/^Lorem ipsum/i.test(value);

// Collects [pathString, key, value] for every string leaf.
function leaves(node, prefix = [], out = []) {
  if (Array.isArray(node)) node.forEach((v, i) => leaves(v, [...prefix, i], out));
  else if (node && typeof node === "object") for (const [k, v] of Object.entries(node)) leaves(v, [...prefix, k], out);
  else out.push([prefix.join("."), prefix.at(-1), node]);
  return out;
}

const getAt = (obj, p) => p.split(".").reduce((o, k) => (o == null ? undefined : o[k]), obj);
function setAt(obj, p, value) {
  const keys = p.split(".");
  let o = obj;
  for (const k of keys.slice(0, -1)) o = o[k];
  o[keys.at(-1)] = value;
}

async function readYaml(file) {
  return existsSync(file) ? yaml.load(await readFile(file, "utf8")) : undefined;
}

// --- engines -------------------------------------------------------------------------------

async function deepl(texts, lang) {
  const key = process.env.DEEPL_API_KEY;
  if (!key) throw new Error("DEEPL_API_KEY is missing (.env.local). Use --engine=memory meanwhile.");
  const host = key.endsWith(":fx") ? "https://api-free.deepl.com" : "https://api.deepl.com";
  const protect = (t) =>
    KEEP_TERMS.reduce((s, term) => s.replace(new RegExp(`\\b${term}\\b`, "g"), `<keep>${term}</keep>`), t);
  const out = [];
  for (let i = 0; i < texts.length; i += 50) {
    const res = await fetch(`${host}/v2/translate`, {
      method: "POST",
      headers: { Authorization: `DeepL-Auth-Key ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        text: texts.slice(i, i + 50).map(protect),
        source_lang: "PL",
        target_lang: DEEPL_TARGET[lang],
        tag_handling: "xml",
        ignore_tags: ["keep"],
        preserve_formatting: true,
      }),
    });
    if (!res.ok) throw new Error(`DeepL ${res.status}: ${await res.text()}`);
    const { translations } = await res.json();
    out.push(...translations.map((t) => t.text.replace(/<\/?keep>/g, "")));
  }
  return out;
}

async function memory(texts, lang) {
  const file = path.join(root, "scripts", "translations", `${lang}.json`);
  const tm = existsSync(file) ? JSON.parse(await readFile(file, "utf8")) : {};
  const missing = texts.filter((t) => !(t in tm));
  if (missing.length) throw new Error(`${lang}: ${missing.length} strings missing in ${file}:\n- ${missing.join("\n- ")}`);
  return texts.map((t) => tm[t]);
}

// --- main ----------------------------------------------------------------------------------

const sources = Object.fromEntries(
  await Promise.all(FILES.map(async (f) => [f, await readYaml(path.join(contentDir, "pl", `${f}.yaml`))])),
);

if (args.extract) {
  const unique = new Set();
  for (const f of FILES) for (const [, key, v] of leaves(sources[f])) if (isTranslatable(key, v)) unique.add(v);
  console.log(JSON.stringify([...unique], null, 2));
  process.exit(0);
}

const manifest = existsSync(manifestPath) ? JSON.parse(await readFile(manifestPath, "utf8")) : {};
const translate = engine === "memory" ? memory : deepl;

for (const lang of targets) {
  const report = { translated: 0, kept: 0, unchanged: 0 };
  for (const f of FILES) {
    const src = sources[f];
    const targetFile = path.join(contentDir, lang, `${f}.yaml`);
    const current = await readYaml(targetFile);
    const entries = (manifest[lang] ??= {})[f] ??= {};
    const out = structuredClone(src);
    const todo = [];

    for (const [p, key, value] of leaves(src)) {
      // Internal links follow the language: /pl/... → /<lang>/...
      if (typeof value === "string" && /^\/pl(\/|$)/.test(value)) {
        setAt(out, p, value.replace(/^\/pl/, `/${lang}`));
        continue;
      }
      if (!isTranslatable(key, value)) continue;
      const existing = getAt(current, p);
      const entry = entries[p];
      const editedByHand = entry && typeof existing === "string" && hash(existing) !== entry.out;
      if (editedByHand) {
        setAt(out, p, existing);
        report.kept++;
      } else if (entry && entry.src === hash(value) && typeof existing === "string") {
        setAt(out, p, existing);
        report.unchanged++;
      } else {
        todo.push([p, value]);
      }
    }

    if (todo.length) {
      const translated = await translate(todo.map(([, v]) => v), lang);
      todo.forEach(([p, v], i) => {
        setAt(out, p, translated[i]);
        entries[p] = { src: hash(v), out: hash(translated[i]) };
      });
      report.translated += todo.length;
    }
    await mkdir(path.dirname(targetFile), { recursive: true });
    await writeFile(targetFile, yaml.dump(out, { lineWidth: -1, noRefs: true }), "utf8");
  }
  console.log(
    `${lang}: ${report.translated} przetłumaczonych, ${report.unchanged} bez zmian, ${report.kept} poprawionych ręcznie (zostawione)`,
  );
}

await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + "\n", "utf8");
