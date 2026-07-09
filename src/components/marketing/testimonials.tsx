"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";

const TESTIMONIALS = [
  {
    name: "Priya S.",
    role: "Frontend Engineer",
    quote:
      "I finally understand git rebase. The boss battle for the Git world made it click in a way three YouTube tutorials never did.",
    initials: "PS",
  },
  {
    name: "Marcus T.",
    role: "CS Student",
    quote:
      "The streak system is dangerously effective. 140 days in and I've learned more than a semester of lectures.",
    initials: "MT",
  },
  {
    name: "Ava R.",
    role: "Bootcamp Grad",
    quote:
      "Prompt Engineering world alone was worth it. I use what I learned there every single day at my new job.",
    initials: "AR",
  },
  {
    name: "Dee K.",
    role: "Indie Hacker",
    quote:
      "The AI Mentor caught a bug in my sandbox project before I even ran it. It genuinely feels like pairing with someone senior.",
    initials: "DK",
  },
];

export function Testimonials() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-14 text-center">
          <p className="mb-3 text-sm font-semibold tracking-widest text-primary uppercase">
            Loved by learners
          </p>
          <h2 className="font-pixel text-3xl text-foreground sm:text-4xl">
            40,000+ streaks and counting
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: (i % 4) * 0.08 }}
            >
              <Card className="h-full">
                <div className="flex items-center gap-1 text-accent">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} className="size-3.5 fill-current" />
                  ))}
                </div>
                <p className="text-sm text-foreground">&ldquo;{t.quote}&rdquo;</p>
                <div className="mt-auto flex items-center gap-3 pt-2">
                  <Avatar className="size-9">
                    <AvatarFallback>{t.initials}</AvatarFallback>
                  </Avatar>
                  <div className="text-sm">
                    <p className="font-semibold">{t.name}</p>
                    <p className="text-muted-foreground text-xs">{t.role}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
