import React from "react";
import { Database } from "lucide-react";
import { deserializeGame } from "@utils/gameUrl";
import type { BoardPiece, TerrainType, PieceType } from "@/core/types/game";

interface SeedLibraryProps {
  librarySeeds: any[];
  setBoard?: (board: (BoardPiece | null)[][]) => void;
  setTerrain?: (terrain: TerrainType[][]) => void;
  setPlacementPiece: (piece: PieceType | null) => void;
  setPlacementTerrain: (terrain: TerrainType | null) => void;
}

export const SeedLibrary: React.FC<SeedLibraryProps> = ({
  librarySeeds,
  setBoard,
  setTerrain,
  setPlacementPiece,
  setPlacementTerrain,
}) => {
  if (librarySeeds.length === 0) return null;

  return (
    <div className="mt-4 pt-4 border-t border-slate-200 dark:border-white/10">
      <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-2">
        <Database size={12} /> Seed Library
      </h3>
      <div className="space-y-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
        {librarySeeds.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              const parsed = deserializeGame(item.seed);
              if (parsed && setBoard && setTerrain) {
                if (
                  confirm(`Load "${item.name}"? Unsaved changes will be lost.`)
                ) {
                  setBoard(parsed.board);
                  setTerrain(parsed.terrain);
                  setPlacementPiece(null);
                  setPlacementTerrain(null);
                }
              }
            }}
            className="w-full bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 rounded-xl p-3 text-left transition-all border border-transparent hover:border-slate-300 dark:hover:border-white/20 group"
          >
            <div className="font-bold text-xs text-slate-700 dark:text-slate-200 truncate group-hover:text-amber-500 transition-colors">
              {item.name}
            </div>
            <div className="text-[9px] text-slate-400 font-medium mt-1 flex justify-between">
              <span>{new Date(item.createdAt).toLocaleDateString()}</span>
              <span className="uppercase tracking-widest opacity-50">
                {item.mode}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
