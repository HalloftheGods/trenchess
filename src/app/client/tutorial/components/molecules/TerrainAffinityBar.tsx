import React from "react";
import { TerrainBadge } from "../atoms/TerrainBadge";
import { SectionLabel } from "../atoms/Typography";

export interface TerrainAffinityItem {
  name: string;
  icon?: React.ElementType;
  bg?: string;
  text?: string;
  border?: string;
  ring?: string;
  isProtected: boolean;
  canTraverse: boolean;
}

interface TerrainAffinityBarProps {
  items: TerrainAffinityItem[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  shieldBorderColor?: string;
  shieldTextColor?: string;
  subtextColor: string;
  darkMode: boolean;
}

export const TerrainAffinityBar: React.FC<TerrainAffinityBarProps> = ({
  items,
  selectedIndex,
  onSelect,
  shieldBorderColor,
  shieldTextColor,
  subtextColor,
  darkMode,
}) => {
  return (
    <div className="mt-auto w-full flex flex-col items-center gap-5">
      <SectionLabel
        label="Trench Affinity"
        subtextColor={subtextColor}
        darkMode={darkMode}
      />

      <div className="flex gap-3">
        {items.map((t, idx) => (
          <TerrainBadge
            key={idx}
            icon={t.icon}
            bg={t.bg}
            text={t.text}
            border={t.border}
            ring={t.ring}
            isProtected={t.isProtected}
            canTraverse={t.canTraverse}
            isActive={idx === selectedIndex}
            onClick={() => onSelect(idx)}
            shieldBorderColor={shieldBorderColor}
            shieldTextColor={shieldTextColor}
          />
        ))}
      </div>
    </div>
  );
};
