import Link from "next/link";
import { Crown } from "lucide-react";
import { getPlan } from "@/lib/data/economy";
import { DEMO_USER } from "@/lib/data/demo-user";

/**
 * The free tier's single ad slot — shown after a lesson, Duolingo-style.
 * Demo mode rotates deterministic house ads for fictional sponsors; in
 * production this box is the ad-network slot (the assumed ~$1/mo per active
 * free user is what funds the free mentor budget — see economy.ts).
 * Paid plans render nothing.
 */

const HOUSE_ADS = [
  {
    sponsor: "HexaHost",
    line: "Deploy your side project in 30 seconds. Pixel-fast, planet-cheap.",
    gradient: ["#2563eb", "#6ee3ff"],
  },
  {
    sponsor: "DevFuel Cold Brew",
    line: "The official beverage of 2am refactors.",
    gradient: ["#78350f", "#f59e0b"],
  },
  {
    sponsor: "BugSnare",
    line: "Catch bugs before your users do. Free for hobby projects.",
    gradient: ["#166534", "#3ddc97"],
  },
] as const;

export function AdCard({ seed = 0 }: { seed?: number }) {
  if (!getPlan(DEMO_USER.plan).showsAds) return null;

  const ad = HOUSE_ADS[seed % HOUSE_ADS.length];

  return (
    <div className="w-full max-w-md">
      <div className="overflow-hidden rounded-2xl border border-border bg-card text-left">
        <div
          className="flex h-20 items-center px-5"
          style={{
            background: `linear-gradient(120deg, ${ad.gradient[0]}40, ${ad.gradient[1]}40)`,
          }}
        >
          <div>
            <p className="font-display font-bold">{ad.sponsor}</p>
            <p className="text-muted-foreground text-sm">{ad.line}</p>
          </div>
        </div>
        <div className="flex items-center justify-between px-5 py-2">
          <span className="text-muted-foreground text-[10px] font-semibold tracking-widest uppercase">
            Ad · keeps CodeQuest free
          </span>
          <Link
            href="/premium"
            className="text-primary inline-flex items-center gap-1 text-xs font-semibold hover:underline"
          >
            <Crown className="size-3" /> Remove ads
          </Link>
        </div>
      </div>
    </div>
  );
}
