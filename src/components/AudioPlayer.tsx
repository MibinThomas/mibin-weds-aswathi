"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX, Music } from "lucide-react";

export default function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(true);
  const audioContextRef = useRef<AudioContext | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Web Audio Synthesizer for soft romantic ambient chords
  const startSynthMusic = () => {
    if (audioContextRef.current) {
      if (audioContextRef.current.state === "suspended") {
        audioContextRef.current.resume().catch(() => {});
      }
      return;
    }

    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      const ctx = new AudioCtx();
      audioContextRef.current = ctx;

      // Pentatonic / Major romantic chord notes (frequencies in Hz)
      const scale = [261.63, 329.63, 392.00, 493.88, 523.25, 659.25, 783.99]; // C4, E4, G4, B4, C5, E5, G5
      let noteIndex = 0;

      const playNextNote = () => {
        if (!audioContextRef.current || audioContextRef.current.state === "closed")
          return;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        const freq = scale[noteIndex % scale.length];
        noteIndex =
          (noteIndex + Math.floor(Math.random() * 3 + 1)) % scale.length;

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        // Soft envelope
        gain.gain.setValueAtTime(0.001, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 0.3);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 2.5);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 2.6);
      };

      playNextNote();
      intervalRef.current = setInterval(playNextNote, 1200);
    } catch {
      console.warn("Audio Context not supported");
    }
  };

  const stopSynthMusic = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
  };

  const toggleAudio = () => {
    if (isPlaying) {
      stopSynthMusic();
      setIsPlaying(false);
    } else {
      startSynthMusic();
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    // Attempt auto-start on mount
    startSynthMusic();

    // Browser autoplay policy handler: resume on any initial user gesture
    const handleFirstGesture = () => {
      if (audioContextRef.current && audioContextRef.current.state === "suspended") {
        audioContextRef.current.resume().catch(() => {});
      } else if (!audioContextRef.current && isPlaying) {
        startSynthMusic();
      }
    };

    window.addEventListener("click", handleFirstGesture, { once: true });
    window.addEventListener("touchstart", handleFirstGesture, { once: true });
    window.addEventListener("keydown", handleFirstGesture, { once: true });

    return () => {
      window.removeEventListener("click", handleFirstGesture);
      window.removeEventListener("touchstart", handleFirstGesture);
      window.removeEventListener("keydown", handleFirstGesture);
      stopSynthMusic();
    };
  }, []);

  return (
    <div className="fixed bottom-6 left-6 z-40">
      <button
        onClick={toggleAudio}
        aria-label={isPlaying ? "Mute ambient music" : "Play ambient music"}
        className={`group flex items-center gap-3 px-4 py-2.5 rounded-full glass border border-amber-300/40 shadow-lg transition-all duration-300 hover:scale-105 ${
          isPlaying
            ? "bg-amber-100/40 text-amber-900 border-amber-400"
            : "text-foreground opacity-80 hover:opacity-100"
        }`}
      >
        <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary">
          {isPlaying ? (
            <Volume2 className="w-4 h-4 text-amber-700 animate-pulse" />
          ) : (
            <VolumeX className="w-4 h-4 opacity-70" />
          )}
        </div>

        <div className="flex flex-col text-left">
          <span className="text-xs font-semibold tracking-wider uppercase flex items-center gap-1.5">
            <Music className="w-3 h-3 text-primary" />
            {isPlaying ? "Playing Music" : "Ambient Music"}
          </span>
          <span className="text-[10px] text-muted-foreground">
            {isPlaying ? "Click to mute" : "Click to play"}
          </span>
        </div>

        {isPlaying && (
          <div className="flex items-end gap-0.5 h-3 ml-1">
            <span className="w-0.5 bg-amber-600 rounded-full animate-[bounce_1s_infinite_100ms] h-full" />
            <span className="w-0.5 bg-amber-600 rounded-full animate-[bounce_1s_infinite_300ms] h-2" />
            <span className="w-0.5 bg-amber-600 rounded-full animate-[bounce_1s_infinite_200ms] h-3" />
          </div>
        )}
      </button>
    </div>
  );
}
