import { WORLDS } from "./worlds";

export type AchievementTier = "bronze" | "silver" | "gold" | "platinum" | "legendary";

export type AchievementDefinition = {
  slug: string;
  name: string;
  description: string;
  icon: string;
  tier: AchievementTier;
  category: string;
  xpReward: number;
  coinReward: number;
  gemReward: number;
  isSecret: boolean;
  criteria: { metric: string; operator: "gte" | "eq" | "lte"; value: number };
};

function tierForRank(i: number, total: number): AchievementTier {
  const pct = i / (total - 1 || 1);
  if (pct >= 1) return "legendary";
  if (pct >= 0.75) return "platinum";
  if (pct >= 0.5) return "gold";
  if (pct >= 0.25) return "silver";
  return "bronze";
}

function rewardsForTier(tier: AchievementTier) {
  switch (tier) {
    case "bronze":
      return { xpReward: 25, coinReward: 10, gemReward: 0 };
    case "silver":
      return { xpReward: 60, coinReward: 25, gemReward: 0 };
    case "gold":
      return { xpReward: 150, coinReward: 60, gemReward: 5 };
    case "platinum":
      return { xpReward: 400, coinReward: 150, gemReward: 15 };
    case "legendary":
      return { xpReward: 1000, coinReward: 400, gemReward: 50 };
  }
}

function tieredMilestones(opts: {
  category: string;
  metric: string;
  icon: string;
  namePrefix: string;
  descriptionFor: (value: number) => string;
  values: number[];
  slugPrefix: string;
  secretIndexes?: number[];
}): AchievementDefinition[] {
  return opts.values.map((value, i) => {
    const tier = tierForRank(i, opts.values.length);
    return {
      slug: `${opts.slugPrefix}-${value}`,
      name: `${opts.namePrefix} ${value.toLocaleString()}`,
      description: opts.descriptionFor(value),
      icon: opts.icon,
      tier,
      category: opts.category,
      isSecret: opts.secretIndexes?.includes(i) ?? false,
      criteria: { metric: opts.metric, operator: "gte", value },
      ...rewardsForTier(tier),
    };
  });
}

const streakAchievements = tieredMilestones({
  category: "streaks",
  metric: "current_streak_days",
  icon: "Flame",
  namePrefix: "Streak:",
  descriptionFor: (v) => `Keep a learning streak alive for ${v} day${v === 1 ? "" : "s"} in a row.`,
  values: [3, 7, 14, 30, 50, 100, 200, 365],
  slugPrefix: "streak",
});

const xpAchievements = tieredMilestones({
  category: "xp",
  metric: "total_xp",
  icon: "Zap",
  namePrefix: "XP Milestone:",
  descriptionFor: (v) => `Earn a total of ${v.toLocaleString()} XP.`,
  values: [100, 250, 500, 1000, 2500, 5000, 10000, 25000, 50000, 100000],
  slugPrefix: "xp",
});

const lessonsCompletedAchievements = tieredMilestones({
  category: "lessons",
  metric: "lessons_completed",
  icon: "BookCheck",
  namePrefix: "Lessons Completed:",
  descriptionFor: (v) => `Complete ${v.toLocaleString()} lesson${v === 1 ? "" : "s"}.`,
  values: [1, 5, 10, 25, 50, 100, 250, 500, 1000],
  slugPrefix: "lessons",
});

const bossBattleAchievements = tieredMilestones({
  category: "boss_battles",
  metric: "boss_battles_won",
  icon: "Skull",
  namePrefix: "Boss Slayer:",
  descriptionFor: (v) => `Defeat ${v} boss battle${v === 1 ? "" : "s"}.`,
  values: [1, 3, 5, 10, 25, 50, 100],
  slugPrefix: "boss",
});

const perfectScoreAchievements = tieredMilestones({
  category: "mastery",
  metric: "perfect_lessons",
  icon: "Star",
  namePrefix: "Perfectionist:",
  descriptionFor: (v) => `Score 100% on ${v} lesson${v === 1 ? "" : "s"}.`,
  values: [1, 10, 25, 50, 100, 250],
  slugPrefix: "perfect",
});

const noHintAchievements = tieredMilestones({
  category: "mastery",
  metric: "no_hint_lessons",
  icon: "Lightbulb",
  namePrefix: "Self-Reliant:",
  descriptionFor: (v) => `Complete ${v} lessons without using a hint.`,
  values: [10, 25, 50, 100, 250],
  slugPrefix: "no-hint",
});

