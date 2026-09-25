"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import type { HomeContent } from "@/lib/content";

const kinds = [
  { key: "ac", label: "Instalator klimatyzacji", icon: "map-ac-point-30" },
  { key: "reku", label: "Instalator rekuperatorów", icon: "map-reku-point-30" },
  { key: "hp", label: "Instalator pomp ciepła", icon: "map-hp-point-30" },
] as const;

const extraFilters = ["Certyfikowany instalator", "Posiada showroom", "Serwis", "Lorem ipsum", "Lorem ipsum "];

// Sample entries from the design — replaced by the installer database later.
const sampleInstallers = Array.from({ length: 4 }, (_, i) => ({
  id: i,
  name: "Nazwa firmy",
  address: ["ul. Nazwa ulicy 10, Miejscowość, 00-000", "woj. województwo"],
  extras: ["Posiada Showroom", "Serwis 24/7", "Lorem ipsum"],
}));

// Map pins in design coordinates (relative to the 1820×700 map frame).
const pins = [
  { left: 968, top: 314 },
  { left: 958, top: 406 },
  { left: 1072, top: 349 },
  { left: 872, top: 400 },
];

// Figma: "Mapa" (5172:70435) — 1820 wide, title / search / filters / 700px map, gap 50.
export function Installer({ data, lang }: { data: HomeContent["installer"]; lang: string }) {
  const [selected, setSelected] = useState<Record<string, boolean>>({ ac: true, reku: false, hp: false });
  const [extras, setExtras] = useState<Record<string, boolean>>({});

  return (
    <section className="relative mx-[50px] mt-[251px] flex flex-col items-center gap-[50px]">
      <div className="flex w-[1300px] max-w-full flex-col items-center gap-[10px] text-center font-light text-rotenso-grey">
        <h2 className="w-full text-[72px] leading-[1.2]">{data.title}</h2>
        <p className="w-[860px] max-w-full text-[25px] leading-normal">{data.text}</p>
      </div>

      <form
        action={`/${lang}/znajdz-instalatora`}
        className="flex h-[60px] w-[640px] max-w-full items-center justify-between rounded-[50px] border border-grey-dd bg-grey-f0 py-[5px] pr-[5px] pl-[40px]"
      >
        <input
          name="q"
          type="search"
          placeholder={data.placeholder}
          aria-label={data.placeholder}
          className="min-w-px flex-1 bg-transparent text-[25px] leading-normal font-light text-rotenso-grey outline-none placeholder:text-rotenso-grey"
        />
        <button type="submit" aria-label="Szukaj" className="shrink-0 cursor-pointer">
          <Icon name="search-btn-l" width={50} height={50} />
        </button>
      </form>

      <div className="flex flex-col items-center gap-[20px]">
        <div className="flex items-center gap-[50px]">
          {kinds.map((k) => (
            <label key={k.key} className="flex cursor-pointer items-center gap-[15px]">
              <input
                type="checkbox"
                className="sr-only"
                checked={selected[k.key]}
                onChange={(e) => setSelected((s) => ({ ...s, [k.key]: e.target.checked }))}
              />
              {selected[k.key] ? (
                <Icon name="check" width={25} height={25} />
              ) : (
                <span className="size-[25px] shrink-0 rounded-[4px] border border-grey-dd bg-white" />
              )}
              <Icon name={k.icon} width={30} height={30} />
              <span className="text-[16px] leading-[24px] whitespace-nowrap text-rotenso-grey">{k.label}</span>
            </label>
          ))}
        </div>
        <div className="flex items-start gap-[10px] p-[10px]">
          <p className="text-[16px] leading-[24px] whitespace-nowrap text-rotenso-grey">Dodatkowe filtry:</p>
          {extraFilters.map((f) => (
            <button
              key={f}
              type="button"
              aria-pressed={!!extras[f]}
              onClick={() => setExtras((s) => ({ ...s, [f]: !s[f] }))}
              className={`inline-flex cursor-pointer items-center justify-center overflow-clip rounded-[15px] border border-rotenso-grey px-[15px] py-[10px] text-[12px] leading-normal font-bold whitespace-nowrap ${
                extras[f] ? "bg-rotenso-grey text-white" : "text-rotenso-grey"
              }`}
            >
              <span className="text-trim">{f.trim()}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="relative flex h-[700px] w-full flex-col items-start gap-[10px] overflow-hidden rounded-[32px] p-[50px]">
        <Image src="/images/home/map.png" alt="" fill sizes="100vw" className="pointer-events-none object-cover" />
        <InstallerList />
        <div className="pointer-events-none absolute inset-0">
          <span className="absolute top-[310px] left-[873px] h-[55px] w-[40px]">
            <Icon name="map-pin-big" width={40} height={55} className="absolute inset-0 size-full" />
            <span className="absolute top-[13.95%] bottom-[42.41%] left-[calc(50%-0.5px)] aspect-[17.7/20.37] -translate-x-1/2">
              <Icon name="map-pin-big-snow" width={18} height={20} className="absolute inset-0 size-full" />
            </span>
          </span>
          {pins.map((p) => (
            <span key={`${p.left}-${p.top}`} className="absolute size-[20px]" style={p}>
              <Icon name="map-ac-point-onmap" width={20} height={20} className="size-full" />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

// "Lista kontaków": 420px white card, custom 5px scrollbar (#F0F0F0 track, grey thumb).
function InstallerList() {
  const ref = useRef<HTMLDivElement>(null);
  const [thumb, setThumb] = useState({ top: 0, height: 193 });

  const update = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const track = el.clientHeight;
    const height = Math.max(40, (el.clientHeight / el.scrollHeight) * track);
    const max = el.scrollHeight - el.clientHeight;
    setThumb({ height, top: max > 0 ? (el.scrollTop / max) * (track - height) : 0 });
  }, []);

  useEffect(() => update(), [update]);

  return (
    <div className="relative flex min-h-px w-[420px] flex-1 items-start gap-[15px] overflow-clip rounded-[16px] bg-white py-[30px] pr-[10px] pl-[30px] shadow-dark-l">
      <div ref={ref} onScroll={update} className="flex h-full min-w-px flex-1 flex-col gap-[20px] overflow-y-auto scrollbar-none">
        {sampleInstallers.map((ins, i) => (
          <div key={ins.id} className="flex flex-col gap-[20px]">
            {i > 0 && <div className="h-px w-full shrink-0 bg-grey-dd" />}
            <InstallerCard {...ins} />
          </div>
        ))}
      </div>
      <div className="relative h-full w-[5px] shrink-0 rounded-[5px] bg-grey-f0">
        <div
          className="absolute left-0 w-[5px] rounded-[5px] bg-rotenso-grey"
          style={{ top: thumb.top, height: thumb.height }}
        />
      </div>
    </div>
  );
}

function InstallerCard({ name, address, extras }: (typeof sampleInstallers)[number]) {
  return (
    <div className="flex w-[360px] shrink-0 flex-col items-start gap-[12px] text-rotenso-grey">
      <div className="flex w-full flex-col pb-[10px]">
        <p className="text-[18px] leading-normal font-bold">{name}</p>
        <div className="flex w-full items-center gap-[5px]">
          <Icon name="map-star" width={20} height={20} />
          <p className="flex-1 text-[12px] leading-normal">Certyfikowany instalator</p>
        </div>
      </div>
      <div className="relative flex w-full items-start gap-[8px]">
        <Icon name="map-home" width={24} height={24} />
        <p className="flex-1 text-[16px] leading-[24px]">
          {address[0]}
          <br />
          {address[1]}
        </p>
        <a
          href="#"
          className="absolute top-[27px] left-[177px] inline-flex items-center justify-center overflow-clip rounded-[11px] border border-rotenso-grey px-[8px] py-[7px] text-[9px] leading-normal font-bold whitespace-nowrap"
        >
          <span className="text-trim">Nawiguj</span>
        </a>
      </div>
      <div className="flex w-full items-start gap-[30px]">
        <RevealChip icon="map-phone" label="pokaż nr telefonu" />
        <RevealChip icon="map-mail" label="pokaż adres e-mail" />
      </div>
      <div className="flex w-full flex-col gap-[5px]">
        <p className="text-[12px] leading-normal font-bold">Usługi montażu:</p>
        <div className="flex gap-[15px]">
          {[
            ["map-ac-point-20", "Klimatyzacja"],
            ["map-reku-point-20", "Rekuperacja"],
            ["map-hp-point-20", "Pompa ciepła"],
          ].map(([icon, label]) => (
            <span key={label} className="flex items-center gap-[5px]">
              <Icon name={icon} width={20} height={20} />
              <span className="text-[12px] leading-normal whitespace-nowrap">{label}</span>
            </span>
          ))}
        </div>
      </div>
      <div className="flex w-full flex-col gap-[5px]">
        <p className="text-[12px] leading-normal font-bold">Dodatkowe informacje:</p>
        <div className="flex items-stretch gap-[10px]">
          {extras.map((x, i) => (
            <span key={x} className="flex items-stretch gap-[10px]">
              {i > 0 && <span className="w-px bg-grey-dd" />}
              <span className="text-[12px] leading-normal whitespace-nowrap">{x}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function RevealChip({ icon, label }: { icon: string; label: string }) {
  return (
    <span className="flex items-center gap-[8px]">
      <Icon name={icon} width={24} height={24} />
      <button
        type="button"
        className="flex cursor-pointer items-center justify-center rounded-[4px] bg-rotenso-grey px-[6px] pt-[2px] pb-[4px] text-[12px] leading-normal whitespace-nowrap text-white"
      >
        {label}
      </button>
    </span>
  );
}
