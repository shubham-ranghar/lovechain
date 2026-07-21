import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Play, Pause } from "lucide-react";
import { PageShell } from "../components/PageShell";

export const Route = createFileRoute("/voice")({
  head: () => ({
    meta: [
      { title: "A Voice for You — Always Us" },
      { name: "description", content: "A little voice note, just for you." },
      { property: "og:title", content: "A Voice for You — Always Us" },
      { property: "og:description", content: "A little voice note, just for you." },
    ],
  }),
  component: VoicePage,
});

function VoicePage() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    /* EDIT: replace src with your own recording in /public */
    const a = new Audio("https://cdn.pixabay.com/download/audio/2022/03/15/audio_1b1f0c9d17.mp3?filename=romantic-piano-ambient-110241.mp3");
    a.addEventListener("ended", () => setPlaying(false));
    audioRef.current = a;
    return () => { a.pause(); };
  }, []);

  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    if (playing) { a.pause(); setPlaying(false); }
    else { a.play().catch(() => {}); setPlaying(true); }
  };

  return (
    <PageShell>
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-5xl sm:text-6xl text-soft-red">A Voice for You</h1>
        <p className="mt-3 text-muted-foreground">Press the heart. Listen close. 🎙️</p>

        <div className="mt-16 grid place-items-center">
          <motion.button
            onClick={toggle}
            whileTap={{ scale: 0.92 }}
            animate={playing ? { scale: [1, 1.08, 1] } : { scale: 1 }}
            transition={playing ? { repeat: Infinity, duration: 1.2 } : { duration: 0.2 }}
            className="relative grid h-40 w-40 place-items-center rounded-full bg-gradient-to-br from-soft-red to-rose text-primary-foreground shadow-glow"
            aria-label={playing ? "Pause voice note" : "Play voice note"}
          >
            <span className="absolute inset-0 rounded-full bg-soft-red/50 animate-ping" style={{ animationPlayState: playing ? "running" : "paused" }} />
            {playing ? <Pause className="relative h-12 w-12" /> : <Play className="relative h-12 w-12 translate-x-1" />}
          </motion.button>
        </div>

        <div className="mt-10 flex items-end justify-center gap-1 h-16">
          {Array.from({ length: 32 }).map((_, i) => (
            <motion.span
              key={i}
              className="w-1.5 rounded-full bg-soft-red"
              animate={playing ? { height: [8, 20 + Math.random() * 40, 8] } : { height: 8 }}
              transition={playing ? { repeat: Infinity, duration: 0.6 + Math.random() * 0.6, delay: i * 0.03 } : { duration: 0.3 }}
            />
          ))}
        </div>

        <p className="mt-10 italic text-lg font-script text-soft-red">
          {/* EDIT: short line about the voice note */}
          "Just something I wanted you to hear in my own voice."
        </p>
      </div>
    </PageShell>
  );
}
