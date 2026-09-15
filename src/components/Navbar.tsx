"use client";

import { useState, useEffect } from "react";
import { Heart, Share2, Moon, Sun, Sparkles, Menu, X } from "lucide-react";
import ShareModal from "./ShareModal";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState<"gold" | "dark" | "rose">("gold");
  const [shareOpen, setShareOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const changeTheme = (newTheme: "gold" | "dark" | "rose") => {
    setTheme(newTheme);
    const root = document.documentElement;
    if (newTheme === "dark") {
      root.setAttribute("data-theme", "dark");
    } else if (newTheme === "rose") {
      root.setAttribute("data-theme", "rose");
    } else {
      root.removeAttribute("data-theme");
    }
  };

  const navLinks = [
    { name: "Our Story", href: "#story" },
    { name: "Event Details", href: "#details" },
    { name: "Gallery", href: "#gallery" },
    { name: "Wishes", href: "#wishes" },
    { name: "Location", href: "#location" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          scrolled
            ? "py-3 glass border-b border-border shadow-sm"
            : "py-5 bg-transparent"
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          {/* Logo Monogram */}
          <a
            href="#hero"
            className="flex items-center gap-2 group transition-transform duration-300 hover:scale-105"
          >
            <div className="w-10 h-10 rounded-full border border-amber-400/60 bg-amber-50 dark:bg-amber-950/40 flex items-center justify-center shadow-inner">
              <span className="font-serif font-bold text-amber-700 dark:text-amber-300 text-sm">
                M&A
              </span>
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="font-serif font-bold text-base tracking-wide text-foreground">
                Mibin & Aswathi
              </span>
              <span className="text-[10px] text-muted-foreground tracking-widest uppercase font-sans">
                28 Dec 2026
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-xs uppercase tracking-widest font-semibold text-muted-foreground hover:text-primary transition-colors"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Actions & Theme Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Theme Selector */}
            <div className="flex items-center p-1 rounded-full bg-muted/80 border border-border">
              <button
                onClick={() => changeTheme("gold")}
                title="Gold / Classic Theme"
                className={`p-1.5 rounded-full transition-all ${
                  theme === "gold" ? "bg-amber-400 text-amber-950 shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => changeTheme("rose")}
                title="Rose Gold Theme"
                className={`p-1.5 rounded-full transition-all ${
                  theme === "rose" ? "bg-rose-400 text-white shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Heart className="w-3.5 h-3.5" />
              </button>
            </div>


            {/* Share Button */}
            <button
              onClick={() => setShareOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 transition-all shadow-sm"
            >
              <Share2 className="w-3.5 h-3.5" />
              Share
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-foreground hover:bg-muted transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden glass border-b border-border py-4 px-6 space-y-3 animate-in slide-in-from-top-4 duration-300">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-medium py-1.5 text-foreground hover:text-primary transition-colors"
              >
                {link.name}
              </a>
            ))}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setShareOpen(true);
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold"
            >
              <Share2 className="w-4 h-4" />
              Share Invitation
            </button>
          </div>
        )}
      </header>

      <ShareModal isOpen={shareOpen} onClose={() => setShareOpen(false)} />
    </>
  );
}
