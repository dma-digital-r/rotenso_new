import "server-only";
import { XMLParser } from "fast-xml-parser";

/** `vertical` = a Short (9:16), shown in a narrower tile. */
export type YouTubeVideo = { id: string; title: string; href: string; image: string; vertical: boolean };

type Entry = {
  "yt:videoId": string;
  title: string;
  link?: { "@_href"?: string } | { "@_href"?: string }[];
};

const DAY = 86400;

const exists = async (url: string) => {
  try {
    return (await fetch(url, { method: "HEAD", next: { revalidate: DAY } })).ok;
  } catch {
    return false;
  }
};

// Best thumbnail that exists. Shorts: the vertical oar2 (1080×1920). Videos: maxres (1280×720),
// else sd (640×480, letterboxed — object-fit: cover trims the bars). Both fallbacks are also
// fine for Shorts, whose vertical frame sits in the middle of the landscape thumbnail.
async function thumbnail(id: string, vertical: boolean): Promise<string> {
  const base = `https://i.ytimg.com/vi/${id}`;
  if (vertical && (await exists(`${base}/oar2.jpg`))) return `${base}/oar2.jpg`;
  if (await exists(`${base}/maxresdefault.jpg`)) return `${base}/maxresdefault.jpg`;
  return `${base}/sddefault.jpg`;
}

/** Latest videos and Shorts from a channel's public RSS feed (15 newest), newest first. */
export async function getChannelVideos(
  feedUrl: string,
  { includeShorts = true, limit = 15 } = {},
): Promise<YouTubeVideo[]> {
  const res = await fetch(feedUrl, { next: { revalidate: DAY } });
  if (!res.ok) throw new Error(`YouTube feed ${res.status}`);
  const doc = new XMLParser({ ignoreAttributes: false }).parse(await res.text()) as {
    feed?: { entry?: Entry | Entry[] };
  };
  const entries = doc.feed?.entry == null ? [] : Array.isArray(doc.feed.entry) ? doc.feed.entry : [doc.feed.entry];

  const videos = entries
    .map((e) => {
      const links = Array.isArray(e.link) ? e.link : e.link ? [e.link] : [];
      const href = links.map((l) => l["@_href"]).find(Boolean) ?? `https://www.youtube.com/watch?v=${e["yt:videoId"]}`;
      return { id: String(e["yt:videoId"]), title: String(e.title ?? ""), href, vertical: href.includes("/shorts/") };
    })
    .filter((v) => v.id && (includeShorts || !v.vertical))
    .slice(0, limit);

  return Promise.all(videos.map(async (v) => ({ ...v, image: await thumbnail(v.id, v.vertical) })));
}
