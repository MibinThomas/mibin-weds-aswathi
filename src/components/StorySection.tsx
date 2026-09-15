"use client";

import { Heart, Sparkles, GraduationCap, Compass, Gem, Users } from "lucide-react";

export default function StorySection() {
  const milestones = [
    {
      year: "2018",
      tagline: "First Encounters in College",
      title: "Senior & Junior Sparks",
      description:
        "Our journey began back in our college days. Achu was my junior in college. Amidst bustling corridors, shared laughter, and college events, a quiet connection took root that would change our lives forever.",
      icon: GraduationCap,
      color: "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300",
      highlight: "College Days",
    },
    {
      year: "2019",
      tagline: "The Courageous Proposal",
      title: "When Love Found Its Voice",
      description:
        "Achu was the brave one who proposed first! At first, Mibin hesitated and declined, unsure of what lay ahead. But Achu's unwavering sincerity, kindness, and deep love never faded. Over time, Mibin realized the depth of her devotion and found himself completely in love with her.",
      icon: Heart,
      color: "bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300",
      highlight: "Pure Sincerity",
    },
    {
      year: "2018 - 2026",
      tagline: "8 Years of Love & Harmony",
      title: "Two Faiths, One Unbreakable Bond",
      description:
        "Coming from different religious traditions—Achu from a loving Hindu family and Mibin from a Christian family—our love became a bridge of understanding. Through eight wonderful years of laughter, growth, and shared dreams, our families stood by us with warmth and affection.",
      icon: Users,
      color: "bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300",
      highlight: "8-Year Journey",
    },
    {
      year: "28 Dec 2026",
      tagline: "The Forever Promise",
      title: "Our Wedding Day",
      description:
        "Now, after eight unforgettable years together, we stand on the threshold of a new beginning. We cannot wait to take our sacred wedding vows at St. Sebastian's Church, Koodaranji, surrounded by all our cherished family and friends.",
      icon: Gem,
      color: "bg-amber-500 text-white shadow-lg",
      highlight: "Beginning of Forever",
    },
  ];


  return (
    <section id="story" className="py-20 px-4 max-w-5xl mx-auto relative">
      {/* Header */}
      <div className="text-center space-y-4 mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-100 dark:bg-rose-950/50 border border-rose-300/40 text-xs font-semibold text-rose-700 dark:text-rose-300 uppercase tracking-widest">
          <Heart className="w-3.5 h-3.5 fill-rose-500" />
          <span>Our Love Story</span>
        </div>
        <h2 className="font-serif text-4xl sm:text-5xl font-bold text-foreground">
          Eight Years to Forever
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto text-sm sm:text-base font-light">
          From college corridors to sacred vows—a story built on patience, deep love, and the grace of family.
        </p>
      </div>

      {/* Timeline Vertical Track */}
      <div className="relative">
        <div className="hidden sm:block absolute left-1/2 top-4 bottom-4 w-0.5 bg-gradient-to-b from-amber-300 via-rose-300 to-amber-500 -translate-x-1/2" />

        <div className="space-y-12 sm:space-y-16">
          {milestones.map((item, index) => {
            const IconComponent = item.icon;
            const isEven = index % 2 === 0;

            return (
              <div
                key={index}
                className={`relative flex flex-col sm:flex-row items-center ${
                  isEven ? "sm:flex-row-reverse" : ""
                } gap-6 sm:gap-12`}
              >
                {/* Content Card */}
                <div className="w-full sm:w-1/2">
                  <div className="p-6 sm:p-8 rounded-3xl glass-card border border-amber-300/30 hover:border-amber-400 transition-all duration-300 shadow-md relative group">
                    <span className="text-[11px] font-bold uppercase tracking-widest text-primary px-3 py-1 rounded-full bg-amber-100/60 dark:bg-amber-950/50 inline-block mb-3">
                      {item.tagline}
                    </span>

                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-serif text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                        {item.title}
                      </h3>
                      <span className="font-serif text-sm font-semibold text-rose-500">
                        {item.year}
                      </span>
                    </div>

                    <p className="text-sm text-muted-foreground leading-relaxed font-light">
                      {item.description}
                    </p>

                    <div className="mt-4 pt-3 border-t border-border flex items-center gap-1.5 text-xs font-semibold text-amber-700 dark:text-amber-300">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{item.highlight}</span>
                    </div>
                  </div>
                </div>

                {/* Timeline Icon Node */}
                <div className="relative z-10 shrink-0 w-14 h-14 rounded-full border-4 border-background flex items-center justify-center shadow-lg transition-transform duration-300 hover:scale-110 text-xl font-bold ${item.color}">
                  <IconComponent className="w-6 h-6" />
                </div>

                {/* Empty Spacer Column for layout symmetry */}
                <div className="hidden sm:block w-1/2" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
