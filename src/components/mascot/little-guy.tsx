"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * Little Guy — CodeQuest's canonical pixel mascot, rendered on a 64x48
 * logical-pixel canvas that CSS scales up with hard edges. Ported from the
 * standalone sprite set in public/little-guy.html; scenery colors use the
 * app's dark palette and the background is transparent so he can sit on any
 * surface. Honors prefers-reduced-motion by freezing on a still frame.
 */

export type LittleGuyAnimation =
  | "lesson"
  | "streak"
  | "boss"
  | "wrong"
  | "level"
  | "idle"
  | "think"
  | "chest"
  | "comeback";

const GW = 64;
const GH = 48;
const FPS = 10;
const FRAME_MS = 1000 / FPS;

// The guy (constant across surfaces)
const BODY = "#D9755A";
const INK = "#141414";
const GLOW = "#FF7A1A";
const GOLD = "#F2B33D";
const GOLD2 = "#FFD873";
const DARKBODY = "#2E2A25";
const WOOD = "#B07A44";
const WOOD_D = "#8A5D2E";
const WOOD_L = "#C89457";
const METAL = "#4A3D30";

// Scenery, tuned for the app's dark theme
const SAND = "#2A2521";
const BEAM = "#3A2D14";
const SMOKE = "#57524A";
const RAIN = "#46525C";
const RAIN_DIM = "#333C44";
const CLOUD_D = "#3E3A34";
const PUDDLE = "#20262B";
const BUBBLE = "#262220";
const DOT_ON = "#F5F1EA";
const SAND_DIM = ["#2A2521", "#211D19", "#171412", "#0D0D0D"];

/** Sentinel color: punch a transparent hole instead of painting. */
const ERASE = "__erase__";

type Cell = [number, number, string];

const R = (i: number, s = 0) => {
  const v = Math.sin(i * 127.1 + s * 311.7) * 43758.5453;
  return v - Math.floor(v);
};

const FONT: Record<string, string[]> = {
  "+": ["...", ".#.", "###", ".#.", "..."],
  "2": ["###", "..#", "###", "#..", "###"],
  "0": ["###", "#.#", "#.#", "#.#", "###"],
  X: ["#.#", "#.#", ".#.", "#.#", "#.#"],
  P: ["###", "#.#", "###", "#..", "#.."],
  L: ["#..", "#..", "#..", "#..", "###"],
  V: ["#.#", "#.#", "#.#", "#.#", ".#."],
  U: ["#.#", "#.#", "#.#", "#.#", "###"],
  " ": ["...", "...", "...", "...", "..."],
};

type Eyes =
  | "normal"
  | "closed"
  | "slit"
  | "happy"
  | "x"
  | "flame"
  | "coin";
type ArmMode = "down" | "sag" | "up" | "boxer";

/** Marketplace wearables — extra cell layers drawn by the same rig so they
 * track every animation's bounce/squash for free. */
export type LittleGuyWear = "none" | "cap" | "wizard" | "crown" | "specs";

const WIZ = "#6C4ED9";
const CAP_BAND = "#C25910";

/** Set by the component right before each draw; guyCells reads it so every
 * animation renders the equipped cosmetic without knowing about it. */
let ACTIVE_WEAR: LittleGuyWear = "none";

type GuyParams = {
  dy?: number;
  sq?: number;
  st?: number;
  eyes?: Eyes;
  eDx?: number;
  eDy?: number;
  armL?: ArmMode;
  armR?: ArmMode;
  legUp?: [number, number, number, number];
  dangle?: boolean;
  poke?: boolean;
};

