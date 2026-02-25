import React from "react";
import GameStateDebug from "../molecules/GameStateDebug";
import { useConsoleLogic } from "../../../../shared/hooks/useConsoleLogic";
import type { GameStateHook } from "@/shared/types";

interface ConsoleDebugPanelProps {
  game: GameStateHook;
  logic: ReturnType<typeof useConsoleLogic>;
}

export const ConsoleDebugPanel: React.FC<ConsoleDebugPanelProps> = ({
  game,
  logic,
}) => {
  return (
    <GameStateDebug
      gameState={game.gameState}
      mode={game.mode}
      turn={game.turn}
      setupMode={game.setupMode}
      activePlayers={game.activePlayers}
      placementPiece={game.placementPiece}
      placementTerrain={game.placementTerrain}
      isFlipped={game.isFlipped}
      getPlayerDisplayName={game.getPlayerDisplayName}
      inventoryCounts={logic.inventoryCounts}
      terrainInventoryCounts={logic.terrainInventoryCounts}
      placedCount={logic.placedCount}
      maxPlacement={logic.maxPlacement}
      setGameState={game.setGameState}
      setMode={game.setMode}
      setTurn={game.setTurn}
      setSetupMode={game.setSetupMode}
      readyPlayers={game.readyPlayers}
      setReadyPlayers={game.setReadyPlayers}
      playerTypes={game.playerTypes}
      setPlayerTypes={game.setPlayerTypes}
      localPlayerName={game.localPlayerName}
      setLocalPlayerName={game.setLocalPlayerName}
      setActivePlayers={game.setActivePlayers}
      showBgDebug={game.showBgDebug}
      setShowBgDebug={game.setShowBgDebug}
      bgioState={game.bgioState}
      isSheet={true}
      onlineInfo={logic.onlineInfo}
    />
  );
};
