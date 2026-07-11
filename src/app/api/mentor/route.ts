import { NextResponse } from "next/server";
import { DEMO_USER } from "@/lib/data/demo-user";
import type { PlanId } from "@/lib/data/economy";

export const runtime = "nodejs";

/**
 * Mentor tiering: Free rides the fast model with a small daily budget; paid
 * tiers get the smarter model and much bigger (or no) limits. In demo mode
 * the limit is enforced per conversation (user messages in the submitted
 * history); with real persistence this becomes a per-user daily counter.
 */
const PLAN_MODEL: Record<PlanId, string> = {
  free: "claude-haiku-4-5-20251001",
  premium: "claude-sonnet-5",
  premium_plus: "claude-sonnet-5",
};

const PLAN_MESSAGE_LIMIT: Record<PlanId, number> = {
  free: 10,
  premium: 200,
  premium_plus: Number.MAX_SAFE_INTEGER,
};

const LIMIT_REPLY =
  "You've used all your free mentor messages for today — they refill at midnight. Premium learners get 200/day on a smarter model if you can't wait. Meanwhile: re-read the lesson's explanation panel, it usually hides the hint you need!";

const SYSTEM_PROMPT = `You are Nova, CodeQuest's AI Mentor — a friendly, encouraging coding tutor inside a gamified learning platform for developers.

Rules:
- Keep answers short (2-6 sentences) unless asked for depth.
- Prefer hints over full solutions when the learner is mid-lesson; give the full answer only if they ask directly.
- Use plain language; define jargon the first time you use it.
- Celebrate progress genuinely but briefly.
- If asked something unrelated to programming, AI, or learning, gently steer back to the quest.`;

type ChatMessage = { role: "user" | "assistant"; content: string };

function demoReply(messages: ChatMessage[]): string {
  const last = messages.at(-1)?.content.toLowerCase() ?? "";
  if (last.includes("hint")) {
    return "Here's a nudge: re-read the prompt and ask yourself what *context* the subagent would be missing. The answer usually lives in what ISN'T shared automatically. (Connect an ANTHROPIC_API_KEY to unlock full mentor conversations.)";
  }
  if (last.includes("subagent")) {
    return "Subagents are separate Claude instances with fresh context — great for scoped tasks like searches or drafts that can run in parallel. Anything they need to know must go in their task prompt. (Connect an ANTHROPIC_API_KEY for full mentor conversations.)";
  }
  return "I'm running in demo mode right now — add an ANTHROPIC_API_KEY to .env.local and I'll become a full conversational mentor. Meanwhile: keep your streak alive, and remember that specific prompts with context beat vague ones every time.";
}

export async function POST(request: Request) {
  let body: { messages?: ChatMessage[] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const history = body.messages ?? [];
  const messages = history.slice(-20);
  if (
    !Array.isArray(messages) ||
    messages.some(
      (m) =>
        !m ||
        (m.role !== "user" && m.role !== "assistant") ||
        typeof m.content !== "string" ||
        m.content.length > 8000,
    )
  ) {
    return NextResponse.json({ error: "Invalid messages" }, { status: 400 });
  }

  const plan = DEMO_USER.plan;
  // Count against the full submitted history, not the truncated window.
  const userMessages = Array.isArray(history)
    ? history.filter((m) => m?.role === "user").length
    : 0;
  if (userMessages > PLAN_MESSAGE_LIMIT[plan]) {
    return NextResponse.json({ reply: LIMIT_REPLY, demo: false, limited: true });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ reply: demoReply(messages), demo: true });
  }

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: PLAN_MODEL[plan],
      max_tokens: 600,
      system: SYSTEM_PROMPT,
      messages,
    }),
  });

  if (!response.ok) {
    return NextResponse.json(
      { error: "The mentor is unavailable right now. Try again shortly." },
      { status: 502 },
    );
  }

  const data = (await response.json()) as {
    content: Array<{ type: string; text?: string }>;
  };
  const reply =
    data.content.find((block) => block.type === "text")?.text ??
    "Hmm, I lost my train of thought. Ask me again?";

  return NextResponse.json({ reply, demo: false });
}
