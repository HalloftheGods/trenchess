import React from "react";
import { Columns4, Shield, X } from "lucide-react";
import { UNIT_DETAILS, PIECES, INITIAL_ARMY, TERRAIN_DETAILS } from "@/constants";
import { useRouteContext } from "@/route.context";
import { isUnitProtected } from "@/core/mechanics/gameLogic";
import { canUnitTraverseTerrain } from "@/core/setup/terrainCompat";
import type { PieceType, TerrainType } from "@/shared/types";

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
    ? canUnitTraverseTerrain(unitType as PieceType, selectedTerrain as TerrainType)
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

            // Terrain area: front and back rows relative to center
            const isFrontRow = r === centerRow - 1;
            const isBackRow = r === centerRow + 1;
            const isTerrainCell = selectedTerrain && (isFrontRow || isBackRow);

            const isMoveFound = moves.some(([mr, mc]) => mr === r && mc === c);
            const isNewMoveFound = newMoves.some(
              ([nr, mc]) => nr === r && mc === c,
            );
            const isAttackFound = attacks.some(
              ([ar, ac]) => ar === r && ac === c,
            );

            // Distinguish between classic and new attack patterns
            // For Pawns, classic is r-1, new is r+2. For others, we use move patterns as a guide.
            const isPawn = unitType === PIECES.PAWN;
            const isNewAttackFound = isPawn
              ? isAttackFound && r !== centerRow - 1
              : isAttackFound && isNewMoveFound;
            const isClassicAttackFound = isAttackFound && !isNewAttackFound;

            const isMove = mode !== "new" && isMoveFound;
            const isNewMove = mode !== "classic" && isNewMoveFound;

            // A square is shown as an 'Attack' (red) only if it's NOT a primary move square in the current mode
            const isAttack =
              mode === "both"
                ? isAttackFound && !isMoveFound && !isNewMoveFound
                : mode === "classic"
                  ? isClassicAttackFound && !isMoveFound
                  : isNewAttackFound && !isNewMoveFound;

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
                {isPromotionRow && !isMove && !isNewMove && !isAttack && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500/40" />
                  </div>
                )}

                {/* Center Piece */}
                {isCenter && unit && (
                  getIcon(unit, "dark:text-slate-900 text-white", 18)
                )}

                {/* Move Indicators - Square-y style */}
                {(isMove || isNewMove || isAttack) && (
                  <div
                    className={`absolute inset-[1px] z-10 rounded-sm shadow-sm flex items-center justify-center transition-all ${
                      isNewMove
                        ? "bg-amber-500 animate-pulse"
                        : isAttack
                          ? "bg-brand-red"
                          : isTerrainCell
                            ? terrainInfo?.color?.headerBg || "bg-emerald-500"
                            : "bg-emerald-500"
                    }`}
                  >
                    {isAttack && (
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

                {/* Terrain Decor & Logic */}
                {isTerrainCell && !isCenter && !isMove && !isNewMove && !isAttack && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    {!canTraverse ? (
                      <X className="w-3 h-3 text-brand-red/60" strokeWidth={4} />
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
