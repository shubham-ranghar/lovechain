import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { PageShell } from "@/components/PageShell";

export const Route = createFileRoute("/story")({
  component: StoryPage,
});

// EDIT: your real milestones here
const MILESTONES = [
  { date: "The Day We Met", caption: "Where it all started." },
  { date: "First Date", caption: "Nervous, laughing, glowing." },
  { date: "First 'I Love You'", caption: "The words that changed everything." },
  { date: "First Trip Together", caption: "Suitcases, sunsets, us." },
  { date: "Moving Forward", caption: "Building something beautiful, day by day." },
];

function StoryPage() {
  return (
    <PageShell>
      <div className="mx-auto max-w-4xl">
        <h1 className="font-script text-5xl sm:text-6xl text-center text-soft-red mb-16">
          Our Story
        </h1>

        <div className="relative">
          {/* connecting line */}
          <div
            aria-hidden
            className="absolute left-6 sm:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blush via-rose to-soft-red -translate-x-1/2"
          />

          <ol className="space-y-16">
            {MILESTONES.map((m, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6 }}
                className={`relative grid sm:grid-cols-2 gap-6 items-center ${
                  i % 2 === 0 ? "" : "sm:[&>*:first-child]:order-2"
                }`}
              >
                <div className={`pl-14 sm:pl-0 ${i % 2 === 0 ? "sm:text-right sm:pr-16" : "sm:pl-16"}`}>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">
                    Milestone {i + 1}
                  </p>
                  <h3 className="font-script text-3xl text-soft-red mt-1">{m.date}</h3>
                  <p className="text-muted-foreground mt-2">{m.caption}</p>
                </div>
                <div className={`pl-14 sm:pl-0 ${i % 2 === 0 ? "sm:pl-16" : "sm:pr-16 sm:text-right"}`}>
                  {/* EDIT: replace with real photo */}
                  <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-blush to-rose/60 shadow-soft grid place-items-center text-cream">
                    <Heart className="w-12 h-12 fill-current opacity-70" />
                  </div>
                </div>

                {/* node on timeline */}
                <span
                  aria-hidden
                  className="absolute left-6 sm:left-1/2 top-4 -translate-x-1/2 grid place-items-center w-8 h-8 rounded-full bg-soft-red shadow-glow"
                >
                  <Heart className="w-4 h-4 text-cream fill-current" />
                </span>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </PageShell>
  );
}
