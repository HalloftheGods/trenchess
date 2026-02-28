import React from "react";
import { Lock, LockOpen } from "lucide-react";
import { ActionBarSlot } from "../atoms";
import { ActionBarPalette, type PaletteItem } from ".";
import { TCFlex } from "@/shared/components/atoms/ui/TCFlex";

interface ChessmanMoleculeProps {
  chessLocked: boolean;
  setChessLocked: (locked: boolean) => void;
  unitsPlaced: number;
  totalUnits: number;
  items: PaletteItem[];
  hideTitle?: boolean;
}

export const ChessmanMolecule: React.FC<ChessmanMoleculeProps> = ({
  chessLocked,
  setChessLocked,
  unitsPlaced,
  totalUnits,
  items,
  hideTitle,
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
        title={hideTitle ? "" : `Chessmen ${unitsPlaced}/${totalUnits}`}
        items={items}
      />
    </TCFlex>
  );
};
