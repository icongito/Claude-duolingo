import type { LessonBlueprint } from "./types";

/** World 5: GitHub. */
export const GITHUB_LESSONS: LessonBlueprint[] = [
  {
    title: "Pull Requests, Properly",
    steps: [
      {
        type: "flashcard",
        cards: [
          {
            front: "What is a pull request?",
            back: "A proposal to merge one branch into another, with a diff, a discussion thread, and CI checks attached.",
          },
          {
            front: "What makes a PR easy to review?",
            back: "Small scope, a description that says why, and passing checks. Reviewers approve what they can understand in one sitting.",
          },
        ],
      },
      {
        type: "multiple_choice",
        prompt: "Your PR changes 40 files across three unrelated fixes. What's the reviewer-friendly move?",
        options: [
          "Ship it — reviewers love a challenge",
          "Split it into three PRs, one per fix",
          "Remove the description to keep it mysterious",
          "Mark it as draft forever",
        ],
        correctIndex: 1,
        explanation:
          "One PR = one reviewable idea. Three focused PRs get reviewed in hours; one tangled PR sits for days.",
      },
      {
        type: "sorting",
        prompt: "Order the lifecycle of a pull request.",
        correctOrder: [
          "Push your branch and open the PR",
          "CI runs and reviewers comment",
          "You push fixes addressing the feedback",
          "Approved and merged into main",
        ],
      },
      {
        type: "fill_blank",
        prompt: "Complete the sentence about PR descriptions.",
        sentence: "The diff shows what changed; the description's job is the ___.",
        options: ["what", "why", "when", "who"],
        correctIndex: 1,
        explanation: "Why this change, why now, why this approach — that's what a reviewer can't read from the diff.",
      },
      {
        type: "typing",
        prompt: "The GitHub CLI command to open a pull request is `gh pr ___`. (one word)",
        answer: "create",
        placeholder: "gh pr …",
        explanation: "`gh pr create` opens the PR straight from your terminal.",
      },
    ],
  },
  {
    title: "Code Review That Helps",
    steps: [
      {
        type: "multiple_choice",
        prompt: "Which review comment is most useful?",
        options: [
          '"bad code"',
          '"I wouldn\'t do it this way"',
          '"This loop is O(n²) on a list that can hit 100k items — a Set lookup makes it O(n). Want me to sketch it?"',
          '"👎"',
        ],
        correctIndex: 2,
        explanation:
          "It names the problem, the consequence, and a concrete alternative. Critique the code, give the path forward.",
      },
      {
        type: "matching",
        prompt: "Match the review comment type to its purpose.",
        pairs: [
          { left: "Blocking comment", right: "Must be fixed before merge" },
          { left: "Nit", right: "Minor style preference, author's call" },
          { left: "Question", right: "Understanding before judging" },
          { left: "Praise", right: "Reinforces good patterns" },
        ],
      },
      {
        type: "fill_blank",
        prompt: "Complete the reviewing principle.",
        sentence: "Review the ___, not the person who wrote it.",
        options: ["code", "author", "deadline", "commit count"],
        correctIndex: 0,
        explanation: "'This function misses the empty case' lands; 'you always forget edge cases' doesn't.",
      },
      {
        type: "multiple_choice",
        prompt: "You disagree with a reviewer's suggestion and you have a solid reason. What do you do?",
        options: [
          "Silently ignore the comment and merge",
          "Reply with your reasoning and let the discussion resolve it",
          "Close the PR in protest",
          "Change it even though it's worse",
        ],
        correctIndex: 1,
        explanation:
          "Review is a dialogue. A respectful 'here's why I chose this' either convinces them or surfaces what you missed.",
      },
      {
        type: "typing",
        prompt: "A minor, non-blocking style comment in review is conventionally prefixed ___. (three letters)",
        answer: "nit",
        placeholder: "type your answer…",
        explanation: "'nit:' signals 'your call' — it separates preferences from requirements.",
      },
    ],
  },
  {
    title: "CI with GitHub Actions",
    steps: [
      {
        type: "flashcard",
        cards: [
          {
            front: "What is CI?",
            back: "Continuous integration: every push automatically runs your tests, lint, and build so breakage is caught in minutes, not at release.",
          },
          {
            front: "What is a GitHub Actions workflow?",
            back: "A YAML file in .github/workflows/ that defines when to run (push, PR) and what jobs to run (test, lint, build).",
          },
        ],
      },
      {
        type: "multiple_choice",
        prompt: "CI fails on your PR but everything passes on your machine. First move?",
        options: [
          "Merge anyway — works on my machine",
          "Read the CI logs to see the actual failing step and error",
          "Re-run it until it passes",
          "Delete the workflow file",
        ],
        correctIndex: 1,
        explanation:
          "The logs name the failing step and the exact error — usually an environment difference like Node version or a missing env var.",
      },
      {
        type: "fill_blank",
        prompt: "Complete the sentence about workflow files.",
        sentence: "GitHub Actions workflows live in the `.github/___/` directory.",
        options: ["actions", "workflows", "ci", "scripts"],
        correctIndex: 1,
        explanation: ".github/workflows/*.yml — each file is one workflow.",
      },
      {
        type: "sorting",
        prompt: "Order what happens when you push to a PR with CI configured.",
        correctOrder: [
          "Push triggers the workflow",
          "A runner checks out your code",
          "Jobs run: install, lint, test, build",
          "Pass/fail status appears on the PR",
        ],
      },
      {
        type: "typing",
        prompt: "GitHub's built-in CI system is called GitHub ___. (one word)",
        answer: "actions",
        placeholder: "type your answer…",
        explanation: "GitHub Actions — workflows, jobs, and runners built into the repo.",
      },
    ],
  },
  {
    title: "Issues, Forks & Open Source",
    steps: [
      {
        type: "flashcard",
        cards: [
          {
            front: "What is a fork?",
            back: "Your own copy of someone else's repository, where you can push branches — the standard way to contribute to projects you can't push to directly.",
          },
          {
            front: "What makes a good issue?",
            back: "Steps to reproduce, expected vs. actual behavior, and version info. 'It doesn't work' is a support ticket, not an issue.",
          },
        ],
      },
      {
        type: "sorting",
        prompt: "Order the classic open-source contribution flow.",
        correctOrder: [
          "Fork the repository to your account",
          "Create a branch and make your change",
          "Push to your fork",
          "Open a PR from your fork to the original repo",
        ],
      },
      {
        type: "multiple_choice",
        prompt: "You found a bug in an open-source library. What's the most helpful first step?",
        options: [
          "Tweet angrily at the maintainer",
          "Search existing issues, then file one with a minimal reproduction",
          "Immediately open a 2,000-line PR",
          "Vendor the library and patch it silently",
        ],
        correctIndex: 1,
        explanation:
          "Someone may have already reported it. If not, a reproducible issue lets maintainers confirm and often suggests where a fix PR should go.",
      },
      {
        type: "fill_blank",
        prompt: "Complete the sentence about forks.",
        sentence: "A fork lets you push branches to your own copy when you don't have ___ access to the original repo.",
        options: ["read", "write", "internet", "admin"],
        correctIndex: 1,
        explanation: "No write access needed: fork, push to your copy, PR back upstream.",
      },
      {
        type: "typing",
        prompt: "Your personal copy of someone else's repo is called a ___. (one word)",
        answer: "fork",
        placeholder: "type your answer…",
        explanation: "Fork — the on-ramp for contributing to code you don't own.",
      },
    ],
  },
];

