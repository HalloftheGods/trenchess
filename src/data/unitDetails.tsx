/*
 * Copyright (c) 2006 - 2026 Hall of the Gods, Inc.
 * All Rights Reserved.
 *
 * Shared unit details and color configuration.
 */

import React from "react";
import { Trees, Waves, Mountain } from "lucide-react";

import { PIECES } from "../constants";

export const unitColorMap: Record<
  string,
  {
    text: string;
    bg: string;
    border: string;
    shadow: string;
    ribbonBg: string;
    ring: string;
  }
> = {
  [PIECES.COMMANDER]: {
    text: "text-purple-500",
    bg: "bg-purple-500/10",
    border: "border-purple-500/40",
    shadow: "shadow-[0_0_10px_rgba(168,85,247,0.1)]",
    ribbonBg: "bg-purple-500",
    ring: "ring-purple-500/50",
  },
  [PIECES.BATTLEKNIGHT]: {
    text: "text-emerald-500",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/40",
    shadow: "shadow-[0_0_10px_rgba(16,185,129,0.1)]",
    ribbonBg: "bg-emerald-500",
    ring: "ring-emerald-500/50",
  },
  [PIECES.TANK]: {
    text: "text-yellow-500",
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/40",
    shadow: "shadow-[0_0_10px_rgba(234,179,8,0.1)]",
    ribbonBg: "bg-yellow-500",
    ring: "ring-yellow-500/50",
  },
  [PIECES.SNIPER]: {
    text: "text-orange-500",
    bg: "bg-orange-500/10",
    border: "border-orange-500/40",
    shadow: "shadow-[0_0_10px_rgba(249,115,22,0.1)]",
    ribbonBg: "bg-orange-500",
    ring: "ring-orange-500/50",
  },
  [PIECES.HORSEMAN]: {
    text: "text-brand-red",
    bg: "bg-brand-red/10",
    border: "border-brand-red/40",
    shadow: "shadow-[0_0_10px_rgba(239,68,68,0.1)]",
    ribbonBg: "bg-brand-red",
    ring: "ring-brand-red/50",
  },
  [PIECES.BOT]: {
    text: "text-brand-blue",
    bg: "bg-brand-blue/10",
    border: "border-brand-blue/40",
    shadow: "shadow-[0_0_10px_rgba(59,130,246,0.1)]",
    ribbonBg: "bg-brand-blue",
    ring: "ring-brand-blue/50",
  },
};

export const UNIT_DETAILS: Record<
  string,
  {
    title: string;
    subtitle?: string;
    role: string;
    desc?: string[];
    levelUp?: {
      title: string;
      stats: string[];
      icon?: React.ReactNode;
      terrainIcons?: React.ReactNode[];
    };
    movePattern: (r: number, c: number) => number[][];
    newMovePattern?: (r: number, c: number) => number[][];
    attackPattern?: (r: number, c: number) => number[][];
  }
