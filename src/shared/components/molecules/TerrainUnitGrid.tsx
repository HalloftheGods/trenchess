import React from "react";
import { INITIAL_ARMY, unitColorMap } from "@/client/game/theme";
import { UnitMovePreview } from "@/shared/components/molecules/UnitMovePreview";
import type { TerrainDetail } from "@/core/primitives/terrain";
import type { PieceType } from "@/shared/types/game";

interface TerrainUnitGridProps {
  terrain: TerrainDetail;
}

interface UnitPreviewCellProps {
  pieceKey: string;
  terrainKey: string;
}

const UnitPreviewCell: React.FC<UnitPreviewCellProps> = ({
  pieceKey,
  terrainKey,
}) => {
  const colors = unitColorMap[pieceKey];
  const unit = INITIAL_ARMY.find((u) => u.type === pieceKey);
  if (!unit || !colors) return null;
  const Icon = unit.lucide;

  return (
    <div className="flex flex-col items-center gap-2">
      <UnitMovePreview
        unitType={pieceKey}
        mode="both"
        selectedTerrain={terrainKey}
        previewGridSize={7}
        centerRow={3}
        centerCol={3}
      />
      <div className={`flex items-center gap-1 ${colors.text}`}>
        <Icon className="w-3 h-3" />
        <span className="text-[8px] font-bold uppercase tracking-widest">
          {unit.type}
        </span>
      </div>
    </div>
  );
};

const SectionLabel: React.FC<{ label: string; dimmed?: boolean }> = ({
  label,
  dimmed,
}) => (
  <span
    className={`text-[9px] font-bold uppercase tracking-[0.15em] whitespace-nowrap ${
      dimmed
        ? "text-slate-500/60 dark:text-slate-600/60"
        : "text-slate-500 dark:text-slate-400"
    }`}
  >
    {label}
  </span>
);

export const TerrainUnitGrid: React.FC<TerrainUnitGridProps> = ({
  terrain,
}) => {
  const welcomedUnits = terrain.sanctuaryUnits as (PieceType | string)[];
  const refusedUnits = terrain.blockedUnits as (PieceType | string)[];

  return (
    <div className="flex flex-col gap-8 w-full">
      {welcomedUnits.length > 0 && (
        <div className="flex flex-col gap-4">
          <SectionLabel label="Welcomes" />
          <div className="flex flex-row flex-wrap gap-6 justify-start">
            {welcomedUnits.map((pk) => (
              <UnitPreviewCell
                key={`welcome-${pk}`}
                pieceKey={pk as string}
                terrainKey={terrain.key}
              />
            ))}
          </div>
        </div>
      )}

      {refusedUnits.length > 0 && (
        <div className="flex flex-col gap-4">
          <SectionLabel label="Refuses" dimmed />
          <div className="flex flex-row flex-wrap gap-6 justify-start opacity-40">
            {refusedUnits.map((pk) => (
              <UnitPreviewCell
                key={`refuse-${pk}`}
                pieceKey={pk as string}
                terrainKey={terrain.key}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TerrainUnitGrid;
