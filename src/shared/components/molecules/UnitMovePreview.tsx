import React from "react";
import { Columns4 } from "lucide-react";
import { UNIT_DETAILS, PIECES, INITIAL_ARMY } from "@/core/data/unitDetails";
import { TERRAIN_DETAILS } from "@/core/data/terrainDetails";

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
  const details = UNIT_DETAILS[unitType];
  if (!details) return null;

  const unit = INITIAL_ARMY.find((u) => u.type === unitType);
  const PieceIcon = unit?.lucide;

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

            // Terrain rows: 1 in front, 1 in back
            const isFrontRow = r === centerRow - 1;
            const isBackRow = r === centerRow + 1;
            const isTerrainCell = selectedTerrain && (isFrontRow || isBackRow);

            const isMoveFound = moves.some(([mr, mc]) => mr === r && mc === c);
            const isNewMoveFound = newMoves.some(
              ([nr, nc]) => nr === r && nc === c,
            );
            const isAttackFound = attacks.some(
              ([ar, ac]) => ar === r && ac === c,
            );

            // In standard chess, only Pawns have distinct attack capture patterns.
            const isClassicAttack =
              isAttackFound && !isNewMoveFound && unitType === PIECES.PAWN;
            const isNewAttack = isAttackFound && !isClassicAttack;

            const isMove = mode !== "new" && isMoveFound;
            const isNewMove = mode !== "classic" && isNewMoveFound;
            const isAttack =
              mode === "both"
                ? isAttackFound
                : mode === "classic"
                  ? isClassicAttack
                  : isNewAttack;

            const isPromotionRow = unitType === PIECES.PAWN && r === 0;

            const isEven = (r + c) % 2 === 0;
            const baseColor = isEven
              ? "bg-slate-100/60 dark:bg-white/10"
              : "bg-slate-200/60 dark:bg-white/[0.04]";

            const terrainBg = terrainInfo?.color.bg || "";

            return (
              <div
                key={i}
                className={`w-3 h-3 sm:w-4 sm:h-4 rounded-[1px] relative flex items-center justify-center transition-all duration-300 ${
                  isCenter
                    ? "bg-slate-800 dark:bg-white z-20 shadow-lg scale-110"
                    : isAttack
                      ? "bg-brand-red shadow-[0_0_15px_rgba(239,68,68,0.4)] z-10"
                      : isNewMove
                        ? "bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.4)] z-10 animate-pulse"
                        : isMove
                          ? "bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)] z-10"
                          : isPromotionRow
                            ? "bg-amber-500/20"
                            : isTerrainCell
                              ? `${terrainBg} z-0`
                              : baseColor
                }`}
              >
                {isPromotionRow && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500/40" />
                  </div>
                )}
                {isAttack && !isCenter && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Columns4
                      className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white/90"
                      strokeWidth={2.5}
                    />
                  </div>
                )}
                {isCenter && PieceIcon && (
                  <PieceIcon
                    size={16}
                    className="dark:text-slate-900 text-white"
                  />
                )}
                {isTerrainCell && TerrainIcon && terrainInfo && (
                  <TerrainIcon
                    size={12}
                    className={`${terrainInfo.color.text} opacity-60`}
                  />
                )}
              </div>
            );
          },
        )}
      </div>
    </div>
  );
};
