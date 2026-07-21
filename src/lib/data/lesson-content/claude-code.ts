import type { LessonBlueprint } from "./types";

/**
 * World 3: Claude Code. Position 2 is the Subagents lesson so that node
 * claude-code-8 (the demo user's "current" node, 8 % 6 = 2) lands on it —
 * the dashboard links straight there.
 */
export const CLAUDE_CODE_LESSONS: LessonBlueprint[] = [
  {
    title: "Your Agentic Terminal",
    steps: [
      {
        type: "flashcard",
        cards: [
          {
            front: "What is Claude Code?",
            back: "Anthropic's agentic coding tool: Claude running in your terminal (or IDE) with tools to read files, edit code, and run commands in your repo.",
          },
          {
            front: "How is it different from a chat window?",
            back: "It acts, not just answers — it can search your codebase, make edits across files, run your tests, and iterate on the results.",
          },
        ],
      },
      {
        type: "multiple_choice",
        prompt: "Which task plays to Claude Code's strengths the most?",
        options: [
          "Asking what year Python was released",
          "'Find every caller of parseConfig and update them to the new signature, then run the tests'",
          "Writing a poem about tabs vs spaces",
          "Solving a riddle",
        ],
        correctIndex: 1,
        explanation:
          "Multi-file work with a feedback loop (run the tests!) is exactly what an agent with repo access does better than a copy-paste chat.",
      },
      {
        type: "fill_blank",
        prompt: "Complete the sentence about verification.",
        sentence: "After Claude Code edits your files, the changes are verified by ___ the project's own tests and linters.",
        options: ["ignoring", "running", "deleting", "rewriting"],
        correctIndex: 1,
        explanation:
          "The agent loop is edit → run → read failures → fix. Your test suite is its ground truth.",
      },
      {
        type: "matching",
        prompt: "Match each Claude Code capability to what it's for.",
        pairs: [
          { left: "File search", right: "Finding where something is defined or used" },
          { left: "Edit tool", right: "Making precise changes to files" },
          { left: "Bash tool", right: "Running tests, builds, and git commands" },
          { left: "Permission prompt", right: "You approving risky actions first" },
        ],
      },
      {
        type: "typing",
        prompt: "A coding assistant that takes actions with tools, not just answers, is called an ___. (one word)",
        answer: "agent",
        placeholder: "type your answer…",
        explanation: "Agent — it plans, acts with tools, observes results, and iterates.",
      },
    ],
  },
  {
    title: "CLAUDE.md & Project Memory",
    steps: [
      {
        type: "flashcard",
        cards: [
          {
            front: "What is CLAUDE.md?",
            back: "A markdown file in your repo that Claude Code reads at the start of every session — project conventions, commands, and gotchas live there.",
          },
          {
            front: "What belongs in it?",
            back: "The commands to build/test/lint, architecture notes, naming conventions, and anything you're tired of re-explaining every session.",
          },
        ],
      },
      {
        type: "multiple_choice",
        prompt: "Claude keeps using npm in your pnpm-only repo, session after session. The durable fix?",
        options: [
          "Correct it manually every session",
          "Add 'Package manager is pnpm — never use npm' to CLAUDE.md",
          "Uninstall npm from your machine",
          "Rename the lockfile",
        ],
        correctIndex: 1,
        explanation:
          "CLAUDE.md is persistent memory. One line there fixes every future session; a chat correction fixes only today's.",
      },
      {
        type: "fill_blank",
        prompt: "Complete the rule of thumb.",
        sentence: "If you've explained the same project rule ___ times in chat, it belongs in CLAUDE.md.",
        options: ["zero", "two", "twenty", "a hundred"],
        correctIndex: 1,
        explanation: "Twice is a pattern. Write it down once and every future session starts smarter.",
      },
      {
        type: "sorting",
        prompt: "Order a great CLAUDE.md from top to bottom.",
        correctOrder: [
          "One-paragraph project overview",
          "Commands: dev, build, test, lint",
          "Architecture and where things live",
          "Conventions and sharp edges",
        ],
      },
      {
        type: "typing",
        prompt: "The repo file Claude Code reads for project instructions is CLAUDE.___ (file extension, two letters)",
        answer: "md",
        placeholder: "type your answer…",
        explanation: "CLAUDE.md — markdown, checked into the repo, read every session.",
      },
    ],
  },
  {
    title: "Subagents & Parallel Work",
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
        sentence: "A subagent starts with a ___ context — it does not inherit the main conversation's history.",
        options: ["shared", "fresh", "compressed", "cached"],
        correctIndex: 1,
        explanation: "Subagents start fresh. Anything they need to know must be included in their task prompt.",
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
        prompt: "You need to rename a function used in ~40 files and also write a changelog entry. What's a sensible split?",
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
        prompt: "What do you call the pattern where several subagents work on independent tasks at the same time? (one word)",
        answer: "parallelism",
        placeholder: "type your answer…",
        explanation: "Parallelism — independent tasks running simultaneously — is the main speed win from subagents.",
      },
    ],
  },
  {
    title: "Plan Mode: Think Before You Edit",
    steps: [
      {
        type: "flashcard",
        cards: [
          {
            front: "What is plan mode?",
            back: "A read-only mode where Claude explores the codebase and proposes an approach — no files change until you approve the plan.",
          },
          {
            front: "When is it worth the extra step?",
            back: "Big refactors, unfamiliar codebases, anything touching many files — when a wrong first move is expensive to unwind.",
          },
        ],
      },
      {
        type: "multiple_choice",
        prompt: "Which task most deserves plan mode first?",
        options: [
          "Fixing a typo in a comment",
          "Renaming one local variable",
          "Migrating the whole app from REST calls to a shared API client",
          "Adding a console.log",
        ],
        correctIndex: 2,
        explanation:
          "A migration touches everything. Reviewing the approach before any edit is far cheaper than reviewing a 40-file diff you don't agree with.",
      },
      {
        type: "fill_blank",
        prompt: "Complete the sentence about plan mode.",
        sentence: "In plan mode, Claude can read anything but can change ___.",
        options: ["everything", "nothing", "one file", "only tests"],
        correctIndex: 1,
        explanation: "Read-only by design: explore, propose, and only edit after you approve.",
      },
      {
        type: "sorting",
        prompt: "Order the plan-mode workflow.",
        correctOrder: [
          "Describe the goal and enter plan mode",
          "Claude explores the code and drafts a plan",
          "You review and adjust the plan",
          "Approve, and Claude executes it with edits",
        ],
      },
      {
        type: "typing",
        prompt: "The read-only mode where Claude proposes before editing is called ___ mode. (one word)",
        answer: "plan",
        placeholder: "type your answer…",
        explanation: "Plan mode — measure twice, cut once.",
      },
    ],
  },
  {
    title: "Permissions & Safe Autonomy",
    steps: [
      {
        type: "multiple_choice",
        prompt: "Why does Claude Code ask permission before running some commands?",
        options: [
          "To slow you down on purpose",
          "Because destructive or irreversible actions deserve a human decision",
          "Because it can't run commands at all",
          "Only as a legal formality",
        ],
        correctIndex: 1,
        explanation:
          "Reading a file is reversible; `rm -rf` and `git push --force` are not. The permission gate puts humans on exactly the risky calls.",
      },
      {
        type: "matching",
        prompt: "Match the action to the sensible permission posture.",
        pairs: [
          { left: "Reading source files", right: "Always allowed" },
          { left: "Running the test suite", right: "Usually allowed" },
          { left: "Deleting files", right: "Ask first" },
          { left: "Force-pushing to main", right: "Ask first, then think again" },
        ],
      },
      {
        type: "fill_blank",
        prompt: "Complete the principle.",
        sentence: "Grant standing permissions for ___ actions; keep approvals for destructive ones.",
        options: ["all", "read-only", "random", "slow"],
        correctIndex: 1,
        explanation:
          "Read-only actions can't hurt you — auto-approving them removes friction without removing safety.",
      },
      {
        type: "multiple_choice",
        prompt: "Claude proposes `git reset --hard` while you have uncommitted work. What should happen first?",
        options: [
          "Run it — Claude knows best",
          "Stash or commit your work, because reset --hard destroys uncommitted changes",
          "Close the terminal",
          "Run it twice to be sure",
        ],
        correctIndex: 1,
        explanation:
          "`reset --hard` erases uncommitted work irrecoverably. Safety first: stash or commit, then reset.",
      },
      {
        type: "typing",
        prompt: "Actions that can't be undone are called ___. (one word)",
        answer: "irreversible",
        placeholder: "type your answer…",
        explanation: "Irreversible actions are exactly where the permission prompt earns its keep.",
      },
    ],
  },
  {
    title: "Hooks & Custom Automation",
    steps: [
      {
        type: "flashcard",
        cards: [
          {
            front: "What is a hook in Claude Code?",
            back: "A shell command that runs automatically at lifecycle points — like after every file edit or before the session ends.",
          },
          {
            front: "Classic hook example?",
            back: "Run the formatter after every edit, so Claude's changes always land already formatted.",
          },
        ],
      },
      {
        type: "multiple_choice",
        prompt: "Your team wants every Claude edit auto-formatted with Prettier. The right mechanism?",
        options: [
          "Ask Claude nicely each session",
          "A post-edit hook that runs Prettier on changed files",
          "A weekly cleanup commit",
          "Formatting by hand",
        ],
        correctIndex: 1,
        explanation:
          "Hooks are enforcement, not requests. The formatter runs every time, whether anyone remembers or not.",
      },
      {
        type: "fill_blank",
        prompt: "Complete the comparison.",
        sentence: "CLAUDE.md is advice the model reads; a hook is automation that ___ regardless.",
        options: ["asks", "runs", "sleeps", "waits"],
        correctIndex: 1,
        explanation:
          "Instructions can be missed; hooks execute. Use hooks when 'always' really means always.",
      },
      {
        type: "matching",
        prompt: "Match the need to the right mechanism.",
        pairs: [
          { left: "'Prefer named exports'", right: "CLAUDE.md convention" },
          { left: "'Format after every edit'", right: "Hook" },
          { left: "'Our test command is pnpm test'", right: "CLAUDE.md commands section" },
          { left: "'Block commits that fail lint'", right: "Hook" },
        ],
      },
      {
        type: "typing",
        prompt: "A command that fires automatically at a lifecycle event is called a ___. (one word)",
        answer: "hook",
        placeholder: "type your answer…",
        explanation: "Hooks turn 'please remember to' into 'happens every time'.",
      },
    ],
  },
];
