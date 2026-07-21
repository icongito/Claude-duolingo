import type { LessonBlueprint } from "./types";

/** World 7: Linux. */
export const LINUX_LESSONS: LessonBlueprint[] = [
  {
    title: "The Filesystem Tree",
    steps: [
      {
        type: "matching",
        prompt: "Match the directory to what lives there.",
        pairs: [
          { left: "/etc", right: "System configuration files" },
          { left: "/var/log", right: "Log files" },
          { left: "/home", right: "Users' personal directories" },
          { left: "/tmp", right: "Scratch files, cleared on reboot" },
        ],
      },
      {
        type: "multiple_choice",
        prompt: "Where would you look first for a service's config file?",
        options: ["/tmp", "/etc", "/home", "/proc"],
        correctIndex: 1,
        explanation: "/etc is the conventional home of system-wide configuration — nginx, ssh, cron all keep config there.",
      },
      {
        type: "fill_blank",
        prompt: "Complete the sentence about the root directory.",
        sentence: "Every path in Linux starts from the single root directory, written ___.",
        options: ["~", "/", "C:\\", "."],
        correctIndex: 1,
        explanation: "One tree, one root: /. Drives and disks mount into it rather than existing beside it.",
      },
      {
        type: "typing",
        prompt: "The directory where log files conventionally live is /var/___. (one word)",
        answer: "log",
        placeholder: "/var/…",
        explanation: "/var/log — the first place to look when a service is misbehaving.",
      },
    ],
  },
  {
    title: "Services with systemd",
    steps: [
      {
        type: "flashcard",
        cards: [
          {
            front: "What is systemd?",
            back: "The init system most distros use to start, stop, and supervise services (units) — controlled with systemctl.",
          },
          {
            front: "How do you read a service's logs?",
            back: "journalctl -u <service> — add -f to follow live output.",
          },
        ],
      },
      {
        type: "matching",
        prompt: "Match the command to what it does.",
        pairs: [
          { left: "systemctl status nginx", right: "Is it running, and recent logs" },
          { left: "systemctl restart nginx", right: "Stop and start it" },
          { left: "systemctl enable nginx", right: "Start automatically on boot" },
          { left: "journalctl -u nginx -f", right: "Follow its logs live" },
        ],
      },
      {
        type: "multiple_choice",
        prompt: "A service crashed after a config change. Sensible first command?",
        options: [
          "rm -rf /etc",
          "systemctl status <service> to see the error it died with",
          "Reboot immediately",
          "Reinstall the OS",
        ],
        correctIndex: 1,
        explanation:
          "status shows the exit state and the last log lines — usually the config error is right there.",
      },
      {
        type: "typing",
        prompt: "The command-line tool for managing systemd services is ___. (one word)",
        answer: "systemctl",
        placeholder: "type the command…",
        explanation: "systemctl — status, start, stop, restart, enable.",
      },
    ],
  },
  {
    title: "Packages & Updates",
    steps: [
      {
        type: "flashcard",
        cards: [
          {
            front: "What does a package manager do?",
            back: "Installs, upgrades, and removes software plus its dependencies from trusted repositories — apt on Debian/Ubuntu, dnf on Fedora.",
          },
          {
            front: "Why not just download binaries from the web?",
            back: "Repos give you signatures, dependency resolution, and one command to update everything.",
          },
        ],
      },
      {
        type: "sorting",
        prompt: "Order the standard apt workflow for installing something new.",
        correctOrder: [
          "sudo apt update to refresh package lists",
          "apt search <name> to find the package",
          "sudo apt install <name>",
          "Verify with the tool's --version",
        ],
      },
      {
        type: "fill_blank",
        prompt: "Complete the sentence about apt update.",
        sentence: "`apt update` refreshes the package ___ — it doesn't upgrade any installed software.",
        options: ["lists", "binaries", "kernels", "keys"],
        correctIndex: 0,
        explanation: "update = refresh the catalog; upgrade = actually install newer versions.",
      },
      {
        type: "typing",
        prompt: "On Debian/Ubuntu, the package manager command is ___. (three letters)",
        answer: "apt",
        placeholder: "type the command…",
        explanation: "apt — update, install, upgrade, remove.",
      },
    ],
  },
];

