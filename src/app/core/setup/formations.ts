import { BOARD_SIZE } from "@constants";
import { PIECES } from "@constants";
import { TERRAIN_TYPES } from "@constants";
import type { GameMode, BoardPiece, TerrainType, PieceType } from "@tc.types";
import { getPlayerCells } from "./territory";
import { canPlaceUnit } from "./validation";

const { KING, QUEEN, ROOK, BISHOP, KNIGHT, PAWN } = PIECES;

/**
 * getClassicalFormationTargets (Molecule)
 * Returns a list of intended piece placements for a standard starting formation.
 */
export const getClassicalFormationTargets = (
  player: string,
  mode: GameMode,
): { row: number; col: number; type: PieceType }[] => {
  const formationTargets: { row: number; col: number; type: PieceType }[] = [];

  const isNorthSouthMode = mode === "2p-ns";
  const isEastWestMode = mode === "2p-ew";

  if (isNorthSouthMode) {
    const backRankUnitOrder = [
      ROOK,
      KNIGHT,
      BISHOP,
      QUEEN,
      KING,
      BISHOP,
      KNIGHT,
      ROOK,
    ];
    const pawnRankUnitOrder = Array(8).fill(PAWN);

    const isRedPlayer = player === "red";
    const backRankRow = isRedPlayer ? 2 : 9;
    const pawnRankRow = isRedPlayer ? 3 : 8;
    const colOffset = 2;

    backRankUnitOrder.forEach((unitType, index) => {
      formationTargets.push({
        row: backRankRow,
        col: colOffset + index,
        type: unitType,
      });
    });

    pawnRankUnitOrder.forEach((unitType, index) => {
      formationTargets.push({
        row: pawnRankRow,
        col: colOffset + index,
        type: unitType,
      });
    });
  } else if (isEastWestMode) {
    const backRankUnitOrder = [
      ROOK,
      KNIGHT,
      BISHOP,
      QUEEN,
      KING,
      BISHOP,
      KNIGHT,
      ROOK,
    ];
    const pawnRankUnitOrder = Array(8).fill(PAWN);

    const isGreenPlayer = player === "green";
    const backRankCol = isGreenPlayer ? 2 : 9;
    const pawnRankCol = isGreenPlayer ? 3 : 8;
    const rowOffset = 2;

    backRankUnitOrder.forEach((unitType, index) => {
      formationTargets.push({
        row: rowOffset + index,
        col: backRankCol,
        type: unitType,
      });
    });

    pawnRankUnitOrder.forEach((unitType, index) => {
      formationTargets.push({
        row: rowOffset + index,
        col: pawnRankCol,
        type: unitType,
      });
    });
  } else {
    // 4-Player / 2v2 Grid Formations
    const gridFormation = [
      [ROOK, QUEEN, KING, ROOK],
      [KNIGHT, BISHOP, BISHOP, KNIGHT],
      [PAWN, PAWN, PAWN, PAWN],
      [PAWN, PAWN, PAWN, PAWN],
    ];

    let originRow: number;
    let originCol: number;
    let rowStepDirection = 1;

    const isRedPlayer = player === "red";
    const isYellowPlayer = player === "yellow";
    const isGreenPlayer = player === "green";

    if (isRedPlayer) {
      originRow = 1;
      originCol = 1;
    } else if (isYellowPlayer) {
      originRow = 1;
      originCol = 7;
    } else if (isGreenPlayer) {
      originRow = 10;
      originCol = 1;
      rowStepDirection = -1;
    } else {
      originRow = 10;
      originCol = 7;
      rowStepDirection = -1;
    }

    for (let rowIndex = 0; rowIndex < 4; rowIndex++) {
      for (let colIndex = 0; colIndex < 4; colIndex++) {
        const targetRow = originRow + rowIndex * rowStepDirection;
        const targetCol = originCol + colIndex;
        const targetUnitType = gridFormation[rowIndex][colIndex];

        formationTargets.push({
          row: targetRow,
          col: targetCol,
          type: targetUnitType,
        });
      }
    }
  }

  return formationTargets;
};

/**
 * getVanguardFormationTargets (Molecule)
 * Returns an aggressive, front-loaded piece placement for early board control.
 */
