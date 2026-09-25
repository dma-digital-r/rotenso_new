"use client";

import { useEffect, useState, type ReactNode } from "react";

// The top bar sits 80px from the top (30px inside the hero) exactly as in Figma. Once the page
// scrolls, it stays pinned 20px below the window edge and gets a soft shadow so it reads
// against any section behind it.
export function StickyHeader({ children }: { children: ReactNode }) {
  const [stuck, setStuck] = useState(false);

  useEffect(() => {
    const update = () => setStuck(window.scrollY > 60);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <header
      data-stuck={stuck || undefined}
      className={`group/header fixed inset-x-0 z-40 flex justify-center px-4 transition-[top] duration-300 ${
        stuck ? "top-[20px]" : "top-[80px]"
      }`}
    >
      {children}
    </header>
  );
}
