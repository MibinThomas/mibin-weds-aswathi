"use client";

import { useState, useEffect } from "react";
import { Send, CheckCircle2, Heart, Sparkles, User, Mail, Users, Ticket, QrCode, Eye, X } from "lucide-react";
import confetti from "canvas-confetti";

interface RsvpEntry {
  id: string;
  name: string;
  contact: string;
  attending: "yes" | "no";
  guestCount: number;
  message: string;
  submittedAt: string;
}

export default function RsvpSection() {
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    attending: "yes",
    guestCount: 1,
    message: "",
  });

  const [submitted, setSubmitted] = useState<RsvpEntry | null>(null);
  const [savedRsvps, setSavedRsvps] = useState<RsvpEntry[]>([]);
  const [showAdminModal, setShowAdminModal] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("wedding_rsvps");
      if (stored) {
        setSavedRsvps(JSON.parse(stored));
      }
    } catch {
      // Local storage fallback
    }
  }, []);

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#c59b27", "#e07a5f", "#f4acb7", "#d4af37"],
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const newRsvp: RsvpEntry = {
      id: "INV-" + Math.floor(1000 + Math.random() * 9000),
      name: formData.name.trim(),
      contact: formData.contact.trim(),
      attending: formData.attending as "yes" | "no",
      guestCount: formData.guestCount,
      message: formData.message.trim(),
      submittedAt: new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
    };

    const updatedList = [newRsvp, ...savedRsvps];
    setSavedRsvps(updatedList);
    try {
      localStorage.setItem("wedding_rsvps", JSON.stringify(updatedList));
    } catch {
      // Local storage fallback
    }

    setSubmitted(newRsvp);
    if (formData.attending === "yes") {
      triggerConfetti();
    }
  };

  return (
    <section id="rsvp" className="py-20 px-4 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-4 mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 dark:bg-amber-950/50 border border-amber-300/40 text-xs font-semibold text-amber-800 dark:text-amber-200 uppercase tracking-widest">
          <Ticket className="w-3.5 h-3.5 text-primary" />
          <span>Kindly Respond</span>
        </div>
        <h2 className="font-serif text-4xl sm:text-5xl font-bold text-foreground">
          RSVP For Our Wedding
        </h2>
        <p className="text-muted-foreground max-w-lg mx-auto text-sm sm:text-base font-light">
          Please let us know if you will be celebrating with us by filling in your details below.
        </p>
      </div>

      {!submitted ? (
        <div className="p-8 sm:p-10 rounded-3xl glass-card border border-amber-300/40 shadow-xl relative">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Name input */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-primary" />
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Anjali Sharma"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl bg-background border border-border text-foreground text-sm focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              {/* Contact input */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-rose-500" />
                  Phone Number / Email *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. +91 9876543210"
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl bg-background border border-border text-foreground text-sm focus:outline-none focus:border-primary transition-colors"
                />
              </div>
            </div>

            {/* Attendance Choice */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-foreground">
                Will You Be Attending? *
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, attending: "yes" })}
                  className={`p-4 rounded-2xl text-xs sm:text-sm font-semibold border flex items-center justify-center gap-2 transition-all ${
                    formData.attending === "yes"
                      ? "bg-amber-100 dark:bg-amber-950/60 border-amber-400 text-amber-900 dark:text-amber-200 shadow-sm"
                      : "bg-background border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Joyfully Accepts
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, attending: "no" })}
                  className={`p-4 rounded-2xl text-xs sm:text-sm font-semibold border flex items-center justify-center gap-2 transition-all ${
                    formData.attending === "no"
                      ? "bg-rose-100 dark:bg-rose-950/60 border-rose-400 text-rose-900 dark:text-rose-200 shadow-sm"
                      : "bg-background border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Heart className="w-4 h-4 text-rose-500" />
                  Regretfully Declines
                </button>
              </div>
            </div>

            {/* Guest Count (if attending) */}
            {formData.attending === "yes" && (
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-primary" />
                  Total Number of Guests Attending
                </label>
                <select
                  value={formData.guestCount}
                  onChange={(e) => setFormData({ ...formData, guestCount: Number(e.target.value) })}
                  className="w-full px-4 py-3 rounded-2xl bg-background border border-border text-foreground text-sm focus:outline-none focus:border-primary transition-colors"
                >
                  <option value={1}>1 Guest (Just Me)</option>
                  <option value={2}>2 Guests (+1 Partner)</option>
                  <option value={3}>3 Guests (Family)</option>
                  <option value={4}>4+ Guests (Family / Group)</option>
                </select>
              </div>
            )}

            {/* Message / Wishes */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-foreground">
                Warm Wishes / Special Notes
              </label>
              <textarea
                rows={3}
                placeholder="Share a message or blessing for Mibin & Achu..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl bg-background border border-border text-foreground text-sm focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-full bg-gold-gradient text-white font-semibold text-sm shadow-lg hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Submit RSVP Confirmation</span>
            </button>
          </form>
        </div>
      ) : (
        /* Digital Guest Invitation Pass */
        <div className="p-8 sm:p-10 rounded-3xl glass-card border border-amber-400/60 shadow-2xl space-y-6 text-center animate-in zoom-in-95 duration-500 relative">
          <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">
              RSVP Confirmed • Ticket #{submitted.id}
            </span>
            <h3 className="font-serif text-3xl font-bold text-foreground">
              Thank You, {submitted.name}!
            </h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto font-light">
              {submitted.attending === "yes"
                ? `We are overjoyed that you and your ${submitted.guestCount > 1 ? `${submitted.guestCount - 1} guest(s)` : "party"} will join us on 28th December 2026!`
                : "Thank you for sending your warm wishes. You will be dearly missed!"}
            </p>
          </div>

          {/* Guest Pass Ticket Visual */}
          <div className="p-6 rounded-2xl bg-white dark:bg-card border border-amber-300/40 text-left max-w-md mx-auto space-y-4 shadow-inner relative">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <p className="text-[10px] uppercase font-bold text-muted-foreground">Guest Pass</p>
                <p className="font-serif font-bold text-lg text-foreground">{submitted.name}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 flex items-center justify-center">
                <QrCode className="w-6 h-6" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <p className="text-muted-foreground font-light">Event Date</p>
                <p className="font-semibold text-foreground">28 Dec 2026 • 5:00 PM</p>
              </div>
              <div>
                <p className="text-muted-foreground font-light">Venue</p>
                <p className="font-semibold text-foreground">St. Sebastian's Church</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => setSubmitted(null)}
            className="text-xs font-semibold text-primary hover:underline"
          >
            ← Submit another response
          </button>
        </div>
      )}

      {/* Host Admin Link to View RSVPs */}
      <div className="mt-8 text-center">
        <button
          onClick={() => setShowAdminModal(true)}
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Host View: See All Submitted RSVPs ({savedRsvps.length})</span>
        </button>
      </div>

      {/* Host Admin Drawer Modal */}
      {showAdminModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="relative w-full max-w-2xl max-h-[80vh] flex flex-col p-6 sm:p-8 rounded-3xl glass-card bg-background border border-amber-300/40 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                <h3 className="font-serif font-bold text-xl text-foreground">Guest RSVP List</h3>
              </div>
              <button
                onClick={() => setShowAdminModal(false)}
                className="p-1.5 rounded-full text-muted-foreground hover:bg-muted"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto py-4 space-y-3 flex-1">
              {savedRsvps.length === 0 ? (
                <p className="text-center py-8 text-sm text-muted-foreground">
                  No RSVPs submitted yet. Submissions will appear here!
                </p>
              ) : (
                savedRsvps.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-muted/40 border border-border flex items-center justify-between text-xs gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-foreground text-sm">{item.name}</span>
                        <span
                          className={`px-2 py-0.5 rounded-full font-semibold ${
                            item.attending === "yes"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-rose-100 text-rose-800"
                          }`}
                        >
                          {item.attending === "yes" ? `Attending (${item.guestCount})` : "Declined"}
                        </span>
                      </div>
                      <p className="text-muted-foreground">{item.contact}</p>
                      {item.message && <p className="italic text-foreground">&ldquo;{item.message}&rdquo;</p>}
                    </div>
                    <span className="text-[10px] text-muted-foreground shrink-0">{item.submittedAt}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
