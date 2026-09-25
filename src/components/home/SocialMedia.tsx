import Image from "next/image";
import { Icon } from "@/components/ui/Icon";
import type { HomeContent, SettingsContent } from "@/lib/content";

const socials = ["facebook", "youtube", "instagram", "tiktok", "spotify", "linkedin"] as const;

// Figma: "SoMe" (5172:70335), 1920×956. Both strips repeat their set twice in the
// design, i.e. an endless loop: films 640×360 (first at x 20), posts 310×310 (first at x −40).
export function SocialMedia({
  data,
  links,
}: {
  data: HomeContent["social"];
  links: SettingsContent["social"];
}) {
  return (
    <section className="relative">
      <h2 className="text-center text-h1 leading-[1.2] font-light text-rotenso-grey">{data.title}</h2>

      <Strip
        className="mt-[70px] h-[360px]"
        offset={20}
        setWidth={data.videos.length * 660}
        seconds={70}
        direction="left"
      >
        {data.videos.map((v, i) => (
          <a
            key={i}
            href={v.href}
            target="_blank"
            rel="noopener noreferrer"
            className="relative block h-[360px] w-[640px] shrink-0 overflow-hidden rounded-[16px]"
          >
            {v.image && <Image src={v.image} alt="" fill sizes="640px" className="object-cover" />}
          </a>
        ))}
      </Strip>

      <Strip
        className="mt-[20px] h-[310px]"
        offset={-40}
        setWidth={data.posts.length * 330}
        seconds={55}
        direction="right"
      >
        {data.posts.map((p, i) => (
          <a
            key={i}
            href={p.href}
            target="_blank"
            rel="noopener noreferrer"
            className="relative block size-[310px] shrink-0 overflow-hidden rounded-[16px] shadow-dark-l"
          >
            {p.image && <Image src={p.image} alt="" fill sizes="310px" className="object-cover" />}
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
