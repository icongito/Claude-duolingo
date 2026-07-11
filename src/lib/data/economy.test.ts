import { describe, expect, it } from "vitest";
import {
  CONSUMABLES,
  GEM_PACKS,
  PLANS,
  QUESTS,
  WEARABLES,
  WEEKLY_GEM_CAP,
} from "./economy";

describe("economy invariants", () => {
  it("keeps gems scarce: no daily quest ever pays gems", () => {
    for (const q of QUESTS.filter((q) => q.cadence === "daily")) {
      expect(q.reward.gems).toBeUndefined();
    }
  });

  it("weekly recurring gem income stays under the weekly cap", () => {
    const weeklyGems = QUESTS.filter((q) => q.cadence === "weekly").reduce(
      (n, q) => n + (q.reward.gems ?? 0),
      0,
    );
    expect(weeklyGems).toBeGreaterThan(0);
    expect(weeklyGems).toBeLessThanOrEqual(WEEKLY_GEM_CAP);
  });

  it("special quests are the biggest single payouts", () => {
    const maxWeekly = Math.max(
      ...QUESTS.filter((q) => q.cadence === "weekly").map((q) => q.reward.gems ?? 0),
    );
    const maxSpecial = Math.max(
      ...QUESTS.filter((q) => q.cadence === "special").map((q) => q.reward.gems ?? 0),
    );
    expect(maxSpecial).toBeGreaterThan(maxWeekly);
  });

  it("plans are ordered free -> premium -> premium+ with rising price and stipend", () => {
    expect(PLANS.map((p) => p.id)).toEqual(["free", "premium", "premium_plus"]);
    for (let i = 1; i < PLANS.length; i++) {
      expect(PLANS[i].monthlyPrice).toBeGreaterThan(PLANS[i - 1].monthlyPrice);
      expect(PLANS[i].monthlyGemStipend).toBeGreaterThanOrEqual(
        PLANS[i - 1].monthlyGemStipend,
      );
    }
    // yearly is always the better per-month deal on paid plans
    for (const p of PLANS.filter((p) => p.monthlyPrice > 0)) {
      expect(p.yearlyPrice).toBeLessThan(p.monthlyPrice);
    }
  });

  it("gem packs scale value with size and have unique ids", () => {
    const ids = new Set(GEM_PACKS.map((p) => p.id));
    expect(ids.size).toBe(GEM_PACKS.length);
    for (let i = 1; i < GEM_PACKS.length; i++) {
      const prev = GEM_PACKS[i - 1].gems / GEM_PACKS[i - 1].priceUsd;
      const cur = GEM_PACKS[i].gems / GEM_PACKS[i].priceUsd;
      expect(cur).toBeGreaterThan(prev);
    }
  });

  it("catalog slugs are unique across wearables and consumables", () => {
    const slugs = [...WEARABLES, ...CONSUMABLES].map((i) => i.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("wearables map to distinct mascot rig layers", () => {
    const wears = WEARABLES.map((w) => w.wear);
    expect(new Set(wears).size).toBe(wears.length);
  });
});
