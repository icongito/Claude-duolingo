import type { LessonBlueprint } from "./types";

/** World 19: MCP. */
export const MCP_LESSONS: LessonBlueprint[] = [
  {
    title: "What MCP Is",
    steps: [
      {
        type: "flashcard",
        cards: [
          {
            front: "What is the Model Context Protocol?",
            back: "An open standard for connecting AI models to tools and data sources — one protocol instead of a custom integration per app.",
          },
          {
            front: "Client vs server?",
            back: "The MCP server exposes tools/resources (a database, an API); the client (like Claude) discovers and calls them.",
          },
        ],
      },
      {
        type: "matching",
        prompt: "Match the MCP concept to its role.",
        pairs: [
          { left: "Server", right: "Exposes tools and resources" },
          { left: "Client", right: "The AI app calling them" },
          { left: "Tool", right: "An action the model can invoke" },
          { left: "Resource", right: "Data the model can read" },
        ],
      },
      {
        type: "multiple_choice",
        prompt: "Your team has a database, an issue tracker, and a docs wiki to connect to Claude. MCP's pitch?",
        options: [
          "Write three bespoke plugins per AI app",
          "Run three MCP servers; any MCP client can use all of them",
          "Paste everything into the chat manually",
          "It can't be done",
        ],
        correctIndex: 1,
        explanation:
          "Standard protocol, interchangeable parts: servers written once work with every MCP-speaking client.",
      },
      {
        type: "typing",
        prompt: "MCP stands for Model ___ Protocol. (one word)",
        answer: "context",
        placeholder: "type your answer…",
        explanation: "Model Context Protocol — the USB port between models and your systems.",
      },
    ],
  },
  {
    title: "Tools, Safely",
    steps: [
      {
        type: "multiple_choice",
        prompt: "What makes a good MCP tool description?",
        options: [
          "As short as possible: 'does stuff'",
          "Precise purpose, parameters, and when to use it — the model chooses tools by reading it",
          "Marketing copy",
          "Blank",
        ],
        correctIndex: 1,
        explanation:
          "Descriptions are the model's only manual. Vague descriptions produce wrong tool calls.",
      },
      {
        type: "fill_blank",
        prompt: "Complete the trust rule.",
        sentence: "Output returned by external tools is ___ input and shouldn't be followed as instructions blindly.",
        options: ["trusted", "untrusted", "cached", "typed"],
        correctIndex: 1,
        explanation:
          "A fetched web page saying 'ignore your instructions' is data, not orders. Treating tool output as untrusted is prompt-injection defense.",
      },
      {
        type: "matching",
        prompt: "Match the tool to a sensible permission posture.",
        pairs: [
          { left: "search_docs", right: "Auto-allow, read-only" },
          { left: "run_query (SELECT)", right: "Allow with care" },
          { left: "delete_records", right: "Human approval" },
          { left: "deploy_to_prod", right: "Human approval" },
        ],
      },
      {
        type: "typing",
        prompt: "Malicious instructions hidden in data the model reads are called prompt ___. (one word)",
        answer: "injection",
        placeholder: "type your answer…",
        explanation: "Prompt injection — why tool output gets skepticism, not obedience.",
      },
    ],
  },
];

