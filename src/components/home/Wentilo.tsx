"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { FramedImage, MissingMedia } from "@/components/ui/FramedImage";
import { Icon } from "@/components/ui/Icon";
import type { Ui } from "@/i18n/ui";
import type { HomeContent } from "@/lib/content";

// Figma: "Wentilo" (5172:70583) — 1820×880 box; text panel 420×540 + media 860×540 at y 236.
// The kingfisher ("Zimorodek", 437×437) overlaps the bottom-left corner into the next section.
export function Wentilo({ wentilo, ui }: { wentilo: HomeContent["wentilo"]; ui: Ui }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(282 / 860);

  const toggle = () => {
    const v = videoRef.current;
    if (!v) return setPaused((p) => !p);
    if (v.paused) {
      void v.play();
      setPaused(false);
    } else {
      v.pause();
      setPaused(true);
    }
  };

  return (
    <section className="relative mx-[50px] mt-[50px] h-[880px]">
      <div className="absolute inset-0 overflow-hidden rounded-[32px]">
        <FramedImage src={wentilo.background} sizes="100vw" />
      </div>

      <h2 className="relative pt-[100px] text-center text-[72px] leading-[1.2] font-light whitespace-nowrap text-white">
        {wentilo.title}
      </h2>

      <div className="relative mx-auto mt-[50px] flex w-[1300px] max-w-[calc(100%-32px)] gap-[20px]">
        <div className="flex h-[540px] w-[420px] shrink-0 flex-col justify-center rounded-[32px] bg-black/50 p-[30px] backdrop-blur-[10px]">
          <div className="flex w-full flex-col items-start gap-[30px]">
            <div className="flex w-full flex-col gap-[20px] text-white">
              <h3 className="text-[40px] leading-[1.2] font-light">{wentilo.productName}</h3>
              <p className="text-[16px] leading-[24px] whitespace-pre-line">{wentilo.text}</p>
            </div>
            <Button variant="m-red" href={wentilo.cta.href}>
              {wentilo.cta.label}
            </Button>
            <a
              href={wentilo.configurator.href}
              className="flex w-full items-center justify-center rounded-[8px] p-[20px] backdrop-blur-[10px]"
              style={{ backgroundImage: "linear-gradient(147.27deg, rgb(84, 102, 112) 0%, rgb(26, 35, 40) 100%)" }}
            >
              <span className="flex min-w-px flex-1 flex-col items-start justify-center gap-[10px] text-[14px] text-white">
                <span className="text-trim leading-[normal]">{wentilo.configurator.question}</span>
                <span className="text-trim leading-[1.2] font-bold">{wentilo.configurator.cta}</span>
              </span>
              <span className="relative h-[29px] w-[35px] shrink-0">
                <span className="absolute inset-[-0.69%_-0.57%]">
                  <Icon name="ico-rekuperator" width={35} height={29} className="size-full" />
                </span>
              </span>
            </a>
          </div>
        </div>

        <div className="relative h-[540px] w-[860px] min-w-0 shrink overflow-hidden rounded-[32px]">
          {wentilo.video ? (
            <video
              ref={videoRef}
              src={wentilo.video}
              poster={wentilo.media ?? undefined}
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 size-full object-cover"
              onTimeUpdate={(e) => {
                const v = e.currentTarget;
                if (v.duration) setProgress(v.currentTime / v.duration);
              }}
            />
          ) : wentilo.media ? (
            <FramedImage src={wentilo.media} sizes="860px" />
          ) : (
            <MissingMedia label="Brak zdjęcia lub wideo — dodaj w panelu" />
          )}
          <div className="absolute inset-x-0 bottom-0 h-[120px] bg-gradient-to-t from-black to-transparent" />
          <button
            type="button"
            onClick={toggle}
            aria-label={paused ? ui.play : ui.pause}
            aria-pressed={paused}
            className="absolute top-[470px] left-[790px] size-[40px] cursor-pointer"
          >
            <Icon name="pause-ring" width={40} height={40} className="absolute inset-0 size-full" />
            <span className="absolute inset-[32.5%_40%_31.25%_37.5%]">
              <span className="absolute inset-[-13.79%_-22.22%]">
                <Icon name="pause-bars" width={13} height={20} className="size-full" />
              </span>
            </span>
          </button>
          <div className="absolute bottom-0 left-0 h-[5px] bg-rotenso-red" style={{ width: `${progress * 100}%` }} />
        </div>
      </div>

      <Image
        src="/images/home/kingfisher.png"
        alt=""
        width={437}
        height={437}
        sizes="437px"
        className="pointer-events-none absolute top-[760px] left-[133px] z-10 size-[437px] object-cover"
      />
    </section>
  );
}
