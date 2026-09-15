"use client";

import { useEffect, useState } from "react";
import { Sparkles, Heart } from "lucide-react";

export default function LoadingCurtain() {
  const [isOpen, setIsOpen] = useState(false);
  const [removed, setRemoved] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
    setTimeout(() => {
      setRemoved(true);
    }, 900);
  };

  useEffect(() => {
    // Auto trigger smooth open after 2.5s if not opened manually
    const timer = setTimeout(() => {
      if (!isOpen) handleOpen();
    }, 2800);
    return () => clearTimeout(timer);
  }, [isOpen]);

  if (removed) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-background transition-all duration-1000 ${
        isOpen ? "opacity-0 pointer-events-none scale-105" : "opacity-100"
      }`}
    >
      <div className="text-center space-y-6 px-4 animate-in fade-in zoom-in duration-700">
        {/* Monogram Seal */}
        <div className="relative mx-auto w-24 h-24 rounded-full bg-gold-gradient text-white flex items-center justify-center wax-seal shadow-2xl animate-pulse">
          <span className="font-serif font-bold text-2xl tracking-widest">
            M&A
          </span>
        </div>

        <div className="space-y-2">
          <p className="font-script text-3xl text-rose-500">The Wedding of</p>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-foreground tracking-tight">
            Mibin & Aswathi
          </h1>
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
            28th December 2026 • Koodaranji
          </p>
        </div>

        <button
          onClick={handleOpen}
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-primary text-primary-foreground font-semibold text-xs uppercase tracking-widest shadow-xl hover:scale-105 transition-all"
        >
          <Sparkles className="w-4 h-4" />
          <span>Open Digital Invitation</span>
        </button>
      </div>
    </div>
  );
}
