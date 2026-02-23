import React from "react";
import { MultiplayerLobbyStatus } from "../atoms/MultiplayerLobbyStatus";

import type { MultiplayerState } from "@/types/multiplayer";

interface MultiplayerFooterControlsProps {
  isZen: boolean;
  multiplayer?: MultiplayerState;
  startGame?: () => void;
  setSelectedCell: (cell: null) => void;
  setValidMoves: (moves: number[][]) => void;
  ready?: () => void;
  isCurrentPlayerReady?: boolean;
  isAllPlaced: boolean;
}

export const MultiplayerFooterControls: React.FC<
  MultiplayerFooterControlsProps
> = ({
  isZen,
  multiplayer,
  startGame,
  setSelectedCell,
  setValidMoves,
  ready,
  isCurrentPlayerReady,
  isAllPlaced,
}) => {
  if (isZen || !multiplayer?.roomId) return null;

  return (
    <div className="space-y-3">
      <MultiplayerLobbyStatus multiplayer={multiplayer} />

      {multiplayer.isHost &&
      multiplayer.players.every((p: string) => multiplayer.readyPlayers[p]) ? (
        <button
          onClick={() => {
            if (startGame) startGame();
            setSelectedCell(null);
            setValidMoves([]);
          }}
          className="w-full py-4 rounded-xl font-black text-lg uppercase tracking-tighter transition-all bg-amber-500 hover:bg-amber-400 text-white shadow-lg animate-pulse cursor-pointer"
        >
          START GAME
        </button>
      ) : (
        <button
          onClick={() => {
            if (multiplayer?.roomId) {
              if (multiplayer.toggleReady && multiplayer.socketId) {
                multiplayer.toggleReady(
                  !multiplayer.readyPlayers[multiplayer.socketId],
                );
              }
            } else if (ready) {
              ready();
            }
          }}
          className={`w-full py-4 rounded-xl font-black text-lg uppercase tracking-tighter transition-all flex items-center justify-center gap-2 ${
            multiplayer.socketId &&
            multiplayer.readyPlayers[multiplayer.socketId]
              ? "bg-slate-800 dark:bg-slate-700 text-white"
              : (isCurrentPlayerReady ?? isAllPlaced)
                ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg"
                : "bg-slate-100 dark:bg-white/5 opacity-50 cursor-not-allowed"
          }`}
          disabled={!(isCurrentPlayerReady ?? isAllPlaced)}
        >
          {multiplayer.socketId &&
          multiplayer.readyPlayers[multiplayer.socketId]
            ? "CANCEL READY"
            : "MARK READY"}
        </button>
      )}

      {multiplayer.socketId &&
        multiplayer.readyPlayers[multiplayer.socketId] &&
        !multiplayer.players.every(
          (p: string) => multiplayer.readyPlayers[p],
        ) && (
          <div className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest animate-pulse">
            Waiting for other players...
          </div>
        )}
    </div>
  );
};
