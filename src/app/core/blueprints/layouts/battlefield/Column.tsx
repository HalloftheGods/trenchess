import React from "react";
import type { ReactNode } from "react";

interface ColumnProps {
  children?: ReactNode;
  alignment: "left" | "right";
}

export const Column: React.FC<ColumnProps> = ({ children, alignment }) => (
  <div
    className={`hidden lg:flex w-72 flex-col flex-shrink-0 h-full ${
      alignment === "left" ? "order-1" : "order-3"
    }`}
  >
    {children}
  </div>
);
