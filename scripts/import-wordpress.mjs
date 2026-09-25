// Imports blog posts from a WordPress export (WXR) into the Keystatic "Poradniki" collection.
//
//   node scripts/import-wordpress.mjs "C:\path\to\export.xml" [--lang=pl] [--force]
//
// For every published post: content/<lang>/guides/<slug>.mdoc (front matter + Markdoc body)
// and the featured image, resized to 1200px, in public/images/guides/<slug>.jpg.
// Existing files are skipped unless --force, so edits made in the CMS are not overwritten.
// Images are looked up through the public REST API of the old site (the export has no media).

import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { XMLParser } from "fast-xml-parser";
import yaml from "js-yaml";
import sharp from "sharp";
import TurndownService from "turndown";

const file = process.argv[2];
const args = Object.fromEntries(process.argv.slice(3).map((a) => a.replace(/^--/, "").split("=")).map(([k, v]) => [k, v ?? true]));
const lang = args.lang ?? "pl";
const force = Boolean(args.force);
if (!file) throw new Error('Usage: node scripts/import-wordpress.mjs "export.xml"');

const CATEGORIES = new Set(["Klimatyzacja", "Pompy ciepła", "Rekuperacja", "RVF/VRF", "Dla domu", "Dla mieszkania", "Dla biznesu", "Poradnik", "Akademia Rotenso", "Media", "Case study"]);
const outDir = path.join("content", lang, "guides");
const imgDir = path.join("public", "images", "guides");
await mkdir(outDir, { recursive: true });
await mkdir(imgDir, { recursive: true });

// --- read export -----------------------------------------------------------------------------

const named = { nbsp: "\u00A0", reg: "®", copy: "©", ndash: "–", mdash: "—", hellip: "…", bdquo: "„", rdquo: "”", oacute: "ó", trade: "™" };
const raw = (await readFile(file, "utf8")).replace(/&(nbsp|reg|copy|ndash|mdash|hellip|bdquo|rdquo|oacute|trade);/g, (_, n) => named[n]);
const xml = new XMLParser({ ignoreAttributes: false, parseTagValue: false, processEntities: true }).parse(raw);
const site = String(xml.rss.channel.link).replace(/\/pl\/?$/, "");
const items = [].concat(xml.rss.channel.item ?? []);
const posts = items.filter((i) => i["wp:post_type"] === "post" && i["wp:status"] === "publish");
const metaOf = (p) => Object.fromEntries([].concat(p["wp:postmeta"] ?? []).map((m) => [m["wp:meta_key"], String(m["wp:meta_value"] ?? "")]));

// --- media via REST --------------------------------------------------------------------------

const mediaIds = new Set();
for (const p of posts) {
  const t = metaOf(p)._thumbnail_id;
  if (t) mediaIds.add(t);
  for (const m of String(p["content:encoded"] ?? "").matchAll(/image_url="(\d+)"/g)) mediaIds.add(m[1]);
}
const media = new Map();
const ids = [...mediaIds];
for (let i = 0; i < ids.length; i += 100) {
  const url = `${site}/wp-json/wp/v2/media?include=${ids.slice(i, i + 100).join(",")}&per_page=100&_fields=id,source_url,alt_text`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Media API ${res.status}`);
  for (const m of await res.json()) media.set(String(m.id), { url: m.source_url, alt: m.alt_text ?? "" });
}
console.log(`zdjęcia: ${media.size} z ${ids.length} znalezione przez API`);

// --- body: page-builder shortcodes → HTML → Markdoc -----------------------------------------

const attr = (s, name) => (s.match(new RegExp(`${name}="([^"]*)"`)) ?? [])[1];

function cleanShortcodes(html) {
  return html
    .replace(/\[vc_raw_html[^\]]*\][\s\S]*?\[\/vc_raw_html\]/g, "")
    .replace(/\[image_with_animation([^\]]*)\]/g, (_, a) => {
      const m = media.get(attr(a, "image_url"));
      return m ? `\n\n<img src="${m.url}" alt="${(m.alt || "").replace(/"/g, "&quot;")}">\n\n` : "";
    })
    .replace(/\[vc_video([^\]]*)\]/g, (_, a) => (attr(a, "link") ? `\n\n<p><a href="${attr(a, "link")}">Zobacz wideo</a></p>\n\n` : ""))
    .replace(/\[nectar_btn([^\]]*)\]/g, (_, a) => (attr(a, "url") ? `<p><a href="${attr(a, "url")}">${attr(a, "text") || attr(a, "url")}</a></p>` : ""))
    .replace(/\[vc_custom_heading([^\]]*)\]/g, (_, a) => (attr(a, "text") ? `<h2>${attr(a, "text")}</h2>` : ""))
    .replace(/\[(nectar_hotspot|nectar_image_with_hotspots|recent_posts|divider)[^\]]*\](?:[\s\S]*?\[\/\1\])?/g, "")
    .replace(/\[\/?[a-z_]+(?:\s[^\]]*)?\]/g, "\n\n"); // any other shortcode: keep its inner text
}