export const getVanguardFormationTargets = (
  player: string,
  mode: GameMode,
): { row: number; col: number; type: PieceType }[] => {
  const formationTargets: { row: number; col: number; type: PieceType }[] = [];

  const isNorthSouthMode = mode === "2p-ns";
  const isEastWestMode = mode === "2p-ew";

  if (isNorthSouthMode) {
    const isRedPlayer = player === "red";
    // Push pieces 1-2 ranks further forward than classical
    const frontRankRow = isRedPlayer ? 5 : 6;
    const midRankRow = isRedPlayer ? 4 : 7;
    const backRankRow = isRedPlayer ? 3 : 8;

    // Vanguard: King/Queen in the center of the push
    formationTargets.push({ row: backRankRow, col: 5, type: KING });
    formationTargets.push({ row: backRankRow, col: 6, type: QUEEN });

    // Knights/Bishops supporting the flanks
    formationTargets.push({ row: midRankRow, col: 4, type: KNIGHT });
    formationTargets.push({ row: midRankRow, col: 7, type: KNIGHT });
    formationTargets.push({ row: midRankRow, col: 3, type: BISHOP });
    formationTargets.push({ row: midRankRow, col: 8, type: BISHOP });

    // Rooks holding the corners
    formationTargets.push({ row: backRankRow, col: 2, type: ROOK });
    formationTargets.push({ row: backRankRow, col: 9, type: ROOK });

    // 8 Pawns in a V-shape wedge
    const pawnCols = [2, 3, 4, 5, 6, 7, 8, 9];
    pawnCols.forEach((c, i) => {
      // Create a wedge shape
      const wedgeOffset = Math.abs(i - 3.5);
      const row = isRedPlayer
        ? frontRankRow - Math.floor(wedgeOffset / 2)
        : frontRankRow + Math.floor(wedgeOffset / 2);
      formationTargets.push({ row, col: c, type: PAWN });
    });
  } else if (isEastWestMode) {
    const isGreenPlayer = player === "green";
    const frontRankCol = isGreenPlayer ? 5 : 6;
    const midRankCol = isGreenPlayer ? 4 : 7;
    const backRankCol = isGreenPlayer ? 3 : 8;

    formationTargets.push({ row: 5, col: backRankCol, type: KING });
    formationTargets.push({ row: 6, col: backRankCol, type: QUEEN });
    formationTargets.push({ row: 4, col: midRankCol, type: KNIGHT });
    formationTargets.push({ row: 7, col: midRankCol, type: KNIGHT });
    formationTargets.push({ row: 3, col: midRankCol, type: BISHOP });
    formationTargets.push({ row: 8, col: midRankCol, type: BISHOP });
    formationTargets.push({ row: 2, col: backRankCol, type: ROOK });
    formationTargets.push({ row: 9, col: backRankCol, type: ROOK });

    const pawnRows = [2, 3, 4, 5, 6, 7, 8, 9];
    pawnRows.forEach((r, i) => {
      const wedgeOffset = Math.abs(i - 3.5);
      const col = isGreenPlayer
        ? frontRankCol - Math.floor(wedgeOffset / 2)
        : frontRankCol + Math.floor(wedgeOffset / 2);
      formationTargets.push({ row: r, col, type: PAWN });
    });
  } else {
    // 4-Player Vanguard: Diagonal Spearhead
    const isRed = player === "red";
    const isYellow = player === "yellow";
    const isGreen = player === "green";
    const isBlue = player === "blue";

    let originR = 0,
      originC = 0,
      dr = 1,
      dc = 1;
    if (isRed) {
      originR = 0;
      originC = 0;
      dr = 1;
      dc = 1;
    } else if (isYellow) {
      originR = 0;
      originC = 11;
      dr = 1;
      dc = -1;
    } else if (isGreen) {
      originR = 11;
      originC = 0;
      dr = -1;
      dc = 1;
    } else if (isBlue) {
      originR = 11;
      originC = 11;
      dr = -1;
      dc = -1;
    }

    formationTargets.push({ row: originR, col: originC, type: KING });
    formationTargets.push({
      row: originR + dr,
      col: originC + dc,
      type: QUEEN,
    });

    formationTargets.push({ row: originR + 2 * dr, col: originC, type: ROOK });
    formationTargets.push({ row: originR, col: originC + 2 * dc, type: ROOK });

    formationTargets.push({
      row: originR + 3 * dr,
      col: originC + dc,
      type: BISHOP,
    });
    formationTargets.push({
      row: originR + dr,
      col: originC + 3 * dc,
      type: BISHOP,
    });

    formationTargets.push({
      row: originR + 4 * dr,
      col: originC + 2 * dc,
      type: KNIGHT,
    });
    formationTargets.push({
      row: originR + 2 * dr,
      col: originC + 4 * dc,
      type: KNIGHT,
    });

    // 8 Pawns in a screening arc
    for (let i = 0; i < 4; i++) {
      formationTargets.push({
        row: originR + 5 * dr,
        col: originC + i * dc,
        type: PAWN,
      });
      formationTargets.push({
        row: originR + i * dr,
        col: originC + 5 * dc,
        type: PAWN,
      });
    }
  }

  return formationTargets;
};

