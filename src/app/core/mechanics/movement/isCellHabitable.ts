import { BOARD_SIZE } from "@constants";
import { TERRAIN_TYPES, CORE_TERRAIN_INTEL } from "@constants/terrain";
import type { BoardPiece, TerrainType } from "@tc.types";

/**
 * isCellHabitable (Atom)
 * Evaluates if a piece can move to or capture on a specific target cell.
 */
export const isCellHabitable = (
  targetRow: number,
  targetCol: number,
  piece: BoardPiece,
  player: string,
  board: (BoardPiece | null)[][],
  terrain: TerrainType[][],
  validMoves: number[][],
): boolean => {
  const isWithinBoard =
    targetRow >= 0 &&
    targetRow < BOARD_SIZE &&
    targetCol >= 0 &&
    targetCol < BOARD_SIZE;

  if (!isWithinBoard) return false;

  const targetPiece = board[targetRow][targetCol];
  const targetTerrain = terrain[targetRow][targetCol];

  // 1. Terrain Blocking
  const terrainIntel = CORE_TERRAIN_INTEL[targetTerrain];
  const isBlockedByTerrain = terrainIntel?.blockedUnits.includes(piece.type);
  if (isBlockedByTerrain) return false;

  // 2. Desert Special Rule: Cannot pass through, but can end/capture there.
  if (targetTerrain === TERRAIN_TYPES.DESERT) {
    const isEnemyOrEmpty = !targetPiece || targetPiece.player !== player;
    if (isEnemyOrEmpty) validMoves.push([targetRow, targetCol]);
    return false; // Path stops at desert
  }

  // 3. Occupancy Check
  const isOccupied = !!targetPiece;
  if (!isOccupied) {
    validMoves.push([targetRow, targetCol]);
    return true; // Path continues
  }

  const isEnemyPiece = targetPiece!.player !== player;
  if (isEnemyPiece) {
    validMoves.push([targetRow, targetCol]);
  }

  return false; // Path blocked by inhabitant
};
