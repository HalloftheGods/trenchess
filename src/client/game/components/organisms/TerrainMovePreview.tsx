/*
 * Copyright (c) 2006 - 2026 Hall of the Gods, Inc.
 * All Rights Reserved.
 *
 * TerrainMovePreview — Display-only move preview grid
 */
import React from "react";
import { Trees, Waves, Mountain, ShieldPlus, X } from "lucide-react";
import { TERRAIN_TYPES } from "@/core/data/terrainDetails";
import { PIECES } from "@/core/data/unitDetails";
import { isUnitProtected } from "@/core/rules/gameLogic";
import type { TerrainType } from "@/types/game";
import { DesertIcon } from "@/client/game/components/atoms/UnitIcons";

/** Which terrain icon keys each unit has in its levelUp data. */
const UNIT_TERRAIN_KEYS: Record<string, string[]> = {
  [PIECES.KING]: ["mt", "tr", "wv"],
  [PIECES.QUEEN]: ["mt", "tr", "wv"],
  [PIECES.ROOK]: ["wv", "ds"],
  [PIECES.BISHOP]: ["tr"],
  [PIECES.KNIGHT]: ["mt"],
  [PIECES.PAWN]: ["mt", "tr", "wv"],
};

const TERRAIN_NAME_TO_KEY: Record<string, string> = {
  Mountains: "mt",
  Forests: "tr",
  Swamps: "wv",
  Desert: "ds",
};

function canTraverse(terrainName: string, unitType: string): boolean {
  const keys = UNIT_TERRAIN_KEYS[unitType] || [];
  const needed = TERRAIN_NAME_TO_KEY[terrainName];
  return keys.includes(needed);
}

// ── Terrain definitions ──────────────────────────────────────────────

interface TerrainDef {
  name: string;
  icon: React.ReactNode;
  bg: string;
  text: string;
  border: string;
  terrainTypeKey: string;
}

const TERRAIN_LIST: TerrainDef[] = [
  {
    name: "Forests",
    icon: <Trees />,
    bg: "bg-emerald-500/10",
    text: "text-emerald-500",
    border: "border-emerald-500/40",
    terrainTypeKey: TERRAIN_TYPES.TREES,
  },
  {
    name: "Swamps",
    icon: <Waves />,
    bg: "bg-brand-blue/10",
    text: "text-brand-blue",
    border: "border-brand-blue/40",
    terrainTypeKey: TERRAIN_TYPES.PONDS,
  },
  {
    name: "Mountains",
    icon: <Mountain />,
    bg: "bg-brand-red/10",
    text: "text-brand-red",
    border: "border-brand-red/40",
    terrainTypeKey: TERRAIN_TYPES.RUBBLE,
  },
  {
    name: "Desert",
    icon: <DesertIcon className="w-6 h-6" />,
    bg: "bg-amber-500/10",
    text: "text-amber-500",
    border: "border-amber-500/40",
    terrainTypeKey: TERRAIN_TYPES.DESERT,
  },
];

// ── Move‑pattern definitions ─────────────────────────────────────────

type MovePatternFn = (r: number, c: number) => number[][];

const MOVE_PATTERNS: Record<
  string,
  { move: MovePatternFn; newMove?: MovePatternFn; attack?: MovePatternFn }