/**
 * getFortressFormationTargets (Molecule)
 * Returns a defensive, clustered piece placement focused on commander protection.
 */
export const getFortressFormationTargets = (
  player: string,
  mode: GameMode,
): { row: number; col: number; type: PieceType }[] => {
  const formationTargets: { row: number; col: number; type: PieceType }[] = [];
  const isNorthSouth = mode === "2p-ns";
  const isEastWest = mode === "2p-ew";

  if (isNorthSouth) {
    const isRed = player === "red";
    const centerRow = isRed ? 1 : 10;
    const midRow = isRed ? 2 : 9;
    const outerRow = isRed ? 3 : 8;

    // King in the very back center
    formationTargets.push({ row: centerRow, col: 5, type: KING });
    formationTargets.push({ row: centerRow, col: 6, type: QUEEN });

    // Protective ring
    [
      [midRow, 4],
      [midRow, 5],
      [midRow, 6],
      [midRow, 7],
    ].forEach(([r, c]) => {
      formationTargets.push({ row: r, col: c, type: ROOK });
    });

    // Flanks
    [
      [midRow, 3],
      [midRow, 8],
    ].forEach(([r, c]) => {
      formationTargets.push({ row: r, col: c, type: BISHOP });
    });
    [
      [outerRow, 4],
      [outerRow, 7],
    ].forEach(([r, c]) => {
      formationTargets.push({ row: r, col: c, type: KNIGHT });
    });

    // Picket Line (8 Pawns)
    [2, 3, 4, 5, 6, 7, 8, 9].forEach((c) => {
      formationTargets.push({
        row: outerRow + (isRed ? 1 : -1),
        col: c,
        type: PAWN,
      });
    });
  } else if (isEastWest) {
    const isGreen = player === "green";
    const centerCol = isGreen ? 1 : 10;
    const midCol = isGreen ? 2 : 9;
    const outerCol = isGreen ? 3 : 8;

    formationTargets.push({ row: 5, col: centerCol, type: KING });
    formationTargets.push({ row: 6, col: centerCol, type: QUEEN });
    [
      [4, midCol],
      [5, midCol],
      [6, midCol],
      [7, midCol],
    ].forEach(([r, c]) => {
      formationTargets.push({ row: r, col: c, type: ROOK });
    });
    [
      [3, midCol],
      [8, midCol],
    ].forEach(([r, c]) => {
      formationTargets.push({ row: r, col: c, type: BISHOP });
    });
    [
      [4, outerCol],
      [7, outerCol],
    ].forEach(([r, c]) => {
      formationTargets.push({ row: r, col: c, type: KNIGHT });
    });
    [2, 3, 4, 5, 6, 7, 8, 9].forEach((r) => {
      formationTargets.push({
        row: r,
        col: outerCol + (isGreen ? 1 : -1),
        type: PAWN,
      });
    });
  }
  return formationTargets;
};

/**
 * getSkirmishFormationTargets (Molecule)
 * Returns a wide, screened layout designed for maximum field presence.
 */
