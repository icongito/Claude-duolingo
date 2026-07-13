import { describe, expect, it } from "vitest";
import { WORLDS } from "@/lib/gamification/worlds";
import { evaluateProject, evaluatePromptPower, getBossBattle, isBossNode } from "./boss";

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

      // Combat stages are timed at 45s/attack; the Ship It project stage and
      // the opening prompt attack both earn extra clock instead.
      const combatSteps = battle!.stages
        .slice(0, -1)
        .reduce((n, s) => n + s.steps.length, 0);
      const projectBonus = battle!.project.size === "big" ? 180 : 90;
      expect(battle!.timeLimitSeconds).toBe(combatSteps * 45 + 60 + projectBonus);
    }
  });

  it("opens every boss with a write-your-own-prompt attack, not multiple choice", () => {
    for (const world of WORLDS) {
      const battle = getBossBattle(`${world.slug}-${world.lessonCount - 1}`)!;
      const first = battle.stages[0];
      expect(first.kind).toBe("prompt");
      // No scripted lesson steps (and definitely no multiple_choice) — the
      // player writes free text, there's nothing to pick from.
      expect(first.steps).toHaveLength(0);

      const attack = first.promptAttack!;
      expect(attack.scenario.length).toBeGreaterThan(0);
      expect(attack.criteria.length).toBeGreaterThan(0);
      expect(attack.maxDamage).toBe(
        attack.criteria.reduce((n, c) => n + c.power, 0),
      );
      // A blank submission lands zero damage — there's no free credit.
      expect(evaluatePromptPower(attack.placeholder, attack.criteria).damage).toBe(0);
    }
  });

  it("scales prompt-attack damage with how many criteria are met", () => {
    for (const world of WORLDS) {
      const attack = getBossBattle(`${world.slug}-${world.lessonCount - 1}`)!.stages[0]
        .promptAttack!;

      // Every criterion present deals full damage.
      const perfect = attack.criteria.map((c) => c.needle).join(" ");
      const full = evaluatePromptPower(perfect, attack.criteria);
      expect(full.damage).toBe(attack.maxDamage);
      expect(full.missed).toHaveLength(0);

      // Missing exactly one criterion deals proportionally less — never all
      // or nothing, unlike a multiple-choice question.
      if (attack.criteria.length > 1) {
        const partial = attack.criteria
          .slice(1)
          .map((c) => c.needle)
          .join(" ");
        const result = evaluatePromptPower(partial, attack.criteria);
        expect(result.damage).toBe(attack.maxDamage - attack.criteria[0].power);
        expect(result.damage).toBeGreaterThan(0);
        expect(result.damage).toBeLessThan(attack.maxDamage);
        expect(result.missed).toEqual([attack.criteria[0]]);
      }
    }
  });

  it("ends every boss in a Ship It project stage that publishes to GitHub", () => {
    for (const world of WORLDS) {
      const battle = getBossBattle(`${world.slug}-${world.lessonCount - 1}`)!;
      const last = battle.stages.at(-1)!;
      expect(last.kind).toBe("project");
      expect(last.title).toBe("Ship It");
      // The project stage has no scripted lesson steps — it's a blank brief.
      expect(last.steps).toHaveLength(0);

      const project = battle.project;
      expect(["small", "big"]).toContain(project.size);
      expect(project.repoOwner.length).toBeGreaterThan(0);
      expect(project.repoName.length).toBeGreaterThan(0);
      expect(project.commitSha).toMatch(/^[0-9a-f]{7}$/);
      expect(project.filesChanged).toBeGreaterThan(0);

      const brief = project.brief;
      expect(brief.prompt.length).toBeGreaterThan(0);
      expect(brief.requirements.length).toBeGreaterThan(0);
      expect(brief.passVerdict.length).toBeGreaterThan(0);
      // Starter is a blank pointer, not a fill-in-the-blank template — it
      // must not already satisfy any of the graded requirements.
      expect(evaluateProject(brief.starterCode, brief.requirements)).toHaveLength(
        brief.requirements.length,
      );
    }
  });

  it("grades project submissions exactly, with a distinct critique per miss", () => {
    for (const world of WORLDS) {
      const { brief } = getBossBattle(`${world.slug}-${world.lessonCount - 1}`)!.project;

      // A submission containing every required needle passes clean.
      const perfect = brief.requirements.map((r) => r.needle).join("\n");
      expect(evaluateProject(perfect, brief.requirements)).toHaveLength(0);

      // Missing exactly one requirement fails exactly that one, with its
      // own critique text (never a generic message).
      if (brief.requirements.length > 1) {
        const missingOne = brief.requirements
          .slice(1)
          .map((r) => r.needle)
          .join("\n");
        const failed = evaluateProject(missingOne, brief.requirements);
        expect(failed).toHaveLength(1);
        expect(failed[0]).toBe(brief.requirements[0]);
        expect(failed[0].critique.length).toBeGreaterThan(0);
      }
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
