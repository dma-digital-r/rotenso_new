import { FramedImage, MissingMedia } from "@/components/ui/FramedImage";
import type { HomeContent } from "@/lib/content";

// Figma: "Idea" (5172:70623) — full-bleed 1920×1080 photo with a centred-left glass panel.
export function Idea({ idea }: { idea: HomeContent["idea"] }) {
  return (
    <section className="relative mt-[50px] h-[1080px] overflow-hidden">
      {idea.background ? (
        <FramedImage src={idea.background} sizes="100vw" />
      ) : (
        <MissingMedia label="Brak tła — dodaj zdjęcie w panelu" />
      )}
      <div className="relative mx-auto h-full w-[1300px] max-w-[calc(100%-32px)]">
        <div className="absolute top-[250px] left-0 flex w-[530px] flex-col items-center gap-[20px] rounded-[32px] bg-black/50 px-[40px] py-[50px] text-center text-white backdrop-blur-[10px]">
          <h2 className="w-full text-[40px] leading-[1.2] font-light">{idea.title}</h2>
          <p className="w-full text-[16px] leading-[24px]">{idea.text}</p>
        </div>
      </div>
    </section>
  );
}
