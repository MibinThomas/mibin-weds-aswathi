"use client";

import LoadingCurtain from "@/components/LoadingCurtain";
import PetalBackground from "@/components/PetalBackground";
import AudioPlayer from "@/components/AudioPlayer";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import StorySection from "@/components/StorySection";
import EventDetails from "@/components/EventDetails";
import GallerySection from "@/components/GallerySection";
import GuestbookSection from "@/components/GuestbookSection";
import MapSection from "@/components/MapSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Intro Curtain */}
      <LoadingCurtain />

      {/* Floating Rose Petals & Bokeh Background */}
      <PetalBackground />

      {/* Ambient Audio Player */}
      <AudioPlayer />

      {/* Navigation Bar */}
      <Navbar />

      {/* Main Page Content */}
      <div className="relative z-10 space-y-8">
        <HeroSection />

        <div className="w-full max-w-5xl mx-auto px-4">
          <div className="h-px bg-gradient-to-r from-transparent via-amber-300/40 to-transparent" />
        </div>

        <StorySection />

        <div className="w-full max-w-5xl mx-auto px-4">
          <div className="h-px bg-gradient-to-r from-transparent via-rose-300/40 to-transparent" />
        </div>

        <EventDetails />

        <div className="w-full max-w-5xl mx-auto px-4">
          <div className="h-px bg-gradient-to-r from-transparent via-amber-300/40 to-transparent" />
        </div>

        <GallerySection />

        <div className="w-full max-w-5xl mx-auto px-4">
          <div className="h-px bg-gradient-to-r from-transparent via-rose-300/40 to-transparent" />
        </div>

        <GuestbookSection />


        <div className="w-full max-w-5xl mx-auto px-4">
          <div className="h-px bg-gradient-to-r from-transparent via-rose-300/40 to-transparent" />
        </div>

        <MapSection />
      </div>

      {/* Footer */}
      <Footer />
    </main>
  );
}