// Reference build: body 16 cells wide (x24..39), FOUR legs, feet on y=40.
function guyCells(p: GuyParams = {}): Cell[] {
  const {
    dy = 0,
    sq = 0,
    st = 0,
    eyes = "normal",
    eDx = 0,
    eDy = 0,
    armL = "down",
    armR = "down",
    legUp = [0, 0, 0, 0],
    dangle = false,
    poke = false,
  } = p;
  const C: Cell[] = [];
  const add = (x: number, y: number, w = 1, h = 1, c = BODY) => {
    for (let i = 0; i < w; i++)
      for (let j = 0; j < h; j++) C.push([x + i, y + j, c]);
  };
  const capY = 26 + dy + sq - st;
  add(26, capY, 12, 2);
  add(24, capY + 2, 16, 33 + dy - (capY + 2) + 1);
  const armY = 30 + dy;
  const arm = (side: -1 | 1, mode: ArmMode) => {
    const left = side < 0;
    if (mode === "down") add(left ? 20 : 40, armY, 4, 2);
    if (mode === "sag") add(left ? 20 : 40, armY + 1, 4, 2);
    if (mode === "up") add(left ? 22 : 40, armY - 5, 2, 5);
    if (mode === "boxer") add(left ? 22 : 40, armY - 3, 2, 3);
  };
  arm(-1, armL);
  arm(1, armR);
  if (poke) {
    add(40, armY, 4, 2);
    add(44, armY, 2, 2);
  }
  // four legs: edge pair + inner pair, matching the reference sheet
  (
    [
      [24, 0],
      [28, 1],
      [34, 2],
      [38, 3],
    ] as const
  ).forEach(([lx, i]) => {
    // Dangling legs stay attached at the hip and hang longer — shifting the
    // start row down instead left a 1px gap (visibly detached mid-air).
    const hang = dangle ? i % 2 : 0;
    add(lx, 34 + dy - legUp[i], 2, 6 + hang);
  });
  const ex1 = 27 + eDx,
    ex2 = 35 + eDx,
    ey = 29 + dy + sq - st + eDy;
  const eye = (ex: number) => {
    switch (eyes) {
      case "normal":
        add(ex, ey, 2, 2, INK);
        break;
      case "closed":
        add(ex, ey + 1, 2, 1, INK);
        break;
      case "slit":
        add(ex - 1, ey + 1, 3, 1, INK);
        break;
      case "happy":
        add(ex - 1, ey, 3, 1, INK);
        add(ex - 1, ey + 1, 1, 1, INK);
        add(ex + 1, ey + 1, 1, 1, INK);
        break;
      case "x":
        (
          [
            [0, 0],
            [2, 0],
            [1, 1],
            [0, 2],
            [2, 2],
          ] as const
        ).forEach(([a, b]) => add(ex - 1 + a, ey + b, 1, 1, INK));
        break;
      case "flame":
        add(ex, ey - 1, 1, 1, GLOW);
        add(ex, ey, 2, 1, GLOW);
        add(ex, ey + 1, 2, 1, GOLD);
        break;
      case "coin":
        add(ex - 1, ey, 3, 2, GOLD);
        add(ex, ey, 1, 1, GOLD2);
        break;
    }
  };
  eye(ex1);
  eye(ex2);
  switch (ACTIVE_WEAR) {
    case "cap":
      add(27, capY - 3, 10, 2, GLOW);
      add(26, capY - 1, 12, 1, CAP_BAND);
      add(38, capY - 1, 4, 1, CAP_BAND);
      break;
    case "wizard":
      add(31, capY - 8, 2, 1, WIZ);
      add(30, capY - 7, 4, 2, WIZ);
      add(29, capY - 5, 6, 2, WIZ);
      add(28, capY - 3, 8, 2, WIZ);
      add(25, capY - 1, 14, 1, WIZ);
      add(31, capY - 6, 1, 1, GOLD2);
      break;
    case "crown":
      add(27, capY - 4, 1, 2, GOLD);
      add(31, capY - 4, 2, 2, GOLD);
      add(36, capY - 4, 1, 2, GOLD);
      add(27, capY - 2, 10, 2, GOLD);
      add(29, capY - 1, 1, 1, GLOW);
      add(34, capY - 1, 1, 1, GLOW);
      break;
    case "specs":
      [ex1, ex2].forEach((ex) => {
        add(ex - 1, ey - 1, 4, 1, DOT_ON);
        add(ex - 1, ey + 2, 4, 1, DOT_ON);
        add(ex - 1, ey, 1, 2, DOT_ON);
        add(ex + 2, ey, 1, 2, DOT_ON);
      });
      add(ex1 + 3, ey, 4, 1, DOT_ON);
      break;
  }
  return C;
}

type Anim = { len: number; still: number; draw: (f: number, d: Draw) => void };

/** Per-frame drawing toolkit bound to a canvas context. */
type Draw = {
  px: (x: number, y: number, c: string, w?: number, h?: number) => void;
  blit: (cells: Cell[], ox?: number, oy?: number) => void;
  blitScaled: (
    cells: Cell[],
    ox: number,
    oy: number,
    scale: number,
    cx: number,
    cy: number,
    recolor: (c: string) => string,
  ) => void;
  text: (str: string, x: number, y: number, c: string, sc?: number) => void;
  textW: (str: string, sc?: number) => number;
  ground: (dim?: number) => void;
  flame: (cx: number, topY: number, fi: number, size?: number) => void;
  heart: (cx: number, cy: number, c?: string) => void;
  engulf: (cells: Cell[], f: number) => void;
};