/** World 8: VS Code. */
export const VSCODE_LESSONS: LessonBlueprint[] = [
  {
    title: "Command Palette Everything",
    steps: [
      {
        type: "flashcard",
        cards: [
          {
            front: "What is the Command Palette?",
            back: "Ctrl/Cmd+Shift+P — a searchable list of every command VS Code can run. If you can name it, you can run it.",
          },
          {
            front: "Quick file open?",
            back: "Ctrl/Cmd+P, then type part of the filename. Fuzzy matching means 'usrctl' finds userController.",
          },
        ],
      },
      {
        type: "matching",
        prompt: "Match the shortcut to what it opens.",
        pairs: [
          { left: "Ctrl/Cmd+Shift+P", right: "Command Palette" },
          { left: "Ctrl/Cmd+P", right: "Quick file open" },
          { left: "Ctrl/Cmd+`", right: "Integrated terminal" },
          { left: "Ctrl/Cmd+Shift+F", right: "Search across all files" },
        ],
      },
      {
        type: "multiple_choice",
        prompt: "You forget the shortcut for something. Fastest recovery?",
        options: [
          "Search the docs website",
          "Open the Command Palette and type what you want to do",
          "Restart VS Code",
          "Memorize the manual first",
        ],
        correctIndex: 1,
        explanation:
          "The palette shows the keybinding next to each command — it's both the escape hatch and the teacher.",
      },
      {
        type: "typing",
        prompt: "The searchable run-anything menu in VS Code is the Command ___. (one word)",
        answer: "palette",
        placeholder: "type your answer…",
        explanation: "Command Palette — one keystroke away from every feature.",
      },
    ],
  },
  {
    title: "Multi-Cursor & Refactoring",
    steps: [
      {
        type: "flashcard",
        cards: [
          {
            front: "What does Ctrl/Cmd+D do?",
            back: "Selects the next occurrence of your current selection, adding a cursor there — edit them all at once.",
          },
          {
            front: "Rename Symbol vs find-and-replace?",
            back: "F2 renames using language understanding — only real references change, not strings or lookalike names.",
          },
        ],
      },
      {
        type: "multiple_choice",
        prompt: "You need to rename a function used in 30 places. Safest tool?",
        options: [
          "Find and replace across files",
          "F2 Rename Symbol on the function name",
          "Editing each file by hand",
          "sed in the terminal",
        ],
        correctIndex: 1,
        explanation:
          "Rename Symbol is semantic: it changes references, skips comments and coincidental matches, and updates imports.",
      },
      {
        type: "matching",
        prompt: "Match the action to the feature.",
        pairs: [
          { left: "Edit 5 identical strings at once", right: "Ctrl/Cmd+D multi-cursor" },
          { left: "Rename across the project", right: "F2 Rename Symbol" },
          { left: "Jump to a function's definition", right: "F12 Go to Definition" },
          { left: "See every place it's used", right: "Shift+F12 Find References" },
        ],
      },
      {
        type: "typing",
        prompt: "The key that triggers Rename Symbol is F___. (one number)",
        answer: "2",
        placeholder: "F…",
        explanation: "F2 — semantic rename, the refactor you'll use most.",
      },
    ],
  },
  {
    title: "Debugging with Breakpoints",
    steps: [
      {
        type: "flashcard",
        cards: [
          {
            front: "What is a breakpoint?",
            back: "A marker that pauses execution at that line so you can inspect variables, the call stack, and step through code.",
          },
          {
            front: "Step over vs step into?",
            back: "Step over runs a function call in one hop; step into descends into it line by line.",
          },
        ],
      },
      {
        type: "multiple_choice",
        prompt: "Compared to console.log debugging, breakpoints let you…",
        options: [
          "See only what you predicted to print",
          "Inspect every variable at the paused moment and walk the call stack",
          "Nothing extra",
          "Only debug in production",
        ],
        correctIndex: 1,
        explanation:
          "Logs answer the questions you asked in advance; the debugger answers the ones you think of while paused.",
      },
      {
        type: "sorting",
        prompt: "Order a debugging session.",
        correctOrder: [
          "Set a breakpoint on the suspicious line",
          "Start the debugger (F5)",
          "Trigger the code path",
          "Inspect variables and step through to the bug",
        ],
      },
      {
        type: "typing",
        prompt: "A marker that pauses execution on a line is called a ___. (one word)",
        answer: "breakpoint",
        placeholder: "type your answer…",
        explanation: "Breakpoints — stop the world exactly where it gets interesting.",
      },
    ],
  },
];

