import React from "react";
import { BoardGrid } from "../organisms/BoardGrid";
import { CheckAlert } from "../atoms";
import { VictoryOverlay } from "../../../hud";
import { PHASES } from "@constants";
import type { BoardProps } from "@tc.types/game/ux/BoardProps";

export const GameBoard: React.FC<BoardProps> = (props) => {
  const { tactical, identity, geometry, callbacks } = props;
  const { mode, gameState, winner, winnerReason, inCheck } = tactical;
  const { localPlayerName } = identity;
  const { board, terrain } = geometry;
  const { getPlayerDisplayName, setGameState } = callbacks;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <div className="relative w-full aspect-square max-w-[900px]">
        {/* Thematic Background Glow */}
        <div className="absolute -inset-20 bg-gradient-to-tr from-red-600/10 via-transparent to-green-600/10 blur-[120px] pointer-events-none" />

        <BoardGrid {...props} />

        {/* Tactical Status Alerts */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-8 z-[60] w-full max-w-[300px] pointer-events-none">
          <CheckAlert inCheck={inCheck && gameState === PHASES.COMBAT} />
        </div>

        {gameState === PHASES.FINISHED && winner && (
          <VictoryOverlay
            winner={winner}
            reason={winnerReason || undefined}
            localPlayerName={localPlayerName}
            board={board}
            terrain={terrain}
            mode={mode}
            getPlayerDisplayName={getPlayerDisplayName}
            setGameState={setGameState}
          />
        )}
      </div>
    </div>
  );
};
