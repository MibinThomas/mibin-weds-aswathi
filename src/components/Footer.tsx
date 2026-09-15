"use client";

import { Heart, ArrowUp } from "lucide-react";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="py-16 px-4 border-t border-border bg-background relative z-10 text-center space-y-6">
      <div className="max-w-4xl mx-auto space-y-4">
        {/* Monogram Seal */}
        <div className="w-12 h-12 mx-auto rounded-full border border-amber-400/60 bg-amber-50 dark:bg-amber-950/40 flex items-center justify-center shadow-inner">
          <span className="font-serif font-bold text-amber-700 dark:text-amber-300 text-sm">
            M&A
          </span>
        </div>

        <h3 className="font-serif text-3xl font-bold text-foreground">
          Mibin & Aswathi (Achu)
        </h3>

        <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto font-light leading-relaxed">
          Thank you from the bottom of our hearts for your love, support, and blessings as we embark on this beautiful chapter of our lives!
        </p>

        <div className="flex items-center justify-center gap-1.5 text-xs text-rose-500 font-semibold pt-2">
          <span>With love & gratitude</span>
          <Heart className="w-3.5 h-3.5 fill-rose-500" />
        </div>
      </div>

      <div className="pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 max-w-6xl mx-auto text-xs text-muted-foreground font-light px-4">
        <span>© 2026 Mibin & Aswathi Wedding. All Rights Reserved.</span>

        <button
          onClick={scrollToTop}
          className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
        >
          <span>Back to top</span>
          <ArrowUp className="w-3.5 h-3.5" />
        </button>
      </div>
    </footer>
  );
}
