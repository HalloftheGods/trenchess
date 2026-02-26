import React from "react";

export interface TCFlexProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  direction?: "row" | "col";
  align?: "start" | "center" | "end" | "stretch";
  justify?: "start" | "center" | "end" | "between" | "around" | "evenly";
  gap?: 0 | 1 | 2 | 3 | 4 | 6 | 8 | 10 | 12;
  center?: boolean;
  className?: string;
  as?: React.ElementType;
}

export const TCFlex: React.FC<TCFlexProps> = ({
  children,
  direction = "row",
  align,
  justify,
  gap,
  center = false,
  className = "",
  as: Component = "div",
  ...props
}) => {
  const baseStyles = "flex";

  const directions = {
    row: "flex-row",
    col: "flex-col",
  };

  const aligns = {
    start: "items-start",
    center: "items-center",
    end: "items-end",
    stretch: "items-stretch",
  };

  const justifies = {
    start: "justify-start",
    center: "justify-center",
    end: "justify-end",
    between: "justify-between",
    around: "justify-around",
    evenly: "justify-evenly",
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

  const centerStyles = center ? "items-center justify-center" : "";
  const currentDirection = directions[direction];
  const currentAlign = align ? aligns[align] : "";
  const currentJustify = justify ? justifies[justify] : "";
  const currentGap = gap !== undefined ? gaps[gap] : "";

  const combinedClassName = `${baseStyles} ${currentDirection} ${centerStyles} ${currentAlign} ${currentJustify} ${currentGap} ${className}`;

  return (
    <Component className={combinedClassName} {...props}>
      {children}
    </Component>
  );
};
