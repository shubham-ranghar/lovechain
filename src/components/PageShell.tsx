import { motion } from "framer-motion";
import type { ReactNode } from "react";

/** Wraps every page with a soft fade/slide entrance. */
export function PageShell({ children }: { children: ReactNode }) {
  return (
    <motion.main
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative min-h-screen w-full px-4 py-20 sm:px-8"
    >
      {children}
    </motion.main>
  );
}
