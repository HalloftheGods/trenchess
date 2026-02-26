import React from "react";
import { ActionBarSlot } from "../atoms/ActionBarSlot";
import { TCText } from "@/shared/components/atoms/ui/TCTypography";
import { TCFlex } from "@/shared/components/atoms/ui/TCFlex";

export interface PaletteItem {
  key: string;
  icon: React.ReactNode;
  label: string;
  badge?: number;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

interface ActionBarPaletteProps {
  /** Section label rendered above the row */
  title: string;
  items: PaletteItem[];
  className?: string;
}

/**
 * ActionBarPalette — a labelled horizontal strip of ActionBarSlots.
 * Used for the Trench (terrain) and Chess (units) sections in the MMO bar.
 */
export const ActionBarPalette: React.FC<ActionBarPaletteProps> = ({
  title,
  items,
  className = "",
}) => {
  return (
    <TCFlex direction="col" align="center" gap={1} className={className}>
      <TCFlex align="center" gap={1} className="px-1">
        {items.map((item, index) => (
          <ActionBarSlot
            key={item.key || `item-${index}`}
            label={item.label}
            badge={item.badge}
            active={item.active}
            disabled={item.disabled}
            onClick={item.onClick}
          >
            {item.icon}
          </ActionBarSlot>
        ))}
      </TCFlex>
      <TCText
        variant="muted"
        className="text-[10px] font-black uppercase tracking-[0.2em]"
      >
        {title}
      </TCText>
    </TCFlex>
  );
};
