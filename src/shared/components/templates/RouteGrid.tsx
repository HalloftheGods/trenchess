import React from "react";

interface MenuGridProps {
  children: React.ReactNode;
  className?: string;
  cols?: number;
}

const LG_COLS_MAP: Record<number, string> = {
  1: "lg:grid-cols-1",
  2: "lg:grid-cols-2",
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
  5: "lg:grid-cols-5",
  6: "lg:grid-cols-6",
};

const MD_COLS_MAP: Record<number, string> = {
  1: "md:grid-cols-1",
  2: "md:grid-cols-2",
  3: "md:grid-cols-3",
  4: "md:grid-cols-4",
  5: "md:grid-cols-5",
  6: "md:grid-cols-6",
};

const RouteGrid: React.FC<MenuGridProps> = ({
  children,
  cols = 3,
  className = "",
}) => {
  const lgColsClass = LG_COLS_MAP[cols] || "lg:grid-cols-3";
  const mdColsClass = MD_COLS_MAP[cols] || "md:grid-cols-2";

  return (
    <div
      className={`grid grid-cols-1 ${mdColsClass} ${lgColsClass} gap-6 w-full ${className}`}
    >
      {children}
    </div>
  );
};

export default RouteGrid;
