"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, Loader2, SendHorizonal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type ChatMessage = { role: "user" | "assistant"; content: string };

const QUICK_PROMPTS = [
  "Give me a hint",
  "Explain this concept",
  "Quiz me on my weak areas",
];

export function MentorLauncher() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hey, I'm Nova — your AI Mentor. Stuck on a lesson? Want a hint, a deeper explanation, or a pop quiz? Just ask.",
    },
  ]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  async function send(text: string) {
    const content = text.trim();
    if (!content || pending) return;

    const next: ChatMessage[] = [...messages, { role: "user", content }];
    setMessages(next);
    setInput("");
    setPending(true);

    try {
      const res = await fetch("/api/mentor", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const data = (await res.json()) as { reply?: string; error?: string };
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content:
            data.reply ?? data.error ?? "Something went wrong — try again.",
        },
      ]);
    } catch {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: "I couldn't reach the mentor service. Try again in a bit.",
        },
      ]);
    } finally {
      setPending(false);
      requestAnimationFrame(() => {
        scrollRef.current?.scrollTo({
          top: scrollRef.current.scrollHeight,
          behavior: "smooth",
        });
      });
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close AI Mentor" : "Open AI Mentor"}
        className="fixed right-5 bottom-5 z-40 flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-[0_10px_30px_-8px_rgba(255,122,26,0.7)] transition-transform hover:scale-105 active:scale-95"
      >
        {open ? <X className="size-6" /> : <Bot className="size-6" />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="glow-border-strong fixed right-5 bottom-24 z-40 flex h-[28rem] w-[min(24rem,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-2xl bg-card shadow-2xl"
            role="dialog"
            aria-label="AI Mentor chat"
          >
            <div className="flex items-center gap-3 border-b border-border px-4 py-3">
              <span className="flex size-9 items-center justify-center rounded-xl bg-primary/15 text-primary">
                <Bot className="size-5" />
              </span>
              <div>
                <p className="text-sm font-semibold">Nova · AI Mentor</p>
                <p className="text-muted-foreground text-xs">
                  Hints, reviews, and pep talks
                </p>
              </div>
            </div>

            <div
              className="scrollbar-thin flex-1 overflow-y-auto px-4 py-3"
              ref={scrollRef}
            >
              <div className="flex flex-col gap-3">
                {messages.map((m, i) => (
                  <div
                    key={i}
                    className={cn(
                      "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm",
                      m.role === "assistant"
                        ? "bg-secondary text-foreground self-start rounded-bl-sm"
                        : "bg-primary text-primary-foreground self-end rounded-br-sm",
                    )}
                  >
                    {m.content}
                  </div>
                ))}
                {pending && (
                  <div className="bg-secondary text-muted-foreground flex items-center gap-2 self-start rounded-2xl rounded-bl-sm px-3.5 py-2.5 text-sm">
                    <Loader2 className="size-3.5 animate-spin" /> thinking…
                  </div>
                )}
              </div>
            </div>

            <div className="border-t border-border p-3">
              <div className="mb-2 flex flex-wrap gap-1.5">
                {QUICK_PROMPTS.map((q) => (
                  <button
                    key={q}
                    onClick={() => void send(q)}
                    disabled={pending}
                    className="rounded-full border border-border bg-secondary/60 px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
                  >
                    {q}
                  </button>
                ))}
              </div>
              <form
                className="flex gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  void send(input);
                }}
              >
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask Nova anything…"
                  className="h-10"
                  aria-label="Message the AI Mentor"
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={pending || !input.trim()}
                  aria-label="Send"
                >
                  <SendHorizonal className="size-4" />
                </Button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
