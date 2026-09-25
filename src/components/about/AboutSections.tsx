import Image from "next/image";
import Link from "next/link";
import { diagonalGradient } from "@/components/home/SectionBackdrop";
import { Button } from "@/components/ui/Button";
import { FramedImage } from "@/components/ui/FramedImage";
import { Icon } from "@/components/ui/Icon";
import type { Ui } from "@/i18n/ui";
import type { AboutContent, SettingsContent } from "@/lib/content";

// Figma: "O nas v03" (5172:76530). Vertical gaps between sections are the Figma distances.

function Heading({ title, text, white = false, className = "" }: { title: string; text?: string; white?: boolean; className?: string }) {
  return (
    <div className={`mx-auto flex w-[1300px] max-w-[calc(100%-32px)] flex-col items-center gap-[10px] text-center font-light ${white ? "text-white" : "text-rotenso-grey"} ${className}`}>
      <h2 className="text-h1 leading-[1.2] whitespace-pre-line">{title}</h2>
      {text && <p className="w-[860px] max-w-full text-h3 leading-[1.36] whitespace-pre-line">{text}</p>}
    </div>
  );
}

// 860×484 film still, darkened 30%, with the white play button when a link is set.
function VideoTile({ image, url, label, shadow = false }: { image: string | null; url: string; label: string; shadow?: boolean }) {
  const inner = (
    <>
      <FramedImage src={image} sizes="860px" />
      <span className="absolute inset-0 bg-black/30" />
      {url && (
        <svg width="60" height="60" viewBox="0 0 60 60" fill="none" aria-hidden className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-transform group-hover:scale-110">
          <circle cx="30" cy="30" r="29" stroke="white" strokeWidth="2" />
          <path d="M24 18.5L41 30L24 41.5Z" fill="white" stroke="white" strokeWidth="3" strokeLinejoin="round" />
        </svg>
      )}
    </>
  );
  const cls = `group relative block h-[484px] w-[860px] shrink overflow-hidden rounded-[32px] bg-[#c4c4c4] ${shadow ? "shadow-dark-l" : ""}`;
  return url ? (
    <a href={url} target="_blank" rel="noopener noreferrer" aria-label={label} className={cls}>
      {inner}
    </a>
  ) : (
    <div className={cls}>{inner}</div>
  );
}

// "Header Premium video" — like the home hero: rounded box 50px from the sides, screen height.
export function AboutHero({ data, lang, ui }: { data: AboutContent["hero"]; lang: string; ui: Ui }) {
  return (
    <section className="relative mx-[50px] mt-[15px] h-[calc(100svh-30px)] min-h-[560px] overflow-hidden rounded-[32px] bg-rotenso-grey">
      {data.video ? (
        <video src={data.video} poster={data.image ?? undefined} autoPlay muted loop playsInline className="absolute inset-0 size-full object-cover" />
      ) : (
        <FramedImage src={data.image} sizes="100vw" preload />
      )}
      <span className="absolute inset-0 bg-black/20" />
      <nav aria-label="Breadcrumb" className="absolute top-[95px] left-1/2 w-[1300px] max-w-[calc(100%-32px)] -translate-x-1/2 text-[12px] leading-[normal] text-white">
        <Link href={`/${lang}`} className="hover:underline">
          {ui.crumbHome}
        </Link>
        {" / "}
        <span aria-current="page">{ui.crumbAbout}</span>
      </nav>
      <div className="absolute top-1/2 left-1/2 flex w-[958px] max-w-[calc(100%-32px)] -translate-x-1/2 -translate-y-1/2 flex-col gap-[10px] rounded-[32px] bg-black/50 px-[50px] py-[30px] text-center font-light text-white backdrop-blur-[20px]">
        <h1 className="text-h1 leading-[1.2]">{data.title}</h1>
        <p className="text-h3 leading-[1.36]">{data.text}</p>
      </div>
    </section>
  );
}