const speedRoundAchievements = tieredMilestones({
  category: "speed",
  metric: "speed_rounds_won",
  icon: "Timer",
  namePrefix: "Speed Round Wins:",
  descriptionFor: (v) => `Win ${v} speed round${v === 1 ? "" : "s"}.`,
  values: [1, 5, 10, 25, 50],
  slugPrefix: "speed-round",
});

const coinsAchievements = tieredMilestones({
  category: "economy",
  metric: "lifetime_coins_earned",
  icon: "Coins",
  namePrefix: "Coin Collector:",
  descriptionFor: (v) => `Earn ${v.toLocaleString()} coins over your CodeQuest journey.`,
  values: [100, 500, 1000, 5000, 10000, 50000],
  slugPrefix: "coins",
});

const gemsAchievements = tieredMilestones({
  category: "economy",
  metric: "lifetime_gems_earned",
  icon: "Gem",
  namePrefix: "Gem Hoarder:",
  descriptionFor: (v) => `Earn ${v.toLocaleString()} gems over your CodeQuest journey.`,
  values: [10, 50, 100, 500, 1000, 5000],
  slugPrefix: "gems",
});

const certificateAchievements = tieredMilestones({
  category: "certificates",
  metric: "certificates_earned",
  icon: "GraduationCap",
  namePrefix: "Certified:",
  descriptionFor: (v) => `Earn ${v} world completion certificate${v === 1 ? "" : "s"}.`,
  values: [1, 3, 5, 10, 25],
  slugPrefix: "certs",
});

const dailyChallengeAchievements = tieredMilestones({
  category: "challenges",
  metric: "daily_challenges_completed",
  icon: "CalendarCheck",
  namePrefix: "Daily Grinder:",
  descriptionFor: (v) => `Complete ${v} daily challenge${v === 1 ? "" : "s"}.`,
  values: [1, 7, 30, 100, 250, 365],
  slugPrefix: "daily-challenge",
});

const weeklyChallengeAchievements = tieredMilestones({
  category: "challenges",
  metric: "weekly_challenges_completed",
  icon: "CalendarRange",
  namePrefix: "Weekly Warrior:",
  descriptionFor: (v) => `Complete ${v} weekly challenge${v === 1 ? "" : "s"}.`,
  values: [1, 4, 12, 26, 52],
  slugPrefix: "weekly-challenge",
});

const monthlyChallengeAchievements = tieredMilestones({
  category: "challenges",
  metric: "monthly_challenges_completed",
  icon: "Calendar",
  namePrefix: "Monthly Master:",
  descriptionFor: (v) => `Complete ${v} monthly challenge${v === 1 ? "" : "s"}.`,
  values: [1, 3, 6, 12, 24],
  slugPrefix: "monthly-challenge",
});

const friendsAchievements = tieredMilestones({
  category: "social",
  metric: "friends_count",
  icon: "Users",
  namePrefix: "Squad Size:",
  descriptionFor: (v) => `Add ${v} friend${v === 1 ? "" : "s"} on CodeQuest.`,
  values: [1, 5, 10, 25, 50],
  slugPrefix: "friends",
});

const socialEngagementAchievements = tieredMilestones({
  category: "social",
  metric: "social_engagements",
  icon: "Heart",
  namePrefix: "Community Voice:",
  descriptionFor: (v) => `Give ${v} likes or comments on the activity feed.`,
  values: [10, 50, 100, 250, 500, 1000],
  slugPrefix: "social-engagement",
});

const marketplaceAchievements = tieredMilestones({
  category: "marketplace",
  metric: "items_owned",
  icon: "ShoppingBag",
  namePrefix: "Collector:",
  descriptionFor: (v) => `Own ${v} marketplace cosmetic item${v === 1 ? "" : "s"}.`,
  values: [1, 5, 10, 25],
  slugPrefix: "marketplace",
});

const seasonPassAchievements = tieredMilestones({
  category: "season_pass",
  metric: "season_pass_tiers_claimed",
  icon: "Ticket",
  namePrefix: "Season Pass Tier:",
  descriptionFor: (v) => `Claim ${v} season pass tiers in a single season.`,
  values: [5, 10, 20, 30],
  slugPrefix: "season-pass",
});

// Lower rank is better, so this can't use the generic gte milestone helper.
const leaderboardRankTiers: Array<{ rank: number; tier: AchievementTier }> = [
  { rank: 100, tier: "bronze" },
  { rank: 50, tier: "silver" },
  { rank: 10, tier: "gold" },
  { rank: 1, tier: "legendary" },
];

