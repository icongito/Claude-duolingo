/**
 * Level curve: XP required to reach level N grows quadratically so early
 * levels come fast (dopamine hook) and later levels are a genuine grind.
 *
 * xpForLevel(n) = 50 * n^2 + 50 * n   (level 1 -> 0 xp, level 2 -> 200xp, ...)
 */
export function xpForLevel(level: number): number {
  return 50 * level * level + 50 * level;
}

export function levelForXp(totalXp: number): number {
  let level = 1;
  while (xpForLevel(level + 1) <= totalXp) {
    level++;
  }
  return level;
}

export function levelProgress(totalXp: number): {
  level: number;
  currentLevelXp: number;
  xpIntoLevel: number;
  xpForNextLevel: number;
  progressPct: number;
} {
  const level = levelForXp(totalXp);
  const currentLevelXp = xpForLevel(level);
  const nextLevelXp = xpForLevel(level + 1);
  const xpIntoLevel = totalXp - currentLevelXp;
  const xpForNextLevel = nextLevelXp - currentLevelXp;

  return {
    level,
    currentLevelXp,
    xpIntoLevel,
    xpForNextLevel,
    progressPct: Math.min(100, Math.round((xpIntoLevel / xpForNextLevel) * 100)),
  };
}

const RANK_THRESHOLDS: Array<{ minLevel: number; name: string }> = [
  { minLevel: 1, name: "Novice" },
  { minLevel: 5, name: "Apprentice" },
  { minLevel: 10, name: "Practitioner" },
  { minLevel: 18, name: "Engineer" },
  { minLevel: 28, name: "Senior Engineer" },
  { minLevel: 40, name: "Architect" },
  { minLevel: 55, name: "Principal" },
  { minLevel: 75, name: "Staff" },
  { minLevel: 100, name: "Legend" },
];

export function rankForLevel(level: number): string {
  let rank = RANK_THRESHOLDS[0].name;
  for (const threshold of RANK_THRESHOLDS) {
    if (level >= threshold.minLevel) rank = threshold.name;
  }
  return rank;
}

/** Streak bonus multiplier applied to lesson XP rewards. */
export function streakMultiplier(currentStreak: number): number {
  if (currentStreak >= 100) return 2;
  if (currentStreak >= 30) return 1.5;
  if (currentStreak >= 7) return 1.25;
  return 1;
}
