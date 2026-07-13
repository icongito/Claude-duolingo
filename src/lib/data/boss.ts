/**
 * Boss battles — the multi-stage gauntlet at the end of every world.
 *
 * A boss re-tests the whole world's material in three themed stages under a
 * single time limit, with one pool of hearts across all stages. Beating it
 * completes the world and pays the biggest single reward in the game.
 * Mirrors the `boss_battles` table shape in src/lib/db/schema/projects.ts.
 */

import { WORLDS, type WorldDefinition } from "@/lib/gamification/worlds";
import { getLessonSession, type LessonStep } from "@/lib/data/lessons";
import { DEMO_USER } from "@/lib/data/demo-user";

export type BossStage = {
  title: string;
  intro: string;
  steps: LessonStep[];
  /** "project" stages end in a simulated GitHub publish instead of the next
   * attack; "prompt" stages are a single write-your-own-prompt attack graded
   * for variable damage instead of a fixed hit. */
  kind?: "combat" | "project" | "prompt";
  /** Present only when kind === "prompt". */
  promptAttack?: PromptAttack;
};

/** One quality a written prompt can demonstrate. Contributes its own share
 * of damage when present — there's no picking from options, and no
 * all-or-nothing pass/fail either, just power in, damage out. */
export type PromptCriterion = {
  needle: string;
  power: number;
  label: string;
};

/** The boss's opening attack: no multiple choice, no options to lean on —
 * the player writes the actual prompt and it's judged on power. */
export type PromptAttack = {
  scenario: string;
  placeholder: string;
  criteria: PromptCriterion[];
  /** Sum of every criterion's power — the most damage this attack can deal. */
  maxDamage: number;
};

/** Pure grading function: scores a written prompt against its criteria and
 * returns exactly how much damage it deals. */
export function evaluatePromptPower(
  text: string,
  criteria: PromptCriterion[],
): { damage: number; met: PromptCriterion[]; missed: PromptCriterion[] } {
  const normalized = text.toLowerCase().replace(/\s+/g, " ");
  const met: PromptCriterion[] = [];
  const missed: PromptCriterion[] = [];
  for (const c of criteria) {
    if (normalized.includes(c.needle.toLowerCase())) met.push(c);
    else missed.push(c);
  }
  return { damage: met.reduce((n, c) => n + c.power, 0), met, missed };
}

export type ProjectSize = "small" | "big";

/** One graded requirement: a substring the submission must contain, and the
 * critique shown when it's missing. Grading is exact — there's no partial
 * credit and no hand-holding template to fill in. */
export type ProjectRequirement = {
  needle: string;
  critique: string;
};

/** The brief for the boss's project: a blank slate, not a fill-in-the-blank. */
export type ProjectBrief = {
  prompt: string;
  language: string;
  starterCode: string;
  requirements: ProjectRequirement[];
  hint: string;
  /** Shown, verbatim, only when every requirement passes. */
  passVerdict: string;
};

/** The boss's finale: a project the player ships and "publishes" to GitHub. */
export type BossProject = {
  size: ProjectSize;
  repoOwner: string;
  repoName: string;
  commitSha: string;
  filesChanged: number;
  brief: ProjectBrief;
};

/** Pure grading function: returns the requirements the submission fails. */
export function evaluateProject(
  code: string,
  requirements: ProjectRequirement[],
): ProjectRequirement[] {
  const normalized = code.replace(/\s+/g, " ");
  return requirements.filter(
    (r) => !normalized.includes(r.needle.replace(/\s+/g, " ")),
  );
}

export type BossBattle = {
  nodeId: string;
  worldSlug: string;
  worldTitle: string;
  name: string;
  tagline: string;
  timeLimitSeconds: number;
  xpReward: number;
  gemReward: number;
  stages: BossStage[];
  project: BossProject;
};

