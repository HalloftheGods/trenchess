import React from "react";
import { TCFlex } from "./ui/TCFlex";
import type { TCFlexProps } from "./ui/TCFlex";

interface FlexProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
  direction?: "row" | "col" | "row-reverse" | "col-reverse";
  align?: "start" | "center" | "end" | "baseline" | "stretch";
  justify?: "start" | "center" | "end" | "between" | "around" | "evenly";
  gap?: number | string;
  as?: React.ElementType;
}

/** @deprecated Use TCFlex directly */
export const Flex: React.FC<FlexProps> = ({
  direction = "row",
  align,
  justify,
  gap,
  ...props
}) => {
  // Map old props to TCFlex props where possible, otherwise pass className
  const mappedDirection = direction === "col" ? "col" : "row";
  const mappedAlign = align === "baseline" ? undefined : align;
  const mappedGap =
    typeof gap === "number" ? (gap as TCFlexProps["gap"]) : undefined;

  return (
    <TCFlex
      direction={mappedDirection}
      align={mappedAlign}
      justify={justify}
      gap={mappedGap}
      {...props}
    />
  );
};
