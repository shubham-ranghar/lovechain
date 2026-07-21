import { Link, useRouterState } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, Menu, X, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const PAGES = [
  { to: "/", label: "Home" },
  { to: "/date", label: "A Date?" },
  { to: "/playlist", label: "Playlist" },
  { to: "/map", label: "Map of Us" },
  { to: "/gallery", label: "Memories" },
  { to: "/voice", label: "Voice Note" },
  { to: "/letter", label: "Love Letter" },
  { to: "/reasons", label: "Reasons" },
  { to: "/future", label: "Our Future" },
  { to: "/compliments", label: "Compliments" },
  { to: "/quiz", label: "Quiz" },
  { to: "/constellation", label: "Constellation" },
  { to: "/garden", label: "Growing" },
  { to: "/countdown", label: "Countdown" },
  { to: "/finale", label: "Forever" },
] as const;

export function Nav() {
  const [open, setOpen] = useState(false);
  const { location } = useRouterState();
  useEffect(() => setOpen(false), [location.pathname]);

  return (
    <>
      <button
        aria-label="Open navigation"
        onClick={() => setOpen((v) => !v)}
        className="fixed top-4 right-4 z-50 grid h-12 w-12 place-items-center rounded-full bg-card/80 backdrop-blur shadow-soft border border-border hover:scale-105 transition-transform"
      >
        {open ? <X className="h-5 w-5 text-soft-red" /> : <Heart className="h-5 w-5 text-soft-red fill-soft-red" />}
        <span className="sr-only md:hidden">
          <Menu className="h-5 w-5" />
        </span>
      </button>

      <MusicToggle />

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-20 right-4 z-40 rounded-2xl bg-card/95 backdrop-blur border border-border shadow-soft p-3 min-w-[200px]"
          >
            <ul className="flex flex-col gap-1">
              {PAGES.map((p) => (
                <li key={p.to}>
                  <Link
                    to={p.to}
                    className="block rounded-lg px-4 py-2 text-sm font-medium hover:bg-blush/40 transition-colors"
                    activeProps={{ className: "block rounded-lg px-4 py-2 text-sm font-medium bg-blush/60 text-soft-red" }}
                    activeOptions={{ exact: true }}
                  >
                    {p.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}

function MusicToggle() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    // Autoplay muted per browser rules; user can unmute.
    const a = new Audio(
      // A soft public-domain-ish ambient loop; replace with your own in /public.
      "https://cdn.pixabay.com/download/audio/2022/03/15/audio_1b1f0c9d17.mp3?filename=romantic-piano-ambient-110241.mp3",
    );
    a.loop = true;
    a.muted = true;
    a.volume = 0.4;
    a.play().catch(() => {});
    audioRef.current = a;
    return () => {
      a.pause();
      audioRef.current = null;
    };
  }, []);

  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    const next = !muted;
    setMuted(next);
    a.muted = next;
    if (!next) a.play().catch(() => {});
  };

  return (
    <button
      aria-label={muted ? "Unmute music" : "Mute music"}
      onClick={toggle}
      className="fixed top-4 left-4 z-50 grid h-12 w-12 place-items-center rounded-full bg-card/80 backdrop-blur shadow-soft border border-border hover:scale-105 transition-transform"
    >
      {muted ? <VolumeX className="h-5 w-5 text-soft-red" /> : <Volume2 className="h-5 w-5 text-soft-red" />}
    </button>
  );
}
