/*
 * Copyright (c) 2006 - 2026 Hall of the Gods, Inc.
 * All Rights Reserved.
 *
 * Capture the World Guide
 */
import React, { useMemo } from "react";
import { Flag, Crown, Crosshair, Skull, ShieldPlus } from "lucide-react";
import GameLogo from "./GameLogo";
import BoardPreview from "./BoardPreview";
import PageLayout from "./PageLayout";
import PageHeader from "./PageHeader";
import SectionDivider from "./ui/SectionDivider";
import { DEFAULT_SEEDS } from "../data/defaultSeeds";
import type { PieceStyle } from "../constants";

interface CaptureTheFlagGuideProps {
  onBack: () => void;
  darkMode: boolean;
  pieceStyle: PieceStyle;
  toggleTheme: () => void;
  togglePieceStyle: () => void;
  onTutorial?: () => void;
}

const CaptureTheFlagGuide: React.FC<CaptureTheFlagGuideProps> = ({
  onBack,
  darkMode,
  pieceStyle,
  toggleTheme,
  togglePieceStyle,
  onTutorial,
}) => {
  const textColor = darkMode ? "text-slate-100" : "text-slate-800";
  const subtextColor = darkMode ? "text-slate-400" : "text-slate-500";
  const cardBg = darkMode ? "bg-slate-900/50" : "bg-white/70";

  // Pick a random seed for the preview
  const randomSeed = useMemo(() => {
    const seeds = DEFAULT_SEEDS;
    if (seeds.length === 0) return undefined;
    const idx = Math.floor(Math.random() * seeds.length);
    return seeds[idx]?.seed;
  }, []);

  return (
    <PageLayout
      darkMode={darkMode}
      header={
        <PageHeader
          darkMode={darkMode}
          pieceStyle={pieceStyle}
          toggleTheme={toggleTheme}
          togglePieceStyle={togglePieceStyle}
          onTutorial={onTutorial}
          onLogoClick={onBack}
          onBack={onBack}
          logoText="Capture the World"
          topText="Trenchess"
          boardPreview={
            <>
              <BoardPreview
                selectedMode="2v2" // CTF Mode
                selectedProtocol="terrainiffic" // To allow custom seed
                customSeed={randomSeed}
                darkMode={darkMode}
                pieceStyle={pieceStyle}
                isReady={true}
                terrainSeed={0} // Not used when customSeed is provided
                showTerrainIcons={true}
                hideUnits={false}
              />
              <div className="flex flex-col items-center mt-4">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Terrain Layout
                </span>
                <span className="text-sm font-black text-slate-700 dark:text-slate-200 uppercase tracking-widest">
                  {DEFAULT_SEEDS.find((s) => s.seed === randomSeed)?.name ||
                    "Random"}
                </span>
              </div>
            </>
          }
        />
      }
    >
      <div className="max-w-5xl mx-auto w-full">
        {/* Rules Cards */}
        <div className="mb-12">
          <div className="flex flex-col items-center mb-16">
            <SectionDivider
              label="Rules of Engagement"
              color="amber"
              animate={true}
            />
          </div>

          <div className="grid grid-cols-1 gap-12">
            {/* Card 1: Pregame Setup */}
            <div
              className={`p-10 rounded-[2.5rem] border-4 ${cardBg} border-amber-500/30 flex flex-col lg:flex-row gap-10 relative overflow-hidden group shadow-2xl transition-all hover:border-amber-500/50`}
            >
              <div className="absolute top-0 left-0 right-0 bg-amber-600 py-2.5 shadow-lg border-b border-white/10 flex justify-center items-center">
                <span className="text-white text-lg font-black uppercase tracking-[0.4em] drop-shadow-md">
                  Pregame Setup
                </span>
              </div>

              <div className="flex flex-col flex-1 mt-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-4 rounded-[1.5rem] bg-amber-500/20 text-amber-500 border border-amber-500/30 shadow-inner">
                    <Crown size={32} />
                  </div>
                  <div>
                    <h3
                      className={`text-3xl font-black uppercase tracking-tight ${textColor}`}
                    >
                      Strategic Origin
                    </h3>
                    <p
                      className={`text-sm font-bold ${subtextColor} uppercase tracking-widest`}
                    >
                      Static King Placement
                    </p>
                  </div>
                </div>

                <div className="bg-slate-800/20 dark:bg-black/20 p-6 rounded-2xl border border-white/5 mb-6">
                  <p
                    className={`${subtextColor} font-bold leading-relaxed text-lg`}
                  >
                    All Kings start in the corner. This is a static rule unique
                    to all Capture the World games, forcing players to navigate
                    the entire board to reach their objective.
                  </p>
                </div>
              </div>

              {/* Visual Preview */}
              <div className="lg:w-[350px] flex shrink-0 items-center justify-center mt-4 lg:mt-8">
                <div className="w-full aspect-square bg-slate-900/40 rounded-[2rem] border-2 border-amber-500/20 flex flex-col items-center justify-center p-4 relative bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-500/5 to-transparent">
                  <div className="grid grid-cols-8 gap-1 w-full opacity-30 pointer-events-none">
                    {Array.from({ length: 16 }).map((_, i) => (
                      <div
                        key={i}
                        className={`aspect-square rounded-sm ${(Math.floor(i / 8) + (i % 8)) % 2 === 0 ? "bg-white/10" : "bg-black/10"}`}
                      />
                    ))}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="grid grid-cols-3 grid-rows-3 gap-16">
                      <div className="p-3 bg-red-600 rounded-xl shadow-lg shadow-red-900/50 -rotate-3">
                        <Crown className="text-white" size={24} />
                      </div>
                      <div />
                      <div className="p-3 bg-red-600 rounded-xl shadow-lg shadow-red-900/50 rotate-3">
                        <Crown className="text-white" size={24} />
                      </div>
                      <div /> <div /> <div />
                      <div className="p-3 bg-blue-600 rounded-xl shadow-lg shadow-blue-900/50 rotate-6">
                        <Crown className="text-white" size={24} />
                      </div>
                      <div />
                      <div className="p-3 bg-blue-600 rounded-xl shadow-lg shadow-blue-900/50 -rotate-6">
                        <Crown className="text-white" size={24} />
                      </div>
                    </div>
                  </div>
                  <span className="mt-auto text-[10px] font-black uppercase text-amber-500/60 tracking-widest pt-4">
                    Corner Starting Positions
                  </span>
                </div>
              </div>
            </div>

            {/* Card 2: Win Conditions */}
            <div
              className={`p-10 rounded-[2.5rem] border-4 ${cardBg} border-emerald-500/30 flex flex-col lg:flex-row gap-10 relative overflow-hidden group shadow-2xl transition-all hover:border-emerald-500/50`}
            >
              <div className="absolute top-0 left-0 right-0 bg-emerald-600 py-2.5 shadow-lg border-b border-white/10 flex justify-center items-center">
                <span className="text-white text-lg font-black uppercase tracking-[0.4em] drop-shadow-md">
                  Win Conditions
                </span>
              </div>

              <div className="flex flex-col flex-1 mt-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-4 rounded-[1.5rem] bg-emerald-500/20 text-emerald-500 border border-emerald-500/30 shadow-inner">
                    <Flag size={32} />
                  </div>
                  <div>
                    <h3
                      className={`text-3xl font-black uppercase tracking-tight ${textColor}`}
                    >
                      Victory Protocol
                    </h3>
                    <p
                      className={`text-sm font-bold ${subtextColor} uppercase tracking-widest`}
                    >
                      Occupation & Capture
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-emerald-500/5 p-5 rounded-2xl border border-emerald-500/10">
                    <strong
                      className={`${textColor} block mb-1 uppercase tracking-wider text-xs`}
                    >
                      1v1 Protocol
                    </strong>
                    <p
                      className={`${subtextColor} font-bold leading-relaxed text-sm`}
                    >
                      Landing your King on the square of the opposite color wins
                      the game immediately.
                    </p>
                  </div>
                  <div className="bg-emerald-500/5 p-5 rounded-2xl border border-emerald-500/10">
                    <strong
                      className={`${textColor} block mb-1 uppercase tracking-wider text-xs`}
                    >
                      2v2 Protocol
                    </strong>
                    <p
                      className={`${subtextColor} font-bold leading-relaxed text-sm`}
                    >
                      Both kings on a team must occupy the opposite square color
                      to win.
                    </p>
                  </div>
                </div>
              </div>

              {/* Visual Preview */}
              <div className="lg:w-[350px] flex shrink-0 items-center justify-center mt-4 lg:mt-8">
                <div className="w-full aspect-square bg-slate-900/40 rounded-[2rem] border-2 border-emerald-500/20 flex flex-col items-center justify-center p-4 relative overflow-hidden">
                  <div className="absolute inset-0 opacity-10 flex items-center justify-center scale-150">
                    <Flag className="text-emerald-500" size={200} />
                  </div>
                  <div className="relative z-10 flex flex-col items-center gap-4">
                    <div className="flex gap-2">
                      <div className="w-12 h-12 bg-white dark:bg-slate-200 rounded-lg flex items-center justify-center shadow-lg border-2 border-blue-500">
                        <Crown className="text-blue-600" size={24} />
                      </div>
                      <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center shadow-lg border-2 border-blue-500">
                        <Crown className="text-blue-600" size={24} />
                      </div>
                    </div>
                    <span className="text-[10px] font-black uppercase text-emerald-500 tracking-widest bg-emerald-500/20 px-3 py-1 rounded-full">
                      VICTORY ACHIEVED
                    </span>
                  </div>
                  <span className="mt-auto text-[10px] font-black uppercase text-emerald-500/60 tracking-widest pt-4">
                    Mirror Square Occupation
                  </span>
                </div>
              </div>
            </div>

            {/* Card 3: The Objective */}
            <div
              className={`p-10 rounded-[2.5rem] border-4 ${cardBg} border-blue-500/30 flex flex-col lg:flex-row gap-10 relative overflow-hidden group shadow-2xl transition-all hover:border-blue-500/50`}
            >
              <div className="absolute top-0 left-0 right-0 bg-blue-600 py-2.5 shadow-lg border-b border-white/10 flex justify-center items-center">
                <span className="text-white text-lg font-black uppercase tracking-[0.4em] drop-shadow-md">
                  The Objective
                </span>
              </div>

              <div className="flex flex-col flex-1 mt-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-4 rounded-[1.5rem] bg-blue-500/20 text-blue-500 border border-blue-500/30 shadow-inner">
                    <Crosshair size={32} />
                  </div>
                  <div>
                    <h3
                      className={`text-3xl font-black uppercase tracking-tight ${textColor}`}
                    >
                      Tactical Center
                    </h3>
                    <p
                      className={`text-sm font-bold ${subtextColor} uppercase tracking-widest`}
                    >
                      The Center is the Prize
                    </p>
                  </div>
                </div>

                <div className="bg-blue-500/5 p-6 rounded-2xl border border-blue-500/10 mb-6">
                  <p
                    className={`${subtextColor} font-bold leading-relaxed text-lg`}
                  >
                    Any eligible black or white tile counts as a flag, but the
                    centers are the most sought after. Direct corners may be too
                    far of a journey, making the center the strategic focal
                    point.
                  </p>
                </div>
              </div>

              {/* Visual Preview */}
              <div className="lg:w-[350px] flex shrink-0 items-center justify-center mt-4 lg:mt-8">
                <div className="w-full aspect-square bg-slate-900/40 rounded-[2rem] border-2 border-blue-500/20 flex flex-col items-center justify-center p-8 relative">
                  <div className="grid grid-cols-3 grid-rows-3 gap-2 w-full max-w-[200px]">
                    {[...Array(9)].map((_, i) => (
                      <div
                        key={i}
                        className={`aspect-square rounded-lg ${i === 4 ? "bg-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.5)] border-4 border-white/20" : "bg-slate-700/50 opacity-20"} flex items-center justify-center`}
                      >
                        {i === 4 && <Flag className="text-white" size={24} />}
                      </div>
                    ))}
                  </div>
                  <span className="mt-8 text-[10px] font-black uppercase text-blue-500/60 tracking-widest">
                    Central Strategic Zones
                  </span>
                </div>
              </div>
            </div>

            {/* Card 4: Lose / Freeze Conditions */}
            <div
              className={`p-10 rounded-[2.5rem] border-4 ${cardBg} border-red-500/30 flex flex-col lg:flex-row gap-10 relative overflow-hidden group shadow-2xl transition-all hover:border-red-500/50`}
            >
              <div className="absolute top-0 left-0 right-0 bg-red-600 py-2.5 shadow-lg border-b border-white/10 flex justify-center items-center">
                <span className="text-white text-lg font-black uppercase tracking-[0.4em] drop-shadow-md">
                  Risk Factors
                </span>
              </div>

              <div className="flex flex-col flex-1 mt-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-4 rounded-[1.5rem] bg-red-500/20 text-red-500 border border-red-500/30 shadow-inner">
                    <Skull size={32} />
                  </div>
                  <div>
                    <h3
                      className={`text-3xl font-black uppercase tracking-tight ${textColor}`}
                    >
                      Freeze & Defeat
                    </h3>
                    <p
                      className={`text-sm font-bold ${subtextColor} uppercase tracking-widest`}
                    >
                      Termination Protocol
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-red-500/5 p-5 rounded-2xl border border-red-500/10">
                    <strong
                      className={`${textColor} block mb-1 uppercase tracking-wider text-xs`}
                    >
                      Elimination
                    </strong>
                    <p
                      className={`${subtextColor} font-bold leading-relaxed text-sm`}
                    >
                      Checkmate still works! If your King is checkmated in 1v1,
                      it's game over immediately.
                    </p>
                  </div>
                  <div className="bg-red-500/5 p-5 rounded-2xl border border-red-500/10">
                    <strong
                      className={`${textColor} block mb-1 uppercase tracking-wider text-xs`}
                    >
                      Stasis (2v2)
                    </strong>
                    <p
                      className={`${subtextColor} font-bold leading-relaxed text-sm text-blue-400`}
                    >
                      Checkmate freezes the player. A teammate must terminate
                      the checkmate to unfreeze them.
                    </p>
                  </div>
                </div>
              </div>

              {/* Visual Preview */}
              <div className="lg:w-[350px] flex shrink-0 items-center justify-center mt-4 lg:mt-8">
                <div className="w-full aspect-square bg-slate-900/40 rounded-[2rem] border-2 border-red-500/20 flex flex-col items-center justify-center p-8 relative overflow-hidden">
                  <div className="absolute inset-0 bg-red-950/20 animate-pulse" />
                  <div className="relative z-10 p-6 rounded-3xl bg-slate-900 border-2 border-red-500/40 shadow-2xl rotate-3">
                    <div className="relative">
                      <Skull size={64} className="text-red-500 opacity-80" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <ShieldPlus
                          size={32}
                          className="text-white animate-bounce"
                        />
                      </div>
                    </div>
                  </div>
                  <span className="mt-8 text-[10px] font-black uppercase text-red-500/60 tracking-widest text-center">
                    Checkmate Interruption Required
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center mb-12">
          <GameLogo size="small" />
        </div>
      </div>
    </PageLayout>
  );
};

export default CaptureTheFlagGuide;
