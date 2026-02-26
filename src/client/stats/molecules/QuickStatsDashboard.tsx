import React from "react";
import { Zap, Target, Crosshair } from "lucide-react";
import { Flex } from "@/shared/components/atoms/Flex";
import { QuickStatItem } from "./QuickStatItem";
import type { MatchStatEntry } from "@/shared/types";

interface QuickStatsDashboardProps {
  unitStats: Record<string, MatchStatEntry>;
}

export const QuickStatsDashboard: React.FC<QuickStatsDashboardProps> = ({
  unitStats,
}) => {
  if (!unitStats) return null;

  const allDefenders = Object.values(unitStats);
  const totalSims = allDefenders.reduce((acc, s) => acc + s.total, 0);
  const totalCaptures = allDefenders.reduce((acc, s) => acc + s.captures, 0);
  const overallRate = totalSims > 0 ? (totalCaptures / totalSims) * 100 : 0;

  // Find top target
  let topTarget = "None";
  let maxRate = -1;
  Object.entries(unitStats).forEach(([name, stats]) => {
    if (stats.rate > maxRate) {
      maxRate = stats.rate;
      topTarget = name;
    }
  });

  return (
    <Flex align="center" gap={8} className="h-full transition-all duration-500">
      <QuickStatItem
        icon={<Zap size={12} className="text-amber-500/70" />}
        label="Unit Sims"
        value={(totalSims / 1000000).toFixed(1) + "M"}
      />

      <QuickStatItem
        icon={<Target size={12} className="text-blue-500/70" />}
        label="Avg Threat"
        value={overallRate.toFixed(1) + "%"}
        valueColor="text-blue-400"
      />

      <QuickStatItem
        icon={<Crosshair size={12} className="text-emerald-500/70" />}
        label="Top Target"
        value={topTarget.charAt(0).toUpperCase() + topTarget.slice(1)}
        align="end"
        valueColor="text-emerald-400"
      />
    </Flex>
  );
};
