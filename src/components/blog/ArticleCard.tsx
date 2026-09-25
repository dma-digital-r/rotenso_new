import Link from "next/link";
import { FramedImage } from "@/components/ui/FramedImage";
import type { GuideSummary } from "@/lib/guides";

type Card = Pick<GuideSummary, "href" | "title" | "excerpt" | "image" | "label">;

// "Article box 2" (5172:77076): 310 wide — photo 310×174 (r16), label, 25px title (2 lines),
// 12px excerpt (3 lines). The whole card is the link.
export function ArticleBox({ g }: { g: Card }) {
  return (
    <Link href={g.href} className="group flex w-[310px] flex-col text-rotenso-grey">
      <span className="relative h-[174px] overflow-hidden rounded-[16px] bg-grey-dd">
        <FramedImage src={g.image} sizes="310px" className="transition-transform duration-500 group-hover:scale-105" />
      </span>
      <span className="flex flex-col gap-[10px] py-[20px]">
        <span className="flex flex-col">
          <span className="text-[12px] leading-[16.3px]">{g.label}</span>
          <span className="line-clamp-2 min-h-[68px] text-h3 leading-[34px] font-light transition-colors group-hover:text-rotenso-red">{g.title}</span>
        </span>
        <span className="line-clamp-3 text-[12px] leading-[16.3px]">{g.excerpt}</span>
      </span>
    </Link>
  );
}

// "Box 3C BG": 420 wide — photo 420×236 on top, white panel with label, title, 3-line excerpt
// and a small red "Przeczytaj" button.
export function ArticleBoxLarge({ g, readLabel }: { g: Card; readLabel: string }) {
  return (
    <Link href={g.href} className="group flex w-[420px] flex-col text-rotenso-grey shadow-dark-l">
      <span className="relative h-[236px] overflow-hidden rounded-t-[32px] bg-rotenso-grey">
        <FramedImage src={g.image} sizes="420px" className="transition-transform duration-500 group-hover:scale-105" />
      </span>
      <span className="flex flex-1 flex-col items-start gap-[10px] rounded-b-[32px] bg-white p-[30px]">
        <span className="flex flex-col">
          <span className="text-[12px] leading-[16.3px]">{g.label}</span>
          <span className="line-clamp-2 min-h-[68px] text-h3 leading-[34px] font-light">{g.title}</span>
        </span>
        <span className="line-clamp-3 text-[16px] leading-[24px]">{g.excerpt}</span>
        <span className="mt-auto inline-flex h-[29px] items-center rounded-[15px] bg-rotenso-red px-[15px] text-[12px] leading-[normal] font-bold text-white transition-opacity group-hover:opacity-85">
          <span className="text-trim">{readLabel}</span>
        </span>
      </span>
    </Link>
  );
}
