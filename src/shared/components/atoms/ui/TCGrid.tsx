import React from "react";

interface TCGridProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  cols?: 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12;
  mdCols?: 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12;
  lgCols?: 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12;
  gap?: 0 | 1 | 2 | 3 | 4 | 6 | 8 | 10 | 12;
  className?: string;
  as?: React.ElementType;
}

export const TCGrid: React.FC<TCGridProps> = ({
  children,
  cols = 1,
  mdCols,
  lgCols,
  gap = 4,
  className = "",
  as: Component = "div",
  ...props
}) => {
  const baseStyles = "grid";

  const colClasses = {
    1: "grid-cols-1",
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
    5: "grid-cols-5",
    6: "grid-cols-6",
    8: "grid-cols-8",
    10: "grid-cols-10",
    12: "grid-cols-12",
  };

  const mdColClasses = {
    1: "md:grid-cols-1",
    2: "md:grid-cols-2",
    3: "md:grid-cols-3",
    4: "md:grid-cols-4",
    5: "md:grid-cols-5",
    6: "md:grid-cols-6",
    8: "md:grid-cols-8",
    10: "md:grid-cols-10",
    12: "md:grid-cols-12",
  };

  const lgColClasses = {
    1: "lg:grid-cols-1",
    2: "lg:grid-cols-2",
    3: "lg:grid-cols-3",
    4: "lg:grid-cols-4",
    5: "lg:grid-cols-5",
    6: "lg:grid-cols-6",
    8: "lg:grid-cols-8",
    10: "lg:grid-cols-10",
    12: "lg:grid-cols-12",
  };

  const gapClasses = {
    0: "gap-0",
    1: "gap-1",
    2: "gap-2",
    3: "gap-3",
    4: "gap-4",
    6: "gap-6",
    8: "gap-8",
    10: "gap-10",
    12: "gap-12",
  };

  const currentCols = colClasses[cols];
  const currentMdCols = mdCols ? mdColClasses[mdCols] : "";
  const currentLgCols = lgCols ? lgColClasses[lgCols] : "";
  const currentGap = gapClasses[gap];

  const combinedClassName = `${baseStyles} ${currentCols} ${currentMdCols} ${currentLgCols} ${currentGap} ${className}`;

  return (
    <Component className={combinedClassName} {...props}>
      {children}
    </Component>
  );
};
