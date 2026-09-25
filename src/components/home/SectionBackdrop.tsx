// Rectangle 7 / 32 / 33 in Figma: a diagonal #CCCCCC → white → #CCCCCC gradient.
// Angles and stops are converted from the Figma gradient transform for each height,
// so the diagonal matches the design exactly at 1920px.
const variants = {
  880: "linear-gradient(140.64deg, #cccccc 10.43%, #ffffff 50.03%, #cccccc 89.64%)",
  1156: "linear-gradient(132.86deg, #cccccc 10.43%, #ffffff 50.03%, #cccccc 89.64%)",
  1427: "linear-gradient(126.93deg, #cccccc 10.43%, #ffffff 50.03%, #cccccc 89.64%)",
} as const;

export function SectionBackdrop({ top, height }: { top: number; height: keyof typeof variants }) {
  return (
    <div
      aria-hidden
      className="absolute inset-x-0 -z-10"
      style={{ top, height, backgroundImage: variants[height] }}
    />
  );
}
