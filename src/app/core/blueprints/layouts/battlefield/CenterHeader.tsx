import React from "react";
import type { ReactNode } from "react";

interface CenterHeaderProps {
  children: ReactNode;
}

export const CenterHeader: React.FC<CenterHeaderProps> = ({ children }) => (
  <div className="absolute top-6 left-0 right-0 z-[120] flex flex-col items-center pointer-events-none">
    <div className="pointer-events-auto">{children}</div>
  </div>
);
