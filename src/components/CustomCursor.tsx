"use client";

import { useEffect, useState } from "react";

interface Sparkle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
}

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [trailing, setTrailing] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);

  useEffect(() => {
    let animId: number;

    const onMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);

      // Create subtle trailing sparkle occasionally
      if (Math.random() < 0.25) {
        const colors = ["#d4af37", "#f4acb7", "#e07a5f", "#ffffff"];
        const newSparkle: Sparkle = {
          id: Date.now() + Math.random(),
          x: e.clientX + (Math.random() * 12 - 6),
          y: e.clientY + (Math.random() * 12 - 6),
          size: Math.random() * 6 + 3,
          color: colors[Math.floor(Math.random() * colors.length)],
        };
        setSparkles((prev) => [...prev.slice(-12), newSparkle]);
      }
    };

    const updateTrailing = () => {
      setTrailing((prev) => ({
        x: prev.x + (position.x - prev.x) * 0.18,
        y: prev.y + (position.y - prev.y) * 0.18,
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
      {/* Trailing Sparkle Dust */}
      {sparkles.map((sp) => (
        <div
          key={sp.id}
          className="absolute rounded-full animate-ping opacity-60"
          style={{
            left: `${sp.x}px`,
            top: `${sp.y}px`,
            width: `${sp.size}px`,
            height: `${sp.size}px`,
            backgroundColor: sp.color,
            boxShadow: `0 0 8px ${sp.color}`,
          }}
        />
      ))}

      {/* Outer Smooth Trailing Halo Ring */}
      <div
        className={`absolute rounded-full border border-amber-400/60 transition-transform duration-200 -translate-x-1/2 -translate-y-1/2 ${
          isHovered ? "scale-150 border-rose-400 bg-rose-300/10" : "scale-100"
        }`}
        style={{
          left: `${trailing.x}px`,
          top: `${trailing.y}px`,
          width: "36px",
          height: "36px",
          boxShadow: "0 0 15px rgba(212, 175, 55, 0.25)",
        }}
      />

      {/* Inner Glowing Golden Core Dot */}
      <div
        className={`absolute rounded-full bg-gold-gradient shadow-md -translate-x-1/2 -translate-y-1/2 transition-transform duration-150 ${
          isHovered ? "scale-125 bg-rose-500" : "scale-100"
        }`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          width: "10px",
          height: "10px",
          boxShadow: "0 0 10px rgba(212, 175, 55, 0.8)",
        }}
      />
    </div>
  );
}
