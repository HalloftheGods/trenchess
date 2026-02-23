import { BOARD_SIZE } from "@/shared/constants/core.constants";
import { MAX_TERRAIN_PER_PLAYER } from "@/shared/constants/terrain.constants";
import { TERRAIN_TYPES } from "@/core/data/terrainDetails";
import type { GameMode, BoardPiece, TerrainType, PieceType } from "@/types";
import { TerraForm } from "../generateTrench";
import { getPlayerCells } from "./territory";
import { canPlaceUnit } from "./validation";

// Helper: Shuffle Array in place
export const shuffle = <T>(array: T[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
};

export const generateElementalTerrain = (
  _currentTerrain: TerrainType[][],
  currentBoard: (BoardPiece | null)[][],
  _terrainInventory: Record<string, TerrainType[]>,
  players: string[],
  mode: GameMode,
) => {
  const nextTerrain = TerraForm.generate({
    mode,
    seed: Math.random(),
    symmetry: "rotational",
  });

  const nextTInv: Record<string, TerrainType[]> = {};
  players.forEach((p) => {
    nextTInv[p] = [];
  });

  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      if (currentBoard[r][c]) {
        const unit = currentBoard[r][c]!;
        const terr = nextTerrain[r][c];
        if (terr !== TERRAIN_TYPES.FLAT && !canPlaceUnit(unit.type, terr)) {
          nextTerrain[r][c] = TERRAIN_TYPES.FLAT as TerrainType;
        }
      }
    }
  }

  return { terrain: nextTerrain, terrainInventory: nextTInv };
};

export const randomizeTerrain = (
  currentTerrain: TerrainType[][],
  currentBoard: (BoardPiece | null)[][],
  terrainInventory: Record<string, TerrainType[]>,
  players: string[],
  mode: GameMode,
) => {
  const nextTerrain = currentTerrain.map((row) => [...row]);
  const nextTInv = { ...terrainInventory };

  const isTwoPlayer = mode === "2p-ns" || mode === "2p-ew";
  const quota = isTwoPlayer
    ? MAX_TERRAIN_PER_PLAYER.TWO_PLAYER
    : MAX_TERRAIN_PER_PLAYER.FOUR_PLAYER;

  players.forEach((p) => {
    const myCells = getPlayerCells(p, mode);
    let playerTerrain = [...(nextTInv[p] || [])];

    // BUG FIX: If inventory is empty, generate a balanced pool of 16 (4 of each)
    if (playerTerrain.length === 0) {
      const types = [
        TERRAIN_TYPES.TREES,
        TERRAIN_TYPES.PONDS,
        TERRAIN_TYPES.RUBBLE,
        TERRAIN_TYPES.DESERT,
      ];
      playerTerrain = types.flatMap((t) => Array(4).fill(t));
    }

    for (const [r, c] of myCells) {
      if (nextTerrain[r][c] !== TERRAIN_TYPES.FLAT) {
        playerTerrain.push(nextTerrain[r][c]);
        nextTerrain[r][c] = TERRAIN_TYPES.FLAT as TerrainType;
      }
    }

    shuffle(playerTerrain);

    const available = [...myCells];
    shuffle(available);

    let placedCount = 0;
    const remaining: TerrainType[] = [];

    for (const terrType of playerTerrain) {
      if (placedCount >= quota) {
        remaining.push(terrType);
        continue;
      }

      const cellIdx = available.findIndex(([r, c]) => {
        const unit = currentBoard[r][c];
        if (!unit) return true;
        return canPlaceUnit(unit.type, terrType);
      });

      if (cellIdx !== -1) {
        const [r, c] = available[cellIdx];
        nextTerrain[r][c] = terrType;
        available.splice(cellIdx, 1);
        placedCount++;
      } else {
        remaining.push(terrType);
      }
    }

    nextTInv[p] = remaining;
  });

  return { terrain: nextTerrain, terrainInventory: nextTInv };
};

export const randomizeUnits = (
  currentBoard: (BoardPiece | null)[][],
  currentTerrain: TerrainType[][],
  unitInventory: Record<string, PieceType[]>,
  players: string[],
  mode: GameMode,
) => {
  const nextBoard = currentBoard.map((row) => [...row]);
  const nextInv = { ...unitInventory };

  players.forEach((p) => {
    const myCells = getPlayerCells(p, mode);
    const playerUnits = [...(nextInv[p] || [])];

    for (const [r, c] of myCells) {
      if (nextBoard[r][c] && nextBoard[r][c]!.player === p) {
        playerUnits.push(nextBoard[r][c]!.type);
        nextBoard[r][c] = null;
      }
    }

    shuffle(playerUnits);

    const available = myCells.filter(([r, c]) => !nextBoard[r][c]);
    shuffle(available);

    const remaining: PieceType[] = [];
    for (const unitType of playerUnits) {
      const cellIdx = available.findIndex(([r, c]) =>
        canPlaceUnit(unitType, currentTerrain[r][c]),
      );

      if (cellIdx !== -1) {
        const [r, c] = available[cellIdx];
        nextBoard[r][c] = { type: unitType, player: p };
        available.splice(cellIdx, 1);
      } else {
        remaining.push(unitType);
      }
    }
    nextInv[p] = remaining;
  });

  return { board: nextBoard, inventory: nextInv };
};
