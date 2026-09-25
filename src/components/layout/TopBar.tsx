import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import type { SettingsContent } from "@/lib/content";
import type { Locale } from "@/i18n/config";
import { LanguageSwitcher } from "./LanguageSwitcher";

// Figma: "Top Bar" (5172:70663) — 1300×60, white, radius 8, floats 30px inside the hero.
export function TopBar({ settings, lang }: { settings: SettingsContent; lang: Locale }) {
  return (
    <header className="absolute inset-x-0 top-[80px] z-40 flex justify-center px-4">
      <div className="flex h-[60px] w-[1300px] max-w-full items-center gap-[30px] overflow-clip rounded-[8px] bg-white pr-[15px]">
        <Link href={`/${lang}`} aria-label="Rotenso — strona główna" className="shrink-0">
          <Icon name="logo" width={238} height={60} alt="Rotenso — Live better" />
        </Link>

        <nav className="flex shrink-0 items-center gap-[30px] text-center text-[16px] leading-normal whitespace-nowrap text-rotenso-grey">
          {settings.nav.map((item) => (
            <Link key={item.label} href={item.href} className="hover:text-rotenso-red">
              {item.label}
            </Link>
          ))}
        </nav>

        <span aria-hidden className="h-[30px] w-px shrink-0 rounded-full bg-grey-dd" />

        <div className="flex min-w-px flex-1 items-center gap-[15px]">
          <form
            action={`/${lang}/szukaj`}
            className="flex h-[30px] min-w-px flex-1 items-center rounded-[15px] border border-grey-dd bg-grey-f0 pl-[15px]"
          >
            <input
              name="q"
              type="search"
              placeholder={settings.searchPlaceholder}
              aria-label={settings.searchPlaceholder}
              className="min-w-px flex-1 bg-transparent text-[12px] leading-normal text-rotenso-grey outline-none placeholder:text-rotenso-grey"
            />
            <button type="submit" aria-label={settings.searchPlaceholder} className="-my-px -mr-px cursor-pointer">
              <Icon name="search-btn-s" width={30} height={30} />
            </button>
          </form>
          <Button variant="s-red" href={settings.configurator.href}>
            {settings.configurator.label}
          </Button>
          <Button variant="s-outline" href={settings.installer.href}>
            {settings.installer.label}
          </Button>
          <LanguageSwitcher lang={lang} />
        </div>
      </div>
    </header>
  );
}
