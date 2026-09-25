"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import type { MenuContent } from "@/lib/content";

type Tab = MenuContent["tabs"][number];
type Category = Tab["categories"][number];
type Section = Category["sections"][number];
type Product = Section["products"][number];

// Figma: "Menu v04" (5172:83010) — 1880 wide under the widened top bar. Grey tab strip (the
// active tab is white), then a white panel: categories (220), centre column (sections of product
// tiles + a row of shortcut tiles), a 1px divider and the right column (solutions, buttons).
// Categories and tabs switch on click, as in the prototype.
export function MegaMenu({ menu, onNavigate }: { menu: MenuContent; onNavigate: () => void }) {
  const tabs = menu.tabs.filter((t) => t.categories.length || t.href);
  const firstPanel = Math.max(0, tabs.findIndex((t) => t.categories.length));
  const [tab, setTab] = useState(firstPanel);
  const [cats, setCats] = useState<Record<number, number>>({});
  const current = tabs[tab];
  const catIndex = cats[tab] ?? 0;
  const category = current?.categories[catIndex];

  return (
    <div className="overflow-hidden rounded-[8px] shadow-[0_4px_4px_rgba(0,0,0,0.25)]">
      <div role="tablist" className="flex h-[50px] rounded-t-[8px] bg-grey-f0 text-[16px] leading-[21.8px] text-rotenso-grey">
        {tabs.map((t, i) =>
          t.categories.length ? (
            <button
              key={t.label}
              type="button"
              role="tab"
              aria-selected={i === tab}
              onClick={() => setTab(i)}
              className={`cursor-pointer rounded-t-[8px] px-[30px] whitespace-nowrap ${i === tab ? "bg-white" : "hover:text-rotenso-red"}`}
            >
              {t.label}
            </button>
          ) : (
            <Link key={t.label} href={t.href} onClick={onNavigate} className="flex items-center px-[30px] whitespace-nowrap hover:text-rotenso-red">
              {t.label}
            </Link>
          ),
        )}
      </div>

      {category && (
        <div className="flex gap-[20px] bg-white p-[30px] text-rotenso-grey">
          <div role="tabpanel" className="flex w-[220px] shrink-0 flex-col gap-[5px]">
            {current.categories.map((c, i) => (
              <button
                key={c.label}
                type="button"
                onClick={() => setCats((s) => ({ ...s, [tab]: i }))}
                aria-pressed={i === catIndex}
                className={`flex min-h-[50px] cursor-pointer items-center gap-[15px] rounded-[8px] px-[15px] py-[10px] text-left text-[16px] leading-[21.8px] whitespace-pre-line transition-colors ${
                  i === catIndex ? "bg-rotenso-grey text-white" : "hover:bg-grey-f0"
                }`}
              >
                {c.icon && <Icon name={c.icon} width={30} height={30} className={i === catIndex ? "brightness-0 invert" : ""} />}
                <span className="flex-1">{c.label}</span>
              </button>
            ))}
          </div>

          <CategoryBody key={`${tab}-${catIndex}`} category={category} onNavigate={onNavigate} />

          <span aria-hidden className="w-px shrink-0 bg-grey-dd" />

          <div className="flex w-[250px] shrink-0 flex-col gap-[30px] pt-[10px]">
            {category.solutions.length > 0 && (
              <div className="flex flex-col gap-[10px]">
                <p className="text-[18px] leading-[24.5px]">{category.solutionsTitle}</p>
                {category.solutions.map((s) => (
                  <Link key={s.label} href={s.href} onClick={onNavigate} className="text-[14px] leading-[19.1px] hover:text-rotenso-red">
                    {s.label}
                  </Link>
                ))}
              </div>
            )}
            {category.buttons.length > 0 && (
              <div className="flex flex-col items-start gap-[10px]">
                {category.buttons.map((b) => (
                  <Button key={b.label} variant="s-outline" href={b.href} onClick={onNavigate}>
                    {b.label}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function CategoryBody({ category, onNavigate }: { category: Category; onNavigate: () => void }) {
  const blocks = category.sections.map((s, i) => <SectionBlock key={i} section={s} onNavigate={onNavigate} />);
  if (category.footer.length) {
    blocks.push(
      <div key="footer" className="flex flex-wrap gap-[20px]">
        {category.footer.map((f) => (
          <FooterTile key={f.label} tile={f} onNavigate={onNavigate} />
        ))}
      </div>,
    );
  }
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-[20px] pt-[5px]">
      {blocks.flatMap((b, i) => (i ? [<span key={`hr${i}`} aria-hidden className="h-px w-full shrink-0 bg-grey-dd" />, b] : [b]))}
    </div>
  );
}

function SectionBlock({ section, onNavigate }: { section: Section; onNavigate: () => void }) {
  return (
    <div className="flex flex-col gap-[20px]">
      <div className="flex flex-col gap-[10px]">
        <p className="text-h3 leading-[34px] font-light">{section.title}</p>
        {(section.text || section.button.label) && (
          <div className="flex items-center gap-[10px]">
            {section.text && <p className="flex-1 text-[16px] leading-[24px] whitespace-pre-line">{section.text}</p>}
            {section.button.label && (
              <Button variant="s-red" href={section.button.href} onClick={onNavigate}>
                {section.button.label}
              </Button>
            )}
          </div>
        )}
      </div>
      {(section.products.length > 0 || section.seeAll.label) && (
        <div className="flex flex-wrap items-stretch gap-[10px]">
          {section.products.map((p) => (
            <ProductTile key={p.name + p.href} product={p} tall={section.cards === "tall"} onNavigate={onNavigate} />
          ))}
          {section.seeAll.label && (
            <Link
              href={section.seeAll.href}
              onClick={onNavigate}
              className="flex h-[84px] w-[253px] flex-col items-center justify-center gap-[10px] self-center rounded-[8px] border border-transparent bg-white p-[10px] text-[16px] leading-[24px] transition-[border-color,box-shadow] hover:border-grey-f0 hover:shadow-[10px_10px_20px_rgba(0,0,0,0.1)]"
            >
              <Icon name="arrow-g2-right" width={30} height={30} />
              {section.seeAll.label}
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

// "Menu Produkt" / "Menu Klima Split": 249 wide, white; on hover a light border and shadow
// ("Button States=Hover", 5172:67012).
function ProductTile({ product: p, tall, onNavigate }: { product: Product; tall: boolean; onNavigate: () => void }) {
  const long = p.tagline.length > 60;
  return (
    <Link
      href={p.href}
      onClick={onNavigate}
      className={`flex w-[249px] flex-col items-center rounded-[8px] border border-transparent bg-white p-[20px] transition-[border-color,box-shadow] duration-300 hover:border-grey-f0 hover:shadow-[10px_10px_20px_rgba(0,0,0,0.1)] ${
        tall ? "gap-[10px]" : "gap-[5px]"
      }`}
    >
      <span className={`relative w-[209px] shrink-0 ${tall ? "h-[140px]" : "h-[69px]"}`}>
        {p.image2 ? (
          <>
            {p.image && <Image src={p.image} alt="" width={149} height={100} className="absolute bottom-0 left-0 h-[100px] w-[149px] object-contain" />}
            <Image src={p.image2} alt="" width={54} height={140} className="absolute top-0 right-0 h-[100px] w-[54px] object-cover" />
          </>
        ) : (
          p.image && <Image src={p.image} alt="" fill sizes="209px" className="object-contain" />
        )}
      </span>
      <span className={`flex w-full flex-col items-center py-[5px] text-center ${long ? "px-[20px]" : "px-[5px]"}`}>
        <span className="text-[16px] leading-[24px]">{p.name}</span>
        <span className="text-[12px] leading-[16.3px] whitespace-pre-line">{p.tagline}</span>
      </span>
      {p.colors.length > 0 && (
        <span className="flex gap-[8px]">
          {p.colors.map((c) => (
            <span key={c} className="size-[14px] rounded-full border" style={{ backgroundColor: c, borderColor: /^#f{3,6}$/i.test(c) ? "#dddddd" : c }} />
          ))}
        </span>
      )}
    </Link>
  );
}

// Shortcut tiles under the products: 70px, grey gradient; a category icon on the left and an
// arrow on the right — or, for the configurator prompt, text with the configurator icon.
function FooterTile({ tile, onNavigate }: { tile: Category["footer"][number]; onNavigate: () => void }) {
  const cta = tile.icon === "menu-configurator";
  return (
    <Link
      href={tile.href}
      onClick={onNavigate}
      className={`flex h-[70px] items-center gap-[15px] rounded-[8px] bg-[linear-gradient(to_right,#e5e5e5,#f5f5f5)] p-[20px] text-[14px] leading-[19.1px] transition-opacity hover:opacity-80 ${
        cta ? "" : "w-[307px]"
      }`}
    >
      {!cta && tile.icon && <Icon name={tile.icon} width={30} height={30} />}
      <span className="flex-1 whitespace-pre-line">{tile.label}</span>
      {cta ? <Icon name="menu-configurator" width={30} height={30} /> : <Icon name="menu-arrow" width={13} height={10} />}
    </Link>
  );
}
