import type { LessonStep } from "@/lib/data/lessons";

/**
 * A hand-written lesson before it's bound to a map node. lessons.ts assigns
 * blueprints to nodes deterministically (node index cycles through the
 * world's bank), so every node is playable and content varies across a
 * world instead of repeating one sample.
 */
export type LessonBlueprint = {
  title: string;
  steps: LessonStep[];
};