> = {
  [PIECES.COMMANDER]: {
    title: "King Juggernaut",
    subtitle: "The Kings",
    role: "The Kings clears 2 steps foward.",
    desc: [],
    levelUp: {
      title: "Sovereign Lancer",
      stats: [
        "Joust 2 squares in a straight line.",
        "Captures any enemies in the way.",
      ],
      terrainIcons: [
        <Mountain key="mt" />,
        <Trees key="tr" />,
        <Waves key="wv" />,
      ],
    },
    movePattern: (r, c) => [
      [r - 1, c],
      [r + 1, c],
      [r, c - 1],
      [r, c + 1],
      [r - 1, c - 1],
      [r - 1, c + 1],
      [r + 1, c - 1],
      [r + 1, c + 1],
    ],
    newMovePattern: (r, c) => [
      [r - 2, c],
      [r + 2, c],
      [r, c - 2],
      [r, c + 2],
    ],
    attackPattern: (r, c) => [
      [r - 1, c],
      [r + 1, c],
      [r, c - 1],
      [r, c + 1],
    ],
  },
  [PIECES.BATTLEKNIGHT]: {
    title: "Kami KazQueen",
    subtitle: "The Queens",
    role: "The Queens rode their steeds.",
    desc: [],
    levelUp: {
      title: "Royal Battle Knight",
      stats: ["Leap over units L-shape."],
      terrainIcons: [
        <Mountain key="mt" />,
        <Trees key="tr" />,
        <Waves key="wv" />,
      ],
    },
    movePattern: (r, c) => {
      const moves: number[][] = [];
      for (let i = 1; i < 12; i++) {
        moves.push([r + i, c], [r - i, c], [r, c + i], [r, c - i]);
        moves.push(
          [r + i, c + i],
          [r - i, c - i],
          [r + i, c - i],
          [r - i, c + i],
        );
      }
      return moves;
    },
    newMovePattern: (r, c) =>
      [
        [-2, -1],
        [-2, 1],
        [-1, -2],
        [-1, 2],
        [1, -2],
        [1, 2],
        [2, -1],
        [2, 1],
      ].map(([dr, dc]) => [r + dr, c + dc]),
  },
  [PIECES.TANK]: {
    title: "Twilight Guardian",
    subtitle: "The Rooks",
    role: "The Rooks guarded the Swamps, Dusk-to-Dusk.",
    desc: [],
    levelUp: {
      title: "Twilight Guardian!",
      stats: [
        "Single-step-diagonal: Advance1 square diagonally.",
        "Swamp Sanctuary: Safe from Bishops & Knights.",
      ],
      terrainIcons: [<Waves key="wv" />],
    },
    newMovePattern(r, c) {
      return [
        [r - 1, c - 1],
        [r + 1, c - 1],
        [r + 1, c + 1],
        [r - 1, c + 1],
      ];
    },
    movePattern: (r, c) => {
      const moves: number[][] = [];
      for (let i = 1; i < 12; i++) {
        moves.push([r + i, c], [r - i, c], [r, c + i], [r, c - i]);
      }
      return moves;
    },
  },
  [PIECES.SNIPER]: {
    title: "Light Healer",
    subtitle: "The Bishops",
    role: "The Bishops healed the Forest with Light.",
    desc: [],
    levelUp: {
      title: "Healer",
      stats: [
        "Double-step Retreat: Horizonal or Vertical 2 squares.",
        "Forest Sanctuary: Safe from Rooks and Knights.",
      ],
      terrainIcons: [<Trees key="tr" />],
    },
    newMovePattern(r, c) {
      return [
        [r - 2, c - 0],
        [r + 2, c - 0],
        [r + 0, c - 2],
        [r + 0, c + 2],
      ];
    },
    movePattern: (r, c) => {
      const moves: number[][] = [];
      for (let i = 1; i < 12; i++) {
        moves.push(
          [r + i, c + i],
          [r - i, c - i],
          [r + i, c - i],
          [r - i, c + i],
        );
      }
      return moves;
    },
  },
  [PIECES.HORSEMAN]: {
    title: "Shadow Knight",
    subtitle: "The Knights",
    role: "The Knights rode the Mountains under Dark.",
    desc: [],
    levelUp: {
      title: "Shadow Knight",
      stats: [
        "Triple-Jump: Horizontal or Vertical 3 squares.",
        "Mountain Sanctuary: Safe from Rooks and Bishops.",
      ],
      terrainIcons: [<Mountain key="mt" />],
    },

    newMovePattern(r, c) {
      return [
        [r + 3, c - 0],
        [r - 3, c - 0],
        [r + 0, c - 3],
        [r + 0, c + 3],
      ];
    },
    movePattern: (r, c) => [
      [r - 2, c - 1],
      [r - 3, c - 0],
      [r - 2, c + 1],
      [r - 1, c - 2],
      [r - 1, c + 2],
      [r + 1, c - 2],
      [r + 1, c + 2],
      [r + 2, c - 1],
      [r + 2, c + 1],
    ],
  },
  [PIECES.BOT]: {
    title: "Jumping Dragoon",
    subtitle: "The Pawns",
    role: "The Pawns learned how to backflip.",
    desc: [],
    levelUp: {
      title: "Jumping Dragoon",
      stats: [
        "Backflip: Vault 2 squares if vacant.",
        "Crouching-Tiger-Hidden-Dragoon: Backflip capture on left or right.",
      ],
      terrainIcons: [
        <Mountain key="mt" />,
        <Trees key="tr" />,
        <Waves key="wv" />,
      ],
    },
    movePattern: (r, c) => [[r - 1, c]],
    newMovePattern: (r, c) => [
      [r + 2, c],
      [r + 2, c - 1],
      [r + 2, c + 1],
    ],
    attackPattern: (r, c) => [
      [r - 1, c - 1],
      [r - 1, c + 1],
      [r + 2, c - 1],
      [r + 2, c + 1],
    ],
  },
};
