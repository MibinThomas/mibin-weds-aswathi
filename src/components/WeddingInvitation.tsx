"use client";

import Image from "next/image";

import { copy as t } from "@/lib/copy";
import CulturalBlessing from "@/components/CulturalBlessing";
import {
  families,
  getInvitation,
  type InvitationSide,
} from "@/lib/invitations";
import { useEffect, useRef, useState } from "react";
import {
  ArrowDown,

  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Check,
  Church,
  Copy,
  Download,
  Heart,
  MapPin,
  Menu,
  Navigation,
  Send,
  Share2,
  X,
} from "lucide-react";

const mapsUrl =
  "https://www.google.com/maps/dir/?api=1&destination=" +
  encodeURIComponent("St. Sebastian's Church, Koodaranji, Kerala");
const weddingTime = new Date("2026-12-28T17:00:00+05:30").getTime();

function Floral({
  className = "",
  garland = false,
  priority = false,
}: {
  className?: string;
  garland?: boolean;
  priority?: boolean;
}) {
  return (
    <Image
      className={`floral ${className}`}
      src={`/images/${garland ? "floral-garland" : "floral-side"}.png`}
      width={garland ? 1844 : 482}
      height={garland ? 625 : 618}
      alt=""
      aria-hidden="true"
      priority={priority}
      sizes={
        garland
          ? "(max-width: 600px) 90vw, 550px"
          : "(max-width: 600px) 35vw, 280px"
      }
    />
  );
}

function Ornament() {
  return (
    <div className="ornament" aria-hidden="true">
      <span />
      <Heart size={13} strokeWidth={1.2} />
      <span />
    </div>
  );
}

