import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { PageShell } from "@/components/PageShell";
import { useCouple } from "@/contexts/CoupleContext";

export const Route = createFileRoute("/letter")({
  component: LetterPage,
});

function LetterPage() {
  const { couple } = useCouple();
  const [open, setOpen] = useState(false);

  const letterText = couple?.content?.letterText || `From the very first moment, something about you felt like home.

Every laugh, every small glance, every ordinary Tuesday with you —
they've quietly become my favorite parts of being alive.

Thank you for being kind, for being brave, for being wildly, unapologetically you.
I don't know exactly what tomorrow looks like, but I know I want to see it with you.

Yours, always.`;

  return (
    <PageShell>
      <div className="mx-auto max-w-2xl flex flex-col items-center">
        <h1 className="font-script text-5xl sm:text-6xl text-center text-soft-red mb-10">
          A Letter for You
        </h1>

        <div className="relative w-full aspect-[4/3] max-w-lg">
          {/* Envelope */}
          <motion.button
            onClick={() => setOpen(true)}
            aria-label="Open the letter"
            className="relative w-full h-full rounded-2xl bg-blush shadow-soft overflow-hidden"
            whileHover={{ scale: open ? 1 : 1.02 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blush to-rose" />
            <motion.div
              className="absolute inset-x-0 top-0 origin-top"
              initial={false}
              animate={{ rotateX: open ? 180 : 0 }}
              transition={{ duration: 0.9, ease: "easeInOut" }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <svg viewBox="0 0 400 200" className="w-full h-auto">
                <polygon points="0,0 400,0 200,180" fill="oklch(0.78 0.11 15)" />
              </svg>
            </motion.div>
            <div className="absolute inset-0 grid place-items-center pointer-events-none">
              {!open && (
                <span className="rounded-full bg-card/90 px-4 py-2 text-sm text-soft-red font-medium shadow">
                  Click to open ♥
                </span>
              )}
            </div>
          </motion.button>
        </div>

        <AnimatePresence>
          {open && (
            <motion.article
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="mt-10 max-w-xl w-full rounded-lg p-8 sm:p-10 shadow-soft"
              style={{
                background:
                  "repeating-linear-gradient(180deg, oklch(0.98 0.02 80) 0 28px, oklch(0.96 0.03 80) 28px 29px)",
              }}
            >
              <h2 className="font-script text-3xl text-soft-red mb-4">My dearest,</h2>
              <p className="text-foreground/90 leading-relaxed whitespace-pre-line">
                {letterText}
              </p>
              <p className="mt-6 font-script text-2xl text-right text-soft-red">— Me</p>
            </motion.article>
          )}
        </AnimatePresence>
      </div>
    </PageShell>
  );
}
