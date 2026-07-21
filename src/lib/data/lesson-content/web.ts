import type { LessonBlueprint } from "./types";

/** World 9: React. */
export const REACT_LESSONS: LessonBlueprint[] = [
  {
    title: "Components & Props",
    steps: [
      {
        type: "flashcard",
        cards: [
          {
            front: "What is a component?",
            back: "A function that takes props and returns JSX. The whole UI is a tree of them.",
          },
          {
            front: "What are props?",
            back: "Read-only inputs passed from parent to child. A component never modifies its own props.",
          },
        ],
      },
      {
        type: "multiple_choice",
        prompt: "A child component needs to change data owned by its parent. The React way?",
        options: [
          "Mutate the prop directly",
          "The parent passes down a callback the child calls",
          "Use a global variable",
          "Reload the page",
        ],
        correctIndex: 1,
        explanation:
          "Data flows down as props; changes flow up through callbacks. That one-way loop is the core React pattern.",
      },
      {
        type: "fill_blank",
        prompt: "Complete the rule about props.",
        sentence: "Props are ___ — a component must never assign to them.",
        options: ["optional", "read-only", "global", "async"],
        correctIndex: 1,
        explanation: "Mutating props breaks the data flow. The owner of the state makes the changes.",
      },
      {
        type: "code",
        prompt: "Write a `Greeting` component that takes a `name` prop and renders an <h1> saying Hello to that name.",
        language: "javascript",
        starterCode: "// your component here\n",
        mustInclude: ["function Greeting", "name", "<h1>"],
        hint: "function Greeting({ name }) { return <h1>Hello, {name}</h1> }",
        explanation: "Destructure the prop, interpolate it in JSX — the smallest useful component.",
      },
      {
        type: "typing",
        prompt: "Read-only inputs a parent passes to a child component are called ___. (one word)",
        answer: "props",
        placeholder: "type your answer…",
        explanation: "Props — the arguments of the component function.",
      },
    ],
  },
  {
    title: "State & useState",
    steps: [
      {
        type: "flashcard",
        cards: [
          {
            front: "What is state?",
            back: "Data owned by a component that changes over time. When state changes, React re-renders that component.",
          },
          {
            front: "What does useState return?",
            back: "A pair: the current value and a setter — `const [count, setCount] = useState(0)`.",
          },
        ],
      },
      {
        type: "multiple_choice",
        prompt: "Why does `count = count + 1` not update the UI?",
        options: [
          "JavaScript can't add numbers",
          "React only re-renders when you call the setter, like setCount(count + 1)",
          "count is secretly a string",
          "You need jQuery for that",
        ],
        correctIndex: 1,
        explanation:
          "React doesn't watch variables. The setter is what tells React 'state changed, re-render'.",
      },
      {
        type: "fill_blank",
        prompt: "Complete the sentence about re-renders.",
        sentence: "Calling a state setter schedules a ___ of that component with the new value.",
        options: ["reload", "re-render", "restart", "redirect"],
        correctIndex: 1,
        explanation: "Set state → re-render → the JSX reflects the new value. That's the loop.",
      },
      {
        type: "multiple_choice",
        prompt: "Where should the state live when two sibling components need the same data?",
        options: [
          "Duplicated in both siblings",
          "In their closest common parent, passed down as props",
          "In localStorage",
          "In a comment",
        ],
        correctIndex: 1,
        explanation:
          "'Lifting state up': the shared owner is the closest common ancestor; both siblings receive it as props.",
      },
      {
        type: "typing",
        prompt: "The hook that gives a component local state is use___. (one word)",
        answer: "state",
        placeholder: "use…",
        explanation: "useState — value plus setter, the first hook everyone learns.",
      },
    ],
  },
  {
    title: "useEffect Without Tears",
    steps: [
      {
        type: "flashcard",
        cards: [
          {
            front: "What is useEffect for?",
            back: "Synchronizing with things outside React: fetching data, subscriptions, timers, the DOM.",
          },
          {
            front: "What does the dependency array control?",
            back: "When the effect re-runs: no array = every render, [] = once on mount, [x] = whenever x changes.",
          },
        ],
      },
      {
        type: "multiple_choice",
        prompt: "`useEffect(() => { fetchUser(id) })` with NO dependency array does what?",
        options: [
          "Fetches once",
          "Fetches on every single render — usually an accidental loop",
          "Never fetches",
          "Fetches only when id changes",
        ],
        correctIndex: 1,
        explanation:
          "No array means run after every render. If the fetch sets state, that render triggers another fetch: the classic infinite loop.",
      },
      {
        type: "matching",
        prompt: "Match the dependency array to the behavior.",
        pairs: [
          { left: "no array", right: "Runs after every render" },
          { left: "[]", right: "Runs once on mount" },
          { left: "[userId]", right: "Runs when userId changes" },
          { left: "return () => …", right: "Cleanup before re-run/unmount" },
        ],
      },
      {
        type: "code",
        prompt: "Fix this effect so it fetches only when userId changes: `useEffect(() => { fetchUser(userId) })`",
        language: "javascript",
        starterCode: "useEffect(() => {\n  fetchUser(userId)\n})\n",
        mustInclude: ["[userId]"],
        hint: "Add a dependency array containing userId as the second argument.",
        explanation: "`}, [userId])` — the array is the contract for when the effect re-runs.",
      },
      {
        type: "typing",
        prompt: "The array that controls when an effect re-runs is the ___ array. (one word)",
        answer: "dependency",
        placeholder: "type your answer…",
        explanation: "Dependency array — list everything from component scope the effect uses.",
      },
    ],
  },
  {
    title: "Lists, Keys & Conditional UI",
    steps: [
      {
        type: "multiple_choice",
        prompt: "Why does React want a `key` on each item when you map a list?",
        options: [
          "For CSS styling",
          "So it can match old and new items and update the DOM minimally",
          "It's just a lint rule with no effect",
          "To sort the list",
        ],
        correctIndex: 1,
        explanation:
          "Keys are identity. With stable keys React moves/updates the right rows instead of rebuilding — and state stays with the right item.",
      },
      {
        type: "multiple_choice",
        prompt: "Why is using the array index as key risky for a reorderable list?",
        options: [
          "Indexes are too slow",
          "After a reorder, item state can stick to the position instead of the item",
          "React forbids numbers as keys",
          "It isn't risky",
        ],
        correctIndex: 1,
        explanation:
          "Reordering changes every index, so React thinks every row 'changed'. Use a stable id from the data.",
      },
      {
        type: "matching",
        prompt: "Match the JSX pattern to what it renders.",
        pairs: [
          { left: "{isOpen && <Modal />}", right: "Modal only when isOpen" },
          { left: "{error ? <Err/> : <Ok/>}", right: "One of two branches" },
          { left: "{items.map(i => <Row key={i.id}/>)}", right: "A row per item" },
          { left: "{count > 0 && <Badge/>}", right: "Badge only when count positive" },
        ],
      },
      {
        type: "fill_blank",
        prompt: "Complete the key rule.",
        sentence: "Keys should be ___ across renders — an id from your data, not Math.random().",
        options: ["unique and stable", "random", "sequential", "short"],
        correctIndex: 0,
        explanation:
          "A key that changes every render defeats the purpose: React sees a brand-new item each time.",
      },
      {
        type: "typing",
        prompt: "The prop that gives each list item a stable identity is ___. (one word)",
        answer: "key",
        placeholder: "type your answer…",
        explanation: "key — not a real prop your component receives, but React's identity handle.",
      },
    ],
  },
];

