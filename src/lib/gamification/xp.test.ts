import { describe, expect, it } from "vitest";
import {
  levelForXp,
  levelProgress,
  rankForLevel,
  streakMultiplier,
  xpForLevel,
} from "./xp";

describe("xpForLevel", () => {
  it("costs 0 XP conceptually below level 1's threshold", () => {
    expect(xpForLevel(1)).toBe(100);
  });

  it("grows quadratically", () => {
    expect(xpForLevel(2)).toBe(300);
    expect(xpForLevel(10)).toBe(5500);
    expect(xpForLevel(11) - xpForLevel(10)).toBeGreaterThan(
      xpForLevel(3) - xpForLevel(2),
    );
  });
});

describe("levelForXp", () => {
  it("returns level 1 for brand-new users", () => {
    expect(levelForXp(0)).toBe(1);
    expect(levelForXp(50)).toBe(1);
  });

  it("levels up exactly at the threshold", () => {
    const threshold = xpForLevel(2);
    expect(levelForXp(threshold - 1)).toBe(1);
    expect(levelForXp(threshold)).toBe(2);
  });

  it("is consistent with xpForLevel for a range of levels", () => {
    for (let level = 2; level <= 40; level++) {
      expect(levelForXp(xpForLevel(level))).toBe(level);
      expect(levelForXp(xpForLevel(level) - 1)).toBe(level - 1);
    }
  });
});

describe("levelProgress", () => {
  it("reports 0% right at a level boundary", () => {
    const p = levelProgress(xpForLevel(5));
    expect(p.level).toBe(5);
    expect(p.xpIntoLevel).toBe(0);
    expect(p.progressPct).toBe(0);
  });

  it("never exceeds 100%", () => {
    const p = levelProgress(xpForLevel(6) - 1);
    expect(p.progressPct).toBeLessThanOrEqual(100);
  });
});

describe("rankForLevel", () => {
  it("maps levels to ranks monotonically", () => {
    expect(rankForLevel(1)).toBe("Novice");
    expect(rankForLevel(5)).toBe("Apprentice");
    expect(rankForLevel(12)).toBe("Practitioner");
    expect(rankForLevel(100)).toBe("Legend");
  });
});

describe("streakMultiplier", () => {
  it("rewards longer streaks with bigger multipliers", () => {
    expect(streakMultiplier(0)).toBe(1);
    expect(streakMultiplier(7)).toBe(1.25);
    expect(streakMultiplier(30)).toBe(1.5);
    expect(streakMultiplier(100)).toBe(2);
  });
});
