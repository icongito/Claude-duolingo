"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  BookOpen,
  Check,
  Dumbbell,
  Gift,
  HelpCircle,
  Lock,
  Skull,
  Sparkles,
  Wrench,
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { MapNode, MapNodeKind } from "@/lib/data/map";
import { cn } from "@/lib/utils";

const KIND_ICON: Record<MapNodeKind, typeof BookOpen> = {
  lesson: BookOpen,
  practice: Dumbbell,
  quiz: HelpCircle,
  treasure: Gift,
  project: Wrench,
  boss: Skull,
  secret: Sparkles,
};

const LANE_OFFSET = 56; // px per lane step

function NodeCircle({ node }: { node: MapNode }) {
  const Icon = KIND_ICON[node.kind];
  const isBoss = node.kind === "boss";
  const size = isBoss ? "size-20" : "size-16";

  const base = cn(
    "relative flex items-center justify-center rounded-full border-2 transition-transform",
    size,
  );

  switch (node.status) {
    case "completed":
      return (
        <div
          className={cn(
            base,
            "border-primary bg-gradient-to-b from-primary to-[#e56700] text-primary-foreground shadow-[0_0_24px_rgba(255,122,26,0.45)]",
          )}
        >
          <Icon className={isBoss ? "size-9" : "size-7"} />
          <span className="absolute -right-1 -bottom-1 flex size-6 items-center justify-center rounded-full border-2 border-background bg-success text-background">
            <Check className="size-3.5" strokeWidth={3} />
          </span>
        </div>
      );
    case "current":
      return (
        <div
          className={cn(
            base,
            "animate-node-pulse border-accent bg-gradient-to-b from-accent to-[#e5a63e] text-accent-foreground",
          )}
        >
          <Icon className={isBoss ? "size-9" : "size-7"} />
        </div>
      );
    case "available":
      return (
        <div
          className={cn(
            base,
            "border-primary/60 bg-card text-primary hover:scale-105",
          )}
        >
          <Icon className={isBoss ? "size-9" : "size-7"} />
        </div>
      );
    default:
      return (
        <div
          className={cn(
            base,
            "border-border bg-secondary text-muted-foreground/50",
          )}
        >
          {node.kind === "secret" ? (
            <Sparkles className="size-6" />
          ) : (
            <Lock className="size-6" />
          )}
        </div>
      );
  }
}

export function WorldMap({ nodes }: { nodes: MapNode[] }) {
  const mainNodes = nodes.filter((n) => !n.isBranch);
  const branchNodes = nodes.filter((n) => n.isBranch);

  return (
    <div className="relative mx-auto flex max-w-md flex-col items-center gap-2 py-8">
      {mainNodes.map((node, i) => {
        const branch = branchNodes.find((b) => b.index === node.index);
        const playable =
          node.status === "current" ||
          node.status === "completed" ||
          node.status === "available";

        return (
          <motion.div
            key={node.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.3, delay: Math.min(i * 0.02, 0.3) }}
            className="relative flex w-full flex-col items-center"
          >
            {i > 0 && (
              <div
                aria-hidden
                className={cn(
                  "h-8 w-1 rounded-full",
                  node.status === "locked"
                    ? "bg-border"
                    : "bg-gradient-to-b from-primary/60 to-primary/30",
                )}
              />
            )}

            <div
              className="relative flex items-center"
              style={{ transform: `translateX(${node.lane * LANE_OFFSET}px)` }}
            >
              <Tooltip>
                <TooltipTrigger asChild>
                  {playable ? (
                    <Link
                      href={`/lesson/${node.id}`}
                      aria-label={`${node.title} — ${node.status}`}
                      className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background"
                    >
                      <NodeCircle node={node} />
                    </Link>
                  ) : (
                    <span aria-label={`${node.title} — locked`}>
                      <NodeCircle node={node} />
                    </span>
                  )}
                </TooltipTrigger>
                <TooltipContent side="right" className="flex flex-col gap-0.5">
                  <span className="font-semibold">{node.title}</span>
                  <span className="text-muted-foreground text-xs">
                    {node.status === "locked"
                      ? "Complete previous nodes to unlock"
                      : `+${node.xpReward} XP`}
                  </span>
                </TooltipContent>
              </Tooltip>

              {branch && (
                <div
                  className="absolute top-1/2 -translate-y-1/2"
                  style={{
                    left:
                      branch.lane > node.lane
                        ? `${(branch.lane - node.lane) * LANE_OFFSET + 8}px`
                        : undefined,
                    right:
                      branch.lane < node.lane
                        ? `${(node.lane - branch.lane) * LANE_OFFSET + 8}px`
                        : undefined,
                  }}
                >
                  <div className="flex items-center gap-2">
                    <div
                      aria-hidden
                      className="h-0.5 w-6 border-t-2 border-dashed border-primary/40"
                    />
                    <Tooltip>
                      <TooltipTrigger asChild>
                        {branch.status === "available" ? (
                          <Link
                            href={`/lesson/${branch.id}`}
                            aria-label="Secret lesson"
                            className="rounded-full"
                          >
                            <div className="flex size-12 items-center justify-center rounded-full border-2 border-dashed border-accent/70 bg-card text-accent hover:scale-105">
                              <Sparkles className="size-5" />
                            </div>
                          </Link>
                        ) : (
                          <span aria-label="Hidden secret lesson">
                            <div className="flex size-12 items-center justify-center rounded-full border-2 border-dashed border-border bg-secondary text-muted-foreground/50">
                              <Sparkles className="size-5" />
                            </div>
                          </span>
                        )}
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        {branch.status === "available"
                          ? "Secret lesson discovered! +60 XP"
                          : "A hidden path… keep progressing"}
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              )}
            </div>

            <span
              className={cn(
                "mt-1.5 max-w-32 text-center text-xs font-semibold",
                node.status === "locked"
                  ? "text-muted-foreground/50"
                  : "text-muted-foreground",
              )}
              style={{ transform: `translateX(${node.lane * LANE_OFFSET}px)` }}
            >
              {node.title}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
}