// "Liczby" — three 433px columns with 1px dividers.
export function Stats({ items }: { items: AboutContent["stats"] }) {
  return (
    <section className="mx-auto mt-[150px] flex w-[1300px] max-w-[calc(100%-32px)] font-light">
      {items.map((s, i) => (
        <div key={s.label} className={`flex flex-1 flex-col items-center text-center ${i ? "border-l border-grey-dd" : ""}`}>
          <p className="text-h1 leading-[1.2] text-rotenso-red">{s.value}</p>
          <p className="text-h3 leading-[1.36] text-rotenso-grey">{s.label}</p>
        </div>
      ))}
    </section>
  );
}

// "O firmie" — 1830-wide rounded photo box (45px from the edges), glass text panel + film still;
// the kingfisher perches on its top-left corner.
export function Company({ data, ui }: { data: AboutContent["company"]; ui: Ui }) {
  return (
    <section className="relative z-10 mx-[45px] mt-[150px]">
      <div className="relative overflow-hidden rounded-[32px] bg-[#c4c4c4] py-[150px] shadow-dark-l">
        <FramedImage src={data.background} sizes="100vw" />
        <span className="absolute inset-0 bg-black/20 backdrop-blur-[10px]" />
        <div className="relative mx-auto flex w-[1300px] max-w-[calc(100%-32px)] gap-[20px]">
          <div className="flex w-[420px] shrink-0 flex-col justify-center gap-[20px] rounded-[32px] bg-black/50 p-[30px] text-white backdrop-blur-[20px]">
            <h2 className="text-h2 leading-[1.2] font-light">{data.title}</h2>
            <p className="text-[16px] leading-[24px] whitespace-pre-line">{data.text}</p>
          </div>
          <VideoTile image={data.videoImage} url={data.videoUrl} label={`${ui.play}: ${data.title}`} />
        </div>
      </div>
      <Image
        src="/images/home/kingfisher.png"
        alt=""
        width={300}
        height={300}
        sizes="300px"
        className="pointer-events-none absolute -top-[184px] left-[28px] drop-shadow-[50px_50px_25px_rgba(0,0,0,0.25)]"
      />
    </section>
  );
}

// "Video produkcja" — plain text column + film still with shadow.
export function Production({ data, ui }: { data: AboutContent["production"]; ui: Ui }) {
  return (
    <section className="mx-auto mt-[150px] flex w-[1300px] max-w-[calc(100%-32px)] items-center gap-[20px] text-rotenso-grey">
      <div className="flex w-[420px] shrink-0 flex-col gap-[20px] p-[30px]">
        <h2 className="text-h2 leading-[1.2] font-light">{data.title}</h2>
        <p className="text-[16px] leading-[24px] whitespace-pre-line">{data.text}</p>
      </div>
      <VideoTile image={data.videoImage} url={data.videoUrl} label={`${ui.play}: ${data.title}`} shadow />
    </section>
  );
}

// "Misja TXT" — rounded photo box, glass panel with the mission, big red quotation mark on top.
export function Mission({ data }: { data: AboutContent["mission"] }) {
  return (
    <section className="relative mx-[50px] mt-[200px] overflow-hidden rounded-[32px] bg-rotenso-grey py-[150px] shadow-dark-l">
      <FramedImage src={data.background} sizes="100vw" />
      <div className="relative mx-auto w-[1300px] max-w-[calc(100%-32px)] rounded-[32px] bg-black/50 p-[50px] backdrop-blur-[20px]">
        <p className="mx-auto w-[1200px] max-w-full text-center text-h2 leading-[1.2] font-light text-white">{data.text}</p>
      </div>
      <span aria-hidden className="absolute top-[20px] left-1/2 -translate-x-1/2 text-[300px] leading-[360px] text-rotenso-red">
        “
      </span>
    </section>
  );
}

// "Mapa Europy" on the gradient "Rectangle 32"; the second kingfisher sits top-right.
export function International({ data }: { data: AboutContent["international"] }) {
  return (
    <section className="relative mt-[150px]">
      <div aria-hidden className="absolute inset-x-0 -top-[446px] -z-10 h-[1545px]" style={{ backgroundImage: diagonalGradient(1545) }} />
      <Heading title={data.title} text={data.text} />
      <div className="mx-auto mt-[50px] flex w-[1300px] max-w-[calc(100%-32px)] flex-col items-center gap-[100px] px-[50px]">
        {data.map && <Image src={data.map} alt={data.title} width={1200} height={645} sizes="1200px" className="h-auto w-[1200px] max-w-full" />}
        <p className="text-center text-[16px] leading-[24px] whitespace-pre-wrap text-rotenso-grey">{data.countries.replace(/\s*\|\s*/g, "  |  ")}</p>
      </div>
      <Image
        src="/images/about/kingfisher-2.png"
        alt=""
        width={350}
        height={350}
        sizes="350px"
        className="pointer-events-none absolute -top-[26px] left-[calc(50%+480px)] drop-shadow-[50px_50px_25px_rgba(0,0,0,0.25)]"
      />
    </section>
  );
}

