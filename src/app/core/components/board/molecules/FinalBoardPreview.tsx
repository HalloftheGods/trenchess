import React from "react";
import {
  BOARD_SIZE,
  PLAYER_CONFIGS,
  INITIAL_ARMY,
  TERRAIN_INTEL,
} from "@constants";
import type { BoardPiece, TerrainType, GameMode } from "@tc.types/game";

interface FinalBoardPreviewProps {
  board: (BoardPiece | null)[][];
  terrain: TerrainType[][];
  mode: GameMode;
}

export const FinalBoardPreview: React.FC<FinalBoardPreviewProps> = ({
  board,
  terrain,
  mode,
}) => {
  const cells = [];

  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      const piece = board[r][c];
      const terr = terrain[r][c];
      const isAlt = (r + c) % 2 === 1;

      // territory tints
      const isTop = r < 6;
      const isLeft = c < 6;
      const territoryTint =
        mode === "2p-ns"
          ? isTop
            ? "bg-red-500/10"
            : "bg-blue-500/10"
          : mode === "2p-ew"
            ? isLeft
              ? "bg-emerald-500/10"
              : "bg-yellow-500/10"
            : isTop && isLeft
              ? "bg-red-500/10"
              : isTop && !isLeft
                ? "bg-yellow-500/10"
                : !isTop && isLeft
                  ? "bg-emerald-500/10"
                  : "bg-blue-500/10";

      const terrainInfo = TERRAIN_INTEL[terr];
      const cellClass =
        terr !== "flat" && terrainInfo
          ? `${terrainInfo.bg.replace("/10", "/60")} shadow-inner`
          : `${isAlt ? "bg-slate-800/40 dark:bg-black/20" : "bg-slate-700/40 dark:bg-white/5"} ${territoryTint}`;

      cells.push(
        <div
          key={`${r}-${c}`}
          className={`${cellClass} w-full h-full rounded-[1px] relative flex items-center justify-center`}
        >
          {piece && (
            <div
              className={`text-[8px] sm:text-[10px] ${PLAYER_CONFIGS[piece.player]?.text || "text-white"} font-black`}
            >
              {INITIAL_ARMY.find((u) => u.type === piece.type)?.bold || "•"}
            </div>
          )}
        </div>,
      );
    }
  }

  return (
    <div className="w-full max-w-[400px] aspect-square grid grid-cols-12 gap-[1px] bg-slate-950 border-4 border-slate-800 rounded-3xl overflow-hidden p-2 shadow-2xl">
      {cells}
    </div>
  );
};
