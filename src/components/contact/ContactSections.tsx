import Link from "next/link";
import { FramedImage } from "@/components/ui/FramedImage";
import { Icon } from "@/components/ui/Icon";
import type { Ui } from "@/i18n/ui";
import type { ContactContent } from "@/lib/content";

// Figma: "Kontakt v03" — sections of the contact page.

// 1820×650 photo band (r32), breadcrumb, 310-wide dark glass box with the address and "Nawiguj".
export function ContactHero({ data, lang, ui }: { data: ContactContent["hero"]; lang: string; ui: Ui }) {
  return (
    <section className="relative mx-[50px] mt-[15px] h-[650px] overflow-hidden rounded-[32px] bg-[#c4c4c4]">
      <FramedImage src={data.image} sizes="100vw" preload />
      <div className="relative mx-auto h-full w-[1300px] max-w-[calc(100%-32px)]">
        <nav aria-label="Breadcrumb" className="absolute top-[103px] left-0 text-[12px] leading-[normal] text-white">
          <Link href={`/${lang}`} className="hover:underline">
            {ui.crumbHome}
          </Link>
          {" / "}
          <span aria-current="page">{ui.crumbContact}</span>
        </nav>
        <div className="absolute top-[151px] left-0 flex w-[310px] flex-col items-start gap-[20px] rounded-[32px] bg-black/50 p-[30px] text-white backdrop-blur-[20px]">
          <h1 className="text-h2 leading-[1.2] font-light whitespace-pre-line">{data.title}</h1>
          <p className="text-h3 leading-[1.36] font-light whitespace-pre-line">{data.address}</p>
          {data.navigate.label && (
            <a
              href={data.navigate.href}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-[5px] inline-flex h-[41px] items-center gap-[7px] rounded-[21px] bg-rotenso-red pr-[18px] pl-[10px] text-[16px] leading-[normal] font-bold whitespace-nowrap transition-opacity hover:opacity-85"
            >
              <Icon name="foot-navigator" width={24} height={24} />
              <span className="text-trim">{data.navigate.label}</span>
            </a>
          )}
        </div>
      </div>
    </section>
  );
}

// Map band (1820×650, r32): Google map centred on the office, the address card to the left of
// the pin with a red edge pointing at it.
export function ContactMap({ data }: { data: ContactContent["map"] }) {
  if (!data.query) return null;
  // The CMS typesetting puts non-breaking spaces into texts; Google needs plain ones.
  const query = data.query.replace(/ /g, " ");
  const src = `https://maps.google.com/maps?q=${encodeURIComponent(query)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
  return (
    <section className="relative mx-[50px] mt-[100px] h-[650px] overflow-hidden rounded-[32px] bg-[#e5e3df] text-rotenso-grey">
      <iframe src={src} title={data.title} loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="absolute inset-0 size-full border-0" />
      <div className="pointer-events-none absolute top-1/2 right-[calc(50%+80px)] w-[300px] -translate-y-[60%] rounded-[8px] border-r-[6px] border-rotenso-red bg-white p-[30px] shadow-dark-l">
        <p className="text-h3 leading-[1.36] font-light">{data.title}</p>
        <p className="mt-[20px] text-[16px] leading-[24px] whitespace-pre-line">{data.address}</p>
        <span aria-hidden className="absolute top-1/2 -right-[16px] size-0 -translate-y-1/2 border-y-[10px] border-l-[10px] border-y-transparent border-l-rotenso-red" />
      </div>
    </section>
  );
}

// "Nasze oddziały": centred title, three 420-wide cards — photo 236, city, text, address, button.
export function Branches({ data }: { data: ContactContent["branches"] }) {
  if (!data.items.length) return null;
  return (
    <section className="mx-auto mt-[100px] w-[1300px] max-w-[calc(100%-32px)] text-rotenso-grey">
      <div className="flex flex-col items-center gap-[10px] text-center font-light">
        <h2 className="text-h1 leading-[1.2]">{data.title}</h2>
        {data.text && <p className="text-h3 leading-[1.36]">{data.text}</p>}
      </div>
      <div className="mt-[50px] flex flex-wrap justify-center gap-[20px]">
        {data.items.map((b) => (
          <div key={b.name} className="flex w-[420px] flex-col overflow-hidden rounded-[32px] bg-white shadow-dark-l">
            <div className="relative h-[236px] shrink-0 bg-[#c4c4c4]">
              <FramedImage src={b.image} sizes="420px" />
            </div>
            <div className="flex flex-1 flex-col items-start p-[30px]">
              <h3 className="text-h2 leading-[1.2] font-light">{b.name}</h3>
              {b.text && <p className="mt-[20px] text-[16px] leading-[24px] whitespace-pre-line">{b.text}</p>}
              {b.address && <p className="mt-[24px] text-[16px] leading-[24px] whitespace-pre-line">{b.address}</p>}
              {b.map && data.button && (
                <div className="mt-auto pt-[20px]">
                  <a
                    href={b.map}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-[41px] items-center rounded-[21px] bg-rotenso-red px-[18px] text-[16px] leading-[normal] font-bold whitespace-nowrap text-white transition-opacity hover:opacity-85"
                  >
                    <span className="text-trim">{data.button}</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

