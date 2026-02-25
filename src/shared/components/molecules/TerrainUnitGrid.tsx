import React from "react";
import { INITIAL_ARMY, unitColorMap } from "@/constants";
import { UnitMovePreview } from "@/shared/components/molecules/UnitMovePreview";
import { useRouteContext } from "@context";
import type { TerrainDetail } from "@/shared/types/game";
import type { PieceType } from "@/shared/types/game";

interface TerrainUnitGridProps {
  terrain: TerrainDetail;
}

interface UnitPreviewCellProps {
  pieceKey: string;
  terrainKey: string;
}

const UnitPreviewCell: React.FC<UnitPreviewCellProps & { size?: number }> = ({
  pieceKey,
  terrainKey,
  size = 7,
}) => {
  const { getIcon } = useRouteContext();
  const colors = unitColorMap[pieceKey];
  const unit = INITIAL_ARMY.find((u) => u.type === pieceKey);
  const center = Math.floor(size / 2);
  if (!unit || !colors) return null;

  return (
    <div className="flex flex-col items-center gap-3">
      <UnitMovePreview
        unitType={pieceKey}
        mode="both"
        selectedTerrain={terrainKey}
        previewGridSize={size}
        centerRow={center}
        centerCol={center}
      />
      <div
        className={`flex items-center gap-1.5 ${colors.text} bg-black/20 px-3 py-1 rounded-full border border-white/5`}
      >
        {getIcon(unit, "", 14)}
        <span className="text-[10px] font-black uppercase tracking-[0.1em]">
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
  <div className="flex items-center gap-4 w-full opacity-60">
    <span
      className={`text-[11px] font-black uppercase tracking-[0.3em] whitespace-nowrap ${
        dimmed ? "text-slate-500" : "text-slate-400"
      }`}
    >
      {label}
    </span>
    <div
      className={`h-px flex-1 ${dimmed ? "bg-slate-800" : "bg-slate-700"}`}
    />
  </div>
);

export const TerrainUnitGrid: React.FC<TerrainUnitGridProps> = ({
  terrain,
}) => {
  const welcomedUnits = terrain.sanctuaryUnits as (PieceType | string)[];
  const refusedUnits = terrain.blockedUnits as (PieceType | string)[];

  return (
    <div className="flex flex-col gap-12 w-full max-w-3xl">
      {welcomedUnits.length > 0 && (
        <div className="flex flex-col gap-8">
          <SectionLabel label="Welcomes" />
          <div className="flex flex-row flex-wrap gap-12 justify-center lg:justify-start pl-4">
            {welcomedUnits.map((pk) => (
              <UnitPreviewCell
                key={`welcome-${pk}`}
                pieceKey={pk as string}
                terrainKey={terrain.key}
                size={9}
              />
            ))}
          </div>
        </div>
      )}

      {refusedUnits.length > 0 && (
        <div className="flex flex-col gap-8">
          <SectionLabel label="Refuses" dimmed />
          <div className="flex flex-row flex-wrap gap-10 justify-center lg:justify-start pl-4">
            {refusedUnits.map((pk) => (
              <div
                key={`refuse-container-${pk}`}
                className="opacity-40 grayscale-[0.3] hover:opacity-100 hover:grayscale-0 transition-all duration-500"
              >
                <UnitPreviewCell
                  key={`refuse-${pk}`}
                  pieceKey={pk as string}
                  terrainKey={terrain.key}
                  size={7}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TerrainUnitGrid;
