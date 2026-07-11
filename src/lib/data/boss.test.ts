import { describe, expect, it } from "vitest";
import { WORLDS } from "@/lib/gamification/worlds";
import { getBossBattle, isBossNode } from "./boss";

describe("boss battles", () => {
  it("recognizes exactly the last node of each world as a boss", () => {
    for (const world of WORLDS) {
      expect(isBossNode(`${world.slug}-${world.lessonCount - 1}`)).toBe(true);
      expect(isBossNode(`${world.slug}-${world.lessonCount - 2}`)).toBe(false);
      expect(isBossNode(`${world.slug}-0`)).toBe(world.lessonCount === 1);
    }
    expect(isBossNode("claude-basics-secret-9")).toBe(false);
    expect(isBossNode("not-a-world-99")).toBe(false);
  });

  it("builds a playable battle for every world's boss node", () => {
    for (const world of WORLDS) {
      const battle = getBossBattle(`${world.slug}-${world.lessonCount - 1}`);
      expect(battle).not.toBeNull();
      expect(battle!.name.length).toBeGreaterThan(0);
      expect(battle!.stages.length).toBeGreaterThan(0);
      expect(battle!.xpReward).toBe(250);
      expect(battle!.gemReward).toBe(10);
      const steps = battle!.stages.flatMap((s) => s.steps);
      expect(steps.length).toBeGreaterThan(0);
      expect(steps.every((s) => s.type !== "flashcard")).toBe(true);
      expect(battle!.timeLimitSeconds).toBe(steps.length * 45);
    }
  });

  it("returns null for non-boss nodes", () => {
    expect(getBossBattle("claude-basics-0")).toBeNull();
    expect(getBossBattle("claude-code-8")).toBeNull();
  });

  it("matches the dashboard's teased boss name for the Claude Code world", () => {
    const world = WORLDS.find((w) => w.slug === "claude-code")!;
    const battle = getBossBattle(`claude-code-${world.lessonCount - 1}`);
    expect(battle!.name).toBe("The Context Kraken");
  });
});
