// Fetches node data and original image fills from the Figma REST API.
// Used when the Figma MCP quota is exhausted. Needs a personal access token:
//   Figma → Settings → Security → Personal access tokens (scope: File content — read only)
//
// Usage (PowerShell):
//   $env:FIGMA_TOKEN="figd_..."; node scripts/figma-fetch.mjs 5172:70641 5172:70625
//
// Writes docs/figma-nodes/<id>.json (full node tree) and saves every image fill
// found in those nodes to docs/figma-nodes/images/<imageRef>.<ext>.

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const FILE_KEY = "rvv91RlTgxgArSSr0KTOGu";
const token = process.env.FIGMA_TOKEN;
const ids = process.argv.slice(2);

if (!token || ids.length === 0) {
  console.error("Set FIGMA_TOKEN and pass node ids, e.g. node scripts/figma-fetch.mjs 5172:70641");
  process.exit(1);
}

const api = async (url) => {
  const res = await fetch(`https://api.figma.com/v1/${url}`, { headers: { "X-Figma-Token": token } });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} — ${url}`);
  return res.json();
};

const outDir = path.join("docs", "figma-nodes");
const imgDir = path.join(outDir, "images");
await mkdir(imgDir, { recursive: true });

const { nodes } = await api(`files/${FILE_KEY}/nodes?ids=${encodeURIComponent(ids.join(","))}&geometry=paths`);
const refs = new Set();
const walk = (n) => {
  for (const f of [...(n.fills ?? []), ...(n.background ?? [])]) {
    if (f.imageRef) refs.add(f.imageRef);
    if (f.type === "VIDEO") console.warn(`! ${n.id} "${n.name}" has a VIDEO fill — export the video file manually`);
  }
  (n.children ?? []).forEach(walk);
};

for (const [id, entry] of Object.entries(nodes)) {
  if (!entry) {
    console.warn(`! ${id} not found`);
    continue;
  }
  walk(entry.document);
  await writeFile(path.join(outDir, `${id.replace(":", "-")}.json`), JSON.stringify(entry.document, null, 2));
  console.log(`node ${id} "${entry.document.name}"`);
}

if (refs.size) {
  const { meta } = await api(`files/${FILE_KEY}/images`);
  for (const ref of refs) {
    const url = meta.images[ref];
    if (!url) continue;
    const res = await fetch(url);
    const type = res.headers.get("content-type") ?? "";
    const ext = type.includes("png") ? "png" : type.includes("webp") ? "webp" : type.includes("gif") ? "gif" : "jpg";
    await writeFile(path.join(imgDir, `${ref}.${ext}`), Buffer.from(await res.arrayBuffer()));
    console.log(`image ${ref}.${ext}`);
  }
}
