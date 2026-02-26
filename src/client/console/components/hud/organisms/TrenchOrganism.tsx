import React from "react";
import { Lock, LockOpen } from "lucide-react";
import { ActionBarSlot } from "../atoms";
import { ActionBarPalette, type PaletteItem } from "../molecules";
import { TCFlex } from "@/shared/components/atoms/ui/TCFlex";

interface TrenchOrganismProps {
  trenchLocked: boolean;
  setTrenchLocked: (locked: boolean) => void;
  placedCount: number;
  maxPlacement: number;
  items: PaletteItem[];
}

export const TrenchOrganism: React.FC<TrenchOrganismProps> = ({
  trenchLocked,
  setTrenchLocked,
  placedCount,
  maxPlacement,
  items,
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
        title={`Trench ${placedCount}/${maxPlacement}`}
        items={items}
      />
    </TCFlex>
  );
};
