"use client";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { HeatmapDay } from "@/lib/data/demo-user";
import { cn } from "@/lib/utils";

function intensity(xp: number): string {
  if (xp === 0) return "bg-secondary";
  if (xp < 20) return "bg-primary/25";
  if (xp < 45) return "bg-primary/50";
  if (xp < 75) return "bg-primary/75";
  return "bg-primary";
}

export function Heatmap({ days }: { days: HeatmapDay[] }) {
  const weeks: HeatmapDay[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  return (
    <div className="flex gap-1 overflow-x-auto pb-1" role="img" aria-label="Learning activity heatmap for the last 26 weeks">
      {weeks.map((week, wi) => (
        <div key={wi} className="flex flex-col gap-1">
          {week.map((day) => (
            <Tooltip key={day.date}>
              <TooltipTrigger asChild>
                <span
                  className={cn("size-3 rounded-[3px]", intensity(day.xp))}
                />
              </TooltipTrigger>
              <TooltipContent>
                {day.date}: {day.xp} XP
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      ))}
    </div>
  );
}
