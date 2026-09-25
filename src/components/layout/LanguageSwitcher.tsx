"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { locales, localeLabels, type Locale } from "@/i18n/config";

// Figma "Language": bold 16px code with an 8×4 caret centred under it.
// The open state is not designed yet — a plain list for now.
export function LanguageSwitcher({ lang }: { lang: Locale }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [open]);

  const swap = (target: Locale) => pathname.replace(/^\/[a-z]{2}(?=\/|$)/, `/${target}`);

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label="Język"
        className="relative block h-[28.5px] cursor-pointer text-center text-[16px] leading-[normal] font-bold text-rotenso-grey uppercase"
      >
        {lang}
        <Icon name="topbar-arrow-s" width={10} height={6} className="absolute top-[23.5px] left-[5px]" />
      </button>
      {open && (
        <ul className="absolute top-[40px] right-0 z-50 min-w-[160px] rounded-[8px] bg-white py-2 shadow-dark-l">
          {locales.map((l) => (
            <li key={l}>
              <Link
                href={swap(l)}
                className={`block px-4 py-1.5 text-[14px] hover:bg-grey-f0 ${l === lang ? "font-bold" : ""}`}
                onClick={() => setOpen(false)}
              >
                {localeLabels[l]}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
