import React from "react";
import { PIECES } from "@engineConfigs/unitDetails";
import { TERRAIN_TYPES } from "@engineConfigs/terrainDetails";
import { getValidMoves } from "@logic/gameLogic";
import type { PieceType } from "@engineTypes/game";
import type { TerrainIntelPanelEntry } from "@engineTypes/guide";

export interface TerrainPreviewGridProps {
  unitType: string;
  terrainData: TerrainIntelPanelEntry;
}

export const TerrainPreviewGrid: React.FC<TerrainPreviewGridProps> = ({
  unitType,
  terrainData,
}) => {
  const pType =
    PIECES[unitType.toUpperCase()] || (unitType === "Pawn" ? "pawn" : null);
  if (!pType) return null;

  let tType = TERRAIN_TYPES.FLAT;
  if (terrainData.label === "Swamp") tType = TERRAIN_TYPES.PONDS;
  if (terrainData.label === "Forest") tType = TERRAIN_TYPES.TREES;
  if (terrainData.label === "Mountains") tType = TERRAIN_TYPES.RUBBLE;
  if (terrainData.label === "Desert") tType = TERRAIN_TYPES.DESERT;

  const simSize = 12; // Must match BOARD_SIZE
  const simCenter = 6;
  const simBoard = Array(simSize)
    .fill(null)
    .map(() => Array(simSize).fill(null));
  const simTerrain = Array(simSize)
    .fill(null)
    .map(() => Array(simSize).fill(TERRAIN_TYPES.FLAT));

  for (let r = simCenter - 1; r <= simCenter + 1; r++) {
    for (let c = simCenter - 1; c <= simCenter + 1; c++) {
      simTerrain[r][c] = tType;
    }
  }

  simBoard[simCenter][simCenter] = {
    type: pType as PieceType,
    player: "player1",
  };

  const moves = getValidMoves(
    simCenter,
    simCenter,
    simBoard[simCenter][simCenter]!,
    "player1",
    simBoard,
    simTerrain,
    "2p-ns",
  );

  return (
    <div className="grid grid-cols-3 gap-[1px] bg-slate-200 dark:bg-slate-700/50 p-[2px] rounded overflow-hidden">
      {[-1, 0, 1].map((dr) =>
        [-1, 0, 1].map((dc) => {
          const fr = simCenter + dr;
          const fc = simCenter + dc;
          const isCenter = dr === 0 && dc === 0;
          const isMove = moves.some(([mr, mc]) => mr === fr && mc === fc);

          let cellColor = "bg-slate-300 dark:bg-white/5";
          if (tType === TERRAIN_TYPES.TREES)
            cellColor = "bg-emerald-200 dark:bg-emerald-900/40";
          if (tType === TERRAIN_TYPES.PONDS)
            cellColor = "bg-blue-200 dark:bg-blue-900/40";
          if (tType === TERRAIN_TYPES.RUBBLE)
            cellColor = "bg-red-200 dark:bg-red-900/40";
          if (tType === TERRAIN_TYPES.DESERT)
            cellColor = "bg-amber-100 dark:bg-amber-900/40";

          return (
            <div
              key={`${dr}-${dc}`}
              className={`w-3 h-3 flex items-center justify-center ${cellColor}`}
            >
              {isCenter && (
                <div className="w-1.5 h-1.5 rounded-full bg-slate-900 dark:bg-white" />
              )}
              {!isCenter && isMove && (
                <div className="w-1 h-1 rounded-full bg-green-500/80" />
              )}
              {!isCenter && !isMove && (
                <div className="w-0.5 h-0.5 rounded-full bg-red-500/20" />
              )}
            </div>
          );
        }),
      )}
    </div>
  );
};
