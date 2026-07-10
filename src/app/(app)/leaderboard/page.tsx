import type { Metadata } from "next";
import { Crown, Medal, TrendingUp } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LEADERBOARD } from "@/lib/data/demo-social";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Leaderboard" };

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1)
    return (
      <span className="flex size-9 items-center justify-center rounded-full bg-accent/20 text-accent">
        <Crown className="size-5" />
      </span>
    );
  if (rank <= 3)
    return (
      <span className="flex size-9 items-center justify-center rounded-full bg-primary/15 text-primary">
        <Medal className="size-5" />
      </span>
    );
  return (
    <span className="text-muted-foreground flex size-9 items-center justify-center font-display font-bold">
      {rank}
    </span>
  );
}

function Board() {
  return (
    <Card className="gap-0 p-0">
      <ol className="divide-y divide-border">
        {LEADERBOARD.map((entry) => (
          <li
            key={entry.username}
            className={cn(
              "flex items-center gap-4 px-5 py-4",
              entry.isCurrentUser &&
                "bg-primary/10 shadow-[inset_3px_0_0_0_var(--color-primary)]",
            )}
          >
            <RankBadge rank={entry.rank} />
            <Avatar className="size-10">
              <AvatarFallback>{entry.initials}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">
                {entry.displayName}
                {entry.isCurrentUser && (
                  <Badge className="ml-2 align-middle">You</Badge>
                )}
              </p>
              <p className="text-muted-foreground text-xs">
                @{entry.username} · Level {entry.level}
              </p>
            </div>
            <div className="text-right">
              <p className="font-display font-bold text-primary">
                {entry.weeklyXp.toLocaleString()} XP
              </p>
              <p className="text-muted-foreground text-xs">this week</p>
            </div>
          </li>
        ))}
      </ol>
    </Card>
  );
}

export default function LeaderboardPage() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <div>
        <h1 className="font-pixel text-2xl sm:text-3xl">Leaderboard</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Resets every Monday. Top 3 earn bonus gems.
        </p>
      </div>

      <Card className="flex-row items-center gap-4 border-accent/40 bg-accent/10 p-4">
        <TrendingUp className="size-6 shrink-0 text-accent" />
        <p className="text-sm">
          You&apos;re <span className="font-bold text-accent">#4</span> this
          week — 645 XP behind the podium. Two boss battles would do it.
        </p>
      </Card>

      <Tabs defaultValue="global">
        <TabsList>
          <TabsTrigger value="global">Global</TabsTrigger>
          <TabsTrigger value="friends">Friends</TabsTrigger>
          <TabsTrigger value="guild">Guild</TabsTrigger>
        </TabsList>
        <TabsContent value="global">
          <Board />
        </TabsContent>
        <TabsContent value="friends">
          <Card className="gap-0 p-0">
            <ol className="divide-y divide-border">
              {LEADERBOARD.filter((e) =>
                ["asyncavery", "css_sorceress", "deploy_dan", "nullpointer", "pixel_dev"].includes(
                  e.username,
                ),
              ).map((entry, i) => (
                <li
                  key={entry.username}
                  className={cn(
                    "flex items-center gap-4 px-5 py-4",
                    entry.isCurrentUser &&
                      "bg-primary/10 shadow-[inset_3px_0_0_0_var(--color-primary)]",
                  )}
                >
                  <RankBadge rank={i + 1} />
                  <Avatar className="size-10">
                    <AvatarFallback>{entry.initials}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">
                      {entry.displayName}
                      {entry.isCurrentUser && (
                        <Badge className="ml-2 align-middle">You</Badge>
                      )}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      @{entry.username} · Level {entry.level}
                    </p>
                  </div>
                  <p className="font-display font-bold text-primary">
                    {entry.weeklyXp.toLocaleString()} XP
                  </p>
                </li>
              ))}
            </ol>
          </Card>
        </TabsContent>
        <TabsContent value="guild">
          <Card className="items-center gap-2 py-12 text-center">
            <p className="font-semibold">Night Shift guild board</p>
            <p className="text-muted-foreground max-w-sm text-sm">
              Guild leaderboards rank all 24 members by weekly XP contribution.
              You&apos;re currently 6th in Night Shift.
            </p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
