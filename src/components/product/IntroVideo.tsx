import { FramedImage } from "@/components/ui/FramedImage";
import type { ProductEntry } from "@/lib/products";

// Figma: "Intro Video 180" (5172:81688) — 1080px band right under the hero (the product bar
// floats over its top). Photo or looping video, a grey fade into the next section at the bottom,
// centred title and text, "Poznaj model …" with a down arrow. Target of the "180°" tile.
export function IntroVideo({ intro }: { intro: ProductEntry["intro"] }) {
  return (
    <section id="intro-video" className="relative -mt-[70px] h-[1080px] scroll-mt-[85px] overflow-hidden text-center text-rotenso-grey">
      <div className="absolute inset-x-0 top-0 h-[1021px] bg-[#c4c6ca]">
        {intro.video ? (
          <video
            src={intro.video}
            poster={intro.image ?? undefined}
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 size-full object-cover object-bottom"
          />
        ) : (
          <FramedImage src={intro.image} sizes="100vw" className="object-bottom" />
        )}
      </div>
      {/* Rectangle 3459: #c4c6ca, solid over the lower 65%, fading out upwards. */}
      <div className="absolute inset-x-0 bottom-0 h-[181px] bg-[linear-gradient(to_top,#c4c6ca_65%,rgb(196_198_202/0))]" />

      <div className="absolute inset-x-0 top-[731px] flex flex-col items-center px-4">
        <h2 className="w-[1200px] max-w-full text-h1 leading-[1.2] font-light">{intro.title}</h2>
        <p className="mt-[30px] w-[859px] max-w-full text-h3 leading-[1.36] font-light">{intro.text}</p>
      </div>
      <a href="#cecha" className="absolute top-[965px] left-1/2 flex -translate-x-1/2 flex-col items-center gap-[10px] hover:opacity-80">
        <span className="text-[18px] leading-[24.5px] whitespace-nowrap">{intro.more}</span>
        <svg width="30" height="30" viewBox="0 0 30 30" fill="none" aria-hidden>
          <circle cx="15" cy="15" r="14" stroke="#546670" strokeWidth="2" />
          <path d="M15 10V21M11 17L15 21L19 17" stroke="#546670" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </a>
    </section>
  );
}
