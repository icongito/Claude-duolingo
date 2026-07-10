"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowDown, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { SortingStep } from "@/lib/data/lessons";
import { cn } from "@/lib/utils";

function stableShuffle<T>(items: T[], seed: number): T[] {
  const arr = [...items];
  let s = seed;
  for (let i = arr.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const j = s % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  // Guarantee the puzzle doesn't start already solved.
  if (arr.every((v, i) => v === items[i]) && arr.length > 1) {
    [arr[0], arr[1]] = [arr[1], arr[0]];
  }
  return arr;
}

export function StepSorting({
  step,
  onResult,
}: {
  step: SortingStep;
  onResult: (correct: boolean) => void;
}) {
  const initial = useMemo(
    () => stableShuffle(step.correctOrder, step.prompt.length * 13),
    [step],
  );
  const [items, setItems] = useState(initial);
  const [checked, setChecked] = useState(false);

  const correct = items.every((v, i) => v === step.correctOrder[i]);

  function move(index: number, dir: -1 | 1) {
    if (checked) return;
    const j = index + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[index], next[j]] = [next[j], next[index]];
    setItems(next);
  }

  return (
    <div className="flex flex-col gap-6">
      <h2 className="font-display text-xl font-semibold">{step.prompt}</h2>

      <ol className="flex flex-col gap-2.5">
        {items.map((item, i) => {
          const rightSpot = checked && item === step.correctOrder[i];
          const wrongSpot = checked && !rightSpot;
          return (
            <motion.li
              key={item}
              layout
              transition={{ duration: 0.25 }}
              className={cn(
                "flex items-center gap-3 rounded-xl border-2 px-4 py-3 text-sm font-medium",
                rightSpot
                  ? "border-success/50 bg-success/10"
                  : wrongSpot
                    ? "border-destructive/50 bg-destructive/10"
                    : "border-border bg-secondary/40",
              )}
            >
              <span className="text-muted-foreground font-mono text-xs">
                {i + 1}
              </span>
              <span className="flex-1">{item}</span>
              <span className="flex gap-1">
                <button
                  onClick={() => move(i, -1)}
                  disabled={checked || i === 0}
                  aria-label={`Move "${item}" up`}
                  className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground disabled:opacity-30"
                >
                  <ArrowUp className="size-4" />
                </button>
                <button
                  onClick={() => move(i, 1)}
                  disabled={checked || i === items.length - 1}
                  aria-label={`Move "${item}" down`}
                  className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground disabled:opacity-30"
                >
                  <ArrowDown className="size-4" />
                </button>
              </span>
            </motion.li>
          );
        })}
      </ol>

      {!checked ? (
        <Button size="lg" onClick={() => setChecked(true)} className="self-end">
          Check
        </Button>
      ) : (
        <Button size="lg" onClick={() => onResult(correct)} className="self-end">
          Continue
        </Button>
      )}
    </div>
  );
}
