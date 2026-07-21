import { motion } from "framer-motion";

export function HeartLoader() {
  return (
    <div className="flex items-center justify-center py-10">
      <motion.svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-16 h-16 text-soft-red"
        animate={{ scale: [1, 1.2, 1, 1.15, 1] }}
        transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
      >
        <path d="M12 21s-7-4.5-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6c-2.5 4.5-9.5 9-9.5 9z" />
      </motion.svg>
    </div>
  );
}
