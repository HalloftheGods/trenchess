import React from "react";

interface CornerControlsProps {
  topLeft?: React.ReactNode;
  topRight?: React.ReactNode;
  bottomLeft?: React.ReactNode;
  bottomRight?: React.ReactNode;
  className?: string;
}

export const CornerControls: React.FC<CornerControlsProps> = ({
  topLeft,
  topRight,
  bottomLeft,
  bottomRight,
  className = "",
}) => {
  return (
    <div className={`pointer-events-none fixed inset-0 z-50 ${className}`}>
      {topLeft && (
        <div className="absolute top-6 left-6 md:top-8 md:left-12 lg:left-20 pointer-events-auto flex items-center gap-4">
          {topLeft}
        </div>
      )}
      {topRight && (
        <div className="absolute top-6 right-6 md:top-8 md:right-12 lg:right-20 pointer-events-auto flex items-center gap-4">
          {topRight}
        </div>
      )}
      {bottomLeft && (
        <div className="absolute bottom-6 left-6 md:bottom-8 md:left-12 lg:left-20 pointer-events-auto flex items-center gap-4">
          {bottomLeft}
        </div>
      )}
      {bottomRight && (
        <div className="absolute bottom-6 right-6 md:bottom-8 md:right-12 lg:right-20 pointer-events-auto flex items-center gap-4">
          {bottomRight}
        </div>
      )}
    </div>
  );
};
