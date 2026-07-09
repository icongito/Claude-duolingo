"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const COLORS: Record<string, string> = {
  "1": "#7A3D10", // outline
  "2": "#FF7A1A", // body main
  "3": "#FF9E3D", // body highlight
  "4": "#1A0D02", // screen
  "5": "#FFC857", // eye / accent
  "6": "#B85312", // legs / pole
  "7": "#FF9E3D", // flag
};

// 12 x 14 pixel-art sprite, authored as a bitmap so every edge is a hard
// square — a real voxel/8-bit character, not a rounded-rect impostor.
const SPRITE: string[] = [
  "000005500000",
  "000006600000",
  "000006600000",
  "000111111000",
  "000122221000",
  "000144441000",
  "000154451000",
  "000144441000",
  "000111111000",
  "012222222667",
  "012222222667",
  "000222220000",
  "000660006600",
  "000660006600",
];

const UNIT = 12;

/**
 * "Nova" — CodeQuest's original pixel-art mascot. Authored as a bitmap grid
 * (not smooth rounded rects) so it reads as genuine 8-bit/voxel art, matching
 * the reference's blocky mascot style with entirely original geometry.
 */
export function Mascot({
  className,
  animate = true,
  size = 220,
}: {
  className?: string;
  animate?: boolean;
  size?: number;
}) {
  const cols = SPRITE[0].length;
  const rows = SPRITE.length;
  const width = cols * UNIT;
  const height = rows * UNIT;

  return (
    <motion.div
      className={cn("relative", className)}
      style={{ width: size, height: size }}
      animate={animate ? { y: [0, -14, 0] } : undefined}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
    >
      <svg
        viewBox={`0 0 ${width} ${height + 16}`}
        width="100%"
        height="100%"
        aria-hidden
        shapeRendering="crispEdges"
      >
        <defs>
          <radialGradient id="nova-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FF7A1A" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#FF7A1A" stopOpacity="0" />
          </radialGradient>
        </defs>

        <ellipse
          cx={width / 2}
          cy={height + 6}
          rx={width * 0.34}
          ry={8}
          fill="url(#nova-glow)"
        />

        {SPRITE.map((row, r) =>
          row.split("").map((cell, c) => {
            if (cell === "0") return null;
            return (
              <rect
                key={`${r}-${c}`}
                x={c * UNIT}
                y={r * UNIT}
                width={UNIT}
                height={UNIT}
                fill={COLORS[cell]}
              />
            );
          }),
        )}
      </svg>
    </motion.div>
  );
}
