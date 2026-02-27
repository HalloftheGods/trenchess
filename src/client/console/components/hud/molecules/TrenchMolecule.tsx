import React from "react";
import { Lock, LockOpen } from "lucide-react";
import { ActionBarSlot } from "../atoms";
import { ActionBarPalette, type PaletteItem } from "../molecules";
import { TCFlex } from "@/shared/components/atoms/ui/TCFlex";

interface TrenchMoleculeProps {
  trenchLocked: boolean;
  setTrenchLocked: (locked: boolean) => void;
  placedCount: number;
  maxPlacement: number;
  items: PaletteItem[];
  hideTitle?: boolean;
}

export const TrenchMolecule: React.FC<TrenchMoleculeProps> = ({
  trenchLocked,
  setTrenchLocked,
  placedCount,
  maxPlacement,
  items,
  hideTitle,
}) => {
  return (
    <TCFlex align="start" gap={1}>
      <ActionBarSlot
        label={trenchLocked ? "Unlock" : "Lock"}
        active={trenchLocked}
        onClick={() => setTrenchLocked(!trenchLocked)}
      >
        {trenchLocked ? (
          <Lock size={20} className="text-amber-400" />
        ) : (
          <LockOpen size={20} className="text-slate-400" />
        )}
      </ActionBarSlot>
      <ActionBarPalette
        title={hideTitle ? "" : `Trench ${placedCount}/${maxPlacement}`}
        items={items}
      />
    </TCFlex>
  );
};
