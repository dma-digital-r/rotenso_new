// Exports Figma nodes (icons) as SVG files into public/icons/.
//   node --env-file=.env.local scripts/figma-svg.mjs menu-scienne=5172:84948 menu-sufitowe=5172:84960
// Each argument is <file name>=<node id>; the file is written to public/icons/<file name>.svg.

import { writeFile } from "node:fs/promises";
import path from "node:path";

// Default: the main design file. Another file: --file=<key from the Figma link, after /design/>.
const fileArg = process.argv.find((a) => a.startsWith("--file="));
const FILE_KEY = fileArg ? fileArg.slice(7) : "rvv91RlTgxgArSSr0KTOGu";
const token = process.env.FIGMA_TOKEN;
const pairs = process.argv.slice(2).filter((a) => !a.startsWith("--")).map((a) => a.split("="));
if (!token || !pairs.length || pairs.some((p) => p.length !== 2)) {
  console.error("Użycie: node --env-file=.env.local scripts/figma-svg.mjs nazwa=5172:1234 …");
  process.exit(1);
}

const ids = pairs.map(([, id]) => id).join(",");
const res = await fetch(`https://api.figma.com/v1/images/${FILE_KEY}?ids=${encodeURIComponent(ids)}&format=svg&svg_outline_text=true`, {
  headers: { "X-Figma-Token": token },
});
if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
const { images } = await res.json();

for (const [name, id] of pairs) {
  const url = images[id];
  if (!url) {
    console.warn(`! ${id} — Figma nie zwróciła pliku`);
    continue;
  }
  const svg = await (await fetch(url)).text();
  await writeFile(path.join("public", "icons", `${name}.svg`), svg);
  console.log(`${name}.svg ← ${id}`);
}
