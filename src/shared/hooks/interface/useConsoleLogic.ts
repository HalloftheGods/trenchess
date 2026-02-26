import { useGameStats } from "../math/useGameStats";
import { useInventoryCounts } from "../math/useInventoryCounts";
import { useDeploymentMetrics } from "../math/useDeploymentMetrics";
import { getServerUrl } from "../engine/useMultiplayer";
import type { GameStateHook } from "@/shared/types";

/**
 * useConsoleLogic — Orchestrator for UI console data.
 * Delegates to specialized hooks for metrics and stats.
 */
export const useConsoleLogic = (game: GameStateHook) => {
  const isOnline = !!game.multiplayer.roomId;
  const perspectivePlayerId = isOnline
    ? game.localPlayerName || game.turn
    : game.turn;

  const myPlayerId = isOnline ? game.localPlayerName : null;
  const isAllPlacedLocally = !isOnline && game.isAllPlaced;
  const isMyPlayerPlaced =
    isOnline && !!myPlayerId && game.isPlayerReady(myPlayerId);
  const isMyPlayerLocked =
    isOnline && !!myPlayerId && !!game.readyPlayers[myPlayerId];

  const showOverlay =
    game.gameState === "setup" && (isAllPlacedLocally || isMyPlayerPlaced);

  const { sanctuaryBonuses, teamPowerStats } = useGameStats({
    board: game.board,
    terrain: game.terrain,
    activePlayers: game.activePlayers,
  });

  const inventoryCounts = useInventoryCounts({
    inventory: game.inventory,
    terrainInventory: game.terrainInventory,
    perspectivePlayerId,
  });

  const { maxPlacement, placedCount, unitsPlaced, maxUnits } =
    useDeploymentMetrics({
      mode: game.mode,
      terrain: game.terrain,
      inventory: game.inventory,
      activePlayers: game.activePlayers,
      perspectivePlayerId,
    });

  const onlineInfo = isOnline
    ? {
        roomId: game.multiplayer.roomId,
        playerIndex: game.multiplayer.playerIndex,
        isHost: game.multiplayer.isHost,
        isConnected: game.multiplayer.isConnected,
        players: game.multiplayer.players,
        serverUrl: getServerUrl(),
      }
    : undefined;

  return {
    isOnline,
    perspectivePlayerId,
    myPlayerId,
    isAllPlacedLocally,
    isMyPlayerPlaced,
    isMyPlayerLocked,
    showOverlay,
    placedCount,
    maxPlacement,
    unitsPlaced,
    maxUnits,
    sanctuaryBonuses,
    teamPowerStats,
    inventoryCounts: inventoryCounts.units,
    terrainInventoryCounts: inventoryCounts.terrain,
    onlineInfo,
  };
};
