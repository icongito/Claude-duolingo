"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { TypingStep } from "@/lib/data/lessons";
import { cn } from "@/lib/utils";

function normalize(s: string) {
  return s.trim().toLowerCase().replace(/\s+/g, " ");
}

export function StepTyping({
  step,
  onResult,
}: {
  step: TypingStep;
  onResult: (correct: boolean) => void;
}) {
  const [value, setValue] = useState("");
  const [checked, setChecked] = useState(false);

  const correct = normalize(value) === normalize(step.answer);

  return (
    <div className="flex flex-col gap-6">
      <h2 className="font-display text-xl font-semibold">{step.prompt}</h2>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!checked && value.trim()) setChecked(true);
        }}
      >
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={step.placeholder}
          disabled={checked}
          autoFocus
          className={cn(
            "h-14 font-mono text-lg",
            checked &&
              (correct
                ? "border-success ring-success/30 ring-[3px]"
                : "border-destructive ring-destructive/30 ring-[3px]"),
          )}
          aria-label="Your answer"
        />
      </form>

      {checked && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "rounded-xl border px-4 py-3 text-sm",
            correct
              ? "border-success/40 bg-success/10"
              : "border-destructive/40 bg-destructive/10",
          )}
        >
          {!correct && (
            <p className="mb-1 font-semibold">
              Expected: <code className="font-mono">{step.answer}</code>
            </p>
          )}
          {step.explanation}
        </motion.div>
      )}

      {!checked ? (
        <Button
          size="lg"
          disabled={!value.trim()}
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
