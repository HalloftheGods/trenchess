import { INVALID_MOVE } from "boardgame.io/core";
import { canPlaceUnit, getPlayerCells, getCellOwner } from "@/core/setup/setupLogic";
import { resolvePlayerId } from "@/core/setup/coreHelpers";
import type { PieceType, TrenchessState, GameMode } from "@/shared/types";
import type { Ctx } from "boardgame.io";

const isWithinTerritory = (
  playerId: string,
  mode: GameMode,
  row: number,
  col: number,
): boolean => {
  const myCells = getPlayerCells(playerId, mode);
  
  const isTargetCellInMyCells = myCells.some(
    ([cellRow, cellCol]) => {
      const isRowMatch = cellRow === row;
      const isColMatch = cellCol === col;
      return isRowMatch && isColMatch;
    },
  );
  
  return isTargetCellInMyCells;
};

const handleRemoval = (
  gameState: TrenchessState,
  playerId: string,
  row: number,
  col: number,
) => {
  const currentPiece = gameState.board[row][col];
  
  const hasPieceAtCell = !!currentPiece;
  const isOwnPiece = hasPieceAtCell && currentPiece!.player === playerId;
  
  const isRemovingOwnPiece = isOwnPiece;
  if (!isRemovingOwnPiece) return;

  gameState.inventory[playerId].push(currentPiece!.type);
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

  const playerInventory = gameState.inventory[playerId];
  const inventoryIndex = playerInventory?.indexOf(type);
  
  const isIndexValid = inventoryIndex !== -1;
  const isInventoryExists = inventoryIndex !== undefined;
  const isPieceInInventory = isIndexValid && isInventoryExists;
  
  if (!isPieceInInventory) return INVALID_MOVE;

  const currentPieceAtCell = gameState.board[row][col];
  const hasPieceAtCell = !!currentPieceAtCell;
  const isOwnPieceAtCell = hasPieceAtCell && currentPieceAtCell!.player === playerId;
  
  const isSwappingWithExistingOwnPiece = isOwnPieceAtCell;
  if (isSwappingWithExistingOwnPiece) {
    gameState.inventory[playerId].push(currentPieceAtCell!.type);
  }

  gameState.board[row][col] = { type, player: playerId };
  gameState.inventory[playerId].splice(inventoryIndex, 1);
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
  let playerId = resolvePlayerId(gameState, context, playerID, explicitPid);

  if (isGM) {
    const cellOwner = getCellOwner(row, col, gameState.mode);
    if (cellOwner) {
      playerId = cellOwner;
    }
  }

  const hasPlayerId = !!playerId;
  if (!hasPlayerId) return INVALID_MOVE;

  const isPlayerPlacingInOwnTerritory = isWithinTerritory(
    playerId!,
    gameState.mode,
    row,
    col,
  );
  
  if (!isGM && !isPlayerPlacingInOwnTerritory) return INVALID_MOVE;

  const isRemovingPiece = type === null;
  if (isRemovingPiece) {
    handleRemoval(gameState, playerId!, row, col);
    return;
  }

  const isPlacingPiece = !isRemovingPiece;
  if (isPlacingPiece) {
    return handlePlacement(gameState, playerId!, row, col, type!);
  }
};
