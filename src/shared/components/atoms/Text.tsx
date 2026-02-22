import React from "react";

interface TextProps extends React.HTMLAttributes<HTMLSpanElement> {
  children?: React.ReactNode;
  className?: string;
  variant?: "body" | "caption" | "small" | "large";
  weight?: "normal" | "medium" | "semibold" | "bold" | "black";
  as?: React.ElementType;
}

export const Text: React.FC<TextProps> = ({
  children,
  className = "",
  variant = "body",
  weight = "normal",
  as: Component = "span",
  ...props
}) => {
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
