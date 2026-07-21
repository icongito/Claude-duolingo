/**
 * Lesson step content model + the demo lesson bank.
 *
 * A "node" on the map opens a lesson session composed of several steps of
 * mixed types. Steps are discriminated unions so each lesson-type component
 * gets fully-typed content.
 */

export type MultipleChoiceStep = {
  type: "multiple_choice";
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

export type FillBlankStep = {
  type: "fill_blank";
  prompt: string;
  /** Sentence with `___` marking the blank. */
  sentence: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

export type TypingStep = {
  type: "typing";
  prompt: string;
  /** Exact expected answer (case-insensitive, trimmed). */
  answer: string;
  placeholder: string;
  explanation: string;
};

export type MatchingStep = {
  type: "matching";
  prompt: string;
  pairs: Array<{ left: string; right: string }>;
};

export type FlashcardStep = {
  type: "flashcard";
  cards: Array<{ front: string; back: string }>;
};

export type CodeStep = {
  type: "code";
  prompt: string;
  language: string;
  starterCode: string;
  /** Substrings that must appear in the submission for it to pass. */
  mustInclude: string[];
  hint: string;
  explanation: string;
};

export type SortingStep = {
  type: "sorting";
  prompt: string;
  /** Items given in correct order; the player sees them shuffled. */
  correctOrder: string[];
};

export type LessonStep =
  | MultipleChoiceStep
  | FillBlankStep
  | TypingStep
  | MatchingStep
  | FlashcardStep
  | CodeStep
  | SortingStep;

export type LessonSession = {
  nodeId: string;
  worldSlug: string;
  title: string;
  xpReward: number;
  steps: LessonStep[];
};

import { WORLD_LESSON_BANKS } from "./lesson-content";

/** "Drill II/III/…" suffixes when a world has more nodes than lessons. */
const CYCLE_NUMERALS = ["", " · Drill II", " · Drill III", " · Drill IV", " · Drill V", " · Drill VI", " · Drill VII", " · Drill VIII"];

/**
 * Every node gets a real, hand-written lesson: the node's index cycles
 * through its world's lesson bank (src/lib/data/lesson-content/), so
 * content varies across the map deterministically. When a world has more
 * nodes than lessons, later nodes revisit earlier material as "Drills".
 */
export function getLessonSession(nodeId: string): LessonSession | null {
  const match = nodeId.match(/^(.+?)-(?:secret-)?(\d+)$/);
  const worldSlug = match ? match[1] : nodeId;
  const index = match ? Number(match[2]) : 0;

  const bank = WORLD_LESSON_BANKS[worldSlug] ?? WORLD_LESSON_BANKS["claude-basics"];
  const lesson = bank[index % bank.length];
  const cycle = Math.floor(index / bank.length);

  return {
    nodeId,
    worldSlug,
    title: `${lesson.title}${CYCLE_NUMERALS[cycle] ?? ` · Drill ${cycle + 1}`}`,
    xpReward: 20,
    steps: lesson.steps,
  };
}
