import React from "react";
import { INITIAL_ARMY, unitColorMap, PIECES } from "@constants";
import { UnitMovePreview } from "@/shared/components/molecules/UnitMovePreview";
import { useRouteContext } from "@context";
import type { TerrainDetail } from "@tc.types/game";
import type { PieceType } from "@tc.types/game";
import { Shield, XCircle } from "lucide-react";

interface TerrainUnitGridProps {
  terrain: TerrainDetail;
}

interface UnitPreviewCellProps {
  pieceKey: string;
  terrainKey: string;
  isSanctuary: boolean;
  isBlocked: boolean;
}

const UnitPreviewCell: React.FC<UnitPreviewCellProps & { size?: number }> = ({
  pieceKey,
  terrainKey,
  isSanctuary,
  isBlocked,
  size = 7,
}) => {
  const { getIcon } = useRouteContext();
  const colors = unitColorMap[pieceKey];
  const unit = INITIAL_ARMY.find((u) => u.type === pieceKey);
  const center = Math.floor(size / 2);
  if (!unit || !colors) return null;

  const statusColor = isSanctuary
    ? "text-emerald-400 border-emerald-500/30 bg-emerald-500/10"
    : isBlocked
      ? "text-red-400 border-red-500/30 bg-red-500/10"
      : "text-slate-400 border-white/5 bg-black/20";

  return (
    <div
      className={`flex flex-col items-center gap-3 p-4 rounded-2xl transition-all duration-500 group border border-transparent hover:border-white/5 ${
        isBlocked
          ? "opacity-40 grayscale-[0.8] hover:opacity-100 hover:grayscale-0"
          : "opacity-100"
      }`}
    >
      <div className="relative">
        <UnitMovePreview
          unitType={pieceKey}
          mode="both"
          selectedTerrain={terrainKey}
          previewGridSize={size}
          centerRow={center}
          centerCol={center}
        />
        {isSanctuary && (
          <div className="absolute -top-2 -right-2 bg-emerald-500 text-white p-1 rounded-full shadow-lg animate-pulse">
            <Shield size={12} strokeWidth={3} />
          </div>
        )}
        {isBlocked && (
          <div className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-lg">
            <XCircle size={12} strokeWidth={3} />
          </div>
        )}
      </div>

      <div
        className={`flex items-center gap-2 ${colors.text} bg-black/40 px-3 py-1.5 rounded-full border border-white/10 shadow-xl`}
      >
        {getIcon(unit, "", 16)}
        <span className="text-[11px] font-black uppercase tracking-[0.15em]">
          {unit.type}
        </span>
      </div>

      <div
        className={`flex items-center justify-center min-w-[100px] px-3 py-1 rounded-lg border text-[9px] font-bold uppercase tracking-widest ${statusColor} transition-colors duration-300`}
      >
        {isSanctuary ? "Sanctuary" : isBlocked ? "Blocked" : "Normal"}
      </div>
    </div>
  );
};

export const TerrainUnitGrid: React.FC<TerrainUnitGridProps> = ({
  terrain,
}) => {
  const welcomedUnits = terrain.sanctuaryUnits as (PieceType | string)[];
  const refusedUnits = terrain.blockedUnits as (PieceType | string)[];

  const { KING, QUEEN, ROOK, BISHOP, KNIGHT, PAWN } = PIECES;

  // Grid layout: 3x3
  const pieceLayout: (PieceType | null)[] = [
    KING,
    QUEEN,
    PAWN,
    ROOK,
    BISHOP,
    KNIGHT,
    null,
    null,
    null,
  ];

  return (
    <div className="w-full max-w-5xl mx-auto py-8">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-8">
        {pieceLayout.map((pk, idx) => {
          if (!pk)
            return <div key={`empty-${idx}`} className="hidden md:block" />;

          const isSanctuary = welcomedUnits.includes(pk);
          const isBlocked = refusedUnits.includes(pk);

          return (
            <UnitPreviewCell
              key={`unit-${pk}`}
              pieceKey={pk}
              terrainKey={terrain.key}
              isSanctuary={isSanctuary}
              isBlocked={isBlocked}
              size={pk === PAWN ? 7 : 9}
            />
          );
        })}
      </div>
    </div>
  );
};

export default TerrainUnitGrid;
