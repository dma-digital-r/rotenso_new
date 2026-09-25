import { FramedImage } from "@/components/ui/FramedImage";
import type { SettingsContent } from "@/lib/content";

// Figma: "Split vs Multi Split" (5172:81669) — shared on split products.
// Title, then two 900-wide boxes (image 900×506, text below) 50px from the page edges.
export function SplitVsMulti({ data }: { data: SettingsContent["splitVsMulti"] }) {
  return (
    <section className="mt-[150px] px-[50px] text-rotenso-grey">
      <h2 className="text-center text-h1 leading-[1.2] font-light">{data.title}</h2>
      <div className="mt-[50px] grid grid-cols-2 gap-[20px]">
        {[data.split, data.multi].map((box) => (
          <div key={box.title}>
            <div className="relative aspect-[900/506] overflow-hidden rounded-[32px] bg-[#c4c4c4]">
              <FramedImage src={box.image} sizes="50vw" />
            </div>
            <div className="flex flex-col gap-[20px] px-[30px] pt-[20px] pb-[30px]">
              <h3 className="text-h2 leading-[1.2] font-light">{box.title}</h3>
              <p className="text-[16px] leading-[24px]">{box.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
