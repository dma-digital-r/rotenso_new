"use client";

import Image from "next/image";
import { useRef, useState } from "react";

const PLAYBACK_RATE = 5;

const typeOf = (url: string) =>
  url.endsWith(".webm") ? "video/webm" : url.endsWith(".mov") ? "video/quicktime" : "video/mp4";

// Figma: "Zimorodek" (5172:70620), shown at 300×300, overlapping the Wentilo box into the next section.
// The animated version plays muted, looped and 5× faster. The still PNG stays visible until the
// video actually plays, so a missing or unsupported file never leaves a hole.
// For a transparent background browsers need: WebM VP9 with alpha (Chrome, Edge, Firefox) and
// MOV HEVC with alpha (Safari).
export function Kingfisher({ sources, className }: { sources: string[]; className: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const urls = sources.filter(Boolean);

  const speedUp = () => {
    const v = ref.current;
    if (!v) return;
    v.defaultPlaybackRate = PLAYBACK_RATE;
    v.playbackRate = PLAYBACK_RATE;
  };

  return (
    <div aria-hidden className={`pointer-events-none ${className}`}>
      <Image
        src="/images/home/kingfisher.png"
        alt=""
        fill
        sizes="300px"
        className={`object-cover transition-opacity duration-300 ${playing ? "opacity-0" : "opacity-100"}`}
      />
      {urls.length > 0 && (
        <video
          ref={ref}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onLoadedMetadata={speedUp}
          onPlaying={() => {
            speedUp();
            setPlaying(true);
          }}
          onError={() => setPlaying(false)}
          className={`absolute inset-0 size-full object-cover transition-opacity duration-300 ${
            playing ? "opacity-100" : "opacity-0"
          }`}
        >
          {urls.map((u) => (
            <source key={u} src={u} type={typeOf(u)} />
          ))}
        </video>
      )}
    </div>
  );
}
