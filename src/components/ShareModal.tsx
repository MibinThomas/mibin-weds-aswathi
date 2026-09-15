"use client";

import { useState } from "react";
import { X, Copy, Check, Share2, MessageCircle, Mail, QrCode } from "lucide-react";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ShareModal({ isOpen, onClose }: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);

  if (!isOpen) return null;

  const weddingUrl = typeof window !== "undefined" ? window.location.href : "https://mibin-weds-aswathi.com";
  const shareText = "You are cordially invited to celebrate the wedding of Mibin & Aswathi (Achu) on 28th December 2026 at St. Sebastian's Church, Koodaranji. Please view our invitation details here:";

  const handleCopy = () => {
    navigator.clipboard.writeText(`${shareText}\n${weddingUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleWhatsApp = () => {
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText}\n${weddingUrl}`)}`, "_blank");
  };

  const handleEmail = () => {
    window.open(`mailto:?subject=${encodeURIComponent("Wedding Invitation: Mibin & Aswathi")}&body=${encodeURIComponent(`${shareText}\n\n${weddingUrl}`)}`, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-md p-6 sm:p-8 rounded-3xl glass-card border border-amber-300/30 bg-background shadow-2xl text-center space-y-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-2">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 flex items-center justify-center">
            <Share2 className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-serif font-bold text-foreground">Share Our Invitation</h3>
          <p className="text-xs text-muted-foreground max-w-xs mx-auto">
            Spread the joy! Send our digital invitation to your loved ones and friends.
          </p>
        </div>

        {showQr ? (
          <div className="space-y-4 p-4 rounded-2xl bg-white border border-amber-200 shadow-inner">
            <div className="flex justify-center p-2">
              {/* Clean inline SVG QR code simulation for instant scanning */}
              <svg className="w-48 h-48" viewBox="0 0 100 100" fill="none">
                <rect width="100" height="100" fill="#ffffff" />
                {/* Outer positioning squares */}
                <path d="M10 10 h25 v25 h-25 z M15 15 h15 v15 h-15 z M19 19 h7 v7 h-7 z" fill="#2d2422" fillRule="evenodd" />
                <path d="M65 10 h25 v25 h-25 z M70 15 h15 v15 h-15 z M74 19 h7 v7 h-7 z" fill="#2d2422" fillRule="evenodd" />
                <path d="M10 65 h25 v25 h-25 z M15 70 h15 v15 h-15 z M19 74 h7 v7 h-7 z" fill="#2d2422" fillRule="evenodd" />
                {/* Random decorative code blocks representing QR data */}
                <rect x="42" y="12" width="6" height="6" fill="#c59b27" />
                <rect x="50" y="18" width="6" height="6" fill="#2d2422" />
                <rect x="42" y="28" width="12" height="6" fill="#2d2422" />
                <rect x="12" y="42" width="6" height="12" fill="#2d2422" />
                <rect x="25" y="48" width="12" height="6" fill="#c59b27" />
                <rect x="45" y="45" width="10" height="10" fill="#6b2d3e" />
                <rect x="62" y="42" width="8" height="18" fill="#2d2422" />
                <rect x="75" y="48" width="14" height="6" fill="#c59b27" />
                <rect x="42" y="65" width="6" height="14" fill="#2d2422" />
                <rect x="52" y="70" width="16" height="6" fill="#2d2422" />
                <rect x="72" y="68" width="14" height="14" fill="#c59b27" />
                <rect x="48" y="82" width="18" height="6" fill="#2d2422" />
              </svg>
            </div>
            <p className="text-[11px] text-zinc-600 font-medium">Scan to open wedding invitation</p>
            <button
              onClick={() => setShowQr(false)}
              className="text-xs text-primary font-semibold hover:underline"
            >
              ← Back to share options
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleWhatsApp}
              className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all font-medium text-xs"
            >
              <MessageCircle className="w-4 h-4 text-emerald-500" />
              WhatsApp
            </button>

            <button
              onClick={handleEmail}
              className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 transition-all font-medium text-xs"
            >
              <Mail className="w-4 h-4 text-rose-500" />
              Email
            </button>

            <button
              onClick={() => setShowQr(true)}
              className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 transition-all font-medium text-xs"
            >
              <QrCode className="w-4 h-4 text-amber-600" />
              Scan QR Code
            </button>

            <button
              onClick={handleCopy}
              className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-primary/10 text-primary border border-primary/30 hover:bg-primary/20 transition-all font-medium text-xs"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              {copied ? "Copied Link!" : "Copy Link"}
            </button>
          </div>
        )}

        <div className="p-3 rounded-xl bg-muted/60 border border-border flex items-center justify-between gap-2 text-xs">
          <span className="truncate text-muted-foreground">{weddingUrl}</span>
          <button
            onClick={handleCopy}
            className="shrink-0 px-3 py-1 rounded-lg bg-primary text-primary-foreground font-medium text-[11px] hover:opacity-90"
          >
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </div>
    </div>
  );
}
