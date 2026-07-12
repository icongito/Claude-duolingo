/**
 * Boss battles — the multi-stage gauntlet at the end of every world.
 *
 * A boss re-tests the whole world's material in three themed stages under a
 * single time limit, with one pool of hearts across all stages. Beating it
 * completes the world and pays the biggest single reward in the game.
 * Mirrors the `boss_battles` table shape in src/lib/db/schema/projects.ts.
 */

import { WORLDS, type WorldDefinition } from "@/lib/gamification/worlds";
import { getLessonSession, type CodeStep, type LessonStep } from "@/lib/data/lessons";
import { DEMO_USER } from "@/lib/data/demo-user";

export type BossStage = {
  title: string;
  intro: string;
  steps: LessonStep[];
  /** "project" stages end in a simulated GitHub publish instead of the next attack. */
  kind?: "combat" | "project";
};

export type ProjectSize = "small" | "big";

/** The boss's finale: a project the player ships and "publishes" to GitHub. */
export type BossProject = {
  size: ProjectSize;
  repoOwner: string;
  repoName: string;
  commitSha: string;
  filesChanged: number;
  step: CodeStep;
};

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
 * The "Ship It" finale: a hand-authored small project per world, graded the
 * same way as any other code step (substring checks against mustInclude).
 * Worlds without a hand-authored spec fall back to a generic README project.
 */
type ProjectSpec = {
  repoName: string;
  step: Omit<CodeStep, "type">;
};

