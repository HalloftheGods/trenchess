import React from "react";
import { TCHeading } from "./ui";

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children?: React.ReactNode;
  className?: string;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  weight?: "normal" | "medium" | "semibold" | "bold" | "black";
}

/** @deprecated Use TCHeading directly */
export const Heading: React.FC<HeadingProps> = ({ level = 1, ...props }) => {
  // Map level to supported levels in TCHeading (1-4)
  const mappedLevel = level > 4 ? 4 : (level as 1 | 2 | 3 | 4);

  return <TCHeading level={mappedLevel} {...props} />;
};
