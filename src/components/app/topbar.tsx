"use client";

import Link from "next/link";
import { Flame, Coins, Gem, Bell, LogOut, Settings, UserRound } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { levelProgress } from "@/lib/gamification/xp";
import { DEMO_USER } from "@/lib/data/demo-user";
import { NOTIFICATIONS } from "@/lib/data/demo-misc";
import { signOut } from "@/lib/auth/actions";

export function Topbar() {
  const user = DEMO_USER;
  const progress = levelProgress(user.totalXp);
  const unread = NOTIFICATIONS.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-4 border-b border-border bg-background/80 px-4 backdrop-blur sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <div className="hidden w-44 flex-col gap-1 sm:flex">
          <div className="flex items-center justify-between text-xs">
            <span className="font-pixel text-[10px] text-accent">
              LVL {progress.level}
            </span>
            <span className="text-muted-foreground">
              {progress.xpIntoLevel}/{progress.xpForNextLevel} XP
            </span>
          </div>
          <Progress value={progress.progressPct} className="h-2" />
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary/60 px-3 py-1.5 text-sm font-bold text-streak">
              <Flame className="size-4" />
              {user.currentStreak}
            </span>
          </TooltipTrigger>
          <TooltipContent>
            {user.currentStreak}-day streak · {user.streakFreezes} freezes banked
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary/60 px-3 py-1.5 text-sm font-bold text-gold">
              <Coins className="size-4" />
              {user.coins.toLocaleString()}
            </span>
          </TooltipTrigger>
          <TooltipContent>Coins — earned through play</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <span className="hidden items-center gap-1.5 rounded-full border border-border bg-secondary/60 px-3 py-1.5 text-sm font-bold text-gem sm:inline-flex">
              <Gem className="size-4" />
              {user.gems}
            </span>
          </TooltipTrigger>
          <TooltipContent>Gems — premium currency</TooltipContent>
        </Tooltip>

        <Link
          href="/notifications"
          className="relative rounded-xl p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          aria-label={`Notifications${unread ? ` (${unread} unread)` : ""}`}
        >
          <Bell className="size-5" />
          {unread > 0 && (
            <span className="absolute top-1 right-1 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
              {unread}
            </span>
          )}
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button aria-label="Account menu">
              <Avatar>
                <AvatarFallback>{user.avatarInitials}</AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="flex flex-col gap-0.5">
              <span className="text-foreground text-sm">{user.displayName}</span>
              <span className="text-muted-foreground text-xs font-normal">
                @{user.username}
              </span>
              <Badge variant="gold" className="mt-1 w-fit">
                {user.rank}
              </Badge>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/profile">
                <UserRound /> Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings">
                <Settings /> Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onSelect={() => void signOut()}
            >
              <LogOut /> Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
