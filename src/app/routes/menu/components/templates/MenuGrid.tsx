import React from "react";

interface MenuGridProps {
  children: React.ReactNode;
  className?: string;
  cols?: number;
}

const MenuGrid: React.FC<MenuGridProps> = ({
  children,
  className = "",
  cols = 4,
}) => {
  const gridColsClass =
    {
      2: "md:grid-cols-2",
      3: "md:grid-cols-3",
      4: "md:grid-cols-4",
    }[cols] || "md:grid-cols-4";

  return (
    <div
      className={`grid grid-cols-1 ${gridColsClass} gap-6 w-full ${className}`}
    >
      {children}
    </div>
  );
};

export default MenuGrid;
