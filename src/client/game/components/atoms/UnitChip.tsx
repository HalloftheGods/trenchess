import React from "react";
import { ShieldPlus, Ban, Zap } from "lucide-react";
import { INITIAL_ARMY } from "@/core/data/unitDetails";
import { unitColorMap } from "@/core/data/unitDetails";
import { CHESS_NAME } from "@/shared/constants/intel.constants";
import type { PieceStyle } from "@/shared/constants/unit.constants";

interface UnitChipProps {
  pieceKey: string;
  status: "allow" | "block" | "sanctuary";
  isActive: boolean;
  pieceStyle: PieceStyle;
  onClick?: () => void;
}

const getUnitIcon = (pieceKey: string, pieceStyle: PieceStyle) => {
  const unit = INITIAL_ARMY.find((u) => u.type === pieceKey);
  if (!unit) return null;
  if (pieceStyle === "lucide") {
    const Icon = unit.lucide;
    return <Icon className="w-full h-full" />;
  }
  if (pieceStyle === "custom") {
    const Icon = unit.custom;
    return <Icon className="w-full h-full" />;
  }
  return (
    <span className="text-lg leading-none">
      {unit[pieceStyle as "emoji" | "bold" | "outlined"]}
    </span>
  );
};

export const UnitChip: React.FC<UnitChipProps> = ({
  pieceKey,
  status,
  isActive,
  pieceStyle,
  onClick,
}) => {
  const unit = INITIAL_ARMY.find((u) => u.type === pieceKey);
  if (!unit) return null;

  const colors = unitColorMap[pieceKey];
  const isSanctuary = status === "sanctuary";
  const isBlock = status === "block";
  const chessInfo = CHESS_NAME[pieceKey];

  return (
    <div
      key={pieceKey}
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all cursor-pointer hover:scale-[1.02] ${
        isActive ? "ring-2 ring-white/20 shadow-lg" : ""
      } ${
        isBlock
          ? "bg-brand-red/5 border-brand-red/20 opacity-60"
          : isSanctuary
            ? `${colors.bg} ${colors.border} border-double border-4`
            : `${colors.bg} ${colors.border}`
      }`}
    >
      <div
        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
          isBlock ? "text-slate-500" : colors.text
        }`}
      >
        {getUnitIcon(pieceKey, pieceStyle)}
      </div>
      <div className="flex-1 min-w-0">
        <span
          className={`block text-xs font-black uppercase tracking-wider leading-none mb-0.5 ${
            isBlock ? "text-slate-500" : colors.text
          }`}
        >
          {chessInfo?.chess || unit.type}
        </span>
        <span
          className={`text-[10px] font-bold uppercase tracking-widest ${
            isBlock
              ? "text-red-400"
              : isSanctuary
                ? "text-amber-400"
                : "text-emerald-400"
          }`}
        >
          {isBlock ? "✗ Blocked" : isSanctuary ? "⚔ Sanctuary" : "✓ Can Enter"}
        </span>
      </div>
      <div className="shrink-0">
        {isBlock ? (
          <Ban size={16} className="text-red-400/60" />
        ) : isSanctuary ? (
          <ShieldPlus size={16} className="text-amber-400/80" />
        ) : (
          <Zap size={16} className={`${colors.text} opacity-60`} />
        )}
      </div>
    </div>
  );
};
