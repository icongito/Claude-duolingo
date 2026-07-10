"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import type { FlashcardStep } from "@/lib/data/lessons";

export function StepFlashcard({
  step,
  onResult,
}: {
  step: FlashcardStep;
  onResult: (correct: boolean) => void;
}) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const card = step.cards[index];
  const last = index === step.cards.length - 1;

  return (
    <div className="flex flex-col gap-6">
      <h2 className="font-display text-xl font-semibold">
        Study these ({index + 1}/{step.cards.length})
      </h2>

      <button
        onClick={() => setFlipped((f) => !f)}
        className="group relative mx-auto h-64 w-full max-w-lg [perspective:1200px]"
        aria-label={flipped ? "Show question" : "Reveal answer"}
      >
        <motion.div
          className="relative size-full [transform-style:preserve-3d]"
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.5, ease: [0.34, 1.3, 0.64, 1] }}
        >
          <div className="glow-border-strong absolute inset-0 flex items-center justify-center rounded-2xl bg-card px-8 text-center [backface-visibility:hidden]">
            <div>
              <p className="text-muted-foreground mb-3 text-xs font-semibold tracking-widest uppercase">
                Question — tap to flip
              </p>
              <p className="font-display text-lg font-semibold">{card.front}</p>
            </div>
          </div>
          <div className="absolute inset-0 flex [transform:rotateY(180deg)] items-center justify-center rounded-2xl border-2 border-accent/50 bg-gradient-to-br from-card to-secondary px-8 text-center [backface-visibility:hidden]">
            <div>
              <p className="mb-3 text-xs font-semibold tracking-widest text-accent uppercase">
                Answer
              </p>
              <p className="text-sm leading-relaxed">{card.back}</p>
            </div>
          </div>
        </motion.div>
      </button>

      <AnimatePresence mode="wait">
        {flipped && (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex justify-center"
          >
            <Button
              size="lg"
              onClick={() => {
                if (last) {
                  onResult(true);
                } else {
                  setIndex((i) => i + 1);
                  setFlipped(false);
                }
              }}
            >
              {last ? "Got it — continue" : "Next card"}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
