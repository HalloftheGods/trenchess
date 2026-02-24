import React, { useMemo } from "react";
import { Bomb, Target, Mountain, Zap, RotateCcw, ShieldAlert, User, Monitor, Shield } from "lucide-react";
import { PLAYER_CONFIGS, INITIAL_ARMY } from "@/constants";
import { PlayerTypeToggle } from "../atoms/PlayerTypeToggle";
import type { BoardPiece, ArmyUnit } from "@/shared/types/game";

interface ReadyUpPanelProps {
  gameState?: string;
  playerID: string;
  isReady: boolean;
  playerType: "human" | "computer";
  setPlayerType?: (val: "human" | "computer") => void;
  isOnline: boolean;
  isLocalTurn: boolean;
  onSelect?: () => void;
  placedCount: number;
  maxPlacement: number;
  unitsPlaced: number;
  maxUnits: number;
  onResetTerrain?: () => void;
  onResetUnits?: () => void;
  onReady?: () => void;
  capturedPieces?: BoardPiece[];
  desertedPieces?: BoardPiece[];
  getIcon?: (unit: ArmyUnit, className?: string, filled?: boolean) => React.ReactNode;
  alignment?: "left" | "right";
  inCheck?: boolean;
}

/**
 * ReadyUpPanel — Sidebar component for final deployment confirmation.
 */
