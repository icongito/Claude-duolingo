import type { LessonBlueprint } from "./types";

/** World 1: Claude Basics. Position 0 is the new-player intro (claude-basics-0). */
export const CLAUDE_BASICS_LESSONS: LessonBlueprint[] = [
  {
    title: "Meet Claude",
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
          '"fix my code"',
          '"Why doesn\'t this work?"',
          '"This Python function should return the largest number in a list but returns the smallest. Here\'s the code: … What\'s wrong?"',
          '"help"',
        ],
        correctIndex: 2,
        explanation:
          "Specific context — what the code should do, what it actually does, and the code itself — gives Claude everything needed for a precise answer.",
      },
      {
        type: "fill_blank",
        prompt: "Complete the golden rule of prompting.",
        sentence: "The more relevant ___ you give Claude, the better its answer will be.",
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
  },
  {
    title: "Conversations & Context Windows",
    steps: [
      {
        type: "flashcard",
        cards: [
          {
            front: "What is a context window?",
            back: "The amount of conversation (your messages, Claude's replies, any files) the model can see at once. Older content eventually falls out of view.",
          },
          {
            front: "Does Claude remember previous chats?",
            back: "Not by default — each new conversation starts fresh. Anything important from a past chat must be pasted in again.",
          },
        ],
      },
      {
        type: "multiple_choice",
        prompt: "You start a brand-new conversation. What does Claude know about your last one?",
        options: [
          "Everything — conversations are linked automatically",
          "Only the last three messages",
          "Nothing, unless you paste it in",
          "Only the code snippets",
        ],
        correctIndex: 2,
        explanation:
          "New conversation, blank slate. If earlier decisions matter, restate them — a short summary works better than the whole transcript.",
      },
      {
        type: "fill_blank",
        prompt: "Complete the sentence about long conversations.",
        sentence:
          "In a very long conversation, the ___ messages are the first to fall outside the context window.",
        options: ["newest", "oldest", "shortest", "longest"],
        correctIndex: 1,
        explanation:
          "Context works like a sliding window: the oldest content drops off first. Re-state anything old that still matters.",
      },
      {
        type: "multiple_choice",
        prompt: "Your chat about a big refactor is getting extremely long and Claude starts forgetting decisions. Best move?",
        options: [
          "Keep going — it will remember eventually",
          "Start a fresh chat with a short summary of the decisions so far",
          "Repeat every message from the start",
          "Type in all caps so it pays attention",
        ],
        correctIndex: 1,
        explanation:
          "A fresh conversation seeded with a tight summary beats a bloated one. You control what context survives.",
      },
      {
        type: "typing",
        prompt: "The window of text a model can see at once is called the context ___. (one word)",
        answer: "window",
        placeholder: "type your answer…",
        explanation: "Context window — the model's working memory for the conversation.",
      },
    ],
  },
  {
    title: "Hallucinations & How to Catch Them",
    steps: [
      {
        type: "flashcard",
        cards: [
          {
            front: "What is a hallucination?",
            back: "A confident-sounding answer that is factually wrong or invented — a nonexistent API, a made-up citation, a wrong date.",
          },
          {
            front: "When are hallucinations most likely?",
            back: "On obscure facts, precise numbers, niche APIs, and anything after the model's training cutoff.",
          },
        ],
      },
      {
        type: "multiple_choice",
        prompt: "Claude names a library function you've never heard of. What's the right instinct?",
        options: [
          "Trust it — Claude sounds confident",
          "Check the official docs before using it",
          "Assume it's wrong and ignore the whole answer",
          "Ask Claude to say it again louder",
        ],
        correctIndex: 1,
        explanation:
          "Confidence is not correctness. A 30-second docs check catches invented functions before they cost you an hour.",
      },
      {
        type: "matching",
        prompt: "Match each situation to the hallucination risk level.",
        pairs: [
          { left: "Explaining what a for-loop does", right: "Low risk — core knowledge" },
          { left: "Citing a specific research paper", right: "High risk — verify the source" },
          { left: "Exact version numbers of a niche library", right: "High risk — check the registry" },
          { left: "General debugging strategy", right: "Low risk — reasoning, not recall" },
        ],
      },
      {
        type: "fill_blank",
        prompt: "Complete the verification rule.",
        sentence: "The more ___ a claim is, the more it deserves an independent check.",
        options: ["boring", "specific", "polite", "recent"],
        correctIndex: 1,
        explanation:
          "Specific claims (exact names, numbers, citations) fail in specific ways. Vague claims are rarely dangerously wrong.",
      },
      {
        type: "typing",
        prompt: "A confidently wrong AI answer is called a ___. (one word)",
        answer: "hallucination",
        placeholder: "type your answer…",
        explanation: "Hallucination — fluent, plausible, and wrong. Verify before you ship it.",
      },
    ],
  },
  {
    title: "Giving Claude Code to Work With",
    steps: [
      {
        type: "multiple_choice",
        prompt: "You want help with a bug. What should you include besides the code?",
        options: [
          "Just the code — it speaks for itself",
          "What you expected, what actually happened, and the exact error message",
          "Your entire repository, every time",
          "A description of your feelings about the bug",
        ],
        correctIndex: 1,
        explanation:
          "Expected vs. actual plus the verbatim error is the debugging triangle. Code alone forces Claude to guess what 'broken' means.",
      },
      {
        type: "fill_blank",
        prompt: "Complete the sentence about error messages.",
        sentence: "Always paste the error message ___, not a paraphrase of it.",
        options: ["verbatim", "translated", "shortened", "from memory"],
        correctIndex: 0,
        explanation:
          "Error messages carry file names, line numbers, and codes. Paraphrasing throws away exactly the details that matter.",
      },
      {
        type: "sorting",
        prompt: "Order this bug report from top to bottom for maximum clarity.",
        correctOrder: [
          "One-line summary of the bug",
          "What you expected to happen",
          "What actually happened, with the exact error",
          "The smallest code snippet that reproduces it",
        ],
      },
      {
        type: "multiple_choice",
        prompt: "Your file is 800 lines but the bug is in one function. What do you share?",
        options: [
          "All 800 lines, unlabeled",
          "The failing function plus anything it calls or depends on",
          "Only the line the error points at",
          "A screenshot of your editor",
        ],
        correctIndex: 1,
        explanation:
          "Share the minimal complete slice: the failing code and its direct dependencies. Too little hides the cause; too much buries it.",
      },
      {
        type: "typing",
        prompt: "The smallest piece of code that still shows a bug is called a minimal ___. (one word)",
        answer: "reproduction",
        placeholder: "type your answer…",
        explanation:
          "A minimal reproduction — the tightest snippet that still fails — is the fastest path to a fix, for humans and for Claude.",
      },
    ],
  },
  {
    title: "Iterating to a Great Answer",
    steps: [
      {
        type: "flashcard",
        cards: [
          {
            front: "Is the first answer the final answer?",
            back: "Rarely. Treat Claude's first response as a draft and steer it: 'shorter', 'more idiomatic', 'now add error handling'.",
          },
          {
            front: "What's the fastest way to improve a mediocre answer?",
            back: "Point at the specific part that's off and say what you want instead — not just 'try again'.",
          },
        ],
      },
      {
        type: "multiple_choice",
        prompt: "Claude's function works but ignores your project's naming style. Best follow-up?",
        options: [
          '"try again"',
          '"That works — now rename to camelCase and match the fetchUser/saveUser naming used elsewhere in this file"',
          '"wrong"',
          "Start a new conversation from scratch",
        ],
        correctIndex: 1,
        explanation:
          "Specific, incremental steering keeps everything Claude already got right and fixes only what's off.",
      },
      {
        type: "fill_blank",
        prompt: "Complete the iteration principle.",
        sentence: 'Vague feedback like "try again" makes Claude change things at ___.',
        options: ["random", "midnight", "scale", "once"],
        correctIndex: 0,
        explanation:
          "Without knowing what was wrong, the model guesses — sometimes discarding the parts you liked. Name what to keep and what to change.",
      },
      {
        type: "matching",
        prompt: "Match each weak follow-up to its stronger version.",
        pairs: [
          { left: '"make it better"', right: '"reduce the nesting — max two levels"' },
          { left: '"it\'s broken"', right: '"it throws TypeError on line 3 when list is empty"' },
          { left: '"too long"', right: '"cut it to under 20 lines, drop the logging"' },
          { left: '"more professional"', right: '"formal tone, no exclamation marks"' },
        ],
      },
      {
        type: "typing",
        prompt: "Refining an answer over several rounds of feedback is called ___. (one word)",
        answer: "iteration",
        placeholder: "type your answer…",
        explanation: "Iteration — each round of specific feedback compounds into a much better result.",
      },
    ],
  },
];
