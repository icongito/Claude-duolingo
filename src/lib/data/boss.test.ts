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

      // Combat stages are timed at 45s/attack; the Ship It project stage
      // earns extra clock instead (coding takes longer than a quiz answer).
      const combatSteps = battle!.stages
        .slice(0, -1)
        .reduce((n, s) => n + s.steps.length, 0);
      const projectBonus = battle!.project.size === "big" ? 180 : 90;
      expect(battle!.timeLimitSeconds).toBe(combatSteps * 45 + projectBonus);
    }
  });

  it("ends every boss in a Ship It project stage that publishes to GitHub", () => {
    for (const world of WORLDS) {
      const battle = getBossBattle(`${world.slug}-${world.lessonCount - 1}`)!;
      const last = battle.stages.at(-1)!;
      expect(last.kind).toBe("project");
      expect(last.title).toBe("Ship It");
      expect(last.steps).toHaveLength(1);
      expect(last.steps[0].type).toBe("code");

      const project = battle.project;
      expect(["small", "big"]).toContain(project.size);
      expect(project.repoOwner.length).toBeGreaterThan(0);
      expect(project.repoName.length).toBeGreaterThan(0);
      expect(project.commitSha).toMatch(/^[0-9a-f]{7}$/);
      expect(project.filesChanged).toBeGreaterThan(0);
      expect(project.step).toBe(last.steps[0]);
    }
  });

  it("gives every world's project a deterministic, distinct commit sha", () => {
    const shas = WORLDS.map(
      (w) => getBossBattle(`${w.slug}-${w.lessonCount - 1}`)!.project.commitSha,
    );
    expect(new Set(shas).size).toBe(shas.length);
    // deterministic: same node, same sha every time
    const world = WORLDS[0];
    const nodeId = `${world.slug}-${world.lessonCount - 1}`;
    expect(getBossBattle(nodeId)!.project.commitSha).toBe(
      getBossBattle(nodeId)!.project.commitSha,
    );
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
