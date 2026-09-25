import { FramedImage } from "@/components/ui/FramedImage";
import type { HomeContent } from "@/lib/content";

// Figma: "SEO" (5172:70327) — 1920×1080 photo, glass panel 530 wide at (310, 226).
export function Seo({ seo }: { seo: HomeContent["seo"] }) {
  return (
    <section className="relative mt-[100px] h-[1080px] overflow-hidden">
      <FramedImage src={seo.background} sizes="100vw" />
      <div className="relative mx-auto h-full w-[1300px] max-w-[calc(100%-32px)]">
        <div className="absolute top-[226px] left-0 flex w-[530px] flex-col gap-[20px] rounded-[32px] bg-black/50 px-[30px] pt-[30px] pb-[50px] text-white backdrop-blur-[20px]">
          <div className="flex flex-col gap-[10px] font-light">
            <h2 className="text-h1 leading-[1.2]">{seo.title}</h2>
            <p className="text-h2 leading-[1.2]">{seo.subtitle}</p>
          </div>
          <p className="text-[16px] leading-[24px] whitespace-pre-line">{seo.text}</p>
        </div>
      </div>
    </section>
  );
}
