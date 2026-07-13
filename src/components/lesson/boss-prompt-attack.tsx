"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { evaluatePromptPower, type PromptAttack } from "@/lib/data/boss";
import { cn } from "@/lib/utils";

/**
 * The boss's opening attack: no options to pick from — the player writes an
 * actual prompt and it's judged on power, not correctness. Damage scales
 * with how many criteria the prompt demonstrates; zero criteria met is a
 * miss (costs a heart, remounts blank), same stakes as every other attack.
 */
export function BossPromptAttackStage({
  attack,
  onResult,
}: {
  attack: PromptAttack;
  onResult: (damage: number) => void;
}) {
  const [text, setText] = useState(attack.placeholder);
  const [checked, setChecked] = useState(false);
  const [result, setResult] = useState<ReturnType<typeof evaluatePromptPower> | null>(null);

  function submit() {
    setResult(evaluatePromptPower(text, attack.criteria));
    setChecked(true);
  }

  const landed = (result?.damage ?? 0) > 0;

  return (
    <div className="flex flex-col gap-5">
      <h2 className="font-display text-xl font-semibold">{attack.scenario}</h2>
      <p className="text-destructive text-xs font-semibold tracking-widest uppercase">
        No options — write the real prompt. Damage scales with how good it is.
      </p>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write your prompt…"
        rows={6}
        disabled={checked}
        className="border-border bg-secondary/40 focus:border-primary/60 w-full resize-none rounded-xl border p-4 font-mono text-sm outline-none disabled:opacity-70"
      />

      {checked && result && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "rounded-xl border px-4 py-3 text-sm",
            landed ? "border-primary/40 bg-primary/10" : "border-destructive/40 bg-destructive/10",
          )}
        >
          <p className="mb-2 flex items-center gap-1.5 font-semibold">
            <Sparkles className="size-4" />
            {landed ? `${result.damage} damage dealt.` : "0 damage — that prompt didn't land."}
          </p>
          <ul className="flex flex-col gap-1.5">
            {attack.criteria.map((c) => {
              const met = result.met.includes(c);
              return (
                <li key={c.label} className="flex items-start gap-2">
                  {met ? (
                    <Check className="text-success mt-0.5 size-4 shrink-0" />
                  ) : (
                    <X className="text-destructive mt-0.5 size-4 shrink-0" />
                  )}
                  <span className={met ? undefined : "text-muted-foreground"}>
                    {c.label} {met && `(+${c.power})`}
                  </span>
                </li>
              );
            })}
          </ul>
        </motion.div>
      )}

      <div className="flex items-center justify-end">
        {!checked ? (
          <Button size="lg" onClick={submit} disabled={text.trim().length === 0}>
            Attack
          </Button>
        ) : (
          <Button size="lg" onClick={() => onResult(result!.damage)}>
            Continue
          </Button>
        )}
      </div>
    </div>
  );
}
