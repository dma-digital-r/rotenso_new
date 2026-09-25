// Reserves the exact footprint of a Figma section whose data could not be fetched yet
// (Figma MCP limit reached). See docs/HOME_STATUS.md.
export function PendingSection({
  label,
  height,
  className = "",
  fullBleed = false,
}: {
  label: string;
  height: number;
  className?: string;
  fullBleed?: boolean;
}) {
  return (
    <section
      className={`relative flex items-center justify-center ${fullBleed ? "" : "mx-auto w-[1300px] max-w-[calc(100%-32px)]"} ${className}`}
      style={{ height }}
    >
      <div className="absolute inset-4 rounded-[32px] border-2 border-dashed border-rotenso-grey-light/60" />
      <p className="relative text-[16px] text-rotenso-grey-light">{label}</p>
    </section>
  );
}
