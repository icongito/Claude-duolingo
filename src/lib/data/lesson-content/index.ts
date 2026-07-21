import type { LessonBlueprint } from "./types";
import { CLAUDE_BASICS_LESSONS } from "./claude-basics";
import { PROMPT_ENGINEERING_LESSONS } from "./prompt-engineering";
import { CLAUDE_CODE_LESSONS } from "./claude-code";
import { GIT_LESSONS } from "./git";
import { GITHUB_LESSONS, TERMINAL_LESSONS } from "./github-terminal";
import {
  REACT_LESSONS,
  NEXTJS_LESSONS,
  JAVASCRIPT_LESSONS,
  TYPESCRIPT_LESSONS,
} from "./web";
import {
  LINUX_LESSONS,
  VSCODE_LESSONS,
  NODEJS_LESSONS,
  APIS_LESSONS,
  SQL_LESSONS,
  POSTGRESQL_LESSONS,
  SUPABASE_LESSONS,
  AUTHENTICATION_LESSONS,
} from "./backend";
import {
  MCP_LESSONS,
  AI_AGENTS_LESSONS,
  AUTOMATION_LESSONS,
  TESTING_LESSONS,
  DEPLOYMENT_LESSONS,
  SCALING_LESSONS,
  STARTUP_ENGINEERING_LESSONS,
} from "./advanced";

/** Every world's hand-written lesson bank, keyed by world slug. */
export const WORLD_LESSON_BANKS: Record<string, LessonBlueprint[]> = {
  "claude-basics": CLAUDE_BASICS_LESSONS,
  "prompt-engineering": PROMPT_ENGINEERING_LESSONS,
  "claude-code": CLAUDE_CODE_LESSONS,
  git: GIT_LESSONS,
  github: GITHUB_LESSONS,
  terminal: TERMINAL_LESSONS,
  linux: LINUX_LESSONS,
  vscode: VSCODE_LESSONS,
  react: REACT_LESSONS,
  nextjs: NEXTJS_LESSONS,
  javascript: JAVASCRIPT_LESSONS,
  typescript: TYPESCRIPT_LESSONS,
  nodejs: NODEJS_LESSONS,
  apis: APIS_LESSONS,
  sql: SQL_LESSONS,
  postgresql: POSTGRESQL_LESSONS,
  supabase: SUPABASE_LESSONS,
  authentication: AUTHENTICATION_LESSONS,
  mcp: MCP_LESSONS,
  "ai-agents": AI_AGENTS_LESSONS,
  automation: AUTOMATION_LESSONS,
  testing: TESTING_LESSONS,
  deployment: DEPLOYMENT_LESSONS,
  scaling: SCALING_LESSONS,
  "startup-engineering": STARTUP_ENGINEERING_LESSONS,
};

export type { LessonBlueprint } from "./types";