const PROJECT_SPECS: Record<string, ProjectSpec> = {
  "claude-basics": {
    repoName: "claude-basics-starter",
    step: {
      prompt:
        "Ship It: rewrite this vague debugging ask into one Claude can't misread.",
      language: "markdown",
      starterCode: "My code is broken, please fix it.\n",
      mustInclude: ["Expected:", "Actual:", "```"],
      hint: "Add an Expected: line, an Actual: line, and paste the code in a fenced ``` block.",
      explanation:
        "Expected vs. actual, plus the code itself, turns a guess into a precise fix.",
    },
  },
  "prompt-engineering": {
    repoName: "prompt-template-kit",
    step: {
      prompt: "Ship It: turn this one-off ask into a reusable template.",
      language: "markdown",
      starterCode: "Write me a blog post about {topic}\n",
      mustInclude: ["{topic}", "Tone:", "Audience:", "Format:"],
      hint: "Add Tone:, Audience:, and Format: lines above the ask, and keep the {topic} placeholder.",
      explanation:
        "Lock in role, tone, audience, and format once and the template produces consistent output forever.",
    },
  },
  "claude-code": {
    repoName: "subagent-rename-task",
    step: {
      prompt: "Ship It: write the subagent task prompt for a repo-wide rename.",
      language: "markdown",
      starterCode: "rename oldName to newName everywhere\n",
      mustInclude: ["Goal:", "Scope:", "Report back:"],
      hint: "State the Goal:, the Scope: (which files), and what to Report back: when done.",
      explanation:
        "Subagents have no memory of this conversation — the task prompt is the only context they get.",
    },
  },
  git: {
    repoName: "hotfix-drill",
    step: {
      prompt: "Ship It: branch, commit, and merge a one-line hotfix.",
      language: "shell",
      starterCode: "# fix the bug on a branch, then ship it\n",
      mustInclude: [
        "git switch -c hotfix",
        "git add",
        "git commit",
        "git switch main",
        "git merge hotfix",
      ],
      hint: "Branch, stage, commit, switch back to main, merge — five commands.",
      explanation:
        "This is the whole feature-branch loop in five commands. Muscle memory now saves you later.",
    },
  },
  github: {
    repoName: "open-pr-drill",
    step: {
      prompt: "Ship It: push the branch and open the pull request the right way.",
      language: "shell",
      starterCode: "git push\n",
      mustInclude: ["git push -u origin", "gh pr create"],
      hint: "Push with -u to set the upstream branch, then open the PR with gh pr create.",
      explanation:
        "-u remembers the branch mapping so future pushes are just `git push`; gh pr create skips the browser.",
    },
  },
  terminal: {
    repoName: "port-cleanup-drill",
    step: {
      prompt: "Ship It: find and kill whatever is hogging port 3000.",
      language: "shell",
      starterCode: "# find what's on port 3000 and stop it\n",
      mustInclude: ["lsof -i :3000", "kill"],
      hint: "lsof -i :3000 lists what's bound to the port; kill <pid> stops it.",
      explanation:
        "lsof -i is the fastest way to find a port squatter before reaching for pkill.",
    },
  },
  react: {
    repoName: "use-effect-fix",
    step: {
      prompt: "Ship It: fix the missing dependency array before it ships.",
      language: "javascript",
      starterCode: "useEffect(() => {\n  fetchUser(userId);\n});\n",
      mustInclude: ["useEffect(() => {", "}, [userId]);"],
      hint: "Add a dependency array as the second argument to useEffect, with userId inside it.",
      explanation:
        "No array re-runs on every render; the right array runs only when userId actually changes.",
    },
  },
  javascript: {
    repoName: "undefined-guard",
    step: {
      prompt: "Ship It: stop the undefined crash before it reaches production.",
      language: "javascript",
      starterCode: "function getName(user) {\n  return user.profile.name;\n}\n",
      mustInclude: ["?.", "??"],
      hint: "Optional chaining (?.) stops the crash; nullish coalescing (??) gives a fallback.",
      explanation:
        "user?.profile?.name ?? 'Unknown' never throws, even when profile is missing.",
    },
  },
  typescript: {
    repoName: "type-the-any",
    step: {
      prompt: "Ship It: replace any with a real type before it ships.",
      language: "typescript",
      starterCode:
        "function getTotal(items: any) {\n  return items.reduce((sum, i) => sum + i.price, 0);\n}\n",
      mustInclude: ["interface", "number"],
      hint: "Define an interface for the item shape (at least a price: number field) instead of any.",
      explanation: "A real type catches the typo at compile time instead of in production.",
    },
  },
  sql: {
    repoName: "join-fix-drill",
    step: {
      prompt: "Ship It: fix the query before it joins every row with every row.",
      language: "sql",
      starterCode: "SELECT * FROM orders, customers;\n",
      mustInclude: ["JOIN", "ON"],
      hint: "Use an explicit JOIN with an ON condition instead of a comma join.",
      explanation:
        "A comma join with no WHERE is a cartesian product — every order paired with every customer. JOIN...ON fixes it.",
    },
  },
};

function fallbackProjectSpec(world: WorldDefinition): ProjectSpec {
  return {
    repoName: `${world.slug}-capstone`,
    step: {
      prompt: `Ship It: write the README for your ${world.title} capstone.`,
      language: "markdown",
      starterCode: "# My Project\n",
      mustInclude: ["## ", "learned"],
      hint: "Add a '#' title, a '##' section heading, and mention one thing you learned.",
      explanation: "Every project ships with a README. Future you will thank present you.",
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
    step: { type: "code", ...spec.step },
  };
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

  const project = buildProject(world, nodeId);
  const projectStage: BossStage = {
    title: "Ship It",
    intro:
      project.size === "big"
        ? "One last, bigger build. Then it ships to GitHub."
        : "One last small build. Then it ships to GitHub.",
    steps: [project.step],
    kind: "project",
  };
  const stages = [...combatStages, projectStage];

  // Coding takes longer than a quiz question — the project earns extra clock.
  const projectTimeBonus = project.size === "big" ? 180 : 90;

  return {
    nodeId,
    worldSlug,
    worldTitle: world.title,
    ...bossIdentity(worldSlug, world.title, world.order),
    timeLimitSeconds: totalCombatSteps * 45 + projectTimeBonus,
    xpReward: 250,
    gemReward: 10,
    stages,
    project,
  };
}
