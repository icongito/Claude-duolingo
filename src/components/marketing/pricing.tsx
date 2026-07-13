"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PLANS } from "@/lib/data/economy";
import { cn } from "@/lib/utils";

const CTA_LABEL: Record<string, string> = {
  free: "Start free",
  premium: "Go Premium",
  premium_plus: "Go Premium+",
};

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
            All 25 worlds are free, forever. Free is just ad-supported.
            Premium removes the ads and adds unlimited hearts, gems, and a
            faster AI Mentor.
          </p>
        </div>

        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-5 sm:grid-cols-3">
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <Card
                className={cn(
                  "h-full",
                  plan.highlight && "glow-border-strong relative",
                )}
              >
                {plan.highlight && (
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
                      {plan.tagline}
                    </p>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="font-pixel text-3xl">
                      {plan.monthlyPrice === 0 ? "$0" : `$${plan.monthlyPrice.toFixed(2)}`}
                    </span>
                    <span className="text-muted-foreground text-sm">
                      {plan.monthlyPrice === 0 ? "forever" : "/month"}
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
                    variant={plan.highlight ? "default" : "secondary"}
                    asChild
                  >
                    <Link href="/sign-up">{CTA_LABEL[plan.id] ?? `Get ${plan.name}`}</Link>
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
