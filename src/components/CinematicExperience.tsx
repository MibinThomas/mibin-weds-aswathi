"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import confetti from "canvas-confetti";
import { Heart } from "lucide-react";
import Image from "next/image";

export default function CinematicExperience({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const root = useRef<HTMLDivElement>(null);
  const seal = useRef<HTMLButtonElement>(null);
  const [opened, setOpened] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [coverDismissed, setCoverDismissed] = useState(false);
  const exitTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const openingStarted = useRef(false);

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
    if (!container || !opened || container.querySelector(".book-main")) return;
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
    if (openingStarted.current) return;
    openingStarted.current = true;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Release the invitation immediately; the cover animation is decorative.
    setOpened(true);
    setExiting(true);
    // Opening must finish even if the optional canvas effect is unavailable.
    exitTimer.current = setTimeout(() => {
      setCoverDismissed(true);
      requestAnimationFrame(() => root.current?.querySelector<HTMLElement>("main")?.focus({ preventScroll: true }));
    }, reduced ? 0 : 1000);
    if (!reduced) {
      const options = { particleCount: 65, spread: 75, startVelocity: 32, gravity: 0.75, ticks: 230, colors: ["#bca476", "#dce8ed", "#7496ad", "#fffaf0"], disableForReducedMotion: true, zIndex: 100 };
      try {
        void confetti({ ...options, origin: { x: 0.18, y: 0.65 }, angle: 65 })?.catch(() => {});
        void confetti({ ...options, origin: { x: 0.82, y: 0.65 }, angle: 115 })?.catch(() => {});
      } catch {
        // The paper reveal works without canvas support.
      }
    }
  }

  return (
    <div ref={root} className="cinematic-experience">
      <div className="cinema-atmosphere" aria-hidden="true">
        <div className="cinema-halo cinema-halo-one" /><div className="cinema-halo cinema-halo-two" />
        {Array.from({ length: 16 }, (_, i) => <i key={i} style={{ left: `${(i * 37 + 7) % 100}%`, top: `${(i * 23) % 100}%`, animationDelay: `${-i * 1.7}s`, animationDuration: `${14 + i % 5 * 3}s` }} />)}
      </div>
      <div className="cinema-progress" aria-hidden="true" />
      <div inert={!opened} className={`cinema-content ${opened ? "cinema-entered" : ""}`}>{children}</div>
      {!coverDismissed && <div className={`cinema-opening ${exiting ? "cinema-opening-exit" : ""}`} role="dialog" aria-modal={!opened} aria-hidden={opened} aria-labelledby="opening-title" onTransitionEnd={event => {
        if (event.target === event.currentTarget && event.propertyName === "opacity" && openingStarted.current) setCoverDismissed(true);
      }} onKeyDown={event => {
        if (event.key === "Tab") { event.preventDefault(); seal.current?.focus(); }
        if (event.key === "Escape") openInvitation();
      }}>
        <div className="opening-stationery">
          <div className="opening-envelope" aria-hidden="true" />
          <div className="opening-card">
            <div className="opening-door opening-door-left" aria-hidden="true" /><div className="opening-door opening-door-right" aria-hidden="true" />
            <Image className="opening-botanical opening-botanical-top" src="/images/floral-side.png" alt="" width={482} height={618} sizes="220px" priority aria-hidden="true" />
            <Image className="opening-botanical opening-botanical-bottom" src="/images/floral-side.png" alt="" width={482} height={618} sizes="180px" priority aria-hidden="true" />
            <div className="opening-content">
              <p className="opening-prelude">Together with our families</p>
              <div className="opening-rule" aria-hidden="true"><span /><Heart size={12} strokeWidth={1} /><span /></div>
              <h2 id="opening-title">Mibin<span className="opening-ampersand">&amp;</span>Aswathi</h2>
              <p className="opening-invite">Request the pleasure of your company<br />as we begin our forever.</p>
              <div className="opening-date"><span>MONDAY</span><strong>28</strong><span>DECEMBER<br />2026</span></div>
              <p className="opening-venue">St. Sebastian’s Church, Koodaranji<br /><span>Five o’clock in the evening</span></p>
              <div className="opening-seal-wrap">
                <span className="opening-ribbon" aria-hidden="true" />
                <button type="button" ref={seal} className="opening-seal" onClick={openInvitation}
                  onPointerUp={event => { if (event.isPrimary && event.button === 0) openInvitation(); }}
                  onKeyDown={event => {
                    if (event.key === "Enter" || event.key === " ") { event.preventDefault(); openInvitation(); }
                  }} aria-label="Open the wedding invitation" aria-busy={exiting} tabIndex={opened ? -1 : 0}>
                  <span className="seal-monogram">M &amp; A</span><span className="seal-caption">WITH LOVE</span>
                </button>
              </div>
              <p className="opening-instruction">{exiting ? "Your invitation awaits…" : "Touch the seal to open"}</p>
            </div>
          </div>
          <p className="opening-sound">A little paper. A lifetime of love.</p>
        </div>
      </div>}
    </div>
  );
}
