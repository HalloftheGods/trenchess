import React from "react";

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children?: React.ReactNode;
  className?: string;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  weight?: "normal" | "medium" | "semibold" | "bold" | "black";
}

export const Heading: React.FC<HeadingProps> = ({
  children,
  className = "",
  level = 1,
  weight = "bold",
  ...props
}) => {
  const Component = `h${level}` as React.ElementType;

  const weightClass = {
    normal: "font-normal",
    medium: "font-medium",
    semibold: "font-semibold",
    bold: "font-bold",
    black: "font-black",
  }[weight];

  return (
    <Component className={`${weightClass} ${className}`} {...props}>
      {children}
    </Component>
  );
};
