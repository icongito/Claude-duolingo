export type LeaderboardEntry = {
  rank: number;
  username: string;
  displayName: string;
  initials: string;
  level: number;
  weeklyXp: number;
  isCurrentUser: boolean;
};

export const LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, username: "terminal_tess", displayName: "Tess K.", initials: "TK", level: 31, weeklyXp: 1240, isCurrentUser: false },
  { rank: 2, username: "asyncavery", displayName: "Avery M.", initials: "AM", level: 27, weeklyXp: 1105, isCurrentUser: false },
  { rank: 3, username: "gitwizard", displayName: "Jo R.", initials: "JR", level: 25, weeklyXp: 980, isCurrentUser: false },
  { rank: 4, username: "pixel_dev", displayName: "Pixel Dev", initials: "PD", level: 12, weeklyXp: 335, isCurrentUser: true },
  { rank: 5, username: "nullpointer", displayName: "Sam O.", initials: "SO", level: 18, weeklyXp: 310, isCurrentUser: false },
  { rank: 6, username: "css_sorceress", displayName: "Lena V.", initials: "LV", level: 15, weeklyXp: 290, isCurrentUser: false },
  { rank: 7, username: "deploy_dan", displayName: "Dan W.", initials: "DW", level: 21, weeklyXp: 255, isCurrentUser: false },
  { rank: 8, username: "rustacean_ru", displayName: "Ru P.", initials: "RP", level: 19, weeklyXp: 230, isCurrentUser: false },
  { rank: 9, username: "vim_valkyrie", displayName: "Ida S.", initials: "IS", level: 23, weeklyXp: 210, isCurrentUser: false },
  { rank: 10, username: "monorepo_max", displayName: "Max T.", initials: "MT", level: 14, weeklyXp: 180, isCurrentUser: false },
];

export type Friend = {
  username: string;
  displayName: string;
  initials: string;
  level: number;
  currentStreak: number;
  status: "online" | "learning" | "offline";
  lastActivity: string;
};

export const FRIENDS: Friend[] = [
  { username: "asyncavery", displayName: "Avery M.", initials: "AM", level: 27, currentStreak: 45, status: "learning", lastActivity: "In World 12: TypeScript" },
  { username: "css_sorceress", displayName: "Lena V.", initials: "LV", level: 15, currentStreak: 8, status: "online", lastActivity: "Browsing the marketplace" },
  { username: "deploy_dan", displayName: "Dan W.", initials: "DW", level: 21, currentStreak: 19, status: "offline", lastActivity: "Last seen 3h ago" },
  { username: "nullpointer", displayName: "Sam O.", initials: "SO", level: 18, currentStreak: 2, status: "offline", lastActivity: "Last seen yesterday" },
];

export type ActivityItem = {
  id: string;
  username: string;
  displayName: string;
  initials: string;
  verb: string;
  detail: string;
  timeAgo: string;
  likes: number;
  likedByMe: boolean;
};

export const ACTIVITY_FEED: ActivityItem[] = [
  { id: "a1", username: "asyncavery", displayName: "Avery M.", initials: "AM", verb: "defeated a boss battle", detail: "TypeScript World — Generics Gauntlet", timeAgo: "12m ago", likes: 6, likedByMe: false },
  { id: "a2", username: "css_sorceress", displayName: "Lena V.", initials: "LV", verb: "hit a 7-day streak", detail: "🔥 One week strong", timeAgo: "1h ago", likes: 12, likedByMe: true },
  { id: "a3", username: "gitwizard", displayName: "Jo R.", initials: "JR", verb: "earned an achievement", detail: "Git Hero II — perfect score on the Git world", timeAgo: "2h ago", likes: 21, likedByMe: false },
  { id: "a4", username: "deploy_dan", displayName: "Dan W.", initials: "DW", verb: "completed a mini project", detail: "Built a REST API in World 14", timeAgo: "5h ago", likes: 4, likedByMe: false },
  { id: "a5", username: "nullpointer", displayName: "Sam O.", initials: "SO", verb: "reached Level 18", detail: "Rank: Engineer", timeAgo: "8h ago", likes: 9, likedByMe: true },
];

export type Guild = {
  slug: string;
  name: string;
  members: number;
  memberCap: number;
  weeklyXp: number;
  description: string;
  isMember: boolean;
};

export const GUILDS: Guild[] = [
  { slug: "night-shift", name: "Night Shift", members: 24, memberCap: 30, weeklyXp: 8420, description: "For those who code after midnight.", isMember: true },
  { slug: "prompt-punks", name: "Prompt Punks", members: 28, memberCap: 30, weeklyXp: 7150, description: "Prompt engineering perfectionists.", isMember: false },
  { slug: "terminal-velocity", name: "Terminal Velocity", members: 19, memberCap: 30, weeklyXp: 6890, description: "Keyboard-only. Mouse users need not apply.", isMember: false },
  { slug: "rubber-duck-society", name: "Rubber Duck Society", members: 30, memberCap: 30, weeklyXp: 6220, description: "We debug by explaining. Quack.", isMember: false },
];
