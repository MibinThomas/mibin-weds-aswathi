"use client";

import { useState, useEffect } from "react";
import { MessageSquare, Heart, Send, Sparkles } from "lucide-react";

interface Wish {
  id: string;
  author: string;
  relation: string;
  message: string;
  likes: number;
  date: string;
}

export default function GuestbookSection() {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [newAuthor, setNewAuthor] = useState("");
  const [newRelation, setNewRelation] = useState("Friend");
  const [newMessage, setNewMessage] = useState("");

  const initialWishes: Wish[] = [
    {
      id: "w1",
      author: "Rahul & Sneha",
      relation: "College Friends",
      message:
        "We still remember the college days when Achu proposed and Mibin was playing hard to get! 8 years later, look at you both. So happy for you two!",
      likes: 12,
      date: "14 Sep 2026",
    },
    {
      id: "w2",
      author: "Dr. Jacob Varghese",
      relation: "Family Friend",
      message:
        "Wishing Mibin and Aswathi a lifetime filled with love, laughter, and togetherness. May God bless your union at St. Sebastian's Church!",
      likes: 9,
      date: "12 Sep 2026",
    },
    {
      id: "w3",
      author: "Priya Nair",
      relation: "Achu's Cousin",
      message:
        "Watching your love story blossom over 8 years has been such a joy. Can't wait to dance at the wedding on Dec 28th!",
      likes: 15,
      date: "10 Sep 2026",
    },
  ];

  useEffect(() => {
    try {
      const stored = localStorage.getItem("wedding_wishes");
      if (stored) {
        setWishes(JSON.parse(stored));
      } else {
        setWishes(initialWishes);
      }
    } catch {
      setWishes(initialWishes);
    }
  }, []);

  const handleLike = (id: string) => {
    const updated = wishes.map((w) =>
      w.id === id ? { ...w, likes: w.likes + 1 } : w
    );
    setWishes(updated);
    try {
      localStorage.setItem("wedding_wishes", JSON.stringify(updated));
    } catch {
      // Local storage fallback
    }
  };

  const handleAddWish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAuthor.trim() || !newMessage.trim()) return;

    const createdWish: Wish = {
      id: "w-" + Date.now(),
      author: newAuthor.trim(),
      relation: newRelation,
      message: newMessage.trim(),
      likes: 1,
      date: "Just now",
    };

    const updated = [createdWish, ...wishes];
    setWishes(updated);
    try {
      localStorage.setItem("wedding_wishes", JSON.stringify(updated));
    } catch {
      // Local storage fallback
    }

    setNewAuthor("");
    setNewMessage("");
  };

  return (
    <section id="wishes" className="py-20 px-4 max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-4 mb-14">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-100 dark:bg-rose-950/50 border border-rose-300/40 text-xs font-semibold text-rose-700 dark:text-rose-300 uppercase tracking-widest">
          <MessageSquare className="w-3.5 h-3.5 text-rose-500" />
          <span>Warm Blessings</span>
        </div>
        <h2 className="font-serif text-4xl sm:text-5xl font-bold text-foreground">
          Guestbook & Wishes
        </h2>
        <p className="text-muted-foreground max-w-lg mx-auto text-sm sm:text-base font-light">
          Leave a note of congratulations or share your favorite memory of Mibin & Achu!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Column */}
        <div className="lg:col-span-1 p-6 rounded-3xl glass-card border border-amber-300/40 h-fit space-y-4">
          <h3 className="font-serif text-xl font-bold text-foreground flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <span>Leave Your Blessing</span>
          </h3>

          <form onSubmit={handleAddWish} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Your Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Alex & Maya"
                value={newAuthor}
                onChange={(e) => setNewAuthor(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground text-sm focus:outline-none focus:border-primary"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Relationship
              </label>
              <select
                value={newRelation}
                onChange={(e) => setNewRelation(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground text-sm focus:outline-none focus:border-primary"
              >
                <option value="Friend">College Friend</option>
                <option value="Family">Family Member</option>
                <option value="Colleague">Colleague</option>
                <option value="Well Wisher">Well Wisher</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Your Wish *
              </label>
              <textarea
                rows={4}
                required
                placeholder="Write your heartful wishes..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground text-sm focus:outline-none focus:border-primary"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-full bg-primary text-primary-foreground font-semibold text-xs shadow-md hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Post Wish</span>
            </button>
          </form>
        </div>

        {/* Wishes Wall Feed */}
        <div className="lg:col-span-2 space-y-4">
          {wishes.map((wish) => (
            <div
              key={wish.id}
              className="p-6 rounded-3xl glass-card border border-amber-200/50 hover:border-amber-400 transition-all space-y-3 relative group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-serif font-bold text-lg text-foreground">
                    {wish.author}
                  </h4>
                  <span className="text-[11px] font-semibold text-rose-500 uppercase tracking-wider">
                    {wish.relation}
                  </span>
                </div>
                <span className="text-[10px] text-muted-foreground">{wish.date}</span>
              </div>

              <p className="text-sm font-light text-muted-foreground leading-relaxed italic">
                &ldquo;{wish.message}&rdquo;
              </p>

              <div className="pt-2 flex items-center justify-end">
                <button
                  onClick={() => handleLike(wish.id)}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-300 text-xs font-semibold hover:scale-105 transition-transform"
                >
                  <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                  <span>{wish.likes}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
