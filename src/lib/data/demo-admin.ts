export type AdminKpi = {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down";
};

export const ADMIN_KPIS: AdminKpi[] = [
  { label: "Active learners (7d)", value: "41,208", change: "+8.2%", trend: "up" },
  { label: "Lessons completed (7d)", value: "312,940", change: "+12.4%", trend: "up" },
  { label: "New signups (7d)", value: "3,187", change: "+4.1%", trend: "up" },
  { label: "Premium conversion", value: "6.8%", change: "-0.3%", trend: "down" },
];

export type DauPoint = { day: string; users: number };

export const DAU_SERIES: DauPoint[] = [
  { day: "Jul 3", users: 35200 },
  { day: "Jul 4", users: 33100 },
  { day: "Jul 5", users: 36900 },
  { day: "Jul 6", users: 38400 },
  { day: "Jul 7", users: 40100 },
  { day: "Jul 8", users: 39600 },
  { day: "Jul 9", users: 41208 },
];

export type AdminUserRow = {
  username: string;
  email: string;
  level: number;
  tier: "free" | "premium" | "team";
  status: "active" | "banned";
  joined: string;
};

export const ADMIN_USERS: AdminUserRow[] = [
  { username: "terminal_tess", email: "tess@example.com", level: 31, tier: "premium", status: "active", joined: "2026-01-12" },
  { username: "asyncavery", email: "avery@example.com", level: 27, tier: "premium", status: "active", joined: "2026-02-03" },
  { username: "gitwizard", email: "jo@example.com", level: 25, tier: "free", status: "active", joined: "2026-02-19" },
  { username: "pixel_dev", email: "pixel@example.com", level: 12, tier: "free", status: "active", joined: "2026-03-02" },
  { username: "spam_bot_442", email: "bot442@example.com", level: 1, tier: "free", status: "banned", joined: "2026-06-30" },
  { username: "vim_valkyrie", email: "ida@example.com", level: 23, tier: "team", status: "active", joined: "2026-01-28" },
];

export type ReportRow = {
  id: string;
  subject: string;
  reason: string;
  reporter: string;
  status: "open" | "reviewing" | "resolved";
  age: string;
};

export const ADMIN_REPORTS: ReportRow[] = [
  { id: "r-1042", subject: "Comment on activity a3", reason: "Spam link in comment", reporter: "css_sorceress", status: "open", age: "2h" },
  { id: "r-1041", subject: "User spam_bot_442", reason: "Automated XP farming", reporter: "system", status: "resolved", age: "1d" },
  { id: "r-1039", subject: "Guild 'free-gems-club'", reason: "Misleading name / scam", reporter: "deploy_dan", status: "reviewing", age: "2d" },
  { id: "r-1035", subject: "Shared project #8812", reason: "Contains offensive content", reporter: "nullpointer", status: "open", age: "3d" },
];

export type WorldContentRow = {
  slug: string;
  title: string;
  lessons: number;
  published: boolean;
  completionRate: number;
  avgRating: number;
};
