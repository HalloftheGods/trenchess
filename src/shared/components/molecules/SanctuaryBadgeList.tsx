import React from "react";
import { INITIAL_ARMY, unitColorMap } from "@constants";
import { CHESS_NAME } from "@constants";
import { useRouteContext } from "@context";
import type { TerrainDetail } from "@/shared/types/game";
import type { ArmyUnit } from "@/shared/types/game";

interface SanctuaryBadgeListProps {
  terrain: TerrainDetail;
}

export const SanctuaryBadgeList: React.FC<SanctuaryBadgeListProps> = ({
  terrain,
}) => {
  const { getIcon } = useRouteContext();
  return (
    <div className="flex gap-2 flex-wrap justify-center">
      {terrain.sanctuaryUnits.map((pk: string) => {
        const colors = unitColorMap[pk];
        const unit = INITIAL_ARMY.find((u: ArmyUnit) => u.type === pk);
        if (!colors || !unit) return null;
        return (
          <div
            key={`badge-${pk}`}
            title={CHESS_NAME[pk]?.chess || pk}
            className={`tactical-badge ${colors.bg} ${colors.text} ${colors.border}`}
          >
            <div className="w-6 h-6">{getIcon(unit, "", 24)}</div>
          </div>
        );
      })}
    </div>
  );
};