export const ReadyUpPanel: React.FC<ReadyUpPanelProps> = ({
  gameState,
  playerID,
  isReady,
  playerType,
  setPlayerType,
  isOnline,
  isLocalTurn,
  onSelect,
  placedCount,
  maxPlacement,
  unitsPlaced,
  maxUnits,
  onResetTerrain,
  onResetUnits,
  onReady,
  capturedPieces = [],
  desertedPieces = [],
  getIcon,
  alignment = "left",
  inCheck = false,
}) => {
  const unitsReady = unitsPlaced >= maxUnits;
  const terrainReady = placedCount >= maxPlacement;
  const cfg = PLAYER_CONFIGS[playerID];

  // Calculate "Power Level" based on placed pieces
  const powerLevel = useMemo(() => {
    return Math.min(100, Math.floor((unitsPlaced / maxUnits) * 100));
  }, [unitsPlaced, maxUnits]);

  // Static border color mapping to ensure Tailwind picks up the classes
  const borderClass = {
    red: "border-brand-red",
    blue: "border-brand-blue",
    yellow: "border-yellow-500",
    green: "border-green-600",
  }[playerID] || "border-slate-200";

  const borderMutedClass = {
    red: "border-brand-red/30",
    blue: "border-brand-blue/30",
    yellow: "border-yellow-500/30",
    green: "border-green-600/30",
  }[playerID] || "border-slate-200/30";

  const ribbonBgClass = {
    red: "bg-brand-red",
    blue: "bg-brand-blue",
    yellow: "bg-yellow-500",
    green: "bg-green-600",
  }[playerID] || "bg-slate-500";

  const accentTextClass = {
    red: "text-brand-red",
    blue: "text-brand-blue",
    yellow: "text-yellow-500",
    green: "text-green-600",
  }[playerID] || "text-slate-500";

  return (
    <div className="relative group">
      {/* Check Ripple Effect */}
      {inCheck && (
        <div
          className={`absolute -inset-1 border-4 border-brand-red/50 rounded-2xl animate-ripple-out pointer-events-none z-0`}
        />
      )}

      <div
        onClick={() => {
          if (!isReady && !isLocalTurn) onSelect?.();
        }}
        className={`
          relative overflow-visible z-10
          bg-white/95 dark:bg-slate-900/90 backdrop-blur-xl rounded-xl p-5 pt-10 space-y-5 shadow-2xl
          transition-all duration-700 border-2
          ${!isReady && !isLocalTurn ? "cursor-pointer hover:border-slate-300 dark:hover:border-white/20" : ""}
          ${
            isReady
              ? `${borderClass} ring-1 ring-white/10 shadow-[0_0_40px_rgba(var(--${cfg.color.split("-")[0]}-rgb),0.3)]`
              : isLocalTurn
                ? `${borderClass} shadow-slate-100 dark:shadow-white/5`
                : `${borderMutedClass} opacity-60 grayscale-[0.5]`
          }
          ${inCheck ? "animate-pulse border-brand-red" : ""}
        `}
      >
      {/* Corner Ribbon Label */}
      <div
        className={`
          ${alignment === "left" ? "ribbon-left" : "ribbon-right"}
          ${ribbonBgClass} z-30
          text-[18px] font-black uppercase tracking-[0.1em] text-white shadow-xl
        `}
      >
        {cfg.name}
      </div>

      {/* Header */}
      <div className="flex items-center justify-between gap-4 border-b border-slate-100 dark:border-white/5 pb-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isReady ? ribbonBgClass : "bg-slate-500"} animate-pulse`} />
            <p className={`text-[10px] font-black uppercase tracking-[0.15em] ${isReady ? cfg.text : "text-slate-500"}`}>
              {isReady ? "Forces Locked" : "Deploying..."}
            </p>
          </div>
          
          {inCheck && (
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-brand-red/20 border border-brand-red/30 animate-pulse">
              <ShieldAlert size={10} className="text-brand-red" />
              <span className="text-[8px] font-black uppercase text-brand-red tracking-wider">In Check</span>
            </div>
          )}
        </div>

        {/* Local CPU/Human Toggle */}
        {!isOnline && setPlayerType && (
          <div className="flex items-center gap-2 bg-slate-100/50 dark:bg-white/5 px-2 py-1 rounded-lg border border-slate-200 dark:border-white/10">
            {playerType === "human" ? <User size={12} className="text-slate-500" /> : <Monitor size={12} className="text-slate-500" />}
            <PlayerTypeToggle
              turn={playerID}
              playerTypes={{ [playerID]: playerType }}
              setPlayerTypes={(
                updater: React.SetStateAction<
                  Record<string, "human" | "computer">
                >,
              ) => {
                const newState =
                  typeof updater === "function"
                    ? updater({ [playerID]: playerType })
                    : updater;
                setPlayerType(newState[playerID]);
              }}
            />
          </div>
        )}
      </div>

      {/* Tactical Readiness - Power Meter */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Zap size={10} className={accentTextClass} />
            <span className="text-[8px] font-black uppercase text-slate-500 tracking-widest">Readiness</span>
          </div>
          <span className="text-[10px] font-mono font-bold text-slate-400">{powerLevel}%</span>
        </div>
        <div className="h-1.5 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden border border-slate-200 dark:border-white/10">
          <div 
            className={`h-full ${ribbonBgClass} transition-all duration-1000 ease-out`}
            style={{ width: `${powerLevel}%` }}
          />
        </div>
      </div>

      {/* Conditionally rendered content for setup phase vs play phase */}
      {gameState === "play" ? (
        <div className="mt-2 space-y-5">
          {/* Captured Pieces Section */}
          {capturedPieces.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Shield size={10} className="text-slate-500" />
                <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">
                  Captured Trophies
                </h4>
              </div>
              <div className={`flex flex-wrap gap-2 p-3 rounded-xl bg-slate-50/50 dark:bg-white/[0.02] border ${borderMutedClass} shadow-inner`}>
                {capturedPieces.map((piece, i) => {
                  const unitTheme = INITIAL_ARMY.find((u) => u.type === piece.type);
                  const victimCfg = PLAYER_CONFIGS[piece.player];
                  if (!unitTheme || !getIcon) return null;

                  // Unique border for each trophy based on victim color
                  const victimBorderClass = {
                    red: "border-brand-red/40",
                    blue: "border-brand-blue/40",
                    yellow: "border-yellow-500/40",
                    green: "border-green-600/40",
                  }[piece.player] || "border-slate-200/40";

                  return (
                    <div
                      key={i}
                      title={`${victimCfg?.name || piece.player} ${piece.type}`}
                      className={`w-9 h-9 flex items-center justify-center rounded-lg bg-white dark:bg-slate-800 shadow-lg border-2 ${victimBorderClass} ${victimCfg?.text || ""} hover:scale-110 transition-transform cursor-help`}
                    >
                      {getIcon(unitTheme, "w-7 h-7", true)}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Deserted Pieces Section */}
          {desertedPieces.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-amber-500/60">
                <Bomb size={10} />
                <h4 className="text-[9px] font-black uppercase tracking-[0.2em]">
                  Lost to Elements
                </h4>
              </div>
              <div className={`flex flex-wrap gap-2 p-3 rounded-xl bg-slate-50/50 dark:bg-white/[0.02] border ${borderMutedClass} shadow-inner`}>
                {desertedPieces.map((piece, i) => {
                  const unitTheme = INITIAL_ARMY.find((u) => u.type === piece.type);
                  const victimCfg = PLAYER_CONFIGS[piece.player];
                  if (!unitTheme || !getIcon) return null;

                  return (
                    <div
                      key={i}
                      title={`Deserted ${victimCfg?.name || piece.player} ${piece.type}`}
                      className={`w-9 h-9 flex items-center justify-center rounded-lg bg-white dark:bg-slate-800 shadow-md border-2 ${borderMutedClass} ${victimCfg?.text || ""} opacity-30 grayscale`}
                    >
                      {getIcon(unitTheme, "w-7 h-7", true)}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <button
            onClick={() => console.log("Forfeit clicked")}
            className={`
              w-full py-4 text-center rounded-xl font-black text-xs uppercase italic tracking-[0.3em]
              transition-all duration-300 border-2
              bg-brand-red/10 text-brand-red border-brand-red/30 hover:bg-brand-red/20 hover:border-brand-red/50 hover:shadow-[0_0_30px_rgba(255,0,0,0.2)]
            `}
          >
            FORFEIT
          </button>
        </div>
      ) : (
        <div className="space-y-5 mt-2">
          <div className="grid grid-cols-2 gap-3">
            {/* Terrain Stats */}
            <div
              className={`
              flex flex-col p-3 rounded-xl border transition-all relative group/stat
              ${isReady ? `bg-${cfg.color}/5 ${borderMutedClass}` : `bg-slate-50/50 dark:bg-white/[0.02] ${borderMutedClass}`}
            `}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <Mountain size={10} className="text-slate-500" />
                  <span className="text-[8px] uppercase font-black text-slate-500 tracking-[0.15em]">
                    Field
                  </span>
                </div>
                {onResetTerrain && (
                  <button
                    onClick={(e) => { e.stopPropagation(); onResetTerrain(); }}
                    className="text-slate-400 hover:text-red-500 transition-colors"
                    title="Reset Terrain"
                  >
                    <RotateCcw size={10} className="group-hover/stat:hidden" />
                    <Bomb size={10} className="hidden group-hover/stat:block" />
                  </button>
                )}
              </div>
              <div className="flex items-end justify-between">
                <span
                  className={`text-lg font-black font-mono leading-none ${terrainReady ? "text-emerald-400" : "text-slate-400"}`}
                >
                  {placedCount}
                  <span className="text-[10px] text-slate-600 font-normal ml-0.5">/{maxPlacement}</span>
                </span>
                <div className={`px-1.5 py-0.5 rounded text-[7px] font-black uppercase tracking-tighter ${terrainReady ? "bg-emerald-500/20 text-emerald-500" : "bg-slate-500/10 text-slate-500"}`}>
                  {terrainReady ? "Ready" : "Deploy"}
                </div>
              </div>
            </div>

            {/* Unit Stats */}
            <div
              className={`
              flex flex-col p-3 rounded-xl border transition-all relative group/stat
              ${isReady ? `bg-${cfg.color}/5 ${borderMutedClass}` : `bg-slate-50/50 dark:bg-white/[0.02] ${borderMutedClass}`}
            `}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <Target size={10} className="text-slate-500" />
                  <span className="text-[8px] uppercase font-black text-slate-500 tracking-[0.15em]">
                    Army
                  </span>
                </div>
                {onResetUnits && (
                  <button
                    onClick={(e) => { e.stopPropagation(); onResetUnits(); }}
                    className="text-slate-400 hover:text-red-500 transition-colors"
                    title="Reset Units"
                  >
                    <RotateCcw size={10} className="group-hover/stat:hidden" />
                    <Bomb size={10} className="hidden group-hover/stat:block" />
                  </button>
                )}
              </div>
              <div className="flex items-end justify-between">
                <span
                  className={`text-lg font-black font-mono leading-none ${unitsReady ? "text-emerald-400" : "text-slate-400"}`}
                >
                  {unitsPlaced}
                  <span className="text-[10px] text-slate-600 font-normal ml-0.5">/{maxUnits}</span>
                </span>
                <div className={`px-1.5 py-0.5 rounded text-[7px] font-black uppercase tracking-tighter ${unitsReady ? "bg-emerald-500/20 text-emerald-500" : "bg-slate-500/10 text-slate-500"}`}>
                  {unitsReady ? "Ready" : "Deploy"}
                </div>
              </div>
            </div>
          </div>

          {/* Not current turn indicator */}
          {!isLocalTurn && !isReady && (
            <div className="w-full py-4 text-center text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-600 border-2 border-dashed border-slate-200 dark:border-white/5 rounded-xl bg-slate-50/30 dark:bg-white/[0.01]">
              Awaiting Command
            </div>
          )}

          {/* Ready Button for Local / Host */}
          {!isReady && unitsReady && terrainReady && onReady && (
            <button
              onClick={(e) => { e.stopPropagation(); onReady(); }}
              className={`
                w-full py-4 text-center rounded-xl font-black text-[11px] uppercase tracking-[0.4em]
                transition-all duration-500 border-2
                bg-emerald-500/10 text-emerald-500 border-emerald-500/30 hover:bg-emerald-500/20 hover:border-emerald-500/50
                shadow-[0_0_20px_rgba(16,185,129,0.1)] hover:shadow-[0_0_30px_rgba(16,185,129,0.2)]
                animate-pulse
              `}
            >
              LOCK FORCES
            </button>
          )}
        </div>
      )}
      </div>
    </div>
  );
};
