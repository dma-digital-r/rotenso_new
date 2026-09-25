"use client";

import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { FramedImage } from "@/components/ui/FramedImage";
import { Icon } from "@/components/ui/Icon";
import type { Ui } from "@/i18n/ui";
import type { HomeContent } from "@/lib/content";

type Slide = HomeContent["acHome"];

const PRODUCT_MS = 6000;
// Track inset: 50px before the active slide; the other slide peeks 160px after a 50px gap.
const EDGE = 50;

// Figma: "Klimatyzacje Dom" (5172:70638) + "Klimatyzacje Firma" (5172:70635).
// Two 1660×880 slides side by side; the switch link slides the whole track so the
// other slide comes in and the first one peeks 160px from the opposite edge.
export function AcSlider({ home, business, ui }: { home: Slide; business: Slide; ui: Ui }) {
  const [active, setActive] = useState<0 | 1>(0);

  return (
    <section className="relative -mt-[200px] h-[880px] overflow-hidden" aria-roledescription="carousel">
      <div
        className="flex h-full gap-[50px] transition-transform duration-700 ease-in-out"
        style={{
          paddingLeft: EDGE,
          // Slide width = section − 260px. Shifting by (section − 370px) puts the second
          // slide at x = 210 and leaves the first one peeking 160px on the left.
          transform: active === 0 ? "translateX(0)" : "translateX(calc(-100% + 370px))",
        }}
      >
        <AcPanel
          slide={home}
          topGradient={0.5}
          bottomGradient
          current={active === 0}
          onSwitch={() => setActive(1)}
          switchDir="right"
          ui={ui}
        />
        <AcPanel
          slide={business}
          topGradient={0.8}
          current={active === 1}
          onSwitch={() => setActive(0)}
          switchDir="left"
          ui={ui}
        />
      </div>
    </section>
  );
}

function AcPanel({
  slide,
  topGradient,
  bottomGradient = false,
  current,
  onSwitch,
  switchDir,
  ui,
}: {
  slide: Slide;
  topGradient: number;
  bottomGradient?: boolean;
  current: boolean;
  onSwitch: () => void;
  switchDir: "left" | "right";
  ui: Ui;
}) {
  const [index, setIndex] = useState(0);
  const [hover, setHover] = useState(false);
  const products = slide.products;
  const product = products[index];
  const count = products.length;
  const go = (i: number) => count && setIndex((i + count) % count);

  return (
    <div
      className="relative h-[880px] w-[calc(100%-210px)] shrink-0 overflow-hidden rounded-[32px]"
      aria-hidden={!current}
      inert={!current}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <FramedImage src={slide.background} crop={slide.backgroundCrop} sizes="90vw" />
      <div
        className="absolute inset-x-0 top-0 h-[30.11%] rounded-t-[32px] bg-gradient-to-b from-black to-transparent to-[93.585%]"
        style={{ opacity: topGradient }}
      />
      {bottomGradient && (
        <div className="absolute inset-x-0 bottom-0 h-[30.11%] rounded-b-[32px] bg-gradient-to-t from-black to-transparent to-[93.585%] opacity-50" />
      )}

      <h2 className="absolute top-[70px] left-[9.1%] text-[72px] leading-[1.2] font-light whitespace-nowrap text-white">
        {slide.title}
      </h2>

      <button
        type="button"
        onClick={onSwitch}
        className="absolute top-[100px] right-[6.02%] flex cursor-pointer items-center gap-[15px] text-[25px] leading-[normal] font-light whitespace-nowrap text-white"
      >
        {switchDir === "left" && <Icon name="arrow-w2-left" width={30} height={30} />}
        {slide.switchLabel}
        {switchDir === "right" && <Icon name="arrow-w2-right" width={30} height={30} />}
      </button>

      {product && (
        <div className="absolute top-[285px] left-[9.04%] flex w-[310px] flex-col items-start gap-[30px] rounded-[32px] bg-black/50 p-[30px] text-white backdrop-blur-[10px]">
          <div className="flex w-full flex-col gap-[20px]">
            <div className="flex w-full flex-col font-light">
              <p className="text-[40px] leading-[1.2]">{product.name}</p>
              {product.subtitle && <p className="text-[25px] leading-[normal]">{product.subtitle}</p>}
            </div>
            {product.text && <p className="text-[16px] leading-[24px]">{product.text}</p>}
            {product.price && <p className="text-[25px] leading-[normal] font-light">{product.price}</p>}
          </div>
          <Button variant="m-red" href={product.cta.href}>
            {product.cta.label}
          </Button>
        </div>
      )}

      {/* Bottom row, y 720: arrow · 6 product tiles · arrow · configurator tile (100px side insets). */}
      <div className="absolute inset-x-[6.02%] top-[720px] flex h-[110px] items-center">
        {count > 1 && (
          <button type="button" aria-label={ui.prevModel} onClick={() => go(index - 1)} className="shrink-0 cursor-pointer">
            <Icon name="arrow-w3-left" width={30} height={30} />
          </button>
        )}
        <div className="mx-[21px] flex min-w-0 flex-1 justify-center">
          <div className="flex gap-[20px] overflow-x-auto scrollbar-none">
            {products.map((p, i) => (
              <button
                key={p.name}
                type="button"
                onClick={() => setIndex(i)}
                className={`relative flex h-[110px] w-[173px] shrink-0 cursor-pointer flex-col items-center gap-[15px] overflow-clip rounded-[8px] px-[10px] pt-[20px] backdrop-blur-[10px] ${
                  i === index ? "border border-white/30 bg-white/15" : "bg-white/5"
                }`}
              >
                <span className="relative h-[40px] w-[100px] shrink-0">
                  {p.thumb && <Image src={p.thumb} alt="" fill sizes="100px" className="object-contain" />}
                </span>
                <span className="w-[153px] truncate text-center text-[14px] leading-[24px] text-white">{p.name}</span>
                {i === index && current && (
                  <span className="absolute bottom-[-0.92px] left-[-1px] h-[2.92px] w-[173px] overflow-hidden">
                    <span
                      key={index}
                      className="hero-progress absolute inset-y-0 left-0 bg-rotenso-red"
                      style={{
                        animationDuration: `${PRODUCT_MS}ms`,
                        animationPlayState: hover ? "paused" : "running",
                      }}
                      onAnimationEnd={() => go(index + 1)}
                    />
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
        {count > 1 && (
          <button type="button" aria-label={ui.nextModel} onClick={() => go(index + 1)} className="shrink-0 cursor-pointer">
            <Icon name="arrow-w3-right" width={30} height={30} />
          </button>
        )}
        <a
          href={slide.configurator.href}
          className="ml-[20px] flex h-[110px] w-[200px] shrink-0 flex-col items-center justify-center gap-[15px] rounded-[8px] px-[20px] text-white backdrop-blur-[10px]"
          style={{
            backgroundImage:
              "linear-gradient(118.81deg, rgba(84, 102, 112, 0.8) 0%, rgba(26, 35, 40, 0.8) 100%)",
          }}
        >
          <span className="text-trim w-full text-[14px] leading-[normal]">{slide.configurator.question}</span>
          <span className="flex w-full items-center gap-[10px]">
            <span className="text-trim flex-1 text-[14px] leading-[1.2] font-bold whitespace-pre-line">
              {slide.configurator.cta}
            </span>
            <span className="relative h-[24px] w-[35px] shrink-0">
              <span className="absolute inset-[-0.83%_-0.57%]">
                <Icon name="ico-klimatyzacja" width={35} height={24} className="size-full" />
              </span>
            </span>
          </span>
        </a>
      </div>
    </div>
  );
}
