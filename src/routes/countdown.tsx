import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { PageShell } from "@/components/PageShell";

export const Route = createFileRoute("/countdown")({
  component: CountdownPage,
});

// EDIT: your special date
const TARGET = new Date("2026-12-31T00:00:00").getTime();

function diff() {
  const now = Date.now();
  const d = Math.max(0, TARGET - now);
  return {
    days: Math.floor(d / 86400000),
    hours: Math.floor((d / 3600000) % 24),
    minutes: Math.floor((d / 60000) % 60),
    seconds: Math.floor((d / 1000) % 60),
  };
}

function CountdownPage() {
  const [t, setT] = useState(diff);
  useEffect(() => {
    const id = setInterval(() => setT(diff()), 1000);
    return () => clearInterval(id);
  }, []);

  const units: Array<[string, number]> = [
    ["days", t.days],
    ["hours", t.hours],
    ["minutes", t.minutes],
    ["seconds", t.seconds],
  ];

  return (
    <PageShell>
      <motion.div
        animate={{ scale: [1, 1.02, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="mx-auto max-w-4xl text-center"
      >
        <h1 className="font-script text-5xl sm:text-6xl text-soft-red mb-2">
          Until Our Next Chapter
        </h1>
        <p className="text-muted-foreground mb-10">
          {/* EDIT: what you're counting down to */}
          Counting every second.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {units.map(([label, value]) => (
            <div
              key={label}
              className="rounded-2xl bg-card border border-border p-6 shadow-soft"
            >
              <div className="font-script text-6xl sm:text-7xl text-soft-red tabular-nums">
                {String(value).padStart(2, "0")}
              </div>
              <div className="mt-2 text-xs uppercase tracking-widest text-muted-foreground">
                {label}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </PageShell>
  );
}
