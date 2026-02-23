import React from "react";
import { TERRAIN_TYPES } from "@/core/primitives/terrain";
import { PLAYER_CONFIGS, TERRAIN_INTEL } from "@/client/game/theme";
import type { TerrainType, SetupMode, PieceType } from "@/shared/types/game";

interface DeploymentTerrainPaletteProps {
  turn: string;
  terrainInventory: Record<string, TerrainType[]>;
  placementTerrain: TerrainType | null;
  setPlacementTerrain: (terrain: TerrainType | null) => void;
  setPlacementPiece: (piece: PieceType | null) => void;
  setSetupMode: (mode: SetupMode) => void;
  isZen: boolean;
  placedCount: number;
  maxPlacement: number;
}

export const DeploymentTerrainPalette: React.FC<
  DeploymentTerrainPaletteProps
> = ({
  turn,
  terrainInventory,
  placementTerrain,
  setPlacementTerrain,
  setPlacementPiece,
  setSetupMode,
  isZen,
  placedCount,
  maxPlacement,
}) => {
  return (
    <div className="grid grid-cols-2 gap-2">
      {[
        TERRAIN_TYPES.TREES,
        TERRAIN_TYPES.PONDS,
        TERRAIN_TYPES.RUBBLE,
        TERRAIN_TYPES.DESERT,
      ].map((tType, i) => {
        const count =
          (terrainInventory[turn]?.filter((u) => u === tType) || []).length ||
          0;

        const intel = TERRAIN_INTEL[tType];
        if (!intel) return null;
        const IconComp = intel.icon;

        const colorClass = intel.color || "text-stone-400";

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

        const isActive = placementTerrain === tType;

        return (
          <button
            key={tType}
            disabled={(!isZen && count === 0) || placedCount >= maxPlacement}
            title={intel.label}
            onClick={() => {
              setPlacementTerrain(tType as TerrainType);
              setPlacementPiece(null);
              setSetupMode("terrain");
            }}
            className={`relative aspect-square p-2 rounded-xl border transition-all flex flex-col items-center justify-center gap-0 ${isActive ? "border-white scale-105 z-10 shadow-xl" : "border-transparent opacity-80 hover:opacity-100 hover:scale-[1.02]"} ${tileBg} ${(!isZen && count === 0) || (isZen && placedCount >= maxPlacement) ? "cursor-not-allowed contrast-50" : "cursor-pointer"}`}
          >
            <div
              className={`flex items-center justify-center w-full h-full ${(!isZen && count === 0) || (isZen && placedCount >= maxPlacement) ? "grayscale opacity-40" : ""}`}
            >
              <IconComp
                size={48}
                className={`${colorClass} w-[75%] h-[75%] drop-shadow-md`}
              />
            </div>
            {!isZen && (
              <span className="absolute top-2 right-2 w-6 h-6 bg-slate-900/80 rounded-full text-[10px] flex items-center justify-center font-black border border-white/20 text-white shadow-sm backdrop-blur-sm">
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