/** World 20: AI Agents. */
export const AI_AGENTS_LESSONS: LessonBlueprint[] = [
  {
    title: "The Agent Loop",
    steps: [
      {
        type: "flashcard",
        cards: [
          {
            front: "What makes an agent different from a chatbot?",
            back: "A loop: plan → act with tools → observe results → adjust — repeating until the goal is done, not just answering once.",
          },
          {
            front: "Why does observation matter?",
            back: "Acting without reading results is guessing. The feedback step is where agents correct course.",
          },
        ],
      },
      {
        type: "sorting",
        prompt: "Order one iteration of the agent loop.",
        correctOrder: [
          "Decide the next action toward the goal",
          "Call a tool to perform it",
          "Observe the result",
          "Update the plan and continue or finish",
        ],
      },
      {
        type: "multiple_choice",
        prompt: "An agent's test run fails. What should the loop do?",
        options: [
          "Declare success anyway",
          "Read the failure output and adjust the next action",
          "Retry the identical command forever",
          "Delete the tests",
        ],
        correctIndex: 1,
        explanation:
          "Failures are information. The read-and-adjust step is what separates an agent from a script.",
      },
      {
        type: "typing",
        prompt: "Plan, act, ___, adjust — the agent loop's third step. (one word)",
        answer: "observe",
        placeholder: "type your answer…",
        explanation: "Observe — no feedback, no intelligence.",
      },
    ],
  },
  {
    title: "Guardrails & Evaluation",
    steps: [
      {
        type: "multiple_choice",
        prompt: "Why give an agent a step or cost budget?",
        options: [
          "To make it feel pressure",
          "Unbounded loops burn money and can wander — budgets force progress or a clean stop",
          "Budgets are decorative",
          "To slow it down",
        ],
        correctIndex: 1,
        explanation:
          "A stuck agent retrying forever is the classic failure. Budgets turn it into a visible, handleable stop.",
      },
      {
        type: "matching",
        prompt: "Match the guardrail to what it prevents.",
        pairs: [
          { left: "Step budget", right: "Infinite loops" },
          { left: "Permission gates", right: "Destructive actions without approval" },
          { left: "Sandboxed execution", right: "Damage outside the workspace" },
          { left: "Output validation", right: "Malformed results flowing downstream" },
        ],
      },
      {
        type: "fill_blank",
        prompt: "Complete the evaluation principle.",
        sentence: "Agents are evaluated on ___ of the final task, not on how confident their messages sound.",
        options: ["speed", "completion", "politeness", "length"],
        correctIndex: 1,
        explanation:
          "Did the tests pass? Did the PR merge? Outcome checks beat vibes every time.",
      },
      {
        type: "typing",
        prompt: "Running agent actions in an isolated environment is called ___boxing. (one word)",
        answer: "sand",
        placeholder: "…boxing",
        explanation: "Sandboxing — let the agent act freely where mistakes are cheap.",
      },
    ],
  },
];

/** World 21: Automation. */
export const AUTOMATION_LESSONS: LessonBlueprint[] = [
  {
    title: "Scripts Beat Checklists",
    steps: [
      {
        type: "multiple_choice",
        prompt: "A 6-step release checklist gets done wrong about once a month. Best fix?",
        options: [
          "A sterner checklist",
          "A script that runs the six steps in order and stops on the first failure",
          "Blaming whoever released",
          "Fewer releases",
        ],
        correctIndex: 1,
        explanation:
          "Humans skip steps; scripts don't. Automation turns tribal process into executable, reviewable code.",
      },
      {
        type: "flashcard",
        cards: [
          {
            front: "What is idempotency?",
            back: "Running it twice is safe — same result, no duplicates, no damage. The property that makes automation re-runnable after failures.",
          },
          {
            front: "Why 'stop on first error'?",
            back: "Later steps often assume earlier ones succeeded. Continuing after a failure compounds the mess (set -e in bash).",
          },
        ],
      },
      {
        type: "fill_blank",
        prompt: "Complete the automation rule of thumb.",
        sentence: "If you've done the same manual sequence ___ times, script it.",
        options: ["zero", "three", "fifty", "1000"],
        correctIndex: 1,
        explanation: "Three is the pattern threshold: the fourth time should be one command.",
      },
      {
        type: "typing",
        prompt: "A task that can safely run twice with the same result is ___. (one word)",
        answer: "idempotent",
        placeholder: "type your answer…",
        explanation: "Idempotent — the difference between 'retry' and 'disaster recovery'.",
      },
    ],
  },
  {
    title: "Scheduled & Event-Driven Jobs",
    steps: [
      {
        type: "flashcard",
        cards: [
          {
            front: "What is cron?",
            back: "The classic scheduler: a five-field expression (minute hour day month weekday) that runs a command on a schedule.",
          },
          {
            front: "Cron vs webhook?",
            back: "Cron fires on time ('every night at 2am'); webhooks fire on events ('when a PR merges'). Pick by trigger, not habit.",
          },
        ],
      },
      {
        type: "matching",
        prompt: "Match the cron expression to its schedule.",
        pairs: [
          { left: "0 2 * * *", right: "Daily at 02:00" },
          { left: "*/15 * * * *", right: "Every 15 minutes" },
          { left: "0 9 * * 1", right: "Mondays at 09:00" },
          { left: "0 0 1 * *", right: "First of each month" },
        ],
      },
      {
        type: "multiple_choice",
        prompt: "A nightly job failed silently for two weeks. What was missing?",
        options: [
          "A faster server",
          "Alerting on failure — jobs need to report when they break, not just when they run",
          "More cron jobs",
          "Nothing, that's normal",
        ],
        correctIndex: 1,
        explanation:
          "Silent failure is automation's biggest trap. Every job needs a failure signal a human will actually see.",
      },
      {
        type: "typing",
        prompt: "The time-based job scheduler with five-field expressions is called ___. (one word)",
        answer: "cron",
        placeholder: "type your answer…",
        explanation: "cron — decades old, still running the internet's nightly work.",
      },
    ],
  },
];

