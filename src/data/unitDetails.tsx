/*
 * Copyright (c) 2006 - 2026 Hall of the Gods, Inc.
 * All Rights Reserved.
 *
 * Shared unit details and color configuration.
 */

import React from "react";
import { Trees, Waves, Mountain } from "lucide-react";
import { DesertIcon } from "../UnitIcons";
import { PIECES } from "../constants";

export const unitColorMap: Record<
  string,
  { text: string; bg: string; border: string; shadow: string; ribbonBg: string }
> = {
  [PIECES.COMMANDER]: {
    text: "text-yellow-500",
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/40",
    shadow: "shadow-[0_0_10px_rgba(234,179,8,0.1)]",
    ribbonBg: "bg-yellow-500",
  },
  [PIECES.BATTLEKNIGHT]: {
    text: "text-purple-500",
    bg: "bg-purple-500/10",
    border: "border-purple-500/40",
    shadow: "shadow-[0_0_10px_rgba(168,85,247,0.1)]",
    ribbonBg: "bg-purple-500",
  },
  [PIECES.TANK]: {
    text: "text-yellow-500",
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/40",
    shadow: "shadow-[0_0_10px_rgba(234,179,8,0.1)]",
    ribbonBg: "bg-yellow-500",
  },
  [PIECES.SNIPER]: {
    text: "text-red-500",
    bg: "bg-red-500/10",
    border: "border-red-500/40",
    shadow: "shadow-[0_0_10px_rgba(239,68,68,0.1)]",
    ribbonBg: "bg-red-500",
  },
  [PIECES.HORSEMAN]: {
    text: "text-stone-500",
    bg: "bg-stone-500/10",
    border: "border-stone-500/40",
    shadow: "shadow-[0_0_10px_rgba(120,113,108,0.1)]",
    ribbonBg: "bg-stone-500",
  },
  [PIECES.BOT]: {
    text: "text-blue-500",
    bg: "bg-blue-500/10",
    border: "border-blue-500/40",
    shadow: "shadow-[0_0_10px_rgba(59,130,246,0.1)]",
    ribbonBg: "bg-blue-500",
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
    title: "Solar Lancer",
    subtitle: "You Learned a New Job!",
    role: "The King",
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
    title: "Knight Queen",
    subtitle: "You Learned a New Job!",
    role: "The Queen",
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
    title: "Light Paladin",
    subtitle: "You Learned a New Job!",
    role: "The Rooks",
    desc: [],
    levelUp: {
      title: "Light Paladin!",
      stats: [
        "Safe in Swamps from Bishops & Knights.",
        "Safe in Deserts from all units except Rooks.",
        "Deserts end movement; must exit next turn.",
      ],
      terrainIcons: [
        <Waves key="wv" />,
        <DesertIcon key="ds" className="w-6 h-6" />,
      ],
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
    title: "Red Mage",
    subtitle: "You Learned a New Job!",
    role: "The Bishops",
    desc: [],
    levelUp: {
      title: "Red Mage",
      stats: ["Forests keep you safe from Rooks and Knights."],
      terrainIcons: [<Trees key="tr" />],
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
    title: "Dark Knight",
    subtitle: "You Learned a New Job!",
    role: "The Knights",
    desc: [],
    levelUp: {
      title: "Dark Knight",
      stats: ["Mountains keep you safe from Rooks and Bishops."],
      terrainIcons: [<Mountain key="mt" />],
    },
    movePattern: (r, c) => [
      [r - 2, c - 1],
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
    title: "Dragoon",
    subtitle: "You Learned a New Job!",
    role: "The Pawns",
    desc: [],
    levelUp: {
      title: "Dragoon",
      stats: ["Jump backwards 2 squares."],
      terrainIcons: [
        <Mountain key="mt" />,
        <Trees key="tr" />,
        <Waves key="wv" />,
      ],
    },
    movePattern: (r, c) => [[r - 1, c]],
    newMovePattern: (r, c) => [[r + 2, c]],
    attackPattern: (r, c) => [
      [r - 1, c - 1],
      [r - 1, c + 1],
    ],
  },
};
