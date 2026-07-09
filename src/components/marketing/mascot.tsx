"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * "Nova" — CodeQuest's original blocky pixel mascot. A small voxel-style
 * spark-bot built from layered rounded rects, not a copy of any reference
 * asset. Used sparingly across hero/empty-states per the design system's
 * "tasteful pixel-art accents" guidance.
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
  return (
    <motion.div
      className={cn("relative", className)}
      style={{ width: size, height: size }}
      animate={animate ? { y: [0, -14, 0] } : undefined}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
    >
      <svg viewBox="0 0 200 200" width="100%" height="100%" aria-hidden>
        <defs>
          <linearGradient id="nova-body" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FF9E3D" />
            <stop offset="100%" stopColor="#FF7A1A" />
          </linearGradient>
          <radialGradient id="nova-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FF7A1A" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#FF7A1A" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* ground glow */}
        <ellipse cx="100" cy="178" rx="52" ry="10" fill="url(#nova-glow)" />

        {/* legs */}
        <rect x="68" y="150" width="18" height="22" rx="5" fill="#B85312" />
        <rect x="114" y="150" width="18" height="22" rx="5" fill="#B85312" />

        {/* body */}
        <rect x="46" y="56" width="108" height="100" rx="22" fill="url(#nova-body)" />
        <rect x="46" y="56" width="108" height="100" rx="22" fill="black" opacity="0.05" />

        {/* screen face */}
        <rect x="62" y="76" width="76" height="52" rx="12" fill="#1a0d02" />
        {/* eyes */}
        <rect x="80" y="94" width="14" height="16" rx="4" fill="#FFC857" />
        <rect x="108" y="94" width="14" height="16" rx="4" fill="#FFC857" />
        {/* smile */}
        <rect x="88" y="114" width="24" height="5" rx="2.5" fill="#FFC857" opacity="0.8" />

        {/* antenna */}
        <rect x="96" y="34" width="8" height="24" rx="4" fill="#B85312" />
        <circle cx="100" cy="28" r="10" fill="#FFC857" />
        <circle cx="100" cy="28" r="4" fill="#fff" opacity="0.8" />

        {/* arms */}
        <rect x="30" y="88" width="18" height="16" rx="8" fill="#FF9E3D" />
        <rect x="152" y="88" width="18" height="16" rx="8" fill="#FF9E3D" />
      </svg>
    </motion.div>
  );
}
