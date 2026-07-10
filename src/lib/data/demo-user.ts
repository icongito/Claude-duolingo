import { levelProgress, rankForLevel } from "@/lib/gamification/xp";

/**
 * Demo data provider for the signed-out / no-database preview experience.
 * Every app surface reads through these helpers; when Supabase is connected
 * the same shapes are served from the Drizzle schema instead.
 */

export type CurrentUser = {
  id: string;
  username: string;
  displayName: string;
  avatarInitials: string;
  level: number;
  totalXp: number;
  coins: number;
  gems: number;
  skillPoints: number;
  currentStreak: number;
  longestStreak: number;
  streakFreezes: number;
  rank: string;
  dailyGoalXp: number;
  dailyXpEarned: number;
  weeklyGoalDays: number;
  weeklyDaysActive: number;
  joinedAt: string;
};

export const DEMO_USER: CurrentUser = (() => {
  const totalXp = 8420;
  const { level } = levelProgress(totalXp);
  return {
    id: "demo-user",
    username: "pixel_dev",
    displayName: "Pixel Dev",
    avatarInitials: "PD",
    level,
    totalXp,
    coins: 1240,
    gems: 86,
    skillPoints: 12,
    currentStreak: 12,
    longestStreak: 34,
    streakFreezes: 2,
    rank: rankForLevel(level),
    dailyGoalXp: 30,
    dailyXpEarned: 20,
    weeklyGoalDays: 5,
    weeklyDaysActive: 4,
    joinedAt: "2026-03-02",
  };
})();

export type HeatmapDay = { date: string; xp: number };

/**
 * Deterministic 26-week activity heatmap (no Math.random so server and
 * client render identically).
 */
export function getHeatmap(today = new Date("2026-07-09")): HeatmapDay[] {
  const days: HeatmapDay[] = [];
  const total = 26 * 7;
  for (let i = total - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const seed = (d.getDate() * 7 + d.getMonth() * 3 + d.getDay() * 11) % 17;
    const dow = d.getDay();
    let xp = 0;
    if (seed > 4) xp = seed * 6;
    if (dow === 0 && seed < 12) xp = 0; // rest Sundays
    if (i < 12 && xp === 0) xp = 15 + seed; // current streak: recent days active
    days.push({ date: d.toISOString().slice(0, 10), xp });
  }
  return days;
}

export type WeeklyXpPoint = { day: string; xp: number };

export const WEEKLY_XP: WeeklyXpPoint[] = [
  { day: "Mon", xp: 45 },
  { day: "Tue", xp: 80 },
  { day: "Wed", xp: 30 },
  { day: "Thu", xp: 65 },
  { day: "Fri", xp: 20 },
  { day: "Sat", xp: 95 },
  { day: "Sun", xp: 0 },
];
