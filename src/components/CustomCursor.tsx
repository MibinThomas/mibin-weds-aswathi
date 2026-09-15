"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";

interface HeartSparkle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  rotation: number;
}

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [trailing, setTrailing] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [sparkles, setSparkles] = useState<HeartSparkle[]>([]);

  useEffect(() => {
    let animId: number;

    const onMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);

      // Create trailing romantic heart sparkles occasionally
      if (Math.random() < 0.3) {
        const colors = ["#f4acb7", "#e07a5f", "#d4af37", "#6b2d3e", "#e88c74"];
        const newSparkle: HeartSparkle = {
          id: Date.now() + Math.random(),
          x: e.clientX + (Math.random() * 16 - 8),
          y: e.clientY + (Math.random() * 16 - 8),
          size: Math.random() * 10 + 10,
          color: colors[Math.floor(Math.random() * colors.length)],
          rotation: Math.random() * 60 - 30,
        };
        setSparkles((prev) => [...prev.slice(-14), newSparkle]);
      }
    };

    const updateTrailing = () => {
      setTrailing((prev) => ({
        x: prev.x + (position.x - prev.x) * 0.16,
        y: prev.y + (position.y - prev.y) * 0.16,
      }));
      animId = requestAnimationFrame(updateTrailing);
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "BUTTON" ||
        target.tagName === "A" ||
        target.closest("button") ||
        target.closest("a") ||
        target.getAttribute("role") === "button"
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    const onMouseLeave = () => setIsVisible(false);

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseover", onMouseOver);
    document.addEventListener("mouseleave", onMouseLeave);
    animId = requestAnimationFrame(updateTrailing);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseover", onMouseOver);
      document.removeEventListener("mouseleave", onMouseLeave);
      cancelAnimationFrame(animId);
    };
  }, [position, isVisible]);

  if (!isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden hidden md:block">
      {/* Trailing Heart Dust */}
      {sparkles.map((sp) => (
        <div
          key={sp.id}
          className="absolute animate-ping opacity-60 transition-opacity duration-500"
          style={{
            left: `${sp.x}px`,
            top: `${sp.y}px`,
            transform: `translate(-50%, -50%) rotate(${sp.rotation}deg)`,
          }}
        >
          <Heart
            className="filter drop-shadow-sm"
            style={{
              width: `${sp.size}px`,
              height: `${sp.size}px`,
              fill: sp.color,
              color: sp.color,
            }}
          />
        </div>
      ))}

      {/* Outer Smooth Trailing Heart Halo */}
      <div
        className={`absolute transition-transform duration-200 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center ${
          isHovered ? "scale-150 opacity-90" : "scale-100 opacity-60"
        }`}
        style={{
          left: `${trailing.x}px`,
          top: `${trailing.y}px`,
        }}
      >
        <div className="w-10 h-10 rounded-full border border-amber-400/50 bg-amber-300/10 flex items-center justify-center shadow-lg backdrop-blur-[1px]">
          <Heart className="w-6 h-6 text-rose-400/60" />
        </div>
      </div>

      {/* Primary Heart Cursor Pointer */}
      <div
        className={`absolute -translate-x-1/2 -translate-y-1/2 transition-transform duration-150 ${
          isHovered ? "scale-125 rotate-12" : "scale-100"
        }`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
        }}
      >
        <Heart className="w-5 h-5 fill-rose-500 text-amber-300 filter drop-shadow-[0_2px_8px_rgba(224,122,95,0.8)]" />
      </div>
    </div>
  );
}
