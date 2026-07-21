import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { PageShell } from "../components/PageShell";
import { useCouple } from "@/contexts/CoupleContext";

export const Route = createFileRoute("/garden")({
  head: () => ({
    meta: [
      { title: "Growing Together — Always Us" },
      { name: "description", content: "We grew, together." },
      { property: "og:title", content: "Growing Together — Always Us" },
      { property: "og:description", content: "We grew, together." },
    ],
  }),
  component: GardenPage,
});

function GardenPage() {
  const { couple } = useCouple();
  const STAGES = couple?.content?.gardenStages || [
    { label: "Seed", caption: "It started small — a shy hello, a nervous smile." },
    { label: "Sprout", caption: "Little green shoots: late-night texts, inside jokes." },
    { label: "Leaves", caption: "We learned each other's weather, and stayed anyway." },
    { label: "Bud", caption: "Something bigger, quieter, more certain took shape." },
    { label: "Bloom", caption: "And here we are — in full color, still growing." },
  ];
  const [stage, setStage] = useState(0);
  const grow = () => setStage((s) => Math.min(s + 1, STAGES.length - 1));
  const reset = () => setStage(0);

  return (
    <PageShell>
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-5xl sm:text-6xl text-soft-red">Growing Together</h1>
        <p className="mt-3 text-muted-foreground">Tap the earth. Watch us grow. 🌱</p>

        <div
          onClick={grow}
          className="mt-10 relative mx-auto h-80 w-full max-w-md rounded-3xl overflow-hidden border border-border shadow-soft bg-gradient-to-b from-sky-100/60 to-emerald-100/40 cursor-pointer"
        >
          {/* soil */}
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-b from-[oklch(0.55_0.08_60)] to-[oklch(0.4_0.06_60)]" />

          <div className="absolute inset-x-0 bottom-16 flex items-end justify-center">
            <Plant stage={stage} />
          </div>
        </div>

        <div className="mt-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={stage}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="font-script text-2xl text-soft-red"
            >
              {STAGES[stage].label}
            </motion.div>
          </AnimatePresence>
          <p className="mt-2 text-sm italic">{STAGES[stage].caption}</p>
        </div>

        <div className="mt-6 flex justify-center gap-3">
          <button onClick={grow} className="rounded-full bg-soft-red text-primary-foreground px-5 py-2 text-sm shadow-soft hover:scale-105 transition-transform">
            {stage === STAGES.length - 1 ? "Fully Bloomed 🌸" : "Grow"}
          </button>
          <button onClick={reset} className="rounded-full bg-card border border-border px-5 py-2 text-sm hover:bg-blush/40 transition-colors">
            Replay
          </button>
        </div>

        {stage === STAGES.length - 1 && (
          <motion.p
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-8 font-script text-3xl text-soft-red"
          >
            {/* EDIT: closing line */}
            "And still, we grow — together."
          </motion.p>
        )}
      </div>
    </PageShell>
  );
}

function Plant({ stage }: { stage: number }) {
  return (
    <svg viewBox="0 0 100 160" className="h-64 w-40">
      {/* stem */}
      <motion.line
        x1="50" y1="160" x2="50"
        stroke="oklch(0.55 0.12 145)"
        strokeWidth="3"
        strokeLinecap="round"
        initial={false}
        animate={{ y2: 160 - Math.min(stage, 4) * 30 }}
        transition={{ duration: 0.6 }}
      />
      {/* leaves */}
      {stage >= 2 && (
        <motion.g initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ transformOrigin: "50px 110px" }}>
          <ellipse cx="35" cy="110" rx="14" ry="7" fill="oklch(0.7 0.14 145)" transform="rotate(-25 35 110)" />
          <ellipse cx="65" cy="100" rx="14" ry="7" fill="oklch(0.7 0.14 145)" transform="rotate(25 65 100)" />
        </motion.g>
      )}
      {stage >= 3 && (
        <motion.circle
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          cx="50" cy={160 - stage * 30 - 4} r="6"
          fill="oklch(0.78 0.11 15)"
        />
      )}
      {stage >= 4 && (
        <motion.g
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 120 }}
          style={{ transformOrigin: `50px ${160 - stage * 30}px` }}
        >
          {[0, 72, 144, 216, 288].map((r) => (
            <ellipse
              key={r}
              cx="50" cy={160 - stage * 30 - 12}
              rx="8" ry="12"
              fill="oklch(0.78 0.13 15)"
              transform={`rotate(${r} 50 ${160 - stage * 30})`}
            />
          ))}
          <circle cx="50" cy={160 - stage * 30} r="5" fill="oklch(0.82 0.12 85)" />
        </motion.g>
      )}
    </svg>
  );
}
