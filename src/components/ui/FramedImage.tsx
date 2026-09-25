import Image from "next/image";

export type Crop = { x: number | null; y: number | null; w: number | null; h: number | null } | null;

type Props = {
  src: string | null;
  alt?: string;
  crop?: Crop;
  sizes: string;
  preload?: boolean;
  className?: string;
  /**
   * "cover" (default): object-fit cover; a Figma crop only sets the anchor point, so the
   * framing matches the design at 1920px and the photo is trimmed — never squeezed — on
   * narrower screens. "exact": reproduces the Figma crop literally; only for fixed-size frames
   * (e.g. guide cards), where the crop may zoom in further than cover would.
   */
  fit?: "cover" | "exact";
};

const clamp = (v: number) => Math.min(100, Math.max(0, v));

// Figma crop (offset and size in % of the frame) → object-position of the same framing.
function anchor(crop: NonNullable<Crop>) {
  const w = crop.w ?? 100;
  const h = crop.h ?? 100;
  const x = w > 100 ? clamp((-(crop.x ?? 0) / (w - 100)) * 100) : 50;
  const y = h > 100 ? clamp((-(crop.y ?? 0) / (h - 100)) * 100) : 50;
  return `${x.toFixed(1)}% ${y.toFixed(1)}%`;
}

// Fills its (relative, overflow-hidden) parent.
export function FramedImage({ src, alt = "", crop, sizes, preload, className = "", fit = "cover" }: Props) {
  if (!src) return null;
  const hasCrop = crop && crop.w != null && crop.h != null;
  if (!hasCrop || fit === "cover") {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        preload={preload}
        className={`pointer-events-none object-cover ${className}`}
        style={hasCrop ? { objectPosition: anchor(crop) } : undefined}
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
