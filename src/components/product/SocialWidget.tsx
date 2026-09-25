import Image from "next/image";
import { socials, Strip } from "@/components/home/SocialMedia";
import { Icon } from "@/components/ui/Icon";
import type { SettingsContent } from "@/lib/content";

const SPEED = 38;
// Figma: 310×310 tiles, 20px apart, first one at x −40. Instagram posts are 4:5, so the tiles
// keep Figma's 310px height and are 248 wide (the same correction as on the home page).
const TILE_W = 248;

// Figma: "SoMe Widget" (5172:81591) — an endless strip of the newest Instagram posts, the title
// and the six profile icons.
export function SocialWidget({
  title,
  posts,
  links,
}: {
  title: string;
  posts: readonly { href: string; image: string | null; title?: string }[];
  links: SettingsContent["social"];
}) {
  const setWidth = posts.length * (TILE_W + 20);
  return (
    <section className="mt-[81px] text-rotenso-grey">
      {posts.length > 0 && (
        <Strip className="h-[310px]" offset={-40} setWidth={setWidth} seconds={setWidth / SPEED} direction="right">
          {posts.map((p, i) => (
            <a
              key={i}
              href={p.href}
              target="_blank"
              rel="noopener noreferrer"
              title={p.title}
              aria-label={p.title || "Instagram"}
              className="relative block h-[310px] shrink-0 overflow-hidden rounded-[16px] shadow-dark-l"
              style={{ width: TILE_W }}
            >
              {p.image && <Image src={p.image} alt="" fill sizes={`${TILE_W}px`} className="object-cover" />}
            </a>
          ))}
        </Strip>
      )}
      <h2 className="mt-[50px] text-center text-h2 leading-[1.2] font-light">{title}</h2>
      <div className="mt-[30px] flex h-[40px] items-center justify-center gap-[20px]">
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
