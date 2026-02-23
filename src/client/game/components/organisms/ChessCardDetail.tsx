import React, { useState } from "react";
import { ShieldPlus, UserPlus } from "lucide-react";
import { PIECES, INITIAL_ARMY, UNIT_DETAILS, unitColorMap, TERRAIN_DETAILS } from "@/client/game/theme";
import { isUnitProtected } from "@/core/mechanics/gameLogic";
import { canUnitTraverseTerrain } from "@/core/setup/terrainCompat";
import type { PieceType, TerrainType } from "@/shared/types/game";

interface ChessCardDetailProps {
  unitType: string;
  darkMode: boolean;
  selectedTerrainIdx?: number;
}

const ChessCardDetail: React.FC<ChessCardDetailProps> = ({
  unitType,
  darkMode,
  selectedTerrainIdx: controlledTerrainIdx,
}) => {
  const [internalTerrainIdx, setInternalTerrainIdx] = useState(-1);
  const activeTerrainIdx = controlledTerrainIdx ?? internalTerrainIdx;

  const textColor = darkMode ? "text-slate-100" : "text-slate-800";
  const subtextColor = darkMode ? "text-slate-400" : "text-slate-500";
  const gridBorderColor = darkMode ? "border-slate-800" : "border-slate-200";

  const unit = INITIAL_ARMY.find((u) => u.type === unitType);
  if (!unit) return null;

  const details = UNIT_DETAILS[unitType];
  if (!details) return null;

  const colors = unitColorMap[unitType];
  const IconComp = unit.lucide;

  // Dynamic border style based on terrain affinity

  const renderTerrainIcons = () => {
    return (
      <div className="flex gap-4 justify-center">
        {TERRAIN_DETAILS.map((t, idx) => {
          const isProtected = isUnitProtected(unitType, t.key as TerrainType);
          const canTraverse = canUnitTraverseTerrain(
            unitType as PieceType,
            t.key as TerrainType,
          );
          const isActive = idx === activeTerrainIdx;
          const TIcon = t.icon;

          return (
            <div
              key={idx}
              onClick={() => setInternalTerrainIdx(isActive ? -1 : idx)}
              className={`
                relative p-3 rounded-xl transition-all duration-300 cursor-pointer group
                ${isActive ? "scale-110 ring-2 ring-offset-2 ring-offset-slate-900" : "hover:scale-105 opacity-70 hover:opacity-100"}
                ${isActive ? colors.ring : "ring-transparent"}
                ${!canTraverse ? "grayscale opacity-30" : ""}
                ${t.color.bg} ${t.color.text} border ${t.color.border}
              `}
            >
              <TIcon size={20} />

              {isProtected && (
                <div className="absolute -top-2 -right-2 bg-white dark:bg-slate-800 rounded-full p-0.5 shadow-md border border-slate-200 dark:border-slate-700">
                  <ShieldPlus size={10} className={colors.text} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const renderMovePreview = () => {
    const previewGridSize = 7;
    const center = 3;
    const moves = details.movePattern(center, center);
    const newMoves = details.newMovePattern
      ? details.newMovePattern(center, center)
      : [];
    const attacks = details.attackPattern
      ? details.attackPattern(center, center)
      : [];

    return (
      <div
        className={`p-4 rounded-2xl ${darkMode ? "bg-slate-800/50" : "bg-slate-100"} border ${gridBorderColor}`}
      >
        <div
          className="grid gap-1 w-40 h-40"
          style={{
            gridTemplateColumns: `repeat(${previewGridSize}, 1fr)`,
          }}
        >
          {Array.from({ length: previewGridSize * previewGridSize }).map(
            (_, i) => {
              const r = Math.floor(i / previewGridSize);
              const c = i % previewGridSize;
              const isCenter = r === center && c === center;
              const isMove = moves.some(([mr, mc]) => mr === r && mc === c);
              const isAttack = attacks.some(([ar, ac]) => ar === r && ac === c);
              const isNewMove = newMoves.some(
                ([nr, nc]) => nr === r && nc === c,
              );

              let cellClass = darkMode ? "bg-slate-700/30" : "bg-slate-200/50";

              if (isCenter) {
                cellClass = darkMode
                  ? "bg-white text-slate-900"
                  : "bg-slate-900 text-white";
              } else if (isAttack) {
                cellClass = "bg-brand-red/80";
              } else if (isNewMove) {
                cellClass = "bg-amber-500/80";
              } else if (isMove) {
                cellClass = "bg-emerald-500/80";
              }

              return (
                <div
                  key={i}
                  className={`
                    rounded-sm flex items-center justify-center transition-colors duration-300
                    ${cellClass}
                    ${isCenter ? "shadow-md scale-110 z-10 rounded-md" : ""}
                  `}
                >
                  {isCenter && <IconComp size={16} />}
                </div>
              );
            },
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full h-full flex flex-col">
      {/* 1. Full-width Header */}
      <div
        className={`w-full ${colors.ribbonBg} py-3 shadow-md flex items-center justify-center relative z-10`}
      >
        <span className="text-white text-sm font-bold uppercase tracking-[0.2em] px-4 text-center">
          {details.role}
        </span>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:grid lg:grid-cols-[1fr_1.5fr_1fr] gap-8 p-6 lg:p-10 items-center lg:items-start text-center lg:text-left overflow-y-auto">
        {/* Left Col: Identity */}
        <div className="flex flex-col items-center gap-6 w-full">
          <div className={`relative group`}>
            <div
              className={`w-32 h-32 lg:w-40 lg:h-40 rounded-[2rem] flex items-center justify-center ${colors.bg} ${colors.text} border-2 ${colors.border} shadow-xl transition-transform duration-500 group-hover:scale-105 group-hover:rotate-1`}
            >
              <IconComp size={64} className="drop-shadow-sm" />
            </div>

            {unitType === PIECES.PAWN && (
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap bg-amber-500 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-md">
                Promotable
              </div>
            )}
          </div>

          <div className="flex flex-col items-center gap-2">
            <span
              className={`text-[10px] font-bold uppercase tracking-[0.2em] ${subtextColor}`}
            >
              Class Type
            </span>
            <span className={`text-sm font-bold ${textColor}`}>{unitType}</span>
          </div>
        </div>

        {/* Center Col: Stats & Info */}
        <div className="flex flex-col gap-6 w-full pt-4">
          <div className="flex flex-col gap-1 items-center lg:items-start">
            {details.subtitle && (
              <div
                className={`flex items-center gap-2 text-xs font-bold uppercase tracking-widest ${colors.text} mb-2`}
              >
                <UserPlus size={14} />
                <span>{details.subtitle}</span>
              </div>
            )}
            <h1
              className={`text-4xl lg:text-5xl font-black uppercase tracking-tighter ${textColor} leading-none`}
            >
              {details.title}
            </h1>
          </div>

          <div className="h-px w-24 bg-gradient-to-r from-slate-200 to-transparent dark:from-slate-700 mx-auto lg:mx-0" />

          {/* Description & Stats */}
          <div className="flex flex-col gap-4">
            {/* Level Up Title */}
            {details.levelUp && (
              <div className="flex items-center gap-3">
                <div
                  className={`w-1.5 h-1.5 rounded-full ${colors.bg} ${colors.ring}`}
                />
                <h4 className={`text-lg font-bold ${textColor}`}>
                  {details.levelUp.title}
                </h4>
              </div>
            )}

            {/* Stat Points */}
            <div className="flex flex-col gap-3 pl-4 lg:pl-0">
              {details.levelUp?.stats.map((stat, i) => (
                <div
                  key={i}
                  className={`flex items-start gap-3 text-sm lg:text-base leading-relaxed ${subtextColor}`}
                >
                  <span
                    className={`mt-2 w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600 shrink-0`}
                  />
                  <span>{stat}</span>
                </div>
              ))}
              {details.desc?.map((line, i) => (
                <div
                  key={`d-${i}`}
                  className={`flex items-start gap-3 text-sm lg:text-base leading-relaxed ${subtextColor}`}
                >
                  <span
                    className={`mt-2 w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600 shrink-0`}
                  />
                  <span>{line}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Tactical Grid */}
        <div className="flex flex-col items-center lg:items-end w-full gap-4">
          {renderMovePreview()}
          <div className="flex items-center gap-2 opacity-50">
            <div className="w-2 h-2 rounded-sm bg-emerald-500" />
            <span
              className={`text-[10px] font-bold uppercase tracking-wider ${subtextColor}`}
            >
              Move
            </span>
            <div className="w-2 h-2 rounded-sm bg-brand-red ml-2" />
            <span
              className={`text-[10px] font-bold uppercase tracking-wider ${subtextColor}`}
            >
              Attack
            </span>
          </div>
        </div>
      </div>

      {/* Footer: Affinities */}
      <div
        className={`w-full py-6 mt-auto border-t ${darkMode ? "border-slate-800" : "border-slate-100"}`}
      >
        <div className="flex flex-col items-center gap-4">
          <span
            className={`text-[10px] font-bold uppercase tracking-[0.2em] ${subtextColor} opacity-60`}
          >
            Terrain Mastery & Sanctuary
          </span>
          {renderTerrainIcons()}
        </div>
      </div>
    </div>
  );
};

export default ChessCardDetail;
