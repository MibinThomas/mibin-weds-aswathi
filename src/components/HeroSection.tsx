"use client";

import { Calendar, MapPin, Sparkles, ChevronDown } from "lucide-react";
import CountdownTimer from "./CountdownTimer";

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-center items-center text-center px-4 pt-24 pb-16 overflow-hidden"
    >
      {/* Decorative Floral Ring Overlay */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] sm:w-[500px] sm:h-[500px] lg:w-[620px] lg:h-[620px] rounded-full border border-amber-300/30 pointer-events-none animate-pulse" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] sm:w-[440px] sm:h-[440px] lg:w-[540px] lg:h-[540px] rounded-full border border-rose-200/30 pointer-events-none" />

      {/* Hero Invitation Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-amber-400/40 text-xs font-semibold uppercase tracking-widest text-amber-800 dark:text-amber-200 shadow-sm mb-6 animate-in fade-in duration-700">
        <Sparkles className="w-3.5 h-3.5 text-primary" />
        <span>Wedding Invitation</span>
        <Sparkles className="w-3.5 h-3.5 text-primary" />
      </div>

      {/* Main Couple Title */}
      <div className="space-y-4 max-w-4xl mx-auto">
        <p className="font-script text-2xl sm:text-3xl text-rose-500 font-normal">
          We invite you to celebrate the union of
        </p>

        <h1 className="font-serif text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight text-foreground">
          Mibin{" "}
          <span className="font-script text-4xl sm:text-6xl lg:text-7xl font-normal text-primary mx-2">
            &
          </span>{" "}
          Aswathi
        </h1>

        <p className="font-script text-3xl sm:text-4xl text-amber-700 dark:text-amber-300">
          (Achu)
        </p>

        <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto font-light leading-relaxed italic px-4">
          &ldquo;What began in college as a bold proposal and a beautiful friendship has grown through eight unforgettable years into a lifelong vow.&rdquo;
        </p>
      </div>

      {/* Date & Location Pill Cards */}
      <div className="flex flex-wrap items-center justify-center gap-4 my-8 text-xs sm:text-sm font-medium">
        <div className="flex items-center gap-2 px-5 py-2.5 rounded-full glass-card border border-amber-300/40 text-foreground shadow-sm">
          <Calendar className="w-4 h-4 text-primary" />
          <span>Monday, 28th December 2026 • 5:00 PM</span>
        </div>

        <a
          href="#location"
          className="flex items-center gap-2 px-5 py-2.5 rounded-full glass-card border border-amber-300/40 text-foreground hover:border-primary transition-all shadow-sm group"
        >
          <MapPin className="w-4 h-4 text-rose-500 group-hover:scale-110 transition-transform" />
          <span>St. Sebastian's Church, Koodaranji</span>
        </a>
      </div>

      {/* Live Countdown */}
      <CountdownTimer />

      {/* Call to Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
        <a
          href="#story"
          className="px-8 py-3.5 rounded-full bg-primary text-primary-foreground font-semibold text-sm shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
        >
          Our Love Story
        </a>

        <a
          href="#details"
          className="px-8 py-3.5 rounded-full glass border border-amber-400/50 text-foreground font-semibold text-sm hover:bg-amber-100/30 transition-all duration-300"
        >
          Event Details & Calendar
        </a>
      </div>


      {/* Scroll Down Indicator */}
      <div className="mt-12 animate-bounce">
        <a href="#story" aria-label="Scroll to Our Story">
          <ChevronDown className="w-6 h-6 text-muted-foreground hover:text-primary transition-colors" />
        </a>
      </div>
    </section>
  );
}
