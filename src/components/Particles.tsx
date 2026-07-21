import { motion } from "framer-motion";
import { useMemo } from "react";

/**
 * Floating hearts/petals background — lightweight CSS-driven.
 * Renders a fixed set of drifting elements behind all page content.
 */
export function Particles({ count = 18 }: { count?: number }) {
  const items = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 10 + Math.random() * 20,
        duration: 14 + Math.random() * 16,
        delay: -Math.random() * 20,
        kind: Math.random() > 0.5 ? "heart" : "petal",
        opacity: 0.3 + Math.random() * 0.4,
      })),
    [count],
  );

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 overflow-hidden -z-10"
    >
      {items.map((p) => (
        <span
          key={p.id}
          className="absolute animate-drift"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            opacity: p.opacity,
          }}
        >
          {p.kind === "heart" ? (
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full text-rose">
              <path d="M12 21s-7-4.5-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6c-2.5 4.5-9.5 9-9.5 9z" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full text-blush">
              <ellipse cx="12" cy="12" rx="6" ry="10" />
            </svg>
          )}
        </span>
      ))}
    </div>
  );
}

/** Confetti-like heart burst using framer-motion (used on Yes click / finale). */
export function HeartBurst({ show }: { show: boolean }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: 60 }).map((_, i) => ({
        id: i,
        x: (Math.random() - 0.5) * window.innerWidth,
        y: -Math.random() * window.innerHeight,
        rot: Math.random() * 720,
        size: 16 + Math.random() * 24,
        delay: Math.random() * 0.3,
      })),
    [show],
  );
  if (!show) return null;
  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {pieces.map((p) => (
        <motion.div
          key={p.id}
          initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
          animate={{ x: p.x, y: p.y, opacity: 0, rotate: p.rot }}
          transition={{ duration: 1.6, delay: p.delay, ease: "easeOut" }}
          className="absolute left-1/2 top-1/2 text-soft-red"
          style={{ width: p.size, height: p.size }}
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
            <path d="M12 21s-7-4.5-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6c-2.5 4.5-9.5 9-9.5 9z" />
          </svg>
        </motion.div>
      ))}
    </div>
  );
}