// "Certyfikaty" — logos 80px high, 40px apart, centred rows.
export function Certificates({ data }: { data: AboutContent["certificates"] }) {
  return (
    <section className="mt-[200px]">
      <Heading title={data.title} text={data.text} />
      <ul className="mx-auto mt-[100px] flex w-[1300px] max-w-[calc(100%-32px)] flex-wrap justify-center gap-[40px]">
        {data.logos.map((l) =>
          l.image ? (
            <li key={l.image} className="relative flex h-[80px] items-center">
              <Image src={l.image} alt={l.name} width={170} height={80} className="h-auto max-h-[80px] w-auto max-w-[170px]" />
            </li>
          ) : null,
        )}
      </ul>
    </section>
  );
}

// "Kariera" — rounded photo box, glass panel with a big title.
export function Career({ data }: { data: AboutContent["career"] }) {
  return (
    <section className="relative mx-[50px] mt-[200px] overflow-hidden rounded-[32px] bg-rotenso-grey py-[100px]">
      <FramedImage src={data.background} sizes="100vw" />
      <div className="relative mx-auto w-[1300px] max-w-[calc(100%-32px)]">
        <div className="flex w-[420px] flex-col gap-[30px] rounded-[32px] bg-black/50 p-[30px] text-white backdrop-blur-[20px]">
          <div className="flex flex-col gap-[20px]">
            <h2 className="text-h1 leading-[1.2] font-light whitespace-pre-line">{data.title}</h2>
            <p className="text-[16px] leading-[24px] whitespace-pre-line">{data.text}</p>
          </div>
          {data.cta.label && (
            <Button variant="m-red" href={data.cta.href} className="self-start">
              {data.cta.label}
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}

// "CTA Kontakt" — full-width photo, 640px glass panel with address, phone, e-mail and a button.
export function ContactCta({ data, settings }: { data: AboutContent["contact"]; settings: SettingsContent }) {
  return (
    <section className="relative mt-[151px] overflow-hidden bg-rotenso-grey py-[150px]">
      <FramedImage src={data.background} sizes="100vw" />
      <div className="relative mx-auto w-[1300px] max-w-[calc(100%-32px)]">
        <div className="flex w-[640px] flex-col gap-[30px] rounded-[32px] bg-black/50 p-[30px] text-white backdrop-blur-[20px]">
          <div className="flex flex-col gap-[10px] font-light">
            <h2 className="text-[calc(65px*var(--heading-scale))] leading-[1.2]">{data.title}</h2>
            <p className="text-h3 leading-[1.36]">{data.text}</p>
          </div>
          <div className="flex gap-[80px] text-[16px] leading-[24px]">
            <p className="flex gap-[10px]">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden className="shrink-0">
                <path d="M3 10.5L12 3L21 10.5V20C21 20.55 20.55 21 20 21H15V15H9V21H4C3.45 21 3 20.55 3 20V10.5Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
              </svg>
              <span className="whitespace-pre-line">{data.address}</span>
            </p>
            <div className="flex flex-col gap-[10px]">
              <a href={`tel:${settings.phone.replace(/\s/g, "")}`} className="flex items-center gap-[10px] hover:text-rotenso-red">
                <Icon name="foot-phone" width={24} height={24} />
                {settings.phone}
              </a>
              <a href={`mailto:${settings.email}`} className="flex items-center gap-[10px] hover:text-rotenso-red">
                <Icon name="foot-mail" width={24} height={24} />
                {settings.email}
              </a>
            </div>
          </div>
          {data.cta.label && (
            <Button variant="l-red" href={data.cta.href} className="self-start">
              {data.cta.label}
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}

export { Heading };
