"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";

const musicUrl = "/audio/celebration.wav";

export default function BackgroundMusic() {
  const pathname = usePathname();
  const musicEnabled = pathname === "/" || pathname === "/groom" || pathname === "/bride";
  const audioRef = useRef<HTMLAudioElement>(null);
  const userPaused = useRef(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    let frame = 0;
    const pageTurn = () => {
      const audio = audioRef.current;
      if (!audio || audio.paused || userPaused.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      cancelAnimationFrame(frame);
      const start = performance.now();
      const fade = (now: number) => {
        const progress = Math.min(1, (now - start) / 900);
        audio.volume = 0.25 - Math.sin(progress * Math.PI) * 0.07;
        if (progress < 1) frame = requestAnimationFrame(fade);
      };
      frame = requestAnimationFrame(fade);
    };
    window.addEventListener("invitation:page-turn", pageTurn);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("invitation:page-turn", pageTurn); };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.25;
    if (musicEnabled && !userPaused.current) {
      void audio.play().catch(() => {
        /* The play control remains available if autoplay is blocked. */
      });
    } else if (!musicEnabled) {
      audio.pause();
    }
  }, [musicEnabled]);

  useEffect(() => {
    // A page interaction can unlock audio when the browser blocks autoplay.
    const startOnGesture = (event: MouseEvent) => {
      if (userPaused.current) return;
      const target = event.target instanceof Element ? event.target : null;
      if (target?.closest(".background-music-toggle")) return;
      const href = target?.closest("a")?.getAttribute("href");
      if (
        (musicEnabled || href === "/" || href === "/groom" || href === "/bride") &&
        audioRef.current?.paused
      ) {
        audioRef.current.volume = 0.25;
        void audioRef.current.play().catch(() => {});
      }
    };
    document.addEventListener("click", startOnGesture, true);
    return () => document.removeEventListener("click", startOnGesture, true);
  }, [musicEnabled]);

  function toggleMusic() {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      userPaused.current = false;
      void audio.play().catch(() => {});
    } else {
      userPaused.current = true;
      audio.pause();
    }
  }

  return (
    <>
      <audio
        ref={audioRef}
        src={musicUrl}
        loop
        preload={musicEnabled ? "metadata" : "none"}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />
      {musicEnabled && (
        <button
          type="button"
          className="background-music-toggle"
          onClick={toggleMusic}
          aria-label={
            playing ? "Pause background music" : "Play background music"
          }
          title={playing ? "Pause background music" : "Play background music"}
          aria-pressed={playing}
        >
          {playing ? <Pause size={12} strokeWidth={1.4} aria-hidden="true" /> : <Play size={12} strokeWidth={1.4} aria-hidden="true" />}
        </button>
      )}
    </>
  );
}
