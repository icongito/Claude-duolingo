"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Play, Flame, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Mascot } from "./mascot";
import { ParticleField } from "./particle-field";
import { PixelMountain } from "./pixel-mountain";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-16 pb-24 sm:pt-24 sm:pb-32">
      <ParticleField />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-secondary/60 px-4 py-1.5 text-xs font-semibold text-muted-foreground">
              <Flame className="size-3.5 text-primary" />
              25 worlds · 600+ lessons · 100% free to start
            </div>

            <div className="relative">
              <PixelMountain
                size={26}
                color="#7A3D10"
                className="absolute -top-3 left-40 opacity-70 sm:left-56"
              />
              <PixelMountain
                size={18}
                color="#FF7A1A"
                className="absolute top-14 left-16 opacity-50"
              />
              <h1 className="font-pixel text-4xl leading-[1.15] tracking-wide text-foreground sm:text-5xl lg:text-[3.4rem]">
                Level up like a
                <br />
                <span className="text-gradient-orange">game.</span>
                <br />
                Ship code like a{" "}
                <span className="text-gradient-orange">pro.</span>
              </h1>
            </div>

            <p className="mt-6 max-w-xl text-lg text-muted-foreground">
              CodeQuest turns Claude Code, prompt engineering, React, Git, and
              modern software engineering into bite-sized, addictive quests.
              Earn XP, defeat boss battles, and build a streak you don&apos;t
              want to break.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button size="lg" asChild>
                <Link href="/sign-up">
                  Start your quest <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button size="lg" variant="secondary" asChild>
                <a href="#how-it-works">
                  <Play className="size-4" /> See how it works
                </a>
              </Button>
            </div>

            <div className="mt-10 flex items-center gap-6">
              <div className="flex -space-x-3">
                {["#FF7A1A", "#FFC857", "#FF9E3D", "#6ee3ff"].map((c, i) => (
                  <div
                    key={i}
                    className="size-9 rounded-full border-2 border-background"
                    style={{ background: c }}
                  />
                ))}
              </div>
              <div className="text-sm">
                <div className="flex items-center gap-1 text-accent">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="size-3.5 fill-current" />
                  ))}
                </div>
                <p className="text-muted-foreground">
                  Loved by 40,000+ developers-in-training
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
            className="relative mx-auto flex w-full max-w-sm items-center justify-center"
          >
            <div className="absolute inset-0 rounded-full bg-primary/20 blur-[80px]" />
            <div className="glow-border-strong glass relative flex w-full flex-col items-center gap-4 rounded-2xl p-8">
              <Mascot size={180} />
              <div className="glow-border-strong rounded-xl bg-card px-4 py-2 text-center text-sm font-semibold">
                Ready to level up your AI skills?
              </div>
              <div className="flex w-full items-center justify-between text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <Flame className="size-3.5 text-streak" /> 12-day streak
                </span>
                <span className="font-pixel text-[10px] text-accent">
                  LVL 7
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
