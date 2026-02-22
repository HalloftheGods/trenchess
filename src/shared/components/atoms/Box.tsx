import React from "react";

interface BoxProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}

export const Box: React.FC<BoxProps> = ({
  children,
  className = "",
  as: Component = "div",
  ...props
}) => {
  return (
    <Component className={className} {...props}>
      {children}
    </Component>
  );
};
