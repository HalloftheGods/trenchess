/*
 * Copyright (c) 2006 - 2026 Hall of the Gods, Inc.
 * All Rights Reserved.
 *
 * This software is the confidential and proprietary information of Trenchess.
 */
import React from "react";
import {
  ArrowLeft,
  Map as MapIcon,
  Trees,
  Waves,
  Mountain,
  Crosshair,
  ShieldPlus,
  Zap,
  Sparkles,
} from "lucide-react";
import GameLogo from "./GameLogo";
import BoardPreview from "./BoardPreview";
import CopyrightFooter from "./CopyrightFooter";
import TerrainIntelTool from "./TerrainIntelTool";
import { PIECES, INITIAL_ARMY } from "../constants";
import { DesertIcon } from "../UnitIcons";
import { UNIT_DETAILS, unitColorMap } from "../data/unitDetails";
import type { PieceStyle } from "../constants";

interface HowToPlayProps {
  onBack: () => void;
  darkMode: boolean;
  pieceStyle: PieceStyle;
}

const HowToPlay: React.FC<HowToPlayProps> = ({
  onBack,
  darkMode,
  pieceStyle,
}) => {
  const textColor = darkMode ? "text-slate-100" : "text-slate-800";
  const subtextColor = darkMode ? "text-slate-400" : "text-slate-500";

  const cardBg = darkMode ? "bg-slate-900/50" : "bg-white/70";
  const borderColor = darkMode ? "border-white/10" : "border-slate-200";

  const renderSectionTitle = (
    title: string,
    icon: React.ReactNode,
    isGold?: boolean,
  ) => (
    <div className="flex items-center gap-3 mb-6">
      <div
        className={`p-2 rounded-lg ${isGold ? "bg-amber-500/20 text-amber-500 border border-amber-500/30" : darkMode ? "bg-blue-500/20 text-blue-400" : "bg-blue-100 text-blue-600"}`}
      >
        {icon}
      </div>
      <h2
        className={`text-2xl font-black tracking-widest ${isGold ? "text-amber-500" : textColor}`}
      >
        {title}
      </h2>
    </div>
  );

  const renderTerrainIcons = (icons: React.ReactNode[]) => {
    return (
      <div className="flex gap-2">
        {icons.map((icon, idx) => {
          const iconElement = icon as React.ReactElement;
          const terrainColors =
            iconElement.type === Mountain
              ? {
                  bg: "bg-stone-500/10",
                  text: "text-stone-500",
                  border: "border-stone-500/20",
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
    const previewGridSize = 12;
    const centerRow = 6;
    const centerCol = 6;
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
          className="grid gap-[1px] w-48 h-48 sm:w-64 sm:h-64"
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
                  className={`aspect-square rounded-sm relative flex items-center justify-center transition-all duration-300 ${
                    isCenter
                      ? "bg-slate-800 dark:bg-white z-20 shadow-lg scale-110"
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
                    <div className="w-1.5 h-1.5 rounded-full bg-white dark:bg-black" />
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
      className={`min-h-screen w-full ${darkMode ? "bg-[#050b15]" : "bg-stone-100"} p-4 md:p-8 overflow-y-auto`}
    >
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <button
            onClick={onBack}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all ${
              darkMode
                ? "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/5"
                : "bg-white hover:bg-slate-50 text-slate-700 shadow-sm border border-slate-200"
            }`}
          >
            <ArrowLeft size={20} />
            Back to Menu
          </button>
          <div className="text-right">
            {/* todo: add logo */}
            <h1 className={`text-4xl font-black tracking-tighter ${textColor}`}>
              TRENCHES
            </h1>
            <p
              className={`text-xs font-bold uppercase tracking-widest ${subtextColor}`}
            >
              How to Play Guide
            </p>
          </div>
        </div>

        {/* Introduction */}
        <div className="mb-12">
          <div
            className={`w-full p-8 rounded-3xl border-4 ${cardBg} ${borderColor} backdrop-blur-xl shadow-xl flex flex-col justify-center`}
          >
            <div
              className={`flex flex-col items-center font-black uppercase tracking-[0.2em] mb-6 ${darkMode ? "text-slate-400" : "text-slate-500"}`}
            >
              {/* Stacked Equation */}
              <div className="flex flex-col items-center gap-4">
                <span className="text-4xl md:text-5xl">Chess</span>

                <div className="flex items-center gap-4">
                  <span className="text-3xl md:text-4xl">+</span>
                  <div className="flex items-center gap-2">
                    <div className="p-2 px-3 rounded-2xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                      <Trees size={24} />
                    </div>
                    <div className="p-2 px-3 rounded-2xl bg-blue-500/10 text-blue-500 border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]">
                      <Waves size={24} />
                    </div>
                    <div className="p-2 px-3 rounded-2xl bg-stone-500/10 text-stone-500 dark:text-stone-400 border border-stone-500/20 shadow-[0_0_15px_rgba(120,113,108,0.1)]">
                      <Mountain size={24} />
                    </div>
                    <div className="p-2 px-3 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.1)]">
                      <DesertIcon className="w-6 h-6" />
                    </div>
                  </div>
                </div>

                <div
                  className={`w-full h-1 rounded-full ${darkMode ? "bg-slate-700" : "bg-slate-300"}`}
                />

                <div className="text-5xl md:text-6xl lg:text-7xl flex items-center justify-center">
                  <span className="text-red-600">TREN</span>
                  <span className="text-blue-600">CHESS</span>
                </div>
              </div>
            </div>
            <p
              className={`text-xl text-center leading-relaxed ${textColor} font-bold tracking-tight mb-4`}
            >
              What? Chess is Evolving!
            </p>
          </div>
        </div>

        {/* New Classes Unlocked! Section */}
        <div className="mb-12">
          {renderSectionTitle(
            "New Classes Unlocked!",
            <ShieldPlus size={32} />,
            true,
          )}
          <div className="grid grid-cols-1 gap-8">
            {[PIECES.HORSEMAN, PIECES.SNIPER, PIECES.TANK].map((type) => {
              const unit = INITIAL_ARMY.find((u) => u.type === type);
              if (!unit) return null;

              const details = UNIT_DETAILS[unit.type];
              if (!details) return null;

              const colors = unitColorMap[unit.type];
              const IconComp = unit.lucide;

              return (
                <div
                  key={unit.type}
                  className={`relative p-8 rounded-3xl border-4 ${cardBg} ${colors.border} flex flex-col gap-6 transition-all hover:shadow-lg overflow-hidden`}
                >
                  <div className="flex flex-col sm:flex-row gap-10 items-center">
                    {/* Unit Icon (Left) */}
                    <div className="flex flex-col shrink-0 gap-4 items-center">
                      <div
                        className={`w-36 h-36 sm:w-48 sm:h-48 rounded-[2.5rem] ${colors.bg} ${colors.text} flex items-center justify-center shadow-inner border border-white/5 transition-transform hover:-rotate-3 group`}
                      >
                        <IconComp className="w-24 h-24 sm:w-32 sm:h-32 transition-transform group-hover:scale-110" />
                      </div>
                      {/* Terrain Icons Below Main Icon */}
                      {details.levelUp?.terrainIcons && (
                        <div className="flex justify-center">
                          {renderTerrainIcons(details.levelUp.terrainIcons)}
                        </div>
                      )}
                    </div>

                    {/* Description (Middle) */}
                    <div className="flex-1 min-w-0 flex flex-col text-center sm:text-left justify-center py-2">
                      <div className="flex flex-col gap-1 items-center sm:items-start mb-6">
                        <div className="flex items-center gap-4 justify-center sm:justify-start w-full">
                          <h3
                            className={`text-4xl font-black uppercase tracking-tighter ${textColor}`}
                          >
                            {details.title}
                          </h3>
                          <div
                            className={`px-4 py-1.5 rounded-xl ${colors.bg} ${colors.text} text-[11px] font-black uppercase tracking-widest border border-white/5`}
                          >
                            {details.role}
                          </div>
                        </div>
                        {details.subtitle && (
                          <span
                            className={`text-sm font-bold uppercase tracking-[0.2em] ${colors.text} opacity-80`}
                          >
                            {details.subtitle}
                          </span>
                        )}
                      </div>

                      <ul className="space-y-3">
                        {details.levelUp && (
                          <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10 mb-6 relative">
                            <div className="flex items-center gap-2 text-amber-500 font-black text-sm uppercase italic tracking-wider mb-2">
                              <Zap size={14} className="fill-amber-500" />
                              {details.levelUp.title}
                            </div>
                            <ul className="space-y-1">
                              {details.levelUp.stats.map((stat, sIdx) => (
                                <li
                                  key={sIdx}
                                  className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-2 text-left"
                                >
                                  <div className="w-1 h-1 rounded-full bg-amber-500/40" />
                                  {stat}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {details.desc?.map((bullet, idx) => {
                          const parts = bullet.split(": ");
                          const header = parts[0];
                          const content = parts.slice(1).join(": ");
                          return (
                            <li
                              key={idx}
                              className={`text-sm text-center sm:text-left`}
                            >
                              <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-2">
                                <span
                                  className={`font-black uppercase tracking-tight text-xs ${colors.text} shrink-0`}
                                >
                                  {header
                                    .replace(/\*\*/g, "")
                                    .replace("New! ", "✨ ")}
                                </span>
                                <span
                                  className={`${subtextColor} font-medium leading-relaxed`}
                                >
                                  {content}
                                </span>
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    </div>

                    {/* Move Preview (Right) */}
                    <div className="shrink-0 flex flex-col gap-3 items-center sm:items-start">
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

        {/* New Abilities Section */}
        <div className="mb-12">
          {renderSectionTitle(
            "New Abilities Unlocked!",
            <Sparkles size={24} />,
            true,
          )}
          <div className="grid grid-cols-1 gap-8">
            {[PIECES.BOT, PIECES.BATTLEKNIGHT, PIECES.COMMANDER].map((type) => {
              const unit = INITIAL_ARMY.find((u) => u.type === type);
              if (!unit) return null;

              const details = UNIT_DETAILS[unit.type];
              if (!details) return null;

              const colors = unitColorMap[unit.type];
              const IconComp = unit.lucide;

              return (
                <div
                  key={unit.type}
                  className={`relative p-8 rounded-3xl border-4 ${cardBg} ${colors.border} flex flex-col gap-6 transition-all hover:shadow-lg overflow-hidden`}
                >
                  <div className="flex flex-col sm:flex-row gap-10 items-center">
                    {/* Unit Icon (Left) */}
                    <div className="flex flex-col shrink-0 gap-4 items-center">
                      <div
                        className={`w-36 h-36 sm:w-48 sm:h-48 rounded-[2.5rem] ${colors.bg} ${colors.text} flex items-center justify-center shadow-inner border border-white/5 transition-transform hover:-rotate-3 group`}
                      >
                        <IconComp className="w-24 h-24 sm:w-32 sm:h-32 transition-transform group-hover:scale-110" />
                      </div>
                      {/* Terrain Icons Below Main Icon */}
                      {details.levelUp?.terrainIcons && (
                        <div className="flex justify-center">
                          {renderTerrainIcons(details.levelUp.terrainIcons)}
                        </div>
                      )}
                    </div>

                    {/* Description (Middle) */}
                    <div className="flex-1 min-w-0 flex flex-col text-center sm:text-left justify-center py-2">
                      <div className="flex flex-col gap-1 items-center sm:items-start mb-6">
                        <div className="flex items-center gap-4 justify-center sm:justify-start w-full">
                          <h3
                            className={`text-4xl font-black uppercase tracking-tighter ${textColor}`}
                          >
                            {details.title}
                          </h3>
                          <div
                            className={`px-4 py-1.5 rounded-xl ${colors.bg} ${colors.text} text-[11px] font-black uppercase tracking-widest border border-white/5`}
                          >
                            {details.role}
                          </div>
                        </div>
                        {details.subtitle && (
                          <span
                            className={`text-sm font-bold uppercase tracking-[0.2em] ${colors.text} opacity-80`}
                          >
                            {details.subtitle}
                          </span>
                        )}
                      </div>

                      <ul className="space-y-3">
                        {details.levelUp && (
                          <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10 mb-6 relative">
                            <div className="flex items-center gap-2 text-amber-500 font-black text-sm uppercase italic tracking-wider mb-2">
                              <Zap size={14} className="fill-amber-500" />
                              {details.levelUp.title}
                            </div>
                            <ul className="space-y-1">
                              {details.levelUp.stats.map((stat, sIdx) => (
                                <li
                                  key={sIdx}
                                  className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-2 text-left"
                                >
                                  <div className="w-1 h-1 rounded-full bg-amber-500/40" />
                                  {stat}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {details.desc?.map((bullet, idx) => {
                          const parts = bullet.split(": ");
                          const header = parts[0];
                          const content = parts.slice(1).join(": ");
                          return (
                            <li
                              key={idx}
                              className={`text-sm text-center sm:text-left`}
                            >
                              <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-2">
                                <span
                                  className={`font-black uppercase tracking-tight text-xs ${colors.text} shrink-0`}
                                >
                                  {header
                                    .replace(/\*\*/g, "")
                                    .replace("New! ", "✨ ")}
                                </span>
                                <span
                                  className={`${subtextColor} font-medium leading-relaxed`}
                                >
                                  {content}
                                </span>
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    </div>

                    {/* Move Preview (Right) */}
                    <div className="shrink-0 flex flex-col gap-3 items-center sm:items-start">
                      <span
                        className={`text-[10px] font-black uppercase tracking-widest ${subtextColor} flex items-center gap-2`}
                      >
                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                        Basic Move Set
                      </span>
                      {renderMovePreview(unit.type, details.movePattern)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        {/* Battlefield Intelligence Section */}
        <div className="mb-12">
          {renderSectionTitle(
            "The Battlefield - Terrain Intel",
            <ShieldPlus size={24} />,
            true,
          )}
          <TerrainIntelTool darkMode={darkMode} />
        </div>

        {/* Engagement Rules */}
        <div
          className={`mb-12 p-8 rounded-3xl border ${cardBg} ${borderColor} backdrop-blur-xl shadow-xl`}
        >
          {renderSectionTitle("Engagement Rules", <Crosshair size={24} />)}
          <div className="space-y-4">
            <div className="flex gap-4">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full border shrink-0 ${darkMode ? "border-slate-700 bg-slate-800" : "border-slate-200 bg-white"} font-bold`}
              >
                1
              </div>
              <div>
                <h4 className={`font-bold ${textColor}`}>
                  Turn Based Strategy
                </h4>
                <p className={`text-sm ${subtextColor}`}>
                  Players take turns maneuvering their units across the board.
                  Strategy is key—position your army to control the center and
                  trap your opponent.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full border shrink-0 ${darkMode ? "border-slate-700 bg-slate-800" : "border-slate-200 bg-white"} font-bold`}
              >
                2
              </div>
              <div>
                <h4 className={`font-bold ${textColor}`}>Capture & Combat</h4>
                <p className={`text-sm ${subtextColor}`}>
                  Capture enemy pieces by landing exactly on their tile. Each
                  unit has a unique movement and attack profile—master them to
                  dominate the board.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full border shrink-0 ${darkMode ? "border-slate-700 bg-slate-800" : "border-slate-200 bg-white"} font-bold`}
              >
                3
              </div>
              <div>
                <h4 className={`font-bold ${textColor}`}>Victory Conditions</h4>
                <p className={`text-sm ${subtextColor}`}>
                  The game is won by capturing the enemy King or by reaching the
                  center flag tiles in Capture the Flag mode.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center mb-12">
          <div className="w-full">
            <BoardPreview
              selectedMode="2p-ns"
              selectedProtocol="classic"
              darkMode={darkMode}
              pieceStyle={pieceStyle}
              isReady={true}
              terrainSeed={12345} // Consistent seed for manual
            />
          </div>
        </div>

        <div className="flex justify-center mb-12">
          <GameLogo size="small" />
        </div>

        <CopyrightFooter />
      </div>
    </div>
  );
};

export default HowToPlay;
