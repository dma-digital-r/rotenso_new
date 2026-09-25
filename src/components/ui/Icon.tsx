/* eslint-disable @next/next/no-img-element -- SVG icons exported from Figma, served as-is */

type Props = {
  name: string;
  width: number;
  height: number;
  className?: string;
  alt?: string;
};

// Renders an SVG from /public/icons at the exact size used in Figma.
export function Icon({ name, width, height, className = "", alt = "" }: Props) {
  return (
    <img
      src={`/icons/${name}.svg`}
      width={width}
      height={height}
      alt={alt}
      aria-hidden={alt ? undefined : true}
      className={`block shrink-0 ${className}`}
    />
  );
}
