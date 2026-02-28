/*
 * Copyright (c) 2006 - 2026 Hall of the Gods, Inc.
 * All Rights Reserved.
 *
 * TerrainIntelTool — Interactive unit × terrain compatibility explorer.
 * Select a unit on the left, a terrain on the right, and see the result.
 */
import React from "react";
import {
  PIECES,
  INITIAL_ARMY,
  UNIT_COLORS,
  UNIT_NAMES,
  ALL_UNITS,
  UNIT_DETAILS,
  TERRAIN_LIST,
  TERRAIN_INTEL,
} from "@constants";
import { isUnitProtected, canUnitTraverseTerrain } from "@/app/core/mechanics";
import { X, ShieldPlus } from "lucide-react";
import type { TerrainType, PieceType } from "@tc.types/game";

export interface TerrainIntelToolProps {
  darkMode?: boolean;
  selectedUnit?: string;
  onUnitSelect?: (unit: string) => void;
  className?: string;
}

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
    React.useState<string>(PIECES.BISHOP);
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
  const isTraversable = canUnitTraverseTerrain(
    selectedUnit as PieceType,
    terrain.terrainTypeKey as TerrainType,
  );
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
  const isTerrainCell = (r: number) => Math.abs(r - centerRow) === 1;

  const pattern = UNIT_DETAILS[selectedUnit];
  const allMoves = [
    ...(pattern?.movePattern ? pattern.movePattern(centerRow, centerCol) : []),
    ...(pattern?.newMovePattern
      ? pattern.newMovePattern(centerRow, centerCol)
      : []),
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
                terrain.terrainTypeKey as TerrainType,
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
            {(() => {
              const Icon = terrain.icon;
              return Icon ? (
                <Icon className="w-12 h-12 sm:w-16 sm:h-16" />
              ) : null;
            })()}
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
                  {(() => {
                    const Icon = t.icon;
                    return Icon ? <Icon className="w-5 h-5" /> : null;
                  })()}
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
                className={`w-2 h-2 rounded-full ${isCompatible ? "bg-emerald-500" : "bg-brand-red"}`}
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
                          {(() => {
                            const Icon = terrain.icon;
                            return Icon ? <Icon /> : null;
                          })()}
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

      {/* ── 6. Terrain Intel Text Overlay ────────────────────────── */}
      <div className="mt-8 pt-8 border-t border-slate-200 dark:border-white/5">
        <div className="flex flex-col sm:flex-row items-center gap-6 max-w-4xl mx-auto">
          <div
            className={`w-16 h-16 rounded-2xl ${terrain.bg} ${terrain.text} flex items-center justify-center shadow-inner border ${terrain.border} shrink-0`}
          >
            {(() => {
              const Icon = terrain.icon;
              return Icon ? <Icon className="w-8 h-8" /> : null;
            })()}
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
