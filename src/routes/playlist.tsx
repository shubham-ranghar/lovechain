import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { PageShell } from "../components/PageShell";
import { useCouple } from "@/contexts/CoupleContext";

export const Route = createFileRoute("/playlist")({
  head: () => ({
    meta: [
      { title: "Our Playlist — Always Us" },
      { name: "description", content: "Songs that tell our story." },
      { property: "og:title", content: "Our Playlist — Always Us" },
      { property: "og:description", content: "Songs that tell our story." },
    ],
  }),
  component: PlaylistPage,
});

function PlaylistPage() {
  const { couple } = useCouple();
  const SONGS = couple?.content?.songs || [
    { title: "Song One", artist: "Artist Name", note: "The song that was playing when I first realized I was falling.", link: "https://open.spotify.com/" },
    { title: "Song Two", artist: "Artist Name", note: "We danced to this in the kitchen at 2am. Best night ever.", link: "https://youtube.com/" },
    { title: "Song Three", artist: "Artist Name", note: "This one always reminds me of your laugh.", link: "https://open.spotify.com/" },
    { title: "Song Four", artist: "Artist Name", note: "Our road trip anthem — windows down, singing off-key.", link: "https://open.spotify.com/" },
    { title: "Song Five", artist: "Artist Name", note: "The lyrics say what I never quite manage to.", link: "https://open.spotify.com/" },
    { title: "Song Six", artist: "Artist Name", note: "For all the slow, quiet mornings with you.", link: "https://open.spotify.com/" },
  ];
  const [playing, setPlaying] = useState<number | null>(null);
  return (
    <PageShell>
      <div className="mx-auto max-w-4xl">
        <h1 className="text-center text-5xl sm:text-6xl text-soft-red">Our Playlist</h1>
        <p className="mt-3 text-center text-muted-foreground">The soundtrack of us 🎵</p>

        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {SONGS.map((s, i) => {
            const open = playing === i;
            return (
              <motion.button
                key={i}
                layout
                onClick={() => setPlaying(open ? null : i)}
                className="text-left rounded-2xl bg-card/90 border border-border shadow-soft p-5 backdrop-blur hover:shadow-glow transition-shadow"
              >
                <div className="flex items-center gap-4">
                  <motion.div
                    animate={open ? { rotate: 360 } : { rotate: 0 }}
                    transition={open ? { repeat: Infinity, duration: 3, ease: "linear" } : { duration: 0.3 }}
                    className="relative h-16 w-16 shrink-0 rounded-full bg-gradient-to-br from-soft-red to-rose grid place-items-center shadow-inner"
                  >
                    <div className="h-5 w-5 rounded-full bg-card" />
                    <div className="absolute inset-2 rounded-full border border-card/40" />
                    <div className="absolute inset-4 rounded-full border border-card/30" />
                  </motion.div>
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold truncate">{s.title}</div>
                    <div className="text-sm text-muted-foreground truncate">{s.artist}</div>
                  </div>
                  <span className="text-xs text-soft-red font-medium">{open ? "Pause" : "Play"}</span>
                </div>
                {open && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-4 border-t border-border pt-4"
                  >
                    <p className="text-sm italic">{s.note}</p>
                    <a
                      href={s.link}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="mt-3 inline-block text-xs font-medium text-soft-red underline"
                    >
                      {/* EDIT: real Spotify/YouTube link */} Listen →
                    </a>
                  </motion.div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </PageShell>
  );
}
