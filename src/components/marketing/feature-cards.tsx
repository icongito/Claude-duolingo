"use client";

import { motion } from "framer-motion";
import {
  TerminalSquare,
  Trophy,
  Bot,
  Users,
  Swords,
  BarChart3,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";

const FEATURES = [
  {
    icon: TerminalSquare,
    title: "Real code, not just quizzes",
    description:
      "Monaco-powered editors, live terminals, and sandboxes: you write actual code, not just pick an answer.",
  },
  {
    icon: Bot,
    title: "AI Mentor that remembers you",
    description:
      "A persistent assistant that hints, reviews, debugs, and personalizes challenges around your weak spots.",
  },
  {
    icon: Trophy,
    title: "250+ achievements",
    description:
      "From your first prompt to Grandmaster status, every milestone is tracked, celebrated, and shareable.",
  },
  {
    icon: Swords,
    title: "Boss battles",
    description:
      "Cap every world with a multi-stage challenge that mixes debugging, speed, and real problem solving.",
  },
  {
    icon: Users,
    title: "Guilds & leaderboards",
    description:
      "Study with friends, join a guild, and climb weekly leaderboards. Learning is better with company.",
  },
  {
    icon: BarChart3,
    title: "Progress you can see",
    description:
      "Streaks, XP curves, and a learning heatmap that make consistency feel as good as it should.",
  },
];

export function FeatureCards() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-14 text-center">
          <p className="mb-3 text-sm font-semibold tracking-widest text-primary uppercase">
            Why CodeQuest
          </p>
          <h2 className="font-pixel text-3xl text-foreground sm:text-4xl">
            Built to be addictive.
            <br className="hidden sm:block" /> Built to actually teach you.
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: (i % 3) * 0.08 }}
            >
              <Card className="h-full transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_-20px_rgba(255,122,26,0.35)]">
                <CardContent className="flex flex-col gap-4">
                  <span className="flex size-12 items-center justify-center rounded-xl bg-primary/15 text-primary">
                    <feature.icon className="size-6" />
                  </span>
                  <div>
                    <CardTitle>{feature.title}</CardTitle>
                    <CardDescription className="mt-2">
                      {feature.description}
                    </CardDescription>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
