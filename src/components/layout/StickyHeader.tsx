"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import type { MenuContent } from "@/lib/content";
import { MegaMenu } from "./MegaMenu";

const MenuContext = createContext<{ open: boolean; toggle: () => void }>({ open: false, toggle: () => {} });

// The top bar sits 15px inside the hero (30px from the window top). Once the page scrolls it
// stays pinned 15px below the window edge, on a frosted-glass plate (the menu's width + 15px on
// each side, reaching the window edge) so it stays readable over any section behind it.
// Mega menu (Figma "Menu v04"): the bar widens to 1880 (20px from the window edges, 20px from the
// top), a 60px close button appears on its right, the page behind is darkened and blurred and the
// panel opens 10px under the bar.
export function StickyHeader({ children, menu, closeLabel }: { children: ReactNode; menu: MenuContent; closeLabel: string }) {
  const [stuck, setStuck] = useState(false);
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  const toggle = useCallback(() => setOpen((o) => !o), []);

  useEffect(() => {
    const update = () => setStuck(window.scrollY > 15);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      html.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <MenuContext.Provider value={{ open, toggle }}>
      <div
        aria-hidden
        onClick={close}
        className={`fixed inset-0 z-[35] bg-black/30 backdrop-blur-[20px] transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <header
        data-stuck={stuck || undefined}
        data-open={open || undefined}
        className={`group/header fixed inset-x-0 z-40 flex justify-center transition-[top] duration-300 ${
          open ? "top-[20px] px-[20px]" : stuck ? "top-[15px] px-4" : "top-[30px] px-4"
        }`}
      >
        <div className={`relative max-w-full transition-[width] duration-300 ${open ? "w-[1880px]" : "w-[1300px]"}`}>
          <div
            aria-hidden
            className={`absolute -inset-x-[15px] -top-[15px] -bottom-[15px] rounded-b-[16px] bg-white/30 backdrop-blur-[12px] transition-opacity duration-300 ${
              stuck && !open ? "opacity-100" : "opacity-0"
            }`}
          />
          <div className="relative flex gap-[10px]">
            <div className="min-w-0 flex-1">{children}</div>
            {open && (
              <button
                type="button"
                onClick={close}
                aria-label={closeLabel}
                className="flex size-[60px] shrink-0 cursor-pointer items-center justify-center rounded-[8px] bg-white hover:bg-grey-f0"
              >
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden>
                  <path d="M1 1L14 14M14 1L1 14" stroke="#546670" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            )}
          </div>
          {open && (
            <div className="absolute inset-x-0 top-[70px] max-h-[calc(100svh-110px)] overflow-y-auto rounded-[8px]">
              <MegaMenu menu={menu} onNavigate={close} />
            </div>
          )}
        </div>
      </header>
    </MenuContext.Provider>
  );
}

/** The top-bar item that opens the mega menu ("Produkty"). */
export function MenuTrigger({ label }: { label: string }) {
  const { open, toggle } = useContext(MenuContext);
  return (
    <button
      type="button"
      onClick={toggle}
      aria-expanded={open}
      aria-haspopup="true"
      className="cursor-pointer whitespace-nowrap hover:text-rotenso-red"
    >
      {label}
    </button>
  );
}
