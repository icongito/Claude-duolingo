export type Notification = {
  id: string;
  type:
    | "achievement"
    | "friend_request"
    | "streak_risk"
    | "level_up"
    | "leaderboard_change"
    | "system";
  title: string;
  body: string;
  timeAgo: string;
  read: boolean;
};

export const NOTIFICATIONS: Notification[] = [
  { id: "n1", type: "streak_risk", title: "Your streak is at risk!", body: "Complete a lesson in the next 6 hours to keep your 12-day streak alive.", timeAgo: "1h ago", read: false },
  { id: "n2", type: "achievement", title: "Achievement unlocked", body: "Streak: 7 — kept a learning streak alive for 7 days in a row.", timeAgo: "2d ago", read: false },
  { id: "n3", type: "friend_request", title: "Friend request", body: "vim_valkyrie wants to be your friend.", timeAgo: "3d ago", read: false },
  { id: "n4", type: "leaderboard_change", title: "You moved up!", body: "You're now #4 on this week's leaderboard.", timeAgo: "4d ago", read: true },
  { id: "n5", type: "level_up", title: "Level 12 reached", body: "You earned 3 skill points. Spend them in the skill tree.", timeAgo: "6d ago", read: true },
  { id: "n6", type: "system", title: "New world published", body: "World 19: MCP is now available for Premium members.", timeAgo: "1w ago", read: true },
];

export type MarketplaceItem = {
  slug: string;
  type: "theme" | "avatar" | "profile_frame" | "xp_booster" | "title";
  name: string;
  description: string;
  priceCurrency: "coins" | "gems";
  price: number;
  rarity: "common" | "rare" | "epic" | "legendary";
  owned: boolean;
  /** Preview gradient for the item card. */
  gradient: [string, string];
};

export const MARKETPLACE_ITEMS: MarketplaceItem[] = [
  { slug: "theme-synthwave", type: "theme", name: "Synthwave Theme", description: "Purple-pink glow for your entire interface.", priceCurrency: "gems", price: 40, rarity: "epic", owned: false, gradient: ["#b78bff", "#ff6ec7"] },
  { slug: "theme-forest", type: "theme", name: "Forest Theme", description: "Deep greens for calm late-night sessions.", priceCurrency: "coins", price: 800, rarity: "rare", owned: false, gradient: ["#3ddc97", "#1a5c40"] },
  { slug: "avatar-astro-cat", type: "avatar", name: "Astro Cat", description: "A pixel cat in a space helmet.", priceCurrency: "coins", price: 500, rarity: "rare", owned: true, gradient: ["#6ee3ff", "#2563eb"] },
  { slug: "avatar-golem", type: "avatar", name: "Code Golem", description: "Built from living stone and semicolons.", priceCurrency: "coins", price: 500, rarity: "common", owned: false, gradient: ["#a8a29e", "#57534e"] },
  { slug: "frame-flame", type: "profile_frame", name: "Flame Frame", description: "Animated fire ring for 30+ day streaks.", priceCurrency: "gems", price: 25, rarity: "epic", owned: false, gradient: ["#ff5757", "#FF7A1A"] },
  { slug: "frame-circuit", type: "profile_frame", name: "Circuit Frame", description: "Glowing circuit traces around your avatar.", priceCurrency: "coins", price: 650, rarity: "rare", owned: false, gradient: ["#FFC857", "#FF7A1A"] },
  { slug: "booster-2x-1h", type: "xp_booster", name: "2× XP Booster (1h)", description: "Double XP for one hour. Cosmetic pace boost — no content is gated.", priceCurrency: "gems", price: 10, rarity: "common", owned: false, gradient: ["#FF9E3D", "#FFC857"] },
  { slug: "title-night-owl", type: "title", name: "Title: Night Owl", description: "Display 'Night Owl' under your name.", priceCurrency: "coins", price: 300, rarity: "common", owned: false, gradient: ["#312e81", "#6366f1"] },
];

export type DailyChallenge = {
  title: string;
  description: string;
  xpReward: number;
  coinReward: number;
  expiresIn: string;
  completed: boolean;
};

export const DAILY_CHALLENGE: DailyChallenge = {
  title: "Speed Round: Terminal Commands",
  description: "Answer 10 terminal questions in under 90 seconds.",
  xpReward: 50,
  coinReward: 15,
  expiresIn: "9h 14m",
  completed: false,
};

export type UpcomingBoss = {
  world: string;
  name: string;
  nodesAway: number;
};

export const UPCOMING_BOSS: UpcomingBoss = {
  world: "Claude Code",
  name: "The Context Kraken",
  nodesAway: 24,
};