/** Hand-named bosses; the rest fall back to the generated epithet. */
const BOSS_NAMES: Record<string, { name: string; tagline: string }> = {
  "claude-basics": {
    name: "The Hallucinator",
    tagline: "It answers with total confidence. It is completely wrong.",
  },
  "prompt-engineering": {
    name: "The Prompt Mangler",
    tagline: "Feeds on vague requests. Starve it with specificity.",
  },
  "claude-code": {
    name: "The Context Kraken",
    tagline: "Its tentacles are wrapped around your context window.",
  },
  git: {
    name: "The Merge Conflict",
    tagline: "Both branches claim the same line. Only one of you leaves.",
  },
  github: {
    name: "The Force Pusher",
    tagline: "It rewrote main at 5pm on a Friday.",
  },
  terminal: {
    name: "The rm -rf Wraith",
    tagline: "One flag away from oblivion.",
  },
  react: {
    name: "The Infinite Rerender",
    tagline: "It has no dependency array and no mercy.",
  },
  javascript: {
    name: "The Undefined",
    tagline: "It is not a function. It never was.",
  },
  typescript: {
    name: "The Any-thing",
    tagline: "It escaped the type system. Bring it back.",
  },
  sql: {
    name: "The Cartesian Explosion",
    tagline: "You forgot the JOIN condition. It didn't.",
  },
};

/**
 * The boss's opening attack: a hand-authored write-your-own-prompt scenario
 * per world. Worlds without a hand-authored spec fall back to a generic one.
 */
const PROMPT_ATTACK_SPECS: Record<string, PromptAttack> = {
  "claude-basics": {
    scenario:
      "The Hallucinator is mid-collapse over a one-line bug report — \"my code is broken, please fix it\" — and has already guessed two different broken causes, wrong both times. Write the prompt that actually gets it fixed, first try.",
    placeholder: "",
    criteria: [
      { needle: "expected", power: 1, label: "States what the code should do" },
      { needle: "actual", power: 1, label: "States what it's actually doing" },
      { needle: "```", power: 1, label: "Includes the code itself, not just a description" },
      { needle: "largest", power: 1, label: "Names the specific bug — the largest-number mixup" },
    ],
    maxDamage: 4,
  },
  "prompt-engineering": {
    scenario:
      "The Prompt Mangler only understands one shape of request — \"write me a blog post about {topic}\" — and gives wildly different results every time it runs. Write the prompt that locks it down for good.",
    placeholder: "",
    criteria: [
      { needle: "{topic}", power: 1, label: "Keeps a reusable {topic} placeholder" },
      { needle: "tone", power: 1, label: "Specifies a tone" },
      { needle: "audience", power: 1, label: "Names the audience" },
      { needle: "format", power: 1, label: "States the output format" },
    ],
    maxDamage: 4,
  },
  "claude-code": {
    scenario:
      "The Context Kraken is a subagent with zero memory of this conversation, about to rename oldName to newName across the whole repo, blind. Write the task prompt that keeps it from wrecking the codebase.",
    placeholder: "",
    criteria: [
      { needle: "goal", power: 1, label: "States the goal" },
      { needle: "scope", power: 1, label: "Defines the scope — which files" },
      { needle: "report", power: 1, label: "Says what to report back" },
      { needle: "oldname", power: 1, label: "Names the actual symbol being renamed" },
    ],
    maxDamage: 4,
  },
  git: {
    scenario:
      "The Merge Conflict has production broken on main and no patience for vague vibes. Write the prompt that spells out the exact fix — branch, commit, merge.",
    placeholder: "",
    criteria: [
      { needle: "branch", power: 1, label: "Mentions branching first" },
      { needle: "commit", power: 1, label: "Mentions committing the fix" },
      { needle: "main", power: 1, label: "Names main as the target" },
      { needle: "merge", power: 1, label: "Mentions merging it back" },
    ],
    maxDamage: 4,
  },
  react: {
    scenario:
      "The Infinite Rerender is stuck refetching the same user on every single render. Write the prompt that gets the fix — and the reason for it — in one shot.",
    placeholder: "",
    criteria: [
      { needle: "useeffect", power: 1, label: "Names useEffect specifically" },
      { needle: "dependency", power: 1, label: "Mentions the dependency array" },
      { needle: "userid", power: 1, label: "Names the value that should trigger a refetch" },
      { needle: "why", power: 1, label: "Asks for the reasoning, not just the fix" },
    ],
    maxDamage: 4,
  },
};

