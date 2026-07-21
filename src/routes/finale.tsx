import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useMemo } from "react";
import { PageShell } from "@/components/PageShell";

export const Route = createFileRoute("/finale")({
  component: FinalePage,
});

function FinalePage() {
  const hearts = useMemo(
    () =>
      Array.from({ length: 40 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 20 + Math.random() * 40,
        delay: Math.random() * 2,
        duration: 4 + Math.random() * 4,
      })),
    [],
  );

  const share = () => {
    if (navigator.share) {
      navigator.share({ title: "Always Us", url: window.location.origin }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.origin);
    }
  };

  return (
    <PageShell>
      <div className="relative min-h-[80vh] flex flex-col items-center justify-center text-center overflow-hidden">
        <div aria-hidden className="absolute inset-0 pointer-events-none">
          {hearts.map((h) => (
            <motion.span
              key={h.id}
              className="absolute text-soft-red"
              style={{ left: `${h.left}%`, bottom: -40, width: h.size, height: h.size }}
              initial={{ y: 0, opacity: 0 }}
              animate={{ y: -700, opacity: [0, 0.8, 0] }}
              transition={{
                duration: h.duration,
                delay: h.delay,
                repeat: Infinity,
                ease: "easeOut",
              }}
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 21s-7-4.5-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6c-2.5 4.5-9.5 9-9.5 9z" />
              </svg>
            </motion.span>
          ))}
        </div>

        <motion.h1
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.4 }}
          className="font-script text-7xl sm:text-9xl text-soft-red relative"
        >
          I Love You
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-6 max-w-md text-muted-foreground relative"
        >
          {/* EDIT: closing message */}
          Now, and every day after this one.
        </motion.p>

        <div className="mt-10 flex flex-wrap justify-center gap-3 relative">
          <Link
            to="/"
            className="rounded-full bg-soft-red px-8 py-3 text-primary-foreground font-medium shadow-soft hover:shadow-glow transition-shadow min-h-[44px]"
          >
            Replay ♥
          </Link>
          <button
            onClick={share}
            className="rounded-full border-2 border-soft-red px-8 py-3 text-soft-red font-medium hover:bg-blush/40 transition-colors min-h-[44px]"
          >
            Share
          </button>
        </div>
      </div>
    </PageShell>
  );
}