/** World 13: Node.js. */
export const NODEJS_LESSONS: LessonBlueprint[] = [
  {
    title: "The Node Runtime",
    steps: [
      {
        type: "flashcard",
        cards: [
          {
            front: "What is Node.js?",
            back: "A JavaScript runtime outside the browser — V8 plus APIs for files, networking, and processes. It's how JS runs servers and CLIs.",
          },
          {
            front: "What can Node do that browser JS can't?",
            back: "Read/write files, open TCP servers, spawn processes, read environment variables — the operating-system side of programming.",
          },
        ],
      },
      {
        type: "matching",
        prompt: "Match the built-in module to its job.",
        pairs: [
          { left: "fs", right: "Read and write files" },
          { left: "path", right: "Join and resolve file paths safely" },
          { left: "http", right: "Create servers and make requests" },
          { left: "process.env", right: "Read environment variables" },
        ],
      },
      {
        type: "multiple_choice",
        prompt: "Why does Node handle thousands of connections on one thread?",
        options: [
          "It secretly uses many threads for JS",
          "Non-blocking I/O: slow operations yield, callbacks resume when data is ready",
          "It queues users one at a time",
          "It doesn't — it crashes",
        ],
        correctIndex: 1,
        explanation:
          "The event loop never waits on I/O. While the database responds, Node serves other requests.",
      },
      {
        type: "typing",
        prompt: "The mechanism that schedules callbacks in Node is the event ___. (one word)",
        answer: "loop",
        placeholder: "type your answer…",
        explanation: "The event loop — one thread, no waiting, everything scheduled.",
      },
    ],
  },
  {
    title: "npm, Scripts & node_modules",
    steps: [
      {
        type: "flashcard",
        cards: [
          {
            front: "What is package.json?",
            back: "The project manifest: name, dependencies, and the scripts you run with `npm run <name>`.",
          },
          {
            front: "Why does the lockfile matter?",
            back: "It pins exact versions of every dependency so installs are reproducible across machines and CI.",
          },
        ],
      },
      {
        type: "multiple_choice",
        prompt: "Should node_modules be committed to git?",
        options: [
          "Yes, always",
          "No — it's reproducible from package.json + the lockfile, so gitignore it",
          "Only on Fridays",
          "Only the big packages",
        ],
        correctIndex: 1,
        explanation:
          "Hundreds of megabytes of installable artifacts don't belong in history. The lockfile is the reproducibility contract.",
      },
      {
        type: "matching",
        prompt: "Match the dependency type to its use.",
        pairs: [
          { left: "dependencies", right: "Needed at runtime in production" },
          { left: "devDependencies", right: "Build/test tools, not shipped" },
          { left: "npx <tool>", right: "Run a CLI without global install" },
          { left: "npm ci", right: "Clean install exactly from the lockfile" },
        ],
      },
      {
        type: "fill_blank",
        prompt: "Complete the sentence about scripts.",
        sentence: "Commands defined under \"scripts\" in package.json run with `npm ___ <name>`.",
        options: ["do", "run", "exec", "go"],
        correctIndex: 1,
        explanation: "npm run dev, npm run test — the project's own verbs, documented in the manifest.",
      },
      {
        type: "typing",
        prompt: "The file that pins exact dependency versions is the ___file. (one word)",
        answer: "lock",
        placeholder: "type your answer…",
        explanation: "The lockfile (package-lock.json / pnpm-lock.yaml) makes installs deterministic.",
      },
    ],
  },
  {
    title: "Environment Variables & Secrets",
    steps: [
      {
        type: "multiple_choice",
        prompt: "Where does an API key belong?",
        options: [
          "Hardcoded in the source",
          "In an environment variable, loaded from an uncommitted .env file",
          "In a code comment",
          "In the README",
        ],
        correctIndex: 1,
        explanation:
          "Secrets in source end up in git history forever. Env vars keep config out of code and out of the repo.",
      },
      {
        type: "fill_blank",
        prompt: "Complete the .env rule.",
        sentence: ".env files must be listed in ___ so they never get committed.",
        options: ["package.json", ".gitignore", "README.md", "the lockfile"],
        correctIndex: 1,
        explanation:
          "Commit a .env.example with placeholder keys instead — teammates copy it to their own .env.",
      },
      {
        type: "multiple_choice",
        prompt: "You accidentally committed a real API key. What's required?",
        options: [
          "Delete the line in a new commit — done",
          "Rotate (revoke and reissue) the key; deleting it from code doesn't remove it from history",
          "Hope nobody looks",
          "Make the repo private later",
        ],
        correctIndex: 1,
        explanation:
          "Git history keeps the old commit. Once exposed, a secret is burned — rotation is the only real fix.",
      },
      {
        type: "typing",
        prompt: "In Node, environment variables are read from process.___ (one word)",
        answer: "env",
        placeholder: "process.…",
        explanation: "process.env.MY_KEY — configuration from outside the code.",
      },
    ],
  },
];

