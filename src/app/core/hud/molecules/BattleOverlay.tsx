import React from "react";
import { GameStartOverlay } from "../atoms/GameStartOverlay";
import type { GameStateHook } from "@tc.types";
import { PHASES } from "@constants/game";

interface BattleOverlayProps {
  game: GameStateHook;
  isOnline: boolean;
  myPlayerId: string | null;
}

export const BattleOverlay: React.FC<BattleOverlayProps> = ({
  game,
  isOnline,
  myPlayerId,
}) => {
  const isAllPlacedLocally = !isOnline && game.isAllPlaced;
  const isMyPlayerPlaced =
    isOnline && !!myPlayerId && game.isPlayerReady(myPlayerId);
  const isMyPlayerLocked =
    isOnline && !!myPlayerId && !!game.readyPlayers[myPlayerId];

  const showOverlay =
    (game.gameState === PHASES.MAIN || game.gameState === PHASES.GENESIS) &&
    (isAllPlacedLocally || isMyPlayerPlaced);

  if (!showOverlay) return null;

  return (
    <GameStartOverlay
      isOnline={isOnline}
      isLocked={isOnline ? isMyPlayerLocked : false}
      onLockIn={() => game.ready()}
      onStart={() => {
        game.ready();
        game.startGame();
      }}
    />
  );
};
