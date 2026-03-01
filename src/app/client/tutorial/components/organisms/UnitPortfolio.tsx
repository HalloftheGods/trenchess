import React from "react";
import { UserPlus } from "lucide-react";
import { useRouteContext } from "@context";
import { PanelCard } from "../atoms/PanelCard";
import { UnitIdentityHeader } from "../molecules/UnitIdentityHeader";
import { UnitIconSelector } from "../molecules/UnitIconSelector";
import { MiniMovePreview } from "../molecules/MiniMovePreview";
import { StatList } from "../molecules/StatList";
import { TerrainAffinityBar } from "../molecules/TerrainAffinityBar";
import type { UnitDetails, UnitColors, ArmyUnit } from "@tc.types";
import type { TerrainAffinityItem } from "../molecules/TerrainAffinityBar";

interface UnitPortfolioProps {
  selectedUnit: string | null;
  details: UnitDetails | null;
  colors: UnitColors | null;
  unit: ArmyUnit | null;
  prevUnitType: string;
  nextUnitType: string;
  prevUnitColors: UnitColors | null;
  nextUnitColors: UnitColors | null;
  PrevIcon?: React.ElementType;
  NextIcon?: React.ElementType;
  handlePrevUnit: () => void;
  handleNextUnit: () => void;
  terrainItems: TerrainAffinityItem[];
  selectedTerrainIdx: number;
  onTerrainSelect: (idx: number) => void;
  textColor: string;
  subtextColor: string;
  cardBg: string;
  borderColor: string;
  panelBorderStyle: string;
  darkMode: boolean;
}

export const UnitPortfolio: React.FC<UnitPortfolioProps> = ({
  selectedUnit,
  details,
  colors,
  unit,
  prevUnitColors,
  nextUnitColors,
  PrevIcon,
  NextIcon,
  handlePrevUnit,
  handleNextUnit,
  terrainItems,
  selectedTerrainIdx,
  onTerrainSelect,
  textColor,
  subtextColor,
  cardBg,
  borderColor,
  panelBorderStyle,
  darkMode,
}) => {
  const { getIcon } = useRouteContext();
  if (!selectedUnit || !details || !unit || !colors) {
    return (
      <div className="h-full flex flex-col relative group/panel">
        <PanelCard
          className={`p-8 border-4 ${borderColor} ${cardBg} items-center justify-center text-center opacity-60`}
        >
          <div className="p-6 rounded-full bg-slate-100 dark:bg-slate-800 mb-4">
            <UserPlus size={48} className={subtextColor} />
          </div>
          <h3 className={`text-2xl font-black uppercase ${textColor}`}>
            Select A Unit
          </h3>
          <p className={`text-sm font-bold ${subtextColor} max-w-[200px]`}>
            Choose a unit from the top bar to view its capabilities.
          </p>
        </PanelCard>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col relative group/panel">
      <PanelCard
        className={`p-8 ${panelBorderStyle} ${cardBg} ${colors.border} gap-2`}
      >
        {/* Background decoration */}
        <div
          className={`absolute -right-20 -top-20 w-64 h-64 rounded-full ${colors.bg} blur-lg opacity-20`}
        />

        <div className="flex-1 flex flex-col items-center z-10 text-center w-full">
          <UnitIdentityHeader
            role={details.role}
            title={details.title}
            subtitle={details.subtitle}
            Icon={UserPlus}
            colors={colors}
            textColor={textColor}
          />

          <div className="flex flex-row items-center gap-10 mb-6">
            <UnitIconSelector
              icon={getIcon(
                unit,
                "transition-transform group-hover:rotate-3",
                80,
              )}
              colors={colors}
              onPrev={handlePrevUnit}
              onNext={handleNextUnit}
              PrevIcon={PrevIcon}
              NextIcon={NextIcon}
              prevUnitColors={prevUnitColors}
              nextUnitColors={nextUnitColors}
            />

            <div className="flex flex-col items-center gap-2">
              <MiniMovePreview
                movePattern={details.movePattern}
                newMovePattern={details.newMovePattern}
                attackPattern={details.attackPattern}
              />
            </div>
          </div>

          {details.levelUp && (
            <StatList
              stats={details.levelUp.stats}
              colors={colors}
              subtextColor={subtextColor}
            />
          )}

          <TerrainAffinityBar
            items={terrainItems}
            selectedIndex={selectedTerrainIdx}
            onSelect={onTerrainSelect}
            subtextColor={subtextColor}
            darkMode={darkMode}
            shieldBorderColor={colors.border}
            shieldTextColor={colors.text}
          />
        </div>
      </PanelCard>
    </div>
  );
};
