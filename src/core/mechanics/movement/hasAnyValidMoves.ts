import type { BoardPiece, TerrainType, GameMode } from "@/shared/types";

/**
 * hasAnyValidMoves (Molecule)
 * Returns true if the player has at least one legal move available.
 */
export const hasAnyValidMoves = (
  player: string,
  board: (BoardPiece | null)[][],
  terrain: TerrainType[][],
  mode: GameMode,
  getValidMoves: (
    row: number,
    col: number,
    piece: BoardPiece,
    player: string,
    board: (BoardPiece | null)[][],
    terrain: TerrainType[][],
    mode: GameMode,
    recursionDepth: number,
  ) => number[][],
): boolean => {
  const hasValidMovesAtCell = (boardRow: (BoardPiece | null)[], row: number) =>
    boardRow.some((cell, col) => {
      const isOwnedPiece = cell && cell.player === player;
      if (!isOwnedPiece) return false;

      const moves = getValidMoves(
        row,
        col,
        cell,
        player,
        board,
        terrain,
        mode,
        0,
      );
      return moves.length > 0;
    });

  return board.some(hasValidMovesAtCell);
};