const leaderboardAchievements: AchievementDefinition[] = leaderboardRankTiers.map(
  ({ rank, tier }) => ({
    slug: `leaderboard-top-${rank}`,
    name: rank === 1 ? "Ranked: #1" : `Ranked: Top ${rank}`,
    description:
      rank === 1
        ? "Reach #1 on the global leaderboard."
        : `Reach the top ${rank} on the global leaderboard.`,
    icon: "Trophy",
    tier,
    category: "leaderboard",
    isSecret: false,
    criteria: { metric: "best_leaderboard_rank", operator: "lte", value: rank },
    ...rewardsForTier(tier),
  }),
);

const referralAchievements = tieredMilestones({
  category: "referrals",
  metric: "referrals_converted",
  icon: "UserPlus",
  namePrefix: "Recruiter:",
  descriptionFor: (v) => `Refer ${v} friend${v === 1 ? "" : "s"} who join CodeQuest.`,
  values: [1, 3, 5, 10, 25, 50],
  slugPrefix: "referral",
});

const attemptAchievements = tieredMilestones({
  category: "grit",
  metric: "total_attempts",
  icon: "Repeat",
  namePrefix: "Persistent:",
  descriptionFor: (v) => `Make ${v.toLocaleString()} total lesson attempts — success takes reps.`,
  values: [50, 250, 1000, 5000, 10000],
  slugPrefix: "attempts",
});

const mentorAchievements = tieredMilestones({
  category: "ai_mentor",
  metric: "mentor_messages_sent",
  icon: "Bot",
  namePrefix: "AI Confidant:",
  descriptionFor: (v) => `Send ${v.toLocaleString()} messages to your AI Mentor.`,
  values: [1, 10, 50, 200, 1000],
  slugPrefix: "mentor",
});

const typingSpeedAchievements = tieredMilestones({
  category: "typing",
  metric: "typing_wpm",
  icon: "Keyboard",
  namePrefix: "Typing Speed:",
  descriptionFor: (v) => `Hit ${v} WPM in a typing lesson.`,
  values: [30, 50, 70, 90, 110],
  slugPrefix: "typing",
});

const studyHoursAchievements = tieredMilestones({
  category: "time_invested",
  metric: "total_hours_studied",
  icon: "Hourglass",
  namePrefix: "Time Invested:",
  descriptionFor: (v) => `Spend ${v.toLocaleString()} hour${v === 1 ? "" : "s"} learning on CodeQuest.`,
  values: [1, 10, 50, 100, 250, 500],
  slugPrefix: "study-hours",
});

const codeReviewAchievements = tieredMilestones({
  category: "code_review",
  metric: "code_reviews_completed",
  icon: "FileSearch",
  namePrefix: "Code Reviewer:",
  descriptionFor: (v) => `Complete ${v} code review lesson${v === 1 ? "" : "s"}.`,
  values: [1, 10, 25, 50],
  slugPrefix: "code-review",
});

const sandboxProjectsAchievements = tieredMilestones({
  category: "projects",
  metric: "sandbox_projects_created",
  icon: "FolderKanban",
  namePrefix: "Builder:",
  descriptionFor: (v) => `Create ${v} project${v === 1 ? "" : "s"} in the interactive sandbox.`,
  values: [1, 5, 15, 30],
  slugPrefix: "sandbox",
});

const weeklyGoalStreakAchievements = tieredMilestones({
  category: "goals",
  metric: "weekly_goals_hit_streak",
  icon: "Target",
  namePrefix: "Goal Streak:",
  descriptionFor: (v) => `Hit your weekly XP goal ${v} weeks in a row.`,
  values: [2, 4, 8, 16],
  slugPrefix: "weekly-goal-streak",
});

