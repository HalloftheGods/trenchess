import React from "react";
import { PIECES } from "@constants";
import { TERRAIN_TYPES } from "@constants";
import { getValidMoves } from "@/core/mechanics";
import type { PieceType } from "@/shared/types/game";
import type { TerrainIntelPanelEntry } from "@/shared/types/guide";

export interface TerrainPreviewGridProps {
  unitType: string;
  terrainData: TerrainIntelPanelEntry;
}

/**
 * TerrainPreviewGrid — Micro-preview of unit mobility on specific terrain.
 */
export const TerrainPreviewGrid: React.FC<TerrainPreviewGridProps> = ({
  unitType,
  terrainData,
}) => {
  const pieceType = (PIECES[unitType.toUpperCase() as keyof typeof PIECES] ||
    (unitType === "Pawn" ? PIECES.PAWN : null)) as PieceType;

  if (!pieceType) return null;

  let activeTerrain = TERRAIN_TYPES.FLAT;
  if (terrainData.label === "Swamp") activeTerrain = TERRAIN_TYPES.PONDS;
  if (terrainData.label === "Forest") activeTerrain = TERRAIN_TYPES.TREES;
  if (terrainData.label === "Mountains") activeTerrain = TERRAIN_TYPES.RUBBLE;
  if (terrainData.label === "Desert") activeTerrain = TERRAIN_TYPES.DESERT;

  const SIMULATION_SIZE = 12;
  const SIMULATION_CENTER = 6;

  const simulationBoard = Array(SIMULATION_SIZE)
    .fill(null)
    .map(() => Array(SIMULATION_SIZE).fill(null));

  const simulationTerrain = Array(SIMULATION_SIZE)
    .fill(null)
    .map(() => Array(SIMULATION_SIZE).fill(TERRAIN_TYPES.FLAT));

  // Fill local 3x3 with the tested terrain
  for (let row = SIMULATION_CENTER - 1; row <= SIMULATION_CENTER + 1; row++) {
    for (let col = SIMULATION_CENTER - 1; col <= SIMULATION_CENTER + 1; col++) {
      simulationTerrain[row][col] = activeTerrain;
    }
  }

  simulationBoard[SIMULATION_CENTER][SIMULATION_CENTER] = {
    type: pieceType,
    player: "red",
  };

  const calculatedMoves = getValidMoves(
    SIMULATION_CENTER,
    SIMULATION_CENTER,
    simulationBoard[SIMULATION_CENTER][SIMULATION_CENTER]!,
    "red",
    simulationBoard,
    simulationTerrain,
    "2p-ns",
  );

  return (
    <div className="grid grid-cols-3 gap-[1px] bg-slate-200 dark:bg-slate-700/50 p-[2px] rounded overflow-hidden">
      {[-1, 0, 1].map((rowOffset) =>
        [-1, 0, 1].map((colOffset) => {
          const targetRow = SIMULATION_CENTER + rowOffset;
          const targetCol = SIMULATION_CENTER + colOffset;
          const isCenter = rowOffset === 0 && colOffset === 0;
          const isMovePossible = calculatedMoves.some(
            ([mr, mc]) => mr === targetRow && mc === targetCol,
          );

          let cellColor = "bg-slate-300 dark:bg-white/5";
          if (activeTerrain === TERRAIN_TYPES.TREES)
            cellColor = "bg-emerald-200 dark:bg-emerald-900/40";
          if (activeTerrain === TERRAIN_TYPES.PONDS)
            cellColor = "bg-blue-200 dark:bg-blue-900/40";
          if (activeTerrain === TERRAIN_TYPES.RUBBLE)
            cellColor = "bg-red-200 dark:bg-red-900/40";
          if (activeTerrain === TERRAIN_TYPES.DESERT)
            cellColor = "bg-amber-100 dark:bg-amber-900/40";

          return (
            <div
              key={`${rowOffset}-${colOffset}`}
              className={`w-3 h-3 flex items-center justify-center ${cellColor}`}
            >
              {isCenter ? (
                <div className="w-1.5 h-1.5 rounded-full bg-slate-900 dark:bg-white" />
              ) : isMovePossible ? (
                <div className="w-1 h-1 rounded-full bg-green-500/80" />
              ) : (
                <div className="w-0.5 h-0.5 rounded-full bg-red-500/20" />
              )}
            </div>
          );
        }),
      )}
    </div>
  );
};