function fallbackPromptAttack(world: WorldDefinition): PromptAttack {
  const topic = world.title.toLowerCase();
  return {
    scenario: `Write a prompt that would actually get useful, specific help with ${world.title} — not just "explain ${world.title}."`,
    placeholder: "",
    criteria: [
      { needle: "goal", power: 1, label: "States a concrete goal" },
      { needle: "context", power: 1, label: "Gives real context, not just a topic name" },
      { needle: "example", power: 1, label: "Includes a concrete example" },
      { needle: topic, power: 1, label: `Names ${world.title} specifically` },
    ],
    maxDamage: 4,
  };
}

function buildPromptAttack(world: WorldDefinition): PromptAttack {
  return PROMPT_ATTACK_SPECS[world.slug] ?? fallbackPromptAttack(world);
}

/**
 * The "Ship It" finale: a hand-authored project brief per world. There is no
 * template to fill in — the starter is a blank file with a one-line pointer,
 * and every requirement is graded exactly, with a harsh critique on miss.
 * Worlds without a hand-authored spec fall back to a generic README project.
 */
type ProjectSpec = {
  repoName: string;
  brief: ProjectBrief;
};

const PROJECT_SPECS: Record<string, ProjectSpec> = {
  "claude-basics": {
    repoName: "claude-basics-starter",
    brief: {
      prompt:
        "Ship It: a teammate's bug report is one line — \"my code is broken, please fix it.\" Write the report Claude would actually need. From scratch.",
      language: "markdown",
      starterCode: "<!-- write the bug report here -->\n",
      requirements: [
        {
          needle: "Expected:",
          critique: "No Expected: line. Claude has no idea what \"working\" looks like — it's guessing at a target that doesn't exist on the page.",
        },
        {
          needle: "Actual:",
          critique: "No Actual: line. Without the real symptom, this isn't a bug report, it's a complaint.",
        },
        {
          needle: "```",
          critique: "No fenced code block. Claude is now debugging your prose instead of your code.",
        },
      ],
      hint: "Expected:, Actual:, and the code itself in a ``` block — that's the whole report.",
      passVerdict: "Ships. Expected, actual, code — nothing left for Claude to hallucinate.",
    },
  },
  "prompt-engineering": {
    repoName: "prompt-template-kit",
    brief: {
      prompt:
        "Ship It: a coworker keeps re-typing the same blog-post request every week and getting a different result each time. Build the reusable template that fixes it. From scratch.",
      language: "markdown",
      starterCode: "<!-- write the template here -->\n",
      requirements: [
        {
          needle: "{topic}",
          critique: "No {topic} placeholder. This is a one-off request wearing a template's clothes — it can't be reused.",
        },
        {
          needle: "Tone:",
          critique: "No Tone: field. Every run will read differently and nobody will know why.",
        },
        {
          needle: "Audience:",
          critique: "No Audience: field. Same words, wrong reader, wasted output.",
        },
        {
          needle: "Format:",
          critique: "No Format: field. You'll get a wall of prose when you needed bullet points, forever.",
        },
      ],
      hint: "A real template names its slot ({topic}) and locks Tone:, Audience:, and Format: above it.",
      passVerdict: "Ships. Same template, same shape, every single run.",
    },
  },
  "claude-code": {
    repoName: "subagent-rename-task",
    brief: {
      prompt:
        "Ship It: a subagent needs to rename `oldName` to `newName` across the repo. It has zero memory of this conversation. Write its entire task prompt. From scratch.",
      language: "markdown",
      starterCode: "<!-- write the subagent task prompt here -->\n",
      requirements: [
        {
          needle: "Goal:",
          critique: "No Goal:. The subagent doesn't know what \"done\" means and will either under- or over-deliver.",
        },
        {
          needle: "Scope:",
          critique: "No Scope:. It'll either miss files it should touch or rewrite files it shouldn't.",
        },
        {
          needle: "Report back:",
          critique: "No Report back:. You'll get a vague \"done!\" instead of what actually changed.",
        },
      ],
      hint: "State the Goal:, the Scope: (which files/dirs), and what to Report back: when finished.",
      passVerdict: "Ships. The subagent can run this without ever seeing this conversation.",
    },
  },
  git: {
    repoName: "hotfix-drill",
    brief: {
      prompt:
        "Ship It: production is broken. Branch, fix, commit, and merge the hotfix into main — the whole loop, every command. From scratch.",
      language: "shell",
      starterCode: "# write every command, in order\n",
      requirements: [
        {
          needle: "git switch -c hotfix",
          critique: "Never branched. You were about to commit the fix straight to main.",
        },
        { needle: "git add", critique: "Never staged the fix — there's nothing for a commit to pick up." },
        { needle: "git commit", critique: "Staged and stopped. The fix still isn't committed anywhere." },
        {
          needle: "git switch main",
          critique: "Never switched back. The merge you're about to run would go nowhere.",
        },
        {
          needle: "git merge hotfix",
          critique: "Never merged. The fix is sitting on a branch nobody deploys.",
        },
      ],
      hint: "Branch, stage, commit, switch back to main, merge — five commands, in that order.",
      passVerdict: "Ships. Branched, committed, merged — production is fixed.",
    },
  },
  github: {
    repoName: "open-pr-drill",
    brief: {
      prompt:
        "Ship It: push your branch so it's tracked upstream, then open the pull request without touching the browser. From scratch.",
      language: "shell",
      starterCode: "# write the commands\n",
      requirements: [
        {
          needle: "git push -u origin",
          critique: "No -u. Every future push on this branch will fail with \"no upstream branch\" until someone fixes it.",
        },
        {
          needle: "gh pr create",
          critique: "Pushed and stopped. Nobody knows there's a PR to review because there isn't one.",
        },
      ],
      hint: "Push with -u to set the upstream, then gh pr create to open it.",
      passVerdict: "Ships. Upstream tracked, PR open, no browser required.",
    },
  },
  terminal: {
    repoName: "port-cleanup-drill",
    brief: {
      prompt:
        "Ship It: something is squatting on port 3000 and your dev server won't start. Find it and kill it. From scratch.",
      language: "shell",
      starterCode: "# find it, then stop it\n",
      requirements: [
        {
          needle: "lsof -i :3000",
          critique: "Never looked. You'd be killing processes blind, hoping one of them is the squatter.",
        },
        { needle: "kill", critique: "Found it, then did nothing. The port is still held." },
      ],
      hint: "lsof -i :3000 finds the PID; kill <pid> ends it.",
      passVerdict: "Ships. Port's free, server starts.",
    },
  },
  react: {
    repoName: "use-effect-fix",
    brief: {
      prompt:
        "Ship It: a profile page refetches the user on every single render and the tab is on fire. Write the effect that only fetches when userId actually changes. From scratch.",
      language: "javascript",
      starterCode: "// write the fixed effect here\n",
      requirements: [
        {
          needle: "useEffect(",
          critique: "No useEffect at all — the fetch is still running in the render body, which is how you got here.",
        },
        {
          needle: "fetchUser(userId)",
          critique: "The effect exists but never actually fetches the user — nothing loads.",
        },
        {
          needle: "[userId]",
          critique: "No dependency array with userId. Either it reruns every render (no array) or never reruns when the id changes (empty array).",
        },
      ],
      hint: "useEffect(() => { fetchUser(userId); }, [userId]) — the array is the whole fix.",
      passVerdict: "Ships. Refetches only when userId changes. The tab stops smoking.",
    },
  },
  javascript: {
    repoName: "undefined-guard",
    brief: {
      prompt:
        "Ship It: getName(user) throws in production whenever profile is missing. Make it never crash, with a sane fallback. From scratch.",
      language: "javascript",
      starterCode: "// write the safe getName function here\n",
      requirements: [
        {
          needle: "?.",
          critique: "No optional chaining. One missing profile and this still throws in production.",
        },
        {
          needle: "??",
          critique: "No nullish coalescing. It won't crash, but callers get undefined instead of a real fallback.",
        },
      ],
      hint: "user?.profile?.name ?? 'Unknown' — chain through the maybe-missing parts, then fall back.",
      passVerdict: "Ships. Missing profile, missing user, doesn't matter — it never throws.",
    },
  },
  typescript: {
    repoName: "type-the-any",
    brief: {
      prompt:
        "Ship It: getTotal(items: any) shipped a typo (`.pric` instead of `.price`) straight to prod because any caught nothing. Give the items a real type. From scratch.",
      language: "typescript",
      starterCode: "// write the typed getTotal function here\n",
      requirements: [
        {
          needle: "interface",
          critique: "No interface. `any` is still `any` — the same typo ships again next week.",
        },
        {
          needle: "number",
          critique: "No number field on the type. A shape with no real fields is just any wearing a costume.",
        },
      ],
      hint: "Define an interface with at least a price: number field, and type items against it.",
      passVerdict: "Ships. The next typo is a compile error, not a production incident.",
    },
  },
  sql: {
    repoName: "join-fix-drill",
    brief: {
      prompt:
        "Ship It: SELECT * FROM orders, customers is joining every order with every customer. Write the query that only pairs the right ones. From scratch.",
      language: "sql",
      starterCode: "-- write the fixed query here\n",
      requirements: [
        {
          needle: "JOIN",
          critique: "No JOIN. This is still a comma join — a cartesian product waiting to happen again.",
        },
        {
          needle: "ON",
          critique: "JOIN with no ON. Without the condition, the database has no idea which rows actually belong together.",
        },
      ],
      hint: "An explicit JOIN ... ON <condition> replaces the comma and states which columns must match.",
      passVerdict: "Ships. Every order paired with exactly its own customer.",
    },
  },
};

