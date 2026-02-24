import { BOARD_SIZE } from "@/constants";
import { PIECES } from "@/constants/pieces";
import { TERRAIN_TYPES } from "@/constants/terrain";
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
  const isRowInBounds = targetRow >= 0 && targetRow < BOARD_SIZE;
  const isColInBounds = targetCol >= 0 && targetCol < BOARD_SIZE;
  const isWithinBoardBoundaries = isRowInBounds && isColInBounds;

  if (!isWithinBoardBoundaries) return false;

  const targetPiece = board[targetRow][targetCol];
  const targetTerrain = terrain[targetRow]?.[targetCol];
  if (!targetTerrain) return false;

  const isDesert = targetTerrain === TERRAIN_TYPES.DESERT;
  if (isDesert) {
    const isOccupied = !!targetPiece;
    const isEnemyAtCell = isOccupied && targetPiece!.player !== player;
    const isCellEmpty = !isOccupied;

    const isEnemyOrEmpty = isCellEmpty || isEnemyAtCell;
    if (isEnemyOrEmpty) {
      validMoves.push([targetRow, targetCol]);
    }
    return false;
  }

  const isKnight = piece.type === KNIGHT;
  const isBishop = piece.type === BISHOP;
  const isRook = piece.type === ROOK;

  const isSwamps = targetTerrain === TERRAIN_TYPES.SWAMPS;
  const isForests = targetTerrain === TERRAIN_TYPES.FORESTS;
  const isMountains = targetTerrain === TERRAIN_TYPES.MOUNTAINS;

  const isKnightBlockedBySwamp = isKnight && isSwamps;
  const isBishopBlockedBySwamp = isBishop && isSwamps;
  const isRookBlockedByForest = isRook && isForests;
  const isKnightBlockedByForest = isKnight && isForests;
  const isRookBlockedByMountain = isRook && isMountains;
  const isBishopBlockedByMountain = isBishop && isMountains;

  const isSanctuaryBlocked =
    isKnightBlockedBySwamp ||
    isBishopBlockedBySwamp ||
    isRookBlockedByForest ||
    isKnightBlockedByForest ||
    isRookBlockedByMountain ||
    isBishopBlockedByMountain;

  if (isSanctuaryBlocked) return false;

  const isOccupied = !!targetPiece;
  if (!isOccupied) {
    validMoves.push([targetRow, targetCol]);
    return true; // Path continues
  } else {
    const isEnemyPiece = targetPiece!.player !== player;
    if (isEnemyPiece) {
      validMoves.push([targetRow, targetCol]);
    }
    return false; // Path blocked by inhabitant
  }
};

