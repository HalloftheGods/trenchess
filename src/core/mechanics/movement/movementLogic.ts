import { BOARD_SIZE } from "@/constants";
import { PIECES } from "@/constants";
import { TERRAIN_TYPES } from "@/constants";
import type { BoardPiece, TerrainType, GameMode } from "@/shared/types/game";
import { isPlayerInCheck } from "@/core/mechanics/gameState";

const { KING, QUEEN, ROOK, BISHOP, KNIGHT, PAWN } = PIECES;

/**
 * getValidMoves — The definitive tactical calculation for unit movement.
 * Refactored for Immortal Narrative standards.
 */
export const getValidMoves = (
  row: number,
  col: number,
  piece: BoardPiece,
  player: string,
  board: (BoardPiece | null)[][],
  terrain: TerrainType[][],
  mode: GameMode,
  recursionDepth = 0,
): number[][] => {
  const validMoves: number[][] = [];

  const checkCellCompatibility = (targetRow: number, targetCol: number) => {
    const isWithinBoardBoundaries = targetRow >= 0 && targetRow < BOARD_SIZE && targetCol >= 0 && targetCol < BOARD_SIZE;
    if (!isWithinBoardBoundaries) return false;

    const targetPiece = board[targetRow][targetCol];
    const targetTerrain = terrain[targetRow]?.[targetCol];
    if (!targetTerrain) return false;

    // Tactical Rule: Desert is a dead-end
    if (targetTerrain === TERRAIN_TYPES.DESERT) {
      const isEnemyOrEmpty = !targetPiece || targetPiece.player !== player;
      if (isEnemyOrEmpty) {
        validMoves.push([targetRow, targetCol]);
      }
      return false;
    }

    // Tactical Rule: Sanctuary Blocks
    const isKnightBlockedBySwamp = piece.type === KNIGHT && targetTerrain === TERRAIN_TYPES.SWAMPS;
    const isBishopBlockedBySwamp = piece.type === BISHOP && targetTerrain === TERRAIN_TYPES.SWAMPS;
    const isRookBlockedByForest = piece.type === ROOK && targetTerrain === TERRAIN_TYPES.FORESTS;
    const isKnightBlockedByForest = piece.type === KNIGHT && targetTerrain === TERRAIN_TYPES.FORESTS;
    const isRookBlockedByMountain = piece.type === ROOK && targetTerrain === TERRAIN_TYPES.MOUNTAINS;
    const isBishopBlockedByMountain = piece.type === BISHOP && targetTerrain === TERRAIN_TYPES.MOUNTAINS;

    const isSanctuaryBlocked = isKnightBlockedBySwamp || isBishopBlockedBySwamp || 
                               isRookBlockedByForest || isKnightBlockedByForest || 
                               isRookBlockedByMountain || isBishopBlockedByMountain;

    if (isSanctuaryBlocked) return false;

    if (!targetPiece) {
      validMoves.push([targetRow, targetCol]);
      return true; // Path continues
    } else {
      const isEnemyPiece = targetPiece.player !== player;
      if (isEnemyPiece) {
        validMoves.push([targetRow, targetCol]);
      }
      return false; // Path blocked by inhabitant
    }
  };

  // --- Unit Specific Logic ---

  if (piece.type === PAWN) {
    const isEastWestMode = mode === "2p-ew";
    const isFourPlayerMode = mode === "4p";

    if (isEastWestMode) {
      const direction = player === "green" ? 1 : -1;
      const frontCol = col + direction;
      
      const isPathClear = frontCol >= 0 && frontCol < BOARD_SIZE && !board[row][frontCol];
      if (isPathClear) validMoves.push([row, frontCol]);

      // Diagonal Captures
      [1, -1].forEach((rowOffset) => {
        const targetRow = row + rowOffset;
        const targetCol = col + direction;
        const isEnemyTarget = targetRow >= 0 && targetRow < BOARD_SIZE && 
                              targetCol >= 0 && targetCol < BOARD_SIZE && 
                              board[targetRow][targetCol] && 
                              board[targetRow][targetCol]?.player !== player;
        
        if (isEnemyTarget) validMoves.push([targetRow, targetCol]);
      });

      // Backflip Maneuver
      const backflipCol = col - 2 * direction;
      const isBackflipClear = backflipCol >= 0 && backflipCol < BOARD_SIZE && !board[row][backflipCol];
      if (isBackflipClear) validMoves.push([row, backflipCol]);

      [1, -1].forEach((rowOffset) => {
        const targetRow = row + rowOffset;
        const targetCol = col - 2 * direction;
        const isEnemyTarget = targetRow >= 0 && targetRow < BOARD_SIZE && 
                              targetCol >= 0 && targetCol < BOARD_SIZE && 
                              board[targetRow][targetCol] && 
                              board[targetRow][targetCol]?.player !== player;
        
        if (isEnemyTarget) validMoves.push([targetRow, targetCol]);
      });
    } else if (isFourPlayerMode) {
      let rowDir = 0, colDir = 0;
      if (player === "red") { rowDir = 1; colDir = 1; } 
      else if (player === "yellow") { rowDir = 1; colDir = -1; } 
      else if (player === "green") { rowDir = -1; colDir = 1; } 
      else if (player === "blue") { rowDir = -1; colDir = -1; }

      [[rowDir, 0], [0, colDir]].forEach(([dr, dc]) => {
        const targetRow = row + dr;
        const targetCol = col + dc;
        if (targetRow >= 0 && targetRow < BOARD_SIZE && targetCol >= 0 && targetCol < BOARD_SIZE && !board[targetRow][targetCol]) {
          validMoves.push([targetRow, targetCol]);
        }
      });

      const captureRow = row + rowDir;
      const captureCol = col + colDir;
      if (captureRow >= 0 && captureRow < BOARD_SIZE && captureCol >= 0 && captureCol < BOARD_SIZE && board[captureRow][captureCol] && board[captureRow][captureCol]!.player !== player) {
        validMoves.push([captureRow, captureCol]);
      }

      // Backflip
      [[-2 * rowDir, 0], [0, -2 * colDir]].forEach(([dr, dc]) => {
        const targetRow = row + dr;
        const targetCol = col + dc;
        if (targetRow >= 0 && targetRow < BOARD_SIZE && targetCol >= 0 && targetCol < BOARD_SIZE && !board[targetRow][targetCol]) {
          validMoves.push([targetRow, targetCol]);
        }
      });
    } else {
      // Standard North-South
      const direction = player === "red" || player === "yellow" ? 1 : -1;
      const frontRow = row + direction;
      
      const isPathClear = frontRow >= 0 && frontRow < BOARD_SIZE && !board[frontRow][col];
      if (isPathClear) validMoves.push([frontRow, col]);

      [1, -1].forEach((colOffset) => {
        const targetRow = row + direction;
        const targetCol = col + colOffset;
        const isEnemyTarget = targetRow >= 0 && targetRow < BOARD_SIZE && 
                              targetCol >= 0 && targetCol < BOARD_SIZE && 
                              board[targetRow][targetCol] && 
                              board[targetRow][targetCol]?.player !== player;
        
        if (isEnemyTarget) validMoves.push([targetRow, targetCol]);
      });

      // Backflip
      const backflipRow = row - 2 * direction;
      const isBackflipClear = backflipRow >= 0 && backflipRow < BOARD_SIZE && !board[backflipRow][col];
      if (isBackflipClear) validMoves.push([backflipRow, col]);

      [1, -1].forEach((colOffset) => {
        const targetRow = row - 2 * direction;
        const targetCol = col + colOffset;
        const isEnemyTarget = targetRow >= 0 && targetRow < BOARD_SIZE && 
                              targetCol >= 0 && targetCol < BOARD_SIZE && 
                              board[targetRow][targetCol] && 
                              board[targetRow][targetCol]?.player !== player;
        
        if (isEnemyTarget) validMoves.push([targetRow, targetCol]);
      });
    }
  }

  if (piece.type === KNIGHT || piece.type === QUEEN) {
    const knightLeaps = [
      [-2, -1], [-2, 1], [-1, -2], [-1, 2],
      [1, -2], [1, 2], [2, -1], [2, 1],
    ];

    knightLeaps.forEach(([dr, dc]) => {
      const targetRow = row + dr;
      const targetCol = col + dc;
      if (targetRow >= 0 && targetRow < BOARD_SIZE && targetCol >= 0 && targetCol < BOARD_SIZE) {
        const targetPiece = board[targetRow][targetCol];
        const targetTerrain = terrain[targetRow][targetCol];
        
        const isTerrainBlocked = piece.type === KNIGHT && (targetTerrain === TERRAIN_TYPES.SWAMPS || targetTerrain === TERRAIN_TYPES.FORESTS);
        if (isTerrainBlocked) return;

        if (!targetPiece || targetPiece.player !== player) validMoves.push([targetRow, targetCol]);
      }
    });

    // Elite Jump (Triple Leap)
    const eliteJumps = [[3, 0], [-3, 0], [0, 3], [0, -3]];
    eliteJumps.forEach(([dr, dc]) => {
      const targetRow = row + dr;
      const targetCol = col + dc;
      if (targetRow >= 0 && targetRow < BOARD_SIZE && targetCol >= 0 && targetCol < BOARD_SIZE) {
        const targetPiece = board[targetRow][targetCol];
        const targetTerrain = terrain[targetRow][targetCol];
        const isTerrainBlocked = targetTerrain === TERRAIN_TYPES.SWAMPS || targetTerrain === TERRAIN_TYPES.FORESTS;
        if (isTerrainBlocked) return;

        if (!targetPiece || targetPiece.player !== player) validMoves.push([targetRow, targetCol]);
      }
    });
  }

  if (piece.type === BISHOP || piece.type === QUEEN) {
    const diagonals = [[1, 1], [1, -1], [-1, 1], [-1, -1]];
    diagonals.forEach(([dr, dc]) => {
      let targetRow = row + dr;
      let targetCol = col + dc;
      while (targetRow >= 0 && targetRow < BOARD_SIZE && targetCol >= 0 && targetCol < BOARD_SIZE) {
        const canContinue = checkCellCompatibility(targetRow, targetCol);
        if (!canContinue || board[targetRow][targetCol]) break;
        targetRow += dr;
        targetCol += dc;
      }
    });

    // Seer Leap
    const seerLeaps = [[2, 0], [-2, 0], [0, 2], [0, -2]];
    seerLeaps.forEach(([dr, dc]) => {
      const targetRow = row + dr;
      const targetCol = col + dc;
      if (targetRow >= 0 && targetRow < BOARD_SIZE && targetCol >= 0 && targetCol < BOARD_SIZE) {
        const targetTerrain = terrain[targetRow][targetCol];
        const isTerrainBlocked = targetTerrain === TERRAIN_TYPES.SWAMPS || targetTerrain === TERRAIN_TYPES.MOUNTAINS;
        if (isTerrainBlocked) return;

        const targetPiece = board[targetRow][targetCol];
        if (!targetPiece || targetPiece.player !== player) validMoves.push([targetRow, targetCol]);
      }
    });
  }

  if (piece.type === ROOK || piece.type === QUEEN) {
    const orthogonals = [[0, 1], [0, -1], [1, 0], [-1, 0]];
    orthogonals.forEach(([dr, dc]) => {
      let targetRow = row + dr;
      let targetCol = col + dc;
      while (targetRow >= 0 && targetRow < BOARD_SIZE && targetCol >= 0 && targetCol < BOARD_SIZE) {
        const canContinue = checkCellCompatibility(targetRow, targetCol);
        if (!canContinue || board[targetRow][targetCol]) break;
        targetRow += dr;
        targetCol += dc;
      }
    });

    // Bastion Leap
    const bastionLeaps = [[1, 1], [1, -1], [-1, 1], [-1, -1]];
    bastionLeaps.forEach(([dr, dc]) => {
      const targetRow = row + dr;
      const targetCol = col + dc;
      if (targetRow >= 0 && targetRow < BOARD_SIZE && targetCol >= 0 && targetCol < BOARD_SIZE) {
        const targetTerrain = terrain[targetRow][targetCol];
        const isTerrainBlocked = targetTerrain === TERRAIN_TYPES.FORESTS || targetTerrain === TERRAIN_TYPES.MOUNTAINS;
        if (isTerrainBlocked) return;

        const targetPiece = board[targetRow][targetCol];
        if (!targetPiece || targetPiece.player !== player) validMoves.push([targetRow, targetCol]);
      }
    });
  }

  if (piece.type === KING) {
    const kingDiagonalSteps = [[-1, -1], [-1, 1], [1, -1], [1, 1]];
    kingDiagonalSteps.forEach(([dr, dc]) => {
      const targetRow = row + dr;
      const targetCol = col + dc;
      if (targetRow >= 0 && targetRow < BOARD_SIZE && targetCol >= 0 && targetCol < BOARD_SIZE) {
        if (!board[targetRow][targetCol]) validMoves.push([targetRow, targetCol]);
      }
    });

    const kingOrthogonalJumps = [[0, 1], [0, -1], [1, 0], [-1, 0]];
    kingOrthogonalJumps.forEach(([dr, dc]) => {
      const midRow = row + dr;
      const midCol = col + dc;
      
      const isWithinBounds = midRow >= 0 && midRow < BOARD_SIZE && midCol >= 0 && midCol < BOARD_SIZE;
      if (!isWithinBounds) return;

      const midPiece = board[midRow][midCol];
      const isSafeToPass = !midPiece || midPiece.player !== player;

      if (isSafeToPass) {
        if (recursionDepth > 0) {
          checkCellCompatibility(row + dr * 2, col + dc * 2);
        } else {
          // Tactical Rule: King cannot pass through a guarded square
          const isMidPointGuarded = board.some((r, br) =>
            r.some((cell, bc) => {
              if (!cell || cell.player === player) return false;
              const enemyMoves = getValidMoves(br, bc, cell, cell.player, board, terrain, mode, recursionDepth + 1);
              return enemyMoves.some(([mr, mc]) => mr === midRow && mc === midCol);
            }),
          );

          if (!isMidPointGuarded) {
            checkCellCompatibility(row + dr * 2, col + dc * 2);
          }
        }
      }
    });
  }

  // --- Final Safety Check: Checkmate Prevention ---
  if (recursionDepth === 0) {
    return validMoves.filter(([moveRow, moveCol]) => {
      const simulatedBoard = board.map((r) => [...r]);
      simulatedBoard[moveRow][moveCol] = { ...piece };
      simulatedBoard[row][col] = null;
      return !isPlayerInCheck(player, simulatedBoard, terrain, mode);
    });
  }

  return validMoves;
};
