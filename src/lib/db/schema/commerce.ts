import {
  pgTable,
  uuid,
  text,
  integer,
  timestamp,
  boolean,
  jsonb,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./users";
import { marketplaceItemTypeEnum, currencyEnum, subscriptionTierEnum } from "./enums";

export const marketplaceItems = pgTable(
  "marketplace_items",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: text("slug").notNull(),
    type: marketplaceItemTypeEnum("type").notNull(),
    name: text("name").notNull(),
    description: text("description").notNull(),
    previewUrl: text("preview_url"),
    priceCurrency: currencyEnum("price_currency").notNull().default("coins"),
    price: integer("price").notNull(),
    rarity: text("rarity").notNull().default("common"), // common, rare, epic, legendary
    isLimitedTime: boolean("is_limited_time").notNull().default(false),
    availableFrom: timestamp("available_from", { withTimezone: true }),
    availableUntil: timestamp("available_until", { withTimezone: true }),
    metadata: jsonb("metadata").$type<Record<string, unknown>>().default({}),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("marketplace_items_slug_idx").on(table.slug),
    index("marketplace_items_type_idx").on(table.type),
  ],
);

export const userInventory = pgTable(
  "user_inventory",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    itemId: uuid("item_id")
      .notNull()
      .references(() => marketplaceItems.id, { onDelete: "cascade" }),
    isEquipped: boolean("is_equipped").notNull().default(false),
    acquiredAt: timestamp("acquired_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    expiresAt: timestamp("expires_at", { withTimezone: true }),
  },
  (table) => [
    uniqueIndex("user_inventory_user_item_idx").on(table.userId, table.itemId),
    index("user_inventory_user_id_idx").on(table.userId),
  ],
);

export const seasonPasses = pgTable("season_passes", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  seasonNumber: integer("season_number").notNull(),
  startsAt: timestamp("starts_at", { withTimezone: true }).notNull(),
  endsAt: timestamp("ends_at", { withTimezone: true }).notNull(),
  tiers: jsonb("tiers")
    .notNull()
    .$type<
      Array<{
        tier: number;
        xpRequired: number;
        freeReward?: { type: string; amount: number };
        premiumReward?: { type: string; amount: number };
      }>
    >(),
});

export const userSeasonPassProgress = pgTable(
  "user_season_pass_progress",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    seasonPassId: uuid("season_pass_id")
      .notNull()
      .references(() => seasonPasses.id, { onDelete: "cascade" }),
    hasPremium: boolean("has_premium").notNull().default(false),
    seasonXp: integer("season_xp").notNull().default(0),
    claimedTiers: jsonb("claimed_tiers").$type<number[]>().default([]),
  },
  (table) => [
    uniqueIndex("user_season_pass_progress_user_season_idx").on(
      table.userId,
      table.seasonPassId,
    ),
  ],
);

export const subscriptions = pgTable(
  "subscriptions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    tier: subscriptionTierEnum("tier").notNull(),
    stripeCustomerId: text("stripe_customer_id"),
    stripeSubscriptionId: text("stripe_subscription_id"),
    currentPeriodEnd: timestamp("current_period_end", { withTimezone: true }),
    cancelAtPeriodEnd: boolean("cancel_at_period_end").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("subscriptions_user_id_idx").on(table.userId),
    uniqueIndex("subscriptions_stripe_sub_idx").on(table.stripeSubscriptionId),
  ],
);

export const referrals = pgTable(
  "referrals",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    referrerId: uuid("referrer_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    refereeId: uuid("referee_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    rewardGranted: boolean("reward_granted").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [uniqueIndex("referrals_referee_idx").on(table.refereeId)],
);

export const marketplaceItemsRelations = relations(
  marketplaceItems,
  ({ many }) => ({
    inventoryEntries: many(userInventory),
  }),
);

export const userInventoryRelations = relations(userInventory, ({ one }) => ({
  user: one(users, { fields: [userInventory.userId], references: [users.id] }),
  item: one(marketplaceItems, {
    fields: [userInventory.itemId],
    references: [marketplaceItems.id],
  }),
}));
