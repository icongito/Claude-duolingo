import type { LittleGuyWear } from "@/components/mascot/little-guy";

/**
 * The CodeQuest economy: subscription tiers, gem sources and sinks, quests.
 *
 * Fair-play line (enforced across every item here): money and gems buy
 * TIME, PROTECTION, or LOOKS — never answers, never content, never rank.
 * Gems are deliberately scarce: lessons never pay gems; the only faucets are
 * boss first-clears, weekly quests, one-time special quests, and the premium
 * stipend. Target earn rate for an active free player is ~5-10 gems/week
 * with a hard weekly cap.
 */

export const WEEKLY_GEM_CAP = 25;

/* ---------------------------------- plans --------------------------------- */

export type PlanId = "free" | "premium" | "premium_plus";

/* ------------------------- mentor unit economics -------------------------- */

/**
 * Claude API list pricing (USD per million tokens) and the token profile of a
 * typical mentor exchange. Mentor caps below are DERIVED from these numbers —
 * `economy.test.ts` asserts that a user who maxes their cap every day of the
 * month can never cost more than `MENTOR_COST_CEILING_PCT` of what they pay
 * (ads revenue, for the free tier). Change a price or a cap and the test
 * tells you whether the tier still makes money.
 */
export const MENTOR_MODELS = {
  "claude-haiku-4-5-20251001": { label: "Fast mentor", inPerMTok: 1, outPerMTok: 5 },
  // Sonnet 5 standard pricing ($2/$10 intro runs through 2026-08-31; budget
  // on the standard rate so the tiers stay profitable after it ends).
  "claude-sonnet-5": { label: "Smart mentor", inPerMTok: 3, outPerMTok: 15 },
} as const;

export type MentorModelId = keyof typeof MENTOR_MODELS;

/** ~150-token system prompt + sliced history in; max_tokens 600 out. */
export const MENTOR_TOKENS_PER_MESSAGE = { input: 1200, output: 300 };

/** Worst-case mentor spend may consume at most this share of tier revenue. */
export const MENTOR_COST_CEILING_PCT = 0.75;

/**
 * Conservative ads ARPU assumption for a daily-active free user (one house/
 * network ad card after lessons). This is what funds the free mentor budget.
 */
export const AD_REVENUE_PER_FREE_USER_USD = 1.0;

export function mentorCostPerMessage(model: MentorModelId): number {
  const p = MENTOR_MODELS[model];
  return (
    (MENTOR_TOKENS_PER_MESSAGE.input * p.inPerMTok +
      MENTOR_TOKENS_PER_MESSAGE.output * p.outPerMTok) /
    1_000_000
  );
}

/** A cap-maxing user, 30 days straight — the number the caps are sized to. */
export function worstCaseMentorMonthlyCost(plan: SubscriptionPlan): number {
  return mentorCostPerMessage(plan.mentorModelId) * plan.mentorDailyMessages * 30;
}

export type SubscriptionPlan = {
  id: PlanId;
  name: string;
  tagline: string;
  /** USD per month, billed monthly. */
  monthlyPrice: number;
  /** USD per month when billed yearly. */
  yearlyPrice: number;
  highlight: boolean;
  showsAds: boolean;
  monthlyGemStipend: number;
  mentorModelId: MentorModelId;
  mentorDailyMessages: number;
  features: string[];
};

export const PLANS: SubscriptionPlan[] = [
  {
    id: "free",
    name: "Free",
    tagline: "The whole game. Forever.",
    monthlyPrice: 0,
    yearlyPrice: 0,
    highlight: false,
    showsAds: true,
    monthlyGemStipend: 0,
    // Haiku @ $0.0027/msg → 10/day worst case = $0.81/mo, covered by ads.
    mentorModelId: "claude-haiku-4-5-20251001",
    mentorDailyMessages: 10,
    features: [
      "All 25 worlds and every lesson",
      "Full achievements, leaderboard & community",
      "3 hearts, refilled daily",
      "AI Mentor: 10 messages/day (fast model)",
      "Earn gems through quests and boss battles",
      "Ad-supported — a short ad card after lessons",
    ],
  },
  {
    id: "premium",
    name: "Premium",
    tagline: "Protect your streak. Learn without limits.",
    monthlyPrice: 6.99,
    yearlyPrice: 4.99,
    highlight: true,
    showsAds: false,
    monthlyGemStipend: 30,
    // Sonnet @ $0.0081/msg → 15/day worst case = $3.65/mo, under 75% of
    // even the yearly rate ($4.99).
    mentorModelId: "claude-sonnet-5",
    mentorDailyMessages: 15,
    features: [
      "Everything in Free — minus the ads",
      "Unlimited hearts — mistakes cost nothing",
      "One free streak repair every month",
      "30 gems/month stipend",
      "AI Mentor: 15 messages/day on the smart model",
      "Offline lessons on mobile",
    ],
  },
  {
    id: "premium_plus",
    name: "Premium+",
    tagline: "For the obsessed.",
    monthlyPrice: 12.99,
    yearlyPrice: 9.99,
    highlight: false,
    showsAds: false,
    monthlyGemStipend: 60,
    // Sonnet @ $0.0081/msg → 30/day worst case = $7.29/mo, under 75% of
    // even the yearly rate ($9.99).
    mentorModelId: "claude-sonnet-5",
    mentorDailyMessages: 30,
    features: [
      "Everything in Premium",
      "2× Premium's mentor budget: 30 smart-model messages/day",
      "60 gems/month stipend",
      "Exclusive seasonal wearable drop for Little Guy",
      "One weekly quest reroll",
      "Early access to new worlds",
    ],
  },
];

