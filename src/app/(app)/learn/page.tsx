import type { Metadata } from "next";
import Link from "next/link";
import * as Icons from "lucide-react";
import { Check, Lock, Play } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getWorldsProgress } from "@/lib/data/map";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Learning worlds" };

function WorldIcon({ name, className }: { name: string; className?: string }) {
  const Icon =
    (Icons as unknown as Record<string, Icons.LucideIcon>)[name] ??
    Icons.Sparkles;
  return <Icon className={className} />;
}

export default function LearnPage() {
  const worlds = getWorldsProgress();

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      <div>
        <h1 className="font-pixel text-2xl sm:text-3xl">Learning worlds</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          25 worlds. Each one unlocks the next. Bosses guard the exits.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {worlds.map(({ world, completed, total, pct, state }) => {
          const locked = state === "locked";
          const card = (
            <Card
              className={cn(
                "h-full gap-4 transition-transform duration-200",
                state === "active" && "glow-border-strong",
                locked
                  ? "opacity-50"
                  : "hover:-translate-y-0.5 hover:shadow-[0_16px_40px_-16px_rgba(255,122,26,0.35)]",
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className="flex size-12 shrink-0 items-center justify-center rounded-xl border"
                    style={{
                      borderColor: `${world.colorFrom}55`,
                      background: `linear-gradient(135deg, ${world.colorFrom}22, ${world.colorTo}22)`,
                    }}
                  >
                    <WorldIcon
                      name={world.icon}
                      className={cn(
                        "size-6",
                        locked ? "text-muted-foreground" : "text-primary",
                      )}
                    />
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs font-semibold">
                      World {world.order}
                    </p>
                    <h2 className="font-display font-semibold">{world.title}</h2>
                  </div>
                </div>
                {state === "completed" && (
                  <Badge variant="success">
                    <Check /> Complete
                  </Badge>
                )}
                {state === "active" && (
                  <Badge>
                    <Play /> In progress
                  </Badge>
                )}
                {locked && (
                  <Badge variant="secondary">
                    <Lock /> Locked
                  </Badge>
                )}
              </div>

              <p className="text-muted-foreground line-clamp-2 text-sm">
                {world.description}
              </p>

              <div className="mt-auto flex flex-col gap-1.5">
                <div className="text-muted-foreground flex justify-between text-xs">
                  <span>
                    {completed}/{total} nodes
                  </span>
                  <span>~{world.estimatedHours}h</span>
                </div>
                <Progress value={pct} className="h-2" />
              </div>
            </Card>
          );

          return locked ? (
            <div key={world.slug} aria-disabled>
              {card}
            </div>
          ) : (
            <Link key={world.slug} href={`/learn/${world.slug}`}>
              {card}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
