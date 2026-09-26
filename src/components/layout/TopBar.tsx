import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import type { MenuContent, SettingsContent } from "@/lib/content";
import type { Locale } from "@/i18n/config";
import { getUi } from "@/i18n/ui";
import { SearchBox } from "@/components/search/SearchBox";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { MenuTrigger, StickyHeader } from "./StickyHeader";

// Figma: "Top Bar" (5172:70663) — 1300×60, white, radius 8, floats 15px inside the hero;
// sticks to the top of the window after scrolling (StickyHeader). The first menu item opens the
// mega menu (content: panel → Mega menu). The search box opens suggestions under the bar.
export function TopBar({ settings, menu, lang }: { settings: SettingsContent; menu: MenuContent; lang: Locale }) {
  const ui = getUi(lang);
  const hasMenu = menu.tabs.some((t) => t.categories.length);
  return (
    <StickyHeader menu={menu} closeLabel={ui.close}>
      <div data-topbar className="flex h-[60px] w-full items-center gap-[30px] overflow-clip rounded-[8px] bg-white pr-[15px] transition-shadow duration-300 group-data-[stuck]/header:shadow-[0_10px_30px_rgba(0,0,0,0.15)]">
        <Link href={`/${lang}`} aria-label={ui.home} className="shrink-0">
          <Icon name="logo" width={238} height={60} alt="Rotenso — Live better" />
        </Link>

        <nav className="flex shrink-0 items-center gap-[30px] text-center text-[16px] leading-[normal] whitespace-nowrap text-rotenso-grey">
          {settings.nav.map((item, i) =>
            i === 0 && hasMenu ? (
              <MenuTrigger key={item.label} label={item.label} />
            ) : (
              <Link key={item.label} href={item.href} className="hover:text-rotenso-red">
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <span aria-hidden className="h-[30px] w-px shrink-0 rounded-full bg-grey-dd" />

        <div className="flex min-w-px flex-1 items-center gap-[15px]">
          <SearchBox lang={lang} placeholder={settings.searchPlaceholder} ui={ui} />
          <Button variant="s-red" href={settings.configurator.href}>
            {settings.configurator.label}
          </Button>
          <Button variant="s-outline" href={settings.installer.href}>
            {settings.installer.label}
          </Button>
          <LanguageSwitcher lang={lang} label={ui.language} />
        </div>
      </div>
    </StickyHeader>
  );
}