/**
 * addPawnMoves (Molecule)
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

      const isTargetRowInBounds = targetRow >= 0 && targetRow < BOARD_SIZE;
      const isTargetColInBounds = targetCol >= 0 && targetCol < BOARD_SIZE;
      const isTargetInBounds = isTargetRowInBounds && isTargetColInBounds;

      const targetPiece = isTargetInBounds ? board[targetRow][targetCol] : null;
      const isEnemyTarget = !!targetPiece && targetPiece.player !== player;

      if (isEnemyTarget) validMoves.push([targetRow, targetCol]);
    });

    // Backflip Maneuver
    const backflipCol = col - 2 * moveDirection;
    const isBackflipColInBounds = backflipCol >= 0 && backflipCol < BOARD_SIZE;
    const isBackflipClear = isBackflipColInBounds && !board[row][backflipCol];
    if (isBackflipClear) validMoves.push([row, backflipCol]);

    [1, -1].forEach((rowOffset) => {
      const targetRow = row + rowOffset;
      const targetCol = col - 2 * moveDirection;

      const isTargetRowInBounds = targetRow >= 0 && targetRow < BOARD_SIZE;
      const isTargetColInBounds = targetCol >= 0 && targetCol < BOARD_SIZE;
      const isTargetInBounds = isTargetRowInBounds && isTargetColInBounds;

      const targetPiece = isTargetInBounds ? board[targetRow][targetCol] : null;
      const isEnemyTarget = !!targetPiece && targetPiece.player !== player;

      if (isEnemyTarget) validMoves.push([targetRow, targetCol]);
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
      const targetRow = row + dr;
      const targetCol = col + dc;

      const isTargetRowInBounds = targetRow >= 0 && targetRow < BOARD_SIZE;
      const isTargetColInBounds = targetCol >= 0 && targetCol < BOARD_SIZE;
      const isTargetInBounds = isTargetRowInBounds && isTargetColInBounds;

      const isCellClear = isTargetInBounds && !board[targetRow][targetCol];
      if (isCellClear) validMoves.push([targetRow, targetCol]);
    });

    const captureRow = row + rowDir;
    const captureCol = col + colDir;
    const isCaptureRowInBounds = captureRow >= 0 && captureRow < BOARD_SIZE;
    const isCaptureColInBounds = captureCol >= 0 && captureCol < BOARD_SIZE;
    const isCaptureInBounds = isCaptureRowInBounds && isCaptureColInBounds;

    const targetPiece = isCaptureInBounds
      ? board[captureRow][captureCol]
      : null;
    const isEnemyTarget = !!targetPiece && targetPiece.player !== player;
    if (isEnemyTarget) validMoves.push([captureRow, captureCol]);

    // Backflip
    [
      [-2 * rowDir, 0],
      [0, -2 * colDir],
    ].forEach(([dr, dc]) => {
      const targetRow = row + dr;
      const targetCol = col + dc;

      const isTargetRowInBounds = targetRow >= 0 && targetRow < BOARD_SIZE;
      const isTargetColInBounds = targetCol >= 0 && targetCol < BOARD_SIZE;
      const isTargetInBounds = isTargetRowInBounds && isTargetColInBounds;

      const isCellClear = isTargetInBounds && !board[targetRow][targetCol];
      if (isCellClear) validMoves.push([targetRow, targetCol]);
    });
  } else {
    // Standard North-South
    const isNorthPlayer = player === "red" || player === "yellow";
    const moveDirection = isNorthPlayer ? 1 : -1;
    const frontRow = row + moveDirection;

    const isFrontRowInBounds = frontRow >= 0 && frontRow < BOARD_SIZE;
    const isPathClear = isFrontRowInBounds && !board[frontRow][col];
    if (isPathClear) validMoves.push([frontRow, col]);

    [1, -1].forEach((colOffset) => {
      const targetRow = row + moveDirection;
      const targetCol = col + colOffset;

      const isTargetRowInBounds = targetRow >= 0 && targetRow < BOARD_SIZE;
      const isTargetColInBounds = targetCol >= 0 && targetCol < BOARD_SIZE;
      const isTargetInBounds = isTargetRowInBounds && isTargetColInBounds;

      const targetPiece = isTargetInBounds ? board[targetRow][targetCol] : null;
      const isEnemyTarget = !!targetPiece && targetPiece.player !== player;

      if (isEnemyTarget) validMoves.push([targetRow, targetCol]);
    });

    // Backflip
    const backflipRow = row - 2 * moveDirection;
    const isBackflipRowInBounds = backflipRow >= 0 && backflipRow < BOARD_SIZE;
    const isBackflipClear = isBackflipRowInBounds && !board[backflipRow][col];
    if (isBackflipClear) validMoves.push([backflipRow, col]);

    [1, -1].forEach((colOffset) => {
      const targetRow = row - 2 * moveDirection;
      const targetCol = col + colOffset;

      const isTargetRowInBounds = targetRow >= 0 && targetRow < BOARD_SIZE;
      const isTargetColInBounds = targetCol >= 0 && targetCol < BOARD_SIZE;
      const isTargetInBounds = isTargetRowInBounds && isTargetColInBounds;

      const targetPiece = isTargetInBounds ? board[targetRow][targetCol] : null;
      const isEnemyTarget = !!targetPiece && targetPiece.player !== player;

      if (isEnemyTarget) validMoves.push([targetRow, targetCol]);
    });
  }
};

/**
 * addKnightMoves (Molecule)
 */
