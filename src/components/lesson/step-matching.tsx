"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import type { MatchingStep } from "@/lib/data/lessons";
import { cn } from "@/lib/utils";

/** Deterministic shuffle so server/client agree (seeded by string length). */
function stableShuffle<T>(items: T[], seed: number): T[] {
  const arr = [...items];
  let s = seed;
  for (let i = arr.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const j = s % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function StepMatching({
  step,
  onResult,
}: {
  step: MatchingStep;
  onResult: (correct: boolean) => void;
}) {
  const rights = useMemo(
    () =>
      stableShuffle(
        step.pairs.map((p) => p.right),
        step.pairs.length * 7 + step.prompt.length,
      ),
    [step],
  );

  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [mistakes, setMistakes] = useState(0);
  const [wrongFlash, setWrongFlash] = useState<string | null>(null);

  const done = Object.keys(matches).length === step.pairs.length;

  function pickRight(right: string) {
    if (!selectedLeft || done) return;
    const pair = step.pairs.find((p) => p.left === selectedLeft);
    if (pair?.right === right) {
      setMatches((m) => ({ ...m, [selectedLeft]: right }));
      setSelectedLeft(null);
    } else {
      setMistakes((n) => n + 1);
      setWrongFlash(right);
      setTimeout(() => setWrongFlash(null), 400);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <h2 className="font-display text-xl font-semibold">{step.prompt}</h2>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-2.5">
          {step.pairs.map(({ left }) => {
            const matched = left in matches;
            return (
              <button
                key={left}
                disabled={matched}
                onClick={() => setSelectedLeft(left)}
                className={cn(
                  "rounded-xl border-2 px-3.5 py-3 text-left text-sm font-semibold transition-all",
                  matched
                    ? "border-success/40 bg-success/10 opacity-60"
                    : selectedLeft === left
                      ? "border-primary bg-primary/15 text-primary"
                      : "border-border bg-secondary/40 hover:border-primary/50",
                )}
              >
                {left}
              </button>
            );
          })}
        </div>

        <div className="flex flex-col gap-2.5">
          {rights.map((right) => {
            const matched = Object.values(matches).includes(right);
            return (
              <motion.button
                key={right}
                animate={
                  wrongFlash === right ? { x: [0, -6, 6, -4, 4, 0] } : undefined
                }
                transition={{ duration: 0.35 }}
                disabled={matched || !selectedLeft}
                onClick={() => pickRight(right)}
                className={cn(
                  "rounded-xl border-2 px-3.5 py-3 text-left text-sm transition-all",
                  matched
                    ? "border-success/40 bg-success/10 opacity-60"
                    : wrongFlash === right
                      ? "border-destructive bg-destructive/10"
                      : "border-border bg-secondary/40 enabled:hover:border-primary/50 disabled:opacity-70",
                )}
              >
                {right}
              </motion.button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-xs">
          {mistakes === 0
            ? "Flawless so far"
            : `${mistakes} mismatch${mistakes === 1 ? "" : "es"}`}
        </p>
        <Button size="lg" disabled={!done} onClick={() => onResult(mistakes === 0)}>
          Continue
        </Button>
      </div>
    </div>
  );
}