/** World 14: APIs. */
export const APIS_LESSONS: LessonBlueprint[] = [
  {
    title: "HTTP Verbs & Status Codes",
    steps: [
      {
        type: "matching",
        prompt: "Match the HTTP method to its conventional meaning.",
        pairs: [
          { left: "GET", right: "Read data, no side effects" },
          { left: "POST", right: "Create something new" },
          { left: "PATCH", right: "Partially update a resource" },
          { left: "DELETE", right: "Remove a resource" },
        ],
      },
      {
        type: "matching",
        prompt: "Match the status code to what it tells the client.",
        pairs: [
          { left: "200", right: "Success" },
          { left: "201", right: "Created" },
          { left: "404", right: "Resource not found" },
          { left: "500", right: "Server blew up" },
        ],
      },
      {
        type: "multiple_choice",
        prompt: "A request fails with 401 vs 403 — what's the difference?",
        options: [
          "None, they're synonyms",
          "401: not authenticated (who are you?); 403: authenticated but not allowed (you can't do that)",
          "401 is worse",
          "403 means the server is down",
        ],
        correctIndex: 1,
        explanation:
          "401 asks for credentials; 403 says your credentials are fine but this action is forbidden to you.",
      },
      {
        type: "fill_blank",
        prompt: "Complete the REST convention.",
        sentence: "GET requests should be safe to retry because they have no ___ effects.",
        options: ["side", "sound", "visual", "caching"],
        correctIndex: 0,
        explanation: "Reads don't change state — which is why browsers prefetch and retry them freely.",
      },
      {
        type: "typing",
        prompt: "The status code for 'resource not found' is ___. (three digits)",
        answer: "404",
        placeholder: "type the code…",
        explanation: "404 — the most famous number on the internet.",
      },
    ],
  },
  {
    title: "Designing Good Endpoints",
    steps: [
      {
        type: "multiple_choice",
        prompt: "Which endpoint design follows REST conventions?",
        options: [
          "POST /getUsers",
          "GET /users/42",
          "GET /doUserFetch?id=42&action=get",
          "DELETE /users/delete-user-42",
        ],
        correctIndex: 1,
        explanation:
          "Nouns in paths, verbs in methods: GET /users/42 reads user 42. The method already says what you're doing.",
      },
      {
        type: "sorting",
        prompt: "Order the lifecycle of handling one API request on the server.",
        correctOrder: [
          "Parse and validate the input",
          "Check authentication and permissions",
          "Do the work against the database",
          "Return the right status code and body",
        ],
      },
      {
        type: "fill_blank",
        prompt: "Complete the validation rule.",
        sentence: "Validate request input on the ___, even if the client already validated it.",
        options: ["client", "server", "CDN", "database"],
        correctIndex: 1,
        explanation:
          "Anyone can call your API with curl — client-side validation is UX, server-side validation is security.",
      },
      {
        type: "typing",
        prompt: "In REST, paths name resources with ___, not verbs. (one word)",
        answer: "nouns",
        placeholder: "type your answer…",
        explanation: "Nouns in the URL, verbs in the HTTP method.",
      },
    ],
  },
  {
    title: "Consuming APIs Well",
    steps: [
      {
        type: "multiple_choice",
        prompt: "fetch resolved but the API returned 500. What does `res.ok` show, and why check it?",
        options: [
          "true — fetch succeeded",
          "false — fetch only rejects on network failure, so you must check res.ok for HTTP errors",
          "fetch throws on 500 automatically",
          "res.ok doesn't exist",
        ],
        correctIndex: 1,
        explanation:
          "A completed HTTP exchange is 'success' to fetch, even a 500. res.ok (status 200-299) is your job to check.",
      },
      {
        type: "flashcard",
        cards: [
          {
            front: "What is rate limiting?",
            back: "The API rejecting requests beyond a quota, usually with 429 Too Many Requests. Back off and retry later.",
          },
          {
            front: "What is exponential backoff?",
            back: "Retrying with growing delays (1s, 2s, 4s…) so you don't hammer a struggling server.",
          },
        ],
      },
      {
        type: "fill_blank",
        prompt: "Complete the resilience rule.",
        sentence: "On a 429 response, wait and retry with ___ backoff instead of hammering the API.",
        options: ["constant", "exponential", "zero", "negative"],
        correctIndex: 1,
        explanation: "Growing delays give the server room to recover — and keep you inside the quota.",
      },
      {
        type: "typing",
        prompt: "The status code for 'too many requests' is ___. (three digits)",
        answer: "429",
        placeholder: "type the code…",
        explanation: "429 — the rate limiter saying slow down.",
      },
    ],
  },
];

