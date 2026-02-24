import { BOARD_SIZE } from "@/constants";
import { PIECES } from "@/constants";
import type { BoardPiece, TerrainType, GameMode } from "@/shared/types";
import { getValidMoves } from "@/core/mechanics/movement/movementLogic";

const { KING } = PIECES;

/**
 * isPlayerInCheck (Molecule)
 * Checks if the current player's Commander (King) is under threat from any enemy unit.
 */
export const isPlayerInCheck = (
  player: string,
  board: (BoardPiece | null)[][],
  terrain: TerrainType[][],
  mode: GameMode,
): boolean => {
  // 1. Find King (Commander)
  let kingPosition: [number, number] | null = null;
  
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const pieceAtCell = board[row][col];
      const isOccupied = !!pieceAtCell;
      const isOwnPiece = isOccupied && pieceAtCell!.player === player;
      const isKing = isOwnPiece && pieceAtCell!.type === KING;
      
      if (isKing) {
        kingPosition = [row, col];
        break;
      }
    }
    const isKingFound = !!kingPosition;
    if (isKingFound) break;
  }

  const isKingLost = !kingPosition;
  if (isKingLost) return true; // Lost state

  const [kingRow, kingCol] = kingPosition!;

  // 2. Check if any enemy piece can attack kingPosition
  const isAnyEnemyAttackingKing = board.some((boardRow, row) =>
    boardRow.some((cell, col) => {
      const hasPieceAtCell = !!cell;
      const isEnemyPiece = hasPieceAtCell && cell!.player !== player;
      
      if (isEnemyPiece) {
        // Get their raw moves (recursionDepth 1 to skip own checkmate filtering)
        const enemyMoves = getValidMoves(
          row,
          col,
          cell!,
          cell!.player,
          board,
          terrain,
          mode,
          1,
        );
        
        const canReachKing = enemyMoves.some(([moveRow, moveCol]) => {
          const isRowMatch = moveRow === kingRow;
          const isColMatch = moveCol === kingCol;
          return isRowMatch && isColMatch;
        });
        
        return canReachKing;
      }
      return false;
    }),
  );
  
  return isAnyEnemyAttackingKing;
};

/**
 * hasAnyValidMoves (Molecule)
 * Returns true if the player has at least one legal move available.
 * Used for stalemate and checkmate detection.
 */
export const hasAnyValidMoves = (
  player: string,
  board: (BoardPiece | null)[][],
  terrain: TerrainType[][],
  mode: GameMode,
): boolean => {
  const canPerformAnyAction = board.some((boardRow, row) =>
    boardRow.some((cell, col) => {
      const hasPieceAtCell = !!cell;
      const isOwnPiece = hasPieceAtCell && cell!.player === player;
      
      if (isOwnPiece) {
        const moves = getValidMoves(
          row,
          col,
          cell!,
          player,
          board,
          terrain,
          mode,
          0,
        );
        
        const hasMovesAvailable = moves.length > 0;
        return hasMovesAvailable;
      }
      return false;
    }),
  );
  
  return canPerformAnyAction;
};
