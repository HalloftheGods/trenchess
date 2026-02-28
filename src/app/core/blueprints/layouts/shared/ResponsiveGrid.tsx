import React from "react";
import type { ReactNode } from "react";
import { TCGrid } from "@atoms/ui";

interface ResponsiveGridProps {
  children: ReactNode;
}

export const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({ children }) => (
  <TCGrid cols={1} lgCols={12} gap={6} className="w-full items-start">
    {children}
  </TCGrid>
);
