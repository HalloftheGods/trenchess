import React from "react";
import { Box } from "@/shared/components/atoms/Box";

interface StatBarProps {
  rate: number;
  colorClass: string;
}

export const StatBar: React.FC<StatBarProps> = ({ rate, colorClass }) => {
  return (
    <Box className="w-full h-3 bg-white/5 rounded-full overflow-hidden mt-2 border border-white/10 shadow-inner">
      <Box
        className={`h-full rounded-full transition-all duration-1000 ease-out ${colorClass}`}
        style={{ width: `${Math.max(rate, 2)}%` }}
      />
    </Box>
  );
};
