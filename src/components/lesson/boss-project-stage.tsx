"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Lightbulb, Loader2, RotateCcw, Skull } from "lucide-react";
import { Button } from "@/components/ui/button";
import { evaluateProject, type ProjectBrief, type ProjectRequirement } from "@/lib/data/boss";
import { cn } from "@/lib/utils";

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

/**
 * The boss's finale: a blank file and a brief, graded exactly. Unlike a
 * regular code step, a miss here costs a heart — the failure copy is shown
 * (via a Continue gate, same pattern as every other step type) before
 * onResult(false) triggers the remount that wipes the editor back to blank.
 */
export function BossProjectStage({
  brief,
  onResult,
}: {
  brief: ProjectBrief;
  onResult: (correct: boolean) => void;
}) {
  const [code, setCode] = useState(brief.starterCode);
  const [checked, setChecked] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [failed, setFailed] = useState<ProjectRequirement[]>([]);

  const passed = checked && failed.length === 0;

  function submit() {
    setFailed(evaluateProject(code, brief.requirements));
    setChecked(true);
  }

  return (
    <div className="flex flex-col gap-5">
      <h2 className="font-display text-xl font-semibold">{brief.prompt}</h2>
      <p className="text-destructive text-xs font-semibold tracking-widest uppercase">
        Blank file. One shot judged exactly — a miss costs a heart.
      </p>

      <div className="overflow-hidden rounded-xl border border-border">
        <div className="flex items-center justify-between border-b border-border bg-secondary/60 px-3 py-1.5">
          <span className="text-muted-foreground font-mono text-xs">{brief.language}</span>
          <button
            onClick={() => {
              setCode(brief.starterCode);
              setChecked(false);
              setFailed([]);
            }}
            className="text-muted-foreground inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs hover:bg-secondary hover:text-foreground"
          >
            <RotateCcw className="size-3" /> Reset
          </button>
        </div>
        <MonacoEditor
          height="260px"
          language={brief.language === "shell" ? "shell" : brief.language}
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
          💡 {brief.hint}
        </motion.p>
      )}

      {checked && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "rounded-xl border px-4 py-3 text-sm",
            passed ? "border-success/40 bg-success/10" : "border-destructive/40 bg-destructive/10",
          )}
        >
          {passed ? (
            brief.passVerdict
          ) : (
            <div>
              <p className="mb-1.5 flex items-center gap-1.5 font-semibold">
                <Skull className="size-4" /> Rejected — {failed.length} problem
                {failed.length === 1 ? "" : "s"}:
              </p>
              <ul className="flex flex-col gap-1.5">
                {failed.map((r) => (
                  <li key={r.needle}>{r.critique}</li>
                ))}
              </ul>
            </div>
          )}
        </motion.div>
      )}

      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={() => setShowHint(true)} disabled={showHint}>
          <Lightbulb className="size-4" /> Hint
        </Button>
        {!checked ? (
          <Button size="lg" onClick={submit}>
            Submit for judgment
          </Button>
        ) : (
          <Button size="lg" onClick={() => onResult(passed)}>
            Continue
          </Button>
        )}
      </div>
    </div>
  );
}