function makeDraw(ctx: CanvasRenderingContext2D): Draw {
  const px = (x: number, y: number, c: string, w = 1, h = 1) => {
    if (c === ERASE) {
      ctx.clearRect(x, y, w, h);
    } else {
      ctx.fillStyle = c;
      ctx.fillRect(x, y, w, h);
    }
  };
  const blit = (cells: Cell[], ox = 0, oy = 0) => {
    for (const [x, y, c] of cells) px(x + ox, y + oy, c);
  };
  const blitScaled: Draw["blitScaled"] = (
    cells,
    ox,
    oy,
    scale,
    cx,
    cy,
    recolor,
  ) => {
    for (const [x, y, c] of cells)
      px(
        cx + (x - cx) * scale + ox,
        cy + (y - cy) * scale + oy,
        recolor(c),
        scale,
        scale,
      );
  };
  const text: Draw["text"] = (str, x, y, c, sc = 1) => {
    let cx = x;
    for (const ch of str) {
      const g = FONT[ch];
      if (!g) {
        cx += 4 * sc;
        continue;
      }
      for (let r = 0; r < 5; r++)
        for (let q = 0; q < 3; q++)
          if (g[r][q] === "#") px(cx + q * sc, y + r * sc, c, sc, sc);
      cx += 4 * sc;
    }
  };
  const textW: Draw["textW"] = (str, sc = 1) => str.length * 4 * sc - sc;
  const ground: Draw["ground"] = (dim = 0) => {
    px(12, 40, SAND_DIM[dim], 40, 2);
    px(8, 40, SAND_DIM[dim], 2, 1);
    px(54, 40, SAND_DIM[dim], 2, 1);
  };
  const flame: Draw["flame"] = (cx, topY, fi, size = 2) => {
    if (size <= 0) return;
    const shapes = [
      [
        [1, 0],
        [0, 1],
        [1, 1],
        [2, 1],
        [0, 2],
        [1, 2],
        [2, 2],
      ],
      [
        [1, -1],
        [1, 0],
        [2, 0],
        [0, 1],
        [1, 1],
        [2, 1],
        [0, 2],
        [1, 2],
        [2, 2],
      ],
      [
        [0, 0],
        [1, 0],
        [0, 1],
        [1, 1],
        [2, 1],
        [0, 2],
        [1, 2],
        [2, 2],
      ],
    ][fi % 3];
    for (const [a, b] of shapes) px(cx - 1 + a, topY + b, GLOW);
    px(cx, topY + 2, GOLD);
    if (size === 1) {
      px(cx, topY + 1, ERASE);
      px(cx + 1, topY, ERASE);
    }
  };
  const heart: Draw["heart"] = (cx, cy, c = GLOW) => {
    const g = [".#.#.", "#####", ".###.", "..#.."];
    for (let r = 0; r < 4; r++)
      for (let q = 0; q < 5; q++)
        if (g[r][q] === "#") px(cx - 2 + q, cy + r, c);
  };
  const engulf: Draw["engulf"] = (cells, f) => {
    const key = (x: number, y: number) => y * 64 + x;
    const sil = new Set(cells.map(([x, y]) => key(x, y)));
    const dilate = (src: Set<number>) => {
      const out = new Set(src);
      for (const k of src) {
        const x = k % 64,
          y = (k - x) / 64;
        if (x < 63) out.add(key(x + 1, y));
        if (x > 0) out.add(key(x - 1, y));
        out.add(key(x, y + 1));
        if (y > 0) out.add(key(x, y - 1));
      }
      return out;
    };
    const inner = dilate(sil),
      outer = dilate(inner);
    const draw = (set: Set<number>, c: string) => {
      for (const k of set) {
        const x = k % 64,
          y = (k - x) / 64;
        if (y <= 39) px(x, y, c);
      }
    };
    draw(outer, GLOW);
    draw(inner, GOLD);
    const topOf: Record<number, number> = {};
    for (const k of outer) {
      const x = k % 64,
        y = (k - x) / 64;
      if (!(x in topOf) || y < topOf[x]) topOf[x] = y;
    }
    for (const xs in topOf) {
      const x = +xs,
        h = 1 + Math.floor(R(x * 7, f) * 4);
      for (let j = 1; j <= h; j++)
        px(x, topOf[x] - j, j === h ? GOLD : GLOW);
    }
  };
  return { px, blit, blitScaled, text, textW, ground, flame, heart, engulf };
}

