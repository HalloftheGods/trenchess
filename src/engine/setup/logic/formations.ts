import { BOARD_SIZE } from "@constants/core.constants";
import { PIECES } from "@engineConfigs/unitDetails";
import { TERRAIN_TYPES } from "@engineConfigs/terrainDetails";
import type {
  GameMode,
  BoardPiece,
  TerrainType,
  PieceType,
} from "@engineTypes/game";
import { getPlayerCells } from "./territory";
import { canPlaceUnit } from "./validation";

export const getClassicalFormationTargets = (
  p: string,
  mode: GameMode,
): { r: number; c: number; type: PieceType }[] => {
  const targets: { r: number; c: number; type: PieceType }[] = [];
  if (mode === "2p-ns") {
    const backRank = [
      PIECES.ROOK,
      PIECES.KNIGHT,
      PIECES.BISHOP,
      PIECES.QUEEN,
      PIECES.KING,
      PIECES.BISHOP,
      PIECES.KNIGHT,
      PIECES.ROOK,
    ];
    const pawnRank = Array(8).fill(PIECES.PAWN);
    if (p === "player1") {
      backRank.forEach((type, i) => targets.push({ r: 2, c: 2 + i, type }));
      pawnRank.forEach((type, i) => targets.push({ r: 3, c: 2 + i, type }));
    } else {
      backRank.forEach((type, i) => targets.push({ r: 9, c: 2 + i, type }));
      pawnRank.forEach((type, i) => targets.push({ r: 8, c: 2 + i, type }));
    }
  } else if (mode === "2p-ew") {
    const backRank = [
      PIECES.ROOK,
      PIECES.KNIGHT,
      PIECES.BISHOP,
      PIECES.QUEEN,
      PIECES.KING,
      PIECES.BISHOP,
      PIECES.KNIGHT,
      PIECES.ROOK,
    ];
    const pawnRank = Array(8).fill(PIECES.PAWN);
    if (p === "player3") {
      backRank.forEach((type, i) => targets.push({ r: 2 + i, c: 2, type }));
      pawnRank.forEach((type, i) => targets.push({ r: 2 + i, c: 3, type }));
    } else {
      backRank.forEach((type, i) => targets.push({ r: 2 + i, c: 9, type }));
      pawnRank.forEach((type, i) => targets.push({ r: 2 + i, c: 8, type }));
    }
  } else {
    const formation = [
      [PIECES.ROOK, PIECES.QUEEN, PIECES.KING, PIECES.ROOK],
      [PIECES.KNIGHT, PIECES.BISHOP, PIECES.BISHOP, PIECES.KNIGHT],
      [PIECES.PAWN, PIECES.PAWN, PIECES.PAWN, PIECES.PAWN],
      [PIECES.PAWN, PIECES.PAWN, PIECES.PAWN, PIECES.PAWN],
    ];
    let rOrigins = 0,
      cOrigins = 0,
      rStep = 1;
    if (p === "player1") {
      rOrigins = 1;
      cOrigins = 1;
    } else if (p === "player2") {
      rOrigins = 1;
      cOrigins = 7;
    } else if (p === "player3") {
      rOrigins = 10;
      cOrigins = 1;
      rStep = -1;
    } else {
      rOrigins = 10;
      cOrigins = 7;
      rStep = -1;
    }
    for (let rIdx = 0; rIdx < 4; rIdx++) {
      for (let cIdx = 0; cIdx < 4; cIdx++) {
        targets.push({
          r: rOrigins + rIdx * rStep,
          c: cOrigins + cIdx,
          type: formation[rIdx][cIdx],
        });
      }
    }
  }
  return targets;
};

export const applyClassicalFormation = (
  currentBoard: (BoardPiece | null)[][],
  currentTerrain: TerrainType[][],
  unitInventory: Record<string, PieceType[]>,
  terrainInventory: Record<string, TerrainType[]>,
  players: string[],
  mode: GameMode,
) => {
  const nextBoard = currentBoard.map((row) => [...row]);
  const nextTerrain = currentTerrain.map((row) => [...row]);
  const nextInv = { ...unitInventory };
  const nextTInv = { ...terrainInventory };

  players.forEach((p) => {
    const myCells = getPlayerCells(p, mode);
    for (const [r, c] of myCells) {
      if (nextBoard[r][c]?.player === p) {
        nextBoard[r][c] = null;
      }
    }

    const targets = getClassicalFormationTargets(p, mode);

    const playerTerrainInv = [...(nextTInv[p] || [])];
    for (const { r, c, type } of targets) {
      if (r < 0 || r >= BOARD_SIZE || c < 0 || c >= BOARD_SIZE) continue;
      const terr = nextTerrain[r][c];

      if (!canPlaceUnit(type, terr)) {
        if (terr !== TERRAIN_TYPES.FLAT) {
          playerTerrainInv.push(terr);
          nextTerrain[r][c] = TERRAIN_TYPES.FLAT as TerrainType;
        }
      }
      nextBoard[r][c] = { type, player: p };
    }
    nextInv[p] = [];
    nextTInv[p] = playerTerrainInv;
  });

  return {
    board: nextBoard,
    terrain: nextTerrain,
    inventory: nextInv,
    terrainInventory: nextTInv,
  };
};
