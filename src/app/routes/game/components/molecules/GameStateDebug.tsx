import React from "react";
import type {
  GameState,
  GameMode,
  SetupMode,
  PieceType,
  TerrainType,
} from "@engineTypes/game";

interface GameStateDebugProps {
  gameState: GameState;
  mode: GameMode;
  turn: string;
  setupMode: SetupMode;
  activePlayers: string[];
  getPlayerDisplayName: (pid: string) => string;
  placementPiece: PieceType | null;
  placementTerrain: TerrainType | null;
  isFlipped: boolean;
  inventoryCounts: Record<string, number>;
  terrainInventoryCounts: Record<string, number>;
  placedCount: number;
  maxPlacement: number;
}

/**
 * GameStateDebug — a transparent panel showing live game state for debugging.
 * Renders key game variables in a compact, always-visible panel.
 */
const GameStateDebug: React.FC<GameStateDebugProps> = ({
  gameState,
  mode,
  turn,
  setupMode,
  activePlayers,
  getPlayerDisplayName,
  placementPiece,
  placementTerrain,
  isFlipped,
  inventoryCounts,
  terrainInventoryCounts,
  placedCount,
  maxPlacement,
}) => {
  const rows: [string, React.ReactNode][] = [
    [
      "Game State",
      <span
        className={`font-bold ${gameState === "setup" ? "text-emerald-400" : gameState === "play" ? "text-amber-400" : "text-slate-400"}`}
      >
        {gameState}
      </span>,
    ],
    ["Mode", mode],
    ["Turn", `${getPlayerDisplayName(turn)} (${turn})`],
    ["Setup Mode", setupMode],
    [
      "Players",
      activePlayers.map((p) => `${getPlayerDisplayName(p)} (${p})`).join(", "),
    ],
    ["Placement Piece", placementPiece || "—"],
    ["Placement Terrain", placementTerrain || "—"],
    ["Flipped", isFlipped ? "Yes" : "No"],
    ["Terrain Placed", `${placedCount} / ${maxPlacement}`],
  ];

  return (
    <div className="bg-slate-900/80 backdrop-blur-md border border-white/[0.06] rounded-xl p-4 space-y-3 text-xs font-mono shadow-xl">
      <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-2">
        Game State
      </h3>

      <div className="space-y-1.5">
        {rows.map(([label, value]) => (
          <div key={label as string} className="flex justify-between gap-3">
            <span className="text-slate-500 whitespace-nowrap">{label}</span>
            <span className="text-slate-200 text-right truncate">{value}</span>
          </div>
        ))}
      </div>

      {/* Inventory breakdown */}
      <div className="border-t border-white/[0.06] pt-2 mt-2">
        <h4 className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-600 mb-1.5">
          Unit Inventory
        </h4>
        <div className="space-y-1">
          {Object.entries(inventoryCounts).map(([type, count]) => (
            <div key={type} className="flex justify-between">
              <span className="text-slate-500">{type}</span>
              <span
                className={count > 0 ? "text-emerald-400" : "text-slate-600"}
              >
                {count}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-white/[0.06] pt-2 mt-2">
        <h4 className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-600 mb-1.5">
          Terrain Inventory
        </h4>
        <div className="space-y-1">
          {Object.entries(terrainInventoryCounts).map(([type, count]) => (
            <div key={type} className="flex justify-between">
              <span className="text-slate-500">{type}</span>
              <span className={count > 0 ? "text-blue-400" : "text-slate-600"}>
                {count}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GameStateDebug;
