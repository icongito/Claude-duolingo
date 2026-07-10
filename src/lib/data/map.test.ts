import { describe, expect, it } from "vitest";
import { WORLDS } from "@/lib/gamification/worlds";
import { getContinueLearning, getWorldMap, isWorldUnlocked } from "./map";
import { getLessonSession } from "./lessons";

describe("world maps", () => {
  it("lays out the spec'd number of nodes for every world", () => {
    for (const world of WORLDS) {
      const nodes = getWorldMap(world.slug).filter((n) => !n.isBranch);
      expect(nodes.length).toBe(world.lessonCount);
    }
  });

  it("ends every world with a boss battle", () => {
    for (const world of WORLDS) {
      const nodes = getWorldMap(world.slug).filter((n) => !n.isBranch);
      expect(nodes.at(-1)?.kind).toBe("boss");
    }
  });

  it("has exactly one secret branch per world", () => {
    for (const world of WORLDS) {
      const secrets = getWorldMap(world.slug).filter((n) => n.isBranch);
      expect(secrets.length).toBe(1);
    }
  });

  it("marks exactly one node 'current' across all worlds", () => {
    const currents = WORLDS.flatMap((w) =>
      getWorldMap(w.slug).filter((n) => n.status === "current"),
    );
    expect(currents.length).toBe(1);
  });

  it("unlocks worlds strictly in sequence", () => {
    expect(isWorldUnlocked("claude-basics")).toBe(true);
    expect(isWorldUnlocked("claude-code")).toBe(true);
    // World 4 (git) requires world 3 to be finished — it isn't in demo state.
    expect(isWorldUnlocked("git")).toBe(false);
    expect(isWorldUnlocked("startup-engineering")).toBe(false);
  });
});

describe("continue learning", () => {
  it("points at the demo user's current node", () => {
    const next = getContinueLearning();
    expect(next).not.toBeNull();
    expect(next!.node.status).toBe("current");
    expect(next!.world.slug).toBe("claude-code");
  });
});

describe("lesson sessions", () => {
  it("serves a real lesson for the current node", () => {
    const session = getLessonSession("claude-code-8");
    expect(session).not.toBeNull();
    expect(session!.steps.length).toBeGreaterThanOrEqual(4);
  });

  it("falls back gracefully for any map node", () => {
    for (const world of WORLDS) {
      const nodes = getWorldMap(world.slug);
      const sample = nodes[Math.floor(nodes.length / 2)];
      const session = getLessonSession(sample.id);
      expect(session).not.toBeNull();
      expect(session!.nodeId).toBe(sample.id);
      expect(session!.steps.length).toBeGreaterThan(0);
    }
  });

  it("every step has valid content for its type", () => {
    const session = getLessonSession("claude-basics-0")!;
    for (const step of session.steps) {
      switch (step.type) {
        case "multiple_choice":
        case "fill_blank":
          expect(step.correctIndex).toBeGreaterThanOrEqual(0);
          expect(step.correctIndex).toBeLessThan(step.options.length);
          break;
        case "matching":
          expect(step.pairs.length).toBeGreaterThanOrEqual(2);
          break;
        case "sorting":
          expect(step.correctOrder.length).toBeGreaterThanOrEqual(2);
          break;
        case "typing":
          expect(step.answer.trim().length).toBeGreaterThan(0);
          break;
        case "flashcard":
          expect(step.cards.length).toBeGreaterThan(0);
          break;
        case "code":
          expect(step.mustInclude.length).toBeGreaterThan(0);
          break;
      }
    }
  });
});
