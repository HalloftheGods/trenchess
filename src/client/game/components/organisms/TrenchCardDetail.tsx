import React from "react";
import { ShieldPlus, Ban, Zap, Sparkles } from "lucide-react";
import { INITIAL_ARMY, PIECES } from "@/client/game/theme";
import { TERRAIN_TYPES } from "@/core/primitives/terrain";
import { isUnitProtected } from "@/core/mechanics/gameLogic";
import { canUnitTraverseTerrain } from "@/core/setup/terrainCompat";
import { UNIT_DETAILS, unitColorMap, TERRAIN_DETAILS } from "@/client/game/theme";
import type { TerrainType, PieceType } from "@/shared/types/game";
import type { PieceStyle } from "@/client/game/theme";

interface TrenchCardDetailProps {
  terrainType: TerrainType;
  darkMode: boolean;
  pieceStyle: PieceStyle;
  selectedUnit?: string;
  onUnitSelect?: (unitType: string) => void;
}

import { CHESS_NAME } from "@/client/game/theme";

const TrenchCardDetail: React.FC<TrenchCardDetailProps> = ({
  terrainType,
  darkMode,
  pieceStyle,
  selectedUnit: controlledUnit,
  onUnitSelect: controlledOnUnitSelect,
}) => {
  const [internalUnit, setInternalUnit] = React.useState<string | undefined>(
    undefined,
  );
  const activeUnit = controlledUnit ?? internalUnit;

  const onUnitSelect = (unitType: string) => {
    if (controlledOnUnitSelect) {
      controlledOnUnitSelect(unitType);
    } else {
      setInternalUnit(activeUnit === unitType ? undefined : unitType);
    }
  };

  const terrain = TERRAIN_DETAILS.find((t) => t.key === terrainType);
  if (!terrain) return null;

  const textColor = darkMode ? "text-slate-100" : "text-slate-800";
  const subtextColor = darkMode ? "text-slate-400" : "text-slate-500";
  const IconComp = terrain.icon;

  // Dynamic border style based on unit affinity
  const unitProtected = activeUnit
    ? isUnitProtected(activeUnit as PieceType, terrainType)
    : false;
  const unitCanTraverse = activeUnit
    ? canUnitTraverseTerrain(activeUnit as PieceType, terrainType)
    : true;
  const panelBorderStyle = unitProtected
    ? "border-8 border-dotted scale-[0.98]"
    : !unitCanTraverse
      ? "border-8 border-double scale-[0.98]"
      : "border-0";

  const getUnitIcon = (pieceKey: string) => {
    const unit = INITIAL_ARMY.find((u) => u.type === pieceKey);
    if (!unit) return null;
    if (pieceStyle === "lucide") {
      const Icon = unit.lucide;
      return <Icon className="w-full h-full" />;
    }
    if (pieceStyle === "custom") {
      const Icon = unit.custom;
      return <Icon className="w-full h-full" />;
    }
    return (
      <span className="text-lg leading-none">
        {unit[pieceStyle as "emoji" | "bold" | "outlined"]}
      </span>
    );
  };

  const renderUnitChip = (
    pieceKey: string,
    status: "allow" | "block" | "sanctuary",
  ) => {
    const unit = INITIAL_ARMY.find((u) => u.type === pieceKey);
    if (!unit) return null;
    const colors = unitColorMap[pieceKey];
    const isSanctuary = status === "sanctuary";
    const isBlock = status === "block";
    const chessInfo = CHESS_NAME[pieceKey];
    const isActive = activeUnit === pieceKey;

    return (
      <div
        key={pieceKey}
        onClick={() => onUnitSelect?.(pieceKey)}
        className={`flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all cursor-pointer hover:scale-[1.02] ${
          isActive ? "ring-2 ring-white/20 shadow-lg" : ""
        } ${
          isBlock
            ? "bg-brand-red/5 border-brand-red/20 opacity-60"
            : isSanctuary
              ? `${colors.bg} ${colors.border} border-double border-4`
              : `${colors.bg} ${colors.border}`
        }`}
      >
        <div
          className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
            isBlock ? "text-slate-500" : colors.text
          }`}
        >
          {getUnitIcon(pieceKey)}
        </div>
        <div className="flex-1 min-w-0">
          <span
            className={`block text-xs font-black uppercase tracking-wider leading-none mb-0.5 ${
              isBlock ? "text-slate-500" : colors.text
            }`}
          >
            {chessInfo?.chess || unit.type}
          </span>
          <span
            className={`text-[10px] font-bold uppercase tracking-widest ${
              isBlock
                ? "text-red-400"
                : isSanctuary
                  ? "text-amber-400"
                  : "text-emerald-400"
            }`}
          >
            {isBlock
              ? "✗ Blocked"
              : isSanctuary
                ? "⚔ Sanctuary"
                : "✓ Can Enter"}
          </span>
        </div>
        <div className="shrink-0">
          {isBlock ? (
            <Ban size={16} className="text-red-400/60" />
          ) : isSanctuary ? (
            <ShieldPlus size={16} className="text-amber-400/80" />
          ) : (
            <Zap size={16} className={`${colors.text} opacity-60`} />
          )}
        </div>
      </div>
    );
  };

  const renderMovePreview = () => {
    const previewGridSize = 7;
    const center = 3;

    // Use active unit or default to first sanctuary unit for the demo
    const demoUnitType = activeUnit || terrain.sanctuaryUnits[0];
    const demoUnitDetails = UNIT_DETAILS[demoUnitType];
    const isProtected = terrain.sanctuaryUnits.includes(
      demoUnitType as PieceType,
    );

    const moves = demoUnitDetails?.movePattern(center, center) || [];
    const attacks = demoUnitDetails?.attackPattern
      ? demoUnitDetails.attackPattern(center, center)
      : [];

    // Define mock threats based on terrain
    const getThreats = () => {
      const threats: Array<{ type: string; r: number; c: number }> = [];
      if (terrainType === TERRAIN_TYPES.TREES) {
        threats.push({ type: PIECES.ROOK, r: 3, c: 0 });
        threats.push({ type: PIECES.KNIGHT, r: 1, c: 2 });
      } else if (terrainType === TERRAIN_TYPES.PONDS) {
        threats.push({ type: PIECES.BISHOP, r: 0, c: 0 });
        threats.push({ type: PIECES.KNIGHT, r: 5, c: 2 });
      } else if (terrainType === TERRAIN_TYPES.RUBBLE) {
        threats.push({ type: PIECES.ROOK, r: 3, c: 6 });
        threats.push({ type: PIECES.BISHOP, r: 6, c: 0 });
      } else if (terrainType === TERRAIN_TYPES.DESERT) {
        threats.push({ type: PIECES.BISHOP, r: 0, c: 6 });
        threats.push({ type: PIECES.KNIGHT, r: 5, c: 4 });
      }
      return threats;
    };

    const threats = getThreats();

    // Calculate threat paths
    const threatPaths: number[][] = [];
    threats.forEach((t) => {
      const tDetails = UNIT_DETAILS[t.type];
      const tAttacks = tDetails?.attackPattern
        ? tDetails.attackPattern(t.r, t.c)
        : tDetails?.movePattern(t.r, t.c) || [];
      tAttacks.forEach((p) => threatPaths.push(p));
    });

    return (
      <div className="bg-slate-800/20 dark:bg-white/5 rounded-2xl p-3 border border-white/5 w-fit shadow-inner">
        <div
          className="grid gap-[1px] w-48 h-48"
          style={{
            gridTemplateColumns: `repeat(${previewGridSize}, 1fr)`,
          }}
        >
          {Array.from({ length: previewGridSize * previewGridSize }).map(
            (_, i) => {
              const r = Math.floor(i / previewGridSize);
              const c = i % previewGridSize;
              const isCenter = r === center && c === center;
              const inTerrain =
                Math.abs(r - center) <= 1 && Math.abs(c - center) <= 1;

              const isMove = moves.some(([mr, mc]) => mr === r && mc === c);
              const isAttack = attacks.some(([ar, ac]) => ar === r && ac === c);
              const isThreat = threats.some((t) => t.r === r && t.c === c);
              const isThreatPath = threatPaths.some(
                ([tr, tc]) => tr === r && tc === c,
              );

              const isEven = (r + c) % 2 === 0;
              let cellBg = isEven
                ? "bg-slate-100/10 dark:bg-white/5"
                : "bg-slate-200/10 dark:bg-white/[0.02]";

              if (inTerrain) {
                cellBg = isEven
                  ? terrain.color.bg.replace("/10", "/40")
                  : terrain.color.bg.replace("/10", "/30");
              }

              // Logic coloring
              let highlightLayer = null;
              if (isCenter) {
                highlightLayer = (
                  <div className="absolute inset-0 z-20 flex items-center justify-center">
                    <div className="text-slate-900 drop-shadow-[0_0_2px_rgba(255,255,255,0.8)] transform scale-110">
                      {getUnitIcon(demoUnitType)}
                    </div>
                  </div>
                );
              } else if (isThreat) {
                const threatType = threats.find(
                  (t) => t.r === r && t.c === c,
                )?.type;
                highlightLayer = (
                  <div className="absolute inset-0 z-20 flex items-center justify-center">
                    <div className="text-slate-900 drop-shadow-[0_0_2px_rgba(255,255,255,0.4)] scale-90">
                      {threatType ? getUnitIcon(threatType) : null}
                    </div>
                  </div>
                );
              } else if (isAttack) {
                highlightLayer = (
                  <div className="absolute inset-0 bg-brand-red/20 z-10" />
                );
              } else if (isMove) {
                highlightLayer = (
                  <div className="absolute inset-0 bg-emerald-500/20 z-10" />
                );
              } else if (isThreatPath) {
                const isBlockedBySanctuary = inTerrain && isProtected;
                highlightLayer = (
                  <div
                    className={`absolute inset-0 z-10 ${isBlockedBySanctuary ? "bg-slate-500/10 border border-dotted border-white/10" : "bg-brand-red/5"}`}
                  />
                );
              }

              return (
                <div
                  key={i}
                  className={`aspect-square rounded-sm relative flex items-center justify-center transition-all duration-300 ${cellBg} ${isCenter ? "z-30" : ""}`}
                >
                  {highlightLayer}
                  {!isCenter && !isThreat && inTerrain && (
                    <div className={`${terrain.color.text} opacity-20`}>
                      <IconComp size={12} />
                    </div>
                  )}
                  {!inTerrain && i === 0 && (
                    <div className="absolute -top-1 -left-1 w-2 h-2 rounded-full bg-white/5" />
                  )}
                </div>
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
        className={`absolute top-0 left-0 right-0 z-20 ${terrain.color.headerBg} py-2 lg:py-3 shadow-lg border-b border-white/10 flex justify-center items-center`}
      >
        <span className="text-white text-lg lg:text-xl font-black uppercase tracking-[0.4em] drop-shadow-md">
          Trench Intel
        </span>
      </div>

      {/* Background decoration */}
      <div
        className={`absolute -right-20 -top-20 w-64 h-64 rounded-full ${terrain.color.bg} blur-[80px] opacity-20`}
      />

      {/* Subtitle */}
      <div className="flex items-center gap-2 mb-1 mt-10 lg:mt-12 opacity-80">
        <Sparkles size={20} className={terrain.color.text} />
        <span
          className={`text-xs font-bold uppercase tracking-[0.2em] ${terrain.color.text}`}
        >
          {terrain.subtitle}
        </span>
      </div>

      {/* Title */}
      <h3
        className={`text-4xl lg:text-6xl font-black uppercase tracking-tighter ${textColor} mb-2 relative`}
      >
        <span className="relative z-10 drop-shadow-sm">{terrain.label}</span>
      </h3>

      <div
        className={`px-5 py-1.5 rounded-2xl ${terrain.color.bg} ${terrain.color.text} text-[11px] lg:text-sm font-black uppercase tracking-[0.3em] border border-white/5 mb-6 lg:mb-8`}
      >
        {terrain.tagline}
      </div>

      <div className="w-full flex flex-col md:grid md:grid-cols-[1fr_auto_1fr] gap-6 lg:gap-10 items-center mb-4 lg:mb-6">
        {/* Left: Terrain Icon */}
        <div className="flex flex-col items-center gap-4 w-full">
          <div
            className={`relative w-32 h-32 lg:w-40 lg:h-40 rounded-[2.5rem] lg:rounded-[3rem] ${terrain.color.iconBg} ${terrain.color.text} flex items-center justify-center shadow-inner border border-white/5 transition-transform hover:-rotate-3 group`}
          >
            <IconComp
              size={80}
              className="transition-transform group-hover:scale-110"
            />
          </div>

          <span
            className={`text-[9px] lg:text-[10px] font-black uppercase tracking-widest ${subtextColor} flex items-center gap-2`}
          >
            <div className="w-2 h-2 rounded-full bg-amber-500" />
            Geography
          </span>
        </div>

        {/* Center: Flavor Stats */}
        <div className="flex flex-col gap-4 lg:gap-5 w-full max-md:max-w-md">
          <div className="flex flex-col gap-3 lg:gap-4">
            <div className="flex items-center gap-2 text-amber-500 font-black text-[13px] lg:text-sm uppercase italic tracking-wider mb-1 justify-center md:justify-start">
              <Zap size={14} className="fill-amber-500" />
              {terrain.flavorTitle}
            </div>
            {terrain.flavorStats?.map((stat: string, i: number) => (
              <div
                key={i}
                className="flex items-start gap-3 lg:gap-4 text-left group/item"
              >
                <div
                  className={`w-2 h-2 rounded-full bg-amber-500/40 border border-amber-500/20 mt-1.5 shrink-0 transition-transform group-hover/item:scale-125`}
                />
                <p
                  className={`text-[13px] lg:text-[14px] font-bold ${subtextColor} leading-tight lg:leading-snug opacity-90 group-hover/item:opacity-100 transition-opacity`}
                >
                  {stat}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Grid Preview */}
        <div className="flex flex-col items-center gap-4 w-full">
          {renderMovePreview()}
          <span
            className={`text-[9px] lg:text-[10px] font-black uppercase tracking-widest ${subtextColor}`}
          >
            Terrain Density Preview
          </span>
        </div>
      </div>

      {/* Unit Interaction Grid - Bottom */}
      <div className="mt-4 lg:mt-6 w-full flex flex-col items-center gap-4 lg:gap-5">
        <div className="flex items-center w-full gap-4 opacity-70">
          <div
            className={`h-px flex-1 ${darkMode ? "bg-white/10" : "bg-slate-900/10"}`}
          />
          <span
            className={`text-[9px] lg:text-[10px] font-black uppercase tracking-widest ${subtextColor}`}
          >
            Unit Interaction Profiles
          </span>
          <div
            className={`h-px flex-1 ${darkMode ? "bg-white/10" : "bg-slate-900/10"}`}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 lg:gap-3 w-full max-w-4xl">
          {/* Sanctuary units first */}
          {terrain.sanctuaryUnits.map((pk: string) => renderUnitChip(pk, "sanctuary"))}
          {/* Allowed-but-not-sanctuary */}
          {terrain.allowedUnits
            .filter((pk: string) => !terrain.sanctuaryUnits.includes(pk as PieceType))
            .map((pk: string) => renderUnitChip(pk, "allow"))}
          {/* Blocked */}
          {terrain.blockedUnits.map((pk: string) => renderUnitChip(pk, "block"))}
        </div>
      </div>
    </div>
  );
};

export default TrenchCardDetail;
