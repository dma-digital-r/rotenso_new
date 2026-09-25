"use client";

import Image from "next/image";
import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import type { Ui } from "@/i18n/ui";
import type { SpecGroup } from "@/lib/specs";

type Dimensions = { indoor: string | null; outdoor: string | null; remote: string | null };

type Props = {
  name: string;
  variants: { label: string; specs: SpecGroup[]; dimensions: Dimensions }[];
  featureGroups: { title: string; items: { name: string; tooltip: string }[] }[];
  ui: Ui;
};

// Figma: "Klimatyzacja High Premium Specyfikacja" (5172:81741). Left: sticky capacity switch
// (220 wide); right, 970 wide at +330: dimensions, product features, technical data.
export function Specification({ name, variants, featureGroups, ui }: Props) {
  const [variant, setVariant] = useState(0);
  const dimensions = variants[variant]?.dimensions ?? { indoor: null, outdoor: null, remote: null };
  const dims = (
    [
      ["indoor", ui.indoorUnit, dimensions.indoor],
      ["outdoor", ui.outdoorUnit, dimensions.outdoor],
      ["remote", ui.remote, dimensions.remote],
    ] as const
  ).filter(([, , src]) => src);
  const [dimTab, setDim] = useState(0);
  // Drawings follow the capacity; keep the chosen tab if the new capacity has it.
  const dim = Math.min(dimTab, Math.max(0, dims.length - 1));
  const specs = variants[variant]?.specs ?? [];

  return (
    <div className="relative mx-auto mt-[50px] flex w-[1300px] max-w-[calc(100%-32px)] gap-[110px] pb-[150px] text-rotenso-grey">
      <aside className="w-[220px] shrink-0">
        <div className="sticky top-[180px] flex flex-col gap-[30px]">
          <h1 className="text-h2 leading-[1.2] font-light whitespace-pre-line">{ui.specModel}</h1>
          <div className="flex flex-col gap-[10px]">
            {variants.map((v, i) => (
              <button
                key={v.label}
                type="button"
                onClick={() => setVariant(i)}
                aria-pressed={i === variant}
                className={`h-[50px] w-[220px] cursor-pointer rounded-[30px] px-[30px] text-[18px] leading-[24.5px] ${
                  i === variant ? "bg-rotenso-grey text-white" : "bg-grey-f0 text-rotenso-grey hover:bg-grey-dd"
                }`}
              >
                {name} {v.label}
              </button>
            ))}
          </div>
        </div>
      </aside>

      <div className="flex w-[970px] min-w-0 flex-col">
        {dims.length > 0 && (
          <section>
            <div className="flex items-end gap-[50px]">
              <h2 className="text-h2 leading-[1.2] font-light">{ui.dimensions}</h2>
              {dims.length > 1 &&
                dims.map(([key, label], i) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setDim(i)}
                    aria-pressed={i === dim}
                    className={`cursor-pointer text-[18px] leading-[24.5px] ${i === dim ? "font-bold" : "opacity-70 hover:opacity-100"}`}
                  >
                    {label}
                  </button>
                ))}
              {dims.length === 1 && <span className="text-[18px] leading-[24.5px]">{dims[0][1]}</span>}
            </div>
            <div className="relative mt-[50px] h-[546px] overflow-hidden rounded-[32px]">
              <Image src={dims[dim][2]!} alt={`${ui.dimensions} — ${dims[dim][1]}`} fill sizes="970px" className="object-contain" />
            </div>
          </section>
        )}

        {featureGroups.length > 0 && (
          <section className="mt-[100px]">
            <h2 className="text-h2 leading-[1.2] font-light">{ui.features}</h2>
            <div className="mt-[50px] flex flex-col gap-[50px]">
              {featureGroups.map((g) => (
                <div key={g.title} className="flex flex-col gap-[20px]">
                  <h3 className="text-h3 leading-[normal] font-light">{g.title}</h3>
                  <hr className="border-rotenso-grey" />
                  <ul className="grid grid-cols-3 gap-y-[10px]">
                    {g.items.map((it) => (
                      <li key={it.name} className="group relative flex items-center gap-[10px] text-[16px] leading-[24px]">
                        <span aria-hidden className="size-[5px] shrink-0 rounded-full bg-rotenso-grey" />
                        <span className={it.tooltip ? "cursor-help underline decoration-dotted underline-offset-4" : ""}>{it.name}</span>
                        {it.tooltip && (
                          // "Dymek" (5172:82095): 310 wide bubble above the item.
                          <span
                            role="tooltip"
                            className="pointer-events-none absolute bottom-[calc(100%+20px)] left-0 z-10 w-[310px] rounded-[8px] bg-[#f5f5f5] p-[20px] text-center text-[12px] leading-[16.3px] opacity-0 shadow-[20px_20px_30px_rgba(0,0,0,0.15)] transition-opacity group-hover:opacity-100"
                          >
                            {it.tooltip}
                            <span aria-hidden className="absolute -bottom-[10px] left-[40px] size-[20px] rotate-45 rounded-[4px] bg-[#f5f5f5]" />
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="mt-[100px]">
          <h2 className="text-h2 leading-[1.2] font-light">{ui.specTitle}</h2>
          <div className="mt-[50px] flex flex-col gap-[20px]">
            {specs.map((g, i) => (
              <SpecTable key={`${variant}-${g.title}`} group={g} defaultOpen={i < 3} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function SpecTable({ group, defaultOpen }: { group: SpecGroup; defaultOpen: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="flex flex-col gap-[10px]">
      <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} className="flex cursor-pointer flex-col gap-[10px] text-left">
        <span className="flex items-center gap-[10px]">
          <span className="text-h3 leading-[normal] font-light">{group.title}</span>
          <Icon name="nav-arrow-up" width={24} height={24} className={`transition-transform ${open ? "" : "rotate-180"}`} />
        </span>
        <span aria-hidden className="h-px w-full bg-rotenso-grey" />
      </button>
      {open &&
        group.rows.map((r, i) => (
          <div key={r.label} className="flex flex-col gap-[10px]">
            {i > 0 && <span aria-hidden className="h-px w-full bg-grey-dd" />}
            <div className="flex min-h-[24px] items-start justify-between gap-[30px] text-[16px] leading-[24px]">
              <span className="w-[410px]">{r.label}</span>
              <span className="w-[200px] shrink-0">{r.sub}</span>
              <span className="w-[300px] shrink-0">{r.value}</span>
            </div>
          </div>
        ))}
    </div>
  );
}
