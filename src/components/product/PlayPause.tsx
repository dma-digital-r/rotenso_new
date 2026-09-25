import type { Ui } from "@/i18n/ui";

// "ico_pause_white" (40px, 50% opacity); shows a play triangle while paused.
export function PlayPause({
  paused,
  onToggle,
  ui,
  className = "",
}: {
  paused: boolean;
  onToggle: () => void;
  ui: Ui;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
      aria-label={paused ? ui.play : ui.pause}
      className={`z-10 size-[40px] cursor-pointer opacity-50 transition-opacity hover:opacity-100 ${className}`}
    >
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden>
        <circle cx="20" cy="20" r="19" stroke="white" strokeWidth="2" />
        {paused ? (
          <path d="M16 13L27 20L16 27Z" fill="white" stroke="white" strokeWidth="2" strokeLinejoin="round" />
        ) : (
          <path d="M15.5 13V27M24.5 13V27" stroke="white" strokeWidth="4" strokeLinecap="round" />
        )}
      </svg>
    </button>
  );
}
