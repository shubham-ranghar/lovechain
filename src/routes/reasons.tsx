import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Shuffle } from "lucide-react";
import { useState } from "react";
import { PageShell } from "@/components/PageShell";

export const Route = createFileRoute("/reasons")({
  component: ReasonsPage,
});

// EDIT: your real reasons
const INITIAL = [
  "Your smile lights up every room.",
  "The way you laugh at your own jokes.",
  "How you care about the tiniest things.",
  "Your kindness to strangers.",
  "The way you say my name.",
  "You make ordinary days feel special.",
  "Your bravery when things get hard.",
  "The way you dance in the kitchen.",
  "Your ridiculous, wonderful playlists.",
  "How safe I feel around you.",
  "Your curiosity about the world.",
  "The little notes you leave.",
];

function ReasonsPage() {
  const [cards, setCards] = useState(INITIAL);
  const [flipped, setFlipped] = useState<Set<number>>(new Set());

  const shuffle = () => {
    setCards((prev) => [...prev].sort(() => Math.random() - 0.5));
    setFlipped(new Set());
  };

  const flip = (i: number) => {
    setFlipped((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  return (
    <PageShell>
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <h1 className="font-script text-5xl sm:text-6xl text-soft-red">
            Reasons I Love You
          </h1>
          <button
            onClick={shuffle}
            className="inline-flex items-center gap-2 self-start rounded-full bg-soft-red px-6 py-3 text-primary-foreground font-medium shadow-soft hover:shadow-glow transition-shadow min-h-[44px]"
          >
            <Shuffle className="w-4 h-4" /> Shuffle
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {cards.map((reason, i) => {
            const isFlipped = flipped.has(i);
            return (
              <motion.button
                key={reason}
                layout
                onClick={() => flip(i)}
                className="relative aspect-[3/4] [perspective:1000px]"
              >
                <motion.div
                  className="relative w-full h-full [transform-style:preserve-3d]"
                  animate={{ rotateY: isFlipped ? 180 : 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="absolute inset-0 [backface-visibility:hidden] rounded-2xl bg-gradient-to-br from-blush to-rose grid place-items-center shadow-soft">
                    <span className="font-script text-4xl text-cream">#{i + 1}</span>
                  </div>
                  <div className="absolute inset-0 [transform:rotateY(180deg)] [backface-visibility:hidden] rounded-2xl bg-card p-4 grid place-items-center text-center shadow-soft border border-border">
                    <p className="text-sm text-foreground/90">{reason}</p>
                  </div>
                </motion.div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </PageShell>
  );
}
