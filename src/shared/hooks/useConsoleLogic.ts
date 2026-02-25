import { useMemo } from "react";
import { useDeployment } from "@/shared/hooks/core/useDeployment";
import { 
  INITIAL_ARMY, 
  UNIT_POINTS, 
  TERRAIN_TYPES, 
  TERRAIN_INTEL 
} from "@constants";
import { isUnitProtected } from "@/core/mechanics/gameLogic";
import { getServerUrl } from "@hooks/useMultiplayer";
import type { GameStateHook } from "@/shared/types";

export const useConsoleLogic = (game: GameStateHook) => {
  const isOnline = !!game.multiplayer.roomId;
  const perspectivePlayerId = isOnline ? game.localPlayerName : game.turn;

  const myPlayerId = isOnline ? game.localPlayerName : null;
  const isAllPlacedLocally = !isOnline && game.isAllPlaced;
  const isMyPlayerPlaced =
    isOnline && !!myPlayerId && game.isPlayerReady(myPlayerId);
  const isMyPlayerLocked =
    isOnline && !!myPlayerId && !!game.readyPlayers[myPlayerId];

  const showOverlay =
    game.gameState === "setup" && (isAllPlacedLocally || isMyPlayerPlaced);

  const deployment = useDeployment({
    mode: game.mode,
    gameState: game.gameState,
    terrain: game.terrain,
    setTerrain: game.setTerrain,
    board: game.board,
    setBoard: game.setBoard,
    activePlayers: game.activePlayers,
    turn: game.turn,
    localPlayerName: game.localPlayerName,
    layoutName: game.layoutName,
    setInventory: game.setInventory,
  });

  const sanctuaryBonuses = useMemo(() => {
    const bonuses: Record<string, number> = {
      red: 0,
      yellow: 0,
      green: 0,
      blue: 0,
    };
    if (!game.board || !game.terrain) return bonuses;
    for (let r = 0; r < game.board.length; r++) {
      for (let c = 0; c < (game.board[r]?.length || 0); c++) {
        const piece = game.board[r][c];
        if (piece) {
          const terrain = game.terrain[r]?.[c];
          if (terrain && isUnitProtected(piece.type, terrain)) {
            bonuses[piece.player] = (bonuses[piece.player] || 0) + 1;
          }
        }
      }
    }
    return bonuses;
  }, [game.board, game.terrain]);

  const teamPowerStats = useMemo(() => {
    const stats: Record<string, { current: number; max: number }> = {
      red: { current: 0, max: 0 },
      yellow: { current: 0, max: 0 },
      green: { current: 0, max: 0 },
      blue: { current: 0, max: 0 },
    };
    const initialTotalPower = INITIAL_ARMY.reduce(
      (sum, unit) => sum + unit.count * (UNIT_POINTS[unit.type] || 0),
      0,
    );
    game.activePlayers.forEach((pid) => {
      stats[pid].max = initialTotalPower;
      let currentMaterial = 0;
      for (let r = 0; r < game.board.length; r++) {
        for (let c = 0; c < (game.board[r]?.length || 0); c++) {
          const piece = game.board[r][c];
          if (piece && piece.player === pid) {
            currentMaterial += UNIT_POINTS[piece.type] || 0;
          }
        }
      }
      stats[pid].current = currentMaterial + sanctuaryBonuses[pid];
    });
    return stats;
  }, [game.board, game.activePlayers, sanctuaryBonuses]);

  const inventoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    const playerInventory = game.inventory[perspectivePlayerId] || [];
    INITIAL_ARMY.forEach((unit) => {
      counts[unit.type] = playerInventory.filter(
        (type: string) => type === unit.type,
      ).length;
    });
    return counts;
  }, [game.inventory, perspectivePlayerId]);

  const terrainInventoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    const terrainTypesToCount = [
      TERRAIN_TYPES.TREES,
      TERRAIN_TYPES.PONDS,
      TERRAIN_TYPES.RUBBLE,
      TERRAIN_TYPES.DESERT,
    ];
    const playerTerrainInventory =
      game.terrainInventory[perspectivePlayerId] || [];
    terrainTypesToCount.forEach((terrainType) => {
      const label =
        (TERRAIN_INTEL[terrainType]?.label as string) || terrainType;
      counts[label] = playerTerrainInventory.filter(
        (type: string) => type === terrainType,
      ).length;
    });
    return counts;
  }, [game.terrainInventory, perspectivePlayerId]);

  const onlineInfo = isOnline ? {
    roomId: game.multiplayer.roomId,
    playerIndex: game.multiplayer.playerIndex,
    isHost: game.multiplayer.isHost,
    isConnected: game.multiplayer.isConnected,
    players: game.multiplayer.players,
    serverUrl: getServerUrl(),
  } : undefined;

  return {
    isOnline,
    perspectivePlayerId,
    myPlayerId,
    isAllPlacedLocally,
    isMyPlayerPlaced,
    isMyPlayerLocked,
    showOverlay,
    placedCount: deployment.placedCount,
    maxPlacement: deployment.maxPlacement,
    sanctuaryBonuses,
    teamPowerStats,
    inventoryCounts,
    terrainInventoryCounts,
    onlineInfo,
  };
};
