import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import type { SettingsContent } from "@/lib/content";

// Figma: "Ai Chat" (5172:70664) — 60×60 at x 1830, y 940 of the first screen.
// Links to the contact page until the chat itself is connected.
export function AiChatButton({ link }: { link: SettingsContent["aiChat"] }) {
  return (
    <Link
      href={link.href}
      aria-label={link.label}
      title={link.label}
      className="fixed right-[30px] bottom-[80px] z-50 transition-transform hover:scale-105"
    >
      <Icon name="ai-chat" width={60} height={60} />
    </Link>
  );
}