/** World 22: Testing. */
export const TESTING_LESSONS: LessonBlueprint[] = [
  {
    title: "The Testing Pyramid",
    steps: [
      {
        type: "flashcard",
        cards: [
          {
            front: "Unit vs integration vs end-to-end?",
            back: "Unit: one function in isolation, fast. Integration: pieces together. E2E: the whole app as a user — slowest, most realistic.",
          },
          {
            front: "Why a pyramid shape?",
            back: "Many fast unit tests, fewer integration, few E2E — coverage where it's cheap, realism where it counts.",
          },
        ],
      },
      {
        type: "matching",
        prompt: "Match the bug to the test level that catches it cheapest.",
        pairs: [
          { left: "Math error in a pure function", right: "Unit test" },
          { left: "API and DB disagree on a field", right: "Integration test" },
          { left: "Checkout button unreachable on mobile", right: "E2E test" },
          { left: "A regression in a fixed bug", right: "The test written with the fix" },
        ],
      },
      {
        type: "multiple_choice",
        prompt: "What makes a test suite trustworthy?",
        options: [
          "It always passes, no matter what",
          "It fails when behavior breaks and only then — deterministic, no flakes",
          "It takes hours, proving thoroughness",
          "100% coverage of getters",
        ],
        correctIndex: 1,
        explanation:
          "A suite that flakes gets ignored; a suite that can't fail protects nothing. Signal is the product.",
      },
      {
        type: "typing",
        prompt: "Tests that simulate a real user through the whole app are called end-to-___ tests. (one word)",
        answer: "end",
        placeholder: "end-to-…",
        explanation: "End-to-end — the top of the pyramid: few, slow, and closest to reality.",
      },
    ],
  },
  {
    title: "Writing Tests That Earn Their Keep",
    steps: [
      {
        type: "sorting",
        prompt: "Order the classic arrange-act-assert test structure.",
        correctOrder: [
          "Arrange: set up inputs and state",
          "Act: call the thing being tested",
          "Assert: check the result matches expectations",
        ],
      },
      {
        type: "multiple_choice",
        prompt: "Which test name is best?",
        options: [
          "test1",
          "works",
          "returns an empty list when no orders match the date range",
          "final_test_v2_REAL",
        ],
        correctIndex: 2,
        explanation:
          "A failing test's name should read as a bug report. 'test1 failed' tells you nothing.",
      },
      {
        type: "fill_blank",
        prompt: "Complete the behavior-testing principle.",
        sentence: "Test observable ___, not private implementation details that refactors will change.",
        options: ["behavior", "variables", "comments", "imports"],
        correctIndex: 0,
        explanation:
          "Tests coupled to internals break on every refactor; tests on behavior break only on real regressions.",
      },
      {
        type: "multiple_choice",
        prompt: "You fixed a bug. What belongs in the same commit?",
        options: [
          "Nothing else",
          "A test that fails without the fix and passes with it",
          "A comment saying 'fixed'",
          "A version bump",
        ],
        correctIndex: 1,
        explanation:
          "The regression test is the fix's insurance policy — that bug now has an alarm on it forever.",
      },
      {
        type: "typing",
        prompt: "Arrange, ___, assert — the middle step. (one word)",
        answer: "act",
        placeholder: "type your answer…",
        explanation: "Act — the single call the whole test exists to check.",
      },
    ],
  },
];

