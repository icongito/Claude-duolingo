import type { Metadata } from "next";
import { Gem } from "lucide-react";
import { QuestBoard } from "@/components/quests/quest-board";
import { WEEKLY_GEM_CAP } from "@/lib/data/economy";

export const metadata: Metadata = { title: "Quests" };

export default function QuestsPage() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <div>
        <h1 className="font-pixel text-2xl sm:text-3xl">Quests</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Dailies pay coins. Weeklies and specials are where gems come from —{" "}
          <span className="text-gem inline-flex items-center gap-1">
            <Gem className="size-3.5" /> capped at {WEEKLY_GEM_CAP}/week
          </span>{" "}
          so they stay worth something.
        </p>
      </div>
      <QuestBoard />
    </div>
  );
}
