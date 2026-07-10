import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CalendarClock,
  Play,
  Skull,
  Swords,
  Trophy,
  Users,
} from "lucide-react";
import * as Icons from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { StatCards } from "@/components/dashboard/stat-cards";
import { Heatmap } from "@/components/dashboard/heatmap";
import { WeeklyChart } from "@/components/dashboard/weekly-chart";
import { DEMO_USER, WEEKLY_XP, getHeatmap } from "@/lib/data/demo-user";
import { DAILY_CHALLENGE, UPCOMING_BOSS } from "@/lib/data/demo-misc";
import { ACTIVITY_FEED } from "@/lib/data/demo-social";
import { getContinueLearning, getWorldsProgress } from "@/lib/data/map";
import { ACHIEVEMENTS } from "@/lib/gamification/achievements";

export const metadata: Metadata = { title: "Dashboard" };

function WorldIcon({ name, className }: { name: string; className?: string }) {
  const Icon =
    (Icons as unknown as Record<string, Icons.LucideIcon>)[name] ??
    Icons.Sparkles;
  return <Icon className={className} />;
}

export default function DashboardPage() {
  const user = DEMO_USER;
  const heatmap = getHeatmap();
  const next = getContinueLearning();
  const worldsProgress = getWorldsProgress().filter(
    (w) => w.state === "active" || w.state === "completed",
  );
  const recentAchievements = ACHIEVEMENTS.filter((a) =>
    ["streak-7", "lessons-50", "world-prompt-engineering-champion"].includes(
      a.slug,
    ),
  );

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6">
      <div>
        <h1 className="font-pixel text-2xl sm:text-3xl">
          Welcome back, {user.displayName}
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          {user.dailyGoalXp - user.dailyXpEarned > 0
            ? `${user.dailyGoalXp - user.dailyXpEarned} XP to hit today's goal — one lesson does it.`
            : "Daily goal complete. Overachiever mode unlocked."}
        </p>
      </div>

      <StatCards user={user} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          {next && (
            <Card className="glow-border-strong relative overflow-hidden">
              <div className="absolute -top-10 -right-10 size-48 rounded-full bg-primary/15 blur-[70px]" />
              <CardHeader>
                <Badge className="w-fit">Continue learning</Badge>
                <CardTitle className="mt-2 text-xl">
                  World {next.world.order}: {next.world.title}
                </CardTitle>
                <CardDescription>
                  Next up: {next.node.title} · +{next.node.xpReward} XP
                </CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-between gap-4">
                <div
                  className="flex size-14 items-center justify-center rounded-2xl border"
                  style={{
                    borderColor: `${next.world.colorFrom}55`,
                    background: `linear-gradient(135deg, ${next.world.colorFrom}22, ${next.world.colorTo}22)`,
                  }}
                >
                  <WorldIcon
                    name={next.world.icon}
                    className="size-7 text-primary"
                  />
                </div>
                <Button size="lg" asChild>
                  <Link href={`/lesson/${next.node.id}`}>
                    <Play className="size-4" /> Start lesson
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}

          <div className="grid gap-6 sm:grid-cols-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Swords className="size-4 text-primary" /> Daily challenge
                  </CardTitle>
                  <span className="text-muted-foreground inline-flex items-center gap-1 text-xs">
                    <CalendarClock className="size-3.5" />
                    {DAILY_CHALLENGE.expiresIn}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <p className="font-semibold">{DAILY_CHALLENGE.title}</p>
                <p className="text-muted-foreground text-sm">
                  {DAILY_CHALLENGE.description}
                </p>
                <div className="flex items-center gap-2 text-xs">
                  <Badge>+{DAILY_CHALLENGE.xpReward} XP</Badge>
                  <Badge variant="gold">+{DAILY_CHALLENGE.coinReward} coins</Badge>
                </div>
                <Button variant="secondary" className="mt-1" asChild>
                  <Link href="/lesson/claude-code-8">
                    Take the challenge <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Skull className="size-4 text-primary" /> Upcoming boss
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <p className="font-semibold">{UPCOMING_BOSS.name}</p>
                <p className="text-muted-foreground text-sm">
                  Guards the end of the {UPCOMING_BOSS.world} world.
                </p>
                <p className="text-muted-foreground text-xs">
                  {UPCOMING_BOSS.nodesAway} nodes away
                </p>
                <Button variant="outline" className="mt-auto" asChild>
                  <Link href="/learn/claude-code">
                    View the map <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">This week</CardTitle>
              <CardDescription>
                {user.weeklyDaysActive}/{user.weeklyGoalDays} active days ·{" "}
                {WEEKLY_XP.reduce((sum, d) => sum + d.xp, 0)} XP earned
              </CardDescription>
            </CardHeader>
            <CardContent>
              <WeeklyChart data={WEEKLY_XP} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Learning heatmap</CardTitle>
              <CardDescription>Last 26 weeks of activity</CardDescription>
            </CardHeader>
            <CardContent>
              <Heatmap days={heatmap} />
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Trophy className="size-4 text-accent" /> Recent achievements
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {recentAchievements.map((a) => (
                <div key={a.slug} className="flex items-center gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent/15 text-accent">
                    <WorldIcon name={a.icon} className="size-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{a.name}</p>
                    <p className="text-muted-foreground truncate text-xs">
                      {a.description}
                    </p>
                  </div>
                </div>
              ))}
              <Button variant="ghost" size="sm" asChild className="self-start">
                <Link href="/achievements">
                  View all <ArrowRight className="size-3.5" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">World progress</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {worldsProgress.map(({ world, completed, total, pct }) => (
                <Link
                  key={world.slug}
                  href={`/learn/${world.slug}`}
                  className="group flex flex-col gap-1.5"
                >
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold group-hover:text-primary">
                      {world.title}
                    </span>
                    <span className="text-muted-foreground text-xs">
                      {completed}/{total}
                    </span>
                  </div>
                  <Progress value={pct} className="h-2" />
                </Link>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Users className="size-4 text-info" /> Friends activity
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {ACTIVITY_FEED.slice(0, 3).map((item) => (
                <div key={item.id} className="flex items-start gap-3">
                  <Avatar className="size-8">
                    <AvatarFallback className="text-xs">
                      {item.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 text-sm">
                    <p>
                      <span className="font-semibold">{item.displayName}</span>{" "}
                      <span className="text-muted-foreground">{item.verb}</span>
                    </p>
                    <p className="text-muted-foreground truncate text-xs">
                      {item.detail} · {item.timeAgo}
                    </p>
                  </div>
                </div>
              ))}
              <Button variant="ghost" size="sm" asChild className="self-start">
                <Link href="/community">
                  Open community <ArrowRight className="size-3.5" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
