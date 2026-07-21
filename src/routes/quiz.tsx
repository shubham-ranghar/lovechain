import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { PageShell } from "@/components/PageShell";
import { HeartBurst } from "@/components/Particles";

export const Route = createFileRoute("/quiz")({
  component: QuizPage,
});

// EDIT: your real questions
const QUESTIONS = [
  {
    q: "Where did we first meet?",
    options: ["A coffee shop", "Online", "Through friends", "At a party"],
    answer: 0,
  },
  {
    q: "What's my favorite thing about you?",
    options: ["Your laugh", "Your kindness", "Your smile", "All of the above"],
    answer: 3,
  },
  {
    q: "Our favorite shared snack?",
    options: ["Popcorn", "Ice cream", "Pizza", "Chocolate"],
    answer: 1,
  },
  {
    q: "Best trip we've taken?",
    options: ["The beach", "The mountains", "The city", "Home together"],
    answer: 3,
  },
];

function QuizPage() {
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<null | boolean>(null);
  const [done, setDone] = useState(false);

  const current = QUESTIONS[step];
  const progress = ((step + (done ? 1 : 0)) / QUESTIONS.length) * 100;

  const answer = (idx: number) => {
    const correct = idx === current.answer;
    setFeedback(correct);
    if (correct) setScore((s) => s + 1);
    setTimeout(() => {
      setFeedback(null);
      if (step + 1 >= QUESTIONS.length) setDone(true);
      else setStep((s) => s + 1);
    }, 900);
  };

  return (
    <PageShell>
      <div className="mx-auto max-w-2xl">
        <h1 className="font-script text-5xl sm:text-6xl text-center text-soft-red mb-6">
          How Well Do You Know Us?
        </h1>

        <div className="h-2 w-full rounded-full bg-blush/50 overflow-hidden mb-8">
          <motion.div
            className="h-full bg-soft-red"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>

        {!done ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              className="rounded-2xl bg-card p-6 sm:p-8 shadow-soft border border-border"
            >
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
                Question {step + 1} / {QUESTIONS.length}
              </p>
              <h2 className="text-2xl font-medium mb-6">{current.q}</h2>
              <div className="grid gap-3">
                {current.options.map((opt, i) => (
                  <button
                    key={opt}
                    onClick={() => feedback === null && answer(i)}
                    className="min-h-[52px] rounded-xl border border-border bg-background/60 px-4 py-3 text-left hover:bg-blush/40 hover:border-rose transition-all"
                  >
                    {opt}
                  </button>
                ))}
              </div>
              {feedback !== null && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mt-6 text-center font-script text-3xl ${
                    feedback ? "text-soft-red" : "text-muted-foreground"
                  }`}
                >
                  {feedback ? "yes! 💕" : "close one 😅"}
                </motion.p>
              )}
            </motion.div>
          </AnimatePresence>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-2xl bg-card p-10 shadow-soft text-center border border-border"
          >
            <h2 className="font-script text-5xl text-soft-red mb-3">
              {score} / {QUESTIONS.length}
            </h2>
            <p className="text-muted-foreground">
              {score === QUESTIONS.length
                ? "Perfect! You know us by heart. 💘"
                : "No matter the score — I'd pick you every time."}
            </p>
            <HeartBurst show={true} />
          </motion.div>
        )}
      </div>
    </PageShell>
  );
}
