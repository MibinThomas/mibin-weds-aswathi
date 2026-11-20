"use client";

import { Children, useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export const chapters = [
  ["invitation", "Welcome"], ["story", "Our story"],
  ["celebration", "Celebration"], ["families", "Families"],
  ["gallery", "Gallery"], ["wishes", "Wishes"],
  ["location", "The venue"], ["rsvp", "RSVP"], ["closing", "With love"],
] as const;

export default function InvitationBook({ children, onPageChange }: {
  children: ReactNode; onPageChange: (id: string) => void;
}) {
  const [page, setPage] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const current = useRef(0);
  const root = useRef<HTMLDivElement>(null);
  const lockedUntil = useRef(0);
  const interactionUntil = useRef(0);
  const reduced = useReducedMotion();

  const go = useCallback((index: number, history = true, automatic = false) => {
    if (!automatic && history) interactionUntil.current = performance.now() + 12000;
    const next = Math.max(0, Math.min(chapters.length - 1, index));
    if (next === current.current) return;
    current.current = next;
    lockedUntil.current = performance.now() + (reduced ? 180 : 900);
    setPage(next);
    onPageChange(chapters[next][0]);
    window.dispatchEvent(new Event("invitation:page-turn"));
    if (history) window.history[automatic ? "replaceState" : "pushState"](null, "", `#${chapters[next][0]}`);
    if (automatic) return;
    requestAnimationFrame(() => {
      root.current?.querySelector<HTMLElement>(`[data-page="${next}"]`)?.focus({ preventScroll: true });
    });
  }, [onPageChange, reduced]);

  useEffect(() => {
    if (!autoplay || reduced) return;
    let elapsed = 0;
    let previous = performance.now();
    const timer = window.setInterval(() => {
      const now = performance.now();
      const delta = Math.min(now - previous, 500);
      previous = now;
      const focused = document.activeElement;
      const blocked = now < interactionUntil.current || document.hidden || document.querySelector(".cinema-opening, dialog[open], .mobile-nav") ||
        (focused instanceof Element && focused.closest("input, textarea, select, [contenteditable=true], iframe"));
      if (blocked) { elapsed = 0; return; }
      elapsed += delta;
      if (elapsed >= 8000) {
        elapsed = 0;
        go((current.current + 1) % chapters.length, true, true);
      }
    }, 250);
    return () => window.clearInterval(timer);
  }, [autoplay, reduced, page, go]);

  useEffect(() => {
    const pause = (event: Event) => {
      if (!(event.target instanceof Element) || event.target.closest(".book-autoplay, .cinema-opening, .background-music-toggle")) return;
      if (event.target.closest(".invitation-book, .site-header")) interactionUntil.current = performance.now() + 12000;
    };
    const key = (event: KeyboardEvent) => {
      if (["ArrowLeft", "ArrowRight", "Home", "End", "Tab"].includes(event.key)) pause(event);
    };
    document.addEventListener("pointerdown", pause, true);
    document.addEventListener("wheel", pause, { passive: true, capture: true });
    document.addEventListener("focusin", pause);
    document.addEventListener("keydown", key);
    return () => {
      document.removeEventListener("pointerdown", pause, true);
      document.removeEventListener("wheel", pause, true);
      document.removeEventListener("focusin", pause);
      document.removeEventListener("keydown", key);
    };
  }, []);

  useEffect(() => {
    const book = root.current;
    if (!book) return;
    const fromHash = () => {
      const index = chapters.findIndex(([id]) => `#${id}` === window.location.hash);
      go(index < 0 ? 0 : index, false);
    };
    fromHash();
    const blocked = (target: EventTarget | null) =>
      !!document.querySelector("dialog[open], .cinema-opening") ||
      (target instanceof Element && !!target.closest("input, textarea, select, [contenteditable=true], .mobile-nav"));
    const click = (event: MouseEvent) => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return;
      const anchor = event.target instanceof Element ? event.target.closest("a") : null;
      const index = chapters.findIndex(([id]) => anchor?.getAttribute("href") === `#${id}`);
      if (index >= 0) { event.preventDefault(); go(index); }
    };
    let amount = 0;
    let lastWheel = 0;
    const wheel = (event: WheelEvent) => {
      if (event.ctrlKey || blocked(event.target)) return;
      const horizontal = Math.abs(event.deltaX) > Math.abs(event.deltaY);
      const delta = (horizontal ? event.deltaX : event.deltaY) * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? book.clientHeight : 1);
      const scene = book.querySelector<HTMLElement>(`[data-page="${current.current}"]`);
      // Long pages and nested lists retain native scrolling until their edge.
      if (!horizontal && event.target instanceof Element) {
        let node: HTMLElement | null = event.target as HTMLElement;
        while (node && book.contains(node)) {
          if (node.scrollHeight > node.clientHeight + 2 && /auto|scroll/.test(getComputedStyle(node).overflowY) &&
            (delta > 0 ? node.scrollTop + node.clientHeight < node.scrollHeight - 2 : node.scrollTop > 2)) return;
          if (node === scene) break;
          node = node.parentElement;
        }
      }
      event.preventDefault();
      const now = performance.now();
      const gap = now - lastWheel;
      lastWheel = now;
      if (now < lockedUntil.current) { amount = 0; return; }
      // Require a pause after a turn so trackpad momentum cannot skip chapters.
      if (gap < 130 && amount === 0) return;
      if (gap > 180 || Math.sign(amount) !== Math.sign(delta)) amount = 0;
      amount += delta;
      if (Math.abs(amount) >= 45) { go(current.current + Math.sign(amount)); amount = 0; }
    };
    const key = (event: KeyboardEvent) => {
      if (blocked(event.target) || event.altKey || event.ctrlKey || event.metaKey) return;
      const destinations: Record<string, number> = { ArrowRight: current.current + 1, ArrowLeft: current.current - 1, Home: 0, End: chapters.length - 1 };
      if (event.key in destinations) { event.preventDefault(); go(destinations[event.key]); }
    };
    let touch: { x: number; y: number } | null = null;
    const start = (event: TouchEvent) => {
      touch = event.touches.length === 1 && !blocked(event.target) ? { x: event.touches[0].clientX, y: event.touches[0].clientY } : null;
    };
    const end = (event: TouchEvent) => {
      if (!touch || !event.changedTouches.length) return;
      const dx = touch.x - event.changedTouches[0].clientX;
      const dy = touch.y - event.changedTouches[0].clientY;
      touch = null;
      if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.4 && performance.now() >= lockedUntil.current) go(current.current + Math.sign(dx));
    };
    const cancel = () => { touch = null; };
    document.addEventListener("click", click);
    window.addEventListener("keydown", key);
    window.addEventListener("hashchange", fromHash);
    window.addEventListener("popstate", fromHash);
    book.addEventListener("wheel", wheel, { passive: false });
    book.addEventListener("touchstart", start, { passive: true });
    book.addEventListener("touchend", end, { passive: true });
    book.addEventListener("touchcancel", cancel);
    return () => {
      document.removeEventListener("click", click);
      window.removeEventListener("keydown", key);
      window.removeEventListener("hashchange", fromHash);
      window.removeEventListener("popstate", fromHash);
      book.removeEventListener("wheel", wheel);
      book.removeEventListener("touchstart", start);
      book.removeEventListener("touchend", end);
      book.removeEventListener("touchcancel", cancel);
    };
  }, [go]);

  return <div className="invitation-book" ref={root} role="region" aria-roledescription="carousel" aria-label="Wedding invitation chapters">
    <div className="book-stage">
      {Children.toArray(children).map((child, index) => {
        const offset = ((index - page + chapters.length + 4) % chapters.length) - 4;
        return <motion.div
        key={chapters[index][0]} className="book-page" data-page={index}
        data-active={index === page} inert={index !== page} aria-hidden={index !== page}
        role="group" aria-roledescription="slide" aria-label={`${index + 1} of ${chapters.length}: ${chapters[index][1]}`}
        tabIndex={-1} initial={false}
        animate={{ x: reduced ? 0 : `${offset * 105}%`, rotateY: reduced ? 0 : offset === 0 ? 0 : offset < 0 ? -14 : 14, scale: index === page ? 1 : .94, opacity: index === page ? 1 : 0 }}
        transition={{ duration: reduced ? 0 : .85, ease: [.22, .75, .15, 1] }}
        style={{ visibility: Math.abs(offset) > 1 ? "hidden" : "visible" }}
      >{child}</motion.div>; })}
    </div>
    <nav className="book-controls" aria-label="Invitation pages">
      <div className="book-chapter"><span className="book-counter">{String(page + 1).padStart(2, "0")} / {String(chapters.length).padStart(2, "0")}</span><span>{chapters[page][1]}</span></div>
      <div className="book-dots">{chapters.map(([id, label], index) => <button key={id} onClick={() => go(index)} aria-label={`Go to ${label}`} aria-current={page === index ? "step" : undefined}><span /></button>)}</div>
      <span className="book-hint">Swipe or scroll to turn the page</span>
      <button className="book-autoplay" onClick={() => setAutoplay(!autoplay)} disabled={!!reduced} aria-label={reduced ? "Automatic slides disabled for reduced motion" : autoplay ? "Pause automatic slides" : "Play automatic slides"} title={reduced ? "Automatic slides disabled for reduced motion" : autoplay ? "Pause automatic slides" : "Play automatic slides"}>
        {autoplay && !reduced ? "Pause automatic slides" : "Resume automatic slides"}
      </button>
      <button className="book-next" onClick={() => go((page + 1) % chapters.length)} aria-label="Next page"><ArrowRight size={16} strokeWidth={1.3} /></button>
      <div className="book-progress" role="progressbar" aria-label="Invitation progress" aria-valuemin={1} aria-valuemax={chapters.length} aria-valuenow={page + 1}><span style={{ transform: `scaleX(${(page + 1) / chapters.length})` }} /></div>
    </nav>
    <p className="sr-only" aria-live={autoplay && !reduced ? "off" : "polite"} aria-atomic="true">Page {page + 1} of {chapters.length}: {chapters[page][1]}</p>
  </div>;
}