/** World 23: Deployment. */
export const DEPLOYMENT_LESSONS: LessonBlueprint[] = [
  {
    title: "From Laptop to Production",
    steps: [
      {
        type: "sorting",
        prompt: "Order a healthy path to production.",
        correctOrder: [
          "Merge to main with green CI",
          "Build a production artifact",
          "Deploy to staging and verify",
          "Promote to production",
        ],
      },
      {
        type: "flashcard",
        cards: [
          {
            front: "Why environments (dev/staging/prod)?",
            back: "Staging is a production look-alike where mistakes are free. Prod is where mistakes are incidents.",
          },
          {
            front: "What is a build artifact?",
            back: "The compiled, deployable output (bundle, image). Build once, deploy the same artifact everywhere.",
          },
        ],
      },
      {
        type: "multiple_choice",
        prompt: "Why 'build once, deploy the same artifact to staging and prod'?",
        options: [
          "It's cheaper",
          "What you verified in staging is byte-identical to what ships — no 'it built differently' surprises",
          "Builds are boring",
          "It isn't important",
        ],
        correctIndex: 1,
        explanation:
          "Rebuilding per environment reintroduces variability exactly where you wanted certainty.",
      },
      {
        type: "typing",
        prompt: "The production look-alike environment used for final verification is called ___. (one word)",
        answer: "staging",
        placeholder: "type your answer…",
        explanation: "Staging — where you find out before users do.",
      },
    ],
  },
  {
    title: "Rollbacks & Safe Releases",
    steps: [
      {
        type: "multiple_choice",
        prompt: "Five minutes after deploy, error rates spike. First move?",
        options: [
          "Debug live in production for an hour",
          "Roll back to the previous known-good version, then debug calmly",
          "Turn off monitoring",
          "Deploy again on top",
        ],
        correctIndex: 1,
        explanation:
          "Restore service first, investigate second. A fast rollback turns an incident into a blip.",
      },
      {
        type: "matching",
        prompt: "Match the release technique to what it does.",
        pairs: [
          { left: "Rollback", right: "Return to the previous version" },
          { left: "Canary release", right: "Ship to a small % first" },
          { left: "Feature flag", right: "Toggle a feature without deploying" },
          { left: "Health check", right: "Automated 'is it alive?' probe" },
        ],
      },
      {
        type: "fill_blank",
        prompt: "Complete the deployment safety rule.",
        sentence: "A deploy isn't safe unless the ___ path has been tested too.",
        options: ["happy", "rollback", "login", "billing"],
        correctIndex: 1,
        explanation:
          "An untested rollback is a hope, not a plan. Practice it before you need it at 2am.",
      },
      {
        type: "typing",
        prompt: "Releasing to a small percentage of users first is a ___ release. (one word)",
        answer: "canary",
        placeholder: "type your answer…",
        explanation: "Canary — the early-warning bird for bad deploys.",
      },
    ],
  },
];

/** World 24: Scaling. */
export const SCALING_LESSONS: LessonBlueprint[] = [
  {
    title: "Caching & Bottlenecks",
    steps: [
      {
        type: "flashcard",
        cards: [
          {
            front: "First rule of performance work?",
            back: "Measure before optimizing. The bottleneck is usually one hot spot, and it's rarely where you guessed.",
          },
          {
            front: "What is caching?",
            back: "Storing a computed/fetched result so repeat requests skip the expensive work — with a strategy for when it goes stale.",
          },
        ],
      },
      {
        type: "matching",
        prompt: "Match the cache layer to what it serves.",
        pairs: [
          { left: "CDN", right: "Static assets near the user" },
          { left: "Redis / in-memory", right: "Hot data your app reads constantly" },
          { left: "HTTP cache headers", right: "Tell browsers what to keep" },
          { left: "Database query cache", right: "Repeated identical reads" },
        ],
      },
      {
        type: "multiple_choice",
        prompt: "The dashboard makes 40 identical DB queries per page load. Cheapest big win?",
        options: [
          "A bigger database server",
          "Cache the result for a minute — 40 queries become 1",
          "Rewrite in another language",
          "Remove the dashboard",
        ],
        correctIndex: 1,
        explanation:
          "Repeated identical work is caching's home turf. One cheap layer often beats months of micro-optimization.",
      },
      {
        type: "fill_blank",
        prompt: "Complete the famous caveat.",
        sentence: "The two hard problems: naming things, and cache ___.",
        options: ["warming", "invalidation", "sizing", "coloring"],
        correctIndex: 1,
        explanation:
          "Knowing when cached data is stale is the hard part — every cache needs an invalidation story.",
      },
      {
        type: "typing",
        prompt: "The slowest component limiting overall throughput is the ___. (one word)",
        answer: "bottleneck",
        placeholder: "type your answer…",
        explanation: "Find the bottleneck, fix the bottleneck, re-measure. Repeat.",
      },
    ],
  },
  {
    title: "Scaling Out & Staying Up",
    steps: [
      {
        type: "flashcard",
        cards: [
          {
            front: "Vertical vs horizontal scaling?",
            back: "Vertical: a bigger machine — simple, has a ceiling. Horizontal: more machines behind a load balancer — further, but needs stateless design.",
          },
          {
            front: "Why must servers be stateless to scale out?",
            back: "If sessions live in one server's memory, requests can't move between servers. Shared state (DB/Redis) frees the fleet.",
          },
        ],
      },
      {
        type: "multiple_choice",
        prompt: "What does a load balancer do?",
        options: [
          "Makes one server faster",
          "Spreads requests across servers and routes around unhealthy ones",
          "Compresses images",
          "Backs up the database",
        ],
        correctIndex: 1,
        explanation:
          "Distribution plus health checks: traffic flows to servers that are alive, and one crash stops being an outage.",
      },
      {
        type: "sorting",
        prompt: "Order a sane scaling journey.",
        correctOrder: [
          "Measure and find the real bottleneck",
          "Add caching for repeated work",
          "Scale the app tier horizontally",
          "Scale the data tier (replicas, then sharding)",
        ],
      },
      {
        type: "typing",
        prompt: "Adding more machines instead of a bigger machine is ___ scaling. (one word)",
        answer: "horizontal",
        placeholder: "type your answer…",
        explanation: "Horizontal — the direction with no single-machine ceiling.",
      },
    ],
  },
];

