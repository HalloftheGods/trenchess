import React from "react";
import { StatBullet } from "../atoms/StatBullet";

interface StatListProps {
  stats: string[];
  colors: {
    bg: string;
    border: string;
  };
  subtextColor: string;
}

export const StatList: React.FC<StatListProps> = ({
  stats,
  colors,
  subtextColor,
}) => (
  <div className="w-full space-y-4 px-0 mb-8">
    <div className="w-full px-2 text-left">
      <div className="flex flex-col gap-4 max-w-2xl mx-auto">
        {stats.map((item, idx) => (
          <StatBullet
            key={idx}
            text={item}
            dotBgClass={colors.bg}
            dotBorderClass={colors.border}
            textColorClass={subtextColor}
          />
        ))}
      </div>
    </div>
  </div>
);
