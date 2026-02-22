import React from "react";

interface FlexProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
  direction?: "row" | "col" | "row-reverse" | "col-reverse";
  align?: "start" | "center" | "end" | "baseline" | "stretch";
  justify?: "start" | "center" | "end" | "between" | "around" | "evenly";
  gap?: number | string;
  as?: React.ElementType;
}

export const Flex: React.FC<FlexProps> = ({
  children,
  className = "",
  direction = "row",
  align,
  justify,
  gap,
  as: Component = "div",
  ...props
}) => {
  const directionClass = {
    row: "flex-row",
    col: "flex-col",
    "row-reverse": "flex-row-reverse",
    "col-reverse": "flex-col-reverse",
  }[direction];

  const alignClass = align ? `items-${align}` : "";
  const justifyClass = justify ? `justify-${justify}` : "";
  const gapClass = gap ? (typeof gap === "number" ? `gap-${gap}` : gap) : "";

  return (
    <Component
      className={`flex ${directionClass} ${alignClass} ${justifyClass} ${gapClass} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
};