// One three-stage arc (Explorer -> Champion -> Perfectionist) per world:
// 75 achievements that are genuinely distinct in criteria, not filler.
const worldArcAchievements: AchievementDefinition[] = WORLDS.flatMap((world) => [
  {
    slug: `world-${world.slug}-explorer`,
    name: `${world.title} Explorer`,
    description: `Complete your first lesson in ${world.title}.`,
    icon: world.icon,
    tier: "bronze" as const,
    category: "world_mastery",
    isSecret: false,
    criteria: { metric: `world_${world.slug}_lessons_completed`, operator: "gte" as const, value: 1 },
    ...rewardsForTier("bronze"),
  },
  {
    slug: `world-${world.slug}-champion`,
    name: `${world.title} Champion`,
    description: `Complete every core node in ${world.title} and defeat its boss battle.`,
    icon: world.icon,
    tier: "gold" as const,
    category: "world_mastery",
    isSecret: false,
    criteria: { metric: `world_${world.slug}_pct_complete`, operator: "gte" as const, value: 100 },
    ...rewardsForTier("gold"),
  },
  {
    slug: `world-${world.slug}-perfectionist`,
    name: `${world.title} Perfectionist`,
    description: `Earn a perfect score on every lesson in ${world.title}.`,
    icon: "Sparkles",
    tier: "platinum" as const,
    category: "world_mastery",
    isSecret: false,
    criteria: { metric: `world_${world.slug}_perfect_pct`, operator: "gte" as const, value: 100 },
    ...rewardsForTier("platinum"),
  },
]);

