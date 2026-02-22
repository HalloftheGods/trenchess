import React from "react";

interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
  cols?: number | string;
  rows?: number | string;
  gap?: number | string;
  as?: React.ElementType;
}

export const Grid: React.FC<GridProps> = ({
  children,
  className = "",
  cols,
  rows,
  gap,
  as: Component = "div",
  ...props
}) => {
  const colsClass = cols
    ? typeof cols === "number"
      ? `grid-cols-${cols}`
      : cols
    : "";
  const rowsClass = rows
    ? typeof rows === "number"
      ? `grid-rows-${rows}`
      : rows
    : "";
  const gapClass = gap ? (typeof gap === "number" ? `gap-${gap}` : gap) : "";

  return (
    <Component
      className={`grid ${colsClass} ${rowsClass} ${gapClass} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
};