/** World 10: Next.js. */
export const NEXTJS_LESSONS: LessonBlueprint[] = [
  {
    title: "File-Based Routing",
    steps: [
      {
        type: "flashcard",
        cards: [
          {
            front: "How does the App Router map URLs?",
            back: "Folders under app/ are URL segments; a page.tsx makes the segment routable. app/blog/page.tsx → /blog.",
          },
          {
            front: "What is a dynamic segment?",
            back: "A bracketed folder like app/blog/[slug]/page.tsx — it matches /blog/anything and receives slug as a param.",
          },
        ],
      },
      {
        type: "matching",
        prompt: "Match the file to the URL it serves.",
        pairs: [
          { left: "app/page.tsx", right: "/" },
          { left: "app/pricing/page.tsx", right: "/pricing" },
          { left: "app/blog/[slug]/page.tsx", right: "/blog/hello-world" },
          { left: "app/blog/layout.tsx", right: "Wraps every /blog page" },
        ],
      },
      {
        type: "multiple_choice",
        prompt: "What does layout.tsx do?",
        options: [
          "Nothing — it's decorative",
          "Wraps all pages in its segment with shared UI that persists across navigation",
          "Redirects users",
          "Defines the database schema",
        ],
        correctIndex: 1,
        explanation:
          "Layouts nest: the root layout wraps everything, segment layouts wrap their subtree, and they don't re-render on navigation within.",
      },
      {
        type: "fill_blank",
        prompt: "Complete the routing rule.",
        sentence: "A folder becomes a real route only when it contains a ___ file.",
        options: ["page", "route", "index", "readme"],
        correctIndex: 0,
        explanation: "page.tsx (or route.ts for APIs) is what makes a segment publicly reachable.",
      },
      {
        type: "typing",
        prompt: "A folder named [slug] creates a ___ route segment. (one word)",
        answer: "dynamic",
        placeholder: "type your answer…",
        explanation: "Dynamic segments turn URL parts into params your page receives.",
      },
    ],
  },
  {
    title: "Server vs. Client Components",
    steps: [
      {
        type: "flashcard",
        cards: [
          {
            front: "What are components by default in the App Router?",
            back: "Server Components: they render on the server, can read data directly, and ship no JS for themselves to the browser.",
          },
          {
            front: "When do you need 'use client'?",
            back: "For interactivity: useState, useEffect, event handlers, browser APIs. That directive marks the client boundary.",
          },
        ],
      },
      {
        type: "multiple_choice",
        prompt: "A component uses useState. What must be true?",
        options: [
          "It must be async",
          "It (or a parent) must have 'use client' at the top of the file",
          "It must live in pages/",
          "Nothing special",
        ],
        correctIndex: 1,
        explanation:
          "Hooks and handlers are client-side features. Without the directive, the build errors immediately.",
      },
      {
        type: "matching",
        prompt: "Match the job to the right component type.",
        pairs: [
          { left: "Fetching from the database", right: "Server Component" },
          { left: "A dropdown with open/close state", right: "Client Component" },
          { left: "Rendering markdown to HTML", right: "Server Component" },
          { left: "Listening to onClick", right: "Client Component" },
        ],
      },
      {
        type: "fill_blank",
        prompt: "Complete the performance rule.",
        sentence: "Push 'use client' as ___ in the tree as possible — small interactive leaves, big server shell.",
        options: ["high", "low", "early", "rarely"],
        correctIndex: 1,
        explanation:
          "Everything under a client boundary ships JS. Keep boundaries at the leaves and the bundle stays small.",
      },
      {
        type: "typing",
        prompt: "The directive that marks a component as client-side is 'use ___'. (one word)",
        answer: "client",
        placeholder: "'use …'",
        explanation: "'use client' — the explicit boundary between server and browser worlds.",
      },
    ],
  },
  {
    title: "Data & Rendering Modes",
    steps: [
      {
        type: "multiple_choice",
        prompt: "A marketing page whose content changes only at deploy time should be…",
        options: [
          "Rendered on every request",
          "Statically generated at build time",
          "Client-only",
          "An iframe",
        ],
        correctIndex: 1,
        explanation:
          "Static generation renders once at build and serves instantly from CDN. Per-request rendering is for genuinely per-user or per-moment data.",
      },
      {
        type: "matching",
        prompt: "Match the page to its natural rendering mode.",
        pairs: [
          { left: "Docs page", right: "Static at build" },
          { left: "Personal dashboard", right: "Dynamic per request" },
          { left: "Blog that updates hourly", right: "Static with revalidation" },
          { left: "Search results", right: "Dynamic per request" },
        ],
      },
      {
        type: "fill_blank",
        prompt: "Complete the sentence about Server Components and data.",
        sentence: "A Server Component can be declared ___ and await data directly in its body.",
        options: ["async", "static", "pure", "global"],
        correctIndex: 0,
        explanation:
          "`async function Page() { const data = await db.query(…) }` — no useEffect, no loading spinner for the first paint.",
      },
      {
        type: "sorting",
        prompt: "Order what happens on a request to a dynamic server-rendered page.",
        correctOrder: [
          "Request hits the server",
          "Server Components fetch their data",
          "HTML is rendered and streamed to the browser",
          "Client Components hydrate for interactivity",
        ],
      },
      {
        type: "typing",
        prompt: "Re-generating a static page after a time interval is called ___. (one word)",
        answer: "revalidation",
        placeholder: "type your answer…",
        explanation: "Revalidation — static speed with periodically fresh content.",
      },
    ],
  },
];

