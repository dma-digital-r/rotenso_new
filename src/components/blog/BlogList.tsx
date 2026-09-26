"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import type { Ui } from "@/i18n/ui";
import type { BlogContent, GuideSummary } from "@/lib/guides";
import { ArticleBox } from "./ArticleCard";

const PER_PAGE = 12;

type Labels = Pick<BlogContent, "allLabel" | "filters" | "tagsLabel" | "searchPlaceholder" | "countLabel" | "emptyText">;

const asciiSlug = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/ł/g, "l")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
const norm = (s: string) => s.toLocaleLowerCase("pl").normalize("NFD").replace(/\p{M}/gu, "");

// Figma: "Content" (5172:76932) — category buttons (active = grey), "#tagi" dropdown with the tag
// cloud ("Tagi" 5172:76982), search field, counter, 4-column grid of "Article box 2" cards and
// pagination. The filters live in the address (?kategoria=…&tag=…&szukaj=…&strona=…), so a
// filtered list can be shared and the back button works.
// "hideUnfiltered": guides already shown at the top of the page (the first header slides); they
// are left out of the plain "Wszystkie" view but still found by filters, tags and search.
export function BlogList({ guides, hideUnfiltered = [], labels, ui }: { guides: GuideSummary[]; hideUnfiltered?: string[]; labels: Labels; ui: Ui }) {
  const [filter, setFilter] = useState(-1);
  const [tags, setTags] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [tagsOpen, setTagsOpen] = useState(false);
  const top = useRef<HTMLDivElement>(null);

  const allTags = useMemo(() => [...new Set(guides.flatMap((g) => g.tags))].sort((a, b) => a.localeCompare(b, "pl")), [guides]);

  // Restore the filters from the address once, after hydration.
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    // Accepts the label ("Pompy ciepła") or its ASCII form ("pompy-ciepla", used by redirects).
    const wanted = p.get("kategoria");
    const f = labels.filters.findIndex((x) => x.label === wanted || asciiSlug(x.label) === wanted);
    /* eslint-disable react-hooks/set-state-in-effect -- reading the address has to wait until after hydration */
    setFilter(f);
    setTags(p.getAll("tag"));
    setQuery(p.get("szukaj") ?? "");
    setPage(Math.max(1, Number(p.get("strona")) || 1));
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [labels.filters]);

  const results = useMemo(() => {
    const cats = filter >= 0 ? labels.filters[filter]?.categories ?? [] : null;
    const q = norm(query.trim());
    const unfiltered = !cats && !tags.length && !q;
    return guides.filter(
      (g) =>
        !(unfiltered && hideUnfiltered.includes(g.slug)) &&
        (!cats || g.categories.some((c) => (cats as readonly string[]).includes(c))) &&
        tags.every((t) => g.tags.includes(t)) &&
        (!q || norm(`${g.title} ${g.excerpt}`).includes(q)),
    );
  }, [guides, filter, tags, query, labels.filters, hideUnfiltered]);

  const pages = Math.max(1, Math.ceil(results.length / PER_PAGE));
  const current = Math.min(page, pages);
  const shown = results.slice((current - 1) * PER_PAGE, current * PER_PAGE);

  useEffect(() => {
    const p = new URLSearchParams();
    if (filter >= 0 && labels.filters[filter]) p.set("kategoria", asciiSlug(labels.filters[filter].label));
    tags.forEach((t) => p.append("tag", t));
    if (query.trim()) p.set("szukaj", query.trim());
    if (current > 1) p.set("strona", String(current));
    const qs = p.toString();
    window.history.replaceState(null, "", qs ? `?${qs}` : window.location.pathname);
  }, [filter, tags, query, current, labels.filters]);

  const goPage = (n: number) => {
    setPage(n);
    top.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const choose = (i: number) => {
    setFilter(i);
    setPage(1);
  };
  const toggleTag = (t: string) => {
    setTags((list) => (list.includes(t) ? list.filter((x) => x !== t) : [...list, t]));
    setPage(1);
  };

  return (
    <div ref={top} className="mx-auto mt-[100px] w-[1300px] max-w-[calc(100%-32px)] scroll-mt-[170px] text-rotenso-grey">
      <div className="flex min-h-[40px] items-center justify-between gap-[20px]">
        <div className="flex flex-wrap gap-[10px]">
          {[labels.allLabel, ...labels.filters.map((f) => f.label)].map((label, i) => (
            <Button key={label} variant={filter === i - 1 ? "s-grey" : "s-outline"} onClick={() => choose(i - 1)} aria-pressed={filter === i - 1}>
              {label}
            </Button>
          ))}
        </div>

        <div className="flex shrink-0 items-center gap-[20px]">
          {allTags.length > 0 && (
            <>
              <span aria-hidden className="h-[40px] w-px bg-grey-dd" />
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setTagsOpen((o) => !o)}
                  aria-expanded={tagsOpen}
                  className="inline-flex h-[29px] cursor-pointer items-center gap-[10px] rounded-[15px] border border-rotenso-grey pr-[5px] pl-[15px] text-[12px] leading-[normal] font-bold"
                >
                  {labels.tagsLabel} ({tags.length})
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden className={`transition-transform ${tagsOpen ? "rotate-180" : ""}`}>
                    <path d="M6 9L12 15L18 9" stroke="#546670" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                {tagsOpen && (
                  <div className="absolute top-[calc(100%+6px)] right-[-340px] z-20 flex w-[640px] flex-wrap justify-center gap-[10px] rounded-[16px] border border-grey-dd bg-white p-[20px] shadow-dark-l">
                    {allTags.map((t) => (
                      <Button key={t} variant={tags.includes(t) ? "s-grey" : "s-outline"} onClick={() => toggleTag(t)} aria-pressed={tags.includes(t)}>
                        #{t}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
          <span aria-hidden className="h-[40px] w-px bg-grey-dd" />
          <form
            role="search"
            onSubmit={(e) => e.preventDefault()}
            className="flex h-[40px] w-[310px] items-center justify-between rounded-[50px] border border-grey-dd bg-grey-f0 py-[5px] pr-[5px] pl-[20px]"
          >
            <input
              type="search"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder={labels.searchPlaceholder}
              aria-label={ui.searchArticles}
              className="min-w-0 flex-1 bg-transparent text-[12px] leading-[16.3px] text-rotenso-grey outline-none placeholder:text-rotenso-grey"
            />
            <span aria-hidden className="flex size-[30px] shrink-0 items-center justify-center rounded-full bg-rotenso-red">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="7" stroke="white" strokeWidth="2" />
                <path d="M20 20L16 16" stroke="white" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </span>
          </form>
        </div>
      </div>

      <p className="mt-[20px] text-[12px] leading-[16.3px]" aria-live="polite">
        {labels.countLabel} {results.length}
      </p>

      {shown.length ? (
        <div className="mt-[20px] grid grid-cols-[repeat(auto-fill,310px)] justify-between gap-x-[20px] gap-y-[20px]">
          {shown.map((g) => (
            <ArticleBox key={g.slug} g={g} />
          ))}
        </div>
      ) : (
        <p className="py-[100px] text-center text-h3 leading-[1.36] font-light">{labels.emptyText}</p>
      )}

      {pages > 1 && (
        <nav aria-label={ui.page} className="mt-[20px] flex items-center justify-center gap-[10px] text-[12px] leading-[16.3px]">
          <button type="button" onClick={() => goPage(current - 1)} disabled={current === 1} aria-label={ui.pagePrev} className="cursor-pointer disabled:cursor-default disabled:opacity-50">
            <PageArrow dir="left" />
          </button>
          {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => goPage(n)}
              aria-current={n === current ? "page" : undefined}
              aria-label={`${ui.page} ${n}`}
              className={`flex h-[20px] min-w-[20px] cursor-pointer items-center justify-center rounded-[4px] px-[4px] ${n === current ? "border-[1.5px] border-rotenso-grey" : "hover:text-rotenso-red"}`}
            >
              {n}
            </button>
          ))}
          <button type="button" onClick={() => goPage(current + 1)} disabled={current === pages} aria-label={ui.pageNext} className="cursor-pointer disabled:cursor-default disabled:opacity-50">
            <PageArrow dir="right" />
          </button>
        </nav>
      )}
    </div>
  );
}

// "arrow-left-circle" / "arrow-right-circle", 24px.
export function PageArrow({ dir }: { dir: "left" | "right" }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden className={dir === "left" ? "rotate-180" : ""}>
      <circle cx="12" cy="12" r="10" stroke="#546670" strokeWidth="1.5" />
      <path d="M8 12H16M13 9L16 12L13 15" stroke="#546670" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

