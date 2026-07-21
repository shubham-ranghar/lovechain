import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useState } from "react";
import { PageShell } from "@/components/PageShell";
import { useCouple } from "@/contexts/CoupleContext";

export const Route = createFileRoute("/gallery")({
  component: GalleryPage,
});

function GalleryPage() {
  const { couple } = useCouple();
  const galleryPhotos = couple?.content?.galleryPhotos || [];
  
  // Fallback to placeholder images if no photos are uploaded yet
  const PHOTOS = galleryPhotos.length > 0 
    ? galleryPhotos.map((p, i) => ({
        id: i,
        src: p.url,
        caption: p.caption || `Memory #${i + 1}`,
        tilt: (i % 2 === 0 ? -1 : 1) * (1 + (i % 3)),
      }))
    : Array.from({ length: 9 }).map((_, i) => ({
        id: i,
        src: `https://picsum.photos/seed/love${i}/600/${500 + (i % 3) * 80}`,
        caption: `Memory #${i + 1}`,
        tilt: (i % 2 === 0 ? -1 : 1) * (1 + (i % 3)),
      }));
  const [active, setActive] = useState<null | (typeof PHOTOS)[number]>(null);

  return (
    <PageShell>
      <div className="mx-auto max-w-6xl">
        <h1 className="font-script text-5xl sm:text-6xl text-center text-soft-red mb-12">
          Memories
        </h1>
        <div className="columns-2 md:columns-3 gap-4 [column-fill:_balance]">
          {PHOTOS.map((p) => (
            <motion.button
              key={p.id}
              onClick={() => setActive(p)}
              whileHover={{ scale: 1.03, rotate: 0 }}
              initial={{ opacity: 0, y: 20, rotate: p.tilt }}
              whileInView={{ opacity: 1, y: 0, rotate: p.tilt }}
              viewport={{ once: true }}
              className="mb-4 block w-full break-inside-avoid rounded-xl bg-card p-2 pb-6 shadow-soft"
              style={{ transformOrigin: "center" }}
            >
              <img
                src={p.src}
                alt={p.caption}
                loading="lazy"
                className="w-full rounded-md object-cover"
              />
              <p className="mt-2 text-center font-script text-xl text-soft-red">{p.caption}</p>
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 grid place-items-center bg-foreground/70 backdrop-blur p-4"
            onClick={() => setActive(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative max-w-3xl w-full rounded-2xl bg-card p-3 pb-8 shadow-soft"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setActive(null)}
                className="absolute -top-3 -right-3 grid h-10 w-10 place-items-center rounded-full bg-soft-red text-primary-foreground shadow-soft"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
              <img src={active.src} alt={active.caption} className="w-full rounded-lg" />
              <p className="mt-3 text-center font-script text-2xl text-soft-red">
                {active.caption}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageShell>
  );
}