/** World 15: SQL. */
export const SQL_LESSONS: LessonBlueprint[] = [
  {
    title: "SELECT Fundamentals",
    steps: [
      {
        type: "flashcard",
        cards: [
          {
            front: "The shape of a basic query?",
            back: "SELECT columns FROM table WHERE condition ORDER BY column LIMIT n — in that order.",
          },
          {
            front: "What does WHERE do?",
            back: "Filters rows before they're returned. No WHERE = every row in the table.",
          },
        ],
      },
      {
        type: "code",
        prompt: "Write a query returning name and email of users older than 18, sorted by name.",
        language: "sql",
        starterCode: "-- your query here\n",
        mustInclude: ["SELECT", "FROM users", "WHERE", "ORDER BY"],
        hint: "SELECT name, email FROM users WHERE age > 18 ORDER BY name;",
        explanation: "Project the columns you need, filter with WHERE, sort with ORDER BY.",
      },
      {
        type: "multiple_choice",
        prompt: "Why is `SELECT *` discouraged in application code?",
        options: [
          "It's slower to type",
          "It fetches columns you don't need and silently changes when the schema does",
          "It only works in Postgres",
          "It locks the table",
        ],
        correctIndex: 1,
        explanation:
          "Explicit columns document intent, keep payloads lean, and won't surprise you when someone adds a 2MB blob column.",
      },
      {
        type: "sorting",
        prompt: "Order the clauses of a query as written.",
        correctOrder: ["SELECT", "FROM", "WHERE", "ORDER BY"],
      },
      {
        type: "typing",
        prompt: "The clause that filters rows is ___. (one word)",
        answer: "where",
        placeholder: "type the clause…",
        explanation: "WHERE — the difference between one row and the whole table.",
      },
    ],
  },
  {
    title: "JOINs That Make Sense",
    steps: [
      {
        type: "flashcard",
        cards: [
          {
            front: "What does INNER JOIN return?",
            back: "Only rows with a match on both sides of the ON condition.",
          },
          {
            front: "What does LEFT JOIN add?",
            back: "All rows from the left table, with NULLs where the right side has no match — 'users, with orders if any'.",
          },
        ],
      },
      {
        type: "code",
        prompt: "Write a query listing each order id with its customer's name (tables: orders, customers; orders.customer_id → customers.id).",
        language: "sql",
        starterCode: "-- your query here\n",
        mustInclude: ["JOIN", "ON"],
        hint: "SELECT orders.id, customers.name FROM orders JOIN customers ON orders.customer_id = customers.id;",
        explanation: "The ON condition pairs each order with exactly its own customer.",
      },
      {
        type: "multiple_choice",
        prompt: "What does a JOIN without an ON condition (comma join) produce?",
        options: [
          "An error, always",
          "A cartesian product — every row paired with every row",
          "An empty result",
          "Whatever the index decides",
        ],
        correctIndex: 1,
        explanation:
          "1,000 orders × 1,000 customers = a million meaningless rows. The ON condition is what makes a join a join.",
      },
      {
        type: "matching",
        prompt: "Match the join to when you want it.",
        pairs: [
          { left: "INNER JOIN", right: "Only matched pairs" },
          { left: "LEFT JOIN", right: "Everything left, matches if any" },
          { left: "ON a.id = b.a_id", right: "The pairing condition" },
          { left: "Comma join, no ON", right: "A cartesian accident" },
        ],
      },
      {
        type: "typing",
        prompt: "The keyword that states how two joined tables pair up is ___. (two letters)",
        answer: "on",
        placeholder: "type the keyword…",
        explanation: "ON — the condition that pairs the right rows.",
      },
    ],
  },
  {
    title: "Indexes & Aggregates",
    steps: [
      {
        type: "flashcard",
        cards: [
          {
            front: "What is an index?",
            back: "A lookup structure on a column that turns full-table scans into fast seeks — at the cost of slightly slower writes.",
          },
          {
            front: "What does GROUP BY do?",
            back: "Collapses rows sharing a value into groups so aggregates (COUNT, SUM, AVG) compute per group.",
          },
        ],
      },
      {
        type: "multiple_choice",
        prompt: "Which column most deserves an index?",
        options: [
          "A notes column nobody filters on",
          "user_id in a huge orders table, filtered in every query",
          "A column in a 12-row lookup table",
          "All columns, always",
        ],
        correctIndex: 1,
        explanation:
          "Index what you filter and join on, where the table is big. Indexing everything just slows writes for nothing.",
      },
      {
        type: "code",
        prompt: "Write a query counting orders per customer_id (columns: customer_id, plus the count).",
        language: "sql",
        starterCode: "-- your query here\n",
        mustInclude: ["COUNT", "GROUP BY"],
        hint: "SELECT customer_id, COUNT(*) FROM orders GROUP BY customer_id;",
        explanation: "GROUP BY collapses each customer's orders into one row; COUNT sizes each group.",
      },
      {
        type: "fill_blank",
        prompt: "Complete the trade-off.",
        sentence: "Indexes speed up reads but slightly slow down ___.",
        options: ["writes", "backups", "joins", "sorting"],
        correctIndex: 0,
        explanation: "Every INSERT/UPDATE must also update the index. Reads pay less; writes pay a little more.",
      },
      {
        type: "typing",
        prompt: "The clause that computes aggregates per group is GROUP ___. (one word)",
        answer: "by",
        placeholder: "GROUP …",
        explanation: "GROUP BY — the pivot from rows to summaries.",
      },
    ],
  },
];