// WordPress "autop": blank lines separate paragraphs.
function autop(html) {
  return html
    .split(/\n\s*\n/)
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .map((chunk) => (/^<(h[1-6]|ul|ol|p|img|table|blockquote|figure|div)\b/i.test(chunk) ? chunk : `<p>${chunk.replace(/\n/g, "<br>")}</p>`))
    .join("\n");
}

const td = new TurndownService({ headingStyle: "atx", bulletListMarker: "-", emDelimiter: "*" });
td.remove(["script", "style", "iframe", "input"]);
// Headings keep their anchors (tables of contents link to them) as Markdoc attributes; H1 → H2.
td.addRule("heading", {
  filter: ["h1", "h2", "h3", "h4", "h5", "h6"],
  replacement: (content, node) => {
    const level = Math.max(2, Number(node.nodeName[1]));
    const id = node.getAttribute("id");
    const text = content.replace(/\s+/g, " ").trim();
    return text ? `\n\n${"#".repeat(level)} ${text}${id ? ` {% #${id} %}` : ""}\n\n` : "";
  },
});

const toMarkdoc = (html) =>
  td
    .turndown(autop(cleanShortcodes(html)))
    .replace(/\u00A0/g, " ")
    .replace(/\{%(?! #[\w-]+ %\})/g, "\\{%") // literal "{%" in text must not start a Markdoc tag
    .replace(/[ \t]+$/gm, "") // trailing spaces (old <br> hard breaks)
    .replace(/^-\s{2,}/gm, "- ") // "-   item" → "- item"
    .replace(/^(\d+\.)\s{2,}/gm, "$1 ")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/^((?:- |\d+\. ).*)\n\n(?=- |\d+\. )/gm, "$1\n") // tight lists: no blank line between items
    .replace(/^((?:- |\d+\. ).*)\n\n(?=- |\d+\. )/gm, "$1\n")
    .trim();

function excerptOf(html) {
  const text = cleanShortcodes(html).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  if (text.length <= 200) return text;
  return text.slice(0, 200).replace(/\s+\S*$/, "") + "…";
}

// --- write -----------------------------------------------------------------------------------

let written = 0;
let skipped = 0;
let noImage = 0;
for (const p of posts) {
  const slug = decodeURIComponent(String(p["wp:post_name"]));
  const target = path.join(outDir, `${slug}.mdoc`);
  if (existsSync(target) && !force) {
    skipped++;
    continue;
  }
  const html = String(p["content:encoded"] ?? "");
  const meta = metaOf(p);
  const cats = [].concat(p.category ?? []).filter((c) => c["@_domain"] === "category").map((c) => String(c["#text"] ?? c));

  let image = null;
  let imageAlt = "";
  const m = media.get(meta._thumbnail_id);
  if (m) {
    const out = path.join(imgDir, `${slug}.jpg`);
    if (!existsSync(out) || force) {
      const buf = Buffer.from(await (await fetch(m.url)).arrayBuffer());
      await sharp(buf).resize({ width: 1200, withoutEnlargement: true }).flatten({ background: "#ffffff" }).jpeg({ quality: 80, mozjpeg: true }).toFile(out);
    }
    image = `/images/guides/${slug}.jpg`;
    imageAlt = m.alt;
  } else noImage++;

  const front = {
    title: String(p.title).trim(),
    date: String(p["wp:post_date"]).slice(0, 10),
    categories: [...new Set(cats.filter((c) => CATEGORIES.has(c)))],
    excerpt: String(p["excerpt:encoded"] ?? "").trim() || excerptOf(html),
    image,
    imageAlt,
    sourceUrl: String(p.link),
  };
  await writeFile(target, `---\n${yaml.dump(front, { lineWidth: -1 })}---\n${toMarkdoc(html)}\n`, "utf8");
  written++;
}
console.log(`wpisy: ${written} zapisane, ${skipped} pominięte (już istnieją), ${noImage} bez zdjęcia głównego`);
