import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { PageShell } from "@/components/PageShell";
import { HeartBurst } from "@/components/Particles";

export const Route = createFileRoute("/date")({
  component: DatePage,
});

const NO_MESSAGES = ["No", "Are you sure?", "Really?", "Pretty please?", "Think again 🥺"];

function DatePage() {
  const navigate = useNavigate();
  const [dodgeCount, setDodgeCount] = useState(0);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [burst, setBurst] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const dodge = () => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (Math.random() - 0.5) * Math.min(rect.width - 80, 600);
    const y = (Math.random() - 0.5) * Math.min(rect.height - 80, 400);
    setPos({ x, y });
    setDodgeCount((c) => c + 1);
  };

  const onYes = () => {
    setBurst(true);
    setTimeout(() => navigate({ to: "/playlist" }), 1400);
  };

  const label = NO_MESSAGES[Math.min(dodgeCount, NO_MESSAGES.length - 1)];
  const shrink = Math.max(0.4, 1 - dodgeCount * 0.12);
  const hideNo = dodgeCount >= 5;

  return (
    <PageShell>
      <div
        ref={containerRef}
        className="relative flex min-h-[80vh] flex-col items-center justify-center text-center gap-10"
      >
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-script text-5xl sm:text-7xl text-soft-red"
        >
          Will you go on a date with me?
        </motion.h1>

        <div className="relative flex flex-wrap items-center justify-center gap-6">
          <button
            onClick={onYes}
            className="relative min-h-[52px] min-w-[120px] rounded-full bg-soft-red px-8 py-3 text-primary-foreground font-medium shadow-soft hover:scale-110 transition-transform text-lg"
          >
            Yes 💕
          </button>

          {!hideNo && (
            <motion.button
              animate={{ x: pos.x, y: pos.y, scale: shrink }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              onMouseEnter={dodge}
              onTouchStart={(e) => {
                e.preventDefault();
                dodge();
              }}
              onClick={dodge}
              className="min-h-[52px] min-w-[120px] rounded-full border-2 border-border bg-card px-8 py-3 font-medium hover:bg-blush/40 transition-colors text-lg"
            >
              {label}
            </motion.button>
          )}
        </div>

        <p className="text-sm text-muted-foreground max-w-xs">
          {/* EDIT: playful hint */}
          (there's only one right answer here 😉)
        </p>
      </div>
      <HeartBurst show={burst} />
    </PageShell>
  );
}
