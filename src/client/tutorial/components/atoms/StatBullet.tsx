import React from "react";

interface StatBulletProps {
  text: string;
  dotBgClass: string;
  dotBorderClass: string;
  textColorClass: string;
}

export const StatBullet: React.FC<StatBulletProps> = ({
  text,
  dotBgClass,
  dotBorderClass,
  textColorClass,
}) => (
  <div className="flex items-start gap-3 text-left">
    <div
      className={`w-1.5 h-1.5 rounded-full ${dotBgClass} border ${dotBorderClass} mt-1.5 shrink-0 shadow-sm`}
    />
    <p
      className={`text-[13px] font-bold ${textColorClass} leading-snug opacity-90`}
    >
      {text}
    </p>
  </div>
);
