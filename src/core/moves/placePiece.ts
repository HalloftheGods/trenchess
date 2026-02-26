import { INVALID_MOVE } from "boardgame.io/core";
import { UNIT_POINTS } from "@constants";
import { canPlaceUnit, getCellOwner } from "@/core/setup/setupLogic";
import { resolvePlayerId } from "@/core/setup/coreHelpers";
import { isWithinTerritory } from "./base/territory";
import type { PieceType, TrenchessState } from "@/shared/types";
import type { Ctx } from "boardgame.io";

const handleRemoval = (
  gameState: TrenchessState,
  playerId: string,
  row: number,
  col: number,
) => {
  const currentPiece = gameState.board[row][col];
  if (!currentPiece) return;

  const isOwnPiece = currentPiece.player === playerId;
  if (!isOwnPiece) return;

  if (gameState.isMercenary) {
    if (currentPiece.type === "king") {
      gameState.inventory[playerId].push(currentPiece.type);
    } else {
      const cost = UNIT_POINTS[currentPiece.type] || 0;
      gameState.mercenaryPoints![playerId] += cost;
    }
  } else {
    gameState.inventory[playerId].push(currentPiece.type);
  }

  gameState.board[row][col] = null;
};

const handlePlacement = (
  gameState: TrenchessState,
  playerId: string,
  row: number,
  col: number,
  type: PieceType,
) => {
  const terrainAtCell = gameState.terrain[row][col];
  const isCompatibleWithTerrain = canPlaceUnit(type, terrainAtCell);
  if (!isCompatibleWithTerrain) return INVALID_MOVE;

  let costToDeduct = 0;
  const playerInventory = gameState.inventory[playerId];
  const inventoryIndex = playerInventory?.indexOf(type);
  const isPieceInInventory = inventoryIndex !== -1 && inventoryIndex !== undefined;

  if (gameState.isMercenary) {
    if (type === "king") {
      if (!isPieceInInventory) return INVALID_MOVE;
    } else {
      const cost = UNIT_POINTS[type] || 0;
      if ((gameState.mercenaryPoints?.[playerId] ?? 0) < cost) {
        return INVALID_MOVE;
      }
      costToDeduct = cost;
    }
  } else {
    if (!isPieceInInventory) return INVALID_MOVE;
  }

  const currentPieceAtCell = gameState.board[row][col];
  if (currentPieceAtCell) {
    if (currentPieceAtCell.player !== playerId) return INVALID_MOVE;
    // Refund / return previous piece
    if (gameState.isMercenary) {
      if (currentPieceAtCell.type === "king") {
        gameState.inventory[playerId].push(currentPieceAtCell.type);
      } else {
        const refund = UNIT_POINTS[currentPieceAtCell.type] || 0;
        gameState.mercenaryPoints![playerId] += refund;
      }
    } else {
      gameState.inventory[playerId].push(currentPieceAtCell.type);
    }
  }

  gameState.board[row][col] = { type, player: playerId };
  
  if (gameState.isMercenary) {
    if (type === "king" && isPieceInInventory) {
      gameState.inventory[playerId].splice(inventoryIndex, 1);
    } else if (costToDeduct > 0) {
      gameState.mercenaryPoints![playerId] -= costToDeduct;
    }
  } else {
    if (isPieceInInventory) {
      gameState.inventory[playerId].splice(inventoryIndex, 1);
    }
  }
};

export const placePiece = (
  {
    G: gameState,
    playerID,
    ctx: context,
  }: { G: TrenchessState; playerID?: string; ctx: Ctx },
  row: number,
  col: number,
  type: PieceType | null,
  explicitPid?: string,
  isGM?: boolean,
) => {
  let playerId = resolvePlayerId(gameState, context, playerID, explicitPid, isGM);

  if (isGM) {
    const cellOwner = getCellOwner(row, col, gameState.mode);
    if (cellOwner) {
      playerId = cellOwner;
    }
  }

  if (!playerId) return INVALID_MOVE;

  const isPlayerPlacingInOwnTerritory = isWithinTerritory(
    playerId,
    gameState.mode,
    [row, col],
  );
  
  if (!isGM && !isPlayerPlacingInOwnTerritory) return INVALID_MOVE;

  if (type === null) {
    handleRemoval(gameState, playerId, row, col);
    return;
  }

  return handlePlacement(gameState, playerId, row, col, type);
};
