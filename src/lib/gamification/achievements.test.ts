import { describe, expect, it } from "vitest";
import { ACHIEVEMENTS, achievementsByCategory } from "./achievements";

describe("achievement catalog", () => {
  it("contains at least 250 achievements", () => {
    expect(ACHIEVEMENTS.length).toBeGreaterThanOrEqual(250);
  });

  it("has globally unique slugs", () => {
    const slugs = ACHIEVEMENTS.map((a) => a.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("every achievement has a machine-checkable criterion", () => {
    for (const a of ACHIEVEMENTS) {
      expect(a.criteria.metric).toBeTruthy();
      expect(["gte", "eq", "lte"]).toContain(a.criteria.operator);
      expect(typeof a.criteria.value).toBe("number");
    }
  });

  it("rewards scale with tier", () => {
    const byTier = (tier: string) =>
      ACHIEVEMENTS.filter((a) => a.tier === tier);
    const avg = (xs: number[]) => xs.reduce((s, x) => s + x, 0) / xs.length;

    const bronzeAvg = avg(byTier("bronze").map((a) => a.xpReward));
    const goldAvg = avg(byTier("gold").map((a) => a.xpReward));
    const legendaryAvg = avg(byTier("legendary").map((a) => a.xpReward));

    expect(goldAvg).toBeGreaterThan(bronzeAvg);
    expect(legendaryAvg).toBeGreaterThan(goldAvg);
  });

  it("leaderboard achievements use lte (lower rank is better)", () => {
    const boardAchievements = ACHIEVEMENTS.filter(
      (a) => a.category === "leaderboard",
    );
    expect(boardAchievements.length).toBeGreaterThan(0);
    for (const a of boardAchievements) {
      expect(a.criteria.operator).toBe("lte");
    }
  });

  it("covers every world with a mastery arc", () => {
    const worldMastery = achievementsByCategory()["world_mastery"];
    // 25 worlds x 3 (explorer/champion/perfectionist) + world tour + grandmaster
    expect(worldMastery.length).toBe(77);
  });
});
