import { useEffect, useState } from "react";

/** Small heart cursor for desktop pointer devices. Hidden on touch. */
export function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    setEnabled(mq.matches);
    const handler = (e: MediaQueryListEvent) => setEnabled(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    document.documentElement.classList.add("heart-cursor");
    const move = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", move);
    return () => {
      document.documentElement.classList.remove("heart-cursor");
      window.removeEventListener("mousemove", move);
    };
  }, [enabled]);

  if (!enabled) return null;
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed z-[9999] -translate-x-1/2 -translate-y-1/2 text-soft-red transition-transform duration-75"
      style={{ left: pos.x, top: pos.y }}
    >
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 drop-shadow">
        <path d="M12 21s-7-4.5-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6c-2.5 4.5-9.5 9-9.5 9z" />
      </svg>
    </div>
  );
}
