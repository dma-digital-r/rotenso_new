"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/Button";
import { FramedImage } from "@/components/ui/FramedImage";
import { Icon } from "@/components/ui/Icon";
import type { Ui } from "@/i18n/ui";
import { highlight, loadIndex, normalize, searchGuides, searchProducts, type SearchIndex } from "@/lib/search";

const RECENT = "rotenso-searches";

function readRecent(): string[] {
  try {
    return JSON.parse(localStorage.getItem(RECENT) ?? "[]");
  } catch {
    return [];
  }
}

export function rememberSearch(q: string) {
  const v = q.trim();
  if (!v) return;
  try {
    const list = [v, ...readRecent().filter((x) => normalize(x) !== normalize(v))].slice(0, 10);
    localStorage.setItem(RECENT, JSON.stringify(list));
  } catch {}
}

export function Marked({ text, q, className = "" }: { text: string; q: string; className?: string }) {
  return (
    <span className={className}>
      {highlight(text, q).map((p, i) => (p.hit ? <b key={i} className="font-bold">{p.text}</b> : p.text))}
    </span>
  );
}

// Figma "Podpowiedzi wyszukiwania v1": while typing, a white panel opens 10px under the top bar
// (its full width) over the blurred page — searches (popular phrases + the visitor's recent ones),
// recommended products and recommended articles, 5 each, matches in bold.
export function SearchBox({ lang, placeholder, ui }: { lang: string; placeholder: string; ui: Ui }) {
  const router = useRouter();
  const input = useRef<HTMLInputElement>(null);
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState<SearchIndex | null>(null);
  const [box, setBox] = useState<{ top: number; left: number; width: number; host: Element } | null>(null);
  const [recent, setRecent] = useState<string[]>([]);
  const active = open && q.trim().length > 0;

  useEffect(() => {
    if (!open) return;
    loadIndex(lang).then(setIndex);
  }, [open, lang]);

  useEffect(() => {
    if (!active) return;
    const place = () => {
      // Rendered next to the fixed <header> (same stacking context), so the blurred backdrop stays
      // under the top bar and the panel escapes the bar's overflow clipping.
      const bar = input.current?.closest("[data-topbar]")?.getBoundingClientRect();
      const host = input.current?.closest("header")?.parentElement;
      if (bar && host) setBox({ top: bar.bottom + 10, left: bar.left, width: bar.width, host });
    };
    place();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, { passive: true });
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place);
      window.removeEventListener("keydown", onKey);
    };
  }, [active]);

  const go = (value: string, tab?: "produkty" | "poradniki") => {
    rememberSearch(value);
    setOpen(false);
    input.current?.blur();
    router.push(`/${lang}/szukaj?q=${encodeURIComponent(value.trim())}${tab ? `&typ=${tab}` : ""}`);
  };

  const nq = normalize(q);
  const phrases = [...new Set([...recent, ...(index?.phrases ?? [])])].filter((p) => normalize(p).includes(nq)).slice(0, 5);
  const products = index ? searchProducts(index, q).slice(0, 5) : [];
  const guides = index ? searchGuides(index, q).slice(0, 5) : [];

  return (
    <>
      <form
        role="search"
        action={`/${lang}/szukaj`}
        onSubmit={(e) => {
          e.preventDefault();
          if (q.trim()) go(q);
        }}
        className="relative z-[42] flex h-[30px] min-w-px flex-1 items-center rounded-[15px] border border-grey-dd bg-grey-f0 pl-[15px]"
      >
        <input
          ref={input}
          name="q"
          type="search"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
          }}
          onFocus={() => {
            setRecent(readRecent());
            setOpen(true);
          }}
          autoComplete="off"
          placeholder={placeholder}
          aria-label={placeholder}
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={active}
          aria-controls="search-panel"
          className="min-w-px flex-1 bg-transparent text-[12px] leading-[normal] text-rotenso-grey outline-none placeholder:text-rotenso-grey"
        />
        <button type="submit" aria-label={placeholder} className="-my-px -mr-px cursor-pointer">
          <Icon name="search-btn-s" width={30} height={30} />
        </button>
      </form>

      {active &&
        box &&
        createPortal(
          <>
            <div aria-hidden onClick={() => setOpen(false)} className="fixed inset-0 z-[35] bg-black/30 backdrop-blur-[20px]" />
            <div
              id="search-panel"
              style={{ top: box.top, left: box.left, width: box.width }}
              className="fixed z-[41] flex max-h-[calc(100svh-120px)] overflow-y-auto rounded-[16px] bg-white py-[30px] text-rotenso-grey shadow-[0_20px_60px_rgba(0,0,0,0.2)]"
            >
              <div className="flex-1 px-[30px]">
                <p className="text-h3 leading-[1.36] font-light">{ui.searchesTitle}</p>
                <ul className="mt-[20px] flex flex-col gap-[14px]">
                  {(phrases.length ? phrases : [q.trim()]).map((p) => (
                    <li key={p}>
                      <button type="button" onClick={() => go(p)} className="flex cursor-pointer items-center gap-[10px] text-[16px] leading-[24px] hover:text-rotenso-red">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden className="shrink-0">
                          <circle cx="8.5" cy="8.5" r="6.5" stroke="currentColor" strokeWidth="1.4" />
                          <path d="M13.5 13.5L18 18" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                        </svg>
                        <Marked text={p} q={q} />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-1 flex-col border-l border-grey-dd px-[20px]">
                <p className="text-h3 leading-[1.36] font-light">{ui.recommendedProducts}</p>
                <ul className="mt-[20px] flex flex-col gap-[20px]">
                  {products.map((p) => (
                    <li key={p.href}>
                      <Link href={p.href} onClick={() => rememberSearch(q)} className="group flex items-center gap-[15px]">
                        <span className="relative h-[34px] w-[80px] shrink-0">
                          <FramedImage src={p.image} sizes="80px" className="object-contain" />
                        </span>
                        <span className="flex min-w-0 flex-col">
                          <Marked text={p.name} q={q} className="text-[16px] leading-[22px] group-hover:text-rotenso-red" />
                          <Marked text={p.text} q={q} className="line-clamp-2 text-[12px] leading-[16.3px]" />
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
                {products.length > 0 && (
                  <Button variant="s-outline" onClick={() => go(q, "produkty")} className="mt-[25px] self-start">
                    {ui.seeAllProducts}
                  </Button>
                )}
              </div>

              <div className="flex flex-1 flex-col border-l border-grey-dd px-[20px]">
                <p className="text-h3 leading-[1.36] font-light">{ui.recommendedArticles}</p>
                <ul className="mt-[20px] flex flex-col gap-[20px]">
                  {guides.map((g) => (
                    <li key={g.href}>
                      <Link href={g.href} onClick={() => rememberSearch(q)} className="group flex items-center gap-[15px]">
                        <span className="relative h-[50px] w-[80px] shrink-0 overflow-hidden rounded-[8px] bg-grey-dd">
                          <FramedImage src={g.image} sizes="80px" />
                        </span>
                        <span className="flex min-w-0 flex-col">
                          <Marked text={g.title} q={q} className="line-clamp-1 text-[16px] leading-[22px] group-hover:text-rotenso-red" />
                          <Marked text={g.excerpt} q={q} className="line-clamp-2 text-[12px] leading-[16.3px]" />
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
                {guides.length > 0 && (
                  <Button variant="s-outline" onClick={() => go(q, "poradniki")} className="mt-[25px] self-start">
                    {ui.seeAllArticles}
                  </Button>
                )}
              </div>
            </div>
          </>,
          box.host,
        )}
    </>
  );
}
