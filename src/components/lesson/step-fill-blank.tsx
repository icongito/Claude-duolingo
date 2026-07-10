"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import type { FillBlankStep } from "@/lib/data/lessons";
import { cn } from "@/lib/utils";

export function StepFillBlank({
  step,
  onResult,
}: {
  step: FillBlankStep;
  onResult: (correct: boolean) => void;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);

  const correct = selected === step.correctIndex;
  const [before, after] = step.sentence.split("___");

  return (
    <div className="flex flex-col gap-6">
      <h2 className="font-display text-xl font-semibold">{step.prompt}</h2>

      <p className="rounded-2xl border border-border bg-secondary/40 px-5 py-6 text-lg leading-relaxed">
        {before}
        <span
          className={cn(
            "mx-1 inline-block min-w-24 rounded-lg border-b-2 px-2 text-center font-semibold",
            selected !== null
              ? checked
                ? correct
                  ? "border-success text-success"
                  : "border-destructive text-destructive"
                : "border-primary text-primary"
              : "border-muted-foreground/50 text-transparent",
          )}
        >
          {selected !== null ? step.options[selected] : "____"}
        </span>
        {after}
      </p>

      <div className="flex flex-wrap gap-2">
        {step.options.map((option, i) => (
          <button
            key={i}
            disabled={checked}
            onClick={() => setSelected(i)}
            className={cn(
              "rounded-xl border-2 px-4 py-2 text-sm font-semibold transition-colors",
              selected === i
                ? "border-primary bg-primary/15 text-primary"
                : "border-border bg-secondary/40 hover:border-primary/50",
              checked && i === step.correctIndex && "border-success text-success",
            )}
          >
            {option}
          </button>
        ))}
      </div>

      {checked && (
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "rounded-xl border px-4 py-3 text-sm",
            correct
              ? "border-success/40 bg-success/10"
              : "border-destructive/40 bg-destructive/10",
          )}
        >
          {step.explanation}
        </motion.p>
      )}

      {!checked ? (
        <Button
          size="lg"
          disabled={selected === null}
          onClick={() => setChecked(true)}
          className="self-end"
        >
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
