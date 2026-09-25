// Rectangle 7 / 32 / 33 in Figma: a diagonal #CCCCCC → white → #CCCCCC gradient.
// The Figma gradient transform (same handles on every such rectangle) converts to a CSS angle
// of 90° + atan(1073 / height) for a 1920px-wide box (checked against 880, 1156 and 1427px),
// so the diagonal matches the design at 1920px for any height.
export const diagonalGradient = (height: number, width = 1920) =>
  `linear-gradient(${(90 + (Math.atan((1073 * width) / 1920 / height) * 180) / Math.PI).toFixed(2)}deg, #cccccc 10.43%, #ffffff 50.03%, #cccccc 89.64%)`;

export function SectionBackdrop({ top, height }: { top: number; height: number }) {
  return (
    <div aria-hidden className="absolute inset-x-0 -z-10" style={{ top, height, backgroundImage: diagonalGradient(height) }} />
  );
}
