/*
 * Copyright (c) 2006 - 2026 Hall of the Gods, Inc.
 * All Rights Reserved.
 *
 * InteractiveHeader - Top banner with controls for the Interactive Tutorial
 */
import React from "react";
import { Trees, Waves, Mountain, ArrowLeft } from "lucide-react";
import { DesertIcon } from "../UnitIcons";
import {
  PIECES,
  TERRAIN_TYPES,
  INITIAL_ARMY,
  isUnitProtected,
} from "../constants";
import { canUnitTraverseTerrain } from "../utils/terrainCompat";
import type { PieceType, TerrainType } from "../types";

interface InteractiveHeaderProps {
  darkMode: boolean;
  selectedUnit: string;
  onUnitSelect: (unit: string) => void;
  selectedTerrainIdx: number;
  onTerrainSelect: (index: number) => void;
  onBack: () => void;
}

interface TerrainDef {
  name: string;
  icon: React.ReactNode;
  bg: string;
  text: string;
  border: string;
  terrainTypeKey: string;
}

// Re-using these definitions from TerrainIntelTool (eventually centralized)
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

const UNIT_NAMES: Record<string, string> = {
  [PIECES.COMMANDER]: "King",
  [PIECES.BATTLEKNIGHT]: "Queen",
  [PIECES.TANK]: "Rooks",
  [PIECES.SNIPER]: "Bishops",
  [PIECES.HORSEMAN]: "Knights",
  [PIECES.BOT]: "Pawns",
};

const ALL_UNITS = [
  PIECES.COMMANDER,
  PIECES.BATTLEKNIGHT,
  PIECES.TANK,
  PIECES.SNIPER,
  PIECES.HORSEMAN,
  PIECES.BOT,
];

const InteractiveHeader: React.FC<InteractiveHeaderProps> = ({
  darkMode,
  selectedUnit,
  onUnitSelect,
  selectedTerrainIdx,
  onTerrainSelect,
  onBack,
}) => {
  const cardBg = darkMode ? "bg-slate-900/50" : "bg-white/70";
  const borderColor = darkMode ? "border-white/10" : "border-slate-200";
  const textColor = darkMode ? "text-slate-100" : "text-slate-800";
  const terrain =
    selectedTerrainIdx >= 0 ? TERRAIN_LIST[selectedTerrainIdx] : null;

  return (
    <div
      className={`w-full p-4 lg:p-6 rounded-3xl border-4 ${cardBg} ${borderColor} backdrop-blur-xl shadow-xl flex flex-col md:flex-row justify-between items-center gap-6`}
    >
      {/* Back Button */}
      <button
        onClick={onBack}
        className={`absolute left-6 top-6 md:static flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all cursor-pointer ${
          darkMode
            ? "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/5"
            : "bg-white hover:bg-slate-50 text-slate-700 shadow-sm border border-slate-200"
        }`}
      >
        <ArrowLeft size={20} />
        <span className="hidden md:inline">Back</span>
      </button>

      {/* Center Controls Group */}
      <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
        {/* 1. Unit Selector */}
        <div className="flex items-center gap-4">
          <div className="grid grid-cols-3 md:flex gap-2">
            {ALL_UNITS.map((uType) => {
              const u = INITIAL_ARMY.find((x) => x.type === uType);
              if (!u) return null;
              const Icon = u.lucide as React.ElementType;
              const colors = UNIT_COLORS[uType];
              const isActive = selectedUnit === uType;

              // Check if unit is protected or blocked by CURRENT terrain
              const uProtected =
                terrain &&
                isUnitProtected(uType, terrain.terrainTypeKey as any);
              const uBlocked =
                terrain &&
                !canUnitTraverseTerrain(
                  uType as PieceType,
                  terrain.terrainTypeKey as TerrainType,
                );

              return (
                <button
                  key={uType}
                  onClick={() => onUnitSelect(uType)}
                  className={`p-2.5 rounded-xl border transition-all cursor-pointer relative group ${
                    isActive
                      ? "bg-slate-800 text-white border-slate-700 dark:bg-white dark:text-slate-900 shadow-lg scale-110 z-10"
                      : `${colors.text} ${colors.bg} ${colors.border} opacity-70 hover:opacity-100 hover:scale-105`
                  } ${uProtected ? "border-double border-4" : ""} ${uBlocked ? "border-dotted border-4" : ""}`}
                  title={UNIT_NAMES[uType]}
                >
                  <Icon size={20} />
                  {/* Tooltip */}
                  <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-20">
                    {UNIT_NAMES[uType]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Divider + */}
        <span className="text-4xl font-black text-emerald-500 opacity-80">
          +
        </span>

        {/* 2. Terrain Selector */}
        <div className="flex items-center gap-4">
          <div className="grid grid-cols-2 md:flex gap-2">
            {TERRAIN_LIST.map((t, idx) => {
              const isActive = selectedTerrainIdx === idx;
              const tProtected =
                selectedUnit &&
                isUnitProtected(selectedUnit, t.terrainTypeKey as any);
              const tBlocked =
                selectedUnit &&
                !canUnitTraverseTerrain(
                  selectedUnit as PieceType,
                  t.terrainTypeKey as TerrainType,
                );

              return (
                <button
                  key={t.name}
                  onClick={() => onTerrainSelect(idx)}
                  className={`p-2.5 rounded-xl border transition-all cursor-pointer relative group ${
                    isActive
                      ? `${t.bg} ${t.text} ${t.border} shadow-lg scale-110 border-2 z-10`
                      : `${t.bg} ${t.text} ${t.border} opacity-50 hover:opacity-100 hover:scale-105`
                  } ${tProtected ? "border-dotted border-4" : ""} ${tBlocked ? "border-double border-4" : ""}`}
                  title={t.name}
                >
                  {React.cloneElement(t.icon as React.ReactElement<any>, {
                    size: 20,
                  })}
                  {/* Tooltip */}
                  <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-20">
                    {t.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Divider = */}
        <span className="text-4xl font-black text-emerald-500 opacity-80">
          =
        </span>
      </div>

      {/* Right Logo Group */}
      <div className="flex items-center">
        <span className="text-2xl md:text-3xl font-black tracking-widest uppercase">
          <span className="text-red-600">TREN</span>
          <span className="text-blue-600 -ml-0.5">CHESS</span>
        </span>
      </div>
    </div>
  );
};

export default InteractiveHeader;
