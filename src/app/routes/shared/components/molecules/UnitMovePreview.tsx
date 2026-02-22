import React from "react";
import { UNIT_DETAILS } from "@engineConfigs/unitDetails";
import { PIECES } from "@engineConfigs/unitDetails";

interface UnitMovePreviewProps {
  unitType: string;
  previewGridSize?: number;
  centerRow?: number;
  centerCol?: number;
  className?: string;
}

export const UnitMovePreview: React.FC<UnitMovePreviewProps> = ({
  unitType,
  previewGridSize = 9,
  centerRow = 4,
  centerCol = 4,
  className = "w-40 h-40 sm:w-48 sm:h-48",
}) => {
  const details = UNIT_DETAILS[unitType];
  if (!details) return null;

  const movePattern = details.movePattern;
  const moves = movePattern(centerRow, centerCol);
  const newMoves = details.newMovePattern
    ? details.newMovePattern(centerRow, centerCol)
    : [];
  const attacks = details.attackPattern
    ? details.attackPattern(centerRow, centerCol)
    : [];

  return (
    <div className="bg-slate-100 dark:bg-white/5 rounded-2xl p-3 border border-slate-200 dark:border-white/5 w-fit shadow-inner mx-auto lg:mx-0">
      <div
        className={`grid gap-[1px] ${className}`}
        style={{ gridTemplateColumns: `repeat(${previewGridSize}, 1fr)` }}
      >
        {Array.from({ length: previewGridSize * previewGridSize }).map(
          (_, i) => {
            const r = Math.floor(i / previewGridSize);
            const c = i % previewGridSize;
            const isCenter = r === centerRow && c === centerCol;
            const isMove = moves.some(([mr, mc]) => mr === r && mc === c);
            const isAttack = attacks.some(([ar, ac]) => ar === r && ac === c);
            const isPromotionRow = unitType === PIECES.PAWN && r === 0;

            const isEven = (r + c) % 2 === 0;
            const baseColor = isEven
              ? "bg-slate-100/60 dark:bg-white/10"
              : "bg-slate-200/60 dark:bg-white/[0.04]";

            return (
              <div
                key={i}
                className={`aspect-square rounded-[1px] relative flex items-center justify-center transition-all duration-300 ${
                  isCenter
                    ? "bg-slate-800 dark:bg-white z-20 shadow-lg scale-110"
                    : isAttack
                      ? "bg-brand-red shadow-[0_0_15px_rgba(239,68,68,0.4)] z-10"
                      : newMoves.some(([nr, nc]) => nr === r && nc === c)
                        ? "bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.4)] z-10 animate-pulse"
                        : isMove
                          ? "bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)] z-10"
                          : isPromotionRow
                            ? "bg-amber-500/20"
                            : baseColor
                }`}
              >
                {isPromotionRow && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500/40" />
                  </div>
                )}
                {isCenter && (
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${isCenter && "dark:bg-black bg-white"}`}
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
