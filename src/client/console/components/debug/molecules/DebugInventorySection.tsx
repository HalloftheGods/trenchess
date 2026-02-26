import React from "react";
import { AccordionSection } from "@/shared/components/atoms";
import { DebugRow } from "./DebugRow";

interface DebugInventorySectionProps {
  isOpen: boolean;
  onToggle: () => void;
  title: string;
  inventory: Record<string, number>;
  colorClass?: string;
}

export const DebugInventorySection: React.FC<DebugInventorySectionProps> = ({
  isOpen,
  onToggle,
  title,
  inventory,
  colorClass = "text-emerald-400",
}) => {
  const items = Object.entries(inventory);
  if (items.length === 0) return null;

  return (
    <AccordionSection title={title} isOpen={isOpen} onToggle={onToggle}>
      <div className="space-y-1 py-1">
        {items.map(([type, count]) => (
          <DebugRow key={type} label={type}>
            <span className={count > 0 ? colorClass : "text-slate-600"}>
              {count}
            </span>
          </DebugRow>
        ))}
      </div>
    </AccordionSection>
  );
};

export default DebugInventorySection;