/** World 11: JavaScript. */
export const JAVASCRIPT_LESSONS: LessonBlueprint[] = [
  {
    title: "let, const & Scope",
    steps: [
      {
        type: "flashcard",
        cards: [
          {
            front: "let vs const?",
            back: "const forbids reassignment of the binding; let allows it. Both are block-scoped. Default to const.",
          },
          {
            front: "Does const make objects immutable?",
            back: "No — you can still mutate the object's contents. const only locks which object the name points at.",
          },
        ],
      },
      {
        type: "multiple_choice",
        prompt: "`const user = {name: 'A'}; user.name = 'B'` — what happens?",
        options: [
          "TypeError — const blocks it",
          "It works: const protects the binding, not the object's fields",
          "Silent no-op",
          "The object is cloned",
        ],
        correctIndex: 1,
        explanation:
          "Reassigning `user = {}` would throw; mutating a property is fine. Different protections.",
      },
      {
        type: "fill_blank",
        prompt: "Complete the scoping fact.",
        sentence: "let and const are ___-scoped; the old var is function-scoped.",
        options: ["block", "file", "global", "loop"],
        correctIndex: 0,
        explanation: "A { } block is the boundary — which is why let in a for-loop behaves sanely and var doesn't.",
      },
      {
        type: "multiple_choice",
        prompt: "Best default for a variable you never reassign?",
        options: ["var", "let", "const", "window."],
        correctIndex: 2,
        explanation:
          "const documents intent and turns accidental reassignment into an immediate error.",
      },
      {
        type: "typing",
        prompt: "The keyword for a block-scoped binding that can't be reassigned is ___. (one word)",
        answer: "const",
        placeholder: "type the keyword…",
        explanation: "const — your default; reach for let only when reassignment is the point.",
      },
    ],
  },
  {
    title: "Arrays: map, filter, reduce",
    steps: [
      {
        type: "matching",
        prompt: "Match the method to what it returns.",
        pairs: [
          { left: "map", right: "Same length, transformed items" },
          { left: "filter", right: "Only the items passing a test" },
          { left: "reduce", right: "One accumulated value" },
          { left: "find", right: "The first matching item (or undefined)" },
        ],
      },
      {
        type: "multiple_choice",
        prompt: "You need the total of `prices = [5, 10, 20]`. Which fits best?",
        options: [
          "prices.map(p => p + p)",
          "prices.filter(p => p > 0)",
          "prices.reduce((sum, p) => sum + p, 0)",
          "prices.find(p => p === 35)",
        ],
        correctIndex: 2,
        explanation:
          "Many values → one value is exactly reduce. The 0 is the starting accumulator.",
      },
      {
        type: "code",
        prompt: "Given `const nums = [1,2,3,4]`, produce a new array of only the even numbers, doubled. Chain two methods.",
        language: "javascript",
        starterCode: "const nums = [1, 2, 3, 4]\nconst result = \n",
        mustInclude: [".filter", ".map"],
        hint: "filter for n % 2 === 0 first, then map n => n * 2.",
        explanation: "filter narrows, map transforms: `nums.filter(n => n % 2 === 0).map(n => n * 2)`.",
      },
      {
        type: "fill_blank",
        prompt: "Complete the immutability fact.",
        sentence: "map and filter return ___ arrays — the original is untouched.",
        options: ["new", "sorted", "frozen", "empty"],
        correctIndex: 0,
        explanation: "Non-mutating by design, which is exactly why React state updates love them.",
      },
      {
        type: "typing",
        prompt: "The array method that boils many values down to one is ___. (one word)",
        answer: "reduce",
        placeholder: "type the method…",
        explanation: "reduce — accumulator in, accumulator out, one final value.",
      },
    ],
  },
  {
    title: "async/await & Promises",
    steps: [
      {
        type: "flashcard",
        cards: [
          {
            front: "What is a Promise?",
            back: "An object representing a value that isn't ready yet — it will either fulfill with a value or reject with an error.",
          },
          {
            front: "What does await do?",
            back: "Pauses the async function until the promise settles, then gives you the fulfilled value (or throws the rejection).",
          },
        ],
      },
      {
        type: "multiple_choice",
        prompt: "Where do errors from an awaited fetch go?",
        options: [
          "They vanish",
          "Into the surrounding try/catch",
          "Into console.log automatically",
          "Into localStorage",
        ],
        correctIndex: 1,
        explanation:
          "await turns rejection into a throw — so normal try/catch is the error path for async code.",
      },
      {
        type: "multiple_choice",
        prompt: "Two independent API calls. Which is fastest and still correct?",
        options: [
          "await a; await b; (sequential)",
          "const [x, y] = await Promise.all([a, b])",
          "Nesting .then five levels deep",
          "setTimeout between them",
        ],
        correctIndex: 1,
        explanation:
          "Independent work should overlap. Promise.all starts both, waits once, halves the latency.",
      },
      {
        type: "code",
        prompt: "Write an async function `getUser` that fetches '/api/user', awaits the response, and returns `await res.json()`.",
        language: "javascript",
        starterCode: "// your function here\n",
        mustInclude: ["async", "await fetch", "res.json()"],
        hint: "async function getUser() { const res = await fetch('/api/user'); return await res.json() }",
        explanation: "Two awaits: one for the response headers, one for parsing the body.",
      },
      {
        type: "typing",
        prompt: "The keyword that pauses an async function until a promise settles is ___. (one word)",
        answer: "await",
        placeholder: "type the keyword…",
        explanation: "await — async code that reads like sync code.",
      },
    ],
  },
  {
    title: "Truthiness, ?? and ?.",
    steps: [
      {
        type: "multiple_choice",
        prompt: "`user.profile.name` throws when profile is undefined. The safe version?",
        options: ["user!profile!name", "user?.profile?.name", "user&&profile&&name", "try{name}finally{}"],
        correctIndex: 1,
        explanation:
          "Optional chaining short-circuits to undefined at the first missing link instead of throwing.",
      },
      {
        type: "multiple_choice",
        prompt: "`count ?? 10` vs `count || 10` — when do they differ?",
        options: [
          "Never",
          "When count is 0 or '': || replaces them, ?? keeps them",
          "Only in strict mode",
          "When count is null",
        ],
        correctIndex: 1,
        explanation:
          "|| treats every falsy value as missing; ?? only null/undefined. For numeric settings, ?? is almost always what you meant.",
      },
      {
        type: "matching",
        prompt: "Match the expression to its value.",
        pairs: [
          { left: "0 || 5", right: "5" },
          { left: "0 ?? 5", right: "0" },
          { left: "undefined ?? 'x'", right: "'x'" },
          { left: "null?.length", right: "undefined" },
        ],
      },
      {
        type: "fill_blank",
        prompt: "Complete the falsy list.",
        sentence: "The falsy values are false, 0, '', null, undefined, and ___.",
        options: ["[]", "NaN", "{}", "'0'"],
        correctIndex: 1,
        explanation: "NaN rounds out the list. Empty arrays and objects are truthy — a classic gotcha.",
      },
      {
        type: "typing",
        prompt: "The ?. operator is called optional ___. (one word)",
        answer: "chaining",
        placeholder: "type your answer…",
        explanation: "Optional chaining — the crash-proof way through maybe-missing objects.",
      },
    ],
  },
];

