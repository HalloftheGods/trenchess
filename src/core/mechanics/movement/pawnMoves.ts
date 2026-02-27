import { BOARD_SIZE } from "@constants";
import type { BoardPiece, GameMode } from "@/shared/types";

/**
 * calculatePawnMoves (Molecule)
 * Pawns have complex mode-dependent movement.
 */
export const calculatePawnMoves = (
  row: number,
  col: number,
  player: string,
  board: (BoardPiece | null)[][],
  mode: GameMode,
  validMoves: number[][],
) => {
  const isEastWestMode = mode === "2p-ew";
  const isFourPlayerMode = mode === "4p";

  if (isEastWestMode) {
    const isGreenPlayer = player === "green";
    const moveDirection = isGreenPlayer ? 1 : -1;
    const frontCol = col + moveDirection;

    const isFrontInBounds = frontCol >= 0 && frontCol < BOARD_SIZE;
    const isFrontClear = isFrontInBounds && !board[row][frontCol];
    if (isFrontClear) validMoves.push([row, frontCol]);

    // Diagonal Captures
    [1, -1].forEach((rowOffset) => {
      const targetRow = row + rowOffset;
      const targetCol = col + moveDirection;
      const isTargetInBounds =
        targetRow >= 0 &&
        targetRow < BOARD_SIZE &&
        targetCol >= 0 &&
        targetCol < BOARD_SIZE;
      const targetPiece = isTargetInBounds ? board[targetRow][targetCol] : null;
      if (targetPiece && targetPiece.player !== player)
        validMoves.push([targetRow, targetCol]);
    });

    // Backflip Maneuver
    const backflipCol = col - 2 * moveDirection;
    const isBackflipColInBounds = backflipCol >= 0 && backflipCol < BOARD_SIZE;
    const isBackflipClear = isBackflipColInBounds && !board[row][backflipCol];
    if (isBackflipClear) validMoves.push([row, backflipCol]);

    [1, -1].forEach((rowOffset) => {
      const targetRow = row + rowOffset;
      const targetCol = col - 2 * moveDirection;
      const isTargetInBounds =
        targetRow >= 0 &&
        targetRow < BOARD_SIZE &&
        targetCol >= 0 &&
        targetCol < BOARD_SIZE;
      const targetPiece = isTargetInBounds ? board[targetRow][targetCol] : null;
      if (targetPiece && targetPiece.player !== player)
        validMoves.push([targetRow, targetCol]);
    });
  } else if (isFourPlayerMode) {
    let rowDir = 0,
      colDir = 0;
    if (player === "red") {
      rowDir = 1;
      colDir = 1;
    } else if (player === "yellow") {
      rowDir = 1;
      colDir = -1;
    } else if (player === "green") {
      rowDir = -1;
      colDir = 1;
    } else if (player === "blue") {
      rowDir = -1;
      colDir = -1;
    }

    [
      [rowDir, 0],
      [0, colDir],
    ].forEach(([dr, dc]) => {
      const tr = row + dr;
      const tc = col + dc;
      if (
        tr >= 0 &&
        tr < BOARD_SIZE &&
        tc >= 0 &&
        tc < BOARD_SIZE &&
        !board[tr][tc]
      )
        validMoves.push([tr, tc]);
    });

    const cr = row + rowDir;
    const cc = col + colDir;
    if (cr >= 0 && cr < BOARD_SIZE && cc >= 0 && cc < BOARD_SIZE) {
      const targetPiece = board[cr][cc];
      if (targetPiece && targetPiece.player !== player)
        validMoves.push([cr, cc]);
    }

    // Backflip
    [
      [-2 * rowDir, 0],
      [0, -2 * colDir],
    ].forEach(([dr, dc]) => {
      const tr = row + dr;
      const tc = col + dc;
      if (
        tr >= 0 &&
        tr < BOARD_SIZE &&
        tc >= 0 &&
        tc < BOARD_SIZE &&
        !board[tr][tc]
      )
        validMoves.push([tr, tc]);
    });
  } else {
    // Standard North-South
    const isNorthPlayer = player === "red" || player === "yellow";
    const moveDirection = isNorthPlayer ? 1 : -1;
    const frontRow = row + moveDirection;

    if (frontRow >= 0 && frontRow < BOARD_SIZE && !board[frontRow][col])
      validMoves.push([frontRow, col]);

    [1, -1].forEach((colOffset) => {
      const tr = row + moveDirection;
      const tc = col + colOffset;
      if (tr >= 0 && tr < BOARD_SIZE && tc >= 0 && tc < BOARD_SIZE) {
        const targetPiece = board[tr][tc];
        if (targetPiece && targetPiece.player !== player)
          validMoves.push([tr, tc]);
      }
    });

    // Backflip
    const backflipRow = row - 2 * moveDirection;
    if (
      backflipRow >= 0 &&
      backflipRow < BOARD_SIZE &&
      !board[backflipRow][col]
    )
      validMoves.push([backflipRow, col]);

    [1, -1].forEach((colOffset) => {
      const tr = row - 2 * moveDirection;
      const tc = col + colOffset;
      if (tr >= 0 && tr < BOARD_SIZE && tc >= 0 && tc < BOARD_SIZE) {
        const targetPiece = board[tr][tc];
        if (targetPiece && targetPiece.player !== player)
          validMoves.push([tr, tc]);
      }
    });
  }
};
