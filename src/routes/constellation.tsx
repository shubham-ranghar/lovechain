import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { PageShell } from "../components/PageShell";

export const Route = createFileRoute("/constellation")({
  head: () => ({
    meta: [
      { title: "Our Constellation — Always Us" },
      { name: "description", content: "The stars know our story." },
      { property: "og:title", content: "Our Constellation — Always Us" },
      { property: "og:description", content: "The stars know our story." },
    ],
  }),
  component: ConstellationPage,
});

/* EDIT: heart-shaped constellation coordinates + memories */
const HEART = [
  { x: 30, y: 35, memory: "The night we first talked till sunrise." },
  { x: 40, y: 25, memory: "Your text: 'Get home safe.'" },
  { x: 50, y: 35, memory: "The kiss under the streetlight." },
  { x: 60, y: 25, memory: "You laughing at your own joke." },
  { x: 70, y: 35, memory: "The playlist you made me." },
  { x: 75, y: 50, memory: "Rainy Sunday, blanket, tea." },
  { x: 65, y: 65, memory: "'I love you' — the first time." },
  { x: 50, y: 78, memory: "This exact moment, right now." },
  { x: 35, y: 65, memory: "Dancing badly in the kitchen." },
  { x: 25, y: 50, memory: "You. Always you." },
];

function ConstellationPage() {
  const stars = useMemo(
    () => Array.from({ length: 80 }).map(() => ({
      x: Math.random() * 100, y: Math.random() * 100, s: 0.5 + Math.random() * 1.5, d: Math.random() * 3,
    })),
    []
  );
  const [active, setActive] = useState<number | null>(null);

  const path = HEART.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ") + " Z";

  return (
    <PageShell>
      <div className="mx-auto max-w-4xl">
        <h1 className="text-center text-5xl sm:text-6xl text-cream drop-shadow">Our Constellation</h1>
        <p className="mt-3 text-center text-cream/70">Tap a star. Hear a memory. ⭐</p>

        <div className="relative mt-10 aspect-square w-full rounded-3xl overflow-hidden border border-border shadow-soft bg-[oklch(0.18_0.04_270)]">
          {/* twinkling background stars */}
          {stars.map((s, i) => (
            <motion.span
              key={i}
              className="absolute rounded-full bg-white"
              style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.s * 2, height: s.s * 2 }}
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{ repeat: Infinity, duration: 2 + s.d, delay: s.d }}
            />
          ))}

          {/* constellation line */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <motion.path
              d={path}
              fill="none"
              stroke="oklch(0.82 0.12 85)"
              strokeWidth="0.3"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.7 }}
              transition={{ duration: 3, ease: "easeInOut" }}
            />
          </svg>

          {/* constellation stars */}
          {HEART.map((p, i) => (
            <button
              key={i}
              onClick={() => setActive(active === i ? null : i)}
              style={{ left: `${p.x}%`, top: `${p.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 group"
              aria-label={`Memory ${i + 1}`}
            >
              <motion.span
                animate={{ scale: [1, 1.4, 1], opacity: [0.7, 1, 0.7] }}
                transition={{ repeat: Infinity, duration: 2, delay: i * 0.2 }}
                className="block h-3 w-3 rounded-full bg-gold shadow-[0_0_12px_oklch(0.82_0.12_85)]"
              />
              {active === i && (
                <motion.span
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap max-w-[70vw] rounded-lg bg-card/95 backdrop-blur border border-border px-3 py-1.5 text-xs text-foreground shadow-soft"
                >
                  {p.memory}
                </motion.span>
              )}
            </button>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
