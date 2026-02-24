/*
 * Copyright (c) 2006 - 2026 Hall of the Gods, Inc.
 * All Rights Reserved.
 *
 * TerrainDetailsPanel - Detailed view of the selected terrain
 */
import React from "react";
import {
  ChevronLeft,
  ChevronRight,
  ShieldPlus,
  Sparkles,
  X,
} from "lucide-react";
import { INITIAL_ARMY, TERRAIN_INTEL, unitColorMap } from "@/constants";
import { TERRAIN_TYPES } from "@/constants";
import { isUnitProtected } from "@/core/mechanics/gameLogic";
import { canUnitTraverseTerrain } from "@/core/setup/terrainCompat";
import type { PieceType, TerrainType } from "@/shared/types/game";

interface TerrainDetailsPanelProps {
  darkMode: boolean;
  terrainTypeKey: string;
  selectedUnit?: string;
  onUnitSelect?: (unitType: string) => void;
  onNext?: () => void;
  onPrev?: () => void;
  prevTerrainIcon?: React.ElementType;
  nextTerrainIcon?: React.ElementType;
  prevTerrainColors?: { bg?: string; text?: string; border?: string };
  nextTerrainColors?: { bg?: string; text?: string; border?: string };
}

const TerrainDetailsPanel: React.FC<TerrainDetailsPanelProps> = ({
  darkMode,
  terrainTypeKey,
  selectedUnit,
  onUnitSelect,
  onNext,
  onPrev,
  prevTerrainIcon,
  nextTerrainIcon,
  prevTerrainColors,
  nextTerrainColors,
}) => {
  const textColor = darkMode ? "text-slate-100" : "text-slate-800";
  const subtextColor = darkMode ? "text-slate-300" : "text-slate-600";
  const cardBg = darkMode ? "bg-slate-900/80" : "bg-white/90";

  if (!terrainTypeKey) {
    return (
      <div className="h-full flex flex-col relative group/panel">
        <div
          className={`flex-1 p-8 rounded-3xl border-4 border-dashed ${darkMode ? "border-slate-800 bg-slate-900/50" : "border-slate-200 bg-white/70"} flex flex-col gap-6 shadow-xl relative overflow-hidden transition-all items-center justify-center text-center opacity-60`}
        >
          <div className="p-6 rounded-full bg-slate-100 dark:bg-slate-800 mb-4">
            <Sparkles size={48} className={subtextColor} />
          </div>
          <h3 className={`text-2xl font-black uppercase ${textColor}`}>
            Select Terrain
          </h3>
          <p className={`text-sm font-bold ${subtextColor} max-w-[200px]`}>
            Choose a terrain type from the top bar to view its strategic intel.
          </p>
        </div>
      </div>
    );
  }

  const intel = TERRAIN_INTEL[terrainTypeKey];

  // Dynamic border style based on unit affinity
  const unitProtected = selectedUnit
    ? isUnitProtected(selectedUnit, terrainTypeKey as TerrainType)
    : false;
  const unitCanTraverse = selectedUnit
    ? canUnitTraverseTerrain(
        selectedUnit as PieceType,
        terrainTypeKey as TerrainType,
      )
    : true;
  const panelBorderStyle = unitProtected
    ? "border-8 border-dotted"
    : !unitCanTraverse
      ? "border-8 border-double"
      : "border-4";

  const renderUnitIcons = () => {
    return (
      <div className="flex gap-2">
        {INITIAL_ARMY.map((unit, idx) => {
          const colors = unitColorMap[unit.type];
          if (!colors) return null;

          const isProtected = isUnitProtected(
            unit.type,
            terrainTypeKey as TerrainType,
          );
          const canTraverse = canUnitTraverseTerrain(
            unit.type,
            terrainTypeKey as TerrainType,
          );
          const isActive = unit.type === selectedUnit;

          const IconComp = unit.lucide;

          return (
            <div
              key={idx}
              onClick={() => onUnitSelect?.(unit.type)}
              className={`p-2.5 rounded-xl ${colors.bg} ${colors.text} border ${colors.border} shadow-sm backdrop-blur-sm relative transition-all cursor-pointer hover:scale-110 hover:shadow-lg ${isActive ? "opacity-100" : !canTraverse ? "opacity-[0.42] grayscale-[0.5]" : "opacity-[0.85]"} ${isActive ? `ring-2 ${colors.ring} scale-110 shadow-lg opacity-100` : ""} ${isProtected ? "border-dotted border-4" : !canTraverse ? "border-double border-4" : ""}`}
            >
              <IconComp size={28} className="fill-current" />

              {/* Shield Badge for Protection */}
              {isProtected && (
                <div
                  className={`absolute -top-2 -right-2 p-1 rounded-full bg-white dark:bg-slate-900 border-2 ${colors.border} shadow-lg z-10 flex items-center justify-center animate-pulse`}
                  title="Protected in this terrain"
                >
                  <ShieldPlus
                    size={12}
                    className={`${colors.text}`}
                    strokeWidth={4}
                  />
                </div>
              )}

              {/* Red X Badge for Untraversable Terrain */}
              {!canTraverse && (
                <div
                  className="absolute -top-2 -right-2 p-1 rounded-full bg-white dark:bg-slate-900 border-2 border-brand-red shadow-lg z-10 flex items-center justify-center"
                  title="Cannot traverse this terrain"
                >
                  <X size={12} className="text-brand-red" strokeWidth={4} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  // Helper to determine colors based on terrain type for styling
  const getTerrainColors = (key: string) => {
    switch (key) {
      case TERRAIN_TYPES.TREES:
        return {
          bg: "bg-emerald-500/10",
          text: "text-emerald-500",
          border: "border-emerald-500/40",
          solid: "bg-emerald-500",
          ribbonBg: "bg-emerald-500",
        };
      case TERRAIN_TYPES.PONDS:
        return {
          bg: "bg-brand-blue/10",
          text: "text-brand-blue",
          border: "border-brand-blue/40",
          solid: "bg-brand-blue",
          ribbonBg: "bg-brand-blue",
        };
      case TERRAIN_TYPES.RUBBLE:
        return {
          bg: "bg-brand-red/10",
          text: "text-brand-red",
          border: "border-brand-red/40",
          solid: "bg-brand-red",
          ribbonBg: "bg-brand-red",
        };
      case TERRAIN_TYPES.DESERT:
        return {
          bg: "bg-amber-500/10",
          text: "text-amber-500",
          border: "border-amber-500/40",
          solid: "bg-amber-500",
          ribbonBg: "bg-amber-500",
        };
      default:
        return {
          bg: "bg-slate-500/10",
          text: "text-slate-500",
          border: "border-slate-500/40",
          solid: "bg-slate-500",
          ribbonBg: "bg-slate-500",
        };
    }
  };

  const colors = getTerrainColors(terrainTypeKey);
  const Icon = intel.icon;
  const PrevIcon = prevTerrainIcon;
  const NextIcon = nextTerrainIcon;

  return (
    <div className="h-full flex flex-col relative group/panel">
      <div
        className={`flex-1 p-8 rounded-3xl ${panelBorderStyle} ${cardBg} ${colors.border} flex flex-col gap-6 shadow-xl relative overflow-hidden group transition-all`}
      >
        {/* Background decoration */}
        <div
          className={`absolute -right-20 -top-20 w-64 h-64 rounded-full ${colors.bg} blur-lg opacity-20`}
        />

        {/* Main Content Wrapper - Flex container to match unit panel structure */}
        <div className="flex-1 flex flex-col items-center z-10 text-center w-full">
          {/* Full-width Top Ribbon */}
          <div
            className={`absolute top-0 left-0 right-0 z-20 pointer-events-none ${colors.ribbonBg} py-2.5 shadow-lg border-b border-white/10 flex justify-center items-center`}
          >
            <span className="text-white text-xl font-black uppercase tracking-[0.4em] drop-shadow-md">
              Trench Intel
            </span>
          </div>

          {/* Subtitle - Reordered to top */}
          <div className="flex items-center gap-3 mb-2 mt-20 opacity-80">
            <Sparkles size={24} className={colors.text} />
            <span
              className={`text-sm font-bold uppercase tracking-[0.2em] ${colors.text}`}
            >
              You discovered a new Trench!
            </span>
          </div>

          {/* Title */}
          <h3
            className={`text-5xl font-black uppercase tracking-tighter ${textColor} mb-6`}
          >
            {intel.label}
          </h3>

          {/* Icon Row with Nav Buttons flanking */}
          <div className="flex flex-row items-center gap-10 mb-6">
            {/* Terrain Icon — with nav buttons bleeding out */}
            <div
              className={`relative w-36 h-36 rounded-[2.5rem] ${colors.bg} ${colors.text} flex items-center justify-center shadow-inner border border-white/5 transition-transform hover:scale-105 group/icon overflow-visible`}
            >
              {Icon && <Icon className="w-20 h-20 transition-transform group-hover/icon:rotate-3" />}

              {/* Prev Terrain Button — bleeds left */}
              {onPrev && (
                <button
                  onClick={onPrev}
                  className={`absolute -left-5 top-1/2 -translate-y-1/2 z-30 cursor-pointer p-2 rounded-xl shadow-lg border opacity-40 grayscale hover:opacity-100 hover:grayscale-0 hover:scale-110 active:scale-95 transition-all flex items-center justify-center ${
                    prevTerrainColors
                      ? `${prevTerrainColors.bg || ""} ${prevTerrainColors.border || ""} ${prevTerrainColors.text || ""}`
                      : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800/60 dark:text-white/60"
                  }`}
                >
                  {PrevIcon ? <PrevIcon size={18} /> : <ChevronLeft size={18} />}
                </button>
              )}

              {/* Next Terrain Button — bleeds right */}
              {onNext && (
                <button
                  onClick={onNext}
                  className={`absolute -right-5 top-1/2 -translate-y-1/2 z-30 cursor-pointer p-2 rounded-xl shadow-lg border opacity-40 grayscale hover:opacity-100 hover:grayscale-0 hover:scale-110 active:scale-95 transition-all flex items-center justify-center ${
                    nextTerrainColors
                      ? `${nextTerrainColors.bg || ""} ${nextTerrainColors.border || ""} ${nextTerrainColors.text || ""}`
                      : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800/60 dark:text-white/60"
                  }`}
                >
                  {NextIcon ? <NextIcon size={18} /> : <ChevronRight size={18} />}
                </button>
              )}
            </div>

            {/* Mini Terrain Preview */}
            <div className="flex flex-col items-center gap-2">
              <div className="bg-slate-800/20 dark:bg-white/5 rounded-xl p-2 border border-white/5 w-fit shadow-inner scale-90">
                <div
                  className="grid gap-[1px] w-32 h-32"
                  style={{
                    gridTemplateColumns: `repeat(7, 1fr)`,
                  }}
                >
                  {Array.from({ length: 7 * 7 }).map((_, i) => {
                    const r = Math.floor(i / 7);
                    const c = i % 7;
                    const center = 3;
                    const inTerrain = Math.abs(r - center) === 1;

                    const isEven = (r + c) % 2 === 0;
                    let cellBg = isEven
                      ? "bg-slate-100/10 dark:bg-white/5"
                      : "bg-slate-200/10 dark:bg-white/[0.02]";

                    if (inTerrain) {
                      switch (terrainTypeKey) {
                        case TERRAIN_TYPES.TREES:
                          cellBg = isEven
                            ? "bg-emerald-500/50"
                            : "bg-emerald-500/30";
                          break;
                        case TERRAIN_TYPES.PONDS:
                          cellBg = isEven
                            ? "bg-brand-blue/50"
                            : "bg-brand-blue/30";
                          break;
                        case TERRAIN_TYPES.RUBBLE:
                          cellBg = isEven
                            ? "bg-brand-red/50"
                            : "bg-brand-red/30";
                          break;
                        case TERRAIN_TYPES.DESERT:
                          cellBg = isEven
                            ? "bg-amber-500/50"
                            : "bg-amber-500/30";
                          break;
                      }
                    }

                    return (
                      <div
                        key={i}
                        className={`aspect-square rounded-sm relative flex items-center justify-center ${cellBg}`}
                      >
                        {inTerrain && (
                          <div className="opacity-40 scale-[0.5] pointer-events-none">
                            {Icon && <Icon size={16} />}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Bullets - Description */}
          <div className="w-full space-y-4 px-0 mb-8">
            <div className="flex flex-col gap-4 max-w-2xl mx-auto">
              {intel.desc
                .split(". ")
                .filter(Boolean)
                .map((item: string, idx: number) => (
                  <div key={idx} className="flex items-start gap-3 text-left">
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${colors.solid} opacity-40 mt-1.5 shrink-0 shadow-sm`}
                    />
                    <p
                      className={`text-[13px] font-bold ${subtextColor} leading-snug opacity-90`}
                    >
                      {item.trim().endsWith(".")
                        ? item.trim()
                        : `${item.trim()}.`}
                    </p>
                  </div>
                ))}
            </div>
          </div>

          {/* Protects From (Affinity) - Pushed to Bottom with Divider Style */}
          <div className="mt-auto w-full flex flex-col items-center gap-5">
            <div className="flex items-center w-full gap-4 opacity-70">
              <div
                className={`h-px flex-1 ${darkMode ? "bg-white/20" : "bg-slate-900/10"}`}
              />
              <span
                className={`text-[10px] font-black uppercase tracking-widest ${subtextColor}`}
              >
                Protects From
              </span>
              <div
                className={`h-px flex-1 ${darkMode ? "bg-white/20" : "bg-slate-900/10"}`}
              />
            </div>
            {renderUnitIcons()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TerrainDetailsPanel;
