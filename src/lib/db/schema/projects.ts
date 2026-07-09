import {
  pgTable,
  uuid,
  text,
  integer,
  timestamp,
  jsonb,
  boolean,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./users";
import { nodes } from "./content";
import { attemptStatusEnum, challengeCadenceEnum } from "./enums";

export const projects = pgTable(
  "projects",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    nodeId: uuid("node_id").references(() => nodes.id, { onDelete: "set null" }),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    description: text("description").notNull(),
    starterFiles: jsonb("starter_files")
      .notNull()
      .$type<Record<string, string>>(),
    solutionFiles: jsonb("solution_files").$type<Record<string, string>>(),
    testSpec: jsonb("test_spec").$type<Record<string, unknown>>(),
    xpReward: integer("xp_reward").notNull().default(100),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [index("projects_node_id_idx").on(table.nodeId)],
);

export const userProjects = pgTable(
  "user_projects",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    projectId: uuid("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    files: jsonb("files").notNull().$type<Record<string, string>>(),
    status: attemptStatusEnum("status").notNull().default("in_progress"),
    isShared: boolean("is_shared").notNull().default(false),
    repositoryUrl: text("repository_url"),
    lastSavedAt: timestamp("last_saved_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    completedAt: timestamp("completed_at", { withTimezone: true }),
  },
  (table) => [
    index("user_projects_user_id_idx").on(table.userId),
    index("user_projects_project_id_idx").on(table.projectId),
  ],
);

export const repositories = pgTable(
  "repositories",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    description: text("description"),
    isPublic: boolean("is_public").notNull().default(false),
    files: jsonb("files").notNull().$type<Record<string, string>>(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [index("repositories_user_id_idx").on(table.userId)],
);

export const bossBattles = pgTable(
  "boss_battles",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    nodeId: uuid("node_id")
      .notNull()
      .references(() => nodes.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    tagline: text("tagline"),
    icon: text("icon").notNull().default("Skull"),
    stages: jsonb("stages")
      .notNull()
      .$type<Array<{ title: string; lessonType: string; content: Record<string, unknown> }>>(),
    timeLimitSeconds: integer("time_limit_seconds"),
    xpReward: integer("xp_reward").notNull().default(250),
    gemReward: integer("gem_reward").notNull().default(10),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [index("boss_battles_node_id_idx").on(table.nodeId)],
);

export const bossBattleAttempts = pgTable(
  "boss_battle_attempts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    bossBattleId: uuid("boss_battle_id")
      .notNull()
      .references(() => bossBattles.id, { onDelete: "cascade" }),
    status: attemptStatusEnum("status").notNull().default("in_progress"),
    stagesCleared: integer("stages_cleared").notNull().default(0),
    startedAt: timestamp("started_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    completedAt: timestamp("completed_at", { withTimezone: true }),
  },
  (table) => [index("boss_battle_attempts_user_id_idx").on(table.userId)],
);

export const challenges = pgTable(
  "challenges",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    cadence: challengeCadenceEnum("cadence").notNull(),
    title: text("title").notNull(),
    description: text("description").notNull(),
    lessonType: text("lesson_type").notNull(),
    content: jsonb("content").notNull().$type<Record<string, unknown>>(),
    xpReward: integer("xp_reward").notNull().default(50),
    coinReward: integer("coin_reward").notNull().default(15),
    gemReward: integer("gem_reward").notNull().default(0),
    startsAt: timestamp("starts_at", { withTimezone: true }).notNull(),
    endsAt: timestamp("ends_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("challenges_cadence_idx").on(table.cadence),
    index("challenges_starts_at_idx").on(table.startsAt),
  ],
);

export const challengeAttempts = pgTable(
  "challenge_attempts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    challengeId: uuid("challenge_id")
      .notNull()
      .references(() => challenges.id, { onDelete: "cascade" }),
    status: attemptStatusEnum("status").notNull().default("in_progress"),
    scorePct: integer("score_pct"),
    completedAt: timestamp("completed_at", { withTimezone: true }),
  },
  (table) => [
    index("challenge_attempts_user_id_idx").on(table.userId),
    index("challenge_attempts_challenge_id_idx").on(table.challengeId),
  ],
);

export const projectsRelations = relations(projects, ({ many, one }) => ({
  node: one(nodes, { fields: [projects.nodeId], references: [nodes.id] }),
  userProjects: many(userProjects),
}));

export const bossBattlesRelations = relations(bossBattles, ({ one, many }) => ({
  node: one(nodes, { fields: [bossBattles.nodeId], references: [nodes.id] }),
  attempts: many(bossBattleAttempts),
}));
