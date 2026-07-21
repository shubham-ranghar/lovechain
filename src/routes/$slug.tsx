import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { PageShell } from "@/components/PageShell";
import { HeartBurst } from "@/components/Particles";
import { useCouple } from "@/contexts/CoupleContext";

export const Route = createFileRoute("/$slug")({
  component: SlugHome,
});

function SlugHome() {
  const { couple } = useCouple();
  const [clicks, setClicks] = useState(0);
  const [burst, setBurst] = useState(false);

  if (!couple) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-semibold text-foreground">Love site not found</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            This love site doesn't exist or has been removed.
          </p>
          <div className="mt-6">
            <Link
              to="/"
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Create your own
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const content = couple.content;

  const onNameTap = () => {
    const next = clicks + 1;
    setClicks(next);
    if (next >= 5) {
      setBurst(true);
      setClicks(0);
      setTimeout(() => setBurst(false), 1800);
    }
  };

  const daysTogether = content.relationshipStartDate
    ? Math.floor((Date.now() - new Date(content.relationshipStartDate).getTime()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <PageShell>
      <div className="flex min-h-[80vh] flex-col items-center justify-center text-center gap-8">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
          className="text-sm uppercase tracking-[0.3em] text-muted-foreground"
        >
          a little love letter for
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.6, delay: 0.2 }}
          onClick={onNameTap}
          className="font-script text-6xl sm:text-8xl md:text-9xl text-soft-red select-none cursor-pointer drop-shadow-sm"
        >
          {content.partnerName || "My Love"}
        </motion.h1>

        {daysTogether !== null && daysTogether >= 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.4 }}
            className="text-sm text-muted-foreground"
          >
            Together for {daysTogether} days 💕
          </motion.p>
        )}

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.6 }}
          className="max-w-md text-base sm:text-lg text-muted-foreground"
        >
          {content.welcomeMessage || "Every page here is a tiny piece of us. Take your time."}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <Link
            to="/date"
            className="inline-block rounded-full bg-soft-red px-10 py-4 text-primary-foreground font-medium shadow-soft animate-heartbeat hover:shadow-glow transition-shadow"
          >
            Enter ♥
          </Link>
        </motion.div>

        <p className="mt-6 text-xs text-muted-foreground/70">
          psst — tap the name a few times ✨
        </p>
      </div>
      <HeartBurst show={burst} />
    </PageShell>
  );
}
