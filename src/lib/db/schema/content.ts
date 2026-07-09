import {
  pgTable,
  uuid,
  text,
  integer,
  boolean,
  timestamp,
  jsonb,
  index,
  uniqueIndex,
  real,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./users";
import { lessonTypeEnum, nodeKindEnum, attemptStatusEnum } from "./enums";

export const worlds = pgTable(
  "worlds",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: text("slug").notNull(),
    order: integer("order").notNull(),
    title: text("title").notNull(),
    subtitle: text("subtitle"),
    description: text("description").notNull(),
    icon: text("icon").notNull(), // lucide icon name
    colorFrom: text("color_from").notNull().default("#FF7A1A"),
    colorTo: text("color_to").notNull().default("#FFC857"),
    isPublished: boolean("is_published").notNull().default(false),
    requiredWorldId: uuid("required_world_id"),
    estimatedHours: integer("estimated_hours").notNull().default(6),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("worlds_slug_idx").on(table.slug),
    index("worlds_order_idx").on(table.order),
  ],
);

/** A module groups a world's nodes into a themed unit (e.g. "Branching & Merging"). */
export const modules = pgTable(
  "modules",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    worldId: uuid("world_id")
      .notNull()
      .references(() => worlds.id, { onDelete: "cascade" }),
    order: integer("order").notNull(),
    title: text("title").notNull(),
    description: text("description"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [index("modules_world_id_idx").on(table.worldId)],
);

/** A node is one dot on the learning map: lesson, quiz, project, boss battle, treasure... */
export const nodes = pgTable(
  "nodes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    moduleId: uuid("module_id")
      .notNull()
      .references(() => modules.id, { onDelete: "cascade" }),
    worldId: uuid("world_id")
      .notNull()
      .references(() => worlds.id, { onDelete: "cascade" }),
    order: integer("order").notNull(),
    kind: nodeKindEnum("kind").notNull().default("lesson"),
    title: text("title").notNull(),
    summary: text("summary"),
    icon: text("icon").notNull().default("BookOpen"),
    isSecret: boolean("is_secret").notNull().default(false),
    isBranch: boolean("is_branch").notNull().default(false),
    branchParentId: uuid("branch_parent_id"),
    xpReward: integer("xp_reward").notNull().default(20),
    coinReward: integer("coin_reward").notNull().default(5),
    gemReward: integer("gem_reward").notNull().default(0),
    requiredNodeIds: jsonb("required_node_ids").$type<string[]>().default([]),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("nodes_module_id_idx").on(table.moduleId),
    index("nodes_world_id_idx").on(table.worldId),
    index("nodes_order_idx").on(table.order),
  ],
);

/** One node can contain several lesson "screens" (e.g. teach -> practice -> quiz). */
export const lessons = pgTable(
  "lessons",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    nodeId: uuid("node_id")
      .notNull()
      .references(() => nodes.id, { onDelete: "cascade" }),
    order: integer("order").notNull(),
    type: lessonTypeEnum("type").notNull(),
    title: text("title").notNull(),
    instructions: text("instructions").notNull(),
    /** Type-specific payload: options, starter code, expected diff, terminal script, etc. */
    content: jsonb("content").notNull().$type<Record<string, unknown>>(),
    hint: text("hint"),
    solution: jsonb("solution").$type<Record<string, unknown>>(),
    estimatedSeconds: integer("estimated_seconds").notNull().default(60),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("lessons_node_id_idx").on(table.nodeId),
    index("lessons_type_idx").on(table.type),
  ],
);

export const questions = pgTable(
  "questions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    lessonId: uuid("lesson_id")
      .notNull()
      .references(() => lessons.id, { onDelete: "cascade" }),
    order: integer("order").notNull(),
    prompt: text("prompt").notNull(),
    explanation: text("explanation"),
    points: integer("points").notNull().default(10),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [index("questions_lesson_id_idx").on(table.lessonId)],
);

export const answers = pgTable(
  "answers",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    questionId: uuid("question_id")
      .notNull()
      .references(() => questions.id, { onDelete: "cascade" }),
    order: integer("order").notNull(),
    label: text("label").notNull(),
    isCorrect: boolean("is_correct").notNull().default(false),
  },
  (table) => [index("answers_question_id_idx").on(table.questionId)],
);

/** Per-user progress on a node (aggregated across its lessons). */
export const userNodeProgress = pgTable(
  "user_node_progress",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    nodeId: uuid("node_id")
      .notNull()
      .references(() => nodes.id, { onDelete: "cascade" }),
    status: attemptStatusEnum("status").notNull().default("in_progress"),
    bestScorePct: real("best_score_pct").notNull().default(0),
    attemptsCount: integer("attempts_count").notNull().default(0),
    masteredAt: timestamp("mastered_at", { withTimezone: true }),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("user_node_progress_user_node_idx").on(
      table.userId,
      table.nodeId,
    ),
    index("user_node_progress_user_id_idx").on(table.userId),
  ],
);

/** Every individual lesson attempt, for analytics + weak-area detection by the AI mentor. */
export const lessonAttempts = pgTable(
  "lesson_attempts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    lessonId: uuid("lesson_id")
      .notNull()
      .references(() => lessons.id, { onDelete: "cascade" }),
    status: attemptStatusEnum("status").notNull().default("in_progress"),
    scorePct: real("score_pct"),
    timeSpentSeconds: integer("time_spent_seconds"),
    submittedAnswer: jsonb("submitted_answer").$type<Record<string, unknown>>(),
    hintsUsed: integer("hints_used").notNull().default(0),
    startedAt: timestamp("started_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    completedAt: timestamp("completed_at", { withTimezone: true }),
  },
  (table) => [
    index("lesson_attempts_user_id_idx").on(table.userId),
    index("lesson_attempts_lesson_id_idx").on(table.lessonId),
  ],
);

export const worldsRelations = relations(worlds, ({ many }) => ({
  modules: many(modules),
  nodes: many(nodes),
}));

export const modulesRelations = relations(modules, ({ one, many }) => ({
  world: one(worlds, { fields: [modules.worldId], references: [worlds.id] }),
  nodes: many(nodes),
}));

export const nodesRelations = relations(nodes, ({ one, many }) => ({
  module: one(modules, { fields: [nodes.moduleId], references: [modules.id] }),
  world: one(worlds, { fields: [nodes.worldId], references: [worlds.id] }),
  lessons: many(lessons),
  progress: many(userNodeProgress),
}));

export const lessonsRelations = relations(lessons, ({ one, many }) => ({
  node: one(nodes, { fields: [lessons.nodeId], references: [nodes.id] }),
  questions: many(questions),
  attempts: many(lessonAttempts),
}));

export const questionsRelations = relations(questions, ({ one, many }) => ({
  lesson: one(lessons, {
    fields: [questions.lessonId],
    references: [lessons.id],
  }),
  answers: many(answers),
}));

export const answersRelations = relations(answers, ({ one }) => ({
  question: one(questions, {
    fields: [answers.questionId],
    references: [questions.id],
  }),
}));
