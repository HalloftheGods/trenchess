import { PIECES, TERRAIN_TYPES, UNIT_POINTS } from "@constants";
import { INVALID_MOVE } from "boardgame.io/core";
import { canPlaceUnit, isWithinUnitLimits } from "./validation";
import { getQuota } from "./coreHelpers";
import { getPlayerCells } from "./territory";
import type { BoardPiece, TerrainType, PieceType, GameMode } from "@tc.types";

/**
 * Pure state management for the Builder/Genesis phase.
 * These functions take current state and return the updated state.
 */

interface PlacementState {
  board: (BoardPiece | null)[][];
  terrain: TerrainType[][];
  inventory: Record<string, PieceType[]>;
  terrainInventory: Record<string, TerrainType[]>;
  mercenaryPoints?: Record<string, number>;
  isMercenary?: boolean;
}

/**
 * countPlacedTerrain (Atom)
 */
export const countPlacedTerrain = (
  terrain: TerrainType[][],
  playerId: string,
  mode: GameMode,
): number => {
  const myCells = getPlayerCells(playerId, mode);
  let currentTerrainCount = 0;

  for (const [row, col] of myCells) {
    const isSpecialTerrain = terrain[row][col] !== TERRAIN_TYPES.FLAT;
    if (isSpecialTerrain) {
      currentTerrainCount++;
    }
  }

  return currentTerrainCount;
};

/**
 * applyPiecePlacement (Molecule)
 */
export const applyPiecePlacement = (
  state: PlacementState,
  playerId: string,
  row: number,
  col: number,
  type: PieceType | null,
  _mode: GameMode,
  isGM: boolean = false,
): PlacementState | typeof INVALID_MOVE => {
  const newState = {
    ...state,
    board: state.board.map((row) => [...row]),
    inventory: { ...state.inventory },
    mercenaryPoints: state.mercenaryPoints
      ? { ...state.mercenaryPoints }
      : undefined,
  };

  const handleRemoval = () => {
    const currentPiece = newState.board[row][col];
    if (!currentPiece) return INVALID_MOVE;

    const isOwnPiece = currentPiece.player === playerId;
    if (!isOwnPiece && !isGM) return INVALID_MOVE;

    const targetPid = currentPiece.player; // Refund to the owner

    if (newState.isMercenary && newState.mercenaryPoints) {
      if (currentPiece.type === PIECES.KING) {
        newState.inventory[targetPid] = [
          ...(newState.inventory[targetPid] || []),
          currentPiece.type as PieceType,
        ];
      } else {
        const cost = UNIT_POINTS[currentPiece.type] || 0;
        newState.mercenaryPoints[targetPid] =
          (newState.mercenaryPoints[targetPid] || 0) + cost;
      }
    } else {
      newState.inventory[targetPid] = [
        ...(newState.inventory[targetPid] || []),
        currentPiece.type as PieceType,
      ];
    }

    newState.board[row][col] = null;
  };

  const handlePlacement = (unitType: PieceType) => {
    const isLimitExceeded = !isWithinUnitLimits(
      newState.board,
      newState.inventory,
      playerId,
      unitType,
      !!newState.isMercenary,
    );
    const currentPieceAtTarget = newState.board[row][col];
    const isReplacingSameType =
      currentPieceAtTarget?.type === unitType &&
      currentPieceAtTarget?.player === playerId;

    if (isLimitExceeded && !isReplacingSameType && !isGM) return INVALID_MOVE;

    const terrainAtCell = state.terrain[row][col];
    const isCompatibleWithTerrain = canPlaceUnit(unitType, terrainAtCell);
    if (!isCompatibleWithTerrain && !isGM) return INVALID_MOVE;

    let costToDeduct = 0;
    const playerInventory = newState.inventory[playerId] || [];
    const inventoryIndex = playerInventory.indexOf(unitType);
    const isPieceInInventory = inventoryIndex !== -1;

    if (isGM) {
      // GM bypasses inventory and points
    } else if (newState.isMercenary && newState.mercenaryPoints) {
      if (unitType === PIECES.KING) {
        if (!isPieceInInventory) return INVALID_MOVE;
      } else {
        const cost = UNIT_POINTS[unitType] || 0;
        if ((newState.mercenaryPoints[playerId] ?? 0) < cost) {
          return INVALID_MOVE;
        }
        costToDeduct = cost;
      }
    } else {
      if (!isPieceInInventory) return INVALID_MOVE;
    }

    // Refund / return previous piece
    if (currentPieceAtTarget) {
      if (currentPieceAtTarget.player !== playerId && !isGM)
        return INVALID_MOVE;
      if (!isGM) {
        const targetPid = currentPieceAtTarget.player;
        if (newState.isMercenary && newState.mercenaryPoints) {
          if (currentPieceAtTarget.type === PIECES.KING) {
            newState.inventory[targetPid] = [
              ...(newState.inventory[targetPid] || []),
              currentPieceAtTarget.type as PieceType,
            ];
          } else {
            const refund = UNIT_POINTS[currentPieceAtTarget.type] || 0;
            newState.mercenaryPoints[targetPid] =
              (newState.mercenaryPoints[targetPid] || 0) + refund;
          }
        } else {
          newState.inventory[targetPid] = [
            ...(newState.inventory[targetPid] || []),
            currentPieceAtTarget.type as PieceType,
          ];
        }
      }
    }

    newState.board[row][col] = { type: unitType, player: playerId };

    if (!isGM) {
      if (newState.isMercenary && newState.mercenaryPoints) {
        if (unitType === PIECES.KING && isPieceInInventory) {
          const updatedInv = [...newState.inventory[playerId]];
          updatedInv.splice(inventoryIndex, 1);
          newState.inventory[playerId] = updatedInv;
        } else if (costToDeduct > 0) {
          newState.mercenaryPoints[playerId] -= costToDeduct;
        }
      } else {
        if (isPieceInInventory) {
          const updatedInv = [...newState.inventory[playerId]];
          updatedInv.splice(inventoryIndex, 1);
          newState.inventory[playerId] = updatedInv;
        }
      }
    }
  };

  const currentPieceAtTarget = state.board[row][col];
  const isTogglingOff =
    currentPieceAtTarget?.type === type &&
    currentPieceAtTarget?.player === playerId &&
    type !== null;

  if (type === null || isTogglingOff) {
    const res = handleRemoval();
    if (res === INVALID_MOVE) return INVALID_MOVE;
  } else {
    const res = handlePlacement(type);
    if (res === INVALID_MOVE) return INVALID_MOVE;
  }

  return newState;
};

