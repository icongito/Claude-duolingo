"use client";

import Link from "next/link";
import { useState } from "react";
import { BadgeCheck, Check, Crown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PLANS } from "@/lib/data/economy";
import { DEMO_USER } from "@/lib/data/demo-user";
import { cn } from "@/lib/utils";

export function PlanCards() {
  const [cycle, setCycle] = useState<"monthly" | "yearly">("yearly");
  const currentPlan = DEMO_USER.plan;

  return (
    <div className="flex flex-col gap-6">
      <div
        className="mx-auto flex items-center gap-1 rounded-full border border-border bg-secondary/60 p-1"
        role="tablist"
        aria-label="Billing cycle"
      >
        {(["monthly", "yearly"] as const).map((c) => (
          <button
            key={c}
            role="tab"
            aria-selected={cycle === c}
            onClick={() => setCycle(c)}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-semibold capitalize transition-colors",
              cycle === c
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {c}
            {c === "yearly" && (
              <span className={cn("ml-1.5 text-xs", cycle === c ? "opacity-90" : "text-success")}>
                −30%
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {PLANS.map((plan) => {
          const price = cycle === "yearly" ? plan.yearlyPrice : plan.monthlyPrice;
          const isCurrent = plan.id === currentPlan;
          return (
            <Card
              key={plan.id}
              className={cn(
                "relative flex flex-col gap-4 p-6",
                plan.highlight && "glow-border-strong border-primary/50",
              )}
            >
              {plan.highlight && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                  Most popular
                </Badge>
              )}
              <div>
                <h2 className="font-display flex items-center gap-2 text-lg font-bold">
                  {plan.id !== "free" && <Crown className="text-accent size-4" />}
                  {plan.name}
                </h2>
                <p className="text-muted-foreground mt-1 text-sm">{plan.tagline}</p>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="font-pixel text-3xl">
                  {price === 0 ? "$0" : `$${price.toFixed(2)}`}
                </span>
                <span className="text-muted-foreground text-sm">/month</span>
              </div>
              {cycle === "yearly" && plan.monthlyPrice > 0 && (
                <p className="text-success -mt-3 text-xs font-semibold">
                  billed yearly — save ${((plan.monthlyPrice - plan.yearlyPrice) * 12).toFixed(0)}/yr
                </p>
              )}
              <ul className="flex flex-1 flex-col gap-2.5">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check className="text-success mt-0.5 size-4 shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              {isCurrent ? (
                <Button variant="secondary" disabled>
                  <BadgeCheck className="size-4" /> Current plan
                </Button>
              ) : plan.id === "free" ? (
                <Button variant="secondary" asChild>
                  <Link href="/settings/billing">Downgrade in billing</Link>
                </Button>
              ) : (
                <Button variant={plan.highlight ? "default" : "secondary"} asChild>
                  <Link href={`/premium/checkout?plan=${plan.id}&cycle=${cycle}`}>
                    Get {plan.name}
                  </Link>
                </Button>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
