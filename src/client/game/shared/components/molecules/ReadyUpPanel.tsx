import React from "react";
import { Bomb } from "lucide-react";
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
          bg-white/90 dark:bg-slate-900/80 backdrop-blur-md rounded-xl p-5 pt-10 space-y-4 shadow-xl
          transition-all duration-700 border-2
          ${!isReady && !isLocalTurn ? "cursor-pointer hover:border-slate-300 dark:hover:border-white/20" : ""}
          ${
            isReady
              ? `${borderClass} ring-1 ring-white/10 shadow-[0_0_30px_rgba(var(--${cfg.color.split("-")[0]}-rgb),0.2)]`
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

      {/* Ready Background Animation */}
      {isReady && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
          <div
            className={`absolute inset-[-100%] bg-gradient-to-r from-transparent via-${cfg.color}/30 to-transparent animate-[gradient-move_3s_linear_infinite] rotate-45`}
          />
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-0.5">
          <p className="text-[9px] text-slate-500 leading-relaxed uppercase tracking-wider font-bold">
            {isReady ? "Ready to Strike" : "Preparing Forces"}
          </p>
        </div>

        {/* Local CPU/Human Toggle */}
        {!isOnline && setPlayerType && (
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
        )}
      </div>

      {/* Conditionally rendered content for setup phase vs play phase */}
      {gameState === "play" ? (
        <div className="mt-4 space-y-4">
          {/* Captured Pieces Section */}
          {capturedPieces.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-red animate-pulse" />
                Trophies ({capturedPieces.length})
              </h4>
              <div className={`flex flex-wrap gap-1.5 min-h-8 p-2 rounded-lg bg-slate-50/50 dark:bg-white/[0.02] border ${borderMutedClass}`}>
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
                      className={`w-8 h-8 flex items-center justify-center rounded-md bg-white dark:bg-slate-800 shadow-sm border ${victimBorderClass} ${victimCfg?.text || ""}`}
                    >
                      {getIcon(unitTheme, "w-6 h-6", true)}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Deserted Pieces Section */}
          {desertedPieces.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                Lost to Elements ({desertedPieces.length})
              </h4>
              <div className={`flex flex-wrap gap-1.5 min-h-8 p-2 rounded-lg bg-slate-50/50 dark:bg-white/[0.02] border ${borderMutedClass}`}>
                {desertedPieces.map((piece, i) => {
                  const unitTheme = INITIAL_ARMY.find((u) => u.type === piece.type);
                  const victimCfg = PLAYER_CONFIGS[piece.player];
                  if (!unitTheme || !getIcon) return null;

                  return (
                    <div
                      key={i}
                      title={`Deserted ${victimCfg?.name || piece.player} ${piece.type}`}
                      className={`w-8 h-8 flex items-center justify-center rounded-md bg-white dark:bg-slate-800 shadow-sm border ${borderMutedClass} ${victimCfg?.text || ""} opacity-40`}
                    >
                      {getIcon(unitTheme, "w-6 h-6", true)}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <button
            onClick={() => console.log("Forfeit clicked")}
            className={`
              w-full py-3.5 text-center rounded-xl font-black text-xs uppercase italic tracking-[0.2em]
              transition-all duration-300 border
              bg-brand-red/10 text-brand-red border-brand-red/30 hover:bg-brand-red/20 hover:border-brand-red/50 hover:shadow-[0_0_20px_rgba(255,0,0,0.2)]
            `}
          >
            FORFEIT
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3">
            {/* Terrain Stats */}
            <div
              className={`
              flex flex-col p-2.5 rounded-lg border transition-colors
              ${isReady ? `bg-${cfg.color}/5 ${borderMutedClass}` : `bg-slate-50/50 dark:bg-white/[0.02] ${borderMutedClass}`}
            `}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[9px] uppercase font-bold text-slate-500 tracking-widest">
                  Terrain
                </span>
                {onResetTerrain && (
                  <button
                    onClick={onResetTerrain}
                    className="text-red-400/60 hover:text-red-400 transition-colors"
                  >
                    <Bomb size={12} />
                  </button>
                )}
              </div>
              <div className="flex items-end justify-between">
                <span
                  className={`text-sm font-black font-mono leading-none ${terrainReady ? "text-emerald-400" : "text-slate-400"}`}
                >
                  {placedCount}/{maxPlacement}
                </span>
                <span className="text-[8px] font-black uppercase tracking-tighter text-slate-600">
                  {terrainReady ? "Ready" : "Incomp"}
                </span>
              </div>
            </div>

            {/* Unit Stats */}
            <div
              className={`
              flex flex-col p-2.5 rounded-lg border transition-colors
              ${isReady ? `bg-${cfg.color}/5 ${borderMutedClass}` : `bg-slate-50/50 dark:bg-white/[0.02] ${borderMutedClass}`}
            `}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[9px] uppercase font-bold text-slate-500 tracking-widest">
                  Chessmen
                </span>
                {onResetUnits && (
                  <button
                    onClick={onResetUnits}
                    className="text-red-400/60 hover:text-red-400 transition-colors"
                  >
                    <Bomb size={12} />
                  </button>
                )}
              </div>
              <div className="flex items-end justify-between">
                <span
                  className={`text-sm font-black font-mono leading-none ${unitsReady ? "text-emerald-400" : "text-slate-400"}`}
                >
                  {unitsPlaced}/{maxUnits}
                </span>
                <span className="text-[8px] font-black uppercase tracking-tighter text-slate-600">
                  {unitsReady ? "Ready" : "Incomp"}
                </span>
              </div>
            </div>
          </div>

          {/* Not current turn indicator */}
          {!isLocalTurn && !isReady && (
            <div className="w-full py-3 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-600 border border-dashed border-slate-200 dark:border-white/5 rounded-lg">
              Preparing...
            </div>
          )}

          {/* Ready Button for Local / Host */}
          {!isReady && unitsReady && terrainReady && onReady && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onReady();
              }}
              className={`
                w-full py-3 text-center rounded-lg font-black text-[10px] uppercase tracking-[0.3em]
                transition-all duration-300 border
                bg-emerald-500/10 text-emerald-500 border-emerald-500/30 hover:bg-emerald-500/20 hover:border-emerald-500/50
                shadow-[0_0_15px_rgba(16,185,129,0.1)] hover:shadow-[0_0_20px_rgba(16,185,129,0.2)]
              `}
            >
              READY UP
            </button>
          )}
        </>
      )}
      </div>
    </div>
  );
};
