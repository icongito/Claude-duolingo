"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  CloudUpload,
  FolderGit2,
  Gem,
  GitCommitHorizontal,
  Heart,
  Loader2,
  Skull,
  Swords,
  Timer,
  X,
} from "lucide-react";
import { AdCard } from "@/components/ads/ad-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LittleGuy } from "@/components/mascot/little-guy";
import type { BossBattle } from "@/lib/data/boss";
import { StepRenderer } from "./lesson-player";
import { cn } from "@/lib/utils";

const MAX_HEARTS = 3;

type Phase =
  | "intro"
  | "stage"
  | "playing"
  | "publishing"
  | "published"
  | "victory"
  | "defeat";

function formatClock(s: number): string {
  const m = Math.floor(s / 60);
  return `${m}:${String(s % 60).padStart(2, "0")}`;
}

function BossHpBar({ hp, maxHp, name }: { hp: number; maxHp: number; name: string }) {
  const pct = (hp / maxHp) * 100;
  return (
    <div className="flex-1">
      <div className="mb-1 flex items-center justify-between gap-2">
        <span className="font-pixel text-destructive flex items-center gap-1.5 text-xs">
          <Skull className="size-3.5" /> {name}
        </span>
        <span className="text-muted-foreground text-xs font-semibold tabular-nums">
          {hp}/{maxHp} HP
        </span>
      </div>
      <div
        className="bg-secondary h-3.5 overflow-hidden rounded-full"
        role="progressbar"
        aria-label={`Boss health: ${hp} of ${maxHp}`}
        aria-valuenow={hp}
        aria-valuemin={0}
        aria-valuemax={maxHp}
      >
        <motion.div
          className="from-destructive h-full rounded-full bg-gradient-to-r to-orange-600"
          initial={false}
          animate={{ width: `${pct}%` }}
          transition={{ type: "spring", stiffness: 160, damping: 20 }}
        />
      </div>
    </div>
  );
}

