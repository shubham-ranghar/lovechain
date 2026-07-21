import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { PageShell } from "../components/PageShell";
import { HeartBurst } from "../components/Particles";
import { useCouple } from "@/contexts/CoupleContext";

export const Route = createFileRoute("/compliments")({
  head: () => ({
    meta: [
      { title: "Compliment Machine — Always Us" },
      { name: "description", content: "A little dose of love, on tap." },
      { property: "og:title", content: "Compliment Machine — Always Us" },
      { property: "og:description", content: "A little dose of love, on tap." },
    ],
  }),
  component: ComplimentsPage,
});

function ComplimentsPage() {
  const { couple } = useCouple();
  const LINES = couple?.content?.compliments || [
    "Your laugh is my favorite sound.",
    "You make ordinary Tuesdays feel like holidays.",
    "I love the way you scrunch your nose.",
    "You are the plot twist I hoped for.",
    "Even your sleepy voice is beautiful.",
    "You're the best decision I've ever made.",
    "Remember that thing you did? Still thinking about it.",
    "You make me want to be softer.",
    "I love how you argue about pizza toppings.",
    "You are home.",
    "Your kindness rearranges rooms.",
    "You dance like nobody's judging — because I'm not.",
    "You're my favorite hello and my hardest goodbye.",
    "You smell like every good memory I have.",
    "You're proof the universe pays attention.",
    "The sun's jealous of the way you glow.",
    "I'd pick you. In every lifetime. Every time.",
    "You're my inside joke and my favorite quote.",
  ];
  const [i, setI] = useState(-1);
  const [taps, setTaps] = useState(0);
  const [burst, setBurst] = useState(false);

  const tap = () => {
    let n = i;
    while (n === i) n = Math.floor(Math.random() * LINES.length);
    setI(n);
    const next = taps + 1;
    setTaps(next);
    if (next % 5 === 0) {
      setBurst(true);
      setTimeout(() => setBurst(false), 1800);
    }
  };

  return (
    <PageShell>
      <div className="mx-auto max-w-xl text-center">
        <h1 className="text-5xl sm:text-6xl text-soft-red">Compliment Machine</h1>
        <p className="mt-3 text-muted-foreground">One tap. One little truth. 💌</p>

        <div className="mt-12 min-h-[180px] grid place-items-center">
          <AnimatePresence mode="wait">
            {i >= 0 && (
              <motion.div
                key={i + "-" + taps}
                initial={{ rotateY: 90, opacity: 0 }}
                animate={{ rotateY: 0, opacity: 1 }}
                exit={{ rotateY: -90, opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="rounded-3xl bg-card/95 border border-border shadow-soft px-8 py-10 backdrop-blur"
              >
                <p className="font-script text-3xl text-soft-red leading-snug">{LINES[i]}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button
          onClick={tap}
          className="mt-8 rounded-full bg-soft-red text-primary-foreground px-8 py-4 text-lg font-semibold shadow-soft hover:scale-105 transition-transform animate-heartbeat"
        >
          Tap for a compliment
        </button>
        <p className="mt-3 text-xs text-muted-foreground">Taps: {taps}</p>
      </div>
      <HeartBurst show={burst} />
    </PageShell>
  );
}
