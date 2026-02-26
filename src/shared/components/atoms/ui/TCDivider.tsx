import React from "react";

interface TCDividerProps {
  orientation?: "horizontal" | "vertical";
  className?: string;
}

export const TCDivider: React.FC<TCDividerProps> = ({
  orientation = "vertical",
  className = "",
}) => {
  const baseStyles = "bg-white/10 opacity-50";

  const orientationStyles =
    orientation === "vertical" ? "w-px h-10 mx-1" : "h-px w-full my-1";

  const combinedClassName = `${baseStyles} ${orientationStyles} ${className}`;

  return <div className={combinedClassName} />;
};
