"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import confetti from "canvas-confetti";
import { Heart } from "lucide-react";

export default function CinematicExperience({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const root = useRef<HTMLDivElement>(null);
  const seal = useRef<HTMLButtonElement>(null);
  const [opened, setOpened] = useState(false);
  const [exiting, setExiting] = useState(false);
  const exitTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    seal.current?.focus();
    return () => { if (exitTimer.current) clearTimeout(exitTimer.current); };
  }, []);

  useEffect(() => {
    if (opened) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, [opened]);

  useEffect(() => {
    const container = root.current;
    if (!container || !opened) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    let cleanup = () => {};
    const setup = () => {
      cleanup();
      if (preference.matches) return;
      const reveals = Array.from(container.querySelectorAll<HTMLElement>(
        ".section-heading, .calendar-sheet, .ceremony-details, .family, .story-art, .story-copy, .wishes-copy, .wish-form, .venue-panel, .closing-section, .welcome-intro, .invitation-choice, .countdown-wrap",
      ));
      const cards = Array.from(container.querySelectorAll<HTMLElement>(".hero-art, .invitation-choice, .calendar-sheet, .story-art"));
      const layers = Array.from(container.querySelectorAll<HTMLElement>(".hero-garland, .hero-floral-left, .hero-floral-right, .family-floral-left, .family-floral-right, .story-floral, .welcome-garland"));
      reveals.forEach((el, i) => { el.classList.add("cinema-reveal"); el.style.setProperty("--reveal-delay", `${i % 3 * 80}ms`); });
      const observer = new IntersectionObserver(entries => entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add("is-revealed"); observer.unobserve(entry.target); }
      }), { threshold: 0.08 });
      reveals.forEach(el => observer.observe(el));
      let frame = 0;
      let pointerX = 0;
      let pointerY = 0;
      let active: HTMLElement | null = null;
      const paint = () => {
        frame = 0;
        const height = window.innerHeight;
        const total = document.documentElement.scrollHeight - height;
        container.style.setProperty("--journey", `${total > 0 ? window.scrollY / total : 0}`);
        layers.forEach((el, i) => {
          const section = el.closest("section, main");
          const bounds = section?.getBoundingClientRect();
          if (!bounds || bounds.bottom < 0 || bounds.top > height) return;
          const offset = Math.max(-30, Math.min(30, (height / 2 - bounds.top - bounds.height / 2) * (i % 2 ? 0.045 : -0.035)));
          el.style.setProperty("--drift", `${offset}px`);
        });
        if (active) {
          const bounds = active.getBoundingClientRect();
          const x = (pointerX - bounds.left) / bounds.width - 0.5;
          const y = (pointerY - bounds.top) / bounds.height - 0.5;
          active.style.setProperty("--tilt-x", `${-y * 7}deg`);
          active.style.setProperty("--tilt-y", `${x * 7}deg`);
          active.style.setProperty("--shine-x", `${(x + 0.5) * 100}%`);
          active.style.setProperty("--shine-y", `${(y + 0.5) * 100}%`);
        }
      };
      const schedule = () => { if (!frame) frame = requestAnimationFrame(paint); };
      const reset = () => {
        if (active) { active.style.removeProperty("--tilt-x"); active.style.removeProperty("--tilt-y"); }
        active = null;
      };
      const move = (event: PointerEvent) => {
        if (!finePointer.matches) return;
        const target = event.target instanceof Element ? event.target.closest<HTMLElement>(".cinema-card") : null;
        if (target !== active) reset();
        active = target;
        pointerX = event.clientX; pointerY = event.clientY;
        schedule();
      };
      cards.forEach(el => el.classList.add("cinema-card"));
      window.addEventListener("scroll", schedule, { passive: true });
      window.addEventListener("resize", schedule);
      container.addEventListener("pointermove", move, { passive: true });
      container.addEventListener("pointerleave", reset);
      schedule();
      cleanup = () => {
        cancelAnimationFrame(frame); observer.disconnect(); reset();
        window.removeEventListener("scroll", schedule); window.removeEventListener("resize", schedule);
        container.removeEventListener("pointermove", move); container.removeEventListener("pointerleave", reset);
        reveals.forEach(el => el.classList.remove("cinema-reveal", "is-revealed"));
        cards.forEach(el => el.classList.remove("cinema-card"));
        layers.forEach(el => el.style.removeProperty("--drift"));
      };
    };
    setup(); preference.addEventListener("change", setup);
    return () => { cleanup(); preference.removeEventListener("change", setup); };
  }, [pathname, opened]);

  function openInvitation() {
    if (exiting) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setExiting(true);
    if (!reduced) {
      const options = { particleCount: 65, spread: 75, startVelocity: 32, gravity: 0.75, ticks: 230, colors: ["#bca476", "#dce8ed", "#7496ad", "#fffaf0"], disableForReducedMotion: true, zIndex: 100 };
      void confetti({ ...options, origin: { x: 0.18, y: 0.65 }, angle: 65 });
      void confetti({ ...options, origin: { x: 0.82, y: 0.65 }, angle: 115 });
    }
    exitTimer.current = setTimeout(() => {
      setOpened(true);
      requestAnimationFrame(() => root.current?.querySelector<HTMLElement>("main")?.focus({ preventScroll: true }));
    }, reduced ? 0 : 850);
  }

  return (
    <div ref={root} className="cinematic-experience">
      <div className="cinema-atmosphere" aria-hidden="true">
        <div className="cinema-halo cinema-halo-one" /><div className="cinema-halo cinema-halo-two" />
        {Array.from({ length: 16 }, (_, i) => <i key={i} style={{ left: `${(i * 37 + 7) % 100}%`, top: `${(i * 23) % 100}%`, animationDelay: `${-i * 1.7}s`, animationDuration: `${14 + i % 5 * 3}s` }} />)}
      </div>
      <div className="cinema-progress" aria-hidden="true" />
      <div inert={!opened} className={`cinema-content ${opened ? "cinema-entered" : ""}`}>{children}</div>
      {!opened && <div className={`cinema-opening ${exiting ? "cinema-opening-exit" : ""}`} role="dialog" aria-modal="true" aria-labelledby="opening-title" onKeyDown={event => {
        if (event.key === "Tab") { event.preventDefault(); seal.current?.focus(); }
        if (event.key === "Escape") openInvitation();
      }}>
        <div className="opening-door opening-door-left" /><div className="opening-door opening-door-right" />
        <div className="opening-content">
          <p className="eyebrow">A moment. A promise. A lifetime.</p>
          <h2 id="opening-title">Our forever<br /><em>begins with you.</em></h2>
          <button ref={seal} className="opening-seal" onClick={openInvitation} aria-label="Open the wedding invitation">
            <Heart size={24} strokeWidth={1} /><span>M & A</span>
          </button>
          <p className="opening-instruction">Touch the seal to open</p>
          <span className="opening-date">28 DECEMBER 2026</span>
          <p className="opening-sound">Best enjoyed with sound</p>
        </div>
      </div>}
    </div>
  );
}
