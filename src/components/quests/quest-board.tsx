"use client";

import { useState } from "react";
import {
  Brain,
  CalendarCheck,
  Check,
  Coins,
  Flame,
  Gem,
  Skull,
  Swords,
  Target,
  Timer,
  TrendingUp,
  UserPlus,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { QUESTS, type Quest } from "@/lib/data/economy";
import { cn } from "@/lib/utils";

const ICONS: Record<string, LucideIcon> = {
  Zap,
  Target,
  Brain,
  CalendarCheck,
  TrendingUp,
  Swords,
  UserPlus,
  Skull,
  Flame,
};

const SECTIONS: Array<{ cadence: Quest["cadence"]; title: string; blurb: string }> = [
  { cadence: "daily", title: "Daily", blurb: "Reset every midnight. Coins and XP." },
  { cadence: "weekly", title: "Weekly", blurb: "The routine gem faucet — a few each week." },
  { cadence: "special", title: "Special", blurb: "One-time challenges with the biggest gem payouts." },
];

function RewardBadges({ reward }: { reward: Quest["reward"] }) {
  return (
    <span className="flex items-center gap-2">
      {reward.gems && (
        <span className="text-gem inline-flex items-center gap-1 text-sm font-bold">
          <Gem className="size-3.5" /> {reward.gems}
        </span>
      )}
      {reward.coins && (
        <span className="text-gold inline-flex items-center gap-1 text-sm font-bold">
          <Coins className="size-3.5" /> {reward.coins}
        </span>
      )}
      {reward.xp && (
        <span className="text-primary text-sm font-bold">+{reward.xp} XP</span>
      )}
    </span>
  );
}

export function QuestBoard() {
  const [claimed, setClaimed] = useState<Set<string>>(
    () => new Set(QUESTS.filter((q) => q.claimed).map((q) => q.id)),
  );

  return (
    <div className="flex flex-col gap-8">
      {SECTIONS.map((section) => (
        <section key={section.cadence} className="flex flex-col gap-3">
          <div className="flex items-baseline justify-between">
            <h2 className="font-display text-lg font-bold">{section.title}</h2>
            <p className="text-muted-foreground text-xs">{section.blurb}</p>
          </div>
          <div className="flex flex-col gap-3">
            {QUESTS.filter((q) => q.cadence === section.cadence).map((quest) => {
              const Icon = ICONS[quest.icon] ?? Zap;
              const isClaimed = claimed.has(quest.id);
              const pct = Math.min(100, (quest.progress / quest.target) * 100);
              return (
                <Card
                  key={quest.id}
                  className={cn("flex flex-col gap-3 p-4", isClaimed && "opacity-60")}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <span
                        className={cn(
                          "flex size-10 shrink-0 items-center justify-center rounded-xl",
                          quest.reward.gems
                            ? "bg-gem/15 text-gem"
                            : "bg-primary/15 text-primary",
                        )}
                      >
                        <Icon className="size-5" />
                      </span>
                      <div>
                        <h3 className="font-display font-semibold">{quest.title}</h3>
                        <p className="text-muted-foreground text-sm">{quest.description}</p>
                      </div>
                    </div>
                    <RewardBadges reward={quest.reward} />
                  </div>
                  <div className="flex items-center gap-3">
                    <Progress value={pct} className="h-2.5 flex-1" />
                    <span className="text-muted-foreground text-xs font-semibold tabular-nums">
                      {Math.min(quest.progress, quest.target)}/{quest.target}
                    </span>
                    {isClaimed ? (
                      <Badge variant="outline">
                        <Check className="size-3" /> Claimed
                      </Badge>
                    ) : quest.completed ? (
                      <Button size="sm" onClick={() => setClaimed(new Set(claimed).add(quest.id))}>
                        Claim
                      </Button>
                    ) : quest.expiresIn ? (
                      <span className="text-muted-foreground inline-flex items-center gap-1 text-xs">
                        <Timer className="size-3.5" /> {quest.expiresIn}
                      </span>
                    ) : null}
                  </div>
                </Card>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
