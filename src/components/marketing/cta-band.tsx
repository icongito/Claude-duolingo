"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Mascot } from "./mascot";

export function CtaBand() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="glow-border-strong relative flex flex-col items-center gap-6 overflow-hidden rounded-3xl bg-gradient-to-br from-card to-secondary px-8 py-14 text-center"
        >
          <div className="absolute -top-16 -right-16 size-64 rounded-full bg-primary/20 blur-[100px]" />
          <div className="absolute -bottom-16 -left-16 size-64 rounded-full bg-accent/15 blur-[100px]" />

          <Mascot size={110} className="relative" />

          <h2 className="font-pixel relative max-w-xl text-2xl text-foreground sm:text-3xl">
            Your streak starts today.
          </h2>
          <p className="text-muted-foreground relative max-w-md">
            Join 40,000+ developers turning ten minutes a day into a real
            career skill.
          </p>
          <Button size="lg" asChild className="relative">
            <Link href="/sign-up">
              Start your quest free <ArrowRight className="size-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
