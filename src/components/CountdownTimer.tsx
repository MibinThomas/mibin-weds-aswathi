"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const targetDate = new Date("2026-12-28T17:00:00+05:30").getTime();

    const calculateTime = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!isMounted) return null;

  const timerItems = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Minutes", value: timeLeft.minutes },
    { label: "Seconds", value: timeLeft.seconds },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto py-6">
      <div className="flex items-center justify-center gap-2 mb-4 text-xs font-semibold uppercase tracking-widest text-primary">
        <Heart className="w-3.5 h-3.5 fill-rose-400 text-rose-500 animate-bounce" />
        <span>Counting Down To Forever</span>
        <Heart className="w-3.5 h-3.5 fill-rose-400 text-rose-500 animate-bounce" />
      </div>

      <div className="grid grid-cols-4 gap-2.5 sm:gap-4 text-center">
        {timerItems.map((item, index) => (
          <div
            key={index}
            className="group relative flex flex-col items-center justify-center p-3 sm:p-5 rounded-2xl sm:rounded-3xl glass-card border border-amber-300/40 shadow-lg hover:border-amber-400 transition-all duration-300"
          >
            <span className="font-serif font-bold text-2xl sm:text-4xl lg:text-5xl text-foreground tracking-tight group-hover:scale-105 transition-transform duration-300">
              {String(item.value).padStart(2, "0")}
            </span>
            <span className="text-[10px] sm:text-xs font-medium uppercase tracking-wider text-muted-foreground mt-1">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
