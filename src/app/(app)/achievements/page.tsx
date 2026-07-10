import type { Metadata } from "next";
import { AchievementGrid } from "@/components/achievements/achievement-grid";

export const metadata: Metadata = { title: "Achievements" };

export default function AchievementsPage() {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6">
      <div>
        <h1 className="font-pixel text-2xl sm:text-3xl">Achievements</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          251 ways to prove you showed up. Secret ones stay hidden until you
          find them.
        </p>
      </div>
      <AchievementGrid />
    </div>
  );
}
