import React from "react";
import { TCGrid } from "./ui";

interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
  cols?: number | string;
  mdCols?: number | string;
  lgCols?: number | string;
  rows?: number | string;
  gap?: number | string;
  as?: React.ElementType;
}

/** @deprecated Use TCGrid directly */
export const Grid: React.FC<GridProps> = ({
  cols,
  mdCols,
  lgCols,
  gap,
  ...props
}) => {
  // Map old props to TCGrid props as best as possible
  const mappedCols = typeof cols === "number" ? (cols as any) : undefined;
  const mappedMdCols = typeof mdCols === "number" ? (mdCols as any) : undefined;
  const mappedLgCols = typeof lgCols === "number" ? (lgCols as any) : undefined;
  const mappedGap = typeof gap === "number" ? (gap as any) : undefined;

  return (
    <TCGrid
      cols={mappedCols}
      mdCols={mappedMdCols}
      lgCols={mappedLgCols}
      gap={mappedGap}
      {...props}
    />
  );
};
