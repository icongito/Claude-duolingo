"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Lightbulb, Loader2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CodeStep } from "@/lib/data/lessons";
import { cn } from "@/lib/utils";
import "@/lib/monaco-loader";

const MonacoEditor = dynamic(
  () => import("@monaco-editor/react").then((m) => m.default),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-64 items-center justify-center rounded-xl border border-border bg-secondary/40">
        <Loader2 className="text-muted-foreground size-5 animate-spin" />
      </div>
    ),
  },
);

export function StepCode({
  step,
  onResult,
}: {
  step: CodeStep;
  onResult: (correct: boolean) => void;
}) {
  const [code, setCode] = useState(step.starterCode);
  const [checked, setChecked] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [missing, setMissing] = useState<string[]>([]);

  const correct = checked && missing.length === 0;

  function check() {
    const normalized = code.replace(/\s+/g, " ");
    const missingParts = step.mustInclude.filter(
      (part) => !normalized.includes(part.replace(/\s+/g, " ")),
    );
    setMissing(missingParts);
    setChecked(true);
  }

  return (
    <div className="flex flex-col gap-5">
      <h2 className="font-display text-xl font-semibold">{step.prompt}</h2>

      <div className="overflow-hidden rounded-xl border border-border">
        <div className="flex items-center justify-between border-b border-border bg-secondary/60 px-3 py-1.5">
          <span className="text-muted-foreground font-mono text-xs">
            {step.language}
          </span>
          <button
            onClick={() => {
              setCode(step.starterCode);
              setChecked(false);
              setMissing([]);
            }}
            className="text-muted-foreground inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs hover:bg-secondary hover:text-foreground"
          >
            <RotateCcw className="size-3" /> Reset
          </button>
        </div>
        <MonacoEditor
          height="260px"
          language={step.language === "shell" ? "shell" : step.language}
          theme="vs-dark"
          value={code}
          onChange={(v) => setCode(v ?? "")}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            fontFamily: "var(--font-jetbrains-mono), monospace",
            scrollBeyondLastLine: false,
            padding: { top: 12 },
            lineNumbers: "on",
            renderLineHighlight: "none",
            overviewRulerLanes: 0,
          }}
        />
      </div>

      {showHint && (
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-accent/40 bg-accent/10 px-4 py-3 text-sm"
        >
          💡 {step.hint}
        </motion.p>
      )}

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
          {correct ? (
            step.explanation
          ) : (
            <div>
              <p className="mb-1.5 font-semibold">Not quite — still missing:</p>
              <ul className="flex flex-col gap-1">
                {missing.map((m) => (
                  <li key={m}>
                    <code className="rounded bg-black/30 px-1.5 py-0.5 font-mono text-xs">
                      {m}
                    </code>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </motion.div>
      )}

      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowHint(true)}
          disabled={showHint}
        >
          <Lightbulb className="size-4" /> Hint
        </Button>
        {!correct ? (
          <Button size="lg" onClick={check}>
            Run checks
          </Button>
        ) : (
          <Button size="lg" onClick={() => onResult(true)}>
            Continue
          </Button>
        )}
      </div>
    </div>
  );
}
