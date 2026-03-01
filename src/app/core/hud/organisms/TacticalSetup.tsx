import React from "react";
import { TCFlex } from "@/shared/components/atoms/ui/TCFlex";
import { TCDivider } from "@/shared/components/atoms/ui/TCDivider";
import { TerrainSelection, UnitSelection } from "../molecules";
import type { PaletteItem } from "../atoms/ActionBarPalette";

interface TacticalSetupProps {
  trenchLocked: boolean;
  setTrenchLocked: (locked: boolean) => void;
  placedCount: number;
  maxPlacement: number;
  terrainItems: PaletteItem[];
  chessLocked: boolean;
  setChessLocked: (locked: boolean) => void;
  unitsPlaced: number;
  totalUnits: number;
  chessItems: PaletteItem[];
  hideTitles?: boolean;
}

export const TacticalSetup: React.FC<TacticalSetupProps> = ({
  trenchLocked,
  setTrenchLocked,
  placedCount,
  maxPlacement,
  terrainItems,
  chessLocked,
  setChessLocked,
  unitsPlaced,
  totalUnits,
  chessItems,
  hideTitles,
}) => {
  return (
    <TCFlex align="center" gap={4} className="transition-all duration-500">
      <TerrainSelection
        trenchLocked={trenchLocked}
        setTrenchLocked={setTrenchLocked}
        placedCount={placedCount}
        maxPlacement={maxPlacement}
        items={terrainItems}
        hideTitle={hideTitles}
      />
      <TCDivider className="h-10 mx-2 opacity-10" />
      <UnitSelection
        chessLocked={chessLocked}
        setChessLocked={setChessLocked}
        unitsPlaced={unitsPlaced}
        totalUnits={totalUnits}
        items={chessItems}
        hideTitle={hideTitles}
      />
    </TCFlex>
  );
};