const ANIMS: Record<LittleGuyAnimation, Anim> = {
  lesson: {
    len: 26,
    still: 13,
    draw(f, d) {
      const hop = [0, -2, -4, -4, -2, 0];
      const dy = f < 6 ? hop[f] : f < 12 ? hop[f - 6] : 0;
      for (const s of [2, 8])
        if (f >= s && f < s + 12) {
          for (let i = 0; i < 14; i++) {
            const t = f - s,
              vx = (R(i, s) - 0.5) * 3,
              vy = -(1.5 + R(i, s + 9) * 2);
            const x = 32 + Math.round(vx * t),
              y = 30 + Math.round(vy * t + 0.32 * t * t);
            if (y < 42) d.px(x, y, i % 2 ? GLOW : GOLD);
          }
        }
      const air = dy < 0;
      d.blit(
        guyCells({
          dy,
          eyes: f < 16 ? "happy" : "normal",
          armL: air ? "up" : "down",
          armR: air ? "up" : "down",
        }),
      );
      if (f >= 5 && f < 20) {
        const sc = f < 8 ? 1 : 2,
          ty = 18 - Math.max(0, f - 8);
        d.text(
          "+20 XP",
          32 - Math.floor(d.textW("+20 XP", sc) / 2),
          ty,
          GLOW,
          sc,
        );
      }
    },
  },
  streak: {
    len: 34,
    still: 20,
    draw(f, d) {
      const lift: [number, number, number, number] =
        f < 8 ? (f % 4 < 2 ? [2, 0, 0, 2] : [0, 2, 2, 0]) : [0, 0, 0, 0];
      const cells = guyCells({
        legUp: lift,
        st: f >= 8 ? 1 : 0,
        eyes: f === 8 || f === 9 ? "flame" : f >= 10 ? "slit" : "normal",
      });
      if (f >= 10) d.engulf(cells, f);
      d.blit(cells);
      if (f === 8 || f === 9) d.flame(31, 22, f, 1);
    },
  },
  boss: {
    len: 44,
    still: 40,
    draw(f, d) {
      for (let i = 0; i < 8; i++) {
        const x = Math.floor(R(i) * 64 + f * 1.2) % 64,
          y = 8 + Math.floor(R(i, 4) * 30);
        d.px(x, y, SMOKE);
      }
      // Boss: a giant dark twin cresting over the top edge — torso and head
      // only (legs cropped so it reads as a looming wall, not a squashed
      // second creature), eased descent, then a slow menacing bob.
      if (f >= 6) {
        const t = Math.min(1, (f - 6) / 12);
        const e = 1 - Math.pow(1 - t, 3);
        const bob = t >= 1 && Math.floor(f / 3) % 2 === 0 ? 1 : 0;
        const bossY = Math.round(-46 + 28 * e) + bob;
        const torso = guyCells({ eyes: "slit" }).filter(([, y]) => y < 34);
        d.blitScaled(torso, 0, bossY, 2, 32, 33, (c) =>
          c === INK ? GLOW : DARKBODY,
        );
        // arrival tremor: dust kicked up at the edges of the arena
        if (f === 18 || f === 19) {
          for (const [x, y] of [
            [10, 39],
            [14, 38],
            [50, 38],
            [54, 39],
          ]) {
            d.px(x, y, SMOKE);
          }
        }
      }
      const crouch = f >= 2,
        boxer = f >= 8;
      const tremor = f === 18 || f === 19 ? (f % 2 ? 1 : -1) : 0;
      const bounce = f >= 22 && Math.floor(f / 2) % 2 === 1 ? -1 : 0;
      d.blit(
        guyCells({
          sq: crouch ? 2 : 0,
          dy: bounce,
          eyes: crouch ? "slit" : "normal",
          armL: boxer ? "boxer" : "down",
          armR: boxer ? "boxer" : "down",
        }),
        tremor,
      );
    },
  },
  wrong: {
    len: 40,
    still: 2,
    draw(f, d) {
      if (f < 4) d.heart(30, 14);
      else if (f < 6) {
        d.heart(30, 14);
        d.px(30, 14, ERASE);
        d.px(30, 15, ERASE);
        d.px(29, 16, ERASE);
      } else if (f < 14) {
        const dd = f - 6;
        d.px(28 - dd, 15 + dd + Math.floor(dd * dd * 0.1), GLOW, 2, 2);
        d.px(31 + dd, 15 + dd + Math.floor(dd * dd * 0.1), GLOW, 2, 2);
      }
      const ox = f === 1 ? -2 : f >= 2 ? -3 : 0,
        dy = f === 1 ? -2 : 0;
      if (f < 6) {
        d.blit(guyCells({ dy, eyes: f >= 2 ? "x" : "normal" }), ox);
      } else if (f < 19) {
        const t = f - 6,
          cells = guyCells({ eyes: "x" });
        cells.forEach(([x, y, c], i) => {
          const dx = x - 32,
            dyc = y - 31;
          const m = Math.max(1, Math.hypot(dx, dyc));
          const vx = (dx / m) * (1.2 + R(i) * 2),
            vy = (dyc / m) * (1.2 + R(i, 2) * 2) - (1 + R(i, 5) * 2);
          const nx = x + ox + Math.round(vx * t),
            ny = y + Math.round(vy * t + 0.3 * t * t);
          if (t < 7 + R(i, 9) * 6 && ny < 44 && nx >= 0 && nx < 64)
            d.px(nx, ny, c);
        });
      } else if (f >= 25 && f < 34) {
        const k = 1 - Math.pow(1 - (f - 25) / 8, 3),
          cells = guyCells({ eyes: "closed" });
        cells.forEach(([x, y, c], i) => {
          const fx = x + (R(i) - 0.5) * 44,
            fy = y - (6 + R(i, 3) * 26);
          d.px(Math.round(fx + (x - fx) * k), Math.round(fy + (y - fy) * k), c);
        });
      } else if (f >= 34) {
        d.blit(guyCells({ eyes: f < 37 ? "closed" : "normal" }));
      }
    },
  },
  level: {
    len: 52,
    still: 50,
    draw(f, d) {
      // Dramatic beam: pulsing width, layered gold core, sparkles rising.
      if (f < 30) {
        const w = Math.min(20, 4 + f * 4) + (f % 2 ? 2 : 0);
        d.px(32 - Math.floor(w / 2), 0, BEAM, w, 40);
        d.px(29, 0, GOLD, 6, 40);
        d.px(31, 0, GOLD2, 2, 40);
        for (let i = 0; i < 6; i++) {
          const y = 43 - (Math.floor(R(i, 11) * 40 + f * 3) % 42);
          d.px(29 + Math.floor(R(i, 13) * 6), y, i % 2 ? GOLD2 : "#FFFFFF");
        }
      }
      if (f < 4) {
        // caught in the beam
        d.blit(guyCells({ eyes: "closed" }));
      } else if (f < 12) {
        // lifted, vibrating with the energy
        const dy = -Math.min(6, Math.floor((f - 3) / 2) * 2);
        d.blit(guyCells({ dy, dangle: true, eyes: "closed" }), f % 2 ? 1 : -1);
      } else if (f < 20) {
        // slowly breaks apart — pixels stream up into the light
        const t = f - 12;
        const base = guyCells({ dy: -6, dangle: true, eyes: "closed" });
        base.forEach(([x, y, c], i) => {
          const gone = t > 3 + R(i, 9) * 5;
          if (gone) return;
          const rise = Math.round((1 + R(i, 3) * 1.8) * t);
          const jx = Math.round((R(i, 6) - 0.5) * 2);
          const ny = y - 6 - rise;
          if (ny >= 0) d.px(x + jx, ny, c);
        });
      } else if (f < 26) {
        // recollects high inside the beam
        const k = (f - 20) / 5;
        const e = k * k;
        const target = guyCells({ dy: -14, dangle: true, eyes: "closed" });
        target.forEach(([x, y, c], i) => {
          const sx = x + (R(i) - 0.5) * 30,
            sy = y - 24 - R(i, 5) * 14;
          d.px(Math.round(sx + (x - sx) * e), Math.round(sy + (y - sy) * e), c);
        });
      } else if (f < 28) {
        // SLAMS back down
        if (f === 26) {
          d.blit(guyCells({ dy: -8, eyes: "closed" }));
        } else {
          d.blit(guyCells({ sq: 2, eyes: "closed" }));
          for (const [x, y] of [
            [18, 39],
            [22, 38],
            [27, 39],
            [37, 39],
            [42, 38],
            [46, 39],
          ]) {
            d.px(x, y, SMOKE); // impact dust ring
          }
        }
      } else {
        const shake = f === 28 || f === 29 ? (f % 2 ? 2 : -2) : 0;
        d.blit(guyCells({ eyes: "happy", sq: f < 30 ? 1 : 0 }), shake);
        if (f >= 28) {
          const by = f === 28 ? 2 : f === 29 ? 8 : 6;
          d.text(
            "LVL UP",
            32 - Math.floor(d.textW("LVL UP", 2) / 2) + shake,
            by,
            GLOW,
            2,
          );
          for (let i = 0; i < 12; i++) {
            const y = Math.floor(R(i, 7) * 48 + (f - 28) * 2.5) % 46;
            d.px(Math.floor(R(i) * 60) + 2, y, i % 2 ? GOLD : GOLD2);
          }
        }
      }
    },
  },
  idle: {
    len: 48,
    still: 2,
    draw(f, d) {
      const st = f >= 6 && f < 16 ? 1 : 0;
      const eyes: Eyes =
        (f >= 20 && f < 22) || (f >= 44 && f < 46) ? "closed" : "normal";
      const eDx = f >= 36 && f < 40 ? -1 : f >= 40 && f < 44 ? 1 : 0;
      const tap: [number, number, number, number] =
        f === 30 || f === 32 ? [1, 0, 0, 0] : [0, 0, 0, 0];
      d.blit(guyCells({ st, eyes, eDx, legUp: tap }));
    },
  },
  think: {
    len: 16,
    still: 0,
    draw(f, d) {
      d.blit(
        guyCells({
          sq: 1,
          eyes: "normal",
          eDx: -1,
          eDy: -1,
          armR: f % 4 < 2 ? "down" : "sag",
        }),
      );
      d.px(40, 10, BUBBLE, 14, 8);
      d.px(41, 9, BUBBLE, 12, 1);
      d.px(41, 18, BUBBLE, 12, 1);
      d.px(38, 20, BUBBLE, 2, 2);
      d.px(36, 23, BUBBLE, 1, 1);
      // dots centered in the 14-wide bubble: 2px margins on both sides
      const active = Math.floor(f / 2) % 3;
      [0, 1, 2].forEach((i) =>
        d.px(42 + i * 4, 13, i === active ? DOT_ON : SAND, 2, 2),
      );
    },
  },
  chest: {
    len: 72,
    still: 44,
    draw(f, d) {
      const open = f >= 25;
      d.px(47, 34, WOOD, 14, 6);
      d.px(47, 36, WOOD_D, 14, 1);
      d.px(47, 38, WOOD_D, 14, 1);
      d.px(47, 34, WOOD_L, 14, 1);
      if (!open) {
        d.px(49, 30, WOOD_L, 10, 1);
        d.px(48, 31, WOOD, 12, 1);
        d.px(47, 32, WOOD, 14, 2);
        d.px(47, 33, WOOD_D, 14, 1);
      } else {
        d.px(49, 24, WOOD_L, 10, 1);
        d.px(48, 25, WOOD, 12, 1);
        d.px(47, 26, WOOD, 14, 2);
        d.px(47, 28, WOOD_D, 14, 1);
        d.px(48, 29, METAL, 1, 1);
        d.px(59, 29, METAL, 1, 1);
        d.px(48, 33, GOLD2, 12, 2);
        d.px(49, 32, GOLD, 3, 1);
        d.px(53, 32, GOLD, 2, 1);
        d.px(56, 32, GOLD, 3, 1);
        d.px(52, 31, GOLD2, 1, 1);
        d.px(57, 31, GOLD2, 1, 1);
        if (f < 30)
          for (let i = 0; i < 11; i++)
            d.px(
              48 + i,
              29 - Math.min(4, Math.abs(i - 5)) - (f % 2),
              GLOW,
              1,
              2 + (f % 2),
            );
      }
      const lidTop = open ? 24 : 30;
      d.px(48, lidTop, METAL, 1, open ? 5 : 10);
      d.px(59, lidTop, METAL, 1, open ? 5 : 10);
      if (open) {
        d.px(48, 34, METAL, 1, 6);
        d.px(59, 34, METAL, 1, 6);
      }
      d.px(52, open ? 33 : 32, GOLD, 4, 3);
      d.px(53, open ? 34 : 33, INK, 1, 1);
      d.px(53, open ? 35 : 34, INK, 1, 1);
      d.px(47, 39, GOLD2, 1, 1);
      d.px(60, 39, GOLD2, 1, 1);
      d.px(47, open ? 26 : 31, GOLD2, 1, 1);
      d.px(60, open ? 26 : 31, GOLD2, 1, 1);
      if (open && f < 44)
        for (let i = 0; i < 6; i++) {
          const t = f - 25 - i;
          if (t < 0 || t > 12) continue;
          const x = 54 - Math.round((0.5 + R(i) * 1.1) * t),
            y = 30 - Math.round(2.2 * t - 0.28 * t * t);
          if (y < 40 && x >= 42) {
            d.px(x, y, GOLD, 2, 2);
            d.px(x, y, GOLD2, 1, 1);
          }
        }
      const off = Math.min(4, -16 + f);
      const walking = off < 4;
      const dy =
        f === 26 ? -2 : f === 27 ? -3 : f === 28 ? -1 : f === 34 ? -2 : f === 35 ? -1 : 0;
      const back = f >= 26 ? -6 : 0;
      const eyes: Eyes =
        f === 32 || f === 33 ? "coin" : f >= 34 ? "happy" : "normal";
      d.blit(
        guyCells({
          dy,
          eyes,
          legUp: walking
            ? f % 4 < 2
              ? [2, 0, 0, 2]
              : [0, 2, 2, 0]
            : [0, 0, 0, 0],
          poke: f >= 22 && f < 25,
          armL: f >= 34 ? "up" : "down",
          armR: f >= 34 ? "up" : "down",
        }),
        f >= 26 ? off + back : off,
      );
    },
  },
  comeback: {
    len: 56,
    still: 52,
    draw(f, d) {
      const raining = f < 24;
      // Puddle pools on the ground beneath him, then drains away.
      const puddleW = raining
        ? Math.min(18, 4 + Math.floor(f * 0.8))
        : Math.max(0, 18 - (f - 24) * 2);
      if (puddleW > 0)
        d.px(32 - Math.floor(puddleW / 2), 40, PUDDLE, puddleW, 1);
      // Brooding personal raincloud: dark belly, lighter crown, slow drift.
      const cd = Math.floor(f / 8) % 2; // 1px drift
      if (f < 26) {
        d.px(26 + cd, 6, CLOUD_D, 12, 2);
        d.px(28 + cd, 4, CLOUD_D, 8, 2);
        d.px(29 + cd, 3, SMOKE, 6, 1);
        d.px(27 + cd, 4, SMOKE, 2, 1);
      } else if (f < 32) {
        d.px(26 + cd, 6, CLOUD_D, 12, 1); // thinning out
      }
      // Back rain layer: dim, short, slower — depth behind him.
      const backDrops = raining ? 12 : f < 30 ? Math.max(0, 12 - (f - 24) * 2) : 0;
      for (let i = 0; i < backDrops; i++) {
        const x = 25 + Math.floor(R(i, 21) * 15),
          y = 8 + (Math.floor(R(i, 22) * 32 + f * 3) % 32);
        if (y < 39) d.px(x, y, RAIN_DIM, 1, 2);
      }
      // Healthy double flame → sputter → smoke → spark → roars back bigger.
      if (f < 6) {
        d.flame(30, 19, f, 2);
        d.flame(33, 20, f + 1, 2);
      } else if (f < 8) {
        d.flame(31, 22, f, 1);
      } else if (f < 16) {
        for (let i = 0; i < 4; i++) {
          const t = f - 8;
          d.px(30 + Math.round((R(i) - 0.5) * 2 * t * 0.6), 21 - t + i, SMOKE);
        }
      }
      if (f >= 32 && f < 36 && f % 2 === 0) d.px(31, 21, GLOW);
      if (f >= 36 && f < 42) d.flame(31, 20, f, 2);
      if (f >= 42) {
        d.flame(30, 19, f, 2);
        d.flame(33, 20, f + 1, 2);
      }
      const wig = f >= 18 && f < 22 ? (f % 2 ? 1 : -1) : 0;
      const stomp: [number, number, number, number] =
        f === 25 ? [2, 2, 2, 2] : [0, 0, 0, 0];
      const dip = f === 26 ? 1 : 0;
      // Grief arc: watches the flame die, closes his eyes in the rain,
      // shakes it off, narrows with determination, then relights.
      const eyes: Eyes =
        f >= 6 && f < 18 ? "closed" : f >= 24 && f < 32 ? "slit" : "normal";
      d.blit(
        guyCells({
          eyes,
          eDy: f < 18 ? 1 : 0,
          legUp: stomp,
          dy: dip,
          armL: f < 18 ? "sag" : "down",
          armR: f < 18 ? "sag" : "down",
        }),
        wig,
      );
      if (f >= 26 && f < 29) {
        d.px(24, 39, SMOKE);
        d.px(39, 39, SMOKE);
      }
      // Front rain layer: long slanted streaks falling PAST him, with
      // splashes where they meet the ground.
      const frontDrops = raining
        ? 14
        : f < 32
          ? Math.max(0, 14 - (f - 24) * 2)
          : 0;
      for (let i = 0; i < frontDrops; i++) {
        const t = Math.floor(R(i, 3) * 32 + f * 5) % 32;
        const yy = 8 + t;
        const x = 25 + Math.floor(R(i) * 15) - Math.floor(t / 12);
        const h = Math.min(3, 39 - yy);
        if (h > 0) d.px(x, yy, RAIN, 1, h);
        if (yy + 3 < 39) d.px(x - 1, yy + 3, RAIN, 1, 1); // slanted tail tip
        if (raining && t >= 29) {
          d.px(x - 1, 39, RAIN, 1, 1); // splash
          d.px(x + 1, 39, RAIN, 1, 1);
        }
      }
    },
  },
};

