/**
 * Lesson step content model + the demo lesson bank.
 *
 * A "node" on the map opens a lesson session composed of several steps of
 * mixed types. Steps are discriminated unions so each lesson-type component
 * gets fully-typed content.
 */

export type MultipleChoiceStep = {
  type: "multiple_choice";
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

export type FillBlankStep = {
  type: "fill_blank";
  prompt: string;
  /** Sentence with `___` marking the blank. */
  sentence: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

export type TypingStep = {
  type: "typing";
  prompt: string;
  /** Exact expected answer (case-insensitive, trimmed). */
  answer: string;
  placeholder: string;
  explanation: string;
};

export type MatchingStep = {
  type: "matching";
  prompt: string;
  pairs: Array<{ left: string; right: string }>;
};

export type FlashcardStep = {
  type: "flashcard";
  cards: Array<{ front: string; back: string }>;
};

export type CodeStep = {
  type: "code";
  prompt: string;
  language: string;
  starterCode: string;
  /** Substrings that must appear in the submission for it to pass. */
  mustInclude: string[];
  hint: string;
  explanation: string;
};

export type SortingStep = {
  type: "sorting";
  prompt: string;
  /** Items given in correct order; the player sees them shuffled. */
  correctOrder: string[];
};

export type LessonStep =
  | MultipleChoiceStep
  | FillBlankStep
  | TypingStep
  | MatchingStep
  | FlashcardStep
  | CodeStep
  | SortingStep;

export type LessonSession = {
  nodeId: string;
  worldSlug: string;
  title: string;
  xpReward: number;
  steps: LessonStep[];
};

/** World 3 (Claude Code), node 8 — the demo user's "current" node. */
const CLAUDE_CODE_SUBAGENTS: LessonSession = {
  nodeId: "claude-code-8",
  worldSlug: "claude-code",
  title: "Subagents & Parallel Work",
  xpReward: 20,
  steps: [
    {
      type: "flashcard",
      cards: [
        {
          front: "What is a subagent in Claude Code?",
          back: "A separate Claude instance spawned to handle a scoped task — like searching a codebase or drafting a plan — that reports its result back to the main agent.",
        },
        {
          front: "Why use subagents instead of one long conversation?",
          back: "Each subagent gets a fresh context window for its task, keeping the main conversation focused and letting independent work run in parallel.",
        },
      ],
    },
    {
      type: "multiple_choice",
      prompt: "When is spawning a subagent most useful?",
      options: [
        "For every single file edit",
        "For a scoped, self-contained task like a broad codebase search",
        "Only when the main agent runs out of tokens",
        "Never — subagents are slower in all cases",
      ],
      correctIndex: 1,
      explanation:
        "Subagents shine on scoped, parallelizable tasks. Using them for every tiny edit adds overhead — each one starts cold with no shared context.",
    },
    {
      type: "fill_blank",
      prompt: "Complete the sentence about subagent context.",
      sentence:
        "A subagent starts with a ___ context — it does not inherit the main conversation's history.",
      options: ["shared", "fresh", "compressed", "cached"],
      correctIndex: 1,
      explanation:
        "Subagents start fresh. Anything they need to know must be included in their task prompt.",
    },
    {
      type: "matching",
      prompt: "Match each agent concept to its description.",
      pairs: [
        { left: "Subagent", right: "Scoped worker with its own context" },
        { left: "Task prompt", right: "The instructions a subagent receives" },
        { left: "Parallelism", right: "Multiple agents working simultaneously" },
        { left: "Report", right: "The result returned to the main agent" },
      ],
    },
    {
      type: "multiple_choice",
      prompt:
        "You need to rename a function used in ~40 files and also write a changelog entry. What's a sensible split?",
      options: [
        "One subagent per file — 41 subagents",
        "Do everything in the main conversation sequentially",
        "One subagent for the mechanical rename, main agent writes the changelog",
        "One subagent for the changelog only, rename by hand",
      ],
      correctIndex: 2,
      explanation:
        "The rename is mechanical and self-contained — perfect for a subagent. The changelog needs judgment about the change's intent, which the main agent has context for.",
    },
    {
      type: "typing",
      prompt:
        "What do you call the pattern where several subagents work on independent tasks at the same time? (one word)",
      answer: "parallelism",
      placeholder: "type your answer…",
      explanation:
        "Parallelism — independent tasks running simultaneously — is the main speed win from subagents.",
    },
  ],
};

/** World 1 (Claude Basics), node 0 — first lesson for brand-new players. */
const CLAUDE_BASICS_INTRO: LessonSession = {
  nodeId: "claude-basics-0",
  worldSlug: "claude-basics",
  title: "Meet Claude",
  xpReward: 20,
  steps: [
    {
      type: "flashcard",
      cards: [
        {
          front: "What is Claude?",
          back: "An AI assistant made by Anthropic that can reason, write, code, and use tools through natural conversation.",
        },
        {
          front: "What is a prompt?",
          back: "The message you send to Claude. Clear, specific prompts with context get dramatically better answers.",
        },
      ],
    },
    {
      type: "multiple_choice",
      prompt: "Which prompt will get the most useful response?",
      options: [
        "\"fix my code\"",
        "\"Why doesn't this work?\"",
        "\"This Python function should return the largest number in a list but returns the smallest. Here's the code: … What's wrong?\"",
        "\"help\"",
      ],
      correctIndex: 2,
      explanation:
        "Specific context — what the code should do, what it actually does, and the code itself — gives Claude everything needed for a precise answer.",
    },
    {
      type: "fill_blank",
      prompt: "Complete the golden rule of prompting.",
      sentence:
        "The more relevant ___ you give Claude, the better its answer will be.",
      options: ["emojis", "context", "politeness", "keywords"],
      correctIndex: 1,
      explanation:
        "Context is king: goals, constraints, examples, and error messages all sharpen the response.",
    },
    {
      type: "sorting",
      prompt: "Order the steps of a productive Claude conversation.",
      correctOrder: [
        "Describe your goal and constraints",
        "Share relevant code or context",
        "Review Claude's response",
        "Ask follow-ups to refine the result",
      ],
    },
    {
      type: "typing",
      prompt: "What company makes Claude? (one word)",
      answer: "anthropic",
      placeholder: "type your answer…",
      explanation: "Claude is made by Anthropic.",
    },
  ],
};

/** Git world sample — used when opening git nodes in the demo. */
const GIT_BRANCHING: LessonSession = {
  nodeId: "git-0",
  worldSlug: "git",
  title: "Branching Basics",
  xpReward: 20,
  steps: [
    {
      type: "multiple_choice",
      prompt: "What does `git branch feature-x` do?",
      options: [
        "Creates a branch and switches to it",
        "Creates a branch but stays on the current one",
        "Deletes the branch feature-x",
        "Merges feature-x into main",
      ],
      correctIndex: 1,
      explanation:
        "`git branch <name>` only creates the branch. Use `git switch <name>` (or `git checkout -b` to create and switch in one step).",
    },
    {
      type: "typing",
      prompt:
        "Type the command that creates a branch called `login` AND switches to it (use the modern `switch` syntax).",
      answer: "git switch -c login",
      placeholder: "git …",
      explanation:
        "`git switch -c <name>` creates and switches in one step — the modern equivalent of `git checkout -b`.",
    },
    {
      type: "matching",
      prompt: "Match each git command to what it does.",
      pairs: [
        { left: "git switch -c x", right: "Create branch x and switch to it" },
        { left: "git merge x", right: "Bring x's commits into the current branch" },
        { left: "git branch -d x", right: "Delete branch x (if merged)" },
        { left: "git log --oneline", right: "Compact commit history" },
      ],
    },
    {
      type: "code",
      prompt:
        "You're on `main`. Write the sequence of commands to create a branch `fix-header`, then (pretend you committed) merge it back into main. One command per line.",
      language: "shell",
      starterCode: "# your commands here\n",
      mustInclude: ["git switch -c fix-header", "git switch main", "git merge fix-header"],
      hint: "Create+switch, switch back to main, then merge.",
      explanation:
        "Create the branch, do your work, switch back to main, and merge. This is the core loop of feature-branch workflows.",
    },
  ],
};

const LESSON_BANK: Record<string, LessonSession> = {
  [CLAUDE_CODE_SUBAGENTS.nodeId]: CLAUDE_CODE_SUBAGENTS,
  [CLAUDE_BASICS_INTRO.nodeId]: CLAUDE_BASICS_INTRO,
  [GIT_BRANCHING.nodeId]: GIT_BRANCHING,
};

/**
 * Generic fallback so every node on every map is playable in the demo:
 * reuses the world-appropriate sample, re-keyed to the requested node.
 */
export function getLessonSession(nodeId: string): LessonSession | null {
  if (LESSON_BANK[nodeId]) return LESSON_BANK[nodeId];

  const worldSlug = nodeId.replace(/-(secret-)?\d+$/, "");
  const fallback =
    Object.values(LESSON_BANK).find((l) => l.worldSlug === worldSlug) ??
    CLAUDE_BASICS_INTRO;

  return { ...fallback, nodeId };
}