const addKnightMoves = (
  row: number,
  col: number,
  piece: BoardPiece,
  player: string,
  board: (BoardPiece | null)[][],
  terrain: TerrainType[][],
  validMoves: number[][],
) => {
  const knightLeaps = [
    [-2, -1],
    [-2, 1],
    [-1, -2],
    [-1, 2],
    [1, -2],
    [1, 2],
    [2, -1],
    [2, 1],
  ];

  knightLeaps.forEach(([dr, dc]) => {
    const targetRow = row + dr;
    const targetCol = col + dc;

    const isTargetRowInBounds = targetRow >= 0 && targetRow < BOARD_SIZE;
    const isTargetColInBounds = targetCol >= 0 && targetCol < BOARD_SIZE;
    const isTargetInBounds = isTargetRowInBounds && isTargetColInBounds;

    if (isTargetInBounds) {
      const targetPiece = board[targetRow][targetCol];
      const targetTerrain = terrain[targetRow][targetCol];

      const isKnight = piece.type === KNIGHT;
      const isSwamps = targetTerrain === TERRAIN_TYPES.SWAMPS;
      const isForests = targetTerrain === TERRAIN_TYPES.FORESTS;
      const isTerrainBlocked = isKnight && (isSwamps || isForests);

      if (isTerrainBlocked) return;

      const isOccupied = !!targetPiece;
      const isOwnPiece = isOccupied && targetPiece!.player === player;
      const isEnemyOrEmpty = !isOwnPiece;

      if (isEnemyOrEmpty) validMoves.push([targetRow, targetCol]);
    }
  });

  // Elite Jump (Triple Leap)
  const eliteJumps = [
    [3, 0],
    [-3, 0],
    [0, 3],
    [0, -3],
  ];
  eliteJumps.forEach(([dr, dc]) => {
    const targetRow = row + dr;
    const targetCol = col + dc;

    const isTargetRowInBounds = targetRow >= 0 && targetRow < BOARD_SIZE;
    const isTargetColInBounds = targetCol >= 0 && targetCol < BOARD_SIZE;
    const isTargetInBounds = isTargetRowInBounds && isTargetColInBounds;

    if (isTargetInBounds) {
      const targetPiece = board[targetRow][targetCol];
      const targetTerrain = terrain[targetRow][targetCol];

      const isSwamps = targetTerrain === TERRAIN_TYPES.SWAMPS;
      const isForests = targetTerrain === TERRAIN_TYPES.FORESTS;
      const isTerrainBlocked = isSwamps || isForests;

      if (isTerrainBlocked) return;

      const isOccupied = !!targetPiece;
      const isOwnPiece = isOccupied && targetPiece!.player === player;
      const isEnemyOrEmpty = !isOwnPiece;

      if (isEnemyOrEmpty) validMoves.push([targetRow, targetCol]);
    }
  });
};

/**
 * addBishopMoves (Molecule)
 */
