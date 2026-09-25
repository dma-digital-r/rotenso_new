import Image from "next/image";

export type Crop = { x: number | null; y: number | null; w: number | null; h: number | null } | null;

type Props = {
  src: string | null;
  alt?: string;
  crop?: Crop;
  sizes: string;
  preload?: boolean;
  className?: string;
};

// Fills its (relative, overflow-hidden) parent. With a crop it reproduces the
// image transform from Figma (left/top/width/height in % of the frame);
// without one it behaves like object-fit: cover.
export function FramedImage({ src, alt = "", crop, sizes, preload, className = "" }: Props) {
  if (!src) return null;
  const hasCrop = crop && crop.w != null && crop.h != null;
  if (!hasCrop) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        preload={preload}
        className={`pointer-events-none object-cover ${className}`}
      />
    );
  }
  return (
    <Image
      src={src}
      alt={alt}
      width={1920}
      height={1080}
      sizes={sizes}
      preload={preload}
      className={`pointer-events-none absolute max-w-none ${className}`}
      style={{
        left: `${crop.x ?? 0}%`,
        top: `${crop.y ?? 0}%`,
        width: `${crop.w}%`,
        height: `${crop.h}%`,
      }}
    />
  );
}

// Stand-in for media that could not be exported from Figma yet (see docs/HOME_STATUS.md).
export function MissingMedia({ label, dark = true }: { label: string; dark?: boolean }) {
  return (
    <div
      className={`absolute inset-0 flex items-start justify-end px-8 pt-[120px] ${
        dark ? "bg-[linear-gradient(135deg,#8d9396_0%,#3a4044_100%)] text-white/60" : "bg-grey-f0 text-rotenso-grey/60"
      }`}
    >
      <span className="rounded-full border border-current px-4 py-1 text-[12px]">{label}</span>
    </div>
  );
}
