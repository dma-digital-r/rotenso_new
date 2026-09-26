"use client";

import { useEffect, useRef } from "react";
import { FramedImage } from "./FramedImage";

type Props = {
  image: string | null;
  /** MP4 address (e.g. from Bunny). Without it the image is shown. */
  video?: string | null;
  sizes: string;
  /** The film plays only while true (off-screen slides and the pause button stop it). */
  playing?: boolean;
  /** Loop the film. Sliders turn this off and move on when the film ends. */
  loop?: boolean;
  onProgress?: (fraction: number) => void;
  onEnded?: () => void;
  preload?: boolean;
  className?: string;
};

// A tile's picture: a muted, inline, autoplaying film when one is set (the photo is its poster),
// otherwise the photo. In Figma a pause icon on a picture means "this is an animation".
export function Media({ image, video, sizes, playing = true, loop = true, onProgress, onEnded, preload, className = "" }: Props) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (playing) v.play().catch(() => {});
    else v.pause();
  }, [playing, video]);

  if (!video) return <FramedImage src={image} sizes={sizes} preload={preload} className={className} />;
  return (
    <video
      ref={ref}
      src={video}
      poster={image ?? undefined}
      muted
      playsInline
      autoPlay={playing}
      loop={loop}
      preload={preload ? "auto" : "metadata"}
      onTimeUpdate={(e) => onProgress?.(e.currentTarget.duration ? e.currentTarget.currentTime / e.currentTarget.duration : 0)}
      onEnded={onEnded}
      className={`pointer-events-none absolute inset-0 size-full object-cover ${className}`}
    />
  );
}

/**
 * Red timer along the bottom of a slide: follows the film when the slide has one, otherwise a
 * CSS countdown of `ms`. Calls onDone when it reaches the end.
 */
export function SlideTimer({ ms, film, progress, paused, onDone, slideKey }: { ms: number; film: boolean; progress: number; paused: boolean; onDone: () => void; slideKey: string | number }) {
  return (
    <span className="absolute inset-x-0 bottom-0 h-[5px]">
      {film ? (
        <span className="absolute inset-y-0 left-0 bg-rotenso-red" style={{ width: `${Math.min(1, progress) * 100}%` }} />
      ) : (
        <span
          key={slideKey}
          className="hero-progress absolute inset-y-0 left-0 bg-rotenso-red"
          style={{ animationDuration: `${ms}ms`, animationPlayState: paused ? "paused" : "running" }}
          onAnimationEnd={onDone}
        />
      )}
    </span>
  );
}
