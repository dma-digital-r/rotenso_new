import "server-only";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

// Latest posts of the Rotenso Instagram account (Instagram API with Instagram Login).
// Token: INSTAGRAM_ACCESS_TOKEN in .env.local (first one); refreshed tokens live in .cache/.

export type InstagramPost = { id: string; href: string; image: string; title: string };

type Media = {
  id: string;
  media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  media_url?: string;
  thumbnail_url?: string;
  permalink: string;
  caption?: string;
};

const API = "https://graph.instagram.com/v23.0";
const DAY = 86400;

// Long-lived tokens last 60 days. Every refresh returns a NEW token, so the newest one is
// saved to .cache/instagram-token.json (git-ignored) and preferred over the .env value.
// Refresh at most once a day, as part of the page regeneration.
const TOKEN_FILE = path.join(process.cwd(), ".cache", "instagram-token.json");

async function currentToken(): Promise<string | undefined> {
  try {
    const saved = JSON.parse(await readFile(TOKEN_FILE, "utf8")) as { token?: string };
    if (saved.token) return saved.token;
  } catch {
    // no saved token yet
  }
  return process.env.INSTAGRAM_ACCESS_TOKEN;
}

async function refreshToken(token: string) {
  try {
    const saved = JSON.parse(await readFile(TOKEN_FILE, "utf8").catch(() => "{}")) as { refreshedAt?: string };
    if (saved.refreshedAt && Date.now() - Date.parse(saved.refreshedAt) < DAY * 1000) return;
    const res = await fetch(`https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${token}`, {
      cache: "no-store",
    });
    const body = (await res.json()) as { access_token?: string; expires_in?: number; error?: { message: string } };
    if (!body.access_token) {
      console.warn("[instagram] odświeżenie tokenu:", body.error?.message ?? res.status);
      return;
    }
    await mkdir(path.dirname(TOKEN_FILE), { recursive: true });
    const expiresAt = new Date(Date.now() + (body.expires_in ?? 0) * 1000).toISOString();
    await writeFile(TOKEN_FILE, JSON.stringify({ token: body.access_token, refreshedAt: new Date().toISOString(), expiresAt }, null, 2));
  } catch (e) {
    console.warn("[instagram] odświeżenie tokenu nie powiodło się:", (e as Error).message);
  }
}

/**
 * Newest posts (photos, carousels, Reels). Image URLs from Instagram expire after a few days;
 * the page regenerates daily with fresh ones and next/image keeps its own resized copies.
 */
export async function getInstagramPosts(limit = 12): Promise<InstagramPost[]> {
  const token = await currentToken();
  if (!token) throw new Error("INSTAGRAM_ACCESS_TOKEN missing");
  await refreshToken(token);

  const fields = "id,media_type,media_url,thumbnail_url,permalink,caption";
  const res = await fetch(`${API}/me/media?fields=${fields}&limit=${limit}&access_token=${token}`, {
    next: { revalidate: DAY },
  });
  const body = (await res.json()) as { data?: Media[]; error?: { message: string } };
  if (!res.ok || body.error) throw new Error(body.error?.message ?? `Instagram ${res.status}`);

  return (body.data ?? [])
    .map((m) => ({
      id: m.id,
      href: m.permalink,
      // Reels: the cover frame; photos and carousels: the (first) image.
      image: (m.media_type === "VIDEO" ? m.thumbnail_url : m.media_url) ?? "",
      title: (m.caption ?? "").replace(/\s+/g, " ").trim().slice(0, 120),
    }))
    .filter((p) => p.image);
}
