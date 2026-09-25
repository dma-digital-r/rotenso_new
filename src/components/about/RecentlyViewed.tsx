"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";

const KEY = "rotenso:recent";
const MAX = 8;

export type RecentProduct = { href: string; name: string; text: string; image: string | null };

function read(): RecentProduct[] {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

/** Put on a product page: remembers the visit in this browser (newest first). */
export function RememberProduct({ product }: { product: RecentProduct }) {
  useEffect(() => {
    try {
      const list = [product, ...read().filter((p) => p.href !== product.href)].slice(0, MAX);
      localStorage.setItem(KEY, JSON.stringify(list));
    } catch {
      // Private mode / storage blocked — nothing to remember.
    }
  }, [product]);
  return null;
}

// Figma: "Ostatnio oglądane" (5172:76539) — 310-wide cards 40px apart, centred: product image
// (310×174), name, short text and "Zobacz ponownie". Only shown when this browser has visited
// product pages; the list lives in the visitor's browser only.
export function RecentlyViewed({ title, text, button, exclude }: { title: string; text: string; button: string; exclude?: string }) {
  const [items, setItems] = useState<RecentProduct[]>([]);
  useEffect(() => {
    // Reading browser storage has to wait until after hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setItems(read().filter((p) => p.href !== exclude));
  }, [exclude]);
  if (!items.length) return null;

  return (
    <section className="mt-[150px] text-rotenso-grey">
      <div className="mx-auto flex w-[1300px] max-w-[calc(100%-32px)] flex-col items-center gap-[10px] text-center font-light">
        <h2 className="text-h1 leading-[1.2]">{title}</h2>
        {text && <p className="w-[860px] max-w-full text-h3 leading-[1.36]">{text}</p>}
      </div>
      <div className="mt-[50px] flex justify-center gap-[40px] overflow-x-clip">
        {items.map((p) => (
          <article key={p.href} className="flex w-[310px] shrink-0 flex-col">
            <div className="relative h-[174px] overflow-hidden rounded-[16px] bg-grey-f0">
              {p.image && <Image src={p.image} alt="" fill sizes="310px" className="object-contain p-[30px]" />}
            </div>
            <div className="flex flex-col gap-[20px] pt-[20px] pb-[30px]">
              <div className="flex flex-col gap-[10px]">
                <h3 className="text-h3 leading-[1.36] font-light">{p.name}</h3>
                {p.text && <p className="line-clamp-2 text-[16px] leading-[24px]">{p.text}</p>}
              </div>
              <Button variant="m-red" href={p.href} className="self-start">
                {button}
              </Button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
