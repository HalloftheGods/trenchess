/*
 * Copyright (c) 2006 - 2026 Hall of the Gods, Inc.
 * All Rights Reserved.
 *
 * TerrainIntelTool — Interactive unit × terrain compatibility explorer.
 * Select a unit on the left, a terrain on the right, and see the result.
 */
import React from "react";
import { Trees, Waves, Mountain, ShieldPlus, X } from "lucide-react";
import {
  PIECES,
  INITIAL_ARMY,
  isUnitProtected,
  TERRAIN_TYPES,
  TERRAIN_INTEL,
} from "../constants";
import { DesertIcon } from "../UnitIcons";
import type { PieceType } from "../types";

// ── Types ────────────────────────────────────────────────────────────

interface TerrainIntelToolProps {
  darkMode: boolean;
  selectedUnit?: string;
  onUnitSelect?: (unit: string) => void;
  className?: string; // Additional prop for styling
}

interface TerrainDef {
  name: string;
  icon: React.ReactNode;
  bg: string;
  text: string;
  border: string;
  terrainTypeKey: string; // maps to TERRAIN_TYPES value
}

// ── Terrain definitions ──────────────────────────────────────────────

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
    bg: "bg-blue-500/10",
    text: "text-blue-500",
    border: "border-blue-500/40",
    terrainTypeKey: TERRAIN_TYPES.PONDS,
  },
  {
    name: "Mountains",
    icon: <Mountain />,
    bg: "bg-stone-500/10",
    text: "text-stone-500",
    border: "border-stone-500/40",
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

// ── Unit color palette ───────────────────────────────────────────────

const UNIT_COLORS: Record<
  string,
  { text: string; bg: string; border: string }
> = {
  [PIECES.COMMANDER]: {
    text: "text-yellow-500",
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/40",
  },
  [PIECES.BATTLEKNIGHT]: {
    text: "text-purple-500",
    bg: "bg-purple-500/10",
    border: "border-purple-500/40",
  },
  [PIECES.TANK]: {
    text: "text-yellow-500",
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/40",
  },
  [PIECES.SNIPER]: {
    text: "text-red-500",
    bg: "bg-red-500/10",
    border: "border-red-500/40",
  },
  [PIECES.HORSEMAN]: {
    text: "text-stone-500",
    bg: "bg-stone-500/10",
    border: "border-stone-500/40",
  },
  [PIECES.BOT]: {
    text: "text-blue-500",
    bg: "bg-blue-500/10",
    border: "border-blue-500/40",
  },
};

// ── Unit display names ───────────────────────────────────────────────

const UNIT_NAMES: Record<string, string> = {
  [PIECES.COMMANDER]: "King",
  [PIECES.BATTLEKNIGHT]: "Queen",
  [PIECES.TANK]: "Rooks",
  [PIECES.SNIPER]: "Bishops",
  [PIECES.HORSEMAN]: "Knights",
  [PIECES.BOT]: "Pawns",
};

// ── Move‑pattern definitions (same as HowToPlay) ────────────────────

type MovePatternFn = (r: number, c: number) => number[][];

const MOVE_PATTERNS: Record<
  string,
  { move: MovePatternFn; newMove?: MovePatternFn }
> = {
  [PIECES.COMMANDER]: {
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
  },
  [PIECES.BATTLEKNIGHT]: {
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
  [PIECES.TANK]: {
    move: (r, c) => {
      const moves: number[][] = [];
      for (let i = 1; i < 12; i++) {
        moves.push([r + i, c], [r - i, c], [r, c + i], [r, c - i]);
      }
      return moves;
    },
  },
  [PIECES.SNIPER]: {
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
  [PIECES.HORSEMAN]: {
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
  [PIECES.BOT]: {
    move: (r, c) => [[r - 1, c]],
    newMove: (r, c) => [[r + 2, c]],
  },
};

// ── Terrain traversal check ──────────────────────────────────────────

/** Which terrain icon keys each unit has in its levelUp data. */
const UNIT_TERRAIN_KEYS: Record<string, string[]> = {
  [PIECES.COMMANDER]: ["mt", "tr", "wv"],
  [PIECES.BATTLEKNIGHT]: ["mt", "tr", "wv"],
  [PIECES.TANK]: ["wv", "ds"],
  [PIECES.SNIPER]: ["tr"],
  [PIECES.HORSEMAN]: ["mt"],
  [PIECES.BOT]: ["mt", "tr", "wv"],
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

// ── All units list ───────────────────────────────────────────────────

const ALL_UNITS: PieceType[] = [
  PIECES.COMMANDER as PieceType,
  PIECES.BATTLEKNIGHT as PieceType,
  PIECES.TANK as PieceType,
  PIECES.SNIPER as PieceType,
  PIECES.HORSEMAN as PieceType,
  PIECES.BOT as PieceType,
];

// ═════════════════════════════════════════════════════════════════════
// Component
// ═════════════════════════════════════════════════════════════════════

const TerrainIntelTool: React.FC<TerrainIntelToolProps> = ({
  darkMode,
  selectedUnit: propSelectedUnit,
  onUnitSelect,
  className,
}) => {
  const [internalSelectedUnit, setInternalSelectedUnit] =
    React.useState<string>(PIECES.SNIPER);
  const [selectedTerrain, setSelectedTerrain] = React.useState<number>(0); // index into TERRAIN_LIST

  const selectedUnit = propSelectedUnit || internalSelectedUnit;

  const handleUnitSelect = (unit: string) => {
    if (onUnitSelect) {
      onUnitSelect(unit);
    } else {
      setInternalSelectedUnit(unit);
    }
  };

  const textColor = darkMode ? "text-slate-100" : "text-slate-800";
  const subtextColor = darkMode ? "text-slate-400" : "text-slate-500";
  const cardBg = darkMode ? "bg-slate-900/50" : "bg-white/70";
  const borderColor = darkMode ? "border-white/10" : "border-slate-200";

  const terrain = TERRAIN_LIST[selectedTerrain];
  const unitArmy = INITIAL_ARMY.find((u) => u.type === selectedUnit);
  const unitColors = UNIT_COLORS[selectedUnit];
  const UnitIcon = unitArmy?.lucide as React.ElementType;

  // ── Compatibility result ──────────────────────────────────────────
  const isTraversable = canTraverse(terrain.name, selectedUnit);
  const isDesertTank =
    terrain.name === "Desert" && selectedUnit === PIECES.TANK;
  const isCompatible = isTraversable || isDesertTank;
  const isProtected = isUnitProtected(
    selectedUnit,
    terrain.terrainTypeKey as any,
  );

  // ── Move preview grid computation ─────────────────────────────────
  const previewGridSize = 12;
  const centerRow = 6;
  const centerCol = 6;
  const isTerrainCell = (r: number) => Math.abs(r - centerRow) === 1;

  const pattern = MOVE_PATTERNS[selectedUnit];
  const allMoves = [
    ...(pattern?.move(centerRow, centerCol) || []),
    ...(pattern?.newMove ? pattern.newMove(centerRow, centerCol) : []),
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
      (selectedUnit === PIECES.BOT && dist === 2);

    let blocked = false;

    for (let i = 1; i <= steps; i++) {
      const stepR = centerRow + Math.round((dr / steps) * i);
      const inTerrain = isTerrainCell(stepR);
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
        return isEven ? "bg-stone-500/60" : "bg-stone-500/40";
      case "Forests":
        return isEven ? "bg-emerald-500/50" : "bg-emerald-500/30";
      case "Swamps":
        return isEven ? "bg-blue-500/50" : "bg-blue-500/30";
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
        return "bg-stone-500 z-20 shadow-[0_0_15px_rgba(120,113,108,0.5)]";
      case "Forests":
        return "bg-emerald-500 z-20 shadow-[0_0_15px_rgba(16,185,129,0.5)]";
      case "Swamps":
        return "bg-blue-500 z-20 shadow-[0_0_15px_rgba(59,130,246,0.5)]";
      default:
        return "bg-amber-500 z-20 shadow-[0_0_15px_rgba(245,158,11,0.5)]";
    }
  };

  // ═══════════════════════════════════════════════════════════════════
  // Render
  // ═══════════════════════════════════════════════════════════════════

  return (
    <div
      className={`relative p-1 sm:p-10 rounded-3xl border-4 ${cardBg} ${borderColor} transition-all overflow-hidden ${
        className || ""
      }`}
    >
      {/* ── Single Horizontal Row Arrangement ────────────────────── */}
      <div className="flex flex-row gap-2 sm:gap-2 lg:gap-2 items-center justify-between">
        {/* ── 1. Unit column ────────────────────────────────────── */}
        <div className="flex flex-col items-center gap-5 min-w-0">
          <h3
            className={`text-xl sm:text-2xl font-black uppercase tracking-tighter ${textColor}`}
          >
            {UNIT_NAMES[selectedUnit]}
          </h3>

          <div
            className={`w-20 h-20 sm:w-28 sm:h-28 rounded-2xl ${unitColors.bg} ${unitColors.text} flex items-center justify-center shadow-inner border ${unitColors.border} transition-all`}
          >
            {UnitIcon && <UnitIcon className="w-12 h-12 sm:w-16 sm:h-16" />}
          </div>

          {/* Unit selector: 3x2 Grid */}
          <div className="grid grid-cols-3 gap-2">
            {ALL_UNITS.map((uType) => {
              const u = INITIAL_ARMY.find((x) => x.type === uType);
              if (!u) return null;
              const Icon = u.lucide as React.ElementType;
              const colors = UNIT_COLORS[uType];
              const isActive = selectedUnit === uType;
              const uProtected = isUnitProtected(
                uType,
                terrain.terrainTypeKey as any,
              );

              return (
                <button
                  key={uType}
                  onClick={() => handleUnitSelect(uType)}
                  className={`p-2 rounded-xl border transition-all cursor-pointer ${
                    isActive
                      ? "bg-slate-800 text-white border-slate-700 dark:bg-white dark:text-slate-900 shadow-lg scale-110"
                      : `${colors.text} ${colors.bg} ${colors.border} opacity-70 hover:opacity-100 hover:scale-105`
                  } ${uProtected ? "border-double border-4" : ""}`}
                  title={UNIT_NAMES[uType]}
                >
                  <Icon size={18} />
                </button>
              );
            })}
          </div>
        </div>

        {/* ── 2. PLUS Divider ────────────────────────────────────── */}
        <div className="shrink-0">
          <span
            className={`text-5xl sm:text-7xl font-black ${textColor} opacity-20`}
          >
            +
          </span>
        </div>

        {/* ── 3. Terrain column ──────────────────────────────────── */}
        <div className="flex flex-col items-center gap-5 min-w-0">
          <h3
            className={`text-xl sm:text-2xl font-black uppercase tracking-tighter ${textColor}`}
          >
            {terrain.name}
          </h3>

          <div
            className={`w-20 h-20 sm:w-28 sm:h-28 rounded-2xl ${terrain.bg} ${terrain.text} flex items-center justify-center shadow-inner border ${terrain.border} transition-all`}
          >
            {React.cloneElement(terrain.icon as React.ReactElement<any>, {
              className: "w-12 h-12 sm:w-16 sm:h-16",
            })}
          </div>

          {/* Terrain selector: 2x2 Grid */}
          <div className="grid grid-cols-2 gap-2">
            {TERRAIN_LIST.map((t, idx) => {
              const isActive = selectedTerrain === idx;

              return (
                <button
                  key={t.name}
                  onClick={() => setSelectedTerrain(idx)}
                  className={`p-2 rounded-xl border transition-all cursor-pointer ${
                    isActive
                      ? `${t.bg} ${t.text} ${t.border} shadow-lg scale-110 border-2`
                      : `${t.bg} ${t.text} ${t.border} opacity-50 hover:opacity-100 hover:scale-105`
                  }`}
                  title={t.name}
                >
                  {React.cloneElement(
                    t.icon as React.ReactElement<{ className?: string }>,
                    { className: "w-5 h-5" },
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── 4. EQUALS Divider ──────────────────────────────────── */}
        <div className="shrink-0">
          <span
            className={`text-5xl sm:text-7xl font-black ${textColor} opacity-20`}
          >
            =
          </span>
        </div>

        {/* ── 5. Preview Grid column ─────────────────────────────── */}
        <div className="flex flex-col items-center gap-3">
          <div className="flex flex-col items-center gap-1">
            <span
              className={`text-[10px] font-black uppercase tracking-widest ${subtextColor} flex items-center gap-2`}
            >
              <div
                className={`w-2 h-2 rounded-full ${isCompatible ? "bg-emerald-500" : "bg-red-500"}`}
              />
              Affected Move Set
            </span>
            <span
              className={`text-[9px] font-black uppercase tracking-widest ${terrain.text} opacity-30 flex items-center gap-1.5`}
            >
              <div className="w-0.5 h-0.5 rounded-full bg-current animate-pulse" />
              Preview Result
            </span>
          </div>

          <div className="bg-slate-100 dark:bg-white/5 rounded-2xl p-4 border border-slate-200 dark:border-white/5 w-fit shadow-inner">
            <div
              className="grid gap-[1px] w-44 h-44 sm:w-56 sm:h-56 lg:w-64 lg:h-64"
              style={{
                gridTemplateColumns: `repeat(${previewGridSize}, 1fr)`,
              }}
            >
              {Array.from({ length: previewGridSize * previewGridSize }).map(
                (_, i) => {
                  const r = Math.floor(i / previewGridSize);
                  const c = i % previewGridSize;
                  const isCenter = r === centerRow && c === centerCol;
                  const isMove = validMoves.some(
                    ([mr, mc]) => mr === r && mc === c,
                  );
                  const isBlocked = blockedMoves.some(
                    ([mr, mc]) => mr === r && mc === c,
                  );
                  const inTerrain = isTerrainCell(r);

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
                        isMove
                          ? inTerrain
                            ? getTerrainMoveShadow()
                            : "bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)] z-20"
                          : isBlocked
                            ? inTerrain
                              ? getTerrainMoveShadow()
                              : "bg-red-950/40 z-10"
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
                            inTerrain ? "text-white" : "text-red-500/40"
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

      {/* ── 6. Terrain Intel Text Overlay ────────────────────────── */}
      <div className="mt-8 pt-8 border-t border-slate-200 dark:border-white/5">
        <div className="flex flex-col sm:flex-row items-center gap-6 max-w-4xl mx-auto">
          <div
            className={`w-16 h-16 rounded-2xl ${terrain.bg} ${terrain.text} flex items-center justify-center shadow-inner border ${terrain.border} shrink-0`}
          >
            {React.cloneElement(terrain.icon as React.ReactElement<any>, {
              className: "w-8 h-8",
            })}
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h4
              className={`text-lg font-black uppercase tracking-tight ${textColor} mb-1`}
            >
              {terrain.name} Rules
            </h4>
            <p
              className={`text-[13px] font-medium ${subtextColor} leading-relaxed`}
            >
              {TERRAIN_INTEL[terrain.terrainTypeKey]?.desc}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TerrainIntelTool;
