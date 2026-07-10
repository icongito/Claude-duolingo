"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ACHIEVEMENTS,
  type AchievementDefinition,
  type AchievementTier,
} from "@/lib/gamification/achievements";
import { cn } from "@/lib/utils";

/** Demo unlock state: streaks/lessons/early XP tiers + a few flavor ones. */
const UNLOCKED_SLUGS = new Set([
  "streak-3",
  "streak-7",
  "xp-100",
  "xp-250",
  "xp-500",
  "xp-1000",
  "xp-2500",
  "xp-5000",
  "lessons-1",
  "lessons-5",
  "lessons-10",
  "lessons-25",
  "lessons-50",
  "first-prompt",
  "profile-complete",
  "boss-1",
  "boss-3",
  "perfect-1",
  "perfect-10",
  "daily-challenge-1",
  "daily-challenge-7",
  "friends-1",
  "friends-5",
  "world-claude-basics-explorer",
  "world-claude-basics-champion",
  "world-prompt-engineering-explorer",
  "world-prompt-engineering-champion",
  "world-claude-code-explorer",
  "coins-100",
  "coins-500",
  "coins-1000",
  "gems-10",
  "gems-50",
  "study-hours-1",
  "study-hours-10",
  "mentor-1",
  "mentor-10",
]);

const TIER_STYLE: Record<AchievementTier, string> = {
  bronze: "border-[#b0764a]/50 text-[#d99b6c]",
  silver: "border-[#9ca3af]/50 text-[#c7ccd4]",
  gold: "border-accent/60 text-accent",
  platinum: "border-[#8be9e2]/50 text-[#8be9e2]",
  legendary: "border-[#b78bff]/60 text-[#b78bff]",
};

function AchievementIcon({ name, className }: { name: string; className?: string }) {
  const Icon =
    (Icons as unknown as Record<string, Icons.LucideIcon>)[name] ??
    Icons.Trophy;
  return <Icon className={className} />;
}

export function AchievementGrid() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [tier, setTier] = useState<string>("all");

  const categories = useMemo(
    () => ["all", ...Array.from(new Set(ACHIEVEMENTS.map((a) => a.category)))],
    [],
  );

  const filtered = useMemo(() => {
    return ACHIEVEMENTS.filter((a) => {
      if (category !== "all" && a.category !== category) return false;
      if (tier !== "all" && a.tier !== tier) return false;
      if (
        query &&
        !`${a.name} ${a.description}`.toLowerCase().includes(query.toLowerCase())
      )
        return false;
      return true;
    });
  }, [query, category, tier]);

  const unlockedCount = ACHIEVEMENTS.filter((a) =>
    UNLOCKED_SLUGS.has(a.slug),
  ).length;

  function CardFor({ a, i }: { a: AchievementDefinition; i: number }) {
    const unlocked = UNLOCKED_SLUGS.has(a.slug);
    const hidden = a.isSecret && !unlocked;

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, delay: Math.min(i * 0.015, 0.3) }}
      >
        <Card
          className={cn(
            "h-full gap-3 p-4",
            unlocked ? "glow-border" : "opacity-60",
          )}
        >
          <div className="flex items-start justify-between gap-2">
            <span
              className={cn(
                "flex size-11 shrink-0 items-center justify-center rounded-xl border-2 bg-secondary/60",
                unlocked ? TIER_STYLE[a.tier] : "border-border text-muted-foreground/50",
              )}
            >
              {hidden ? (
                <Lock className="size-5" />
              ) : (
                <AchievementIcon name={a.icon} className="size-5" />
              )}
            </span>
            <Badge
              variant={unlocked ? "gold" : "secondary"}
              className="capitalize"
            >
              {a.tier}
            </Badge>
          </div>
          <div>
            <p className="text-sm font-semibold">
              {hidden ? "Secret achievement" : a.name}
            </p>
            <p className="text-muted-foreground mt-0.5 line-clamp-2 text-xs">
              {hidden ? "Keep playing to discover this one…" : a.description}
            </p>
          </div>
          <p className="text-muted-foreground mt-auto text-xs">
            +{a.xpReward} XP · +{a.coinReward} coins
            {a.gemReward > 0 ? ` · +${a.gemReward} gems` : ""}
          </p>
        </Card>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search achievements…"
          className="sm:max-w-xs"
          aria-label="Search achievements"
        />
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="sm:w-48" aria-label="Filter by category">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categories.map((c) => (
              <SelectItem key={c} value={c} className="capitalize">
                {c === "all" ? "All categories" : c.replace(/_/g, " ")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={tier} onValueChange={setTier}>
          <SelectTrigger className="sm:w-40" aria-label="Filter by tier">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {["all", "bronze", "silver", "gold", "platinum", "legendary"].map(
              (t) => (
                <SelectItem key={t} value={t} className="capitalize">
                  {t === "all" ? "All tiers" : t}
                </SelectItem>
              ),
            )}
          </SelectContent>
        </Select>
        <p className="text-muted-foreground text-sm sm:ml-auto">
          {unlockedCount}/{ACHIEVEMENTS.length} unlocked
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((a, i) => (
          <CardFor key={a.slug} a={a} i={i} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-muted-foreground py-12 text-center text-sm">
          No achievements match those filters.
        </p>
      )}
    </div>
  );
}
