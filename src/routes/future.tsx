import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { Plus, Check } from "lucide-react";
import { PageShell } from "../components/PageShell";

export const Route = createFileRoute("/future")({
  head: () => ({
    meta: [
      { title: "Our Future — Always Us" },
      { name: "description", content: "All the things we'll do together." },
      { property: "og:title", content: "Our Future — Always Us" },
      { property: "og:description", content: "All the things we'll do together." },
    ],
  }),
  component: FuturePage,
});

/* EDIT: your bucket list */
const INITIAL = [
  { text: "Watch the sunset on a beach", done: true },
  { text: "Cook a whole meal together (no takeout)", done: true },
  { text: "Travel to [place]", done: false },
  { text: "See the northern lights", done: false },
  { text: "Adopt a pet together", done: false },
  { text: "Learn to dance — properly", done: true },
  { text: "Grow old, still holding hands", done: false },
];

function FuturePage() {
  const [items, setItems] = useState(INITIAL);
  const [draft, setDraft] = useState("");

  const toggle = (i: number) =>
    setItems((prev) => prev.map((it, idx) => (idx === i ? { ...it, done: !it.done } : it)));

  const add = () => {
    if (!draft.trim()) return;
    setItems((prev) => [...prev, { text: draft.trim(), done: false }]);
    setDraft("");
  };

  return (
    <PageShell>
      <div className="mx-auto max-w-2xl">
        <h1 className="text-center text-5xl sm:text-6xl text-soft-red">Our Future</h1>
        <p className="mt-3 text-center text-muted-foreground">Everything we're going to do ✨</p>

        <ul className="mt-10 space-y-3">
          {items.map((it, i) => (
            <motion.li
              key={i}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 rounded-2xl bg-card/90 border border-border shadow-soft p-4 backdrop-blur"
            >
              <button
                onClick={() => toggle(i)}
                className={`h-7 w-7 shrink-0 rounded-full border-2 grid place-items-center transition-colors ${
                  it.done ? "bg-soft-red border-soft-red text-primary-foreground" : "border-soft-red/50"
                }`}
                aria-label={it.done ? "Mark undone" : "Mark done"}
              >
                {it.done && <Check className="h-4 w-4" />}
              </button>
              <span className="relative flex-1">
                <span className={it.done ? "text-muted-foreground" : ""}>{it.text}</span>
                <motion.span
                  initial={false}
                  animate={{ scaleX: it.done ? 1 : 0 }}
                  transition={{ duration: 0.4 }}
                  style={{ transformOrigin: "left" }}
                  className="absolute left-0 top-1/2 h-0.5 w-full bg-soft-red"
                />
              </span>
            </motion.li>
          ))}
        </ul>

        <div className="mt-6 flex gap-2">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && add()}
            placeholder="Add a wish…"
            className="flex-1 rounded-full bg-card/90 border border-border px-5 py-3 outline-none focus:ring-2 focus:ring-ring"
          />
          <button
            onClick={add}
            className="grid h-12 w-12 place-items-center rounded-full bg-soft-red text-primary-foreground shadow-soft hover:scale-105 transition-transform"
            aria-label="Add wish"
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>
      </div>
    </PageShell>
  );
}
