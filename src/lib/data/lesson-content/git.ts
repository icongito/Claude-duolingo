import type { LessonBlueprint } from "./types";

/** World 4: Git. Position 0 keeps git-0 on Branching Basics. */
export const GIT_LESSONS: LessonBlueprint[] = [
  {
    title: "Branching Basics",
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
  },
  {
    title: "Staging & Committing",
    steps: [
      {
        type: "flashcard",
        cards: [
          {
            front: "What is the staging area?",
            back: "A holding zone between your working files and history. `git add` stages changes; `git commit` records exactly what's staged.",
          },
          {
            front: "Why stage instead of committing everything?",
            back: "So one commit = one logical change. You can stage the bug fix now and leave the unrelated experiment out of it.",
          },
        ],
      },
      {
        type: "multiple_choice",
        prompt: "You edited 3 files but only 2 belong in this commit. What do you do?",
        options: [
          "git add . and commit all three",
          "git add the two relevant files, then commit",
          "Delete the third file",
          "Make three separate branches",
        ],
        correctIndex: 1,
        explanation:
          "Stage selectively. `git add <file>` puts only what belongs in this commit's story into the snapshot.",
      },
      {
        type: "fill_blank",
        prompt: "Complete the sentence about commit messages.",
        sentence: "A good commit message explains ___ the change was made, not just what changed.",
        options: ["when", "why", "where", "how fast"],
        correctIndex: 1,
        explanation:
          "The diff already shows what changed. The message's job is the intent — the why future readers can't reconstruct.",
      },
      {
        type: "sorting",
        prompt: "Order the everyday commit workflow.",
        correctOrder: [
          "Edit files in your working directory",
          "git status to see what changed",
          "git add the files that belong together",
          "git commit -m with a clear message",
        ],
      },
      {
        type: "typing",
        prompt: "The command that shows which files are modified and staged is `git ___`. (one word)",
        answer: "status",
        placeholder: "git …",
        explanation: "`git status` — the first command to run when you're unsure what state you're in.",
      },
    ],
  },
  {
    title: "Merge vs. Rebase",
    steps: [
      {
        type: "flashcard",
        cards: [
          {
            front: "What does merge do?",
            back: "Joins two branches with a merge commit, preserving both histories exactly as they happened.",
          },
          {
            front: "What does rebase do?",
            back: "Replays your commits on top of another branch, producing a straight-line history — with rewritten commit IDs.",
          },
        ],
      },
      {
        type: "multiple_choice",
        prompt: "Which is the golden rule of rebase?",
        options: [
          "Rebase every day at 9am",
          "Never rebase commits that are already pushed and shared with others",
          "Only rebase on Fridays",
          "Always rebase instead of merging",
        ],
        correctIndex: 1,
        explanation:
          "Rebase rewrites commit IDs. Rewriting history someone else has already built on forces them into painful recovery.",
      },
      {
        type: "matching",
        prompt: "Match the situation to the safer choice.",
        pairs: [
          { left: "Updating your local feature branch with main", right: "Rebase onto main" },
          { left: "Combining a finished feature into main", right: "Merge" },
          { left: "Commits already pushed to a shared branch", right: "Never rebase them" },
          { left: "Cleaning up your own unpushed commits", right: "Interactive rebase" },
        ],
      },
      {
        type: "fill_blank",
        prompt: "Complete the sentence about history.",
        sentence: "Merge preserves history; rebase ___ it.",
        options: ["deletes", "rewrites", "encrypts", "duplicates"],
        correctIndex: 1,
        explanation:
          "Rebase makes new commits with the same changes. Clean and linear — but it's genuinely different history.",
      },
      {
        type: "typing",
        prompt: "Replaying your commits on top of another branch is called a ___. (one word)",
        answer: "rebase",
        placeholder: "type your answer…",
        explanation: "Rebase — a straight-line history, at the cost of rewritten commits.",
      },
    ],
  },
  {
    title: "Undo: Restore, Revert, Reset",
    steps: [
      {
        type: "multiple_choice",
        prompt: "You want to undo a bad commit that's already pushed to a shared branch. The safe tool?",
        options: [
          "git reset --hard and force-push",
          "git revert, which adds a new commit undoing it",
          "Delete the repository",
          "Edit history in the GitHub UI",
        ],
        correctIndex: 1,
        explanation:
          "`revert` undoes by adding history, not rewriting it — safe on shared branches. Reset + force-push rewrites what teammates already have.",
      },
      {
        type: "matching",
        prompt: "Match the undo tool to the job.",
        pairs: [
          { left: "git restore file.txt", right: "Discard uncommitted changes to a file" },
          { left: "git revert abc123", right: "Undo a pushed commit safely" },
          { left: "git reset --soft HEAD~1", right: "Uncommit but keep the changes staged" },
          { left: "git reset --hard HEAD~1", right: "Destroy the last commit and its changes" },
        ],
      },
      {
        type: "fill_blank",
        prompt: "Complete the danger warning.",
        sentence: "`git reset --hard` throws away ___ changes — there is no undo for work that was never committed.",
        options: ["committed", "uncommitted", "pushed", "merged"],
        correctIndex: 1,
        explanation:
          "Committed work can usually be recovered via reflog. Uncommitted work destroyed by --hard is simply gone.",
      },
      {
        type: "multiple_choice",
        prompt: "You committed to the wrong branch (not pushed yet). Cleanest fix?",
        options: [
          "Delete both branches and start over",
          "git reset --soft HEAD~1, switch to the right branch, commit there",
          "Push it anyway and apologize",
          "Copy the files by hand into a new folder",
        ],
        correctIndex: 1,
        explanation:
          "Soft reset uncommits but keeps your work staged. Switch branches, commit again — thirty seconds, nothing lost.",
      },
      {
        type: "typing",
        prompt: "The command that undoes a pushed commit by creating a new opposite commit is `git ___`. (one word)",
        answer: "revert",
        placeholder: "git …",
        explanation: "`git revert` — the polite undo: history moves forward, nothing is rewritten.",
      },
    ],
  },
  {
    title: "Resolving Merge Conflicts",
    steps: [
      {
        type: "flashcard",
        cards: [
          {
            front: "When does a conflict happen?",
            back: "When two branches change the same lines (or one deletes a file the other edits) and git can't pick a side for you.",
          },
          {
            front: "What do the conflict markers mean?",
            back: "<<<<<<< your side, ======= the divider, >>>>>>> their side. You edit the file to the final text and remove all three markers.",
          },
        ],
      },
      {
        type: "sorting",
        prompt: "Order the conflict-resolution workflow.",
        correctOrder: [
          "Run the merge and see which files conflict",
          "Open each file and decide the final text",
          "Remove every conflict marker",
          "git add the resolved files and commit",
        ],
      },
      {
        type: "multiple_choice",
        prompt: "A conflicted file still contains `>>>>>>>` when you commit. What happens?",
        options: [
          "Git removes it for you",
          "The marker ships as literal text in your code — usually breaking it",
          "The commit is blocked forever",
          "The other branch wins automatically",
        ],
        correctIndex: 1,
        explanation:
          "Markers are just text. Committing them means your code now contains `>>>>>>> feature-x` — and probably doesn't compile.",
      },
      {
        type: "fill_blank",
        prompt: "Complete the sentence about resolving.",
        sentence: "Resolving a conflict means choosing the final text yourself — sometimes keeping ___ sides' changes.",
        options: ["neither", "both", "older", "random"],
        correctIndex: 1,
        explanation:
          "It's not always either/or. Often the right resolution weaves both changes together by hand.",
      },
      {
        type: "typing",
        prompt: "Two branches editing the same lines produces a merge ___. (one word)",
        answer: "conflict",
        placeholder: "type your answer…",
        explanation: "Conflicts aren't errors — they're git asking a human to make the call.",
      },
    ],
  },
];
