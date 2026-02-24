import React from "react";
import { Bomb } from "lucide-react";
import { PLAYER_CONFIGS } from "@/constants";
import { PlayerTypeToggle } from "../atoms/PlayerTypeToggle";

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
  onResetTerrain?: () => void;
  onResetUnits?: () => void;
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
  onResetTerrain,
  onResetUnits,
}) => {
  const unitsReady = unitsPlaced >= 16;
  const terrainReady = placedCount >= maxPlacement;
  const cfg = PLAYER_CONFIGS[playerID];

  return (
    <div
      onClick={() => {
        if (!isReady && !isLocalTurn) onSelect?.();
      }}
      className={`
        relative overflow-hidden
        bg-white/90 dark:bg-slate-900/80 backdrop-blur-md border rounded-xl p-5 space-y-4 shadow-xl
        transition-all duration-700
        ${!isReady && !isLocalTurn ? "cursor-pointer hover:border-slate-300 dark:hover:border-white/20" : ""}
        ${
          isReady
            ? `border-${cfg.color}/50 dark:border-${cfg.color}/50 ring-1 ring-${cfg.color}/20 shadow-[0_0_30px_rgba(var(--${cfg.color.split("-")[0]}-rgb),0.2)]`
            : isLocalTurn
              ? "border-slate-300 dark:border-white/20 shadow-slate-100 dark:shadow-white/5"
              : "border-slate-100 dark:border-white/[0.06] opacity-60 grayscale-[0.5]"
        }
      `}
    >
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
          <h3
            className={`text-[11px] font-black uppercase tracking-[0.2em] ${isReady ? cfg.text : "text-slate-400"}`}
          >
            {cfg.name}
          </h3>
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
        <div className="mt-4">
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
              ${isReady ? `bg-${cfg.color}/5 border-${cfg.color}/20` : "bg-slate-50/50 dark:bg-white/[0.02] border-slate-100 dark:border-white/[0.04]"}
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
              ${isReady ? `bg-${cfg.color}/5 border-${cfg.color}/20` : "bg-slate-50/50 dark:bg-white/[0.02] border-slate-100 dark:border-white/[0.04]"}
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
                  {unitsPlaced}/16
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
        </>
      )}
    </div>
  );
};
