import type { Metadata } from "next";
import { Castle, Flame, Heart, MessageCircle, UserPlus } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ACTIVITY_FEED, FRIENDS, GUILDS } from "@/lib/data/demo-social";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Community" };

export default function CommunityPage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      <div>
        <h1 className="font-pixel text-2xl sm:text-3xl">Community</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Friends, guilds, and everything happening around you.
        </p>
      </div>

      <Tabs defaultValue="feed">
        <TabsList>
          <TabsTrigger value="feed">Activity feed</TabsTrigger>
          <TabsTrigger value="friends">Friends</TabsTrigger>
          <TabsTrigger value="guilds">Guilds</TabsTrigger>
        </TabsList>

        <TabsContent value="feed" className="flex flex-col gap-4">
          {ACTIVITY_FEED.map((item) => (
            <Card key={item.id} className="flex-row items-start gap-4 p-5">
              <Avatar className="size-10 shrink-0">
                <AvatarFallback>{item.initials}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="text-sm">
                  <span className="font-semibold">{item.displayName}</span>{" "}
                  <span className="text-muted-foreground">{item.verb}</span>
                </p>
                <p className="mt-0.5 text-sm">{item.detail}</p>
                <div className="mt-2 flex items-center gap-4">
                  <button
                    className={cn(
                      "inline-flex items-center gap-1.5 text-xs transition-colors",
                      item.likedByMe
                        ? "text-streak"
                        : "text-muted-foreground hover:text-streak",
                    )}
                    aria-pressed={item.likedByMe}
                  >
                    <Heart
                      className={cn("size-4", item.likedByMe && "fill-current")}
                    />
                    {item.likes}
                  </button>
                  <button className="text-muted-foreground inline-flex items-center gap-1.5 text-xs hover:text-foreground">
                    <MessageCircle className="size-4" /> Reply
                  </button>
                  <span className="text-muted-foreground ml-auto text-xs">
                    {item.timeAgo}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="friends" className="flex flex-col gap-4">
          <div className="flex justify-end">
            <Button variant="secondary" size="sm">
              <UserPlus className="size-4" /> Add friend
            </Button>
          </div>
          {FRIENDS.map((friend) => (
            <Card key={friend.username} className="flex-row items-center gap-4 p-5">
              <div className="relative">
                <Avatar className="size-11">
                  <AvatarFallback>{friend.initials}</AvatarFallback>
                </Avatar>
                <span
                  className={cn(
                    "absolute -right-0.5 -bottom-0.5 size-3.5 rounded-full border-2 border-card",
                    friend.status === "online" && "bg-success",
                    friend.status === "learning" && "bg-primary",
                    friend.status === "offline" && "bg-muted-foreground/40",
                  )}
                  aria-label={friend.status}
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold">
                  {friend.displayName}{" "}
                  <span className="text-muted-foreground font-normal">
                    · Level {friend.level}
                  </span>
                </p>
                <p className="text-muted-foreground truncate text-xs">
                  {friend.lastActivity}
                </p>
              </div>
              <span className="text-streak inline-flex items-center gap-1 text-sm font-bold">
                <Flame className="size-4" /> {friend.currentStreak}
              </span>
              <Button variant="outline" size="sm">
                <MessageCircle className="size-4" /> Message
              </Button>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="guilds" className="flex flex-col gap-4">
          {GUILDS.map((guild) => (
            <Card key={guild.slug}>
              <CardHeader>
                <div className="flex items-center justify-between gap-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <span className="flex size-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
                      <Castle className="size-5" />
                    </span>
                    {guild.name}
                    {guild.isMember && <Badge>Your guild</Badge>}
                  </CardTitle>
                  {!guild.isMember && (
                    <Button
                      variant="secondary"
                      size="sm"
                      disabled={guild.members >= guild.memberCap}
                    >
                      {guild.members >= guild.memberCap ? "Full" : "Join"}
                    </Button>
                  )}
                </div>
                <CardDescription>{guild.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                <div className="text-muted-foreground flex justify-between text-xs">
                  <span>
                    {guild.members}/{guild.memberCap} members
                  </span>
                  <span>{guild.weeklyXp.toLocaleString()} XP this week</span>
                </div>
                <Progress
                  value={(guild.members / guild.memberCap) * 100}
                  className="h-2"
                />
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
