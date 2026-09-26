import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Lets a test build (NEXT_DIST_DIR=.next-test) run while `next dev` keeps using .next —
  // sharing one folder crashes the dev server.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  images: {
    // Every photo is served as AVIF (smallest), WebP to browsers without AVIF, whatever format was
    // uploaded (JPG, PNG, AVIF, WebP). Converted once per size and cached.
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    // YouTube thumbnails and Instagram posts (Social Media), product photos from the feed.
    // (object form without `search`, so Instagram's signed query strings are allowed)
    remotePatterns: [
      new URL("https://i.ytimg.com/vi/**"),
      { protocol: "https", hostname: "**.cdninstagram.com", pathname: "/**" },
      new URL("https://thermosilesia.pl/assets/**"),
    ],
  },
  async redirects() {
    // Temporary: later replaced by browser-language detection.
    return [{ source: "/", destination: "/pl", permanent: false }];
  },
};

export default nextConfig;