const addBishopMoves = (
  row: number,
  col: number,
  piece: BoardPiece,
  player: string,
  board: (BoardPiece | null)[][],
  terrain: TerrainType[][],
  validMoves: number[][],
) => {
  const diagonals = [
    [1, 1],
    [1, -1],
    [-1, 1],
    [-1, -1],
  ];
  diagonals.forEach(([dr, dc]) => {
    let targetRow = row + dr;
    let targetCol = col + dc;

    while (true) {
      const isRowInBounds = targetRow >= 0 && targetRow < BOARD_SIZE;
      const isColInBounds = targetCol >= 0 && targetCol < BOARD_SIZE;
      const isWithinBoard = isRowInBounds && isColInBounds;
      if (!isWithinBoard) break;

      const canContinue = checkCellCompatibility(
        targetRow,
        targetCol,
        piece,
        player,
        board,
        terrain,
        validMoves,
      );

      const isOccupied = !!board[targetRow][targetCol];
      if (!canContinue || isOccupied) break;

      targetRow += dr;
      targetCol += dc;
    }
  });

  // Seer Leap
  const seerLeaps = [
    [2, 0],
    [-2, 0],
    [0, 2],
    [0, -2],
  ];
  seerLeaps.forEach(([dr, dc]) => {
    const targetRow = row + dr;
    const targetCol = col + dc;

    const isTargetRowInBounds = targetRow >= 0 && targetRow < BOARD_SIZE;
    const isTargetColInBounds = targetCol >= 0 && targetCol < BOARD_SIZE;
    const isTargetInBounds = isTargetRowInBounds && isTargetColInBounds;

    if (isTargetInBounds) {
      const targetTerrain = terrain[targetRow][targetCol];
      const isSwamps = targetTerrain === TERRAIN_TYPES.SWAMPS;
      const isMountains = targetTerrain === TERRAIN_TYPES.MOUNTAINS;
      const isTerrainBlocked = isSwamps || isMountains;

      if (isTerrainBlocked) return;

      const targetPiece = board[targetRow][targetCol];
      const isOccupied = !!targetPiece;
      const isOwnPiece = isOccupied && targetPiece!.player === player;
      const isEnemyOrEmpty = !isOwnPiece;

      if (isEnemyOrEmpty) validMoves.push([targetRow, targetCol]);
    }
  });
};

/**
 * addRookMoves (Molecule)
 */
const addRookMoves = (
  row: number,
  col: number,
  piece: BoardPiece,
  player: string,
  board: (BoardPiece | null)[][],
  terrain: TerrainType[][],
  validMoves: number[][],
) => {
  const orthogonals = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
  ];
  orthogonals.forEach(([dr, dc]) => {
    let targetRow = row + dr;
    let targetCol = col + dc;

    while (true) {
      const isRowInBounds = targetRow >= 0 && targetRow < BOARD_SIZE;
      const isColInBounds = targetCol >= 0 && targetCol < BOARD_SIZE;
      const isWithinBoard = isRowInBounds && isColInBounds;
      if (!isWithinBoard) break;

      const canContinue = checkCellCompatibility(
        targetRow,
        targetCol,
        piece,
        player,
        board,
        terrain,
        validMoves,
      );

      const isOccupied = !!board[targetRow][targetCol];
      if (!canContinue || isOccupied) break;

      targetRow += dr;
      targetCol += dc;
    }
  });

  // Bastion Leap
  const bastionLeaps = [
    [1, 1],
    [1, -1],
    [-1, 1],
    [-1, -1],
  ];
  bastionLeaps.forEach(([dr, dc]) => {
    const targetRow = row + dr;
    const targetCol = col + dc;

    const isTargetRowInBounds = targetRow >= 0 && targetRow < BOARD_SIZE;
    const isTargetColInBounds = targetCol >= 0 && targetCol < BOARD_SIZE;
    const isTargetInBounds = isTargetRowInBounds && isTargetColInBounds;

    if (isTargetInBounds) {
      const targetTerrain = terrain[targetRow][targetCol];
      const isForests = targetTerrain === TERRAIN_TYPES.FORESTS;
      const isMountains = targetTerrain === TERRAIN_TYPES.MOUNTAINS;
      const isTerrainBlocked = isForests || isMountains;

      if (isTerrainBlocked) return;

      const targetPiece = board[targetRow][targetCol];
      const isOccupied = !!targetPiece;
      const isOwnPiece = isOccupied && targetPiece!.player === player;
      const isEnemyOrEmpty = !isOwnPiece;

      if (isEnemyOrEmpty) validMoves.push([targetRow, targetCol]);
    }
  });
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
  // 1. Standard 1-step moves in all 8 directions
  const kingSteps = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1],           [0, 1],
    [1, -1],  [1, 0],  [1, 1],
  ];

  kingSteps.forEach(([dr, dc]) => {
    checkCellCompatibility(
      row + dr,
      col + dc,
      piece,
      player,
      board,
      terrain,
      validMoves,
    );
  });

  // 2. Orthogonal Joust (2-step jumps)
  const kingOrthogonalJumps = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
  ];
  kingOrthogonalJumps.forEach(([dr, dc]) => {
    const midRow = row + dr;
    const midCol = col + dc;

    const isMidRowInBounds = midRow >= 0 && midRow < BOARD_SIZE;
    const isMidColInBounds = midCol >= 0 && midCol < BOARD_SIZE;
    const isWithinBounds = isMidRowInBounds && isMidColInBounds;
    if (!isWithinBounds) return;

    const midPiece = board[midRow][midCol];
    const isOccupied = !!midPiece;
    const isOwnPiece = isOccupied && midPiece!.player === player;
    const isSafeToPass = !isOwnPiece;

    if (isSafeToPass) {
      const isDeepRecursion = recursionDepth > 0;
      if (isDeepRecursion) {
        checkCellCompatibility(
          row + dr * 2,
          col + dc * 2,
          piece,
          player,
          board,
          terrain,
          validMoves,
        );
      } else {
        // Tactical Rule: King cannot pass through a guarded square
        const isMidPointGuarded = board.some((boardRow, br) =>
          boardRow.some((cell, bc) => {
            const hasEnemyPiece = cell && cell.player !== player;
            if (!hasEnemyPiece) return false;

            const enemyMoves = getValidMoves(
              br,
              bc,
              cell!,
              cell!.player,
              board,
              terrain,
              mode,
              recursionDepth + 1,
            );

            const canEnemyReachMidPoint = enemyMoves.some(
              ([mr, mc]) => mr === midRow && mc === midCol,
            );
            return canEnemyReachMidPoint;
          }),
        );

        if (!isMidPointGuarded) {
          checkCellCompatibility(
            row + dr * 2,
            col + dc * 2,
            piece,
            player,
            board,
            terrain,
            validMoves,
          );
        }
      }
    }
  });
};