function fallbackProjectSpec(world: WorldDefinition): ProjectSpec {
  return {
    repoName: `${world.slug}-capstone`,
    brief: {
      prompt: `Ship It: write the README for your ${world.title} capstone. From scratch — no scaffold.`,
      language: "markdown",
      starterCode: "<!-- write the README here -->\n",
      requirements: [
        {
          needle: world.title,
          critique: `Never names ${world.title} anywhere. A reader landing on this repo can't tell what it's even for.`,
        },
        {
          needle: "## ",
          critique: "No section heading. A README that's one undifferentiated paragraph doesn't get read.",
        },
        {
          needle: "learned",
          critique: "Never says what you learned. A capstone README with no reflection is just a file listing.",
        },
      ],
      hint: `A title mentioning ${world.title}, a '##' section, and a line about what you learned — that's the minimum.`,
      passVerdict: "Ships. Future you will thank present you for writing this down.",
    },
  };
}

/** Deterministic short hex "commit sha" — same node always ships the same one. */
function fakeSha(seed: string): string {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return h.toString(16).padStart(7, "0").slice(0, 7);
}

function buildProject(world: WorldDefinition, nodeId: string): BossProject {
  const spec = PROJECT_SPECS[world.slug] ?? fallbackProjectSpec(world);
  const size: ProjectSize = world.order <= 12 ? "small" : "big";
  return {
    size,
    repoOwner: DEMO_USER.username,
    repoName: spec.repoName,
    commitSha: fakeSha(nodeId),
    filesChanged: size === "small" ? 3 + (world.order % 3) : 9 + (world.order % 5),
    brief: spec.brief,
  };
}

