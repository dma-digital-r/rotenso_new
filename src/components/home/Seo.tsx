import { FramedImage } from "@/components/ui/FramedImage";
import type { HomeContent } from "@/lib/content";

// Figma: "SEO" (5172:70327) — full-screen photo, glass panel 530 wide, vertically centred
// (226 + 628/2 = 540 on the 1080px frame).
export function Seo({ seo }: { seo: HomeContent["seo"] }) {
  return (
    <section className="relative mt-[100px] h-svh min-h-[700px] overflow-hidden">
      <FramedImage src={seo.background} sizes="100vw" />
      <div className="relative mx-auto h-full w-[1300px] max-w-[calc(100%-32px)]">
        <div className="absolute top-1/2 left-0 flex w-[530px] -translate-y-1/2 flex-col gap-[20px] rounded-[32px] bg-black/50 px-[30px] pt-[30px] pb-[50px] text-white backdrop-blur-[20px]">
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
