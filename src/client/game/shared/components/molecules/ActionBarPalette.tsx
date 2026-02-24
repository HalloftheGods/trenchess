import React from "react";
import { ActionBarSlot } from "../atoms/ActionBarSlot";

interface PaletteItem {
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
    <div className={`flex flex-col items-center gap-1 ${className}`}>
      <div className="flex items-center gap-1.5">
        {items.map((item) => (
          <ActionBarSlot
            key={item.key}
            label={item.label}
            badge={item.badge}
            active={item.active}
            disabled={item.disabled}
            onClick={item.onClick}
          >
            {item.icon}
          </ActionBarSlot>
        ))}
      </div>
      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
        {title}
      </span>
    </div>
  );
};
