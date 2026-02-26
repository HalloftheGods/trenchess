import { BOARD_SIZE } from "@constants";
import { PIECES } from "@constants/pieces";
import { TERRAIN_TYPES, CORE_TERRAIN_INTEL } from "@constants/terrain";
import { UNIT_BLUEPRINTS } from "@/core/blueprints/units";
import type { BoardPiece, TerrainType, GameMode } from "@/shared/types";

const { KING, QUEEN, ROOK, BISHOP, KNIGHT, PAWN } = PIECES;

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
      if (pieceAtCell?.player === player && pieceAtCell?.type === KING) {
        kingPosition = [row, col];
        break;
      }
    }
    if (kingPosition) break;
  }

  if (!kingPosition) return true; // Lost state if King is missing

  const [kingRow, kingCol] = kingPosition;

  // 2. Check if any enemy piece can attack kingPosition
  return board.some((boardRow, row) =>
    boardRow.some((cell, col) => {
      if (cell && cell.player !== player) {
        const enemyMoves = getValidMoves(
          row,
          col,
          cell,
          cell.player,
          board,
          terrain,
          mode,
          1,
        );

        return enemyMoves.some(([mr, mc]) => mr === kingRow && mc === kingCol);
      }
      return false;
    }),
  );
};

/**
 * hasAnyValidMoves (Molecule)
 * Returns true if the player has at least one legal move available.
 */
export const hasAnyValidMoves = (
  player: string,
  board: (BoardPiece | null)[][],
  terrain: TerrainType[][],
  mode: GameMode,
): boolean => {
  return board.some((boardRow, row) =>
    boardRow.some((cell, col) => {
      if (cell && cell.player === player) {
        const moves = getValidMoves(row, col, cell, player, board, terrain, mode, 0);
        return moves.length > 0;
      }
      return false;
    }),
  );
};

/**
 * checkCellCompatibility (Atom)
 * Evaluates if a piece can move to or capture on a specific target cell.
 */
const checkCellCompatibility = (
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

/**
 * addStepMoves (Atom)
 * Handles non-sliding move patterns from blueprints.
 */
const addStepMoves = (
  row: number,
  col: number,
  piece: BoardPiece,
  player: string,
  board: (BoardPiece | null)[][],
  terrain: TerrainType[][],
  validMoves: number[][],
  pattern?: (r: number, c: number) => [number, number][],
) => {
  if (!pattern) return;
  pattern(row, col).forEach(([tr, tc]) => {
    checkCellCompatibility(tr, tc, piece, player, board, terrain, validMoves);
  });
};

/**
 * addSlidingMoves (Atom)
 * Handles sliding move patterns in specific directions.
 */
const addSlidingMoves = (
  row: number,
  col: number,
  piece: BoardPiece,
  player: string,
  board: (BoardPiece | null)[][],
  terrain: TerrainType[][],
  validMoves: number[][],
  directions: number[][],
) => {
  directions.forEach(([dr, dc]) => {
    let tr = row + dr;
    let tc = col + dc;
    while (
      checkCellCompatibility(tr, tc, piece, player, board, terrain, validMoves)
    ) {
      const isOccupied = !!board[tr][tc];
      if (isOccupied) break;
      tr += dr;
      tc += dc;
    }
  });
};

/**
 * addPawnMoves (Molecule)
 * Pawns have complex mode-dependent movement.
 */
const addPawnMoves = (
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
      const isTargetInBounds = targetRow >= 0 && targetRow < BOARD_SIZE && targetCol >= 0 && targetCol < BOARD_SIZE;
      const targetPiece = isTargetInBounds ? board[targetRow][targetCol] : null;
      if (targetPiece && targetPiece.player !== player) validMoves.push([targetRow, targetCol]);
    });

    // Backflip Maneuver
    const backflipCol = col - 2 * moveDirection;
    const isBackflipColInBounds = backflipCol >= 0 && backflipCol < BOARD_SIZE;
    const isBackflipClear = isBackflipColInBounds && !board[row][backflipCol];
    if (isBackflipClear) validMoves.push([row, backflipCol]);

    [1, -1].forEach((rowOffset) => {
      const targetRow = row + rowOffset;
      const targetCol = col - 2 * moveDirection;
      const isTargetInBounds = targetRow >= 0 && targetRow < BOARD_SIZE && targetCol >= 0 && targetCol < BOARD_SIZE;
      const targetPiece = isTargetInBounds ? board[targetRow][targetCol] : null;
      if (targetPiece && targetPiece.player !== player) validMoves.push([targetRow, targetCol]);
    });
  } else if (isFourPlayerMode) {
    let rowDir = 0, colDir = 0;
    if (player === "red") { rowDir = 1; colDir = 1; }
    else if (player === "yellow") { rowDir = 1; colDir = -1; }
    else if (player === "green") { rowDir = -1; colDir = 1; }
    else if (player === "blue") { rowDir = -1; colDir = -1; }

    [[rowDir, 0], [0, colDir]].forEach(([dr, dc]) => {
      const tr = row + dr;
      const tc = col + dc;
      if (tr >= 0 && tr < BOARD_SIZE && tc >= 0 && tc < BOARD_SIZE && !board[tr][tc]) validMoves.push([tr, tc]);
    });

    const cr = row + rowDir;
    const cc = col + colDir;
    if (cr >= 0 && cr < BOARD_SIZE && cc >= 0 && cc < BOARD_SIZE) {
      const targetPiece = board[cr][cc];
      if (targetPiece && targetPiece.player !== player) validMoves.push([cr, cc]);
    }

    // Backflip
    [[-2 * rowDir, 0], [0, -2 * colDir]].forEach(([dr, dc]) => {
      const tr = row + dr;
      const tc = col + dc;
      if (tr >= 0 && tr < BOARD_SIZE && tc >= 0 && tc < BOARD_SIZE && !board[tr][tc]) validMoves.push([tr, tc]);
    });
  } else {
    // Standard North-South
    const isNorthPlayer = player === "red" || player === "yellow";
    const moveDirection = isNorthPlayer ? 1 : -1;
    const frontRow = row + moveDirection;

    if (frontRow >= 0 && frontRow < BOARD_SIZE && !board[frontRow][col]) validMoves.push([frontRow, col]);

    [1, -1].forEach((colOffset) => {
      const tr = row + moveDirection;
      const tc = col + colOffset;
      if (tr >= 0 && tr < BOARD_SIZE && tc >= 0 && tc < BOARD_SIZE) {
        const targetPiece = board[tr][tc];
        if (targetPiece && targetPiece.player !== player) validMoves.push([tr, tc]);
      }
    });

    // Backflip
    const backflipRow = row - 2 * moveDirection;
    if (backflipRow >= 0 && backflipRow < BOARD_SIZE && !board[backflipRow][col]) validMoves.push([backflipRow, col]);

    [1, -1].forEach((colOffset) => {
      const tr = row - 2 * moveDirection;
      const tc = col + colOffset;
      if (tr >= 0 && tr < BOARD_SIZE && tc >= 0 && tc < BOARD_SIZE) {
        const targetPiece = board[tr][tc];
        if (targetPiece && targetPiece.player !== player) validMoves.push([tr, tc]);
      }
    });
  }
};