/**
 * applyTerrainPlacement (Molecule)
 */
export const applyTerrainPlacement = (
  state: PlacementState,
  playerId: string,
  row: number,
  col: number,
  type: TerrainType,
  mode: GameMode,
  isGM: boolean = false,
): PlacementState | typeof INVALID_MOVE => {
  const newState = {
    ...state,
    terrain: state.terrain.map((row) => [...row]),
    terrainInventory: { ...state.terrainInventory },
  };

  const handleRemoval = () => {
    const currentTerrain = newState.terrain[row][col];
    if (currentTerrain === TERRAIN_TYPES.FLAT) return INVALID_MOVE;

    const targetPid = playerId; // Refund to placer
    newState.terrainInventory[targetPid] = [
      ...(newState.terrainInventory[targetPid] || []),
      currentTerrain,
    ];
    newState.terrain[row][col] = TERRAIN_TYPES.FLAT as TerrainType;
  };

  const handlePlacement = (terrainType: TerrainType) => {
    const unitAtCell = state.board[row][col];
    const isCompatibleWithUnit =
      !unitAtCell || canPlaceUnit(unitAtCell.type, terrainType);

    if (!isCompatibleWithUnit && !isGM) return INVALID_MOVE;

    const playerTerrainInventory = newState.terrainInventory[playerId] || [];
    const terrainIndex = playerTerrainInventory.indexOf(terrainType);
    const isTerrainInInventory = terrainIndex !== -1;

    if (!isGM && !isTerrainInInventory) return INVALID_MOVE;

    const quota = getQuota(mode);
    const currentTerrainCount = countPlacedTerrain(
      newState.terrain,
      playerId,
      mode,
    );
    const isQuotaReached = currentTerrainCount >= quota;

    const currentTerrainAtCell = newState.terrain[row][col];
    const isReplacingFlatTerrain = currentTerrainAtCell === TERRAIN_TYPES.FLAT;

    if (!isGM && isQuotaReached && isReplacingFlatTerrain) {
      return INVALID_MOVE;
    }

    if (!isReplacingFlatTerrain && !isGM) {
      newState.terrainInventory[playerId] = [
        ...(newState.terrainInventory[playerId] || []),
        currentTerrainAtCell,
      ];
    }

    newState.terrain[row][col] = terrainType;

    if (!isGM && isTerrainInInventory) {
      const updatedInv = [...newState.terrainInventory[playerId]];
      updatedInv.splice(terrainIndex, 1);
      newState.terrainInventory[playerId] = updatedInv;
    }
  };

  const currentTerrainAtCell = state.terrain[row][col];
  const isTogglingOff =
    currentTerrainAtCell === type && type !== TERRAIN_TYPES.FLAT;

  if (type === TERRAIN_TYPES.FLAT || isTogglingOff) {
    const res = handleRemoval();
    if (res === INVALID_MOVE) return INVALID_MOVE;
  } else {
    const res = handlePlacement(type);
    if (res === INVALID_MOVE) return INVALID_MOVE;
  }

  return newState;
};
