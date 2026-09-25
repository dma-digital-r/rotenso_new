"use client";

import { useEffect, useState, type ReactNode } from "react";

// The top bar sits 15px inside the hero (30px from the window top). Once the page scrolls it
// stays pinned 15px below the window edge, on a frosted-glass plate (the menu's width + 15px on
// each side, reaching the window edge) so it stays readable over any section behind it.
export function StickyHeader({ children }: { children: ReactNode }) {
  const [stuck, setStuck] = useState(false);

  useEffect(() => {
    const update = () => setStuck(window.scrollY > 15);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <header
      data-stuck={stuck || undefined}
      className={`group/header fixed inset-x-0 z-40 flex justify-center px-4 transition-[top] duration-300 ${
        stuck ? "top-[15px]" : "top-[30px]"
      }`}
    >
      <div className="relative w-[1300px] max-w-full">
        <div
          aria-hidden
          className={`absolute -inset-x-[15px] -top-[15px] -bottom-[15px] rounded-b-[16px] bg-white/30 backdrop-blur-[12px] transition-opacity duration-300 ${
            stuck ? "opacity-100" : "opacity-0"
          }`}
        />
        <div className="relative">{children}</div>
      </div>
    </header>
  );
}
