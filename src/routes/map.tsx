import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { PageShell } from "../components/PageShell";

export const Route = createFileRoute("/map")({
  head: () => ({
    meta: [
      { title: "Map of Us — Always Us" },
      { name: "description", content: "The places that made us." },
      { property: "og:title", content: "Map of Us — Always Us" },
      { property: "og:description", content: "The places that made us." },
    ],
  }),
  component: MapPage,
});

/* EDIT: pin locations, photos, memories */
const PINS = [
  { x: 22, y: 35, label: "Where we met", memory: "The coffee shop on the corner. You spilled your latte and I fell in love.", photo: "" },
  { x: 55, y: 25, label: "First date", memory: "That tiny restaurant with the flickering candles.", photo: "" },
  { x: 70, y: 55, label: "Our favorite spot", memory: "The park bench under the old oak tree.", photo: "" },
  { x: 35, y: 70, label: "A trip we took", memory: "That weekend by the sea — salt in your hair.", photo: "" },
  { x: 80, y: 78, label: "Where we said 'I love you'", memory: "Right here. I remember every word.", photo: "" },
];

function MapPage() {
  const [active, setActive] = useState<number | null>(null);
  return (
    <PageShell>
      <div className="mx-auto max-w-5xl">
        <h1 className="text-center text-5xl sm:text-6xl text-soft-red">Map of Us</h1>
        <p className="mt-3 text-center text-muted-foreground">Every place that made us, us 🗺️</p>

        <div className="mt-10 relative aspect-[4/3] rounded-3xl overflow-hidden border border-border shadow-soft bg-gradient-to-br from-cream via-blush/40 to-rose/30">
          {/* stylized map decor */}
          <svg className="absolute inset-0 w-full h-full opacity-40" viewBox="0 0 400 300" preserveAspectRatio="none">
            <path d="M0,150 Q100,100 200,140 T400,120" stroke="var(--soft-red)" strokeWidth="1.5" fill="none" strokeDasharray="4 4" />
            <path d="M50,250 Q150,200 250,220 T400,200" stroke="var(--rose)" strokeWidth="1.5" fill="none" strokeDasharray="4 4" />
            <circle cx="120" cy="80" r="30" fill="var(--gold)" opacity="0.25" />
            <circle cx="300" cy="200" r="45" fill="var(--rose)" opacity="0.25" />
            <circle cx="80" cy="230" r="25" fill="var(--soft-red)" opacity="0.2" />
          </svg>

          {PINS.map((p, i) => (
            <button
              key={i}
              onClick={() => setActive(active === i ? null : i)}
              style={{ left: `${p.x}%`, top: `${p.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 group"
              aria-label={p.label}
            >
              <span className="absolute inset-0 -m-3 rounded-full bg-soft-red/40 animate-ping" />
              <span className="relative block h-6 w-6 rounded-full bg-soft-red border-2 border-card shadow-soft group-hover:scale-125 transition-transform" />
            </button>
          ))}

          <AnimatePresence>
            {active !== null && (
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.9 }}
                className="absolute bottom-4 left-4 right-4 sm:left-1/2 sm:-translate-x-1/2 sm:max-w-md rounded-2xl bg-card/95 backdrop-blur border border-border shadow-soft p-4"
              >
                <div className="flex gap-3">
                  <div className="h-16 w-16 rounded-xl bg-blush/50 grid place-items-center shrink-0 text-2xl">
                    {/* EDIT: replace with <img src={PINS[active].photo} /> */}
                    📸
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-soft-red">{PINS[active].label}</h3>
                    <p className="text-sm mt-1">{PINS[active].memory}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <p className="mt-4 text-center text-xs text-muted-foreground">Tap a pin to open the memory</p>
      </div>
    </PageShell>
  );
}
