// Copies the images embedded in guide texts from the old WordPress site to this site.
//   npm run guides:images
// Every ![](https://rotenso.com/wp-content/…) in content/pl/guides/*.mdoc is downloaded,
// resized to max 1300px wide, saved as public/images/guides/inline/<slug>-<n>.<ext> and the
// link in the text is replaced. Already copied images are skipped, so it is safe to re-run.

import { existsSync } from "node:fs";
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const dir = "content/pl/guides";
const outDir = "public/images/guides/inline";
await mkdir(outDir, { recursive: true });

const IMG = /!\[([^\]]*)\]\((https?:\/\/(?:www\.)?rotenso\.com\/wp-content\/[^)\s]+)\)/g;
let copied = 0;
let failed = 0;

for (const file of (await readdir(dir)).filter((f) => f.endsWith(".mdoc"))) {
  const slug = file.replace(/\.mdoc$/, "");
  const src = path.join(dir, file);
  let text = await readFile(src, "utf8");
  const found = [...text.matchAll(IMG)];
  if (!found.length) continue;
  let n = 0;
  for (const [whole, alt, url] of found) {
    n += 1;
    const png = /\.png$/i.test(url);
    const name = `${slug}-${n}.${png ? "png" : "jpg"}`;
    const target = path.join(outDir, name);
    if (!existsSync(target)) {
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(String(res.status));
        const img = sharp(Buffer.from(await res.arrayBuffer())).resize({ width: 1300, withoutEnlargement: true });
        await (png ? img.png({ compressionLevel: 9 }) : img.jpeg({ quality: 82, mozjpeg: true })).toFile(target);
        copied += 1;
      } catch (e) {
        failed += 1;
        console.warn(`! ${slug}: ${url} — ${e.message} (zostaje stary link)`);
        continue;
      }
    }
    text = text.replace(whole, `![${alt}](/images/guides/inline/${name})`);
  }
  await writeFile(src, text);
}
console.log(`Skopiowano ${copied} zdjęć, błędów: ${failed}.`);
