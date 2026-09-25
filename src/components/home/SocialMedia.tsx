import Image from "next/image";
import { Icon } from "@/components/ui/Icon";
import type { HomeContent, SettingsContent } from "@/lib/content";

const socials = ["facebook", "youtube", "instagram", "tiktok", "spotify", "linkedin"] as const;

// Figma: "SoMe" (5172:70335), 1920×956. Both strips repeat their set twice in the
// design, i.e. an endless loop: films (first at x 20), posts (first at x −40). Both rows are 225px high (Figma: 360 / 310, reduced on request).
// Strips move at a constant ~38 px/s whatever the number of tiles.
const SPEED = 38;
// Top strip: 225px high — videos 400 wide (16:9; Figma had 640×360, reduced on request),
// Shorts 127 wide (9:16). Gap 20.
const TILE_H = 225;
const tileWidth = (v: { vertical?: boolean }) => (v.vertical ? Math.round((TILE_H * 9) / 16) : 400);

export function SocialMedia({
  data,
  links,
  videos,
  posts,
}: {
  data: HomeContent["social"];
  links: SettingsContent["social"];
  /** Latest Instagram posts; falls back to the CMS list. */
  posts: readonly { href: string; image: string | null; title?: string }[];
  /** Latest channel videos (from the YouTube feed); falls back to the CMS list. */
  videos: readonly { href: string; image: string | null; title?: string; vertical?: boolean }[];
}) {
  const videoSetWidth = videos.reduce((sum, v) => sum + tileWidth(v) + 20, 0);
  return (
    <section className="relative">
      <h2 className="text-center text-h1 leading-[1.2] font-light text-rotenso-grey">{data.title}</h2>

      <Strip
        className="mt-[70px] h-[225px]"
        offset={20}
        setWidth={videoSetWidth}
        seconds={videoSetWidth / SPEED}
        direction="left"
      >
        {videos.map((v, i) => (
          <a
            key={i}
            href={v.href}
            target="_blank"
            rel="noopener noreferrer"
            title={v.title}
            aria-label={v.title || "YouTube"}
            className="relative block shrink-0 overflow-hidden rounded-[16px]"
            style={{ width: tileWidth(v), height: TILE_H }}
          >
            {v.image && (
              <Image src={v.image} alt="" fill sizes={`${tileWidth(v)}px`} className="object-cover" />
            )}
          </a>
        ))}
      </Strip>

      <Strip
        className="mt-[20px] h-[225px]"
        offset={-40}
        setWidth={posts.length * 245}
        seconds={(posts.length * 245) / SPEED}
        direction="right"
      >
        {posts.map((p, i) => (
          <a
            key={i}
            href={p.href}
            target="_blank"
            rel="noopener noreferrer"
            title={p.title}
            aria-label={p.title || "Instagram"}
            className="relative block size-[225px] shrink-0 overflow-hidden rounded-[16px] shadow-dark-l"
          >
            {p.image && <Image src={p.image} alt="" fill sizes="225px" className="object-cover" />}
          </a>
        ))}
      </Strip>

      <div className="mt-[70px] flex h-[40px] items-center justify-center gap-[20px]">
        {socials.map((s) => (
          <a
            key={s}
            href={links[s] || "#"}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={s}
            className="relative size-[35px] shrink-0 transition-opacity hover:opacity-70"
          >
            <span className="absolute inset-[-2.86%_-2.79%]">
              <Icon name={`${s}-grey`} width={37} height={37} className="size-full" />
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}

// Endless strip: the set is rendered twice and the track moves by one set width, then loops.
function Strip({
  children,
  className,
  offset,
  setWidth,
  seconds,
  direction,
}: {
  children: React.ReactNode;
  className: string;
  offset: number;
  setWidth: number;
  seconds: number;
  direction: "left" | "right";
}) {
  return (
    <div className={`group relative overflow-x-clip ${className}`}>
      <div
        className="marquee absolute top-0 flex gap-[20px] group-hover:[animation-play-state:paused]"
        style={
          {
            left: offset - (direction === "right" ? setWidth : 0),
            "--marquee-shift": `${direction === "left" ? -setWidth : setWidth}px`,
            animationDuration: `${seconds}s`,
          } as React.CSSProperties
        }
      >
        {children}
        <div aria-hidden inert className="contents">
          {children}
        </div>
      </div>
    </div>
  );
}
