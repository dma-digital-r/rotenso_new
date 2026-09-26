import Link from "next/link";
import { Button } from "@/components/ui/Button";
import type { Ui } from "@/i18n/ui";
import type { ProductEntry } from "@/lib/products";

export type ProductTab = "overview" | "specs" | "downloads";

// Figma: "Belka Klimatyzacja" (5172:81695) — 1300×50 frosted bar under the hero: version switch
// (Mirai | Mirai Multi), tabs, two CTAs and the comparison counter. Sticks under the top bar.
export function ProductBar({
  product,
  base,
  active,
  ui,
  lang,
  gap = 20,
}: {
  product: ProductEntry;
  /** Page address of this product, e.g. /pl/produkt/klimatyzator-scienny-rotenso-mirai */
  base: string;
  active: ProductTab;
  ui: Ui;
  lang: string;
  /** Space above the bar (Figma: 20px under a full-bleed hero, 95px under the Premium hero box). */
  gap?: number;
}) {
  // RVF outdoor units (Figma "Inwestycje Produkt v03"): no specification tab, one CTA to the
  // lead form, no installer search or comparison.
  const rvf = product.kind === "rvf";
  const tabs: [ProductTab, string, string][] = [
    ["overview", ui.tabOverview, base],
    ...(rvf
      ? []
      : ([["specs", ui.tabSpecs, `${base}/specyfikacja`]] as [
          ProductTab,
          string,
          string,
        ][])),
    ["downloads", ui.tabDownloads, `${base}/do-pobrania`],
  ];
  const other = product.family.other;

  // The extra space goes into the margin: a sticky element sticks by its border box, so padding
  // would push the pinned bar down.
  return (
    <div
      className="sticky top-[85px] z-30 mx-auto w-[1300px] max-w-[calc(100%-32px)] pt-[20px]"
      style={{ marginTop: gap - 20 }}
    >
      <div className="flex h-[50px] items-center justify-between rounded-[8px] bg-white/80 px-[20px] shadow-[0_4px_10px_rgba(0,0,0,0.15)] backdrop-blur-[20px]">
        <div className="flex h-[30px] items-center gap-[20px] text-[16px] leading-[normal] text-rotenso-grey">
          <span className="font-bold">
            {product.family.label || product.name}
          </span>
          {other.href && (
            <>
              <span aria-hidden className="h-[30px] w-px bg-rotenso-grey" />
              <Link href={other.href} className="hover:text-rotenso-red">
                {other.label}
              </Link>
            </>
          )}
        </div>

        <nav className="flex h-[30px] items-center gap-[20px] text-[16px] leading-[normal] text-rotenso-grey">
          {tabs.map(([key, label, href]) => (
            <Link
              key={key}
              href={href}
              aria-current={active === key ? "page" : undefined}
              className={
                active === key ? "font-bold" : "hover:text-rotenso-red"
              }
            >
              {label}
            </Link>
          ))}
          <span aria-hidden className="h-[30px] w-px bg-rotenso-grey" />
          {rvf ? (
            <Button
              variant="s-red"
              href={active === "overview" ? "#kontakt" : `${base}#kontakt`}
            >
              {ui.askProduct}
            </Button>
          ) : (
            <>
              <div className="flex items-center gap-[10px]">
                <Button
                  variant="s-red"
                  href={active === "overview" ? "#wycena" : `${base}#wycena`}
                >
                  {ui.askInstall}
                </Button>
                <Button
                  variant="s-red"
                  href={`/${lang}/znajdz-instalatora`}
                  className="bg-rotenso-grey!"
                >
                  {ui.findInstaller}
                </Button>
              </div>
              <span className="flex items-center gap-[10px]">
                {ui.compare}: 0/3
                <svg
                  width="12"
                  height="6"
                  viewBox="0 0 12 6"
                  fill="none"
                  aria-hidden
                >
                  <path
                    d="M1 1L6 5L11 1"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </>
          )}
        </nav>
      </div>
    </div>
  );
}
