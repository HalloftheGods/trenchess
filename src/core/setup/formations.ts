import { BOARD_SIZE } from "@/constants";
import { PIECES } from "@/constants";
import { TERRAIN_TYPES } from "@/constants";
import type {
  GameMode,
  BoardPiece,
  TerrainType,
  PieceType,
} from "@/shared/types";
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
    const backRankUnitOrder = [ROOK, KNIGHT, BISHOP, QUEEN, KING, BISHOP, KNIGHT, ROOK];
    const pawnRankUnitOrder = Array(8).fill(PAWN);
    
    const isRedPlayer = player === "red";
    const backRankRow = isRedPlayer ? 2 : 9;
    const pawnRankRow = isRedPlayer ? 3 : 8;
    const colOffset = 2;

    backRankUnitOrder.forEach((unitType, index) => {
      formationTargets.push({ row: backRankRow, col: colOffset + index, type: unitType });
    });
    
    pawnRankUnitOrder.forEach((unitType, index) => {
      formationTargets.push({ row: pawnRankRow, col: colOffset + index, type: unitType });
    });
  } else if (isEastWestMode) {
    const backRankUnitOrder = [ROOK, KNIGHT, BISHOP, QUEEN, KING, BISHOP, KNIGHT, ROOK];
    const pawnRankUnitOrder = Array(8).fill(PAWN);
    
    const isGreenPlayer = player === "green";
    const backRankCol = isGreenPlayer ? 2 : 9;
    const pawnRankCol = isGreenPlayer ? 3 : 8;
    const rowOffset = 2;

    backRankUnitOrder.forEach((unitType, index) => {
      formationTargets.push({ row: rowOffset + index, col: backRankCol, type: unitType });
    });
    
    pawnRankUnitOrder.forEach((unitType, index) => {
      formationTargets.push({ row: rowOffset + index, col: pawnRankCol, type: unitType });
    });
  } else {
    // 4-Player / 2v2 Grid Formations
    const gridFormation = [
      [ROOK, QUEEN, KING, ROOK],
      [KNIGHT, BISHOP, BISHOP, KNIGHT],
      [PAWN, PAWN, PAWN, PAWN],
      [PAWN, PAWN, PAWN, PAWN],
    ];
    
    let originRow = 0;
    let originCol = 0;
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
        const targetRow = originRow + (rowIndex * rowStepDirection);
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
 * applyClassicalFormation (Molecule)
 * Wipes a player's territory and applies a standard chess-like formation.
 */
export const applyClassicalFormation = (
  currentBoard: (BoardPiece | null)[][],
  currentTerrain: TerrainType[][],
  unitInventory: Record<string, PieceType[]>,
  terrainInventory: Record<string, TerrainType[]>,
  players: string[],
  mode: GameMode,
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

    const formationTargets = getClassicalFormationTargets(player, mode);
    const playerTerrainPool = [...(nextTerrainInventory[player] || [])];

    for (const { row, col, type: unitTypeToPlace } of formationTargets) {
      const isRowInBounds = row >= 0 && row < BOARD_SIZE;
      const isColInBounds = col >= 0 && col < BOARD_SIZE;
      const isWithinBoard = isRowInBounds && isColInBounds;
      
      if (!isWithinBoard) continue;
      
      const terrainAtCell = nextTerrainMap[row][col];
      const isTerrainFlat = terrainAtCell === TERRAIN_TYPES.FLAT;
      const isCompatibleWithTerrain = canPlaceUnit(unitTypeToPlace, terrainAtCell);
      
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