export function getPlan(id: PlanId): SubscriptionPlan {
  return PLANS.find((p) => p.id === id) ?? PLANS[0];
}

/* -------------------------------- gem packs ------------------------------- */

/** One-time top-ups. Gems still only buy time/protection/looks. */
export type GemPack = {
  id: string;
  name: string;
  gems: number;
  priceUsd: number;
  badge?: string;
};

export const GEM_PACKS: GemPack[] = [
  { id: "gems-handful", name: "Handful of Gems", gems: 20, priceUsd: 1.99 },
  { id: "gems-pouch", name: "Gem Pouch", gems: 55, priceUsd: 4.99, badge: "Popular" },
  { id: "gems-chest", name: "Gem Chest", gems: 120, priceUsd: 9.99, badge: "Best value" },
];

export function getGemPack(id: string): GemPack | null {
  return GEM_PACKS.find((p) => p.id === id) ?? null;
}

/* --------------------------- consumables (gems) --------------------------- */

export type Consumable = {
  slug: string;
  name: string;
  description: string;
  icon: string;
  priceGems: number;
  /** How many the demo user owns. */
  owned: number;
  maxHeld?: number;
};

export const CONSUMABLES: Consumable[] = [
  {
    slug: "streak-freeze",
    name: "Streak Freeze",
    description:
      "Miss a day without losing your streak. Equips automatically; hold up to 2.",
    icon: "Snowflake",
    priceGems: 15,
    owned: 2,
    maxHeld: 2,
  },
  {
    slug: "streak-revive",
    name: "Streak Revive",
    description:
      "Bring a dead streak back within 48 hours. Price scales with how long the streak was.",
    icon: "FlameKindling",
    priceGems: 45,
    owned: 0,
  },
  {
    slug: "heart-refill",
    name: "Heart Refill",
    description: "Refill all 3 hearts instantly instead of waiting.",
    icon: "HeartPulse",
    priceGems: 10,
    owned: 0,
  },
  {
    slug: "quest-reroll",
    name: "Quest Reroll",
    description: "Swap one daily quest you don't like for a fresh one.",
    icon: "Dices",
    priceGems: 5,
    owned: 1,
  },
];

/* ---------------------------- wearables (gems) ---------------------------- */

export type Wearable = {
  slug: string;
  wear: Exclude<LittleGuyWear, "none">;
  name: string;
  description: string;
  priceGems: number;
  rarity: "rare" | "epic" | "legendary";
  owned: boolean;
};

export const WEARABLES: Wearable[] = [
  {
    slug: "wear-cap",
    wear: "cap",
    name: "Quest Cap",
    description: "A no-nonsense orange cap. Little Guy means business.",
    priceGems: 20,
    rarity: "rare",
    owned: true,
  },
  {
    slug: "wear-specs",
    wear: "specs",
    name: "Dev Specs",
    description: "Pixel-rimmed glasses. +0 IQ, +100 credibility.",
    priceGems: 25,
    rarity: "rare",
    owned: false,
  },
  {
    slug: "wear-wizard",
    wear: "wizard",
    name: "Wizard Hat",
    description: "For the ones who read the docs all the way through.",
    priceGems: 40,
    rarity: "epic",
    owned: false,
  },
  {
    slug: "wear-crown",
    wear: "crown",
    name: "Streak Crown",
    description: "Solid gold. Earn the gems the hard way and wear the proof.",
    priceGems: 60,
    rarity: "legendary",
    owned: false,
  },
];

/* ---------------------------------- quests -------------------------------- */

