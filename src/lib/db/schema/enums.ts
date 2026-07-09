import { pgEnum } from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", [
  "student",
  "moderator",
  "admin",
]);

export const subscriptionTierEnum = pgEnum("subscription_tier", [
  "free",
  "premium",
  "team",
  "enterprise",
]);

export const lessonTypeEnum = pgEnum("lesson_type", [
  "multiple_choice",
  "fill_blank",
  "drag_drop",
  "sorting",
  "flashcard",
  "typing",
  "terminal",
  "code_editor",
  "debugging",
  "refactoring",
  "repo_review",
  "prompt_writing",
  "prompt_optimization",
  "ai_chat",
  "mini_project",
  "sandbox",
  "code_review",
  "live_preview",
  "memory_game",
  "matching",
  "boss_battle",
  "speed_round",
  "weekly_challenge",
]);

export const nodeKindEnum = pgEnum("node_kind", [
  "lesson",
  "practice",
  "quiz",
  "project",
  "boss_battle",
  "treasure",
  "secret",
  "checkpoint",
]);

export const nodeStatusEnum = pgEnum("node_status", [
  "locked",
  "available",
  "in_progress",
  "completed",
  "mastered",
]);

export const attemptStatusEnum = pgEnum("attempt_status", [
  "in_progress",
  "passed",
  "failed",
  "abandoned",
]);

export const currencyEnum = pgEnum("currency_type", ["xp", "coins", "gems", "skill_points"]);

export const ledgerReasonEnum = pgEnum("ledger_reason", [
  "lesson_complete",
  "quiz_complete",
  "project_complete",
  "boss_battle_win",
  "daily_challenge",
  "weekly_challenge",
  "monthly_challenge",
  "streak_bonus",
  "achievement_unlock",
  "daily_reward",
  "mystery_box",
  "marketplace_purchase",
  "marketplace_refund",
  "admin_adjustment",
  "referral_bonus",
]);

export const achievementTierEnum = pgEnum("achievement_tier", [
  "bronze",
  "silver",
  "gold",
  "platinum",
  "legendary",
]);

export const friendStatusEnum = pgEnum("friend_status", [
  "pending",
  "accepted",
  "blocked",
]);

export const guildRoleEnum = pgEnum("guild_role", ["member", "officer", "leader"]);

export const notificationTypeEnum = pgEnum("notification_type", [
  "achievement",
  "friend_request",
  "friend_accept",
  "guild_invite",
  "message",
  "streak_risk",
  "boss_battle_available",
  "challenge_reset",
  "level_up",
  "leaderboard_change",
  "system",
  "season_pass",
]);

export const marketplaceItemTypeEnum = pgEnum("marketplace_item_type", [
  "theme",
  "avatar",
  "profile_frame",
  "badge_cosmetic",
  "xp_booster",
  "season_pass",
  "title",
]);

export const challengeCadenceEnum = pgEnum("challenge_cadence", [
  "daily",
  "weekly",
  "monthly",
]);

export const reportStatusEnum = pgEnum("report_status", [
  "open",
  "reviewing",
  "resolved",
  "dismissed",
]);
