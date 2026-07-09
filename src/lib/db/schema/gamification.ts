import {
  pgTable,
  uuid,
  text,
  integer,
  timestamp,
  jsonb,
  boolean,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./users";
import { currencyEnum, ledgerReasonEnum, achievementTierEnum } from "./enums";

/** Append-only ledger for every XP/coin/gem/skill-point change — the source of truth for balances. */
export const currencyLedger = pgTable(
  "currency_ledger",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    currency: currencyEnum("currency").notNull(),
    amount: integer("amount").notNull(), // signed
    reason: ledgerReasonEnum("reason").notNull(),
    metadata: jsonb("metadata").$type<Record<string, unknown>>().default({}),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("currency_ledger_user_id_idx").on(table.userId),
    index("currency_ledger_created_at_idx").on(table.createdAt),
  ],
);

export const achievements = pgTable(
  "achievements",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    description: text("description").notNull(),
    icon: text("icon").notNull().default("Trophy"),
    tier: achievementTierEnum("tier").notNull().default("bronze"),
    category: text("category").notNull(), // e.g. "streaks", "git", "prompting", "social"
    xpReward: integer("xp_reward").notNull().default(50),
    coinReward: integer("coin_reward").notNull().default(10),
    gemReward: integer("gem_reward").notNull().default(0),
    isSecret: boolean("is_secret").notNull().default(false),
    /** Machine-checkable unlock rule, evaluated server-side. */
    criteria: jsonb("criteria").notNull().$type<{
      metric: string;
      operator: "gte" | "eq" | "lte";
      value: number;
    }>(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("achievements_slug_idx").on(table.slug),
    index("achievements_category_idx").on(table.category),
  ],
);

export const userAchievements = pgTable(
  "user_achievements",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    achievementId: uuid("achievement_id")
      .notNull()
      .references(() => achievements.id, { onDelete: "cascade" }),
    progress: integer("progress").notNull().default(0),
    unlockedAt: timestamp("unlocked_at", { withTimezone: true }),
    seenAt: timestamp("seen_at", { withTimezone: true }),
  },
  (table) => [
    uniqueIndex("user_achievements_user_achievement_idx").on(
      table.userId,
      table.achievementId,
    ),
    index("user_achievements_user_id_idx").on(table.userId),
  ],
);

export const badges = pgTable("badges", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull().default("Shield"),
  worldId: uuid("world_id"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const userBadges = pgTable(
  "user_badges",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    badgeId: uuid("badge_id")
      .notNull()
      .references(() => badges.id, { onDelete: "cascade" }),
    earnedAt: timestamp("earned_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("user_badges_user_badge_idx").on(table.userId, table.badgeId),
  ],
);

export const certificates = pgTable(
  "certificates",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    worldId: uuid("world_id").notNull(),
    title: text("title").notNull(),
    serialNumber: text("serial_number").notNull(),
    issuedAt: timestamp("issued_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("certificates_serial_idx").on(table.serialNumber),
    index("certificates_user_id_idx").on(table.userId),
  ],
);

export const currencyLedgerRelations = relations(currencyLedger, ({ one }) => ({
  user: one(users, { fields: [currencyLedger.userId], references: [users.id] }),
}));

export const achievementsRelations = relations(achievements, ({ many }) => ({
  userAchievements: many(userAchievements),
}));

export const userAchievementsRelations = relations(
  userAchievements,
  ({ one }) => ({
    user: one(users, {
      fields: [userAchievements.userId],
      references: [users.id],
    }),
    achievement: one(achievements, {
      fields: [userAchievements.achievementId],
      references: [achievements.id],
    }),
  }),
);

export const userBadgesRelations = relations(userBadges, ({ one }) => ({
  user: one(users, { fields: [userBadges.userId], references: [users.id] }),
  badge: one(badges, { fields: [userBadges.badgeId], references: [badges.id] }),
}));
