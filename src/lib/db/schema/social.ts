import {
  pgTable,
  uuid,
  text,
  integer,
  timestamp,
  boolean,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./users";
import { friendStatusEnum, guildRoleEnum, notificationTypeEnum } from "./enums";

export const friendships = pgTable(
  "friendships",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    requesterId: uuid("requester_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    addresseeId: uuid("addressee_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    status: friendStatusEnum("status").notNull().default("pending"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    respondedAt: timestamp("responded_at", { withTimezone: true }),
  },
  (table) => [
    uniqueIndex("friendships_pair_idx").on(table.requesterId, table.addresseeId),
    index("friendships_addressee_idx").on(table.addresseeId),
  ],
);

export const guilds = pgTable(
  "guilds",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    description: text("description"),
    iconUrl: text("icon_url"),
    ownerId: uuid("owner_id")
      .notNull()
      .references(() => users.id),
    memberCap: integer("member_cap").notNull().default(30),
    totalXp: integer("total_xp").notNull().default(0),
    isPublic: boolean("is_public").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [uniqueIndex("guilds_slug_idx").on(table.slug)],
);

export const guildMembers = pgTable(
  "guild_members",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    guildId: uuid("guild_id")
      .notNull()
      .references(() => guilds.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    role: guildRoleEnum("role").notNull().default("member"),
    contributedXp: integer("contributed_xp").notNull().default(0),
    joinedAt: timestamp("joined_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("guild_members_guild_user_idx").on(table.guildId, table.userId),
    index("guild_members_user_id_idx").on(table.userId),
  ],
);

export const studyGroups = pgTable("study_groups", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
  worldId: uuid("world_id"),
  ownerId: uuid("owner_id")
    .notNull()
    .references(() => users.id),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const studyGroupMembers = pgTable(
  "study_group_members",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    studyGroupId: uuid("study_group_id")
      .notNull()
      .references(() => studyGroups.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    joinedAt: timestamp("joined_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("study_group_members_group_user_idx").on(
      table.studyGroupId,
      table.userId,
    ),
  ],
);

export const messages = pgTable(
  "messages",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    senderId: uuid("sender_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    recipientId: uuid("recipient_id").references(() => users.id, {
      onDelete: "cascade",
    }),
    guildId: uuid("guild_id").references(() => guilds.id, {
      onDelete: "cascade",
    }),
    body: text("body").notNull(),
    readAt: timestamp("read_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("messages_recipient_idx").on(table.recipientId),
    index("messages_guild_idx").on(table.guildId),
    index("messages_sender_idx").on(table.senderId),
  ],
);

export const activityFeed = pgTable(
  "activity_feed",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    verb: text("verb").notNull(), // "completed_lesson", "earned_achievement", "hit_streak", ...
    subjectType: text("subject_type").notNull(),
    subjectId: uuid("subject_id"),
    metadata: text("metadata"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("activity_feed_user_id_idx").on(table.userId),
    index("activity_feed_created_at_idx").on(table.createdAt),
  ],
);

export const activityLikes = pgTable(
  "activity_likes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    activityId: uuid("activity_id")
      .notNull()
      .references(() => activityFeed.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("activity_likes_activity_user_idx").on(
      table.activityId,
      table.userId,
    ),
  ],
);

export const activityComments = pgTable(
  "activity_comments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    activityId: uuid("activity_id")
      .notNull()
      .references(() => activityFeed.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    body: text("body").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [index("activity_comments_activity_idx").on(table.activityId)],
);

export const notifications = pgTable(
  "notifications",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: notificationTypeEnum("type").notNull(),
    title: text("title").notNull(),
    body: text("body"),
    actionUrl: text("action_url"),
    readAt: timestamp("read_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("notifications_user_id_idx").on(table.userId),
    index("notifications_read_at_idx").on(table.readAt),
  ],
);

export const friendshipsRelations = relations(friendships, ({ one }) => ({
  requester: one(users, {
    fields: [friendships.requesterId],
    references: [users.id],
    relationName: "requester",
  }),
  addressee: one(users, {
    fields: [friendships.addresseeId],
    references: [users.id],
    relationName: "addressee",
  }),
}));

export const guildsRelations = relations(guilds, ({ many, one }) => ({
  members: many(guildMembers),
  owner: one(users, { fields: [guilds.ownerId], references: [users.id] }),
}));

export const guildMembersRelations = relations(guildMembers, ({ one }) => ({
  guild: one(guilds, { fields: [guildMembers.guildId], references: [guilds.id] }),
  user: one(users, { fields: [guildMembers.userId], references: [users.id] }),
}));