/**
 * addKingMoves (Molecule)
 */
const addKingMoves = (
  row: number,
  col: number,
  piece: BoardPiece,
  player: string,
  board: (BoardPiece | null)[][],
  terrain: TerrainType[][],
  mode: GameMode,
  recursionDepth: number,
  validMoves: number[][],
) => {
  const blueprint = UNIT_BLUEPRINTS[KING];

  // 1. Standard 1-step moves
  addStepMoves(row, col, piece, player, board, terrain, validMoves, blueprint.movePattern);

  // 2. Orthogonal Joust (2-step jumps)
  blueprint.newMovePattern?.(row, col).forEach(([tr, tc]) => {
    const dr = (tr - row) / 2;
    const dc = (tc - col) / 2;
    const midRow = row + dr;
    const midCol = col + dc;

    const midPiece = board[midRow]?.[midCol];
    const isSafeToPass = !midPiece || midPiece.player !== player;

    if (isSafeToPass) {
      if (recursionDepth > 0) {
        checkCellCompatibility(tr, tc, piece, player, board, terrain, validMoves);
      } else {
        const isMidPointGuarded = board.some((boardRow, br) =>
          boardRow.some((cell, bc) => {
            if (cell && cell.player !== player) {
              const enemyMoves = getValidMoves(br, bc, cell, cell.player, board, terrain, mode, recursionDepth + 1);
              return enemyMoves.some(([mr, mc]) => mr === midRow && mc === midCol);
            }
            return false;
          }),
        );

        if (!isMidPointGuarded) {
          checkCellCompatibility(tr, tc, piece, player, board, terrain, validMoves);
        }
      }
    }
  });
};

/**
 * getValidMoves — The definitive tactical calculation for unit movement.
 * Refactored to use UNIT_BLUEPRINTS and provide clean, readable logic.
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
  skipCheck = false,
): number[][] => {
  const validMoves: number[][] = [];
  const { type } = piece;

  if (type === PAWN) {
    addPawnMoves(row, col, player, board, mode, validMoves);
  } else if (type === KNIGHT) {
    addStepMoves(row, col, piece, player, board, terrain, validMoves, UNIT_BLUEPRINTS[KNIGHT].movePattern);
    addStepMoves(row, col, piece, player, board, terrain, validMoves, UNIT_BLUEPRINTS[KNIGHT].newMovePattern);
  } else if (type === BISHOP) {
    addSlidingMoves(row, col, piece, player, board, terrain, validMoves, [[1, 1], [1, -1], [-1, 1], [-1, -1]]);
    addStepMoves(row, col, piece, player, board, terrain, validMoves, UNIT_BLUEPRINTS[BISHOP].newMovePattern);
  } else if (type === ROOK) {
    addSlidingMoves(row, col, piece, player, board, terrain, validMoves, [[0, 1], [0, -1], [1, 0], [-1, 0]]);
    addStepMoves(row, col, piece, player, board, terrain, validMoves, UNIT_BLUEPRINTS[ROOK].newMovePattern);
  } else if (type === QUEEN) {
    addSlidingMoves(row, col, piece, player, board, terrain, validMoves, [
      [0, 1], [0, -1], [1, 0], [-1, 0], [1, 1], [1, -1], [-1, 1], [-1, -1]
    ]);
    addStepMoves(row, col, piece, player, board, terrain, validMoves, UNIT_BLUEPRINTS[QUEEN].newMovePattern);
  } else if (type === KING) {
    addKingMoves(row, col, piece, player, board, terrain, mode, recursionDepth, validMoves);
  }

  // Final Safety Check: Checkmate Prevention
  const isOuterSearch = recursionDepth === 0;
  if (isOuterSearch && !skipCheck) {
    const isSafeMove = ([moveRow, moveCol]: number[]) => {
      const simulatedBoard = board.map((r) => [...r]);
      simulatedBoard[moveRow][moveCol] = { ...piece };
      simulatedBoard[row][col] = null;
      return !isPlayerInCheck(player, simulatedBoard, terrain, mode);
    };
    return validMoves.filter(isSafeMove);
  }

  return validMoves;
};
