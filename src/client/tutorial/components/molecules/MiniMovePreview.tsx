import React from "react";

interface MiniMovePreviewProps {
  movePattern: (r: number, c: number) => [number, number][];
  newMovePattern?: (r: number, c: number) => [number, number][];
  attackPattern?: (r: number, c: number) => [number, number][];
}

export const MiniMovePreview: React.FC<MiniMovePreviewProps> = ({
  movePattern,
  newMovePattern,
  attackPattern,
}) => {
  return (
    <div className="bg-slate-800/20 dark:bg-white/5 rounded-xl p-2 border border-white/5 w-fit shadow-inner scale-90">
      <div
        className="grid gap-[1px] w-32 h-32"
        style={{
          gridTemplateColumns: `repeat(7, 1fr)`,
        }}
      >
        {Array.from({ length: 7 * 7 }).map((_, i) => {
          const r = Math.floor(i / 7);
          const c = i % 7;
          const center = 3;
          const isCenter = r === center && c === center;

          const moves = movePattern(center, center);
          const newMoves = newMovePattern ? newMovePattern(center, center) : [];
          const attacks = attackPattern ? attackPattern(center, center) : [];

          const isMove = moves.some(([mr, mc]) => mr === r && mc === c);
          const isNewMove = newMoves.some(([mr, mc]) => mr === r && mc === c);
          const isAttack = attacks.some(([ar, ac]) => ar === r && ac === c);

          const isEven = (r + c) % 2 === 0;
          const baseColor = isEven
            ? "bg-slate-100/10 dark:bg-white/5"
            : "bg-slate-200/10 dark:bg-white/[0.02]";

          return (
            <div
              key={i}
              className={`aspect-square rounded-sm relative transition-all duration-300 ${
                isCenter
                  ? "bg-white z-20 shadow-md"
                  : isAttack
                    ? "bg-brand-red shadow-[0_0_8px_rgba(239,68,68,0.4)] z-10"
                    : isNewMove
                      ? "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)] z-10 animate-pulse"
                      : isMove
                        ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)] z-10"
                        : baseColor
              }`}
            />
          );
        })}
      </div>
    </div>
  );
};