/** A project or prompt stage has no LessonStep content of its own — a
 * project is worth a flat 1 HP like any other step, while a prompt stage is
 * worth its full possible damage, since damage dealt there is variable. */
export function stageAttacks(stage: BossStage): number {
  if (stage.kind === "project") return 1;
  if (stage.kind === "prompt") return stage.promptAttack?.maxDamage ?? 0;
  return stage.steps.length;
}

const FALLBACK_EPITHETS = [
  "Warden",
  "Gatekeeper",
  "Colossus",
  "Devourer",
  "Sentinel",
  "Leviathan",
];

function bossIdentity(
  worldSlug: string,
  worldTitle: string,
  order: number,
): { name: string; tagline: string } {
  return (
    BOSS_NAMES[worldSlug] ?? {
      name: `The ${FALLBACK_EPITHETS[order % FALLBACK_EPITHETS.length]} of ${worldTitle}`,
      tagline: `Everything ${worldTitle} taught you, all at once.`,
    }
  );
}

/**
 * Split a world's steps into three themed stages. Flashcards are study
 * material (they can't be failed) so they're dropped from the gauntlet.
 */
function buildStages(steps: LessonStep[]): BossStage[] {
  const scored = steps.filter((s) => s.type !== "flashcard");

  const recall = scored.filter(
    (s) => s.type === "multiple_choice" || s.type === "fill_blank",
  );
  const rebuild = scored.filter(
    (s) => s.type === "matching" || s.type === "sorting",
  );
  const prove = scored.filter(
    (s) => s.type === "typing" || s.type === "code",
  );

  const stages: BossStage[] = [
    {
      title: "Recall",
      intro: "Quick fire. Answer from memory.",
      steps: recall,
    },
    {
      title: "Rebuild",
      intro: "Put the pieces back in order.",
      steps: rebuild,
    },
    {
      title: "Prove It",
      intro: "No options to lean on. Type the real thing.",
      steps: prove,
    },
  ].filter((stage) => stage.steps.length > 0);

  // A world sample can theoretically miss whole categories; make sure the
  // battle always has content.
  return stages.length > 0
    ? stages
    : [{ title: "Gauntlet", intro: "Survive.", steps: scored }];
}