/** World 6: Terminal. */
export const TERMINAL_LESSONS: LessonBlueprint[] = [
  {
    title: "Moving Around the Filesystem",
    steps: [
      {
        type: "flashcard",
        cards: [
          {
            front: "What do cd, ls, and pwd do?",
            back: "cd changes directory, ls lists contents, pwd prints where you are. The navigation trio.",
          },
          {
            front: "What do . and .. mean?",
            back: ". is the current directory; .. is the parent. `cd ..` goes up one level.",
          },
        ],
      },
      {
        type: "matching",
        prompt: "Match the command to what it does.",
        pairs: [
          { left: "pwd", right: "Print the current directory" },
          { left: "ls -la", right: "List everything, including hidden files" },
          { left: "cd ~", right: "Jump to your home directory" },
          { left: "cd -", right: "Jump back to the previous directory" },
        ],
      },
      {
        type: "multiple_choice",
        prompt: "Which path is absolute?",
        options: ["src/app", "./config.json", "/home/dev/project", "../sibling"],
        correctIndex: 2,
        explanation:
          "Absolute paths start from the root `/` and work from anywhere. The others are relative to where you're standing.",
      },
      {
        type: "typing",
        prompt: "Type the command that prints your current working directory. (one word)",
        answer: "pwd",
        placeholder: "type the command…",
        explanation: "pwd — print working directory. When lost, run this first.",
      },
    ],
  },
  {
    title: "Pipes & Redirection",
    steps: [
      {
        type: "flashcard",
        cards: [
          {
            front: "What does the pipe | do?",
            back: "Sends one command's output into the next command's input: `history | grep ssh` searches your history.",
          },
          {
            front: "What's the difference between > and >>?",
            back: "> overwrites the file with the output; >> appends to the end of it.",
          },
        ],
      },
      {
        type: "multiple_choice",
        prompt: "`cat server.log | grep ERROR | wc -l` does what?",
        options: [
          "Deletes error lines from the log",
          "Counts how many lines contain ERROR",
          "Prints the last error",
          "Restarts the server",
        ],
        correctIndex: 1,
        explanation:
          "Read the pipeline left to right: output the log, keep only ERROR lines, count them. Small tools, composed.",
      },
      {
        type: "matching",
        prompt: "Match the operator to its effect.",
        pairs: [
          { left: "|", right: "Pipe output into the next command" },
          { left: ">", right: "Write output to a file (overwrite)" },
          { left: ">>", right: "Append output to a file" },
          { left: "2>", right: "Redirect error output" },
        ],
      },
      {
        type: "fill_blank",
        prompt: "Complete the caution about redirection.",
        sentence: "Using `>` on an existing file ___ its contents without asking.",
        options: ["appends to", "overwrites", "backs up", "encrypts"],
        correctIndex: 1,
        explanation: "> truncates first, asks never. When in doubt, >> is the gentler operator.",
      },
      {
        type: "typing",
        prompt: "The character that chains one command's output into another's input is called a ___. (one word)",
        answer: "pipe",
        placeholder: "type your answer…",
        explanation: "The pipe | is the heart of shell composition.",
      },
    ],
  },
  {
    title: "Processes & Ports",
    steps: [
      {
        type: "multiple_choice",
        prompt: "Your dev server won't start: 'port 3000 already in use'. How do you find the culprit?",
        options: ["ls -la 3000", "lsof -i :3000", "cd 3000", "echo $PORT"],
        correctIndex: 1,
        explanation:
          "`lsof -i :3000` lists the process bound to the port, with its PID — which you can then kill.",
      },
      {
        type: "matching",
        prompt: "Match the tool to the job.",
        pairs: [
          { left: "ps aux", right: "List running processes" },
          { left: "kill <pid>", right: "Ask a process to terminate" },
          { left: "kill -9 <pid>", right: "Force-kill, no cleanup" },
          { left: "Ctrl+C", right: "Stop the foreground process" },
        ],
      },
      {
        type: "fill_blank",
        prompt: "Complete the sentence about kill signals.",
        sentence: "Plain `kill` sends a polite terminate signal; `kill -9` is the ___ resort.",
        options: ["first", "last", "only", "fastest"],
        correctIndex: 1,
        explanation:
          "-9 (SIGKILL) can't be caught, so the process gets no chance to clean up. Try plain kill first.",
      },
      {
        type: "sorting",
        prompt: "Order the port-conflict fix.",
        correctOrder: [
          "See the 'port already in use' error",
          "lsof -i :3000 to find the PID",
          "kill that PID",
          "Restart your dev server",
        ],
      },
      {
        type: "typing",
        prompt: "The number that identifies a running process is called a ___. (three letters)",
        answer: "pid",
        placeholder: "type your answer…",
        explanation: "PID — process ID. Find it with lsof or ps, feed it to kill.",
      },
    ],
  },
  {
    title: "Permissions & sudo",
    steps: [
      {
        type: "flashcard",
        cards: [
          {
            front: "What does rwx mean?",
            back: "Read, write, execute — shown for owner, group, and everyone else. `-rwxr-xr--` = owner can do all, group can read/execute, others read only.",
          },
          {
            front: "What does chmod +x script.sh do?",
            back: "Adds the execute bit, so the script can be run as ./script.sh.",
          },
        ],
      },
      {
        type: "multiple_choice",
        prompt: "'Permission denied' when running ./deploy.sh. Likeliest fix?",
        options: [
          "sudo rm deploy.sh",
          "chmod +x deploy.sh",
          "Rename it to deploy.txt",
          "Reboot",
        ],
        correctIndex: 1,
        explanation:
          "A fresh script usually just lacks the execute bit. chmod +x grants it — no sudo required for your own files.",
      },
      {
        type: "fill_blank",
        prompt: "Complete the sudo principle.",
        sentence: "Reach for sudo only when the command actually needs ___ privileges.",
        options: ["root", "network", "write", "shell"],
        correctIndex: 0,
        explanation:
          "sudo runs as root — maximum power, maximum blast radius. Habitual sudo turns typos into disasters.",
      },
      {
        type: "matching",
        prompt: "Match the permission command to its effect.",
        pairs: [
          { left: "chmod +x file", right: "Make it executable" },
          { left: "chmod 644 file", right: "Owner writes, everyone reads" },
          { left: "chown dev file", right: "Change the owner to dev" },
          { left: "ls -l", right: "Show permissions" },
        ],
      },
      {
        type: "typing",
        prompt: "The command that changes file permissions is ___. (one word)",
        answer: "chmod",
        placeholder: "type the command…",
        explanation: "chmod — change mode. +x for executable is the one you'll type most.",
      },
    ],
  },
];
