import { WORLDS, type WorldDefinition } from "@/lib/gamification/worlds";

export type MapNodeKind =
  | "lesson"
  | "practice"
  | "quiz"
  | "treasure"
  | "project"
  | "boss"
  | "secret";

export type MapNodeStatus = "completed" | "current" | "available" | "locked";

export type MapNode = {
  id: string;
  worldSlug: string;
  index: number;
  kind: MapNodeKind;
  title: string;
  status: MapNodeStatus;
  xpReward: number;
  /** Horizontal offset -2..2 used to draw the winding path. */
  lane: number;
  isBranch: boolean;
};

export type WorldProgress = {
  world: WorldDefinition;
  completed: number;
  total: number;
  pct: number;
  state: "completed" | "active" | "unlocked" | "locked";
};

/** Demo progress: Worlds 1-2 finished, World 3 in progress at node 9. */
const DEMO_WORLD_STATE: Record<string, { completed: number }> = {
  "claude-basics": { completed: Number.MAX_SAFE_INTEGER },
  "prompt-engineering": { completed: Number.MAX_SAFE_INTEGER },
  "claude-code": { completed: 8 },
};

const NODE_TITLES: Record<MapNodeKind, string[]> = {
  lesson: [
    "New Concepts",
    "Core Ideas",
    "Deep Dive",
    "In Practice",
    "Patterns",
    "Fundamentals",
    "Building Blocks",
    "Next Steps",
  ],
  practice: ["Practice Round", "Skill Drill", "Warm-Up", "Reps"],
  quiz: ["Checkpoint Quiz", "Knowledge Check", "Module Quiz"],
  treasure: ["Treasure Chest", "Bonus Cache", "Supply Drop"],
  project: ["Mini Project", "Build It", "Ship It"],
  boss: ["Boss Battle"],
  secret: ["???"],
};

function titleFor(kind: MapNodeKind, i: number): string {
  const list = NODE_TITLES[kind];
  return list[i % list.length];
}

/**
 * Deterministically lay out a world's nodes: winding lane pattern, a
 * treasure every 6th node, a quiz every 5th, practice every 3rd, one secret
 * branch mid-world, a project near the end, and a boss battle last.
 */
export function getWorldMap(worldSlug: string): MapNode[] {
  const world = WORLDS.find((w) => w.slug === worldSlug);
  if (!world) return [];

  const total = world.lessonCount;
  const completedCount = DEMO_WORLD_STATE[worldSlug]?.completed ?? -1;
  const worldUnlocked = isWorldUnlocked(worldSlug);
  const lanePattern = [0, 1, 2, 1, 0, -1, -2, -1];

  const nodes: MapNode[] = [];
  for (let i = 0; i < total; i++) {
    let kind: MapNodeKind = "lesson";
    if (i === total - 1) kind = "boss";
    else if (i === total - 3) kind = "project";
    else if (i > 0 && i % 6 === 0) kind = "treasure";
    else if (i > 0 && i % 5 === 0) kind = "quiz";
    else if (i > 0 && i % 3 === 0) kind = "practice";

    let status: MapNodeStatus;
    if (!worldUnlocked) status = "locked";
    else if (i < completedCount || completedCount === Number.MAX_SAFE_INTEGER)
      status = "completed";
    else if (i === completedCount) status = "current";
    else status = "locked";

    nodes.push({
      id: `${worldSlug}-${i}`,
      worldSlug,
      index: i,
      kind,
      title: kind === "boss" ? `${world.title} Boss` : titleFor(kind, i),
      status,
      xpReward: kind === "boss" ? 250 : kind === "project" ? 100 : 20,
      lane: lanePattern[i % lanePattern.length],
      isBranch: false,
    });

    // One hidden branch node midway through each world.
    if (i === Math.floor(total / 2)) {
      nodes.push({
        id: `${worldSlug}-secret-${i}`,
        worldSlug,
        index: i,
        kind: "secret",
        title: "???",
        status: worldUnlocked && i < completedCount ? "available" : "locked",
        xpReward: 60,
        lane: lanePattern[i % lanePattern.length] > 0 ? -2 : 2,
        isBranch: true,
      });
    }
  }
  return nodes;
}

export function getWorldsProgress(): WorldProgress[] {
  return WORLDS.map((world) => {
    const state = DEMO_WORLD_STATE[world.slug];
    const total = world.lessonCount;
    let completed = 0;
    let status: WorldProgress["state"] = "locked";

    if (state) {
      completed =
        state.completed === Number.MAX_SAFE_INTEGER
          ? total
          : Math.min(state.completed, total);
      status = completed >= total ? "completed" : "active";
    } else if (isWorldUnlocked(world.slug)) {
      status = "unlocked";
    }

    return {
      world,
      completed,
      total,
      pct: Math.round((completed / total) * 100),
      state: status,
    };
  });
}

export function isWorldUnlocked(worldSlug: string): boolean {
  const world = WORLDS.find((w) => w.slug === worldSlug);
  if (!world) return false;
  if (world.order === 1) return true;
  const prev = WORLDS.find((w) => w.order === world.order - 1);
  if (!prev) return true;
  const prevState = DEMO_WORLD_STATE[prev.slug];
  return Boolean(
    prevState &&
      (prevState.completed === Number.MAX_SAFE_INTEGER ||
        prevState.completed >= prev.lessonCount),
  );
}

export function getContinueLearning(): {
  world: WorldDefinition;
  node: MapNode;
} | null {
  for (const world of WORLDS) {
    const nodes = getWorldMap(world.slug);
    const current = nodes.find((n) => n.status === "current");
    if (current) return { world, node: current };
  }
  return null;
}
