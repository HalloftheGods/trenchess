import React from "react";

interface PanelCardProps {
  className?: string;
  children: React.ReactNode;
}

export const PanelCard: React.FC<PanelCardProps> = ({
  className = "",
  children,
}) => (
  <div
    className={`flex-1 rounded-3xl shadow-xl relative overflow-hidden transition-all flex flex-col ${className}`}
  >
    {children}
  </div>
);
