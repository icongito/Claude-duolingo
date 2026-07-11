import type { Metadata } from "next";
import { ShieldCheck } from "lucide-react";
import { PlanCards } from "@/components/premium/plan-cards";
import { GemPackRow } from "@/components/premium/gem-pack-row";
import { PremiumFaq } from "@/components/premium/premium-faq";

export const metadata: Metadata = { title: "Premium" };

export default function PremiumPage() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-10">
      <div className="text-center">
        <h1 className="font-pixel text-3xl sm:text-4xl">
          Go <span className="text-gradient-orange">Premium</span>
        </h1>
        <p className="text-muted-foreground mx-auto mt-3 max-w-xl">
          Every lesson, world, and boss is free forever. Premium buys
          protection for your streak, unlimited hearts, and a smarter mentor —
          never answers, never rank.
        </p>
      </div>

      <PlanCards />

      <div className="glass flex items-start gap-3 rounded-2xl border border-primary/25 p-4">
        <ShieldCheck className="text-primary mt-0.5 size-5 shrink-0" />
        <p className="text-sm">
          <span className="font-display font-semibold">Never pay-to-win.</span>{" "}
          <span className="text-muted-foreground">
            Nothing for sale — subscriptions, gems, or items — makes questions
            easier, unlocks content early for the leaderboard, or boosts your
            rank. Money buys time, protection, and looks. Skill stays earned.
          </span>
        </p>
      </div>

      <GemPackRow />

      <PremiumFaq />
    </div>
  );
}