// Hand-crafted, flavorful named achievements — the ones players screenshot.
// Each maps to a real, checkable criterion.
const flavorAchievements: AchievementDefinition[] = [
  {
    slug: "first-prompt",
    name: "First Prompt",
    description: "Send your very first prompt to Claude.",
    icon: "MessageSquarePlus",
    tier: "bronze",
    category: "milestones",
    isSecret: false,
    criteria: { metric: "prompts_sent", operator: "gte", value: 1 },
    ...rewardsForTier("bronze"),
  },
  {
    slug: "prompt-wizard-i",
    name: "Prompt Wizard I",
    description: "Complete 25 Prompt Engineering lessons.",
    icon: "Wand2",
    tier: "silver",
    category: "flavor",
    isSecret: false,
    criteria: { metric: "world_prompt-engineering_lessons_completed", operator: "gte", value: 25 },
    ...rewardsForTier("silver"),
  },
  {
    slug: "prompt-wizard-ii",
    name: "Prompt Wizard II",
    description: "Master every prompt-optimization lesson in the game.",
    icon: "Wand2",
    tier: "gold",
    category: "flavor",
    isSecret: false,
    criteria: { metric: "prompt_optimization_lessons_completed", operator: "gte", value: 15 },
    ...rewardsForTier("gold"),
  },
  {
    slug: "git-hero-i",
    name: "Git Hero I",
    description: "Resolve your first merge conflict without losing a single line.",
    icon: "GitMerge",
    tier: "bronze",
    category: "flavor",
    isSecret: false,
    criteria: { metric: "merge_conflicts_resolved", operator: "gte", value: 1 },
    ...rewardsForTier("bronze"),
  },
  {
    slug: "git-hero-ii",
    name: "Git Hero II",
    description: "Complete the entire Git world with a perfect score.",
    icon: "GitMerge",
    tier: "platinum",
    category: "flavor",
    isSecret: false,
    criteria: { metric: "world_git_perfect_pct", operator: "gte", value: 100 },
    ...rewardsForTier("platinum"),
  },
  {
    slug: "automation-master",
    name: "Automation Master",
    description: "Build 10 working automations in the Automation world.",
    icon: "Workflow",
    tier: "gold",
    category: "flavor",
    isSecret: false,
    criteria: { metric: "automations_built", operator: "gte", value: 10 },
    ...rewardsForTier("gold"),
  },
  {
    slug: "bug-hunter-i",
    name: "Bug Hunter I",
    description: "Fix your first bug in a debugging lesson.",
    icon: "Bug",
    tier: "bronze",
    category: "flavor",
    isSecret: false,
    criteria: { metric: "bugs_fixed", operator: "gte", value: 1 },
    ...rewardsForTier("bronze"),
  },
  {
    slug: "bug-hunter-ii",
    name: "Bug Hunter II",
    description: "Fix 100 bugs across every debugging lesson.",
    icon: "Bug",
    tier: "gold",
    category: "flavor",
    isSecret: false,
    criteria: { metric: "bugs_fixed", operator: "gte", value: 100 },
    ...rewardsForTier("gold"),
  },
  {
    slug: "speed-coder",
    name: "Speed Coder",
    description: "Finish a code editor lesson in under 60 seconds.",
    icon: "Gauge",
    tier: "silver",
    category: "flavor",
    isSecret: false,
    criteria: { metric: "fastest_code_lesson_seconds", operator: "lte", value: 60 },
    ...rewardsForTier("silver"),
  },
  {
    slug: "night-owl",
    name: "Night Owl",
    description: "Complete 20 lessons between midnight and 4am.",
    icon: "Moon",
    tier: "silver",
    category: "flavor",
    isSecret: false,
    criteria: { metric: "lessons_completed_late_night", operator: "gte", value: 20 },
    ...rewardsForTier("silver"),
  },
  {
    slug: "early-bird",
    name: "Early Bird",
    description: "Complete 20 lessons before 7am.",
    icon: "Sunrise",
    tier: "silver",
    category: "flavor",
    isSecret: false,
    criteria: { metric: "lessons_completed_early_morning", operator: "gte", value: 20 },
    ...rewardsForTier("silver"),
  },
  {
    slug: "weekend-warrior",
    name: "Weekend Warrior",
    description: "Complete a lesson on 10 different weekends.",
    icon: "Swords",
    tier: "silver",
    category: "flavor",
    isSecret: false,
    criteria: { metric: "weekends_active", operator: "gte", value: 10 },
    ...rewardsForTier("silver"),
  },
  {
    slug: "perfect-week",
    name: "Perfect Week",
    description: "Hit your daily goal every day for a full week.",
    icon: "CalendarCheck2",
    tier: "gold",
    category: "flavor",
    isSecret: false,
    criteria: { metric: "perfect_weeks", operator: "gte", value: 1 },
    ...rewardsForTier("gold"),
  },
  {
    slug: "code-samurai",
    name: "Code Samurai",
    description: "Complete 50 refactoring lessons with a clean diff.",
    icon: "Slice",
    tier: "gold",
    category: "flavor",
    isSecret: false,
    criteria: { metric: "refactoring_lessons_completed", operator: "gte", value: 50 },
    ...rewardsForTier("gold"),
  },
  {
    slug: "terminal-ninja",
    name: "Terminal Ninja",
    description: "Complete every interactive terminal lesson without touching the mouse.",
    icon: "SquareTerminal",
    tier: "platinum",
    category: "flavor",
    isSecret: false,
    criteria: { metric: "world_terminal_perfect_pct", operator: "gte", value: 100 },
    ...rewardsForTier("platinum"),
  },
  {
    slug: "ai-whisperer",
    name: "AI Whisperer",
    description: "Complete 50 AI chat lessons with a perfect score.",
    icon: "Sparkles",
    tier: "gold",
    category: "flavor",
    isSecret: false,
    criteria: { metric: "perfect_ai_chat_lessons", operator: "gte", value: 50 },
    ...rewardsForTier("gold"),
  },
  {
    slug: "react-wizard",
    name: "React Wizard",
    description: "Complete the entire React world.",
    icon: "Atom",
    tier: "gold",
    category: "flavor",
    isSecret: false,
    criteria: { metric: "world_react_pct_complete", operator: "gte", value: 100 },
    ...rewardsForTier("gold"),
  },
  {
    slug: "deployment-king",
    name: "Deployment King",
    description: "Ship 25 projects to production from the Deployment world.",
    icon: "Rocket",
    tier: "platinum",
    category: "flavor",
    isSecret: false,
    criteria: { metric: "deployments_shipped", operator: "gte", value: 25 },
    ...rewardsForTier("platinum"),
  },
  {
    slug: "comeback-kid",
    name: "Comeback Kid",
    description: "Return and complete a lesson after a break of 14+ days.",
    icon: "RotateCcw",
    tier: "bronze",
    category: "flavor",
    isSecret: false,
    criteria: { metric: "comeback_after_break_days", operator: "gte", value: 14 },
    ...rewardsForTier("bronze"),
  },
  {
    slug: "founding-member",
    name: "Founding Member",
    description: "Create your CodeQuest account during launch week.",
    icon: "Sparkle",
    tier: "legendary",
    category: "milestones",
    isSecret: true,
    criteria: { metric: "account_created_launch_week", operator: "eq", value: 1 },
    ...rewardsForTier("legendary"),
  },
  {
    slug: "secret-lesson-finder",
    name: "Off the Beaten Path",
    description: "Discover a hidden secret lesson on the learning map.",
    icon: "Compass",
    tier: "silver",
    category: "secrets",
    isSecret: true,
    criteria: { metric: "secret_lessons_found", operator: "gte", value: 1 },
    ...rewardsForTier("silver"),
  },
  {
    slug: "treasure-hunter",
    name: "Treasure Hunter",
    description: "Open 10 treasure nodes on the learning map.",
    icon: "Gift",
    tier: "silver",
    category: "secrets",
    isSecret: false,
    criteria: { metric: "treasure_nodes_opened", operator: "gte", value: 10 },
    ...rewardsForTier("silver"),
  },
  {
    slug: "all-25-worlds",
    name: "World Tour",
    description: "Reach every one of CodeQuest's 25 worlds.",
    icon: "Globe2",
    tier: "platinum",
    category: "world_mastery",
    isSecret: false,
    criteria: { metric: "worlds_reached", operator: "gte", value: 25 },
    ...rewardsForTier("platinum"),
  },
  {
    slug: "grandmaster",
    name: "Grandmaster",
    description: "Reach 100% mastery across all 25 worlds.",
    icon: "Crown",
    tier: "legendary",
    category: "world_mastery",
    isSecret: false,
    criteria: { metric: "worlds_100_pct", operator: "gte", value: 25 },
    ...rewardsForTier("legendary"),
  },
  {
    slug: "two-factor-secured",
    name: "Locked Down",
    description: "Enable two-factor authentication on your account.",
    icon: "ShieldCheck",
    tier: "bronze",
    category: "security",
    isSecret: false,
    criteria: { metric: "two_factor_enabled", operator: "eq", value: 1 },
    ...rewardsForTier("bronze"),
  },
  {
    slug: "profile-complete",
    name: "Ready Player One",
    description: "Fill out your profile: avatar, bio, and display name.",
    icon: "UserRound",
    tier: "bronze",
    category: "milestones",
    isSecret: false,
    criteria: { metric: "profile_completion_pct", operator: "gte", value: 100 },
    ...rewardsForTier("bronze"),
  },
  {
    slug: "guild-founder",
    name: "Guild Founder",
    description: "Create your own study guild.",
    icon: "Castle",
    tier: "silver",
    category: "social",
    isSecret: false,
    criteria: { metric: "guilds_created", operator: "gte", value: 1 },
    ...rewardsForTier("silver"),
  },
  {
    slug: "guild-officer",
    name: "Guild Officer",
    description: "Get promoted to officer in a guild.",
    icon: "ShieldHalf",
    tier: "silver",
    category: "social",
    isSecret: false,
    criteria: { metric: "guild_officer_promotions", operator: "gte", value: 1 },
    ...rewardsForTier("silver"),
  },
  {
    slug: "mystery-box-opener",
    name: "Box Opener",
    description: "Open 25 mystery boxes.",
    icon: "PackageOpen",
    tier: "silver",
    category: "economy",
    isSecret: false,
    criteria: { metric: "mystery_boxes_opened", operator: "gte", value: 25 },
    ...rewardsForTier("silver"),
  },
  {
    slug: "memory-master",
    name: "Memory Master",
    description: "Clear a memory game lesson with zero mismatched pairs.",
    icon: "Brain",
    tier: "silver",
    category: "flavor",
    isSecret: false,
    criteria: { metric: "flawless_memory_games", operator: "gte", value: 1 },
    ...rewardsForTier("silver"),
  },
  {
    slug: "matchmaker",
    name: "Matchmaker",
    description: "Complete 25 matching-game lessons.",
    icon: "Shuffle",
    tier: "silver",
    category: "flavor",
    isSecret: false,
    criteria: { metric: "matching_lessons_completed", operator: "gte", value: 25 },
    ...rewardsForTier("silver"),
  },
];

export const ACHIEVEMENTS: AchievementDefinition[] = [
  ...streakAchievements,
  ...xpAchievements,
  ...lessonsCompletedAchievements,
  ...bossBattleAchievements,
  ...perfectScoreAchievements,
  ...noHintAchievements,
  ...speedRoundAchievements,
  ...coinsAchievements,
  ...gemsAchievements,
  ...certificateAchievements,
  ...dailyChallengeAchievements,
  ...weeklyChallengeAchievements,
  ...monthlyChallengeAchievements,
  ...friendsAchievements,
  ...socialEngagementAchievements,
  ...marketplaceAchievements,
  ...seasonPassAchievements,
  ...leaderboardAchievements,
  ...referralAchievements,
  ...attemptAchievements,
  ...mentorAchievements,
  ...typingSpeedAchievements,
  ...studyHoursAchievements,
  ...codeReviewAchievements,
  ...sandboxProjectsAchievements,
  ...weeklyGoalStreakAchievements,
  ...worldArcAchievements,
  ...flavorAchievements,
];

export function achievementsByCategory() {
  return ACHIEVEMENTS.reduce<Record<string, AchievementDefinition[]>>((acc, a) => {
    (acc[a.category] ??= []).push(a);
    return acc;
  }, {});
}