function Countdown() {
  const [remaining, setRemaining] = useState<number | null>(null);
  useEffect(() => {
    const tick = () => setRemaining(Math.max(0, weddingTime - Date.now()));
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, []);
  const values =
    remaining === null
      ? ["—", "—", "—", "—"]
      : [
          Math.floor(remaining / 86400000),
          Math.floor(remaining / 3600000) % 24,
          Math.floor(remaining / 60000) % 60,
          Math.floor(remaining / 1000) % 60,
        ].map((v) => String(v).padStart(2, "0"));
  return (
    <div className="countdown-wrap">
      <p className="eyebrow">
        {remaining === 0 ? t.foreverBegun : t.countdownTitle}
      </p>
      <div className="countdown" role="timer" aria-label={t.countdownLabel}>
        {values.map((value, i) => (
          <div key={i}>
            <span>{value}</span>
            <small>{t.units[i]}</small>
          </div>
        ))}
      </div>
    </div>
  );
}

interface Wish {
  id: string;
  author: string;
  message: string;
  relation?: string;
}

function Guestbook() {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [status, setStatus] = useState<
    "" | "wishRequired" | "wishSaved" | "wishVisit"
  >("");
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      try {
        const saved: unknown = JSON.parse(
          localStorage.getItem("wedding_wishes") || "[]",
        );
        if (Array.isArray(saved))
          setWishes(
            saved.filter((item): item is Wish =>
              Boolean(
                item &&
                typeof item.id === "string" &&
                typeof item.author === "string" &&
                typeof item.message === "string",
              ),
            ),
          );
      } catch {
        /* A fresh guestbook is available when storage cannot be read. */
      }
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  function addWish(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const author = String(data.get("name") || "").trim();
    const message = String(data.get("message") || "").trim();
    if (!author || !message) {
      setStatus("wishRequired");
      return;
    }
    const updated = [{ id: crypto.randomUUID(), author, message }, ...wishes];
    setWishes(updated);
    try {
      localStorage.setItem("wedding_wishes", JSON.stringify(updated));
      setStatus("wishSaved");
    } catch {
      setStatus("wishVisit");
    }
    form.reset();
  }

  return (
    <section id="wishes" className="wishes-section section-space">
      <div className="section-container wishes-grid">
        <div className="wishes-copy">
          <p className="eyebrow">{t.wishesEyebrow}</p>
          <h2>
            {t.wishesTitle}
            <br />
            <em>{t.wishesEmphasis}</em>
          </h2>
          <p>{t.wishesMessage}</p>
          <Ornament />
          <p className="storage-note">{t.storageNote}</p>
          {wishes.length > 0 && (
            <div className="wish-list" aria-label={t.savedWishes}>
              {wishes.map((wish) => (
                <blockquote key={wish.id}>
                  <p>“{wish.message}”</p>
                  <cite>{wish.author}</cite>
                </blockquote>
              ))}
            </div>
          )}
        </div>
        <form className="wish-form" onSubmit={addWish}>
          <Heart size={26} strokeWidth={1} />
          <h3>{t.formTitle}</h3>
          <label htmlFor="guest-name">{t.yourName}</label>
          <input
            id="guest-name"
            name="name"
            autoComplete="name"
            placeholder={t.namePlaceholder}
            maxLength={100}
            required
          />
          <label htmlFor="guest-message">{t.yourMessage}</label>
          <textarea
            id="guest-message"
            name="message"
            placeholder={t.messagePlaceholder}
            rows={4}
            maxLength={2000}
            required
          />
          <button className="button button-primary" type="submit">
            {t.postWish}
            <Send size={15} />
          </button>
          <p className="form-status" role="status">
            {status ? t[status] : ""}
          </p>
        </form>
      </div>
    </section>
  );
}

export default function WeddingInvitation({ side }: { side: InvitationSide }) {
  const invitation = getInvitation(side);
  const navLinks = [
    { label: t.navInvitation, href: "#invitation" },
    { label: t.navCelebration, href: "#celebration" },
    { label: t.navFamilies, href: "#families" },
    { label: t.navWishes, href: "#wishes" },
  ];
  const [menuOpen, setMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const dialogRef = useRef<HTMLDialogElement>(null);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (copyTimer.current) clearTimeout(copyTimer.current);
    },
    [],
  );
  useEffect(() => {
    if (!menuOpen) return;
    const close = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [menuOpen]);

  async function shareInvitation() {
    const url = window.location.origin + invitation.path;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${invitation.heading} | ${invitation.label}`,
          text: t.shareMessage,
          url,
        });
        return;
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") return;
      }
    }
    setShareUrl(url);
    setCopied(false);
    dialogRef.current?.showModal();
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      if (copyTimer.current) clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopied(false), 3000);
    } catch {
      dialogRef.current?.querySelector("input")?.select();
    }
  }

  return (
    <>
      <a className="skip-link" href="#main">
        {t.skipInvitation}
      </a>
      <header className="site-header">
        <div className="header-inner">
          <a
            className="brand"
            href="#invitation"
            aria-label={`${invitation.signature}, ${t.backInvitation}`}
          >
            <span className="brand-monogram">
              {invitation.first.initial}
              <span>{t.and}</span>
              {invitation.second.initial}
            </span>
            <span className="brand-caption">
              {invitation.label}
              <br />
              28 . 12 . 2026
            </span>
          </a>
          <nav className="desktop-nav" aria-label={t.mainNav}>
            {navLinks.map((link) => (
              <a key={link.href} href={link.href}>
                {link.label}
              </a>
            ))}
          </nav>
          <div className="header-actions">
            <button
              className="share-button"
              onClick={shareInvitation}
              aria-label={t.share}
            >
              <Share2 size={14} />
              <span>{t.share}</span>
            </button>
            <button
              className="menu-toggle"
              aria-label={menuOpen ? t.closeNav : t.openNav}
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
        {menuOpen && (
          <nav
            id="mobile-navigation"
            className="mobile-nav"
            aria-label={t.mobileNav}
          >
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
                <ArrowUpRight size={16} />
              </a>
            ))}
            <a href="#location" onClick={() => setMenuOpen(false)}>
              {t.findVenue}
              <ArrowUpRight size={16} />
            </a>
          </nav>
        )}
      </header>

      <main id="main">
        <section
          id="invitation"
          className="hero section-container"
          aria-labelledby="couple-names"
        >
          <div className="hero-copy">
            <div className="invitation-kicker">
              <span />
              {invitation.hostMessage}
              <span />
            </div>
            <p className="hero-intro">{t.heroIntro}</p>
            <h1 id="couple-names" aria-label={invitation.heading}>
              <span className="couple-name">
                {invitation.first.firstName}{" "}
                <span className="surname">{invitation.first.surname}</span>
              </span>
              <span className="name-and name-weds">{t.weds}</span>
              <span className="couple-name">
                {invitation.second.firstName}{" "}
                <span className="surname">{invitation.second.surname}</span>
              </span>
            </h1>
            <p className="hero-message">
              {t.heroMessage}
              <br />
              {t.heroMessageEnd}
            </p>
            <div className="hero-date">
              <span>
                {t.monday}
                <br />
                <strong>{t.december}</strong>
              </span>
              <span className="date-number">28</span>
              <span>
                2026
                <br />
                <strong>{t.atTime}</strong>
              </span>
            </div>
            <p className="hero-location">
              <MapPin size={14} />
              {t.venue}
            </p>
            <a className="button button-primary" href="#celebration">
              {t.invited}
              <ArrowDown size={15} />
            </a>
          </div>
          <div className="hero-art" aria-label={t.artLabel}>
            <div className="arch-outline" />
            <div className="art-arch">
              <p className="arch-topline">{t.archTop}</p>
              <p className="arch-script">{t.archScript}</p>
              <CulturalBlessing />
              <span className="arch-date">28 . 12 . 2026</span>
            </div>
            <Floral className="hero-garland" garland priority />
            <Image
              className="couple-illustration"
              src="/images/couple.png"
              alt={t.coupleAlt}
              width={439}
              height={447}
              priority
              sizes="(max-width: 600px) 56vw, 290px"
            />
            <Floral className="hero-floral-left" priority />
            <Floral className="hero-floral-right" priority />
            <div className="art-caption">
              <span />
              {t.artCaption}
              <span />
            </div>
          </div>
          <a className="hero-scroll" href="#celebration">
            <span>{t.rememberDay}</span>
            <ArrowDown size={14} />
          </a>
        </section>

        <div className="date-ribbon">
          <span>{t.withLove}</span>
          <Heart size={12} />
          <p>{t.ribbon}</p>
          <Heart size={12} />
          <span>{t.withYou}</span>
        </div>

        <section id="celebration" className="celebration section-space">
          <div className="section-container">
            <div className="section-heading">
              <p className="eyebrow">{t.saveDate}</p>
              <h2>
                {t.celebrationTitle} <em>{t.celebrationEmphasis}</em>
              </h2>
              <p>{t.celebrationMessage}</p>
              <p className="traditions-caption">{t.traditions}</p>
            </div>
            <div className="celebration-grid">
              <div className="calendar-sheet">
                <p>{t.monthYear}</p>
                <div className="calendar-week" aria-hidden="true">
                  {t.weekdays.map((v, i) => (
                    <span key={i}>{v}</span>
                  ))}
                </div>
                <div className="calendar-days" aria-label={t.calendarLabel}>
                  <span aria-hidden="true" />
                  {Array.from({ length: 31 }, (_, i) => (
                    <span key={i} className={i === 27 ? "wedding-day" : ""}>
                      {i + 1}
                      {i === 27 && (
                        <Heart size={40} strokeWidth={1} aria-hidden="true" />
                      )}
                    </span>
                  ))}
                </div>
                <p className="calendar-footnote">{t.calendarFootnote}</p>
              </div>
              <div className="ceremony-details">
                <div className="ceremony-icon">
                  <Church size={30} strokeWidth={1} />
                </div>
                <p className="eyebrow">{t.ceremony}</p>
                <h3>
                  {t.ceremonyTitle}
                  <br />
                  {t.ceremonyEnd}
                </h3>
                <div className="ceremony-facts">
                  <p>
                    <CalendarDays size={17} />
                    <span>
                      {t.fullDate}
                      <br />
                      <strong>{t.timeZone}</strong>
                    </span>
                  </p>
                  <p>
                    <MapPin size={17} />
                    <span>
                      {t.venue}
                      <br />
                      <strong>{t.address}</strong>
                    </span>
                  </p>
                </div>
                <div className="ceremony-actions">
                  <a href="/wedding.ics" download className="text-link">
                    {t.addCalendar}
                    <ArrowUpRight size={16} />
                  </a>
                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-link"
                  >
                    {t.directions}
                    <ArrowUpRight size={16} />
                  </a>
                </div>
              </div>
            </div>
            <Countdown />
          </div>
        </section>

        <section id="families" className="families-section section-space">
          <Floral className="family-floral-left" />
          <Floral className="family-floral-right" />
          <div className="section-container">
            <div className="section-heading">
              <p className="eyebrow">{t.familyEyebrow}</p>
              <h2>
                {t.familyTitle}
                <br />
                {t.familyMiddle} <em>{t.familyEmphasis}</em>
              </h2>
              <p>{t.familyMessage}</p>
            </div>
            <div className="families-grid">
              {invitation.familyOrder.map((familySide, index) => {
                const family = families[familySide];
                return (
                  <div className="family" key={familySide}>
                    <span className="family-number">0{index + 1}</span>
                    <p className="eyebrow">{family.label}</p>
                    <h3>
                      {family.parentNames[0]} <span>{t.and}</span>{" "}
                      {family.parentNames[1]}
                    </h3>
                    <p>
                      {family.parents.map((parent) => (
                        <span className="family-line" key={parent}>
                          {parent}
                        </span>
                      ))}
                    </p>
                    <div className="family-rule" />
                    <p className="family-siblings">
                      {family.siblings.map((sibling) => (
                        <span className="family-line" key={sibling}>
                          {sibling}
                        </span>
                      ))}
                    </p>
                  </div>
                );
              })}
            </div>
            <div className="little-angels">
              <Heart size={18} strokeWidth={1} />
              <p className="script-text">{t.angels}</p>
              <p>
                {t.angelNames.map((name, index) => (
                  <span key={name} style={{ padding: 0 }}>
                    {index > 0 && <span aria-hidden="true"> · </span>}
                    {name}
                  </span>
                ))}
              </p>
              <small>{t.angelsMessage}</small>
            </div>
          </div>
        </section>

        <section id="story" className="story-section section-space">
          <div className="section-container story-grid">
            <div className="story-art">
              <div className="story-circle">
                <span>8</span>
                <p>{t.years}</p>
              </div>
              <Floral className="story-floral" garland />
              <span className="story-art-caption">{t.lifetime}</span>
            </div>
            <div className="story-copy">
              <p className="eyebrow">{t.storyEyebrow}</p>
              <h2>
                {t.storyTitle}
                <br />
                {t.storyMiddle} <em>{t.storyEmphasis}</em>
              </h2>
              <p>{t.storyFirst}</p>
              <p>{t.storySecond}</p>
              <span className="story-signature">{invitation.signature}</span>
              <a className="text-link" href="#wishes">
                {t.storyAction}
                <ArrowRight size={16} />
              </a>
            </div>
          </div>
        </section>

        <Guestbook />

        <section id="location" className="location-section section-space">
          <div className="section-container">
            <div className="section-heading">
              <p className="eyebrow">{t.locationEyebrow}</p>
              <h2>
                {t.locationTitle} <em>{t.locationEmphasis}</em>
              </h2>
              <p>{t.locationMessage}</p>
            </div>
            <div className="venue-panel">
              <div className="venue-info">
                <Church size={37} strokeWidth={1} />
                <p className="eyebrow">{t.venueLabel}</p>
                <h3>
                  {t.churchName}
                  <br />
                  {t.church}
                </h3>
                <p>
                  {t.po}
                  <br />
                  {t.region}
                </p>
                <div className="venue-date">
                  {t.date}
                  <span>·</span>
                  {t.shortTimeZone}
                </div>
                <a
                  className="button button-primary"
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Navigation size={15} />
                  {t.findWay}
                </a>
                <a
                  className="text-link apple-maps"
                  href="https://maps.apple.com/?daddr=St.+Sebastian%27s+Church,+Koodaranji,+Kerala"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t.appleMaps}
                  <ArrowUpRight size={14} />
                </a>
              </div>
              <div className="venue-map">
                <iframe
                  title={t.mapTitle}
                  src="https://maps.google.com/maps?q=St.%20Sebastian%27s%20Church%2C%20Koodaranji%2C%20Kerala&z=15&output=embed"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
                <a
                  className="map-fallback"
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MapPin size={14} />
                  {t.googleMaps}
                  <ArrowUpRight size={14} />
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="closing-section">
          <Floral className="closing-garland" garland />
          <p className="eyebrow">{t.closingEyebrow}</p>
          <h2>
            {t.closingTitle}
            <br />
            <em>{t.closingEmphasis}</em>
          </h2>
          <p>{t.withLoveSignoff}</p>
          <span className="closing-signature">{invitation.signature}</span>
          <CulturalBlessing />
          <a
            className="text-link"
            href={invitation.pdfPath}
            download={invitation.pdfFilename}
          >
            <Download size={15} />
            {invitation.pdfLabel}
            <ArrowUpRight size={15} />
          </a>
        </section>
      </main>

      <footer className="site-footer">
        <a
          className="footer-monogram"
          href="#invitation"
          aria-label={t.backTop}
        >
          {invitation.first.initial} {t.and} {invitation.second.initial}
        </a>
        <p>{t.footer}</p>
        <span>
          28 . 12 . 2026 <Heart size={11} />
        </span>
      </footer>

      <dialog
        ref={dialogRef}
        className="share-dialog"
        onKeyDown={(e) => {
          if (e.key === "Escape") dialogRef.current?.close();
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) dialogRef.current?.close();
        }}
        aria-labelledby="share-title"
      >
        <button
          className="dialog-close"
          onClick={() => dialogRef.current?.close()}
          aria-label={t.closeShare}
        >
          <X size={20} />
        </button>
        <Heart size={28} strokeWidth={1} />
        <h2 id="share-title">{t.shareHeading}</h2>
        <p>{t.shareDescription}</p>
        <label htmlFor="share-url">{t.shareLink}</label>
        <input
          id="share-url"
          value={shareUrl}
          readOnly
          onFocus={(e) => e.target.select()}
        />
        <button className="button button-primary" onClick={copyLink}>
          {copied ? <Check size={16} /> : <Copy size={16} />}
          {copied ? t.copied : t.copyLink}
        </button>
        <p role="status" className="copy-status">
          {copied ? t.copyReady : t.copyHint}
        </p>
      </dialog>
    </>
  );
}