/** World 12: TypeScript. */
export const TYPESCRIPT_LESSONS: LessonBlueprint[] = [
  {
    title: "Types 101",
    steps: [
      {
        type: "flashcard",
        cards: [
          {
            front: "What does TypeScript add to JavaScript?",
            back: "Static types checked at compile time. Type errors surface in the editor and build — before users see them.",
          },
          {
            front: "What happens to types at runtime?",
            back: "They're erased. TypeScript compiles to plain JavaScript; types are a development-time safety net.",
          },
        ],
      },
      {
        type: "matching",
        prompt: "Match the annotation to what it accepts.",
        pairs: [
          { left: "string[]", right: "An array of strings" },
          { left: "number | null", right: "A number or null" },
          { left: "'small' | 'large'", right: "Exactly one of two strings" },
          { left: "() => void", right: "A function returning nothing" },
        ],
      },
      {
        type: "code",
        prompt: "Define an interface `User` with `id: number` and `name: string`, then declare `const u: User` with valid values.",
        language: "typescript",
        starterCode: "// your code here\n",
        mustInclude: ["interface User", "id: number", "name: string"],
        hint: "interface User { id: number; name: string } then const u: User = { id: 1, name: 'Ada' }",
        explanation: "Interfaces name object shapes so every use site agrees on the fields.",
      },
      {
        type: "fill_blank",
        prompt: "Complete the sentence about when types are checked.",
        sentence: "TypeScript catches type errors at ___ time, before the code runs.",
        options: ["run", "compile", "deploy", "review"],
        correctIndex: 1,
        explanation: "The compiler (and your editor) check as you type — the cheapest place to catch bugs.",
      },
      {
        type: "typing",
        prompt: "The keyword that names an object shape is ___. (one word)",
        answer: "interface",
        placeholder: "type the keyword…",
        explanation: "interface (or type) — a named contract for object shapes.",
      },
    ],
  },
  {
    title: "Escaping any",
    steps: [
      {
        type: "multiple_choice",
        prompt: "What does typing a value as `any` actually do?",
        options: [
          "Makes it faster",
          "Turns off type checking for everything you do with it",
          "Converts it to a string",
          "Nothing",
        ],
        correctIndex: 1,
        explanation:
          "any is an off-switch: typos, wrong calls, impossible operations — all silently allowed, all shipped.",
      },
      {
        type: "flashcard",
        cards: [
          {
            front: "any vs unknown?",
            back: "Both accept anything, but unknown refuses to be used until you narrow it. It's the type-safe 'I don't know yet'.",
          },
          {
            front: "How do you narrow unknown?",
            back: "typeof checks, instanceof, or a validation library — prove the shape, then use it.",
          },
        ],
      },
      {
        type: "multiple_choice",
        prompt: "JSON from an external API should be typed as…",
        options: [
          "any, for speed",
          "unknown, then validated/narrowed before use",
          "string",
          "never",
        ],
        correctIndex: 1,
        explanation:
          "External data is untrusted by definition. unknown forces the validation step any would let you skip.",
      },
      {
        type: "fill_blank",
        prompt: "Complete the comparison.",
        sentence: "`any` disables the type checker; `unknown` makes you ___ the type before using it.",
        options: ["prove", "guess", "cast", "ignore"],
        correctIndex: 0,
        explanation: "Narrowing is proving. That's the entire difference — and the entire point.",
      },
      {
        type: "typing",
        prompt: "The type-safe alternative to any for values of unknown shape is ___. (one word)",
        answer: "unknown",
        placeholder: "type the type…",
        explanation: "unknown — accepts everything, permits nothing until narrowed.",
      },
    ],
  },
  {
    title: "Unions & Narrowing",
    steps: [
      {
        type: "flashcard",
        cards: [
          {
            front: "What is a discriminated union?",
            back: "A union of object types sharing a literal tag field — `{kind:'ok', data} | {kind:'error', message}` — switch on the tag to narrow.",
          },
          {
            front: "Why are they so good for app state?",
            back: "Impossible states become unrepresentable: you can't have both data and an error when the union says pick one.",
          },
        ],
      },
      {
        type: "multiple_choice",
        prompt: "Inside `if (typeof x === 'string')`, what does TypeScript know about x?",
        options: [
          "Nothing new",
          "x is a string in that block — string methods are safe",
          "x is any",
          "x is null",
        ],
        correctIndex: 1,
        explanation:
          "That's narrowing: control flow refines the type, and the compiler tracks it per-branch.",
      },
      {
        type: "code",
        prompt: "Write a type `Result` as a discriminated union: `{ kind: 'ok'; value: number }` or `{ kind: 'error'; message: string }`.",
        language: "typescript",
        starterCode: "// your type here\n",
        mustInclude: ["kind: 'ok'", "kind: 'error'", "|"],
        hint: "type Result = { kind: 'ok'; value: number } | { kind: 'error'; message: string }",
        explanation: "The shared literal `kind` field is the discriminant a switch can narrow on.",
      },
      {
        type: "fill_blank",
        prompt: "Complete the sentence about narrowing.",
        sentence: "Checks like typeof and the discriminant field let the compiler ___ a union to one branch.",
        options: ["widen", "narrow", "erase", "cast"],
        correctIndex: 1,
        explanation: "Narrowing — from 'could be either' to 'is exactly this', proven by control flow.",
      },
      {
        type: "typing",
        prompt: "A union of object types distinguished by a literal tag field is a ___ union. (one word)",
        answer: "discriminated",
        placeholder: "type your answer…",
        explanation: "Discriminated unions — TypeScript's best tool for modeling states.",
      },
    ],
  },
];
