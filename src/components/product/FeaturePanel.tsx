import Image from "next/image";
import { FramedImage } from "@/components/ui/FramedImage";
import type { ProductEntry } from "@/lib/products";

// Figma: "Cecha" (5172:81672) — 1030px photo, 530×720 glass panel (text at the bottom), the
// indoor unit on top of the panel and the warm airflow drawn over it in "screen" blend mode.
export function FeaturePanel({ feature }: { feature: ProductEntry["feature"] }) {
  return (
    <section id="cecha" className="relative h-[1030px] overflow-hidden bg-rotenso-grey">
      <FramedImage src={feature.background} sizes="100vw" />
      <div className="relative mx-auto h-full w-[1300px] max-w-[calc(100%-32px)]">
        <div className="absolute top-[155px] left-0 flex h-[720px] w-[530px] flex-col justify-end gap-[20px] rounded-[32px] bg-black/50 px-[30px] py-[50px] text-white backdrop-blur-[20px]">
          <div className="font-light">
            <p className="text-h3 leading-[1.36]">{feature.kicker}</p>
            <h2 className="text-h2 leading-[1.2] whitespace-pre-line">{feature.title}</h2>
          </div>
          <p className="text-[16px] leading-[24px] whitespace-pre-line">{feature.text}</p>
        </div>
        {feature.unitImage && (
          <Image
            src={feature.unitImage}
            alt=""
            width={530}
            height={220}
            sizes="530px"
            className="pointer-events-none absolute top-[197px] left-[42px] drop-shadow-[-20px_50px_25px_rgba(0,0,0,0.25)]"
          />
        )}
        {feature.airflow && (
          <Image
            src={feature.airflow}
            alt=""
            width={1399}
            height={787}
            sizes="1399px"
            className="pointer-events-none absolute top-[171px] left-[35px] max-w-none mix-blend-screen"
          />
        )}
      </div>
    </section>
  );
}
