/*
 * Copyright (c) 2006 - 2026 Hall of the Gods, Inc.
 * All Rights Reserved.
 *
 * Subtle section divider with horizontal lines and optional animation.
 */
import React from "react";

interface SectionDividerProps {
  label: string;
  className?: string;
  color?: "slate" | "amber" | "blue" | "emerald" | "red";
  animate?: boolean;
}

const SectionDivider: React.FC<SectionDividerProps> = ({
  label,
  className = "",
  color = "slate",
  animate = false,
}) => {
  const colorMap = {
    slate: "bg-slate-200 dark:bg-slate-800",
    amber: "bg-amber-500/20",
    blue: "bg-brand-blue/20",
    emerald: "bg-emerald-500/20",
    red: "bg-brand-red/20",
  };

  const textColorMap = {
    slate: "text-slate-400",
    amber: "text-amber-500/70",
    blue: "text-brand-blue/70",
    emerald: "text-emerald-500/70",
    red: "text-brand-red/70",
  };

  const accentColorMap = {
    slate: "via-slate-400/50",
    amber: "via-amber-500",
    blue: "via-brand-blue",
    emerald: "via-emerald-500",
    red: "via-brand-red",
  };

  return (
    <div className={`section-divider-container ${className}`}>
      <div className={`section-divider-line ${colorMap[color]}`}>
        {animate && (
          <div
            className={`absolute inset-0 bg-gradient-to-r from-transparent ${accentColorMap[color]} to-transparent animate-shimmer`}
            style={{ backgroundSize: "100% 100%" }}
          />
        )}
      </div>

      <h2 className={`section-divider-label ${textColorMap[color]}`}>
        {label}
      </h2>

      <div className={`section-divider-line ${colorMap[color]}`}>
        {animate && (
          <div
            className={`absolute inset-0 bg-gradient-to-r from-transparent ${accentColorMap[color]} to-transparent animate-shimmer`}
            style={{ backgroundSize: "100% 100%" }}
          />
        )}
      </div>
    </div>
  );
};

export default SectionDivider;
