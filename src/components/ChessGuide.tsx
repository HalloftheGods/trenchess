/*
 * Copyright (c) 2006 - 2026 Hall of the Gods, Inc.
 * All Rights Reserved.
 *
 * This software is the confidential and proprietary information of Trenchess.
 */
import React from "react";
import { Trees, Mountain, Zap } from "lucide-react";
import BoardPreview from "./BoardPreview";
import { PIECES, INITIAL_ARMY } from "../constants";
import { DesertIcon } from "../UnitIcons";
import { UNIT_DETAILS, unitColorMap } from "../data/unitDetails";
import type { PieceStyle } from "../constants";
import PageLayout from "./PageLayout";
import PageHeader from "./PageHeader";
import SectionDivider from "./ui/SectionDivider";

interface ChessGuideProps {
  onBack: () => void;
  darkMode: boolean;
  pieceStyle: PieceStyle;
  toggleTheme?: () => void;
  togglePieceStyle?: () => void;
  onTutorial?: () => void;
  initialUnit?: string;
}

const ChessGuide: React.FC<ChessGuideProps> = ({
  onBack,
  darkMode,
  pieceStyle,
  toggleTheme,
  togglePieceStyle,
  onTutorial,
  initialUnit,
}) => {
  const textColor = darkMode ? "text-slate-100" : "text-slate-800";
  const subtextColor = darkMode ? "text-slate-400" : "text-slate-500";
  const cardBg = darkMode ? "bg-slate-900/50" : "bg-white/70";

  const renderTerrainIcons = (icons: React.ReactNode[]) => {
    return (
      <div className="flex gap-2">
        {icons.map((icon, idx) => {
          const iconElement = icon as React.ReactElement;
          const terrainColors =
            iconElement.type === Mountain
              ? {
                  bg: "bg-red-500/10",
                  text: "text-red-500",
                  border: "border-red-500/20",
                }
              : iconElement.type === Trees
                ? {
                    bg: "bg-emerald-500/10",
                    text: "text-emerald-500",
                    border: "border-emerald-500/20",
                  }
                : iconElement.type === DesertIcon
                  ? {
                      bg: "bg-amber-500/10",
                      text: "text-amber-500",
                      border: "border-amber-500/20",
                    }
                  : {
                      bg: "bg-blue-500/10",
                      text: "text-blue-500",
                      border: "border-blue-500/20",
                    };
          return (
            <div
              key={idx}
              className={`p-2.5 rounded-xl ${terrainColors.bg} ${terrainColors.text} border ${terrainColors.border} shadow-sm backdrop-blur-sm`}
            >
              {React.cloneElement(iconElement as React.ReactElement<any>, {
                size: 28,
                className: "fill-current",
              })}
            </div>
          );
        })}
      </div>
    );
  };

  const renderMovePreview = (
    unitType: string,
    movePattern: (r: number, c: number) => number[][],
  ) => {
    const previewGridSize = 9; // Smaller grid for cleaner look
    const centerRow = 4;
    const centerCol = 4;
    const details = UNIT_DETAILS[unitType];
    const moves = movePattern(centerRow, centerCol);
    const newMoves = details?.newMovePattern
      ? details.newMovePattern(centerRow, centerCol)
      : [];
    const attacks = details?.attackPattern
      ? details.attackPattern(centerRow, centerCol)
      : [];

    return (
      <div className="bg-slate-100 dark:bg-white/5 rounded-2xl p-3 border border-slate-200 dark:border-white/5 w-fit shadow-inner">
        <div
          className="grid gap-[1px] w-40 h-40 sm:w-48 sm:h-48"
          style={{
            gridTemplateColumns: `repeat(${previewGridSize}, 1fr)`,
          }}
        >
          {Array.from({ length: previewGridSize * previewGridSize }).map(
            (_, i) => {
              const r = Math.floor(i / previewGridSize);
              const c = i % previewGridSize;
              const isCenter = r === centerRow && c === centerCol;
              const isMove = moves.some(([mr, mc]) => mr === r && mc === c);
              const isAttack = attacks.some(([ar, ac]) => ar === r && ac === c);
              const isPromotionRow = unitType === PIECES.BOT && r === 0;

              const isEven = (r + c) % 2 === 0;
              const baseColor = isEven
                ? "bg-slate-100/60 dark:bg-white/10"
                : "bg-slate-200/60 dark:bg-white/[0.04]";

              return (
                <div
                  key={i}
                  className={`aspect-square rounded-[1px] relative flex items-center justify-center transition-all duration-300 ${
                    isCenter
                      ? "bg-slate-800 dark:bg-black z-20 shadow-lg scale-110"
                      : isAttack
                        ? "bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)] z-10"
                        : newMoves.some(([nr, nc]) => nr === r && nc === c)
                          ? "bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.4)] z-10 animate-pulse"
                          : isMove
                            ? "bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)] z-10"
                            : isPromotionRow
                              ? "bg-amber-500/20"
                              : baseColor
                  }`}
                >
                  {isPromotionRow && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500/40" />
                    </div>
                  )}
                  {isCenter && (
                    <div className="w-1 h-1 rounded-full bg-white dark:bg-black" />
                  )}
                </div>
              );
            },
          )}
        </div>
      </div>
    );
  };

  const boardPreviewNode = (
    <BoardPreview
      key="chess-guide-preview"
      selectedMode={"2p-ns"}
      selectedProtocol={"classic" as any}
      darkMode={darkMode}
      pieceStyle={pieceStyle}
      isReady={true}
      showTerrainIcons={false}
      hideUnits={false}
    />
  );

  // Defined order for display
  const UNIT_ORDER = initialUnit
    ? [initialUnit]
    : [
        PIECES.BOT,
        PIECES.HORSEMAN,
        PIECES.SNIPER,
        PIECES.TANK,
        PIECES.BATTLEKNIGHT,
        PIECES.COMMANDER,
      ];

  return (
    <PageLayout
      darkMode={darkMode}
      header={
        <PageHeader
          darkMode={darkMode}
          pieceStyle={pieceStyle}
          toggleTheme={toggleTheme || (() => {})}
          togglePieceStyle={togglePieceStyle || (() => {})}
          onTutorial={onTutorial}
          onLogoClick={onBack}
          onBack={onBack}
          boardPreview={boardPreviewNode}
        />
      }
    >
      <div className="max-w-5xl mx-auto w-full">
        {/* Header */}
        <div className="flex flex-col items-center mb-16">
          <SectionDivider
            label="The Chess - Unit Roster"
            color="blue"
            animate={true}
          />
        </div>

        {/* Units Grid */}
        <div className="grid grid-cols-1 gap-8 mb-20">
          {UNIT_ORDER.map((type) => {
            const unit = INITIAL_ARMY.find((u) => u.type === type);
            if (!unit) return null;

            const details = UNIT_DETAILS[unit.type];
            if (!details) return null;

            const colors = unitColorMap[unit.type];
            const IconComp = unit.lucide;
            const chessTitle = details.role;
            const jobTitle = details.title; // e.g. "Dragoon" or "Dark Knight"

            return (
              <div
                key={unit.type}
                className={`relative p-8 rounded-3xl border-4 ${cardBg} ${colors.border} flex flex-col gap-6 transition-all hover:shadow-lg overflow-hidden group/card`}
              >
                <div className="flex flex-col md:flex-row gap-10 items-center">
                  {/* Unit Icon (Left) */}
                  <div className="flex flex-col shrink-0 gap-4 items-center">
                    <div
                      className={`w-36 h-36 sm:w-48 sm:h-48 rounded-[2.5rem] ${colors.bg} ${colors.text} flex items-center justify-center shadow-inner border border-white/5 transition-transform group-hover/card:-rotate-3`}
                    >
                      <IconComp className="w-24 h-24 sm:w-32 sm:h-32 transition-transform group-hover/card:scale-110" />
                    </div>
                    {/* Terrain Icons */}
                    {details.levelUp?.terrainIcons && (
                      <div className="flex justify-center">
                        {renderTerrainIcons(details.levelUp.terrainIcons)}
                      </div>
                    )}
                  </div>

                  {/* Description (Middle) */}
                  <div className="flex-1 min-w-0 flex flex-col text-center md:text-left justify-center py-2">
                    <div className="flex flex-col gap-2 items-center md:items-start mb-6">
                      <div className="flex items-center gap-4 justify-center md:justify-start w-full flex-wrap">
                        <h3
                          className={`text-5xl font-black uppercase tracking-tighter ${textColor}`}
                        >
                          {jobTitle}
                        </h3>
                      </div>
                      <span
                        className={`text-lg font-black uppercase tracking-[0.2em] ${colors.text} opacity-90`}
                      >
                        {chessTitle}
                      </span>
                    </div>

                    <ul className="space-y-3">
                      {details.levelUp && (
                        <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10 mb-6 relative">
                          <div className="flex items-center gap-2 text-amber-500 font-black text-sm uppercase italic tracking-wider mb-2 justify-center md:justify-start">
                            <Zap size={14} className="fill-amber-500" />
                            Special Ability
                          </div>
                          <ul className="space-y-1">
                            {details.levelUp.stats.map((stat, sIdx) => (
                              <li
                                key={sIdx}
                                className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-2 text-left justify-center md:justify-start"
                              >
                                <div className="w-1 h-1 rounded-full bg-amber-500/40 shrink-0" />
                                {stat}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Standard Description */}
                      {details.desc?.map((line, i) => (
                        <li
                          key={i}
                          className="text-sm text-center md:text-left leading-relaxed font-medium text-slate-500 dark:text-slate-400"
                        >
                          {line}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Move Preview (Right) */}
                  <div className="shrink-0 flex flex-col gap-3 items-center md:items-start">
                    <span
                      className={`text-[10px] font-black uppercase tracking-widest ${subtextColor} flex items-center gap-2`}
                    >
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      Move Set
                    </span>
                    {renderMovePreview(unit.type, details.movePattern)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </PageLayout>
  );
};

export default ChessGuide;