/** World 16: PostgreSQL. */
export const POSTGRESQL_LESSONS: LessonBlueprint[] = [
  {
    title: "Schemas & Data Types",
    steps: [
      {
        type: "matching",
        prompt: "Match the Postgres type to its use.",
        pairs: [
          { left: "text", right: "Strings of any length" },
          { left: "timestamptz", right: "Points in time, timezone-aware" },
          { left: "jsonb", right: "Queryable JSON documents" },
          { left: "uuid", right: "Globally unique identifiers" },
        ],
      },
      {
        type: "multiple_choice",
        prompt: "For a created_at column, why prefer timestamptz over timestamp?",
        options: [
          "It's shorter to type",
          "It stores an absolute instant; plain timestamp is ambiguous across timezones",
          "timestamp is deprecated",
          "No reason",
        ],
        correctIndex: 1,
        explanation:
          "timestamptz normalizes to UTC — the same instant everywhere. Plain timestamp means 'whatever timezone the writer assumed'.",
      },
      {
        type: "fill_blank",
        prompt: "Complete the constraint fact.",
        sentence: "A ___ KEY constraint uniquely identifies each row and rejects duplicates and NULLs.",
        options: ["PRIMARY", "FOREIGN", "SECRET", "SORT"],
        correctIndex: 0,
        explanation: "Every table wants a primary key — it's identity, and it's automatically indexed.",
      },
      {
        type: "typing",
        prompt: "Postgres's binary, indexable JSON type is ___. (one word)",
        answer: "jsonb",
        placeholder: "type the type…",
        explanation: "jsonb — JSON you can index and query with operators.",
      },
    ],
  },
  {
    title: "Transactions & Safety",
    steps: [
      {
        type: "flashcard",
        cards: [
          {
            front: "What is a transaction?",
            back: "A group of statements that commit together or roll back together — all or nothing.",
          },
          {
            front: "Classic example?",
            back: "Moving money: debit one account, credit another. A crash between the two must undo both.",
          },
        ],
      },
      {
        type: "sorting",
        prompt: "Order a safe transfer between accounts.",
        correctOrder: [
          "BEGIN",
          "UPDATE the sender's balance down",
          "UPDATE the receiver's balance up",
          "COMMIT",
        ],
      },
      {
        type: "multiple_choice",
        prompt: "A statement inside your transaction fails. What should the app do?",
        options: [
          "COMMIT what worked",
          "ROLLBACK so the database returns to the state before BEGIN",
          "Retry the failed statement alone",
          "Ignore it",
        ],
        correctIndex: 1,
        explanation:
          "Half-applied logic is corruption. ROLLBACK is the whole point — nothing happened unless everything happened.",
      },
      {
        type: "typing",
        prompt: "The command that undoes an in-progress transaction is ___. (one word)",
        answer: "rollback",
        placeholder: "type the command…",
        explanation: "ROLLBACK — the all-or-nothing guarantee in action.",
      },
    ],
  },
  {
    title: "EXPLAIN & Query Speed",
    steps: [
      {
        type: "flashcard",
        cards: [
          {
            front: "What does EXPLAIN show?",
            back: "The query plan: how Postgres will execute your query — sequential scan vs index scan, join strategy, cost estimates.",
          },
          {
            front: "Seq Scan on a huge table means?",
            back: "Postgres reads every row. If this query runs often with a selective filter, it probably wants an index.",
          },
        ],
      },
      {
        type: "multiple_choice",
        prompt: "A query got slow as the table grew to millions of rows. First diagnostic step?",
        options: [
          "Buy a bigger server",
          "EXPLAIN ANALYZE the query to see where time actually goes",
          "Add indexes on every column",
          "Switch databases",
        ],
        correctIndex: 1,
        explanation:
          "EXPLAIN ANALYZE shows the real plan with real timings — evidence first, then the fix is usually obvious.",
      },
      {
        type: "fill_blank",
        prompt: "Complete the sentence about index scans.",
        sentence: "After adding the right index, EXPLAIN should show an ___ Scan instead of a Seq Scan.",
        options: ["Index", "Empty", "Outer", "Async"],
        correctIndex: 0,
        explanation: "Index Scan = seek to the matching rows instead of reading the whole table.",
      },
      {
        type: "typing",
        prompt: "The command that reveals a query's execution plan is ___. (one word)",
        answer: "explain",
        placeholder: "type the command…",
        explanation: "EXPLAIN (ANALYZE for real timings) — the profiler built into your database.",
      },
    ],
  },
];