export type Quest = {
  id: string;
  cadence: "daily" | "weekly" | "special";
  title: string;
  description: string;
  icon: string;
  progress: number;
  target: number;
  reward: { coins?: number; gems?: number; xp?: number };
  completed: boolean;
  claimed: boolean;
  expiresIn?: string;
};

export const QUESTS: Quest[] = [
  // Daily — coins/XP only. Gems are never a daily faucet.
  {
    id: "d1",
    cadence: "daily",
    title: "Warm Up",
    description: "Complete 3 lessons today.",
    icon: "Zap",
    progress: 2,
    target: 3,
    reward: { coins: 15, xp: 10 },
    completed: false,
    claimed: false,
    expiresIn: "9h 14m",
  },
  {
    id: "d2",
    cadence: "daily",
    title: "Flawless",
    description: "Finish one lesson with a perfect score.",
    icon: "Target",
    progress: 1,
    target: 1,
    reward: { coins: 20 },
    completed: true,
    claimed: false,
    expiresIn: "9h 14m",
  },
  {
    id: "d3",
    cadence: "daily",
    title: "Deep Focus",
    description: "Earn 50 XP in a single session.",
    icon: "Brain",
    progress: 20,
    target: 50,
    reward: { coins: 15 },
    completed: false,
    claimed: false,
    expiresIn: "9h 14m",
  },
  // Weekly — the routine gem faucet, small on purpose.
  {
    id: "w1",
    cadence: "weekly",
    title: "Consistency",
    description: "Learn on 5 different days this week.",
    icon: "CalendarCheck",
    progress: 4,
    target: 5,
    reward: { gems: 3, coins: 50 },
    completed: false,
    claimed: false,
    expiresIn: "2d 9h",
  },
  {
    id: "w2",
    cadence: "weekly",
    title: "Grinder",
    description: "Earn 300 XP this week.",
    icon: "TrendingUp",
    progress: 240,
    target: 300,
    reward: { gems: 3 },
    completed: false,
    claimed: false,
    expiresIn: "2d 9h",
  },
  {
    id: "w3",
    cadence: "weekly",
    title: "Sparring Partner",
    description: "Win 3 checkpoint quizzes.",
    icon: "Swords",
    progress: 3,
    target: 3,
    reward: { gems: 2, coins: 30 },
    completed: true,
    claimed: false,
    expiresIn: "2d 9h",
  },
  // Special — one-time faucets, the biggest single payouts.
  {
    id: "s1",
    cadence: "special",
    title: "Recruiter",
    description: "Invite 5 friends who complete their first lesson.",
    icon: "UserPlus",
    progress: 2,
    target: 5,
    reward: { gems: 10 },
    completed: false,
    claimed: false,
  },
  {
    id: "s2",
    cadence: "special",
    title: "Giant Slayer",
    description: "Defeat your first world boss.",
    icon: "Skull",
    progress: 2,
    target: 1,
    reward: { gems: 10 },
    completed: true,
    claimed: true,
  },
  {
    id: "s3",
    cadence: "special",
    title: "Marathon",
    description: "Reach a 30-day streak.",
    icon: "Flame",
    progress: 12,
    target: 30,
    reward: { gems: 15 },
    completed: false,
    claimed: false,
  },
];

/* --------------------------------- billing -------------------------------- */

export type BillingInfo = {
  plan: PlanId;
  cycle: "monthly" | "yearly";
  status: "active" | "canceled" | "past_due";
  renewsOn: string;
  paymentMethod: { brand: string; last4: string; expires: string };
};

export type Invoice = {
  id: string;
  date: string;
  description: string;
  amountUsd: number;
  status: "paid" | "refunded";
};

export const DEMO_BILLING: BillingInfo = {
  plan: "premium",
  cycle: "monthly",
  status: "active",
  renewsOn: "2026-08-02",
  paymentMethod: { brand: "Visa", last4: "4242", expires: "09/28" },
};

export const DEMO_INVOICES: Invoice[] = [
  { id: "inv-0007", date: "2026-07-02", description: "Premium — monthly", amountUsd: 6.99, status: "paid" },
  { id: "inv-0006", date: "2026-06-02", description: "Premium — monthly", amountUsd: 6.99, status: "paid" },
  { id: "inv-0005", date: "2026-05-02", description: "Premium — monthly", amountUsd: 6.99, status: "paid" },
  { id: "inv-0004", date: "2026-04-11", description: "Gem Pouch (55 gems)", amountUsd: 4.99, status: "paid" },
  { id: "inv-0003", date: "2026-04-02", description: "Premium — monthly", amountUsd: 6.99, status: "paid" },
];
