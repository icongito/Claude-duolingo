"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const PLANS = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Everything you need to start your quest line.",
    features: [
      "Access to Worlds 1–5",
      "Daily challenges",
      "XP, streaks & achievements",
      "Community leaderboard",
    ],
    cta: "Start free",
    highlighted: false,
  },
  {
    name: "Premium",
    price: "$12",
    period: "/month",
    description: "Unlock the full 25-world quest line.",
    features: [
      "All 25 worlds & boss battles",
      "Unlimited AI Mentor messages",
      "Monaco sandbox & live preview",
      "Certificates of completion",
      "Cosmetic season pass",
    ],
    cta: "Go Premium",
    highlighted: true,
  },
  {
    name: "Team",
    price: "$49",
    period: "/user/mo",
    description: "For bootcamps, teams, and study cohorts.",
    features: [
      "Everything in Premium",
      "Team leaderboards & guilds",
      "Progress dashboards for leads",
      "Priority support",
    ],
    cta: "Get Team",
    highlighted: false,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "SSO, custom worlds, and dedicated support.",
    features: [
      "Everything in Team",
      "SSO / SCIM provisioning",
      "Custom internal worlds",
      "Dedicated success manager",
    ],
    cta: "Contact sales",
    highlighted: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-14 text-center">
          <p className="mb-3 text-sm font-semibold tracking-widest text-primary uppercase">
            Pricing
          </p>
          <h2 className="font-pixel text-3xl text-foreground sm:text-4xl">
            Cosmetic upgrades only. Never pay-to-win.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Every world can be earned for free. Premium just gets you there
            faster and unlocks the full catalog immediately.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <Card
                className={cn(
                  "h-full",
                  plan.highlighted && "glow-border-strong relative",
                )}
              >
                {plan.highlighted && (
                  <Badge variant="gold" className="absolute -top-3 right-6">
                    Most popular
                  </Badge>
                )}
                <CardContent className="flex h-full flex-col gap-6">
                  <div>
                    <h3 className="font-display text-lg font-semibold">
                      {plan.name}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {plan.description}
                    </p>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="font-pixel text-3xl">{plan.price}</span>
                    <span className="text-muted-foreground text-sm">
                      {plan.period}
                    </span>
                  </div>
                  <ul className="flex flex-1 flex-col gap-2.5">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm">
                        <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                        <span className="text-muted-foreground">{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    variant={plan.highlighted ? "default" : "secondary"}
                    asChild
                  >
                    <Link href="/sign-up">{plan.cta}</Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
