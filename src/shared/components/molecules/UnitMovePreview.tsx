import React, { useMemo } from "react";
import { Columns4, Shield, X } from "lucide-react";
import {
  UNIT_DETAILS,
  PIECES,
  INITIAL_ARMY,
  TERRAIN_DETAILS,
  BOARD_SIZE,
} from "@/constants";
import { useRouteContext } from "@context";
import { isUnitProtected, getValidMoves } from "@/core/mechanics/gameLogic";
import { canUnitTraverseTerrain } from "@/core/setup/terrainCompat";
import type { PieceType, TerrainType, BoardPiece } from "@/shared/types";

interface UnitMovePreviewProps {
  unitType: string;
  previewGridSize?: number;
  centerRow?: number;
  centerCol?: number;
  className?: string;
  containerClassName?: string;
  mode?: "classic" | "new" | "both";
  selectedTerrain?: string | null;
}

export const UnitMovePreview: React.FC<UnitMovePreviewProps> = ({
  unitType,
  previewGridSize = 11,
  centerRow = 5,
  centerCol = 5,
  className = "",
  containerClassName = "",
  mode = "both",
  selectedTerrain,
}) => {
  const { getIcon } = useRouteContext();

  // Tactical logic simulation
  const tacticalMoves = useMemo(() => {
    if (!UNIT_DETAILS[unitType]) return [];

    const simulationBoard: (BoardPiece | null)[][] = Array(BOARD_SIZE)
      .fill(null)
      .map(() => Array(BOARD_SIZE).fill(null));
    const simulationTerrain: TerrainType[][] = Array(BOARD_SIZE)
      .fill(null)
      .map(() => Array(BOARD_SIZE).fill("flat" as TerrainType));

    const boardCenter = Math.floor(BOARD_SIZE / 2);

    // Fill with terrain if selected
    if (selectedTerrain) {
      for (let r = 0; r < BOARD_SIZE; r++) {
        for (let c = 0; c < BOARD_SIZE; c++) {
          // Keep center flat or piece might not be able to "exist" there in some future logic
          if (r !== boardCenter || c !== boardCenter) {
            simulationTerrain[r][c] = selectedTerrain as TerrainType;
          }
        }
      }
    }

    simulationBoard[boardCenter][boardCenter] = {
      type: unitType as PieceType,
      player: "red",
    };

    return getValidMoves(
      boardCenter,
      boardCenter,
      simulationBoard[boardCenter][boardCenter]!,
      "red",
      simulationBoard,
      simulationTerrain,
      "2p-ns",
    );
  }, [unitType, selectedTerrain]);

  const details = UNIT_DETAILS[unitType];
  if (!details) return null;

  const unit = INITIAL_ARMY.find((u) => u.type === unitType);

  const movePattern = details.movePattern;
  const moves = movePattern(centerRow, centerCol);
  const newMoves = details.newMovePattern
    ? details.newMovePattern(centerRow, centerCol)
    : [];
  const attacks = details.attackPattern
    ? details.attackPattern(centerRow, centerCol)
    : [];

  const terrainInfo = selectedTerrain
    ? TERRAIN_DETAILS.find((t) => t.key === selectedTerrain)
    : null;
  const TerrainIcon = terrainInfo?.icon;

  const isProtected = selectedTerrain
    ? isUnitProtected(unitType, selectedTerrain)
    : false;
  const canTraverse = selectedTerrain
    ? canUnitTraverseTerrain(
        unitType as PieceType,
        selectedTerrain as TerrainType,
      )
    : true;

  return (
    <div
      className={`bg-slate-100 dark:bg-white/5 rounded-2xl p-3 border border-slate-200 dark:border-white/5 shadow-inner transition-all duration-300 w-fit ${containerClassName}`}
    >
      <div
        className={`grid gap-[1px] ${className}`}
        style={{ gridTemplateColumns: `repeat(${previewGridSize}, 1fr)` }}
      >
        {Array.from({ length: previewGridSize * previewGridSize }).map(
          (_, i) => {
            const r = Math.floor(i / previewGridSize);
            const c = i % previewGridSize;
            const isCenter = r === centerRow && c === centerCol;

            // Map preview cell to tactical simulation cell
            const boardCenter = Math.floor(BOARD_SIZE / 2);
            const simR = r + (boardCenter - centerRow);
            const simC = c + (boardCenter - centerCol);

            const isTacticalValid = tacticalMoves.some(
              ([tmR, tmC]) => tmR === simR && tmC === simC,
            );

            // Potential moves (geometric)
            const isMoveFound = moves.some(([mr, mc]) => mr === r && mc === c);
            const isNewMoveFound = newMoves.some(
              ([nr, mc]) => nr === r && mc === c,
            );
            const isAttackFound = attacks.some(
              ([ar, ac]) => ar === r && ac === c,
            );

            // If selectedTerrain is set, show terrain everywhere except center
            const isTerrainCell = selectedTerrain && !isCenter;

            // Logic for "Blocked" vs "Valid"
            const isBlocked =
              (isMoveFound || isNewMoveFound || isAttackFound) &&
              !isTacticalValid &&
              selectedTerrain;
            const isActualMove =
              mode !== "new" &&
              isMoveFound &&
              (isTacticalValid || !selectedTerrain);
            const isActualNewMove =
              mode !== "classic" &&
              isNewMoveFound &&
              (isTacticalValid || !selectedTerrain);
            const isActualAttack =
              isAttackFound &&
              (isTacticalValid || !selectedTerrain) &&
              !isActualMove &&
              !isActualNewMove;

            const isPromotionRow = unitType === PIECES.PAWN && r === 0;

            const isEven = (r + c) % 2 === 0;
            const baseColor = isEven
              ? "bg-slate-100/60 dark:bg-white/10"
              : "bg-slate-200/60 dark:bg-white/[0.04]";

            const terrainBg = terrainInfo?.color?.bg || "";

            return (
              <div
                key={i}
                className={`w-4 h-4 sm:w-6 sm:h-6 rounded-[2px] relative flex items-center justify-center transition-all duration-300 ${
                  isCenter
                    ? "bg-slate-800 dark:bg-white z-30 shadow-xl scale-110"
                    : isTerrainCell
                      ? `${terrainBg} z-0`
                      : baseColor
                }`}
              >
                {isPromotionRow &&
                  !isActualMove &&
                  !isActualNewMove &&
                  !isActualAttack && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500/40" />
                    </div>
                  )}

                {/* Center Piece */}
                {isCenter &&
                  unit &&
                  getIcon(unit, "dark:text-slate-900 text-white", 18)}

                {/* Tactical Move Indicators */}
                {(isActualMove || isActualNewMove || isActualAttack) && (
                  <div
                    className={`absolute inset-[1px] z-10 rounded-sm shadow-sm flex items-center justify-center transition-all ${
                      isActualNewMove
                        ? "bg-amber-500 animate-pulse"
                        : isActualAttack
                          ? "bg-brand-red"
                          : "bg-emerald-500"
                    }`}
                  >
                    {isActualAttack && (
                      <Columns4
                        size={12}
                        strokeWidth={3}
                        className="text-white/90"
                      />
                    )}
                    {isTerrainCell && isProtected && (
                      <Shield size={12} className="text-white fill-white/20" />
                    )}
                  </div>
                )}

                {/* Blocked Indicator - Red "X" */}
                {isBlocked && (
                  <div className="absolute inset-[1px] z-20 bg-brand-red/80 rounded-sm flex items-center justify-center shadow-lg border border-red-500/30">
                    <X className="w-3 h-3 text-white" strokeWidth={4} />
                  </div>
                )}

                {/* Terrain Decor Icons (only if not a move/blocked) */}
                {isTerrainCell &&
                  !isCenter &&
                  !isActualMove &&
                  !isActualNewMove &&
                  !isActualAttack &&
                  !isBlocked && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      {!canTraverse ? (
                        <X
                          className="w-3 h-3 text-brand-red/40"
                          strokeWidth={4}
                        />
                      ) : (
                        TerrainIcon && (
                          <TerrainIcon
                            size={12}
                            className={`${terrainInfo.color?.text || ""} opacity-20`}
                          />
                        )
                      )}
                    </div>
                  )}
              </div>
            );
          },
        )}
      </div>
    </div>
  );
};
