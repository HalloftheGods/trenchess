import React from "react";
import { Ban, ShieldPlus, Zap } from "lucide-react";
import { INITIAL_ARMY, unitColorMap } from "@/core/data/unitDetails";

import { CHESS_NAME } from "@/shared/constants/unit.constants";

interface UnitChipProps {
  pieceKey: string;
  status: "allow" | "block" | "sanctuary";
}

export const UnitChip: React.FC<UnitChipProps> = ({ pieceKey, status }) => {
  const unit = INITIAL_ARMY.find((u) => u.type === pieceKey);
  if (!unit) return null;
  const colors = unitColorMap[pieceKey];
  const isSanctuary = status === "sanctuary";
  const isBlock = status === "block";
  const chessInfo = CHESS_NAME[pieceKey];

  const Icon = unit.lucide;

  return (
    <div
      className={`chip-base ${
        isBlock
          ? "bg-red-500/5 border-red-500/20 opacity-60"
          : isSanctuary
            ? `${colors.bg} ${colors.border} border-double border-4`
            : `${colors.bg} ${colors.border}`
      }`}
    >
      <div
        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${isBlock ? "text-slate-500" : colors.text}`}
      >
        <Icon className="w-full h-full" />
      </div>
      <div className="flex-1 min-w-0">
        <span
          className={`unit-name-label mb-0.5 ${isBlock ? "text-slate-500" : colors.text}`}
        >
          {chessInfo?.chess || unit.type}
        </span>
        <span
          className={`status-label ${isBlock ? "text-brand-red" : isSanctuary ? "text-amber-400" : "text-emerald-400"}`}
        >
          {isBlock ? "✗ Blocked" : isSanctuary ? "⚔ Sanctuary" : "✓ Can Enter"}
        </span>
      </div>
      <div className="shrink-0">
        {isBlock ? (
          <Ban size={16} className="text-brand-red/60" />
        ) : isSanctuary ? (
          <ShieldPlus size={16} className="text-amber-400/80" />
        ) : (
          <Zap size={16} className={`${colors.text} opacity-60`} />
        )}
      </div>
    </div>
  );
};
