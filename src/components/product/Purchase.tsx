"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import type { Ui } from "@/i18n/ui";

export type PurchaseVariant = { label: string; price: number | null; images: string[] };

type Props = {
  /** Front view of the indoor unit for the 180° tile. */
  packshot: string | null;
  /** Basic: the page starts here, so the panel shows the category above the name (as the hero does). */
  label?: string;
  /** Basic: the product name is the page's main heading. */
  headingLevel?: "h1" | "h2";
  name: string;
  description: string;
  /** Visualisations from the CMS — shown first, before the feed photos of the chosen capacity. */
  cmsImages: string[];
  variants: PurchaseVariant[];
  multi?: { label: string; href: string };
  siblings: { name: string; image: string | null; href: string }[];
  arHref: string;
  accessoriesHref: string;
  lang: string;
  ui: Ui;
};

const formatPln = (v: number) => `${new Intl.NumberFormat("pl-PL", { maximumFractionDigits: 0 }).format(v)} zł`;
const THUMBS = 4;

// Figma: "e-commerce klimatyzacje" (5172:81598), 1820 wide — gallery 1270 + white panel 530.
// Choosing a capacity switches the price; prices are only present on the Polish site.
export function Purchase({ label, headingLevel = "h2", name, description, cmsImages, packshot, variants, multi, siblings, arHref, accessoriesHref, lang, ui }: Props) {
  const [image, setImage] = useState(0);
  const [start, setStart] = useState(0);
  const [variant, setVariant] = useState(0);
  const current = variants[variant];
  const gallery = [...new Set([...cmsImages, ...(current?.images ?? [])])];

  const select = (i: number) => {
    setImage(i);
    if (i < start) setStart(i);
    if (i >= start + THUMBS) setStart(i - THUMBS + 1);
  };

  return (
    <div className="mx-[50px] flex gap-[20px]">
      {/* Gallery */}
      <div className="flex w-[1270px] min-w-0 shrink flex-col gap-[20px]">
        <div className={`relative h-[714px] overflow-hidden rounded-[32px] ${image < cmsImages.length ? "bg-grey-dd" : "bg-white"}`}>
          {gallery[image] && (
            // CMS visualisations fill the frame; feed packshots (white background) are shown whole.
            <Image
              src={gallery[image]}
              alt={name}
              fill
              sizes="1270px"
              className={image < cmsImages.length ? "object-cover" : "object-contain p-[40px]"}
              preload
            />
          )}
        </div>
        <div className="flex h-[130px] items-center gap-[10px]">
          <button
            type="button"
            aria-label={ui.prevImage}
            onClick={() => select(Math.max(0, image - 1))}
            className="shrink-0 cursor-pointer disabled:opacity-40"
            disabled={image === 0}
          >
            <Icon name="arrow-g2-left" width={30} height={30} />
          </button>
          <div className="flex min-w-0 flex-1 gap-[10px] overflow-hidden">
            {gallery.slice(start, start + THUMBS).map((src, k) => {
              const i = start + k;
              return (
                <button
                  key={src}
                  type="button"
                  onClick={() => select(i)}
                  aria-pressed={i === image}
                  className={`relative h-[130px] w-[230px] shrink-0 cursor-pointer overflow-hidden rounded-[16px] ${
                    i === image ? "border-2 border-white shadow-[5px_5px_30px_rgba(0,0,0,0.3)]" : "border border-grey-dd"
                  }`}
                >
                  <Image src={src} alt="" fill sizes="230px" className={i < cmsImages.length ? "object-cover" : "bg-white object-contain p-[10px]"} />
                </button>
              );
            })}
          </div>
          <button
            type="button"
            aria-label={ui.nextImage}
            onClick={() => select(Math.min(gallery.length - 1, image + 1))}
            className="shrink-0 cursor-pointer disabled:opacity-40"
            disabled={image >= gallery.length - 1 || gallery.length === 0}
          >
            <Icon name="arrow-g2-right" width={30} height={30} />
          </button>
          {/* 180° video tile — jumps to the intro video section. */}
          <a
            href="#intro-video"
            aria-label="Wideo 180°"
            className="relative flex h-[130px] w-[230px] shrink-0 items-center justify-center overflow-hidden rounded-[16px] px-[15px]"
          >
            <Image src="/images/products/mirai-360-bg.jpg" alt="" fill sizes="230px" className="object-cover" />
            {packshot && (
              <Image src={packshot} alt="" width={200} height={66} className="relative h-[66px] w-[200px] object-contain drop-shadow-[-10px_10px_10px_rgba(0,0,0,0.1)]" />
            )}
            <Icon name="video-180" width={71} height={40} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </a>
        </div>
      </div>

      {/* Panel */}
      <div className="flex w-[530px] shrink-0 flex-col gap-[20px]">
        <div className="flex flex-col gap-[30px] rounded-[32px] bg-white px-[30px] pt-[30px] pb-[40px] text-rotenso-grey shadow-[8px_8px_30px_rgba(0,0,0,0.15)]">
          <div className="flex flex-col gap-[10px]">
            <div className="font-light">
              {headingLevel === "h1" ? (
                <h1>
                  {label && <span className="block text-[20px] leading-[normal]">{label}</span>}{" "}
                  <span className="block text-h1 leading-[1.2]">{name}</span>
                </h1>
              ) : (
                <>
                  {label && <p className="text-[20px] leading-[normal]">{label}</p>}
                  <h2 className="text-h1 leading-[1.2]">{name}</h2>
                </>
              )}
            </div>
            <p className="text-[16px] leading-[24px]">{description}</p>
          </div>

          {multi?.href && (
            <div className="flex h-[30px] items-center justify-between gap-[10px]">
              <p className="text-[16px] leading-[24px]">{ui.alsoMulti}</p>
              <Link
                href={multi.href}
                className="flex h-[30px] items-center gap-[10px] rounded-[15px] bg-rotenso-grey pr-[12px] pl-[13px] text-[16px] leading-[24px] text-white hover:opacity-85"
              >
                {ui.see}
                <svg width="7" height="5" viewBox="0 0 7 5" fill="none" aria-hidden>
                  <path d="M0.5 2.5H6.5M4.5 0.5L6.5 2.5L4.5 4.5" stroke="white" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>
          )}

          {siblings.length > 0 && (
            <>
              <hr className="border-grey-dd" />
              <div className="flex flex-col gap-[20px]">
                <p className="text-[18px] leading-[24.5px]">{ui.otherModels}</p>
                <div className="flex gap-[20px]">
                  {siblings.map((s) => (
                    <Link key={s.name} href={s.href} className="flex w-[100px] flex-col items-center gap-[10px]">
                      <span className="relative h-[60px] w-[100px]">
                        {s.image && <Image src={s.image} alt="" fill sizes="100px" className="object-contain" />}
                      </span>
                      <span className="text-center text-[12px] leading-[normal]">{s.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </>
          )}

          <hr className="border-grey-dd" />

          <div className="flex flex-col gap-[10px]">
            <p className="text-[18px] leading-[24.5px]">{ui.choosePower}</p>
            <div className="flex flex-wrap gap-[10px]">
              {variants.map((v, i) => (
                <button
                  key={v.label}
                  type="button"
                  onClick={() => {
                    setVariant(i);
                    // Feed photos change with the capacity; keep a CMS visualisation, else go back to the first image.
                    if (image >= cmsImages.length) {
                      setImage(0);
                      setStart(0);
                    }
                  }}
                  aria-pressed={i === variant}
                  className={`h-[50px] w-[86px] cursor-pointer rounded-[8px] border border-rotenso-grey text-center text-[18px] leading-[24.5px] transition-opacity ${
                    i === variant ? "" : "opacity-50 hover:opacity-80"
                  }`}
                >
                  {v.label}
                </button>
              ))}
            </div>
          </div>

          {current?.price != null && (
            <div className="flex flex-col gap-[10px] py-[5px]" aria-live="polite">
              <div className="flex items-center gap-[20px]">
                <p className="text-[18px] leading-[24.5px]">{ui.priceLabel}</p>
                <p className="text-h2 leading-[48px] font-light whitespace-nowrap">{formatPln(current.price)}</p>
                <p className="w-[240px] text-[12px] leading-[normal]">{ui.priceNote}</p>
              </div>
              <p className="text-[16px] leading-[24px]">{ui.noInstall}</p>
            </div>
          )}

          <hr className="border-grey-dd" />

          <p className="text-[18px] leading-[24.5px]">{ui.needInfo}</p>
          <div className="-mt-[10px] flex gap-[20px]">
            <Button variant="m-red" href="#wycena" className="w-[225px]">
              {ui.askInstall}
            </Button>
            <Button variant="m-red" href={`/${lang}/znajdz-instalatora`} className="w-[225px] bg-rotenso-grey!">
              {ui.findInstaller}
            </Button>
          </div>

          <hr className="border-grey-dd" />

          <div className="flex items-center gap-[30px]">
            <p className="w-[329px] text-[16px] leading-[24px] whitespace-pre-line">{ui.compareText}</p>
            <button
              type="button"
              className="flex h-[40px] cursor-pointer items-center gap-[10px] rounded-[21px] border border-rotenso-grey px-[15px] py-[8px] text-[16px] leading-[24px]"
            >
              <Icon name="compare-add" width={24} height={24} />
              {ui.add}
            </button>
          </div>
        </div>

        {arHref && (
          <div className="flex h-[100px] items-center gap-[10px] overflow-hidden rounded-[16px] bg-grey-f0 pr-[30px]">
            <Image src="/images/products/ar-preview.png" alt="" width={208} height={100} className="h-[100px] w-[208px] shrink-0" />
            <p className="flex-1 text-[18px] leading-[24.5px] whitespace-pre-line text-rotenso-grey">{ui.arCta}</p>
            <Button variant="m-red" href={arHref}>
              {ui.see}
            </Button>
          </div>
        )}
        {accessoriesHref && (
          <div className="flex h-[100px] items-center gap-[30px] rounded-[16px] bg-grey-f0 py-[10px] pr-[30px] pl-[10px]">
            <Icon name="accessories" width={80} height={80} className="rounded-[8px]" />
            <p className="flex-1 text-[18px] leading-[24.5px] whitespace-pre-line text-rotenso-grey">{ui.accessoriesCta}</p>
            <Link
              href={accessoriesHref}
              className="inline-flex h-[41px] shrink-0 items-center justify-center rounded-[21px] border border-rotenso-grey px-[18px] text-[16px] font-bold text-rotenso-grey hover:opacity-85"
            >
              <span className="text-trim">{ui.see}</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
