import {
  pgTable,
  uuid,
  text,
  integer,
  boolean,
  timestamp,
  jsonb,
  date,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { userRoleEnum, subscriptionTierEnum } from "./enums";

/**
 * `users` mirrors `auth.users` (Supabase-managed) via a matching `id`.
 * Application-owned profile/gamification state lives here, never in auth.users.
 */
export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey(), // == auth.users.id
    email: text("email").notNull(),
    username: text("username").notNull(),
    displayName: text("display_name").notNull(),
    avatarUrl: text("avatar_url"),
    bio: text("bio"),
    role: userRoleEnum("role").notNull().default("student"),
    subscriptionTier: subscriptionTierEnum("subscription_tier")
      .notNull()
      .default("free"),
    countryCode: text("country_code"),
    timezone: text("timezone").default("UTC"),

    level: integer("level").notNull().default(1),
    totalXp: integer("total_xp").notNull().default(0),
    coins: integer("coins").notNull().default(0),
    gems: integer("gems").notNull().default(0),
    skillPoints: integer("skill_points").notNull().default(0),

    currentStreak: integer("current_streak").notNull().default(0),
    longestStreak: integer("longest_streak").notNull().default(0),
    lastActivityDate: date("last_activity_date"),
    streakFreezeCount: integer("streak_freeze_count").notNull().default(0),

    equippedTitleId: uuid("equipped_title_id"),
    equippedFrameId: uuid("equipped_frame_id"),
    equippedThemeId: uuid("equipped_theme_id"),

    onboardingCompletedAt: timestamp("onboarding_completed_at", {
      withTimezone: true,
    }),
    twoFactorEnabled: boolean("two_factor_enabled").notNull().default(false),
    isBanned: boolean("is_banned").notNull().default(false),
    bannedReason: text("banned_reason"),

    preferences: jsonb("preferences")
      .$type<{
        reducedMotion?: boolean;
        soundEnabled?: boolean;
        emailNotifications?: boolean;
        pushNotifications?: boolean;
        publicProfile?: boolean;
        theme?: "dark" | "light";
      }>()
      .notNull()
      .default({}),

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("users_username_idx").on(table.username),
    uniqueIndex("users_email_idx").on(table.email),
    index("users_total_xp_idx").on(table.totalXp),
    index("users_current_streak_idx").on(table.currentStreak),
  ],
);

export const userSessions = pgTable(
  "user_sessions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    userAgent: text("user_agent"),
    ipAddress: text("ip_address"),
    device: text("device"),
    lastSeenAt: timestamp("last_seen_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    expiresAt: timestamp("expires_at", { withTimezone: true }),
  },
  (table) => [index("user_sessions_user_id_idx").on(table.userId)],
);

export const userSettings = pgTable("user_settings", {
  userId: uuid("user_id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  dailyGoalXp: integer("daily_goal_xp").notNull().default(30),
  weeklyGoalDays: integer("weekly_goal_days").notNull().default(5),
  reminderTime: text("reminder_time").default("19:00"),
  reminderEnabled: boolean("reminder_enabled").notNull().default(true),
  highContrast: boolean("high_contrast").notNull().default(false),
  reducedMotion: boolean("reduced_motion").notNull().default(false),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const usersRelations = relations(users, ({ many, one }) => ({
  sessions: many(userSessions),
  settings: one(userSettings, {
    fields: [users.id],
    references: [userSettings.userId],
  }),
}));

export const userSessionsRelations = relations(userSessions, ({ one }) => ({
  user: one(users, { fields: [userSessions.userId], references: [users.id] }),
}));
