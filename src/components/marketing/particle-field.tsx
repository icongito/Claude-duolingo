"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";

type Particle = {
  id: number;
  left: string;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
  color: string;
};

const COLORS = ["#FF7A1A", "#FFC857", "#FF9E3D"];

export function ParticleField({ count = 28 }: { count?: number }) {
  const particles = useMemo<Particle[]>(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: `${Math.round((i / count) * 100 + (i % 3) * 2)}%`,
        size: 2 + ((i * 7) % 5),
        duration: 10 + ((i * 3) % 12),
        delay: (i % 10) * 0.6,
        opacity: 0.25 + ((i % 5) * 0.1),
        color: COLORS[i % COLORS.length],
      })),
    [count],
  );

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden
    >
      {particles.map((p) => (
        <motion.span
          key={p.id}
          className="absolute rounded-full blur-[0.5px]"
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            opacity: p.opacity,
            boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
          }}
          initial={{ y: "110%" }}
          animate={{ y: "-10%" }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}
