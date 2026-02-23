import React from "react";
import { Box } from "@atoms";

interface CellHighlightProps {
  isSelected: boolean;
  isValid: boolean;
  isPreviewMove: boolean;
  isHovered: boolean;
  setupHighlightArea: string;
}

/**
 * CellHighlight — Atom for rendering state-based cell overlays.
 * Managed with Tailwind utilities for visual permanence.
 */
export const CellHighlight: React.FC<CellHighlightProps> = ({
  isSelected,
  isValid,
  isPreviewMove,
  isHovered,
  setupHighlightArea,
}) => {
  const selectionClass = isSelected ? "ring-4 ring-yellow-400 ring-inset z-30" : "";
  const validMoveClass = isValid ? 'after:content-[""] after:absolute after:inset-0 after:bg-emerald-500/40 after:animate-pulse z-20' : "";
  const previewMoveClass = isPreviewMove ? 'after:content-[""] after:absolute after:inset-0 after:bg-emerald-500/30 z-20' : "";
  const hoverClass = isHovered ? "ring-2 ring-white z-20" : "";

  return (
    <Box
      className={`absolute inset-0 pointer-events-none transition-all duration-300
        ${setupHighlightArea}
        ${selectionClass}
        ${validMoveClass}
        ${previewMoveClass}
        ${hoverClass}
      `}
    />
  );
};