/** World 25: Startup Engineering. */
export const STARTUP_ENGINEERING_LESSONS: LessonBlueprint[] = [
  {
    title: "MVP Thinking",
    steps: [
      {
        type: "flashcard",
        cards: [
          {
            front: "What is an MVP really for?",
            back: "Learning. The minimum build that tests your riskiest assumption with real users — not a small version of the whole dream.",
          },
          {
            front: "What's the riskiest assumption usually?",
            back: "'Anyone wants this at all' — which no amount of architecture answers. Only shipping does.",
          },
        ],
      },
      {
        type: "multiple_choice",
        prompt: "Pre-launch, zero users. Which task is most valuable?",
        options: [
          "Kubernetes for a million users",
          "Getting a rough version in front of ten real people this week",
          "A microservices rewrite",
          "A custom design system",
        ],
        correctIndex: 1,
        explanation:
          "Every week not learning from users is the real cost. Scale problems are a prize you haven't won yet.",
      },
      {
        type: "fill_blank",
        prompt: "Complete the startup engineering motto.",
        sentence: "Do things that don't ___ until the demand forces you to automate.",
        options: ["scale", "compile", "deploy", "cost"],
        correctIndex: 0,
        explanation:
          "Manual onboarding and hand-run scripts are fine at 10 users — and teach you what to build for 10,000.",
      },
      {
        type: "typing",
        prompt: "The minimum build that tests your riskiest assumption is the ___ (three letters).",
        answer: "mvp",
        placeholder: "type the acronym…",
        explanation: "MVP — minimum viable product; emphasis on the learning, not the product.",
      },
    ],
  },
  {
    title: "Tech Debt on Purpose",
    steps: [
      {
        type: "flashcard",
        cards: [
          {
            front: "What is technical debt?",
            back: "Shortcuts that speed you up now and tax every change later. Like real debt: leverage when chosen, ruin when ignored.",
          },
          {
            front: "Good debt vs bad debt?",
            back: "Good: a documented shortcut in code you may throw away. Bad: unexamined shortcuts in the core you'll build on for years.",
          },
        ],
      },
      {
        type: "multiple_choice",
        prompt: "Where is taking on tech debt most acceptable?",
        options: [
          "Authentication and payments",
          "An experimental feature you may delete next month",
          "The data model everything depends on",
          "Backups",
        ],
        correctIndex: 1,
        explanation:
          "Debt in throwaway code costs nothing if the code gets thrown away. Debt in foundations compounds forever.",
      },
      {
        type: "matching",
        prompt: "Match the shortcut to its verdict.",
        pairs: [
          { left: "Hardcoded config in a prototype", right: "Fine — note it and move on" },
          { left: "No tests around payments", right: "Dangerous debt" },
          { left: "Manual deploy while tiny", right: "Fine for now" },
          { left: "Secrets committed to git", right: "Never acceptable" },
        ],
      },
      {
        type: "typing",
        prompt: "Shortcuts that speed you up now but cost you later are technical ___. (one word)",
        answer: "debt",
        placeholder: "type your answer…",
        explanation: "Tech debt — borrow deliberately, repay before the interest owns you.",
      },
    ],
  },
];
