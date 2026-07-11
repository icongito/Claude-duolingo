/**
 * Boss battles — the multi-stage gauntlet at the end of every world.
 *
 * A boss re-tests the whole world's material in three themed stages under a
 * single time limit, with one pool of hearts across all stages. Beating it
 * completes the world and pays the biggest single reward in the game.
 * Mirrors the `boss_battles` table shape in src/lib/db/schema/projects.ts.
 */

import { WORLDS } from "@/lib/gamification/worlds";
import { getLessonSession, type LessonStep } from "@/lib/data/lessons";

export type BossStage = {
  title: string;
  intro: string;
  steps: LessonStep[];
};

export type BossBattle = {
  nodeId: string;
  worldSlug: string;
  worldTitle: string;
  name: string;
  tagline: string;
  timeLimitSeconds: number;
  xpReward: number;
  gemReward: number;
  stages: BossStage[];
};

/** Hand-named bosses; the rest fall back to the generated epithet. */
const BOSS_NAMES: Record<string, { name: string; tagline: string }> = {
  "claude-basics": {
    name: "The Hallucinator",
    tagline: "It answers with total confidence. It is completely wrong.",
  },
  "prompt-engineering": {
    name: "The Prompt Mangler",
    tagline: "Feeds on vague requests. Starve it with specificity.",
  },
  "claude-code": {
    name: "The Context Kraken",
    tagline: "Its tentacles are wrapped around your context window.",
  },
  git: {
    name: "The Merge Conflict",
    tagline: "Both branches claim the same line. Only one of you leaves.",
  },
  github: {
    name: "The Force Pusher",
    tagline: "It rewrote main at 5pm on a Friday.",
  },
  terminal: {
    name: "The rm -rf Wraith",
    tagline: "One flag away from oblivion.",
  },
  react: {
    name: "The Infinite Rerender",
    tagline: "It has no dependency array and no mercy.",
  },
  javascript: {
    name: "The Undefined",
    tagline: "It is not a function. It never was.",
  },
  typescript: {
    name: "The Any-thing",
    tagline: "It escaped the type system. Bring it back.",
  },
  sql: {
    name: "The Cartesian Explosion",
    tagline: "You forgot the JOIN condition. It didn't.",
  },
};

const FALLBACK_EPITHETS = [
  "Warden",
  "Gatekeeper",
  "Colossus",
  "Devourer",
  "Sentinel",
  "Leviathan",
];

function bossIdentity(
  worldSlug: string,
  worldTitle: string,
  order: number,
): { name: string; tagline: string } {
  return (
    BOSS_NAMES[worldSlug] ?? {
      name: `The ${FALLBACK_EPITHETS[order % FALLBACK_EPITHETS.length]} of ${worldTitle}`,
      tagline: `Everything ${worldTitle} taught you, all at once.`,
    }
  );
}

/**
 * Split a world's steps into three themed stages. Flashcards are study
 * material (they can't be failed) so they're dropped from the gauntlet.
 */
function buildStages(steps: LessonStep[]): BossStage[] {
  const scored = steps.filter((s) => s.type !== "flashcard");

  const recall = scored.filter(
    (s) => s.type === "multiple_choice" || s.type === "fill_blank",
  );
  const rebuild = scored.filter(
    (s) => s.type === "matching" || s.type === "sorting",
  );
  const prove = scored.filter(
    (s) => s.type === "typing" || s.type === "code",
  );

  const stages: BossStage[] = [
    {
      title: "Recall",
      intro: "Quick fire. Answer from memory.",
      steps: recall,
    },
    {
      title: "Rebuild",
      intro: "Put the pieces back in order.",
      steps: rebuild,
    },
    {
      title: "Prove It",
      intro: "No options to lean on. Type the real thing.",
      steps: prove,
    },
  ].filter((stage) => stage.steps.length > 0);

  // A world sample can theoretically miss whole categories; make sure the
  // battle always has content.
  return stages.length > 0
    ? stages
    : [{ title: "Gauntlet", intro: "Survive.", steps: scored }];
}

/** Boss node = the last node of its world. Secret nodes never are. */
export function isBossNode(nodeId: string): boolean {
  const match = nodeId.match(/^(.+?)-(\d+)$/);
  if (!match || nodeId.includes("-secret-")) return false;
  const world = WORLDS.find((w) => w.slug === match[1]);
  return Boolean(world && Number(match[2]) === world.lessonCount - 1);
}

export function getBossBattle(nodeId: string): BossBattle | null {
  if (!isBossNode(nodeId)) return null;

  const worldSlug = nodeId.replace(/-\d+$/, "");
  const world = WORLDS.find((w) => w.slug === worldSlug);
  const session = getLessonSession(nodeId);
  if (!world || !session) return null;

  const stages = buildStages(session.steps);
  const totalSteps = stages.reduce((n, s) => n + s.steps.length, 0);

  return {
    nodeId,
    worldSlug,
    worldTitle: world.title,
    ...bossIdentity(worldSlug, world.title, world.order),
    timeLimitSeconds: totalSteps * 45,
    xpReward: 250,
    gemReward: 10,
    stages,
  };
}