export function BossPlayer({ battle }: { battle: BossBattle }) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [stageIndex, setStageIndex] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const [hearts, setHearts] = useState(MAX_HEARTS);
  const [timeLeft, setTimeLeft] = useState(battle.timeLimitSeconds);
  const [attempts, setAttempts] = useState(0);
  const [defeatReason, setDefeatReason] = useState<"hearts" | "time">("hearts");

  const maxHp = battle.stages.reduce((n, s) => n + s.steps.length, 0);
  const cleared =
    battle.stages.slice(0, stageIndex).reduce((n, s) => n + s.steps.length, 0) +
    stepIndex;
  const bossHp = maxHp - cleared;
  const stage = battle.stages[stageIndex];
  const fighting = phase === "stage" || phase === "playing";

  // One countdown for the whole battle; stage banners don't pause it.
  useEffect(() => {
    if (!fighting) return;
    const id = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          setDefeatReason("time");
          setPhase("defeat");
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [fighting]);

  // The Ship It project "publishes" for a beat before the repo card reveals.
  useEffect(() => {
    if (phase !== "publishing") return;
    const id = setTimeout(() => setPhase("published"), 1600);
    return () => clearTimeout(id);
  }, [phase]);

  function reset() {
    setStageIndex(0);
    setStepIndex(0);
    setHearts(MAX_HEARTS);
    setTimeLeft(battle.timeLimitSeconds);
    setAttempts(0);
    setPhase("intro");
  }

  // A missed attack doesn't advance: the step remounts (via the attempt
  // counter in its key) and must be landed before the boss loses that HP.
  function handleResult(correct: boolean) {
    if (!correct) {
      const next = hearts - 1;
      setHearts(next);
      setAttempts((a) => a + 1);
      if (next <= 0) {
        setDefeatReason("hearts");
        setPhase("defeat");
      }
      return;
    }
    if (stepIndex + 1 < stage.steps.length) {
      setStepIndex((i) => i + 1);
    } else if (stage.kind === "project") {
      // Ship It is always the last stage — clearing it publishes, then wins.
      setPhase("publishing");
    } else if (stageIndex + 1 < battle.stages.length) {
      setStageIndex((i) => i + 1);
      setStepIndex(0);
      setPhase("stage");
    } else {
      setPhase("victory");
    }
  }

  if (phase === "intro") {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6 text-center">
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex flex-col items-center gap-5"
        >
          <LittleGuy animation="boss" size={220} />
          <p className="text-destructive flex items-center gap-2 text-xs font-semibold tracking-widest uppercase">
            <Skull className="size-4" /> {battle.worldTitle} · Boss Battle
          </p>
          <h1 className="font-pixel text-4xl">{battle.name}</h1>
          <p className="text-muted-foreground max-w-md">{battle.tagline}</p>
          <div className="text-muted-foreground flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm">
            <span className="flex items-center gap-1.5">
              <Swords className="size-4" /> {battle.stages.length} stages · {maxHp} attacks
            </span>
            <span className="flex items-center gap-1.5">
              <Timer className="size-4" /> {formatClock(battle.timeLimitSeconds)} on the clock
            </span>
            <span className="flex items-center gap-1.5">
              <Heart className="fill-streak text-streak size-4" /> {MAX_HEARTS} hearts, whole fight
            </span>
          </div>
          <p className="text-muted-foreground max-w-md text-sm">
            Beat every stage to finish the {battle.worldTitle} world and earn{" "}
            <span className="text-primary font-semibold">+{battle.xpReward} XP</span> and a
            first-clear bonus of{" "}
            <span className="text-accent font-semibold">{battle.gemReward} gems</span>.
          </p>
          <div className="mt-2 flex gap-3">
            <Button size="lg" onClick={() => setPhase("stage")}>
              Fight
            </Button>
            <Button size="lg" variant="secondary" asChild>
              <Link href={`/learn/${battle.worldSlug}`}>Retreat</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (phase === "publishing") {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-5 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-5"
        >
          <Loader2 className="text-primary size-10 animate-spin" />
          <h1 className="font-pixel text-2xl">Publishing to GitHub…</h1>
          <p className="text-muted-foreground max-w-sm text-sm">
            Pushing{" "}
            <code className="rounded bg-black/30 px-1.5 py-0.5 font-mono text-xs">
              {battle.project.repoOwner}/{battle.project.repoName}
            </code>
          </p>
        </motion.div>
      </div>
    );
  }

  if (phase === "published") {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6 text-center">
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 16 }}
          className="flex w-full max-w-md flex-col items-center gap-5"
        >
          <LittleGuy animation="chest" size={200} />
          <h1 className="font-pixel text-2xl">Shipped it!</h1>
          <Card className="w-full gap-3 p-5 text-left">
            <div className="flex items-center gap-2">
              <FolderGit2 className="text-primary size-5 shrink-0" />
              <span className="font-mono text-sm font-semibold">
                {battle.project.repoOwner}/{battle.project.repoName}
              </span>
              <Badge variant="outline" className="ml-auto">
                public
              </Badge>
            </div>
            <div className="text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
              <span className="flex items-center gap-1">
                <GitCommitHorizontal className="size-3.5" /> {battle.project.commitSha}
              </span>
              <span>
                {battle.project.filesChanged} file
                {battle.project.filesChanged === 1 ? "" : "s"} changed
              </span>
              <span className="capitalize">{battle.project.size} project</span>
            </div>
          </Card>
          <p className="text-muted-foreground flex items-center gap-1.5 text-xs">
            <CloudUpload className="size-3.5" /> Demo publish — no real repository was
            created.
          </p>
          <Button size="lg" onClick={() => setPhase("victory")}>
            Continue
          </Button>
        </motion.div>
      </div>
    );
  }

  if (phase === "victory") {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6 text-center">
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 14 }}
          className="flex flex-col items-center gap-5"
        >
          <LittleGuy animation="level" size={220} />
          <p className="text-muted-foreground text-xs font-semibold tracking-widest uppercase">
            {battle.name} defeated
          </p>
          <h1 className="font-pixel text-3xl">World complete!</h1>
          <p className="text-muted-foreground max-w-sm">
            The {battle.worldTitle} world is beaten with{" "}
            {formatClock(timeLeft)} to spare. The next world is unlocked.
          </p>
          <div className="flex items-center gap-3">
            <motion.span
              initial={{ y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.35 }}
              className="rounded-full border border-primary/40 bg-primary/15 px-4 py-2 font-display text-lg font-bold text-primary"
            >
              +{battle.xpReward} XP
            </motion.span>
            <motion.span
              initial={{ y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent/15 px-4 py-2 font-display text-lg font-bold text-accent"
            >
              <Gem className="size-4" /> +{battle.gemReward} first clear
            </motion.span>
          </div>
          <div className="mt-2 flex gap-3">
            <Button size="lg" asChild>
              <Link href="/learn">Next world</Link>
            </Button>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          </div>
          <AdCard seed={battle.nodeId.length} />
        </motion.div>
      </div>
    );
  }

  if (phase === "defeat") {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex flex-col items-center gap-5"
        >
          <LittleGuy animation="wrong" size={220} />
          <h1 className="font-pixel text-3xl">
            {defeatReason === "time" ? "Time's up" : "Out of hearts"}
          </h1>
          <p className="text-muted-foreground max-w-sm">
            {battle.name} still has {bossHp} HP left. No XP lost — regroup and
            run the whole gauntlet back.
          </p>
          <div className="mt-2 flex gap-3">
            <Button size="lg" onClick={reset}>
              Rematch
            </Button>
            <Button size="lg" variant="secondary" asChild>
              <Link href={`/learn/${battle.worldSlug}`}>Back to the map</Link>
            </Button>
          </div>
          <AdCard seed={battle.nodeId.length + 1} />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-8">
      <div className="flex items-center gap-4">
        <Link
          href={`/learn/${battle.worldSlug}`}
          aria-label="Abandon boss battle"
          className="text-muted-foreground rounded-lg p-1.5 hover:bg-secondary hover:text-foreground"
        >
          <X className="size-5" />
        </Link>
        <BossHpBar hp={bossHp} maxHp={maxHp} name={battle.name} />
        <span
          className={cn(
            "flex items-center gap-1 font-display text-sm font-bold tabular-nums",
            timeLeft <= 30 ? "text-destructive" : "text-muted-foreground",
          )}
          aria-label={`${formatClock(timeLeft)} remaining`}
        >
          <Timer className="size-4" /> {formatClock(timeLeft)}
        </span>
        <div className="flex items-center gap-1" aria-label={`${hearts} hearts remaining`}>
          {Array.from({ length: MAX_HEARTS }).map((_, i) => (
            <Heart
              key={i}
              className={cn(
                "size-5",
                i < hearts ? "fill-streak text-streak" : "fill-secondary text-secondary",
              )}
            />
          ))}
        </div>
      </div>

      {phase === "stage" ? (
        <motion.div
          key={`stage-${stageIndex}`}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex min-h-[40vh] flex-col items-center justify-center gap-4 text-center"
        >
          <p className="text-destructive text-xs font-semibold tracking-widest uppercase">
            Stage {stageIndex + 1} of {battle.stages.length}
          </p>
          <h2 className="font-pixel text-3xl">{stage.title}</h2>
          <p className="text-muted-foreground">{stage.intro}</p>
          <Button size="lg" className="mt-2" onClick={() => setPhase("playing")}>
            {stageIndex === 0 ? "Begin" : "Keep going"}
          </Button>
        </motion.div>
      ) : (
        <>
          <p className="text-muted-foreground -mb-4 text-xs font-semibold tracking-widest uppercase">
            Stage {stageIndex + 1}: {stage.title}
            {stage.kind === "project"
              ? " · build the project"
              : ` · attack ${stepIndex + 1} of ${stage.steps.length}`}
          </p>
          <AnimatePresence mode="wait">
            <motion.div
              key={`${stageIndex}-${stepIndex}-${attempts}`}
              initial={{ opacity: 0, x: 32 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -32 }}
              transition={{ duration: 0.25 }}
            >
              <StepRenderer step={stage.steps[stepIndex]} onResult={handleResult} />
            </motion.div>
          </AnimatePresence>
        </>
      )}
    </div>
  );
}
