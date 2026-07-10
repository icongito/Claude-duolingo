import type { Metadata } from "next";
import {
  AlarmClock,
  Bell,
  Megaphone,
  Trophy,
  TrendingUp,
  UserPlus,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { NOTIFICATIONS, type Notification } from "@/lib/data/demo-misc";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Notifications" };

const TYPE_META: Record<
  Notification["type"],
  { icon: typeof Bell; tone: string }
> = {
  achievement: { icon: Trophy, tone: "bg-accent/15 text-accent" },
  friend_request: { icon: UserPlus, tone: "bg-info/15 text-info" },
  streak_risk: { icon: AlarmClock, tone: "bg-streak/15 text-streak" },
  level_up: { icon: Zap, tone: "bg-primary/15 text-primary" },
  leaderboard_change: { icon: TrendingUp, tone: "bg-success/15 text-success" },
  system: { icon: Megaphone, tone: "bg-secondary text-muted-foreground" },
};

export default function NotificationsPage() {
  const unread = NOTIFICATIONS.filter((n) => !n.read).length;

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-pixel text-2xl sm:text-3xl">Notifications</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {unread} unread
          </p>
        </div>
        <Button variant="ghost" size="sm">
          Mark all as read
        </Button>
      </div>

      <div className="flex flex-col gap-3">
        {NOTIFICATIONS.map((n) => {
          const meta = TYPE_META[n.type];
          return (
            <Card
              key={n.id}
              className={cn(
                "flex-row items-start gap-4 p-4",
                !n.read && "glow-border-strong",
              )}
            >
              <span
                className={cn(
                  "flex size-10 shrink-0 items-center justify-center rounded-xl",
                  meta.tone,
                )}
              >
                <meta.icon className="size-5" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold">{n.title}</p>
                  {!n.read && <Badge className="px-1.5 py-0 text-[10px]">New</Badge>}
                </div>
                <p className="text-muted-foreground mt-0.5 text-sm">{n.body}</p>
                <p className="text-muted-foreground/70 mt-1 text-xs">
                  {n.timeAgo}
                </p>
              </div>
              {n.type === "friend_request" && (
                <div className="flex shrink-0 gap-2">
                  <Button size="sm">Accept</Button>
                  <Button size="sm" variant="ghost">
                    Ignore
                  </Button>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
