import { BOARD_SIZE } from "@constants";
import { PIECES } from "@constants/pieces";
import { CORE_TERRAIN_INTEL } from "@constants/terrain";
import type { BoardPiece, TerrainType, GameMode, PieceType } from "@tc.types";

const { KING, QUEEN, ROOK, BISHOP, KNIGHT, PAWN } = PIECES;

/**
 * isCellGuarded (Atom)
 * Targeted threat detection. Checks if a specific cell is under attack by any enemy piece.
 * This is used for check detection and King move safety (e.g. jousting).
 */
export const isCellGuarded = (
  targetRow: number,
  targetCol: number,
  defender: string,
  board: (BoardPiece | null)[][],
  terrain: TerrainType[][],
  mode: GameMode,
): boolean => {
  if (
    targetRow < 0 ||
    targetRow >= BOARD_SIZE ||
    targetCol < 0 ||
    targetCol >= BOARD_SIZE
  ) {
    return false;
  }

  // 1. Find King/Defender details if relevant
  const pieceAtTarget = board[targetRow][targetCol];
  const targetTerrain = terrain[targetRow][targetCol];

  // 2. Sanctuary Protection Check
  // If there is a piece at the target and it is in sanctuary, it's NOT guarded (captured).
  if (pieceAtTarget && pieceAtTarget.player === defender) {
    const terrainIntel = CORE_TERRAIN_INTEL[targetTerrain];
    if (terrainIntel?.sanctuaryUnits.includes(pieceAtTarget.type)) {
      return false;
    }
  }

  // Helper to check for specific attackers
  const isEnemyAt = (r: number, c: number, type?: PieceType | PieceType[]) => {
    const p = board[r]?.[c];
    if (!p || p.player === defender) return false;
    if (!type) return true;
    const types = Array.isArray(type) ? type : [type];
    return types.includes(p.type);
  };

  // 3. Knight Threats (L-shapes)
  const knightJumps = [
    [-2, -1],
    [-2, 1],
    [-1, -2],
    [-1, 2],
    [1, -2],
    [1, 2],
    [2, -1],
    [2, 1],
  ];
  const hasKnightThreat = knightJumps.some(([dr, dc]) =>
    isEnemyAt(targetRow + dr, targetCol + dc, KNIGHT as PieceType),
  );
  if (hasKnightThreat) return true;

  // 4. Sliding Threats (Queen, Rook, Bishop)
  const slidingDirections = [
    { dir: [0, 1], types: [ROOK, QUEEN] },
    { dir: [0, -1], types: [ROOK, QUEEN] },
    { dir: [1, 0], types: [ROOK, QUEEN] },
    { dir: [-1, 0], types: [ROOK, QUEEN] },
    { dir: [1, 1], types: [BISHOP, QUEEN] },
    { dir: [1, -1], types: [BISHOP, QUEEN] },
    { dir: [-1, 1], types: [BISHOP, QUEEN] },
    { dir: [-1, -1], types: [BISHOP, QUEEN] },
  ];

  const hasSlidingThreat = slidingDirections.some(({ dir, types }) => {
    let r = targetRow + dir[0];
    let c = targetCol + dir[1];
    while (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE) {
      const p = board[r][c];
      if (p) {
        if (p.player !== defender && types.includes(p.type as PieceType))
          return true;
        break; // Blocked by any piece
      }
      r += dir[0];
      c += dir[1];
    }
    return false;
  });
  if (hasSlidingThreat) return true;

  // 5. King Threats (1-step adjacents)
  const adjacents = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
    [1, 1],
    [1, -1],
    [-1, 1],
    [-1, -1],
  ];
  const hasKingThreat = adjacents.some(([dr, dc]) =>
    isEnemyAt(targetRow + dr, targetCol + dc, KING as PieceType),
  );
  if (hasKingThreat) return true;

  // 6. Pawn Threats (Mode dependent directions)
  if (mode === "2p-ns") {
    // If defender is North (red/yellow), enemies are coming from South (up)
    // and vice versa.
    // Wait, if defender is "red", its front is "down" (r+1).
    // So threats to "red" come from "down" (r+1).
    const isNorthDefender = defender === "red" || defender === "yellow";
    const attackRow = isNorthDefender ? targetRow + 1 : targetRow - 1;
    if (isEnemyAt(attackRow, targetCol - 1, PAWN as PieceType)) return true;
    if (isEnemyAt(attackRow, targetCol + 1, PAWN as PieceType)) return true;
  } else if (mode === "2p-ew") {
    const isEastDefender = defender === "green";
    const attackCol = isEastDefender ? targetCol + 1 : targetCol - 1;
    if (isEnemyAt(targetRow - 1, attackCol, PAWN as PieceType)) return true;
    if (isEnemyAt(targetRow + 1, attackCol, PAWN as PieceType)) return true;
  } else if (mode === "4p") {
    // This is trickier. For now, check all 4 diagonals for any Pawn.
    // Actually, each pawn color has specific capture dirs.
    // Red: r+1, c+1
    // Yellow: r+1, c-1
    // Green: r-1, c+1
    // Blue: r-1, c-1
    // So to check if target cell (r,c) is guarded by an enemy Pawn:
    if (isEnemyAt(targetRow - 1, targetCol - 1, PAWN as PieceType)) {
      const p = board[targetRow - 1][targetCol - 1];
      if (p?.player === "red") return true;
    }
    if (isEnemyAt(targetRow - 1, targetCol + 1, PAWN as PieceType)) {
      const p = board[targetRow - 1][targetCol + 1];
      if (p?.player === "yellow") return true;
    }
    if (isEnemyAt(targetRow + 1, targetCol - 1, PAWN as PieceType)) {
      const p = board[targetRow + 1][targetCol - 1];
      if (p?.player === "green") return true;
    }
    if (isEnemyAt(targetRow + 1, targetCol + 1, PAWN as PieceType)) {
      const p = board[targetRow + 1][targetCol + 1];
      if (p?.player === "blue") return true;
    }
  }

  return false;
};
