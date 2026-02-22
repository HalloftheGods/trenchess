import React from "react";
import { INITIAL_ARMY, unitColorMap } from "@engineConfigs/unitDetails";
import { CHESS_NAME } from "./UnitChip";
import type { TerrainDetail } from "@engineConfigs/terrainDetails";

interface SanctuaryBadgeListProps {
  terrain: TerrainDetail;
}

export const SanctuaryBadgeList: React.FC<SanctuaryBadgeListProps> = ({
  terrain,
}) => {
  return (
    <div className="flex gap-2 flex-wrap justify-center">
      {terrain.sanctuaryUnits.map((pk: string) => {
        const colors = unitColorMap[pk];
        const unit = INITIAL_ARMY.find((u: any) => u.type === pk);
        if (!colors || !unit) return null;
        const Icon = unit.lucide;
        return (
          <div
            key={`badge-${pk}`}
            title={CHESS_NAME[pk]?.chess || pk}
            className={`unit-badge-base ${colors.bg} ${colors.text} ${colors.border}`}
          >
            <div className="w-6 h-6">
              <Icon className="w-full h-full" />
            </div>
          </div>
        );
      })}
    </div>
  );
};
