import React, { useState } from "react";
import { ShieldPlus, UserPlus } from "lucide-react";
import { PIECES, INITIAL_ARMY, isUnitProtected } from "../../constants";
import { canUnitTraverseTerrain } from "../../utils/terrainCompat";
import { UNIT_DETAILS, unitColorMap } from "../../data/unitDetails";
import { TERRAIN_DETAILS } from "../../data/terrainDetails";
import type { PieceType, TerrainType } from "../../types";

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

  const unit = INITIAL_ARMY.find((u) => u.type === unitType);
  if (!unit) return null;

  const details = UNIT_DETAILS[unitType];
  if (!details) return null;

  const colors = unitColorMap[unitType];
  const IconComp = unit.lucide;

  const activeTerrainTypeKey =
    activeTerrainIdx >= 0 ? TERRAIN_DETAILS[activeTerrainIdx].key : null;

  // Dynamic border style based on terrain affinity
  const unitIsProtected =
    activeTerrainTypeKey &&
    isUnitProtected(unitType, activeTerrainTypeKey as any);
  const unitCanTraverse = activeTerrainTypeKey
    ? canUnitTraverseTerrain(
        unitType as PieceType,
        activeTerrainTypeKey as TerrainType,
      )
    : true;

  const panelBorderStyle = unitIsProtected
    ? "border-8 border-double scale-[0.98]"
    : !unitCanTraverse
      ? "border-8 border-dotted scale-[0.98]"
      : "border-0";

  const renderTerrainIcons = () => {
    return (
      <div className="flex gap-3 justify-center md:justify-start">
        {TERRAIN_DETAILS.map((t, idx) => {
          const isProtected = isUnitProtected(unitType, t.key as any);
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
              className={`p-2.5 rounded-2xl ${t.color.bg} ${t.color.text} border ${t.color.border} shadow-sm backdrop-blur-md relative transition-all cursor-pointer hover:scale-110 active:scale-95 group/t ${isActive ? "opacity-100 ring-2 ring-white/20 scale-110 shadow-lg" : !canTraverse ? "opacity-[0.42] grayscale-[0.5]" : "opacity-[0.85]"} ${isProtected ? "border-double border-4" : !canTraverse ? "border-dotted border-4" : ""}`}
            >
              <TIcon size={24} className="fill-current/10" />

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
      <div className="bg-slate-800/20 dark:bg-white/5 rounded-2xl p-3 border border-white/5 w-fit shadow-inner">
        <div
          className="grid gap-[1px] w-40 h-40"
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

              const isEven = (r + c) % 2 === 0;
              const baseColor = isEven
                ? "bg-slate-100/10 dark:bg-white/5"
                : "bg-slate-200/10 dark:bg-white/[0.02]";

              return (
                <div
                  key={i}
                  className={`aspect-square rounded-sm relative transition-all duration-300 ${
                    isCenter
                      ? "bg-white z-20 shadow-md scale-110"
                      : isAttack
                        ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)] z-10"
                        : newMoves.some(([nr, nc]) => nr === r && nc === c)
                          ? "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)] z-10 animate-pulse"
                          : isMove
                            ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)] z-10"
                            : baseColor
                  }`}
                />
              );
            },
          )}
        </div>
      </div>
    );
  };

  return (
    <div
      className={`relative w-full flex flex-col items-center z-10 text-center transition-all p-6 lg:p-10 pb-12 ${panelBorderStyle}`}
    >
      {/* Full-width Top Ribbon */}
      <div
        className={`absolute top-0 left-0 right-0 z-20 ${colors.ribbonBg} py-2 lg:py-3 shadow-lg border-b border-white/10 flex justify-center items-center`}
      >
        <span className="text-white text-lg lg:text-xl font-black uppercase tracking-[0.4em] drop-shadow-md">
          {details.role}
        </span>
      </div>

      {/* Background decoration */}
      <div
        className={`absolute -right-20 -top-20 w-64 h-64 rounded-full ${colors.bg} blur-[80px] opacity-20`}
      />

      {/* Subtitle */}
      {details.subtitle && (
        <div
          className={`flex items-center gap-2 mb-1 mt-10 lg:mt-12 opacity-80`}
        >
          <UserPlus size={20} className={colors.text} />
          <span
            className={`text-xs font-bold uppercase tracking-[0.2em] ${colors.text}`}
          >
            {details.subtitle}
          </span>
        </div>
      )}

      {/* Title */}
      <h3
        className={`text-4xl lg:text-6xl font-black uppercase tracking-tighter ${textColor} mb-4 lg:mb-6 relative group`}
      >
        <span className="relative z-10 drop-shadow-sm">{details.title}</span>
        <div
          className={`absolute -inset-x-8 -inset-y-4 ${colors.bg} blur-2xl opacity-0 group-hover:opacity-40 transition-opacity rounded-full`}
        />
      </h3>

      <div className="w-full flex flex-col md:grid md:grid-cols-[1fr_auto_1fr] gap-6 lg:gap-10 items-center mb-4 lg:mb-6">
        {/* Left: Unit Icon */}
        <div className="flex flex-col items-center gap-3 w-full">
          <div
            className={`relative w-32 h-32 lg:w-40 lg:h-40 rounded-[2.5rem] lg:rounded-[3rem] ${colors.bg} ${colors.text} flex items-center justify-center shadow-inner border border-white/5 transition-transform hover:rotate-3 group`}
          >
            <IconComp className="w-20 h-20 lg:w-24 lg:h-24 transition-transform group-hover:scale-110" />

            {unitType === PIECES.BOT && (
              <div className="absolute -bottom-3 bg-amber-500 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg border-2 border-slate-900">
                Promotable
              </div>
            )}
          </div>

          <span
            className={`text-[10px] font-black uppercase tracking-widest ${subtextColor} flex items-center gap-2`}
          >
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            Capabilities
          </span>
        </div>

        {/* Center: Info Bullets */}
        <div className="flex flex-col gap-4 lg:gap-5 w-full max-w-md">
          {details.levelUp && (
            <div className="flex flex-col gap-3 lg:gap-4">
              {details.levelUp.stats.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 lg:gap-4 text-left group/item"
                >
                  <div
                    className={`w-2 h-2 rounded-full ${colors.bg} border ${colors.border} mt-1.5 shrink-0 shadow-sm transition-transform group-hover/item:scale-125`}
                  />
                  <p
                    className={`text-sm lg:text-base font-bold ${subtextColor} leading-tight lg:leading-snug opacity-90 group-hover/item:opacity-100 transition-opacity`}
                  >
                    {item}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Standard Description */}
          {details.desc && details.desc.length > 0 && (
            <div className="flex flex-col gap-2 lg:gap-3">
              {details.desc.map((line, i) => (
                <p
                  key={i}
                  className={`text-[13px] lg:text-sm ${subtextColor} leading-relaxed`}
                >
                  {line}
                </p>
              ))}
            </div>
          )}
        </div>

        {/* Right: Move Preview */}
        <div className="flex flex-col items-center gap-4 w-full">
          {renderMovePreview()}
          <span
            className={`text-[9px] lg:text-[10px] font-black uppercase tracking-widest ${subtextColor}`}
          >
            Move Pattern Preview
          </span>
        </div>
      </div>

      {/* Terrain Affinity - Bottom */}
      <div className="mt-2 lg:mt-4 w-full flex flex-col items-center gap-4">
        <div className="flex items-center w-full gap-4 opacity-70">
          <div
            className={`h-px flex-1 ${darkMode ? "bg-white/10" : "bg-slate-900/10"}`}
          />
          <span
            className={`text-[10px] font-black uppercase tracking-widest ${subtextColor}`}
          >
            Trench Affinity & Sanctuary
          </span>
          <div
            className={`h-px flex-1 ${darkMode ? "bg-white/10" : "bg-slate-900/10"}`}
          />
        </div>
        {renderTerrainIcons()}
      </div>
    </div>
  );
};

export default ChessCardDetail;
