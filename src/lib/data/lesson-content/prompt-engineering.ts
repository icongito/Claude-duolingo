import type { LessonBlueprint } from "./types";

/** World 2: Prompt Engineering. */
export const PROMPT_ENGINEERING_LESSONS: LessonBlueprint[] = [
  {
    title: "Anatomy of a Strong Prompt",
    steps: [
      {
        type: "flashcard",
        cards: [
          {
            front: "What are the four load-bearing parts of a task prompt?",
            back: "Goal (what you want), context (what Claude needs to know), constraints (what must/must not happen), and output format (what the answer should look like).",
          },
          {
            front: "Why state the output format?",
            back: "Because 'a table of the top 5' and 'a paragraph about several' are both valid readings of a vague ask. Format kills ambiguity.",
          },
        ],
      },
      {
        type: "sorting",
        prompt: "Order these parts of a well-structured prompt, top to bottom.",
        correctOrder: [
          "The goal, in one sentence",
          "Context and relevant materials",
          "Constraints and rules",
          "The output format you want",
        ],
      },
      {
        type: "multiple_choice",
        prompt: "Which prompt is strongest?",
        options: [
          '"Write about databases"',
          '"Write something interesting about SQL, maybe indexes?"',
          '"Explain when to add a database index, for a junior dev, in under 150 words, ending with one rule of thumb"',
          '"You are the world\'s best DBA. Write about indexes."',
        ],
        correctIndex: 2,
        explanation:
          "Goal, audience, length constraint, and output shape — every part of that prompt removes a way the answer could miss.",
      },
      {
        type: "fill_blank",
        prompt: "Complete the sentence about constraints.",
        sentence: "Constraints work best stated ___, before Claude starts answering.",
        options: ["afterwards", "up front", "in a follow-up", "never"],
        correctIndex: 1,
        explanation:
          "Rules given up front shape the whole answer. Rules given after force a rewrite of something already off-target.",
      },
      {
        type: "typing",
        prompt: "Goal, context, constraints, and output ___ — the four parts of a task prompt. (one word)",
        answer: "format",
        placeholder: "type your answer…",
        explanation: "Output format: the shape you want back — list, table, JSON, tone, length.",
      },
    ],
  },
  {
    title: "Few-Shot: Teaching by Example",
    steps: [
      {
        type: "flashcard",
        cards: [
          {
            front: "What is few-shot prompting?",
            back: "Showing 1-3 worked examples of input → desired output inside your prompt, so the model infers the pattern instead of guessing it.",
          },
          {
            front: "When do examples beat descriptions?",
            back: "Whenever the format or style is hard to describe but easy to show: naming conventions, tone, tricky edge-case handling.",
          },
        ],
      },
      {
        type: "multiple_choice",
        prompt: "You need product titles rewritten in a very specific house style. Fastest reliable approach?",
        options: [
          "Describe the style in three paragraphs of adjectives",
          "Show two before → after examples and say 'match this pattern'",
          "Ask Claude to invent its own style",
          "Rewrite them all yourself",
        ],
        correctIndex: 1,
        explanation:
          "Two good examples define a style more precisely than any pile of adjectives. Show, don't describe.",
      },
      {
        type: "fill_blank",
        prompt: "Complete the warning about examples.",
        sentence: "The model copies your examples' ___ as well as their format — sloppy examples teach sloppy output.",
        options: ["length", "flaws", "fonts", "order"],
        correctIndex: 1,
        explanation:
          "Examples are the strongest signal in the prompt. If one has a typo or breaks your own rule, expect that mistake to be learned.",
      },
      {
        type: "matching",
        prompt: "Match the technique to the situation it fits best.",
        pairs: [
          { left: "Zero-shot (no examples)", right: "Common task the model already knows well" },
          { left: "One example", right: "Simple custom format" },
          { left: "Three varied examples", right: "Tricky format with edge cases" },
          { left: "Counter-example ('not like this')", right: "A failure mode keeps recurring" },
        ],
      },
      {
        type: "typing",
        prompt: "Prompting with worked examples is called ___-shot prompting. (one word)",
        answer: "few",
        placeholder: "type your answer…",
        explanation: "Few-shot — a handful of examples that pin down the exact pattern you want.",
      },
    ],
  },
  {
    title: "Roles & Audience",
    steps: [
      {
        type: "multiple_choice",
        prompt: "What does a role like 'You are a security reviewer' actually change?",
        options: [
          "Nothing — it's decoration",
          "It biases what the model pays attention to and how it frames the answer",
          "It unlocks hidden capabilities",
          "It makes answers longer",
        ],
        correctIndex: 1,
        explanation:
          "A role is an attention lens: 'security reviewer' surfaces injection risks and authentication gaps that a generic reading would skim past.",
      },
      {
        type: "fill_blank",
        prompt: "Complete the sentence about audience.",
        sentence: "Naming the ___ ('explain to a new hire') sets vocabulary and depth better than 'keep it simple'.",
        options: ["audience", "deadline", "model", "author"],
        correctIndex: 0,
        explanation:
          "'Simple' is relative; 'a new hire who knows Python but not our stack' is concrete. Audience defines the level.",
      },
      {
        type: "matching",
        prompt: "Match the role to the output it biases toward.",
        pairs: [
          { left: "Code reviewer", right: "Bugs, edge cases, style issues" },
          { left: "Technical writer", right: "Clear structure, defined terms" },
          { left: "Skeptical CTO", right: "Costs, risks, alternatives" },
          { left: "Pair programmer", right: "Incremental, conversational help" },
        ],
      },
      {
        type: "multiple_choice",
        prompt: "You want an explanation your non-technical manager can forward. Which prompt fits?",
        options: [
          '"Explain OAuth"',
          '"Explain OAuth in RFC-level detail"',
          '"Explain OAuth to a non-technical manager in 3 short paragraphs, no jargon, one analogy"',
          '"Explain OAuth like I\'m five, but also cover PKCE"',
        ],
        correctIndex: 2,
        explanation:
          "Audience, length, jargon rule, and one analogy — the answer is forwardable exactly as it lands.",
      },
      {
        type: "typing",
        prompt: "Assigning a persona like 'you are a code reviewer' is called giving the model a ___. (one word)",
        answer: "role",
        placeholder: "type your answer…",
        explanation: "A role focuses the model's attention on the concerns that persona cares about.",
      },
    ],
  },
  {
    title: "Reusable Prompt Templates",
    steps: [
      {
        type: "flashcard",
        cards: [
          {
            front: "What makes a prompt a template?",
            back: "Placeholders like {topic} or {code} for the parts that change, with the role, rules, and format locked in place.",
          },
          {
            front: "Why bother templating?",
            back: "Consistency. The same template produces the same shape of output every run — across your team, not just for you.",
          },
        ],
      },
      {
        type: "multiple_choice",
        prompt: "A teammate keeps getting different blog-post formats from the same rough ask. The fix?",
        options: [
          "Tell them to prompt harder",
          "A shared template locking tone, audience, structure, and length, with a {topic} placeholder",
          "A longer model",
          "Retyping the request until it works",
        ],
        correctIndex: 1,
        explanation:
          "Variance comes from re-improvising the ask. A template freezes everything that shouldn't change.",
      },
      {
        type: "fill_blank",
        prompt: "Complete the templating rule.",
        sentence: "Everything that should be identical between runs belongs in the template; everything that varies belongs in a ___.",
        options: ["comment", "placeholder", "footnote", "separate chat"],
        correctIndex: 1,
        explanation: "{placeholders} mark the variable parts. The rest is locked structure.",
      },
      {
        type: "sorting",
        prompt: "Order the steps of building a template from scratch.",
        correctOrder: [
          "Write one prompt that produces a great result",
          "Mark the parts that change as {placeholders}",
          "Add the rules you keep repeating in follow-ups",
          "Share it so the whole team gets the same output shape",
        ],
      },
      {
        type: "typing",
        prompt: "The {curly-brace} slot for variable content in a template is called a ___. (one word)",
        answer: "placeholder",
        placeholder: "type your answer…",
        explanation: "Placeholders keep templates reusable: swap the content, keep the structure.",
      },
    ],
  },
  {
    title: "Debugging a Bad Prompt",
    steps: [
      {
        type: "multiple_choice",
        prompt: "The answer is good but in the wrong format every time. Where's the bug, most likely?",
        options: [
          "The model is broken",
          "Your prompt never actually states the format",
          "You need to be more polite",
          "The topic is too hard",
        ],
        correctIndex: 1,
        explanation:
          "Recurring format misses usually trace to a format that lives in your head, not in the prompt. Read your prompt as a stranger would.",
      },
      {
        type: "matching",
        prompt: "Match the failure symptom to the usual prompt bug.",
        pairs: [
          { left: "Right content, wrong shape", right: "No output format specified" },
          { left: "Confident nonsense on niche facts", right: "Asking for recall instead of providing sources" },
          { left: "Ignores one of your rules", right: "Rules buried mid-paragraph, not listed" },
          { left: "Generic, hedge-everything answer", right: "No audience or role given" },
        ],
      },
      {
        type: "fill_blank",
        prompt: "Complete the debugging principle.",
        sentence: "Change ___ thing at a time when iterating on a prompt, or you won't know what fixed it.",
        options: ["every", "one", "no", "the last"],
        correctIndex: 1,
        explanation:
          "Prompt debugging is still debugging: isolate the variable. Wholesale rewrites destroy the signal.",
      },
      {
        type: "multiple_choice",
        prompt: "Claude keeps including apologies you don't want. The strongest fix?",
        options: [
          '"be less apologetic" buried in paragraph three',
          "A numbered rule: '1. Never apologize. Start directly with the answer.'",
          "Asking twice as nicely",
          "Accepting your fate",
        ],
        correctIndex: 1,
        explanation:
          "Short, numbered, unambiguous rules at the top get followed. Soft requests buried in prose get skimmed.",
      },
      {
        type: "typing",
        prompt: "When a prompt fails, change one ___ at a time to find what fixed it. (one word)",
        answer: "thing",
        placeholder: "type your answer…",
        explanation: "One change per run — the scientific method applies to prompts too.",
      },
    ],
  },
];
