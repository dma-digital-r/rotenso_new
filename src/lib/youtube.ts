import "server-only";
import { XMLParser } from "fast-xml-parser";

export type YouTubeVideo = { id: string; title: string; href: string; image: string };

type Entry = {
  "yt:videoId": string;
  title: string;
  link?: { "@_href"?: string } | { "@_href"?: string }[];
};

const DAY = 86400;

// Best thumbnail that exists: maxres (1280×720) if YouTube generated one, else sd (640×480,
// letterboxed — object-fit: cover trims the bars in the 640×360 tile).
async function thumbnail(id: string): Promise<string> {
  const maxres = `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`;
  try {
    const res = await fetch(maxres, { method: "HEAD", next: { revalidate: DAY } });
    if (res.ok) return maxres;
  } catch {
    // fall through
  }
  return `https://i.ytimg.com/vi/${id}/sddefault.jpg`;
}

/**
 * Latest videos from a channel's public RSS feed (15 newest). Shorts are skipped by default —
 * they are vertical and don't fit the 640×360 tiles.
 */
export async function getChannelVideos(
  feedUrl: string,
  { includeShorts = false, limit = 12 } = {},
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
      return { id: String(e["yt:videoId"]), title: String(e.title ?? ""), href };
    })
    .filter((v) => v.id && (includeShorts || !v.href.includes("/shorts/")))
    .slice(0, limit);

  return Promise.all(videos.map(async (v) => ({ ...v, image: await thumbnail(v.id) })));
}
