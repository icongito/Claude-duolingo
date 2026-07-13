"use client";

import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { Star } from "lucide-react";
import { WORLDS } from "@/lib/gamification/worlds";
import { cn } from "@/lib/utils";

function WorldIcon({ name, className }: { name: string; className?: string }) {
  const Icon = (Icons as unknown as Record<string, Icons.LucideIcon>)[name] ?? Icons.Sparkles;
  return <Icon className={className} />;
}

const PREVIEW_WORLDS = WORLDS.slice(0, 7);

export function Roadmap() {
  return (
    <section id="roadmap" className="relative py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-14 text-center">
          <p className="mb-3 text-sm font-semibold tracking-widest text-primary uppercase">
            The Quest Line
          </p>
          <h2 className="font-pixel text-3xl text-foreground sm:text-4xl">
            One path. Twenty-five worlds.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Every world unlocks the next. No overwhelming syllabus, just the
            next glowing node on the map.
          </p>
        </div>

        <div className="relative">
          <div
            className="absolute top-0 bottom-0 left-[27px] w-px border-l-2 border-dashed border-primary/30 sm:left-[31px]"
            aria-hidden
          />

          <ol className="flex flex-col gap-5">
            {PREVIEW_WORLDS.map((world, i) => (
              <motion.li
                key={world.slug}
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.45, delay: i * 0.05 }}
                className="relative flex items-start gap-4 sm:gap-6"
              >
                <div className="relative z-10 flex size-14 shrink-0 flex-col items-center justify-center rounded-full border-2 border-primary bg-card font-display text-lg font-bold text-primary shadow-[0_0_18px_rgba(255,122,26,0.35)] sm:size-16 sm:text-xl">
                  {world.order}
                  <span className="mt-0.5 flex gap-0.5">
                    {Array.from({ length: 3 }).map((_, s) => (
                      <Star key={s} className="size-2 fill-accent text-accent" />
                    ))}
                  </span>
                </div>

                <div className="glow-border-strong flex flex-1 flex-col gap-3 rounded-2xl bg-card p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="font-display text-lg font-semibold">
                      World {world.order}: {world.title}{" "}
                      <span className="text-muted-foreground text-sm font-normal">
                        ({world.lessonCount} lessons)
                      </span>
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {world.description}
                    </p>
                  </div>
                  <div
                    className={cn(
                      "flex size-12 shrink-0 items-center justify-center self-start rounded-xl border sm:self-center",
                    )}
                    style={{
                      borderColor: `${world.colorFrom}55`,
                      background: `linear-gradient(135deg, ${world.colorFrom}22, ${world.colorTo}22)`,
                    }}
                  >
                    <WorldIcon name={world.icon} className="size-6 text-primary" />
                  </div>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-center text-sm text-muted-foreground">
          <span>+18 more worlds, 600+ tasks total</span>
          <span className="hidden h-4 w-px bg-border sm:block" />
          <span>Progressive difficulty</span>
          <span className="hidden h-4 w-px bg-border sm:block" />
          <span>Beginner to advanced</span>
        </div>
      </div>
    </section>
  );
}
