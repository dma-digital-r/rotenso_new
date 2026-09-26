"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ArticleBox } from "@/components/blog/ArticleCard";
import { PageArrow } from "@/components/blog/BlogList";
import { Button } from "@/components/ui/Button";
import { FramedImage } from "@/components/ui/FramedImage";
import { Icon } from "@/components/ui/Icon";
import type { Ui } from "@/i18n/ui";
import { loadIndex, searchGuides, searchProducts, type SearchIndex } from "@/lib/search";
import { rememberSearch } from "./SearchBox";

const PER_PAGE = 12;
type Tab = "produkty" | "poradniki";

function resultsLabel(ui: Ui, lang: string, n: number) {
  const form = new Intl.PluralRules(lang).select(n);
  const t = form === "one" ? ui.resultsOne : form === "few" ? ui.resultsFew : form === "many" ? ui.resultsMany : ui.resultsOther;
  return t.replace("{n}", String(n));
}

// Figma "Wyniki wyszukiwania v1" (products) / "v1-1" (guides): title with the count and phrase,
// Produkty / Poradniki switch with counts, filter pills, 4 cards per row, 12 per page.
export function SearchResults({ lang, ui, guideFilters }: { lang: string; ui: Ui; guideFilters: { label: string; categories: string[] }[] }) {
  const params = useSearchParams();
  const router = useRouter();
  const q = (params.get("q") ?? "").trim();
  const [index, setIndex] = useState<SearchIndex | null>(null);
  // Tab, filter and page belong to one phrase — a new search starts from the defaults.
  const [view, setView] = useState<{ q: string; tab: Tab | null; filter: number; page: number }>({ q, tab: null, filter: 0, page: 1 });
  const { tab, filter, page } = view.q === q ? view : { tab: null, filter: 0, page: 1 };
  const set = (next: Partial<{ tab: Tab | null; filter: number; page: number }>) => setView({ q, tab, filter, page, ...next });

  useEffect(() => {
    loadIndex(lang).then(setIndex);
  }, [lang]);
  useEffect(() => rememberSearch(q), [q]);

  const products = index ? searchProducts(index, q) : [];
  const guides = index ? searchGuides(index, q) : [];
  const typ = params.get("typ");
  // The tab from the address (dropdown buttons), else the one that has results.
  const current: Tab = tab ?? (typ === "poradniki" || typ === "produkty" ? typ : !products.length && guides.length ? "poradniki" : "produkty");

  const productGroups = [...new Set((index?.products ?? []).map((p) => p.group))];
  const filters = current === "produkty" ? [ui.allProducts, ...productGroups] : [ui.allGuides, ...guideFilters.map((f) => f.label)];
  const list =
    current === "produkty"
      ? products.filter((p) => !filter || p.group === productGroups[filter - 1])
      : guides.filter((g) => !filter || guideFilters[filter - 1]?.categories.some((c) => g.categories.includes(c)));
  const pages = Math.max(1, Math.ceil(list.length / PER_PAGE));
  const shown = list.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const total = products.length + guides.length;

  const choose = (t: Tab) => {
    set({ tab: t, filter: 0, page: 1 });
    const next = new URLSearchParams(params);
    next.set("typ", t);
    router.replace(`?${next}`, { scroll: false });
  };
  const goPage = (n: number) => {
    set({ page: n });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!q) return <p className="py-[100px] text-center text-h3 leading-[1.36] font-light">{ui.searchNoQuery}</p>;
  if (!index) return <div className="h-[600px]" aria-busy />;

  return (
    <div className="text-rotenso-grey">
      <div className="flex flex-col items-center gap-[10px] text-center font-light">
        <h1 className="text-h2 leading-[1.2]">
          {total ? resultsLabel(ui, lang, total) : ui.searchEmpty} {q}
        </h1>
        <p className="text-h3 leading-[1.36]">{total ? ui.searchSubtitle : ui.searchEmptyText}</p>
      </div>

      {total > 0 && (
        <>
          <div role="tablist" className="mt-[50px] flex justify-center gap-[20px]">
            {(
              [
                ["produkty", ui.tabProducts, products.length],
                ["poradniki", ui.tabGuides, guides.length],
              ] as const
            ).map(([key, label, n]) => (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={current === key}
                onClick={() => choose(key)}
                className={`flex h-[50px] w-[200px] cursor-pointer items-center justify-center gap-[15px] rounded-[25px] border border-rotenso-grey text-[16px] leading-[normal] font-bold transition-colors ${
                  current === key ? "bg-rotenso-grey text-white" : "hover:text-rotenso-red"
                }`}
              >
                <span>{label}</span>
                <span>{n}</span>
              </button>
            ))}
          </div>

          <div className="mt-[100px] flex flex-wrap gap-[10px]">
            {filters.map((f, i) => (
              <Button
                key={f}
                variant={i === filter ? "s-grey" : "s-outline"}
                onClick={() => set({ filter: i, page: 1 })}
                aria-pressed={i === filter}
              >
                {f}
              </Button>
            ))}
          </div>

          {shown.length ? (
            current === "produkty" ? (
              <div className="mt-[30px] grid grid-cols-[repeat(auto-fill,310px)] justify-between gap-x-[20px] gap-y-[70px]">
                {(shown as typeof products).map((p) => (
                  <div key={p.href} className="flex w-[310px] flex-col px-[16px]">
                    <Link href={p.href} className="relative h-[92px] w-full">
                      <FramedImage src={p.image} sizes="280px" className="object-contain" />
                    </Link>
                    <h2 className="mt-[40px] text-h3 leading-[1.36] font-light">
                      <Link href={p.href} className="hover:text-rotenso-red">
                        {p.name}
                      </Link>
                    </h2>
                    <p className="mt-[5px] line-clamp-2 min-h-[32.6px] text-[12px] leading-[16.3px]">{p.text}</p>
                    <div className="mt-[20px] flex items-center justify-between">
                      <Button variant="s-red" href={p.href}>
                        {ui.seeModel}
                      </Button>
                      <span className="flex items-center gap-[5px] text-[12px] leading-[normal]">
                        <Icon name="compare-add" width={20} height={20} />
                        {ui.compare}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-[30px] grid grid-cols-[repeat(auto-fill,310px)] justify-between gap-x-[20px] gap-y-[30px]">
                {(shown as typeof guides).map((g) => (
                  <ArticleBox key={g.href} g={g} />
                ))}
              </div>
            )
          ) : (
            <p className="py-[100px] text-center text-h3 leading-[1.36] font-light">{ui.searchEmptyText}</p>
          )}

          {pages > 1 && (
            <nav aria-label={ui.page} className="mt-[40px] flex items-center justify-center gap-[10px] text-[12px] leading-[16.3px]">
              <button type="button" onClick={() => goPage(page - 1)} disabled={page === 1} aria-label={ui.pagePrev} className="cursor-pointer disabled:cursor-default disabled:opacity-50">
                <PageArrow dir="left" />
              </button>
              {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => goPage(n)}
                  aria-current={n === page ? "page" : undefined}
                  aria-label={`${ui.page} ${n}`}
                  className={`flex h-[20px] min-w-[20px] cursor-pointer items-center justify-center rounded-[4px] px-[4px] ${n === page ? "border-[1.5px] border-rotenso-grey" : "hover:text-rotenso-red"}`}
                >
                  {n}
                </button>
              ))}
              <button type="button" onClick={() => goPage(page + 1)} disabled={page === pages} aria-label={ui.pageNext} className="cursor-pointer disabled:cursor-default disabled:opacity-50">
                <PageArrow dir="right" />
              </button>
            </nav>
          )}
        </>
      )}
    </div>
  );
}
