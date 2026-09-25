import { Button } from "@/components/ui/Button";
import { FramedImage } from "@/components/ui/FramedImage";
import type { HomeContent } from "@/lib/content";

// Figma: "Systemy RVF" (5172:70571) — photo 1190×700 at x+110, grey panel 420 wide at y+106.
export function Rvf({ rvf }: { rvf: HomeContent["rvf"] }) {
  return (
    <section className="relative mx-auto mt-[150px] h-[700px] w-[1300px] max-w-[calc(100%-32px)]">
      <div className="absolute top-0 right-0 left-[110px] h-[700px] overflow-hidden rounded-[32px]">
        <FramedImage src={rvf.image} sizes="1190px" />
      </div>
      <div className="absolute top-[106px] left-0 flex w-[420px] flex-col items-start justify-center gap-[30px] rounded-[32px] bg-rotenso-grey px-[30px] pt-[30px] pb-[50px] backdrop-blur-[15px]">
        <div className="flex w-full flex-col gap-[20px] text-white">
          <h2 className="text-[72px] leading-[1.2] font-light">{rvf.title}</h2>
          <p className="text-[16px] leading-[24px]">{rvf.text}</p>
        </div>
        <Button variant="m-red" href={rvf.cta.href}>
          {rvf.cta.label}
        </Button>
      </div>
    </section>
  );
}
