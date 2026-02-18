/*
 * Copyright (c) 2006 - 2026 Hall of the Gods, Inc.
 * All Rights Reserved.
 *
 * Interactive Tutorial Page
 * Using new 5-column layout with InteractiveHeader.
 */
import React, { useState, useEffect, useMemo } from "react";
import {
  ArrowLeft,
  Trees,
  Waves,
  Mountain,
  ShieldPlus,
  X,
  UserPlus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { DesertIcon } from "../UnitIcons";
import {
  PIECES,
  TERRAIN_TYPES,
  INITIAL_ARMY,
  isUnitProtected,
} from "../constants";
import { canUnitTraverseTerrain } from "../utils/terrainCompat";
import { UNIT_DETAILS, unitColorMap } from "../data/unitDetails";
import type { PieceType, TerrainType } from "../types";
import { deserializeGame } from "../utils/gameUrl";
import TerrainMovePreview from "./TerrainMovePreview"; // Updated import
import TerrainDetailsPanel from "./TerrainDetailsPanel"; // New component
import InteractiveHeader from "./InteractiveHeader"; // New Layout Header
import CopyrightFooter from "./CopyrightFooter";

interface SeedItem {
  id: string;
  name: string;
  seed: string;
  mode: string;
  createdAt: string;
}

interface InteractiveTutorialProps {
  onBack: () => void;
  darkMode: boolean;
}

const TERRAIN_LIST = [
  {
    name: "Forests",
    icon: <Trees />,
    bg: "bg-emerald-500/10",
    text: "text-emerald-500",
    border: "border-emerald-500/40",
    terrainTypeKey: TERRAIN_TYPES.TREES,
    key: "tr",
  },
  {
    name: "Swamps",
    icon: <Waves />,
    bg: "bg-blue-500/10",
    text: "text-blue-500",
    border: "border-blue-500/40",
    terrainTypeKey: TERRAIN_TYPES.PONDS,
    key: "wv",
  },
  {
    name: "Mountains",
    icon: <Mountain />,
    bg: "bg-stone-500/10",
    text: "text-stone-500",
    border: "border-stone-500/40",
    terrainTypeKey: TERRAIN_TYPES.RUBBLE,
    key: "mt",
  },
  {
    name: "Desert",
    icon: <DesertIcon className="w-6 h-6" />,
    bg: "bg-amber-500/10",
    text: "text-amber-500",
    border: "border-amber-500/40",
    terrainTypeKey: TERRAIN_TYPES.DESERT,
    key: "ds",
  },
];

const InteractiveTutorial: React.FC<InteractiveTutorialProps> = ({
  onBack,
  darkMode,
}) => {
  const [selectedUnit, setSelectedUnit] = useState<string>(PIECES.SNIPER);
  const [selectedTerrainIdx, setSelectedTerrainIdx] = useState<number>(0);
  const [allSeeds, setAllSeeds] = useState<SeedItem[]>([]);
  const [activeLayoutIdx, setActiveLayoutIdx] = useState<number>(-1);

  // Load seeds from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("trenchess_seeds");
    if (stored) {
      try {
        const data = JSON.parse(stored);
        if (Array.isArray(data)) setAllSeeds(data);
      } catch (e) {
        console.error("Failed to parse seeds", e);
      }
    }
  }, []);

  // Filter seeds that contain the active terrain type
  const activeTerrainTypeKey = TERRAIN_LIST[selectedTerrainIdx].terrainTypeKey;
  const filteredSeeds = useMemo(() => {
    return allSeeds.filter((item) => {
      const data = deserializeGame(item.seed);
      if (!data) return false;
      const { terrain } = data;
      // Check if any cell in the terrain grid matches the active terrain
      for (let r = 0; r < terrain.length; r++) {
        for (let c = 0; c < terrain[r].length; c++) {
          if (terrain[r][c] === activeTerrainTypeKey) return true;
        }
      }
      return false;
    });
  }, [allSeeds, activeTerrainTypeKey]);

  // Reset layout index when terrain changes
  useEffect(() => {
    setActiveLayoutIdx(-1);
  }, [selectedTerrainIdx]);

  // Cycle layout helpers (-1 = default, 0..n = filtered seeds)
  const handlePrevLayout = () => {
    if (filteredSeeds.length === 0) return;
    setActiveLayoutIdx((prev) => {
      if (prev <= -1) return filteredSeeds.length - 1;
      return prev - 1;
    });
  };
  const handleNextLayout = () => {
    if (filteredSeeds.length === 0) return;
    setActiveLayoutIdx((prev) => {
      if (prev >= filteredSeeds.length - 1) return -1;
      return prev + 1;
    });
  };

  const activeLayoutLabel =
    activeLayoutIdx === -1
      ? "Default"
      : filteredSeeds[activeLayoutIdx]?.name || "Saved Layout";

  // Compute terrain positions from the active seed layout
  const terrainPositions = useMemo<Set<string> | undefined>(() => {
    if (activeLayoutIdx === -1 || !filteredSeeds[activeLayoutIdx])
      return undefined;
    const data = deserializeGame(filteredSeeds[activeLayoutIdx].seed);
    if (!data) return undefined;
    const positions = new Set<string>();
    const { terrain } = data;
    for (let r = 0; r < terrain.length; r++) {
      for (let c = 0; c < terrain[r].length; c++) {
        if (terrain[r][c] === activeTerrainTypeKey) {
          positions.add(`${r},${c}`);
        }
      }
    }
    return positions.size > 0 ? positions : undefined;
  }, [activeLayoutIdx, filteredSeeds, activeTerrainTypeKey]);

  const textColor = darkMode ? "text-slate-100" : "text-slate-800";
  const subtextColor = darkMode ? "text-slate-400" : "text-slate-500";
  const cardBg = darkMode ? "bg-slate-900/50" : "bg-white/70";
  const borderColor = darkMode ? "border-white/10" : "border-slate-200";

  const unitTypes = Object.keys(UNIT_DETAILS);

  const handlePrevUnit = () => {
    const idx = unitTypes.indexOf(selectedUnit);
    const newIdx = (idx - 1 + unitTypes.length) % unitTypes.length;
    setSelectedUnit(unitTypes[newIdx]);
  };

  const handleNextUnit = () => {
    const idx = unitTypes.indexOf(selectedUnit);
    const newIdx = (idx + 1) % unitTypes.length;
    setSelectedUnit(unitTypes[newIdx]);
  };

  const handlePrevTerrain = () => {
    setSelectedTerrainIdx(
      (prev) => (prev - 1 + TERRAIN_LIST.length) % TERRAIN_LIST.length,
    );
  };

  const handleNextTerrain = () => {
    setSelectedTerrainIdx((prev) => (prev + 1) % TERRAIN_LIST.length);
  };

  const renderPortfolioView = () => {
    const details = UNIT_DETAILS[selectedUnit];
    const colors = unitColorMap[selectedUnit];
    const unit = INITIAL_ARMY.find((u) => u.type === selectedUnit);

    if (!details || !unit || !colors) return null;

    // Dynamic border style based on terrain affinity
    const unitIsProtected = isUnitProtected(
      selectedUnit,
      activeTerrainTypeKey as any,
    );
    const unitCanTraverse = canUnitTraverseTerrain(
      selectedUnit as PieceType,
      TERRAIN_LIST[selectedTerrainIdx].terrainTypeKey as TerrainType,
    );
    const panelBorderStyle = unitIsProtected
      ? "border-8 border-double"
      : !unitCanTraverse
        ? "border-8 border-dotted"
        : "border-4";

    const IconComp = unit.lucide;

    // Get Prev/Next Unit Icons
    const idx = unitTypes.indexOf(selectedUnit);
    const prevUnitType =
      unitTypes[(idx - 1 + unitTypes.length) % unitTypes.length];
    const nextUnitType = unitTypes[(idx + 1) % unitTypes.length];
    const prevUnit = INITIAL_ARMY.find((u) => u.type === prevUnitType);
    const nextUnit = INITIAL_ARMY.find((u) => u.type === nextUnitType);

    const PrevIcon = prevUnit?.lucide;
    const NextIcon = nextUnit?.lucide;
    const prevUnitColor = unitColorMap[prevUnitType];
    const nextUnitColor = unitColorMap[nextUnitType];

    const renderTerrainIcons = () => {
      return (
        <div className="flex gap-3">
          {TERRAIN_LIST.map((t, idx) => {
            const isProtected = isUnitProtected(
              selectedUnit,
              t.terrainTypeKey as any,
            );
            const canTraverse = canUnitTraverseTerrain(
              selectedUnit as PieceType,
              t.terrainTypeKey as TerrainType,
            );
            const isActive = idx === selectedTerrainIdx;

            return (
              <div
                key={idx}
                onClick={() => setSelectedTerrainIdx(idx)}
                className={`p-2.5 rounded-2xl ${t.bg} ${t.text} border ${t.border} shadow-sm backdrop-blur-md relative transition-all group/t cursor-pointer hover:scale-110 hover:shadow-lg hover:border-white/20 ${!canTraverse ? "opacity-50 grayscale-[0.5]" : ""} ${isActive ? "ring-2 ring-white/40 scale-110 shadow-lg" : ""}`}
              >
                {React.cloneElement(t.icon as React.ReactElement<any>, {
                  size: 24,
                  className: "fill-current/10",
                })}

                {/* Shield Badge for Protection */}
                {isProtected && (
                  <div
                    className={`absolute -top-2 -right-2 p-1 rounded-full bg-white dark:bg-slate-900 border-2 ${colors.border} shadow-lg z-10 flex items-center justify-center animate-pulse`}
                    title="Protected in this terrain"
                  >
                    <ShieldPlus
                      size={10}
                      className={`${colors.text}`}
                      strokeWidth={4}
                    />
                  </div>
                )}

                {/* Red X Badge for Untraversable Terrain */}
                {!canTraverse && (
                  <div className="absolute -top-1 -right-1 p-0.5 rounded-full bg-red-500/10 border border-red-500/20 shadow-sm z-10 flex items-center justify-center">
                    <X size={8} className="text-red-500" strokeWidth={6} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      );
    };

    return (
      <div className="h-full flex flex-col relative group/panel">
        <div
          className={`flex-1 p-8 rounded-3xl ${panelBorderStyle} ${cardBg} ${colors.border} flex flex-col gap-6 shadow-xl relative overflow-hidden transition-all`}
        >
          {/* Background decoration */}
          <div
            className={`absolute -right-20 -top-20 w-64 h-64 rounded-full ${colors.bg} blur-lg opacity-20`}
          />

          {/* Main Content Wrapper - Flex container to manage vertical spacing */}
          <div className="flex-1 flex flex-col items-center z-10 text-center w-full">
            {/* Full-width Top Ribbon */}
            <div
              className={`absolute top-0 left-0 right-0 z-20 pointer-events-none ${colors.ribbonBg} py-2.5 shadow-lg border-b border-white/10 flex justify-center items-center`}
            >
              <span className="text-white text-xl font-black uppercase tracking-[0.4em] drop-shadow-md">
                {details.role}
              </span>
            </div>

            {/* Subtitle - Reordered to top */}
            {details.subtitle && (
              <div className={`flex items-center gap-3 mb-2 mt-20 opacity-80`}>
                <UserPlus size={24} className={colors.text} />
                <span
                  className={`text-sm font-bold uppercase tracking-[0.2em] ${colors.text}`}
                >
                  {details.subtitle}
                </span>
              </div>
            )}

            {/* Title */}
            <h3
              className={`text-5xl font-black uppercase tracking-tighter ${textColor} mb-6 relative group`}
            >
              <span className="relative z-10 drop-shadow-sm">
                {details.title}
              </span>
              <div
                className={`absolute -inset-x-8 -inset-y-4 ${colors.bg} blur-2xl opacity-0 group-hover:opacity-40 transition-opacity rounded-full`}
              />
            </h3>

            {/* Icon Row with Nav Buttons flanking */}
            <div className="flex flex-row items-center gap-10 mb-6">
              {/* Unit Icon — with nav buttons bleeding out */}
              <div
                className={`relative w-36 h-36 rounded-[2.5rem] ${colors.bg} ${colors.text} flex items-center justify-center shadow-inner border border-white/5 group transition-transform hover:scale-105 overflow-visible`}
              >
                <IconComp className="w-20 h-20 transition-transform group-hover:rotate-3" />

                {/* Prev Unit Button — bleeds left */}
                <button
                  onClick={handlePrevUnit}
                  className={`absolute -left-5 top-1/2 -translate-y-1/2 z-30 cursor-pointer p-2 rounded-xl shadow-lg border opacity-40 grayscale hover:opacity-100 hover:grayscale-0 hover:scale-110 active:scale-95 transition-all flex items-center justify-center ${
                    prevUnitColor
                      ? `${prevUnitColor.bg} ${prevUnitColor.border} ${prevUnitColor.text}`
                      : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800/60 dark:text-white/60"
                  }`}
                >
                  {PrevIcon ? (
                    <PrevIcon size={18} />
                  ) : (
                    <ChevronLeft size={18} />
                  )}
                </button>

                {/* Next Unit Button — bleeds right */}
                <button
                  onClick={handleNextUnit}
                  className={`absolute -right-5 top-1/2 -translate-y-1/2 z-30 cursor-pointer p-2 rounded-xl shadow-lg border opacity-40 grayscale hover:opacity-100 hover:grayscale-0 hover:scale-110 active:scale-95 transition-all flex items-center justify-center ${
                    nextUnitColor
                      ? `${nextUnitColor.bg} ${nextUnitColor.border} ${nextUnitColor.text}`
                      : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800/60 dark:text-white/60"
                  }`}
                >
                  {NextIcon ? (
                    <NextIcon size={18} />
                  ) : (
                    <ChevronRight size={18} />
                  )}
                </button>
              </div>

              {/* Mini Move Preview */}
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
                      const isCenter = r === center && c === center;

                      const moves = details.movePattern(center, center);
                      const newMoves = details.newMovePattern
                        ? details.newMovePattern(center, center)
                        : [];
                      const attacks = details.attackPattern
                        ? details.attackPattern(center, center)
                        : [];

                      const isMove = moves.some(
                        ([mr, mc]) => mr === r && mc === c,
                      );
                      const isNewMove = newMoves.some(
                        ([mr, mc]) => mr === r && mc === c,
                      );
                      const isAttack = attacks.some(
                        ([ar, ac]) => ar === r && ac === c,
                      );

                      const isEven = (r + c) % 2 === 0;
                      const baseColor = isEven
                        ? "bg-slate-100/10 dark:bg-white/5"
                        : "bg-slate-200/10 dark:bg-white/[0.02]";

                      return (
                        <div
                          key={i}
                          className={`aspect-square rounded-sm relative transition-all duration-300 ${
                            isCenter
                              ? "bg-white z-20 shadow-md"
                              : isAttack
                                ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)] z-10"
                                : isNewMove
                                  ? "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)] z-10 animate-pulse"
                                  : isMove
                                    ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)] z-10"
                                    : baseColor
                          }`}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Bullets - Moved below icons */}
            <div className="w-full space-y-4 px-0 mb-8">
              {details.levelUp && (
                <div className="w-full px-2 text-left">
                  {/* All Bullets Grouped Together */}
                  <div className="flex flex-col gap-4 max-w-2xl mx-auto">
                    {details.levelUp.stats.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 text-left"
                      >
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${colors.bg} border ${colors.border} mt-1.5 shrink-0 shadow-sm`}
                        />
                        <p
                          className={`text-[13px] font-bold ${subtextColor} leading-snug opacity-90`}
                        >
                          {item}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Terrain Affinity - Pushed to Bottom with Divider Style */}
            <div className="mt-auto w-full flex flex-col items-center gap-5">
              <div className="flex items-center w-full gap-4 opacity-70">
                <div
                  className={`h-px flex-1 ${darkMode ? "bg-white/20" : "bg-slate-900/10"}`}
                />
                <span
                  className={`text-[10px] font-black uppercase tracking-widest ${subtextColor}`}
                >
                  Terrain Affinity
                </span>
                <div
                  className={`h-px flex-1 ${darkMode ? "bg-white/20" : "bg-slate-900/10"}`}
                />
              </div>
              {renderTerrainIcons()}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      className={`min-h-screen w-full ${darkMode ? "bg-[#050b15]" : "bg-stone-100"} p-4 md:p-8 overflow-y-auto`}
    >
      <div className="max-w-7xl mx-auto flex flex-col gap-6 min-h-[calc(100vh-8rem)]">
        {/* 1. Interactive Header */}
        <InteractiveHeader
          darkMode={darkMode}
          selectedUnit={selectedUnit}
          onUnitSelect={setSelectedUnit}
          selectedTerrainIdx={selectedTerrainIdx}
          onTerrainSelect={setSelectedTerrainIdx}
          onBack={onBack}
        />

        {/* 2. Main 5-Column Content Area */}
        <div className="hidden lg:grid grid-cols-[1.4fr_3rem_1fr_3rem_0.8fr] gap-0 items-stretch flex-1">
          {/* Column 1: Unit Portfolio */}
          {renderPortfolioView()}

          {/* Column 2: + Divider */}
          <div className="h-full flex flex-col justify-center">
            <div className="sticky top-1/2 -translate-y-1/2 flex justify-center pointer-events-none">
              <span className="text-5xl font-black text-slate-700/20 dark:text-white/10 select-none">
                +
              </span>
            </div>
          </div>

          {/* Column 3: Terrain Details */}
          <TerrainDetailsPanel
            darkMode={darkMode}
            terrainTypeKey={TERRAIN_LIST[selectedTerrainIdx].terrainTypeKey}
            selectedUnit={selectedUnit}
            onUnitSelect={setSelectedUnit}
            onPrev={handlePrevTerrain}
            onNext={handleNextTerrain}
            prevTerrainIcon={React.cloneElement(
              TERRAIN_LIST[
                (selectedTerrainIdx - 1 + TERRAIN_LIST.length) %
                  TERRAIN_LIST.length
              ].icon as React.ReactElement<any>,
              { size: 20 },
            )}
            nextTerrainIcon={React.cloneElement(
              TERRAIN_LIST[(selectedTerrainIdx + 1) % TERRAIN_LIST.length]
                .icon as React.ReactElement<any>,
              { size: 20 },
            )}
            prevTerrainColors={{
              bg: TERRAIN_LIST[
                (selectedTerrainIdx - 1 + TERRAIN_LIST.length) %
                  TERRAIN_LIST.length
              ].bg,
              text: TERRAIN_LIST[
                (selectedTerrainIdx - 1 + TERRAIN_LIST.length) %
                  TERRAIN_LIST.length
              ].text,
              border:
                TERRAIN_LIST[
                  (selectedTerrainIdx - 1 + TERRAIN_LIST.length) %
                    TERRAIN_LIST.length
                ].border,
            }}
            nextTerrainColors={{
              bg: TERRAIN_LIST[(selectedTerrainIdx + 1) % TERRAIN_LIST.length]
                .bg,
              text: TERRAIN_LIST[(selectedTerrainIdx + 1) % TERRAIN_LIST.length]
                .text,
              border:
                TERRAIN_LIST[(selectedTerrainIdx + 1) % TERRAIN_LIST.length]
                  .border,
            }}
          />

          {/* Column 4: = Divider */}
          <div className="h-full flex flex-col justify-center">
            <div className="sticky top-1/2 -translate-y-1/2 flex justify-center pointer-events-none">
              <span className="text-5xl font-black text-slate-700/20 dark:text-white/10 select-none">
                =
              </span>
            </div>
          </div>

          {/* Column 5: Result Preview — Wrapped in Trenchess Panel */}
          <div className="h-full flex flex-col relative">
            <div
              className={`flex-1 rounded-3xl border-4 border-blue-500/60 ${cardBg} shadow-xl relative overflow-hidden`}
            >
              {/* Blue Ribbon */}
              <div className="absolute top-0 left-0 right-0 z-20 pointer-events-none bg-blue-600 py-2.5 shadow-lg border-b border-white/10 flex justify-center items-center">
                <span className="text-white text-xl font-black uppercase tracking-[0.4em] drop-shadow-md">
                  Trenchess
                </span>
              </div>

              {/* Preview Grid — full height so sticky centering aligns with + = */}
              <div className="h-full">
                <TerrainMovePreview
                  darkMode={darkMode}
                  selectedUnit={selectedUnit}
                  selectedTerrainIdx={selectedTerrainIdx}
                  terrainPositions={terrainPositions}
                />
              </div>

              {/* Active Layout Picker — pinned to bottom */}
              <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between gap-4 px-3 py-2 bg-slate-900/80 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl border border-white/10">
                <button
                  onClick={handlePrevLayout}
                  disabled={filteredSeeds.length === 0}
                  className="p-2 rounded-xl hover:bg-white/10 transition-all text-slate-400 hover:text-blue-400 cursor-pointer disabled:opacity-30 disabled:cursor-default"
                >
                  <ChevronLeft size={20} />
                </button>

                <div className="flex flex-col items-center min-w-0">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Active Layout
                  </span>
                  <span className="text-sm font-black text-slate-200 uppercase tracking-widest truncate max-w-[120px]">
                    {activeLayoutLabel}
                  </span>
                  {filteredSeeds.length > 0 && (
                    <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">
                      {activeLayoutIdx + 2} / {filteredSeeds.length + 1}
                    </span>
                  )}
                </div>

                <button
                  onClick={handleNextLayout}
                  disabled={filteredSeeds.length === 0}
                  className="p-2 rounded-xl hover:bg-white/10 transition-all text-slate-400 hover:text-blue-400 cursor-pointer disabled:opacity-30 disabled:cursor-default"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile/Tablet Fallback (Stacked) */}
        <div className="lg:hidden flex flex-col gap-8">
          {renderPortfolioView()}
          <div className="text-center text-4xl font-black text-slate-700/20 dark:text-white/10">
            +
          </div>
          <TerrainDetailsPanel
            darkMode={darkMode}
            terrainTypeKey={TERRAIN_LIST[selectedTerrainIdx].terrainTypeKey}
            selectedUnit={selectedUnit}
            onUnitSelect={setSelectedUnit}
            onPrev={handlePrevTerrain}
            onNext={handleNextTerrain}
            prevTerrainIcon={React.cloneElement(
              TERRAIN_LIST[
                (selectedTerrainIdx - 1 + TERRAIN_LIST.length) %
                  TERRAIN_LIST.length
              ].icon as React.ReactElement<any>,
              { size: 20 },
            )}
            nextTerrainIcon={React.cloneElement(
              TERRAIN_LIST[(selectedTerrainIdx + 1) % TERRAIN_LIST.length]
                .icon as React.ReactElement<any>,
              { size: 20 },
            )}
            prevTerrainColors={{
              bg: TERRAIN_LIST[
                (selectedTerrainIdx - 1 + TERRAIN_LIST.length) %
                  TERRAIN_LIST.length
              ].bg,
              text: TERRAIN_LIST[
                (selectedTerrainIdx - 1 + TERRAIN_LIST.length) %
                  TERRAIN_LIST.length
              ].text,
              border:
                TERRAIN_LIST[
                  (selectedTerrainIdx - 1 + TERRAIN_LIST.length) %
                    TERRAIN_LIST.length
                ].border,
            }}
            nextTerrainColors={{
              bg: TERRAIN_LIST[(selectedTerrainIdx + 1) % TERRAIN_LIST.length]
                .bg,
              text: TERRAIN_LIST[(selectedTerrainIdx + 1) % TERRAIN_LIST.length]
                .text,
              border:
                TERRAIN_LIST[(selectedTerrainIdx + 1) % TERRAIN_LIST.length]
                  .border,
            }}
          />
          <div className="text-center text-4xl font-black text-slate-700/20 dark:text-white/10">
            =
          </div>
          {/* Mobile: Result Preview — Wrapped in Trenchess Panel */}
          <div className="flex flex-col">
            <div
              className={`p-6 rounded-3xl border-4 border-blue-500/60 ${cardBg} flex flex-col gap-4 shadow-xl relative overflow-hidden`}
            >
              {/* Blue Ribbon */}
              <div className="absolute top-0 left-0 right-0 z-20 pointer-events-none bg-blue-600 py-2.5 shadow-lg border-b border-white/10 flex justify-center items-center">
                <span className="text-white text-xl font-black uppercase tracking-[0.4em] drop-shadow-md">
                  Trenchess
                </span>
              </div>

              {/* Preview Grid */}
              <div className="mt-12 flex flex-col items-center justify-center">
                <TerrainMovePreview
                  darkMode={darkMode}
                  selectedUnit={selectedUnit}
                  selectedTerrainIdx={selectedTerrainIdx}
                  className="min-h-[400px]"
                  terrainPositions={terrainPositions}
                />
              </div>

              {/* Active Layout Picker */}
              <div className="flex items-center justify-between gap-4 px-3 py-2 bg-slate-200/50 dark:bg-slate-800/50 rounded-2xl backdrop-blur-sm">
                <button
                  onClick={handlePrevLayout}
                  disabled={filteredSeeds.length === 0}
                  className="p-2 rounded-xl hover:bg-white dark:hover:bg-slate-700 transition-all text-slate-600 dark:text-slate-400 hover:text-blue-500 cursor-pointer disabled:opacity-30 disabled:cursor-default"
                >
                  <ChevronLeft size={20} />
                </button>

                <div className="flex flex-col items-center min-w-0">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Active Layout
                  </span>
                  <span className="text-sm font-black text-slate-700 dark:text-slate-200 uppercase tracking-widest truncate max-w-[160px]">
                    {activeLayoutLabel}
                  </span>
                  {filteredSeeds.length > 0 && (
                    <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">
                      {activeLayoutIdx + 2} / {filteredSeeds.length + 1}
                    </span>
                  )}
                </div>

                <button
                  onClick={handleNextLayout}
                  disabled={filteredSeeds.length === 0}
                  className="p-2 rounded-xl hover:bg-white dark:hover:bg-slate-700 transition-all text-slate-600 dark:text-slate-400 hover:text-blue-500 cursor-pointer disabled:opacity-30 disabled:cursor-default"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>

        <CopyrightFooter />
      </div>
    </div>
  );
};

export default InteractiveTutorial;
