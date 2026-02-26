import React from "react";
import { Lock, LockOpen } from "lucide-react";
import { ActionBarSlot } from "../atoms";
import { ActionBarPalette, type PaletteItem } from "../molecules";
import { TCFlex } from "@/shared/components/atoms/ui/TCFlex";

interface ChessmanOrganismProps {
  chessLocked: boolean;
  setChessLocked: (locked: boolean) => void;
  unitsPlaced: number;
  totalUnits: number;
  items: PaletteItem[];
}

export const ChessmanOrganism: React.FC<ChessmanOrganismProps> = ({
  chessLocked,
  setChessLocked,
  unitsPlaced,
  totalUnits,
  items,
}) => {
  return (
    <TCFlex align="start" gap={1}>
      <ActionBarSlot
        label={chessLocked ? "Unlock" : "Lock"}
        active={chessLocked}
        onClick={() => setChessLocked(!chessLocked)}
      >
        {chessLocked ? (
          <Lock size={20} className="text-amber-400" />
        ) : (
          <LockOpen size={20} className="text-slate-400" />
        )}
      </ActionBarSlot>
      <ActionBarPalette
        title={`Chessmen ${unitsPlaced}/${totalUnits}`}
        items={items}
      />
    </TCFlex>
  );
};
