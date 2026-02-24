import React from "react";
import { PanelCard } from "../atoms/PanelCard";
import { SectionRibbon } from "../atoms/SectionRibbon";
import TerrainMovePreview from "@/client/game/shared/components/organisms/TerrainMovePreview";
import { LayoutPicker } from "../molecules/LayoutPicker";

interface SimulationPreviewProps {
  darkMode: boolean;
  selectedUnit: string;
  selectedTerrainIdx: number;
  terrainPositions: Set<string> | undefined;
  activeLayoutLabel: string;
  activeLayoutIdx: number;
  filteredSeedsLength: number;
  handlePrevLayout: () => void;
  handleNextLayout: () => void;
  cardBg: string;
}

export const SimulationPreview: React.FC<SimulationPreviewProps> = ({
  darkMode,
  selectedUnit,
  selectedTerrainIdx,
  terrainPositions,
  activeLayoutLabel,
  activeLayoutIdx,
  filteredSeedsLength,
  handlePrevLayout,
  handleNextLayout,
  cardBg,
}) => {
  return (
    <div className="h-full flex flex-col relative w-full">
      <PanelCard className={`border-4 border-brand-blue/60 ${cardBg}`}>
        <SectionRibbon label="Trenchess" bgClass="bg-brand-blue/80" />

        <div className="h-full">
          <TerrainMovePreview
            darkMode={darkMode}
            selectedUnit={selectedUnit}
            selectedTerrainIdx={selectedTerrainIdx}
            terrainPositions={terrainPositions}
          />
        </div>

        <LayoutPicker
          label={activeLayoutLabel}
          currentIndex={activeLayoutIdx}
          totalItems={filteredSeedsLength}
          onPrev={handlePrevLayout}
          onNext={handleNextLayout}
          disabled={filteredSeedsLength === 0}
        />
      </PanelCard>
    </div>
  );
};
