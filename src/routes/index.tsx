import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { PageShell } from "@/components/PageShell";
import { HeartBurst } from "@/components/Particles";

export const Route = createFileRoute("/")({
  component: Landing,
});

function Landing() {
  const [clicks, setClicks] = useState(0);
  const [burst, setBurst] = useState(false);

  // Easter egg: tap the name 5 times for a confetti burst
  const onNameTap = () => {
    const next = clicks + 1;
    setClicks(next);
    if (next >= 5) {
      setBurst(true);
      setClicks(0);
      setTimeout(() => setBurst(false), 1800);
    }
  };

  return (
    <PageShell>
      <div className="flex min-h-[80vh] flex-col items-center justify-center text-center gap-8">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
          className="text-sm uppercase tracking-[0.3em] text-muted-foreground"
        >
          {/* EDIT: intro line */}
          a little love letter for
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.6, delay: 0.2 }}
          onClick={onNameTap}
          className="font-script text-6xl sm:text-8xl md:text-9xl text-soft-red select-none cursor-pointer drop-shadow-sm"
        >
          {/* EDIT: her name here */}
          My Love
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.8 }}
          className="max-w-md text-base sm:text-lg text-muted-foreground"
        >
          {/* EDIT: welcome subtitle */}
          Every page here is a tiny piece of us. Take your time.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <Link
            to="/date"
            className="inline-block rounded-full bg-soft-red px-10 py-4 text-primary-foreground font-medium shadow-soft animate-heartbeat hover:shadow-glow transition-shadow"
          >
            Enter ♥
          </Link>
        </motion.div>

        <p className="mt-6 text-xs text-muted-foreground/70">
          psst — tap my name a few times ✨
        </p>
      </div>
      <HeartBurst show={burst} />
    </PageShell>
  );
}
