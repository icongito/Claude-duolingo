"use client";

import { motion } from "framer-motion";
import { UserPlus, Map, Code, PartyPopper } from "lucide-react";

const STEPS = [
  {
    icon: UserPlus,
    title: "Create your quest",
    description: "Sign up in seconds and tell us what you want to master first.",
  },
  {
    icon: Map,
    title: "Follow the map",
    description: "Walk a guided path of lessons, quizzes, and mini projects, one glowing node at a time.",
  },
  {
    icon: Code,
    title: "Write real code",
    description: "Practice in live editors and terminals with instant feedback from your AI Mentor.",
  },
  {
    icon: PartyPopper,
    title: "Level up",
    description: "Earn XP, defeat boss battles, keep your streak alive, and unlock the next world.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-14 text-center">
          <p className="mb-3 text-sm font-semibold tracking-widest text-primary uppercase">
            How it works
          </p>
          <h2 className="font-pixel text-3xl text-foreground sm:text-4xl">
            Four steps to your first level up
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="relative flex flex-col items-center text-center"
            >
              <div className="relative mb-5 flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-[0_10px_30px_-8px_rgba(255,122,26,0.6)]">
                <step.icon className="size-7" />
                <span className="absolute -top-2 -right-2 flex size-6 items-center justify-center rounded-full bg-card text-xs font-bold text-primary border border-primary/40">
                  {i + 1}
                </span>
              </div>
              <h3 className="font-display text-base font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