/** Central window used by `crop` — fits the guy plus flame/ground margins. */
const CROP = { x: 14, y: 10, w: 36, h: 34 };

export function LittleGuy({
  animation = "idle",
  size = 160,
  withGround = false,
  crop = false,
  wear = "none",
  className,
}: {
  animation?: LittleGuyAnimation;
  size?: number;
  withGround?: boolean;
  /** Zoom to the character instead of showing the full 64x48 scene. Use for
   * guy-only animations (idle/streak); scene animations (chest, lesson,
   * level, think) need the full frame. */
  crop?: boolean;
  /** Equipped cosmetic (marketplace wearable). */
  wear?: LittleGuyWear;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;

    const d = makeDraw(ctx);
    const anim = ANIMS[animation];
    const rmq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const start = performance.now();
    let raf = 0;
    let lastFrame = -1;

    const render = (now: number) => {
      raf = requestAnimationFrame(render);
      const f = rmq.matches
        ? anim.still
        : Math.floor((now - start) / FRAME_MS) % anim.len;
      if (f === lastFrame) return;
      lastFrame = f;
      ctx.clearRect(0, 0, GW, GH);
      if (withGround) {
        const dim =
          animation === "boss" ? Math.min(3, Math.floor(f / 5)) : 0;
        d.ground(dim);
      }
      // Draws are synchronous, so scoping the wear to this call is safe even
      // with several differently-dressed guys on one page.
      ACTIVE_WEAR = wear;
      anim.draw(f, d);
      ACTIVE_WEAR = "none";
    };
    raf = requestAnimationFrame(render);
    return () => cancelAnimationFrame(raf);
  }, [animation, withGround, wear]);

  if (crop) {
    const canvasW = (size * GW) / CROP.w;
    return (
      <div
        className={cn("relative overflow-hidden", className)}
        style={{ width: size, height: (size * CROP.h) / CROP.w }}
        role="img"
        aria-label="Little Guy, the CodeQuest mascot"
      >
        <canvas
          ref={canvasRef}
          width={GW}
          height={GH}
          className="absolute [image-rendering:pixelated]"
          style={{
            width: canvasW,
            height: (canvasW * GH) / GW,
            left: (-size * CROP.x) / CROP.w,
            top: (-size * CROP.y) / CROP.w,
          }}
          aria-hidden
        />
      </div>
    );
  }

  return (
    <canvas
      ref={canvasRef}
      width={GW}
      height={GH}
      className={cn("[image-rendering:pixelated]", className)}
      style={{ width: size, height: (size * GH) / GW }}
      role="img"
      aria-label="Little Guy, the CodeQuest mascot"
    />
  );
}
