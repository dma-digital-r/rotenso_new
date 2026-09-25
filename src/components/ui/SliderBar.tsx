import { Icon } from "./Icon";

type Props = {
  /** Thumb offset as a 0–1 fraction of the free track. */
  progress: number;
  thumbWidth: number;
  trackColor?: string;
  onPrev: () => void;
  onNext: () => void;
  prevDisabled?: boolean;
  nextDisabled?: boolean;
};

// "slider" group from Figma: 1190px line + red thumb, then two 30px arrows (gap 20 / 50 from line).
export function SliderBar({
  progress,
  thumbWidth,
  trackColor = "#dddddd",
  onPrev,
  onNext,
  prevDisabled,
  nextDisabled,
}: Props) {
  const free = 1190 - thumbWidth;
  return (
    <div className="flex h-[30px] w-[1300px] max-w-full items-center">
      <div className="relative h-[4px] w-[1190px] shrink">
        <div
          className="absolute top-[1px] h-[2px] w-full rounded-[2px]"
          style={{ backgroundColor: trackColor }}
        />
        <div
          className="absolute top-0 h-[4px] rounded-[3px] bg-rotenso-red transition-[left] duration-500"
          style={{ width: thumbWidth, left: Math.max(0, Math.min(1, progress)) * free }}
        />
      </div>
      <button
        type="button"
        aria-label="Poprzedni"
        onClick={onPrev}
        disabled={prevDisabled}
        className="ml-[30px] cursor-pointer disabled:cursor-default disabled:opacity-40"
      >
        <Icon name="arrow-g2-left" width={30} height={30} />
      </button>
      <button
        type="button"
        aria-label="Następny"
        onClick={onNext}
        disabled={nextDisabled}
        className="ml-[20px] cursor-pointer disabled:cursor-default disabled:opacity-40"
      >
        <Icon name="arrow-g2-right" width={30} height={30} />
      </button>
    </div>
  );
}
