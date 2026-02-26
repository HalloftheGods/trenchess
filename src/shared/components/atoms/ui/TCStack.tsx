import React from "react";

interface TCStackProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  direction?: "col" | "row";
  gap?: 0 | 1 | 2 | 3 | 4 | 6 | 8 | 10 | 12;
  py?: 0 | 1 | 2 | 3 | 4 | 6 | 8;
  px?: 0 | 1 | 2 | 3 | 4 | 6 | 8;
  className?: string;
  as?: React.ElementType;
}

export const TCStack: React.FC<TCStackProps> = ({
  children,
  direction = "col",
  gap = 3,
  py,
  px,
  className = "",
  as: Component = "div",
  ...props
}) => {
  const directions = {
    col: "flex flex-col",
    row: "flex flex-row",
  };

  const gaps = {
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

  const pys = {
    0: "py-0",
    1: "py-1",
    2: "py-2",
    3: "py-3",
    4: "py-4",
    6: "py-6",
    8: "py-8",
  };

  const pxs = {
    0: "px-0",
    1: "px-1",
    2: "px-2",
    3: "px-3",
    4: "px-4",
    6: "px-6",
    8: "px-8",
  };

  const currentDirection = directions[direction];
  const currentGap = gaps[gap];
  const currentPy = py !== undefined ? pys[py] : "";
  const currentPx = px !== undefined ? pxs[px] : "";

  const combinedClassName = `${currentDirection} ${currentGap} ${currentPy} ${currentPx} ${className}`;

  return (
    <Component className={combinedClassName} {...props}>
      {children}
    </Component>
  );
};
