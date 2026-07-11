"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { LittleGuy } from "@/components/mascot/little-guy";
import type { LessonSession, LessonStep } from "@/lib/data/lessons";
import { StepMultipleChoice } from "./step-multiple-choice";
import { StepFillBlank } from "./step-fill-blank";
import { StepTyping } from "./step-typing";
import { StepMatching } from "./step-matching";
import { StepFlashcard } from "./step-flashcard";
import { StepSorting } from "./step-sorting";
import { StepCode } from "./step-code";
import { cn } from "@/lib/utils";

const MAX_HEARTS = 3;

export function StepRenderer({
  step,
  onResult,
}: {
  step: LessonStep;
  onResult: (correct: boolean) => void;
}) {
  switch (step.type) {
    case "multiple_choice":
      return <StepMultipleChoice step={step} onResult={onResult} />;
    case "fill_blank":
      return <StepFillBlank step={step} onResult={onResult} />;
    case "typing":
      return <StepTyping step={step} onResult={onResult} />;
    case "matching":
      return <StepMatching step={step} onResult={onResult} />;
    case "flashcard":
      return <StepFlashcard step={step} onResult={onResult} />;
    case "sorting":
      return <StepSorting step={step} onResult={onResult} />;
    case "code":
      return <StepCode step={step} onResult={onResult} />;
  }
}

function ConfettiBurst() {
  const pieces = useMemo(
    () =>
      Array.from({ length: 36 }, (_, i) => ({
        id: i,
        x: (i / 36) * 100,
        delay: (i % 9) * 0.06,
        color: ["#FF7A1A", "#FFC857", "#FF9E3D", "#3ddc97", "#6ee3ff"][i % 5],
        rotate: (i * 47) % 360,
      })),
    [],
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {pieces.map((p) => (
        <motion.span
          key={p.id}
          className="absolute top-0 block h-3 w-2 rounded-[2px]"
          style={{ left: `${p.x}%`, backgroundColor: p.color }}
          initial={{ y: -20, opacity: 1, rotate: 0 }}
          animate={{ y: "110vh", opacity: [1, 1, 0.8, 0], rotate: p.rotate + 360 }}
          transition={{ duration: 2.6, delay: p.delay, ease: "easeIn" }}
        />
      ))}
    </div>
  );
}

export function LessonPlayer({ session }: { session: LessonSession }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [hearts, setHearts] = useState(MAX_HEARTS);
  const [correctCount, setCorrectCount] = useState(0);
  const [state, setState] = useState<"playing" | "passed" | "failed">("playing");

  const total = session.steps.length;
  const progressPct = (stepIndex / total) * 100;

  function handleResult(correct: boolean) {
    const nextCorrect = correctCount + (correct ? 1 : 0);
    const nextHearts = correct ? hearts : hearts - 1;

    if (!correct && nextHearts <= 0) {
      setHearts(0);
      setState("failed");
      return;
    }

    setCorrectCount(nextCorrect);
    setHearts(nextHearts);

    if (stepIndex + 1 >= total) {
      setState("passed");
    } else {
      setStepIndex((i) => i + 1);
    }
  }

  if (state === "passed") {
    const scorePct = Math.round((correctCount / total) * 100);
    const earnedXp = session.xpReward + (scorePct === 100 ? 10 : 0);
    return (
      <div className="relative flex min-h-[70vh] flex-col items-center justify-center gap-6 text-center">
        <ConfettiBurst />
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 14 }}
          className="flex flex-col items-center gap-5"
        >
          <LittleGuy animation="lesson" size={220} />
          <h1 className="font-pixel text-3xl">Lesson complete!</h1>
          <p className="text-muted-foreground max-w-sm">
            {scorePct === 100
              ? "Perfect score. Absolutely flawless."
              : `You got ${correctCount} of ${total} right — solid work.`}
          </p>
          <div className="flex items-center gap-3">
            <motion.span
              initial={{ y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.35 }}
              className="rounded-full border border-primary/40 bg-primary/15 px-4 py-2 font-display text-lg font-bold text-primary"
            >
              +{earnedXp} XP
            </motion.span>
            {scorePct === 100 && (
              <motion.span
                initial={{ y: 12, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="rounded-full border border-accent/40 bg-accent/15 px-4 py-2 font-display text-lg font-bold text-accent"
              >
                Perfect bonus
              </motion.span>
            )}
          </div>
          <div className="mt-2 flex gap-3">
            <Button size="lg" asChild>
              <Link href={`/learn/${session.worldSlug}`}>Back to the map</Link>
            </Button>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (state === "failed") {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex flex-col items-center gap-5"
        >
          <LittleGuy animation="wrong" size={220} />
          <h1 className="font-pixel text-3xl">Out of hearts</h1>
          <p className="text-muted-foreground max-w-sm">
            No XP lost — that&apos;s not how we roll. Take a breath and run it
            back.
          </p>
          <div className="mt-2 flex gap-3">
            <Button
              size="lg"
              onClick={() => {
                setStepIndex(0);
                setHearts(MAX_HEARTS);
                setCorrectCount(0);
                setState("playing");
              }}
            >
              Try again
            </Button>
            <Button size="lg" variant="secondary" asChild>
              <Link href={`/learn/${session.worldSlug}`}>Back to the map</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-8">
      <div className="flex items-center gap-4">
        <Link
          href={`/learn/${session.worldSlug}`}
          aria-label="Exit lesson"
          className="text-muted-foreground rounded-lg p-1.5 hover:bg-secondary hover:text-foreground"
        >
          <X className="size-5" />
        </Link>
        <Progress value={progressPct} className="h-3.5 flex-1" />
        <div className="flex items-center gap-1" aria-label={`${hearts} hearts remaining`}>
          {Array.from({ length: MAX_HEARTS }).map((_, i) => (
            <Heart
              key={i}
              className={cn(
                "size-5",
                i < hearts
                  ? "fill-streak text-streak"
                  : "fill-secondary text-secondary",
              )}
            />
          ))}
        </div>
      </div>

      <p className="text-muted-foreground -mb-4 text-xs font-semibold tracking-widest uppercase">
        {session.title} · step {stepIndex + 1} of {total}
      </p>

      <AnimatePresence mode="wait">
        <motion.div
          key={stepIndex}
          initial={{ opacity: 0, x: 32 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -32 }}
          transition={{ duration: 0.25 }}
        >
          <StepRenderer
            step={session.steps[stepIndex]}
            onResult={handleResult}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
