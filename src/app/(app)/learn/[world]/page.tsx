import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { WorldMap } from "@/components/learn/world-map";
import { getWorldMap, getWorldsProgress, isWorldUnlocked } from "@/lib/data/map";
import { WORLDS, getWorldBySlug } from "@/lib/gamification/worlds";

export function generateStaticParams() {
  return WORLDS.map((w) => ({ world: w.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ world: string }>;
}): Promise<Metadata> {
  const { world } = await params;
  const def = getWorldBySlug(world);
  return { title: def ? `World ${def.order}: ${def.title}` : "World" };
}

export default async function WorldPage({
  params,
}: {
  params: Promise<{ world: string }>;
}) {
  const { world: worldSlug } = await params;
  const world = getWorldBySlug(worldSlug);
  if (!world) notFound();

  const nodes = getWorldMap(worldSlug);
  const progress = getWorldsProgress().find((w) => w.world.slug === worldSlug);
  const unlocked = isWorldUnlocked(worldSlug);

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <div className="flex flex-col gap-4">
        <Button variant="ghost" size="sm" asChild className="self-start">
          <Link href="/learn">
            <ArrowLeft className="size-4" /> All worlds
          </Link>
        </Button>

        <div className="glow-border-strong flex flex-col gap-4 rounded-2xl bg-card p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">World {world.order}</Badge>
              {!unlocked && <Badge variant="destructive">Locked</Badge>}
            </div>
            <h1 className="font-pixel mt-2 text-2xl">{world.title}</h1>
            <p className="text-muted-foreground mt-1 text-sm">
              {world.description}
            </p>
          </div>
          {progress && (
            <div className="flex w-full max-w-48 flex-col gap-1.5">
              <div className="text-muted-foreground flex justify-between text-xs">
                <span>Progress</span>
                <span>
                  {progress.completed}/{progress.total}
                </span>
              </div>
              <Progress value={progress.pct} className="h-2.5" />
            </div>
          )}
        </div>
      </div>

      {unlocked ? (
        <WorldMap nodes={nodes} />
      ) : (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <p className="font-display text-lg font-semibold">
            This world is still locked
          </p>
          <p className="text-muted-foreground max-w-sm text-sm">
            Finish the previous world&apos;s boss battle to open the gates to{" "}
            {world.title}.
          </p>
          <Button asChild>
            <Link href="/learn">Back to the map</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