/** Boss node = the last node of its world. Secret nodes never are. */
export function isBossNode(nodeId: string): boolean {
  const match = nodeId.match(/^(.+?)-(\d+)$/);
  if (!match || nodeId.includes("-secret-")) return false;
  const world = WORLDS.find((w) => w.slug === match[1]);
  return Boolean(world && Number(match[2]) === world.lessonCount - 1);
}

export function getBossBattle(nodeId: string): BossBattle | null {
  if (!isBossNode(nodeId)) return null;

  const worldSlug = nodeId.replace(/-\d+$/, "");
  const world = WORLDS.find((w) => w.slug === worldSlug);
  const session = getLessonSession(nodeId);
  if (!world || !session) return null;

  const combatStages = buildStages(session.steps);
  const totalCombatSteps = combatStages.reduce((n, s) => n + s.steps.length, 0);

  // The opener: no multiple choice, no options — write the actual prompt.
  const promptStage: BossStage = {
    title: "Opening Strike",
    intro: "No options to pick from. Write the real prompt — power in, damage out.",
    steps: [],
    kind: "prompt",
    promptAttack: buildPromptAttack(world),
  };

  const project = buildProject(world, nodeId);
  const projectStage: BossStage = {
    title: "Ship It",
    intro:
      project.size === "big"
        ? "One last, bigger build — from a blank file. Then it's judged, and it ships to GitHub."
        : "One last small build — from a blank file. Then it's judged, and it ships to GitHub.",
    steps: [],
    kind: "project",
  };
  const stages = [promptStage, ...combatStages, projectStage];

  // Coding takes longer than a quiz question — the project earns extra
  // clock, and so does writing an actual prompt instead of picking one.
  const projectTimeBonus = project.size === "big" ? 180 : 90;
  const promptTimeBonus = 60;

  return {
    nodeId,
    worldSlug,
    worldTitle: world.title,
    ...bossIdentity(worldSlug, world.title, world.order),
    timeLimitSeconds: totalCombatSteps * 45 + promptTimeBonus + projectTimeBonus,
    xpReward: 250,
    gemReward: 10,
    stages,
    project,
  };
}
