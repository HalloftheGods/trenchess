import React from "react";
import { INITIAL_ARMY, PLAYER_CONFIGS } from "@constants";
import type { ArmyUnit, PieceType, SetupMode } from "@/shared/types/game";

interface DeploymentUnitPaletteProps {
  turn: string;
  inventory: Record<string, PieceType[]>;
  placementPiece: PieceType | null;
  setPlacementPiece: (piece: PieceType | null) => void;
  setPlacementTerrain: (terrain: null) => void;
  setSetupMode: (mode: SetupMode) => void;
  pieceStyle: string;
  getIcon: (
    unit: ArmyUnit,
    className?: string,
    size?: number | string,
    filled?: boolean,
  ) => React.ReactNode;
}

export const DeploymentUnitPalette: React.FC<DeploymentUnitPaletteProps> = ({
  turn,
  inventory,
  placementPiece,
  setPlacementPiece,
  setPlacementTerrain,
  setSetupMode,
  pieceStyle,
  getIcon,
}) => {
  return (
    <div className="grid grid-cols-2 gap-2">
      {INITIAL_ARMY.map((unit, i) => {
        const count =
          (inventory[turn]?.filter((u) => u === unit.type) || []).length || 0;

        // Determine tile style based on player color
        const pColor = PLAYER_CONFIGS[turn].color;
        const r = Math.floor(i / 2);
        const c = i % 2;
        const isAlt = (r + c) % 2 === 1;

        let tileBg = isAlt ? "bg-slate-800/60" : "bg-slate-700/60"; // Fallback

        if (pColor === "brand-red") {
          tileBg = isAlt ? "bg-red-950/60" : "bg-red-900/40";
        } else if (pColor === "brand-blue") {
          tileBg = isAlt ? "bg-blue-950/60" : "bg-blue-900/40";
        } else if (pColor === "yellow") {
          tileBg = isAlt ? "bg-yellow-950/60" : "bg-yellow-900/40";
        } else if (pColor === "green") {
          tileBg = isAlt ? "bg-emerald-950/60" : "bg-emerald-900/40";
        }

        const isActive = placementPiece === unit.type;

        return (
          <button
            key={unit.type}
            disabled={count === 0}
            onClick={() => {
              setPlacementPiece(unit.type);
              setPlacementTerrain(null);
              setSetupMode("pieces");
            }}
            className={`relative aspect-square p-2 rounded-xl border transition-all flex flex-col items-center justify-center gap-0 ${isActive ? "border-white scale-105 z-10 shadow-xl" : "border-transparent opacity-80 hover:opacity-100 hover:scale-[1.02]"} ${tileBg} ${count === 0 ? "cursor-not-allowed contrast-50" : "cursor-pointer"}`}
          >
            <div
              className={`flex items-center justify-center w-full h-full ${count === 0 ? "grayscale opacity-40" : ""}`}
            >
              {getIcon(
                unit,
                ["custom", "lucide"].includes(pieceStyle)
                  ? `w-[75%] h-[75%] ${PLAYER_CONFIGS[turn].text} drop-shadow-md`
                  : `text-3xl ${PLAYER_CONFIGS[turn].text} drop-shadow-md`,
              )}
            </div>
            <span className="absolute top-2 right-2 w-6 h-6 bg-slate-900/80 rounded-full text-[10px] flex items-center justify-center font-black border border-white/20 text-white shadow-sm backdrop-blur-sm">
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
};