/** World 17: Supabase. */
export const SUPABASE_LESSONS: LessonBlueprint[] = [
  {
    title: "Postgres with Superpowers",
    steps: [
      {
        type: "flashcard",
        cards: [
          {
            front: "What is Supabase?",
            back: "A hosted Postgres with auth, auto-generated APIs, storage, and realtime subscriptions built around it.",
          },
          {
            front: "What's underneath?",
            back: "A real Postgres database — everything you know about SQL, indexes, and transactions applies unchanged.",
          },
        ],
      },
      {
        type: "matching",
        prompt: "Match the Supabase piece to what it gives you.",
        pairs: [
          { left: "Database", right: "Real Postgres" },
          { left: "Auth", right: "Sign-ups, logins, sessions" },
          { left: "Storage", right: "File uploads with access rules" },
          { left: "Realtime", right: "Subscribe to row changes live" },
        ],
      },
      {
        type: "multiple_choice",
        prompt: "The auto-generated REST API is derived from…",
        options: [
          "A YAML file you maintain",
          "Your database schema — tables become endpoints",
          "Hand-written controllers",
          "The dashboard theme",
        ],
        correctIndex: 1,
        explanation:
          "Define the table, get the endpoint. The schema is the single source of truth for the API.",
      },
      {
        type: "typing",
        prompt: "The database engine at the core of Supabase is ___. (one word)",
        answer: "postgres",
        placeholder: "type your answer…",
        explanation: "It's Postgres all the way down — with batteries around it.",
      },
    ],
  },
  {
    title: "Row Level Security",
    steps: [
      {
        type: "flashcard",
        cards: [
          {
            front: "What is RLS?",
            back: "Row Level Security: policies in the database that decide, per row, who can read or write — enforced no matter how the query arrives.",
          },
          {
            front: "The classic policy?",
            back: "auth.uid() = user_id — users can only touch rows they own.",
          },
        ],
      },
      {
        type: "multiple_choice",
        prompt: "Why is RLS safer than filtering in application code?",
        options: [
          "It's faster to write",
          "The database enforces it even if a client bypasses your app and hits the API directly",
          "It isn't — same thing",
          "It disables SQL injection",
        ],
        correctIndex: 1,
        explanation:
          "App-level filters only protect paths through your app. RLS guards the data itself, on every path.",
      },
      {
        type: "fill_blank",
        prompt: "Complete the crucial default.",
        sentence: "A table with RLS enabled but no policies allows ___ access through the API.",
        options: ["full", "no", "read-only", "admin"],
        correctIndex: 1,
        explanation:
          "Deny by default: enabling RLS locks the table until policies explicitly grant access.",
      },
      {
        type: "typing",
        prompt: "The Supabase function returning the current user's id in a policy is auth.___() (one word)",
        answer: "uid",
        placeholder: "auth.…()",
        explanation: "auth.uid() — the building block of ownership policies.",
      },
    ],
  },
  {
    title: "Client Queries & Keys",
    steps: [
      {
        type: "multiple_choice",
        prompt: "Which key is safe to ship in browser code?",
        options: [
          "The service-role key",
          "The anon/publishable key — RLS is what actually protects the data",
          "Both keys",
          "Neither, ever",
        ],
        correctIndex: 1,
        explanation:
          "The anon key is designed to be public; policies do the guarding. The service-role key bypasses RLS — server only.",
      },
      {
        type: "matching",
        prompt: "Match the client call to what it does.",
        pairs: [
          { left: ".from('posts').select()", right: "Read rows" },
          { left: ".insert({...})", right: "Create a row" },
          { left: ".eq('id', 42)", right: "Filter to matching rows" },
          { left: ".single()", right: "Expect exactly one row" },
        ],
      },
      {
        type: "fill_blank",
        prompt: "Complete the security rule.",
        sentence: "The ___-role key bypasses RLS and must never reach the browser.",
        options: ["anon", "service", "public", "guest"],
        correctIndex: 1,
        explanation: "service-role = god mode. Server environments only, never in client bundles.",
      },
      {
        type: "typing",
        prompt: "The security feature that makes the public anon key safe is ___ (three letters).",
        answer: "rls",
        placeholder: "type the acronym…",
        explanation: "RLS — policies at the row level, enforced by Postgres itself.",
      },
    ],
  },
];

