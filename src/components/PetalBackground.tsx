"use client";

import { useEffect, useState } from "react";

interface Petal {
  id: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
  rotation: number;
  color: string;
}

export default function PetalBackground() {
  const [petals, setPetals] = useState<Petal[]>([]);

  useEffect(() => {
    const colors = ["#f4acb7", "#e07a5f", "#f7ebd0", "#d4af37", "#fdf0ed"];
    const generatedPetals: Petal[] = Array.from({ length: 18 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: Math.random() * 14 + 10,
      duration: Math.random() * 10 + 12,
      delay: Math.random() * 10,
      rotation: Math.random() * 360,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
    setPetals(generatedPetals);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {petals.map((petal) => (
        <div
          key={petal.id}
          className="absolute animate-petal opacity-70"
          style={{
            left: `${petal.left}%`,
            width: `${petal.size}px`,
            height: `${petal.size * 1.4}px`,
            animationDuration: `${petal.duration}s`,
            animationDelay: `${petal.delay}s`,
          }}
        >
          <svg
            viewBox="0 0 30 40"
            fill="none"
            className="w-full h-full filter drop-shadow-sm"
            style={{ transform: `rotate(${petal.rotation}deg)` }}
          >
            <path
              d="M15 0 C25 10 30 25 15 40 C0 25 5 10 15 0 Z"
              fill={petal.color}
              opacity="0.6"
            />
          </svg>
        </div>
      ))}

      {/* Floating Bokeh Orbs */}
      <div className="absolute top-1/4 left-1/6 w-72 h-72 rounded-full bg-amber-200/20 blur-3xl pointer-events-none animate-glow" />
      <div className="absolute bottom-1/3 right-1/6 w-96 h-96 rounded-full bg-rose-300/15 blur-3xl pointer-events-none animate-glow" style={{ animationDelay: "2s" }} />
    </div>
  );
}
