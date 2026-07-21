import { Link, useRouterState, useRouter } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, Menu, X, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Couple } from "@/lib/supabase";

const PAGES = [
  { id: "home", label: "Home", path: "" },
  { id: "date", label: "A Date?", path: "date" },
  { id: "playlist", label: "Playlist", path: "playlist" },
  { id: "map", label: "Map of Us", path: "map" },
  { id: "gallery", label: "Memories", path: "gallery" },
  { id: "voice", label: "Voice Note", path: "voice" },
  { id: "letter", label: "Love Letter", path: "letter" },
  { id: "reasons", label: "Reasons", path: "reasons" },
  { id: "future", label: "Our Future", path: "future" },
  { id: "compliments", label: "Compliments", path: "compliments" },
  { id: "quiz", label: "Quiz", path: "quiz" },
  { id: "constellation", label: "Constellation", path: "constellation" },
  { id: "garden", label: "Growing", path: "garden" },
  { id: "countdown", label: "Countdown", path: "countdown" },
  { id: "finale", label: "Forever", path: "finale" },
] as const;

interface NavProps {
  couple?: Couple;
}

export function Nav({ couple }: NavProps) {
  const [open, setOpen] = useState(false);
  const { location } = useRouterState();
  const router = useRouter();
  const slug = couple?.slug;
  
  useEffect(() => setOpen(false), [location.pathname]);

  const handleNavigate = (path: string) => {
    router.navigate({ to: path });
  };

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
              {PAGES.filter(p => !couple?.content.enabledPages || couple.content.enabledPages.includes(p.id)).map((p) => (
                <li key={p.id}>
                  <button
                    onClick={() => handleNavigate(p.path ? `/${slug}/${p.path}` : `/${slug}`)}
                    className="block w-full text-left rounded-lg px-4 py-2 text-sm font-medium hover:bg-blush/40 transition-colors"
                  >
                    {p.label}
                  </button>
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
      "",
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
