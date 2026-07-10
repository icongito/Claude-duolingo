import type { Metadata } from "next";
import * as Icons from "lucide-react";
import { CalendarDays, Flame, Trophy, Zap } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Heatmap } from "@/components/dashboard/heatmap";
import { DEMO_USER, getHeatmap } from "@/lib/data/demo-user";
import { getWorldsProgress } from "@/lib/data/map";
import { ACHIEVEMENTS } from "@/lib/gamification/achievements";
import { levelProgress } from "@/lib/gamification/xp";

export const metadata: Metadata = { title: "Profile" };

function IconFor({ name, className }: { name: string; className?: string }) {
  const Icon =
    (Icons as unknown as Record<string, Icons.LucideIcon>)[name] ??
    Icons.Trophy;
  return <Icon className={className} />;
}

const SHOWCASE_SLUGS = [
  "world-prompt-engineering-champion",
  "streak-7",
  "boss-3",
  "perfect-10",
  "lessons-50",
  "first-prompt",
];

export default function ProfilePage() {
  const user = DEMO_USER;
  const progress = levelProgress(user.totalXp);
  const heatmap = getHeatmap();
  const completedWorlds = getWorldsProgress().filter(
    (w) => w.state === "completed",
  );
  const showcase = ACHIEVEMENTS.filter((a) => SHOWCASE_SLUGS.includes(a.slug));

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      <Card className="glow-border-strong relative overflow-hidden">
        <div className="absolute -top-16 -right-16 size-56 rounded-full bg-primary/15 blur-[80px]" />
        <CardContent className="relative flex flex-col items-center gap-5 sm:flex-row sm:items-start">
          <Avatar className="size-24 border-4">
            <AvatarFallback className="text-2xl">
              {user.avatarInitials}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-1 flex-col items-center gap-2 text-center sm:items-start sm:text-left">
            <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
              <h1 className="font-display text-2xl font-bold">
                {user.displayName}
              </h1>
              <Badge variant="gold">{user.rank}</Badge>
            </div>
            <p className="text-muted-foreground text-sm">
              @{user.username} · joined{" "}
              {new Date(user.joinedAt).toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </p>
            <div className="mt-1 flex w-full max-w-sm flex-col gap-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-pixel text-[10px] text-accent">
                  LVL {progress.level}
                </span>
                <span className="text-muted-foreground">
                  {progress.xpIntoLevel}/{progress.xpForNextLevel} XP to next
                  level
                </span>
              </div>
              <Progress value={progress.progressPct} className="h-2.5" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="flex items-center justify-center gap-1 font-display text-xl font-bold text-streak">
                <Flame className="size-4" /> {user.currentStreak}
              </p>
              <p className="text-muted-foreground text-xs">streak</p>
            </div>
            <div>
              <p className="flex items-center justify-center gap-1 font-display text-xl font-bold text-xp">
                <Zap className="size-4" /> {(user.totalXp / 1000).toFixed(1)}k
              </p>
              <p className="text-muted-foreground text-xs">total XP</p>
            </div>
            <div>
              <p className="flex items-center justify-center gap-1 font-display text-xl font-bold text-accent">
                <Trophy className="size-4" /> 38
              </p>
              <p className="text-muted-foreground text-xs">achievements</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Achievement showcase</CardTitle>
            <CardDescription>Pinned to your public profile</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-3 gap-3">
            {showcase.map((a) => (
              <div
                key={a.slug}
                className="flex flex-col items-center gap-1.5 rounded-xl border border-border bg-secondary/40 p-3 text-center"
                title={a.description}
              >
                <span className="flex size-10 items-center justify-center rounded-xl bg-accent/15 text-accent">
                  <IconFor name={a.icon} className="size-5" />
                </span>
                <p className="line-clamp-2 text-xs font-semibold">{a.name}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Certificates</CardTitle>
            <CardDescription>Earned by defeating world bosses</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {completedWorlds.map(({ world }) => (
              <div
                key={world.slug}
                className="flex items-center gap-3 rounded-xl border border-accent/30 bg-accent/5 px-4 py-3"
              >
                <span className="flex size-10 items-center justify-center rounded-xl bg-accent/15 text-accent">
                  <IconFor name={world.icon} className="size-5" />
                </span>
                <div className="flex-1">
                  <p className="text-sm font-semibold">
                    {world.title} — Certificate of Mastery
                  </p>
                  <p className="text-muted-foreground text-xs">
                    Serial CQ-{world.order.toString().padStart(3, "0")}-8842
                  </p>
                </div>
              </div>
            ))}
            {completedWorlds.length === 0 && (
              <p className="text-muted-foreground text-sm">
                Complete a world to earn your first certificate.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <CalendarDays className="size-4 text-primary" /> Activity
          </CardTitle>
          <CardDescription>
            Longest streak: {user.longestStreak} days
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Heatmap days={heatmap} />
        </CardContent>
      </Card>
    </div>
  );
}
