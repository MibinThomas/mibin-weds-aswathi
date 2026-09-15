"use client";

import { useState } from "react";
import { Calendar, Clock, MapPin, Download, Check, Sparkles, ChevronDown } from "lucide-react";

export default function EventDetails() {
  const [downloaded, setDownloaded] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const title = "Mibin & Aswathi (Achu) Wedding";
  const location = "St. Sebastian's Church, Koodaranji, Kerala";
  const details = "Join us as Mibin and Aswathi (Achu) tie the knot at St. Sebastian's Church, Koodaranji!";
  
  // Dec 28, 2026 17:00 IST to Dec 28, 2026 21:00 IST -> UTC: 20261228T113000Z to 20261228T153000Z
  const startTimeUtc = "20261228T113000Z";
  const endTimeUtc = "20261228T153000Z";

  // Google Calendar URL generator
  const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    title
  )}&dates=${startTimeUtc}/${endTimeUtc}&details=${encodeURIComponent(
    details
  )}&location=${encodeURIComponent(location)}`;

  // Outlook Calendar URL generator
  const outlookCalendarUrl = `https://outlook.live.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(
    title
  )}&startdt=2026-12-28T17:00:00+05:30&enddt=2026-12-28T21:00:00+05:30&body=${encodeURIComponent(
    details
  )}&location=${encodeURIComponent(location)}`;

  // Download .ics file for Apple iCal & Outlook Desktop
  const handleDownloadIcs = () => {
    const icsData = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Mibin & Aswathi Wedding//EN",
      "CALSCALE:GREGORIAN",
      "BEGIN:VEVENT",
      `SUMMARY:${title}`,
      `DESCRIPTION:${details}`,
      `LOCATION:${location}`,
      `DTSTART:${startTimeUtc}`,
      `DTEND:${endTimeUtc}`,
      "STATUS:CONFIRMED",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    const blob = new Blob([icsData], { type: "text/calendar;charset=utf-8" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute("download", "Mibin-Aswathi-Wedding.ics");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 3000);
  };

  return (
    <section id="details" className="py-20 px-4 max-w-5xl mx-auto">
      <div className="text-center space-y-4 mb-14">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 dark:bg-amber-950/50 border border-amber-300/40 text-xs font-semibold text-amber-800 dark:text-amber-200 uppercase tracking-widest">
          <Calendar className="w-3.5 h-3.5 text-primary" />
          <span>Wedding Celebration</span>
        </div>
        <h2 className="font-serif text-4xl sm:text-5xl font-bold text-foreground">
          Event Details & Schedule
        </h2>
        <p className="text-muted-foreground max-w-lg mx-auto text-sm sm:text-base font-light">
          We eagerly await your presence to bless us as we begin our journey together.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Card 1: Holy Matrimony Ceremony */}
        <div className="p-8 rounded-3xl glass-card border border-amber-300/40 space-y-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-full blur-2xl group-hover:scale-150 transition-transform" />

          <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 flex items-center justify-center font-bold text-xl">
            <Sparkles className="w-6 h-6" />
          </div>

          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-rose-500">
              The Sacred Solemnization
            </span>
            <h3 className="font-serif text-3xl font-bold text-foreground mt-1">
              Holy Matrimony
            </h3>
          </div>

          <div className="space-y-4 text-sm font-light text-muted-foreground border-t border-b border-border py-4">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-primary shrink-0" />
              <span>
                <strong className="text-foreground font-semibold">Date:</strong> Monday, 28th December 2026
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-rose-500 shrink-0" />
              <span>
                <strong className="text-foreground font-semibold">Time:</strong> 5:00 PM IST Sharp
              </span>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <span>
                <strong className="text-foreground font-semibold">Venue:</strong> St. Sebastian's Church, Koodaranji, Kerala
              </span>
            </div>
          </div>

          <p className="text-xs text-muted-foreground italic">
            &ldquo;Surrounded by faith, family, and loved ones, Mibin and Aswathi will exchange holy wedding vows.&rdquo;
          </p>
        </div>

        {/* Card 2: Dinner & Celebration */}
        <div className="p-8 rounded-3xl glass-card border border-rose-300/40 space-y-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-rose-400/10 rounded-full blur-2xl group-hover:scale-150 transition-transform" />

          <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 flex items-center justify-center font-bold text-xl">
            <Clock className="w-6 h-6" />
          </div>

          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">
              Feast & Fellowship
            </span>
            <h3 className="font-serif text-3xl font-bold text-foreground mt-1">
              Wedding Reception
            </h3>
          </div>

          <div className="space-y-4 text-sm font-light text-muted-foreground border-t border-b border-border py-4">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-primary shrink-0" />
              <span>
                <strong className="text-foreground font-semibold">Time:</strong> Immediately following the ceremony (6:30 PM onwards)
              </span>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
              <span>
                <strong className="text-foreground font-semibold">Location:</strong> Parish Auditorium, St. Sebastian's Church Campus, Koodaranji
              </span>
            </div>
          </div>

          <p className="text-xs text-muted-foreground italic">
            &ldquo;Join us for a delicious celebratory dinner, traditional music, and joyful memories!&rdquo;
          </p>
        </div>
      </div>

      {/* Save To Calendar Button & Dropdown */}
      <div className="mt-12 text-center relative max-w-sm mx-auto">
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-full flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-gold-gradient text-white font-semibold text-sm shadow-xl hover:scale-105 transition-all duration-300"
          >
            <Calendar className="w-5 h-5" />
            <span>Save To Calendar</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
          </button>

          {dropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-3 p-3 rounded-2xl glass-card border border-amber-300/40 shadow-2xl z-30 space-y-2 animate-in fade-in duration-200">
              <a
                href={googleCalendarUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-amber-100/50 dark:hover:bg-amber-950/40 text-left text-xs font-semibold text-foreground transition-colors"
              >
                <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center">
                  G
                </div>
                Google Calendar
              </a>

              <button
                onClick={handleDownloadIcs}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-rose-100/50 dark:hover:bg-rose-950/40 text-left text-xs font-semibold text-foreground transition-colors"
              >
                <div className="w-7 h-7 rounded-lg bg-rose-500/10 text-rose-600 flex items-center justify-center">
                  {downloaded ? <Check className="w-4 h-4" /> : <Download className="w-4 h-4" />}
                </div>
                {downloaded ? "Downloaded .ics File!" : "Apple iCal / Outlook (.ics Download)"}
              </button>

              <a
                href={outlookCalendarUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-indigo-100/50 dark:hover:bg-indigo-950/40 text-left text-xs font-semibold text-foreground transition-colors"
              >
                <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
                  O
                </div>
                Outlook Web
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
