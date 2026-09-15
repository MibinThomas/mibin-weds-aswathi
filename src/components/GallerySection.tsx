"use client";

import { useState } from "react";
import { Image as ImageIcon, Heart, X, ZoomIn, Sparkles } from "lucide-react";

interface Photo {
  id: number;
  title: string;
  category: "College Days" | "Our Journey" | "Pre-Wedding";
  caption: string;
  url: string;
}

export default function GallerySection() {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  const photos: Photo[] = [
    {
      id: 1,
      title: "College Corridors",
      category: "College Days",
      caption: "Where senior Mibin & junior Achu first crossed paths in 2018.",
      url: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1000&q=80",
    },
    {
      id: 2,
      title: "The First Smile",
      category: "College Days",
      caption: "Achu's courageous heart and warm smile that started it all.",
      url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1000&q=80",
    },
    {
      id: 3,
      title: "Sunset Moments",
      category: "Our Journey",
      caption: "Eight years of walking hand in hand through every season.",
      url: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=80",
    },
    {
      id: 4,
      title: "Shared Laughs",
      category: "Our Journey",
      caption: "Building memories filled with joy and mutual understanding.",
      url: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1000&q=80",
    },
    {
      id: 5,
      title: "Golden Hour Promises",
      category: "Pre-Wedding",
      caption: "Counting down to December 28, 2026.",
      url: "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=1000&q=80",
    },
    {
      id: 6,
      title: "Forever Begins",
      category: "Pre-Wedding",
      caption: "Ready for our holy matrimony at St. Sebastian's Church.",
      url: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1000&q=80",
    },
  ];

  const categories = ["All", "College Days", "Our Journey", "Pre-Wedding"];

  const filteredPhotos =
    activeCategory === "All"
      ? photos
      : photos.filter((p) => p.category === activeCategory);

  return (
    <section id="gallery" className="py-20 px-4 max-w-6xl mx-auto">
      {/* Section Header */}
      <div className="text-center space-y-4 mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-100 dark:bg-rose-950/50 border border-rose-300/40 text-xs font-semibold text-rose-700 dark:text-rose-300 uppercase tracking-widest">
          <ImageIcon className="w-3.5 h-3.5 text-rose-500" />
          <span>Captured Moments</span>
        </div>
        <h2 className="font-serif text-4xl sm:text-5xl font-bold text-foreground">
          Our Memory Gallery
        </h2>
        <p className="text-muted-foreground max-w-lg mx-auto text-sm sm:text-base font-light">
          Snapshots of our 8-year love story. (You can easily add your own photographs here!)
        </p>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-xs font-semibold tracking-wider transition-all duration-300 ${
                activeCategory === cat
                  ? "bg-primary text-primary-foreground shadow-md scale-105"
                  : "glass text-muted-foreground hover:text-foreground border border-border"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Polaroid Memory Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPhotos.map((photo) => (
          <div
            key={photo.id}
            onClick={() => setSelectedPhoto(photo)}
            className="group cursor-pointer p-4 rounded-3xl bg-white dark:bg-card border border-amber-200/60 dark:border-border shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 relative overflow-hidden"
          >
            {/* Polaroid Frame */}
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-zinc-100">
              <img
                src={photo.url}
                alt={photo.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white gap-2">
                <ZoomIn className="w-6 h-6" />
                <span className="text-xs font-semibold uppercase tracking-wider">View Photo</span>
              </div>
            </div>

            {/* Photo Caption */}
            <div className="pt-4 px-2 space-y-1">
              <div className="flex items-center justify-between">
                <h3 className="font-serif font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                  {photo.title}
                </h3>
                <span className="text-[10px] font-semibold uppercase tracking-widest text-rose-500 px-2 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/40">
                  {photo.category}
                </span>
              </div>
              <p className="text-xs text-muted-foreground font-light italic">
                {photo.caption}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="relative max-w-3xl w-full bg-background rounded-3xl overflow-hidden border border-amber-300/40 shadow-2xl">
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative aspect-[16/10] bg-black">
              <img
                src={selectedPhoto.url}
                alt={selectedPhoto.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-6 space-y-2 bg-background">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-2xl font-bold text-foreground">
                  {selectedPhoto.title}
                </h3>
                <span className="text-xs font-semibold text-rose-500 flex items-center gap-1">
                  <Heart className="w-3.5 h-3.5 fill-rose-500" />
                  {selectedPhoto.category}
                </span>
              </div>
              <p className="text-sm text-muted-foreground font-light leading-relaxed">
                {selectedPhoto.caption}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
