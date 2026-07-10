"use client";

import { motion } from "framer-motion";
import { Flame, Zap, Coins, Gem, Award, Target } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { levelProgress } from "@/lib/gamification/xp";
import type { CurrentUser } from "@/lib/data/demo-user";

export function StatCards({ user }: { user: CurrentUser }) {
  const progress = levelProgress(user.totalXp);

  const stats = [
    {
      label: "Daily streak",
      value: `${user.currentStreak} days`,
      sub: `Best: ${user.longestStreak}`,
      icon: Flame,
      tone: "text-streak",
    },
    {
      label: "Total XP",
      value: user.totalXp.toLocaleString(),
      sub: `Level ${progress.level} · ${user.rank}`,
      icon: Zap,
      tone: "text-xp",
    },
    {
      label: "Coins",
      value: user.coins.toLocaleString(),
      sub: "Earned through play",
      icon: Coins,
      tone: "text-gold",
    },
    {
      label: "Gems",
      value: String(user.gems),
      sub: "Premium currency",
      icon: Gem,
      tone: "text-gem",
    },
    {
      label: "Skill points",
      value: String(user.skillPoints),
      sub: "Unspent",
      icon: Award,
      tone: "text-primary",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: i * 0.05 }}
        >
          <Card className="gap-2 p-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-xs font-semibold">
                {stat.label}
              </span>
              <stat.icon className={`size-4 ${stat.tone}`} />
            </div>
            <p className="font-display text-xl font-bold">{stat.value}</p>
            <p className="text-muted-foreground text-xs">{stat.sub}</p>
          </Card>
        </motion.div>
      ))}

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.25 }}
      >
        <Card className="gap-2 p-4">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-xs font-semibold">
              Daily goal
            </span>
            <Target className="size-4 text-success" />
          </div>
          <p className="font-display text-xl font-bold">
            {user.dailyXpEarned}/{user.dailyGoalXp} XP
          </p>
          <Progress
            value={(user.dailyXpEarned / user.dailyGoalXp) * 100}
            className="h-2"
          />
        </Card>
      </motion.div>
    </div>
  );
}
