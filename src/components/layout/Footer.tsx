import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { CurrentYear } from "@/components/ui/CurrentYear";
import { Icon } from "@/components/ui/Icon";
import type { SettingsContent } from "@/lib/content";

// "{rok}" in the copyright line is replaced with the current year.
function withYear(text: string) {
  const parts = text.split("{rok}");
  return parts.flatMap((part, i) => (i === 0 ? [part] : [<CurrentYear key={i} />, part]));
}

const socials = ["facebook", "youtube", "instagram", "tiktok", "spotify", "linkedin"] as const;

// Social icons are 35×35 frames whose SVG bleeds ~1px on each side (Figma inset -2.86% / -2.79%).
export function SocialIcons({
  links,
  className = "",
}: {
  links: SettingsContent["social"];
  className?: string;
}) {
  return (
    <div className={`flex items-center justify-center gap-[20px] ${className}`}>
      {socials.map((s) => (
        <a
          key={s}
          href={links[s] || "#"}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={s}
          className="relative size-[35px] shrink-0 transition-opacity hover:opacity-80"
        >
          <span className="absolute inset-[-2.86%_-2.79%]">
            <Icon name={s} width={37} height={37} className="size-full" />
          </span>
        </a>
      ))}
    </div>
  );
}

// Figma: "Foot" (5172:70326) — 1920×604, Rotenso Grey.
export function Footer({ settings }: { settings: SettingsContent }) {
  const [lead, ...rest] = settings.copyright.split("\n");
  return (
    <footer className="relative h-[604px] bg-rotenso-grey text-white">
      <div className="mx-auto flex w-[1300px] max-w-[calc(100%-32px)] gap-[20px] pt-[50px]">
        {settings.footerColumns.map((col) => (
          <div
            key={col.heading.label}
            className="flex w-[200px] shrink-0 flex-col gap-[20px] text-[16px] leading-[normal]"
          >
            {col.heading.href ? (
              <Link href={col.heading.href} className="font-bold transition-colors hover:text-rotenso-red">
                {col.heading.label}
              </Link>
            ) : (
              <p className="font-bold">{col.heading.label}</p>
            )}
            {col.links.map((l) => (
              <Link key={l.label} href={l.href} className="transition-colors hover:text-rotenso-red">
                {l.label}
              </Link>
            ))}
          </div>
        ))}

        <div className="flex w-[200px] shrink-0 flex-col items-start gap-[20px]">
          <p className="w-full text-[16px] leading-[normal] font-bold">{settings.contactHeading}</p>
          <a href={`tel:${settings.phone.replace(/\s/g, "")}`} className="flex w-full items-center gap-[10px] transition-colors hover:text-rotenso-red">
            <Icon name="foot-phone" width={24} height={24} />
            <span className="flex-1 text-[16px] leading-[normal]">{settings.phone}</span>
          </a>
          <a href={`mailto:${settings.email}`} className="flex w-full items-center gap-[10px] transition-colors hover:text-rotenso-red">
            <Icon name="foot-mail" width={24} height={24} />
            <span className="flex-1 text-[16px] leading-[normal]">{settings.email}</span>
          </a>
          <Button variant="s-outline-white" href={settings.contactForm.href}>
            {settings.contactForm.label}
          </Button>
          <a
            href={settings.navigate.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-[29px] items-center justify-center gap-[5px] overflow-clip rounded-[15px] border border-white py-[10px] pr-[15px] pl-[5px] text-[12px] leading-[normal] font-bold whitespace-nowrap hover:opacity-85"
          >
            <Icon name="foot-navigator" width={20} height={20} />
            <span className="text-trim">{settings.navigate.label}</span>
          </a>
        </div>
      </div>

      {/* Icons at 64.24% (y 388), rule at 75.83% (y 458), copyright at 80.79% (y 488). */}
      <SocialIcons links={settings.social} className="absolute inset-x-0 top-[388px]" />
      <div className="absolute inset-x-0 top-[457px] mx-auto h-px w-[1300px] max-w-[calc(100%-32px)] bg-white/20" />
      <p className="absolute inset-x-0 top-[488px] mx-auto w-[1078px] max-w-[calc(100%-32px)] text-center text-[14px] leading-[22px]">
        {withYear(lead)}
        {rest.length > 0 && <br />}
        {rest.join(" ")}
      </p>
    </footer>
  );
}
