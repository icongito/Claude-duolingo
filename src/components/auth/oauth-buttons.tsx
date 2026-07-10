"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { signInWithOAuth } from "@/lib/auth/actions";

const PROVIDERS = [
  { id: "google" as const, label: "Google" },
  { id: "github" as const, label: "GitHub" },
  { id: "discord" as const, label: "Discord" },
];

/** Simple inline brand-neutral glyphs so we don't ship extra icon deps. */
function ProviderGlyph({ id }: { id: string }) {
  switch (id) {
    case "google":
      return (
        <svg viewBox="0 0 24 24" className="size-4" aria-hidden>
          <path
            fill="currentColor"
            d="M21.6 12.2c0-.7-.06-1.4-.18-2H12v3.9h5.4a4.6 4.6 0 0 1-2 3v2.5h3.2c1.9-1.7 3-4.3 3-7.4Z"
          />
          <path
            fill="currentColor"
            opacity="0.7"
            d="M12 22c2.7 0 5-.9 6.6-2.4l-3.2-2.5c-.9.6-2 1-3.4 1-2.6 0-4.8-1.8-5.6-4.1H3.1v2.6A10 10 0 0 0 12 22Z"
          />
          <path
            fill="currentColor"
            opacity="0.5"
            d="M6.4 14a6 6 0 0 1 0-3.9V7.5H3.1a10 10 0 0 0 0 9l3.3-2.6Z"
          />
          <path
            fill="currentColor"
            opacity="0.85"
            d="M12 6c1.5 0 2.8.5 3.8 1.5L18.7 5A10 10 0 0 0 3.1 7.5L6.4 10c.8-2.3 3-4 5.6-4Z"
          />
        </svg>
      );
    case "github":
      return (
        <svg viewBox="0 0 24 24" className="size-4" aria-hidden>
          <path
            fill="currentColor"
            d="M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.2-3.4-1.2-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.6 2.4 1.1 3 .9.1-.7.4-1.1.6-1.4-2.2-.3-4.6-1.1-4.6-5 0-1.1.4-2 1-2.7-.1-.2-.4-1.2.1-2.6 0 0 .8-.3 2.7 1a9.4 9.4 0 0 1 5 0c1.9-1.3 2.7-1 2.7-1 .5 1.4.2 2.4.1 2.6.6.7 1 1.6 1 2.7 0 3.9-2.4 4.7-4.6 5 .4.3.7.9.7 1.9V21c0 .3.2.6.7.5A10 10 0 0 0 12 2Z"
          />
        </svg>
      );
    case "discord":
      return (
        <svg viewBox="0 0 24 24" className="size-4" aria-hidden>
          <path
            fill="currentColor"
            d="M19.3 5.3A17.3 17.3 0 0 0 15 4l-.2.4c1.5.4 2.9 1 4.2 1.9a14 14 0 0 0-12 0c1.3-.9 2.7-1.5 4.2-1.9L11 4c-1.5.3-3 .7-4.3 1.3A18 18 0 0 0 3.6 17c1.5 1.1 3.1 1.9 4.9 2.4l.9-1.5c-.8-.3-1.6-.7-2.3-1.2l.6-.4a12.3 12.3 0 0 0 10.6 0l.6.4c-.7.5-1.5.9-2.3 1.2l.9 1.5c1.8-.5 3.4-1.3 4.9-2.4a18 18 0 0 0-3.1-11.7ZM9.7 14.5c-.9 0-1.6-.8-1.6-1.8s.7-1.8 1.6-1.8 1.6.8 1.6 1.8-.7 1.8-1.6 1.8Zm4.6 0c-.9 0-1.6-.8-1.6-1.8s.7-1.8 1.6-1.8 1.6.8 1.6 1.8-.7 1.8-1.6 1.8Z"
          />
        </svg>
      );
    default:
      return null;
  }
}

export function OAuthButtons() {
  const [pending, startTransition] = useTransition();

  function handleClick(provider: "google" | "github" | "discord") {
    startTransition(async () => {
      const result = await signInWithOAuth(provider);
      if (result && !result.ok) {
        toast.error(result.error);
      }
    });
  }

  return (
    <div className="grid grid-cols-3 gap-2">
      {PROVIDERS.map((p) => (
        <Button
          key={p.id}
          type="button"
          variant="outline"
          disabled={pending}
          onClick={() => handleClick(p.id)}
          aria-label={`Continue with ${p.label}`}
        >
          <ProviderGlyph id={p.id} />
          <span className="hidden sm:inline">{p.label}</span>
        </Button>
      ))}
    </div>
  );
}
