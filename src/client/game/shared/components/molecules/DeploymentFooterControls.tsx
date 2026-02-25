import React from "react";
import { RotateCcw } from "lucide-react";
import { PLAYER_CONFIGS } from "@constants";
import type { MultiplayerState } from "@/shared/types/multiplayer";
import type { PieceType, TerrainType } from "@/shared/types/game";

interface DeploymentFooterControlsProps {
  isZen: boolean;
  multiplayer?: MultiplayerState;
  activePlayers: string[];
  turn: string;
  setTurn: (pid: string) => void;
  setPlacementPiece: (piece: PieceType | null) => void;
  setPlacementTerrain: (terrain: TerrainType | null) => void;
  isAllPlaced: boolean;
  isCurrentPlayerReady?: boolean;
  setSelectedCell: (cell: null) => void;
  setValidMoves: (moves: number[][]) => void;
  ready?: () => void;
  startGame?: () => void;
}

export const DeploymentFooterControls: React.FC<
  DeploymentFooterControlsProps
> = ({
  isZen,
  multiplayer,
  activePlayers,
  turn,
  setTurn,
  setPlacementPiece,
  setPlacementTerrain,
  isAllPlaced,
  isCurrentPlayerReady,
  setSelectedCell,
  setValidMoves,
  ready,
  startGame,
}) => {
  if (isZen || multiplayer?.roomId) return null;

  return (
    <>
      <button
        onClick={() => {
          const idx = activePlayers.indexOf(turn);
          const next = activePlayers[(idx + 1) % activePlayers.length];
          setTurn(next);
          setPlacementPiece(null);
          setPlacementTerrain(null);
        }}
        className="w-full py-3 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200 dark:border-white/5 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 transition-all cursor-pointer"
      >
        <RotateCcw size={16} /> Next Commander
      </button>

      <button
        disabled={!isAllPlaced && !isCurrentPlayerReady}
        onClick={() => {
          if (isAllPlaced) {
            if (ready) ready();
            if (startGame) startGame();
            setSelectedCell(null);
            setValidMoves([]);
          } else {
            const idx = activePlayers.indexOf(turn);
            const next = activePlayers[(idx + 1) % activePlayers.length];
            setTurn(next);
            setPlacementPiece(null);
            setPlacementTerrain(null);
          }
        }}
        className={`w-full py-4 rounded-xl font-black text-lg uppercase tracking-tighter transition-all ${
          isAllPlaced
            ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg cursor-pointer"
            : isCurrentPlayerReady
              ? `${PLAYER_CONFIGS[turn].bg} hover:brightness-110 text-white shadow-lg cursor-pointer`
              : "bg-slate-100 dark:bg-white/5 opacity-40 cursor-not-allowed"
        }`}
      >
        {isAllPlaced ? "Commence War" : "Finish Deployment"}
      </button>
    </>
  );
};