export const getSkirmishFormationTargets = (
  player: string,
  mode: GameMode,
): { row: number; col: number; type: PieceType }[] => {
  const targets: { row: number; col: number; type: PieceType }[] = [];
  const isRed = player === "red";
  const isNorthSouth = mode === "2p-ns";

  if (isNorthSouth) {
    const rowBase = isRed ? 1 : 10;
    const step = isRed ? 1 : -1;

    targets.push({ row: rowBase, col: 5, type: KING });
    targets.push({ row: rowBase, col: 6, type: QUEEN });

    // Spread units wide
    targets.push({ row: rowBase + step, col: 1, type: ROOK });
    targets.push({ row: rowBase + step, col: 10, type: ROOK });
    targets.push({ row: rowBase + 2 * step, col: 3, type: BISHOP });
    targets.push({ row: rowBase + 2 * step, col: 8, type: BISHOP });
    targets.push({ row: rowBase + 3 * step, col: 5, type: KNIGHT });
    targets.push({ row: rowBase + 3 * step, col: 6, type: KNIGHT });

    // Staggered Pawns
    for (let i = 0; i < 8; i++) {
      targets.push({
        row: rowBase + (i % 2 === 0 ? 4 : 5) * step,
        col: 2 + i,
        type: PAWN,
      });
    }
  }
  return targets;
};

/**
 * applyClassicalFormation (Molecule)
 * Wipes a player's territory and applies a specific formation.
 */
export const applyClassicalFormation = (
  currentBoard: (BoardPiece | null)[][],
  currentTerrain: TerrainType[][],
  unitInventory: Record<string, PieceType[]>,
  terrainInventory: Record<string, TerrainType[]>,
  players: string[],
  mode: GameMode,
  formationType:
    | "classical"
    | "vanguard"
    | "fortress"
    | "skirmish" = "classical",
) => {
  const nextBoardState = currentBoard.map((row) => [...row]);
  const nextTerrainMap = currentTerrain.map((row) => [...row]);
  const nextUnitInventory = { ...unitInventory };
  const nextTerrainInventory = { ...terrainInventory };

  players.forEach((player) => {
    const myTerritoryCells = getPlayerCells(player, mode);

    // Clear existing pieces belonging to this player
    for (const [row, col] of myTerritoryCells) {
      const pieceAtCell = nextBoardState[row][col];
      const isPieceOccupied = !!pieceAtCell;
      const isOwnPiece = isPieceOccupied && pieceAtCell!.player === player;

      if (isOwnPiece) {
        nextBoardState[row][col] = null;
      }
    }

    const formationTargets =
      formationType === "vanguard"
        ? getVanguardFormationTargets(player, mode)
        : formationType === "fortress"
          ? getFortressFormationTargets(player, mode)
          : formationType === "skirmish"
            ? getSkirmishFormationTargets(player, mode)
            : getClassicalFormationTargets(player, mode);

    const playerTerrainPool = [...(nextTerrainInventory[player] || [])];

    for (const { row, col, type: unitTypeToPlace } of formationTargets) {
      const isRowInBounds = row >= 0 && row < BOARD_SIZE;
      const isColInBounds = col >= 0 && col < BOARD_SIZE;
      const isWithinBoard = isRowInBounds && isColInBounds;

      if (!isWithinBoard) continue;

      const terrainAtCell = nextTerrainMap[row][col];
      const isTerrainFlat = terrainAtCell === TERRAIN_TYPES.FLAT;
      const isCompatibleWithTerrain = canPlaceUnit(
        unitTypeToPlace,
        terrainAtCell,
      );

      const shouldClearTerrain = !isCompatibleWithTerrain && !isTerrainFlat;
      if (shouldClearTerrain) {
        playerTerrainPool.push(terrainAtCell);
        nextTerrainMap[row][col] = TERRAIN_TYPES.FLAT as TerrainType;
      }

      nextBoardState[row][col] = { type: unitTypeToPlace, player: player };
    }

    nextUnitInventory[player] = [];
    nextTerrainInventory[player] = playerTerrainPool;
  });

  return {
    board: nextBoardState,
    terrain: nextTerrainMap,
    inventory: nextUnitInventory,
    terrainInventory: nextTerrainInventory,
  };
};