/** World 18: Authentication. */
export const AUTHENTICATION_LESSONS: LessonBlueprint[] = [
  {
    title: "Passwords Done Right",
    steps: [
      {
        type: "multiple_choice",
        prompt: "How should passwords be stored?",
        options: [
          "Plaintext, for easy support",
          "Encrypted, so you can decrypt them",
          "Hashed with a slow algorithm like bcrypt or argon2",
          "In a spreadsheet",
        ],
        correctIndex: 2,
        explanation:
          "Hashing is one-way; slow algorithms make brute force expensive. If you can see a user's password, you're doing it wrong.",
      },
      {
        type: "flashcard",
        cards: [
          {
            front: "What is a salt?",
            back: "Random data mixed into each password before hashing, so identical passwords produce different hashes and rainbow tables die.",
          },
          {
            front: "Why a slow hash on purpose?",
            back: "Milliseconds per guess is fine for one login but ruinous for an attacker trying billions.",
          },
        ],
      },
      {
        type: "fill_blank",
        prompt: "Complete the hashing property.",
        sentence: "A hash is ___-way: you can verify a password against it but never recover the password from it.",
        options: ["one", "two", "three", "any"],
        correctIndex: 0,
        explanation: "Verification without recovery — the entire point of hashing credentials.",
      },
      {
        type: "typing",
        prompt: "Random per-user data added before hashing is called a ___. (one word)",
        answer: "salt",
        placeholder: "type your answer…",
        explanation: "Salt — same password, different hash, precomputed attacks defeated.",
      },
    ],
  },
  {
    title: "Sessions, Cookies & JWTs",
    steps: [
      {
        type: "flashcard",
        cards: [
          {
            front: "Session cookie flow?",
            back: "Login creates a server-side session; the browser holds an httpOnly cookie with its id and sends it automatically on each request.",
          },
          {
            front: "What is a JWT?",
            back: "A signed token carrying claims (like user id and expiry). The server verifies the signature instead of looking up a session.",
          },
        ],
      },
      {
        type: "multiple_choice",
        prompt: "Why mark auth cookies httpOnly?",
        options: [
          "It compresses them",
          "JavaScript can't read them, so XSS can't simply steal the session",
          "It makes them last longer",
          "It's required by browsers",
        ],
        correctIndex: 1,
        explanation:
          "httpOnly keeps the cookie out of reach of injected scripts — one of the cheapest, highest-value auth defenses.",
      },
      {
        type: "matching",
        prompt: "Match the concept to its property.",
        pairs: [
          { left: "Server session", right: "Revocable instantly, needs a lookup" },
          { left: "JWT", right: "Self-contained, hard to revoke early" },
          { left: "httpOnly cookie", right: "Invisible to page JavaScript" },
          { left: "Token expiry", right: "Limits damage of a stolen token" },
        ],
      },
      {
        type: "fill_blank",
        prompt: "Complete the JWT caveat.",
        sentence: "A JWT is signed, not ___ — anyone holding it can read its claims.",
        options: ["encrypted", "expired", "hashed", "compressed"],
        correctIndex: 0,
        explanation:
          "Base64 is not secrecy. Signatures prove integrity; never put secrets in JWT claims.",
      },
      {
        type: "typing",
        prompt: "The cookie flag that hides it from JavaScript is http___. (one word)",
        answer: "only",
        placeholder: "http…",
        explanation: "httpOnly — the session-theft seatbelt.",
      },
    ],
  },
  {
    title: "OAuth in One Lesson",
    steps: [
      {
        type: "flashcard",
        cards: [
          {
            front: "What problem does OAuth solve?",
            back: "Letting users sign in via Google/GitHub without ever giving your app their password — you receive tokens, not credentials.",
          },
          {
            front: "What comes back after consent?",
            back: "An authorization code your server exchanges for tokens, which identify the user and grant scoped access.",
          },
        ],
      },
      {
        type: "sorting",
        prompt: "Order the OAuth 'Sign in with GitHub' flow.",
        correctOrder: [
          "App redirects the user to GitHub",
          "User approves on GitHub's consent screen",
          "GitHub redirects back with a code",
          "Server exchanges the code for tokens",
        ],
      },
      {
        type: "multiple_choice",
        prompt: "In OAuth, your app never sees the user's…",
        options: ["email", "profile name", "GitHub password", "avatar"],
        correctIndex: 2,
        explanation:
          "That's the whole design: credentials stay with the provider; your app gets tokens with limited scope.",
      },
      {
        type: "typing",
        prompt: "The temporary value exchanged for tokens after consent is the authorization ___. (one word)",
        answer: "code",
        placeholder: "type your answer…",
        explanation: "The authorization code — short-lived, single-use, exchanged server-side.",
      },
    ],
  },
];
