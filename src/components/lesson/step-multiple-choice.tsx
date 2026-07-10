"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { MultipleChoiceStep } from "@/lib/data/lessons";
import { cn } from "@/lib/utils";

export function StepMultipleChoice({
  step,
  onResult,
}: {
  step: MultipleChoiceStep;
  onResult: (correct: boolean) => void;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);

  const correct = selected === step.correctIndex;

  return (
    <div className="flex flex-col gap-6">
      <h2 className="font-display text-xl font-semibold">{step.prompt}</h2>

      <div className="flex flex-col gap-3" role="radiogroup" aria-label={step.prompt}>
        {step.options.map((option, i) => {
          const isSelected = selected === i;
          const showCorrect = checked && i === step.correctIndex;
          const showWrong = checked && isSelected && !correct;

          return (
            <motion.button
              key={i}
              whileTap={checked ? undefined : { scale: 0.98 }}
              role="radio"
              aria-checked={isSelected}
              disabled={checked}
              onClick={() => setSelected(i)}
              className={cn(
                "flex items-center justify-between gap-3 rounded-xl border-2 px-4 py-3.5 text-left text-sm font-medium transition-colors",
                showCorrect
                  ? "border-success bg-success/10 text-foreground"
                  : showWrong
                    ? "border-destructive bg-destructive/10 text-foreground"
                    : isSelected
                      ? "border-primary bg-primary/10"
                      : "border-border bg-secondary/40 hover:border-primary/50",
              )}
            >
              <span>{option}</span>
              {showCorrect && <Check className="size-4 shrink-0 text-success" />}
              {showWrong && <X className="size-4 shrink-0 text-destructive" />}
            </motion.button>
          );
        })}
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