/**
 * getValidMoves — The definitive tactical calculation for unit movement.
 * Refactored for Immortal Narrative standards and Granular coding.
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

  const isPawn = piece.type === PAWN;
  const isKnight = piece.type === KNIGHT;
  const isBishop = piece.type === BISHOP;
  const isRook = piece.type === ROOK;
  const isQueen = piece.type === QUEEN;
  const isKing = piece.type === KING;

  if (isPawn) {
    addPawnMoves(row, col, player, board, mode, validMoves);
  }

  if (isKnight || isQueen) {
    addKnightMoves(row, col, piece, player, board, terrain, validMoves);
  }

  if (isBishop || isQueen) {
    addBishopMoves(row, col, piece, player, board, terrain, validMoves);
  }

  if (isRook || isQueen) {
    addRookMoves(row, col, piece, player, board, terrain, validMoves);
  }

  if (isKing) {
    addKingMoves(
      row,
      col,
      piece,
      player,
      board,
      terrain,
      mode,
      recursionDepth,
      validMoves,
    );
  }

  // --- Final Safety Check: Checkmate Prevention ---
  const isOuterSearch = recursionDepth === 0;
  const shouldFilterChecks = isOuterSearch && !skipCheck;

  if (shouldFilterChecks) {
    const isSafeMove = ([moveRow, moveCol]: number[]) => {
      const simulatedBoard = board.map((r) => [...r]);
      simulatedBoard[moveRow][moveCol] = { ...piece };
      simulatedBoard[row][col] = null;

      const isInCheckAfterMove = isPlayerInCheck(
        player,
        simulatedBoard,
        terrain,
        mode,
      );
      return !isInCheckAfterMove;
    };

    return validMoves.filter(isSafeMove);
  }

  return validMoves;
};
