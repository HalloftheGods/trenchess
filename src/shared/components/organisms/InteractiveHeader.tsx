/*
 * Copyright (c) 2006 - 2026 Hall of the Gods, Inc.
 * All Rights Reserved.
 *
 * InteractiveHeader - Top banner with controls for the Interactive Tutorial
 */
import React from "react";
import { ArrowLeft } from "lucide-react";
import { INITIAL_ARMY } from "@/constants";
import { isUnitProtected } from "@/core/mechanics/gameLogic";
import { canUnitTraverseTerrain } from "@/core/setup/terrainCompat";
import { useRouteContext } from "@context";
import { UNIT_COLORS, UNIT_NAMES, ALL_UNITS, TERRAIN_LIST } from "@/constants";
import type { PieceType, TerrainType } from "@/shared/types/game";

interface InteractiveHeaderProps {
  darkMode: boolean;
  selectedUnit: string;
  onUnitSelect: (unit: string) => void;
  selectedTerrainIdx: number;
  onTerrainSelect: (index: number) => void;
  onBack: () => void;
}

const InteractiveHeader: React.FC<InteractiveHeaderProps> = ({
  darkMode,
  selectedUnit,
  onUnitSelect,
  selectedTerrainIdx,
  onTerrainSelect,
  onBack,
}) => {
  const { getIcon } = useRouteContext();
  const cardBg = darkMode ? "bg-slate-900/50" : "bg-white/70";
  const borderColor = darkMode ? "border-white/10" : "border-slate-200";
  const terrain =
    selectedTerrainIdx >= 0 ? TERRAIN_LIST[selectedTerrainIdx] : null;

  return (
    <div
      className={`w-full p-4 lg:p-6 rounded-3xl border-4 ${cardBg} ${borderColor} backdrop-blur-xl shadow-xl flex flex-col md:flex-row justify-between items-center gap-6 relative`}
    >
      <div className="flex items-center gap-4">
        {/* Back Button */}
        <button
          onClick={onBack}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all cursor-pointer ${
            darkMode
              ? "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/5"
              : "bg-white hover:bg-slate-50 text-slate-700 shadow-sm border border-slate-200"
          }`}
        >
          <ArrowLeft size={20} />
          <span className="hidden md:inline">Back</span>
        </button>
      </div>

      {/* Center Controls Group */}
      <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
        {/* 1. Unit Selector */}
        <div className="flex items-center gap-4">
          <div className="grid grid-cols-3 md:flex gap-2">
            {ALL_UNITS.map((uType) => {
              const u = INITIAL_ARMY.find((x) => x.type === uType);
              if (!u) return null;
              const colors = UNIT_COLORS[uType];
              const isActive = selectedUnit === uType;

              // Check if unit is protected or blocked by CURRENT terrain
              const uProtected =
                terrain &&
                isUnitProtected(uType, terrain.terrainTypeKey as TerrainType);
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
                  {getIcon(u, "", 20)}
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
                isUnitProtected(selectedUnit, t.terrainTypeKey as TerrainType);
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
                  {t.icon && <t.icon size={20} />}
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
          <span className="text-brand-red">TREN</span>
          <span className="text-brand-blue -ml-0.5">CHESS</span>
        </span>
      </div>
    </div>
  );
};

export default InteractiveHeader;
