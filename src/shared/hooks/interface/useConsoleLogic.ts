import { useGameStats } from "../math/useGameStats";
import { useInventoryCounts } from "../math/useInventoryCounts";
import { useDeploymentMetrics } from "../math/useDeploymentMetrics";
import { getServerUrl } from "@/shared/utilities/env";
import type { GameStateHook } from "@tc.types";
import { PHASES } from "@constants/game";

export const useConsoleLogic = (game: GameStateHook) => {
  const {
    multiplayer,
    localPlayerName,
    turn,
    isAllPlaced,
    isPlayerReady,
    readyPlayers,
    gameState,
    board,
    terrain,
    activePlayers,
    inventory,
    terrainInventory,
    mode,
  } = game;
  const isOnline = !!multiplayer.roomId;
  const perspectivePlayerId = isOnline ? localPlayerName || turn : turn;
  const myPlayerId = isOnline ? localPlayerName : null;

  const isAllPlacedLocally = !isOnline && isAllPlaced;
  const isMyPlayerPlaced =
    isOnline && !!myPlayerId && isPlayerReady(myPlayerId);
  const isMyPlayerLocked =
    isOnline && !!myPlayerId && !!readyPlayers[myPlayerId];
  const showOverlay =
    gameState === PHASES.MAIN && (isAllPlacedLocally || isMyPlayerPlaced);

  const { sanctuaryBonuses, teamPowerStats } = useGameStats({
    board,
    terrain,
    activePlayers,
  });
  const inventoryCounts = useInventoryCounts({
    inventory,
    terrainInventory,
    perspectivePlayerId,
  });
  const { maxPlacement, placedCount, unitsPlaced, maxUnits } =
    useDeploymentMetrics({
      mode,
      terrain,
      inventory,
      activePlayers,
      perspectivePlayerId,
    });

  const onlineInfo = isOnline
    ? {
        roomId: multiplayer.roomId,
        playerIndex: multiplayer.playerIndex,
        isHost: multiplayer.isHost,
        isConnected: multiplayer.isConnected,
        players: multiplayer.players,
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
