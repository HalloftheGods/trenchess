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
  type GridCols = 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12;
  type GridGap = 0 | 1 | 2 | 3 | 4 | 6 | 8 | 10 | 12;
  const mappedCols = typeof cols === "number" ? (cols as GridCols) : undefined;
  const mappedMdCols =
    typeof mdCols === "number" ? (mdCols as GridCols) : undefined;
  const mappedLgCols =
    typeof lgCols === "number" ? (lgCols as GridCols) : undefined;
  const mappedGap = typeof gap === "number" ? (gap as GridGap) : undefined;

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