> = {
  [PIECES.KING]: {
    move: (r, c) => [
      [r - 1, c],
      [r + 1, c],
      [r, c - 1],
      [r, c + 1],
      [r - 1, c - 1],
      [r - 1, c + 1],
      [r + 1, c - 1],
      [r + 1, c + 1],
    ],
    newMove: (r, c) => [
      [r - 2, c],
      [r + 2, c],
      [r, c - 2],
      [r, c + 2],
    ],
    attack: (r, c) => [
      [r - 1, c],
      [r + 1, c],
      [r, c - 1],
      [r, c + 1],
    ],
  },
  [PIECES.QUEEN]: {
    move: (r, c) => {
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
    newMove: (r, c) =>
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
  [PIECES.ROOK]: {
    move: (r, c) => {
      const moves: number[][] = [];
      for (let i = 1; i < 12; i++) {
        moves.push([r + i, c], [r - i, c], [r, c + i], [r, c - i]);
      }
      return moves;
    },
  },
  [PIECES.BISHOP]: {
    move: (r, c) => {
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
  [PIECES.KNIGHT]: {
    move: (r, c) => [
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
  [PIECES.PAWN]: {
    move: (r, c) => [[r - 1, c]],
    newMove: (r, c) => [[r + 2, c]],
    attack: (r, c) => [
      [r - 1, c - 1],
      [r - 1, c + 1],
    ],
  },
};

interface TerrainMovePreviewProps {
  darkMode: boolean;
  selectedUnit: string;
  selectedTerrainIdx: number;
  className?: string;
  /** Optional set of "r,c" strings for terrain positions from a seed layout */
  terrainPositions?: Set<string>;
}

const TerrainMovePreview: React.FC<TerrainMovePreviewProps> = ({
  darkMode,
  selectedUnit,
  selectedTerrainIdx,
  className,
  terrainPositions,
}) => {
  const subtextColor = darkMode ? "text-slate-400" : "text-slate-500";

  if (!selectedUnit || selectedTerrainIdx < 0) {
    return (
      <div
        className={`h-full relative transition-all flex flex-col items-center justify-center group/card ${
          className || ""
        }`}
      >
        <div className="flex flex-col items-center justify-center gap-6 opacity-60">
          <div
            className={`p-6 rounded-full ${darkMode ? "bg-slate-800" : "bg-slate-100"}`}
          >
            <ShieldPlus size={48} className={subtextColor} />
          </div>
          <div className="text-center">
            <h3
              className={`text-xl font-black uppercase ${darkMode ? "text-slate-200" : "text-slate-800"}`}
            >
              Live Simulation
            </h3>
            <p
              className={`text-sm font-bold ${subtextColor} max-w-[200px] mt-2`}
            >
              Select a unit and a terrain to simulate interaction.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const terrain = TERRAIN_LIST[selectedTerrainIdx];

  // ── Compatibility result ──────────────────────────────────────────
  const isTraversable = canTraverse(terrain.name, selectedUnit);
  const isDesertTank =
    terrain.name === "Desert" && selectedUnit === PIECES.ROOK;
  const isCompatible = isTraversable || isDesertTank;
  const isProtected = isUnitProtected(
    selectedUnit,
    terrain.terrainTypeKey as TerrainType,
  );

  // ── Move preview grid computation ─────────────────────────────────
  const previewGridSize = 12;
  const centerRow = 6;
  const centerCol = 6;
  const isTerrainCell = (r: number, c: number) => {
    if (terrainPositions) return terrainPositions.has(`${r},${c}`);
    return Math.abs(r - centerRow) === 1;
  };

  const pattern = MOVE_PATTERNS[selectedUnit];
  const allMoves = [
    ...(pattern?.move(centerRow, centerCol) || []),
    ...(pattern?.newMove ? pattern.newMove(centerRow, centerCol) : []),
    ...(pattern?.attack ? pattern.attack(centerRow, centerCol) : []),
  ];

  const validMoves: number[][] = [];
  const blockedMoves: number[][] = [];

  allMoves.forEach(([r, c]) => {
    const dr = r - centerRow;
    const dc = c - centerCol;
    const dist = Math.max(Math.abs(dr), Math.abs(dc));
    const steps = dist;
    const isLeap =
      Math.abs(dr) * Math.abs(dc) === 2 ||
      (selectedUnit === PIECES.PAWN && dist === 2);

    let blocked = false;

    for (let i = 1; i <= steps; i++) {
      const stepR = centerRow + Math.round((dr / steps) * i);
      const stepC = centerCol + Math.round((dc / steps) * i);
      const inTerrain = isTerrainCell(stepR, stepC);
      const isLanding = i === steps;

      if (inTerrain) {
        if (terrain.name === "Desert") {
          if (isLanding) {
            if (!isDesertTank) blocked = true;
          } else {
            if (!isLeap) blocked = true;
          }
        } else {
          if (!isTraversable && !isLeap) blocked = true;
          if (isLeap && isLanding && !isTraversable) blocked = true;
        }
      }
      if (blocked) break;
    }

    if (blocked) blockedMoves.push([r, c]);
    else validMoves.push([r, c]);
  });

  // ── Terrain cell colour helper ────────────────────────────────────
  const getTerrainCellBg = (isEven: boolean) => {
    switch (terrain.name) {
      case "Mountains":
        return isEven ? "bg-brand-red/60" : "bg-brand-red/40";
      case "Forests":
        return isEven ? "bg-emerald-500/50" : "bg-emerald-500/30";
      case "Swamps":
        return isEven ? "bg-brand-blue/50" : "bg-brand-blue/30";
      case "Desert":
        return isEven ? "bg-amber-500/50" : "bg-amber-500/30";
      default:
        return isEven
          ? "bg-slate-100/60 dark:bg-white/10"
          : "bg-slate-200/60 dark:bg-white/[0.04]";
    }
  };

  const getTerrainMoveShadow = () => {
    switch (terrain.name) {
      case "Mountains":
        return "bg-brand-red z-20 shadow-[0_0_15px_rgba(239,68,68,0.5)]";
      case "Forests":
        return "bg-emerald-500 z-20 shadow-[0_0_15px_rgba(16,185,129,0.5)]";
      case "Swamps":
        return "bg-brand-blue z-20 shadow-[0_0_15px_rgba(59,130,246,0.5)]";
      default:
        return "bg-amber-500 z-20 shadow-[0_0_15px_rgba(245,158,11,0.5)]";
    }
  };

  return (
    <div
      className={`h-full relative transition-all flex flex-col items-center justify-center group/card ${
        className || ""
      }`}
    >
      {/* ── Preview Grid column ─────────────────────────────── */}
      <div className="sticky top-1/2 -translate-y-1/2 flex flex-col items-center gap-6 pointer-events-none">
        <div className="flex flex-col items-center gap-1">
          <span
            className={`text-xs font-black uppercase tracking-widest ${subtextColor} flex items-center gap-2`}
          >
            <div
              className={`w-2.5 h-2.5 rounded-full ${isCompatible ? "bg-emerald-500" : "bg-brand-red"}`}
            />
            Preview
          </span>
        </div>

        <div className="bg-slate-100 dark:bg-white/5 rounded-2xl p-4 border border-slate-200 dark:border-white/5 w-fit shadow-inner pointer-events-auto">
          <div
            className="grid gap-[1px] w-56 h-56 lg:w-64 lg:h-64"
            style={{
              gridTemplateColumns: `repeat(${previewGridSize}, 1fr)`,
            }}
          >
            {Array.from({ length: previewGridSize * previewGridSize }).map(
              (_, i) => {
                const r = Math.floor(i / previewGridSize);
                const c = i % previewGridSize;
                const isCenter = r === centerRow && c === centerCol;
                const isAttack =
                  pattern?.attack &&
                  pattern
                    .attack(centerRow, centerCol)
                    .some(([ar, ac]) => ar === r && ac === c);
                const isMove = validMoves.some(
                  ([mr, mc]) => mr === r && mc === c,
                );
                const isBlocked = blockedMoves.some(
                  ([mr, mc]) => mr === r && mc === c,
                );
                const inTerrain = isTerrainCell(r, c);

                const isEven = (r + c) % 2 === 0;
                let cellBg = isEven
                  ? "bg-slate-100/60 dark:bg-white/10"
                  : "bg-slate-200/60 dark:bg-white/[0.04]";

                if (inTerrain) cellBg = getTerrainCellBg(isEven);

                // Center cell (unit position)
                if (isCenter) {
                  return (
                    <div
                      key={i}
                      className={`aspect-square rounded-sm relative bg-slate-800 dark:bg-white z-20 flex items-center justify-center shadow-lg ${
                        isProtected
                          ? "border-double border-[3px] border-emerald-500/50"
                          : ""
                      }`}
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-white dark:bg-black" />
                    </div>
                  );
                }

                return (
                  <div
                    key={i}
                    className={`aspect-square rounded-sm relative flex items-center justify-center transition-all duration-300
                     ${
                       isAttack
                         ? "bg-brand-red shadow-[0_0_15px_rgba(239,68,68,0.5)] z-20"
                         : isMove
                           ? inTerrain
                             ? getTerrainMoveShadow()
                             : "bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)] z-20"
                           : isBlocked
                             ? inTerrain
                               ? getTerrainMoveShadow()
                               : "bg-brand-red/40 z-10"
                             : cellBg
                     }
                   `}
                  >
                    {/* Tiny terrain icons */}
                    {inTerrain && (
                      <div
                        className={`absolute inset-0 flex items-center justify-center ${
                          isMove || isBlocked ? "opacity-60" : "opacity-40"
                        } scale-[0.45] pointer-events-none`}
                      >
                        {terrain.icon}
                      </div>
                    )}

                    {isBlocked && (
                      <div
                        className={`${
                          inTerrain ? "text-white" : "text-brand-red/40"
                        } z-20 scale-75`}
                      >
                        <X size={16} strokeWidth={3} />
                      </div>
                    )}

                    {isMove && inTerrain && (
                      <div className="text-white drop-shadow-md z-20 scale-75">
                        <ShieldPlus
                          size={16}
                          strokeWidth={3}
                          className="fill-white/20"
                        />
                      </div>
                    )}
                  </div>
                );
              },
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TerrainMovePreview;
