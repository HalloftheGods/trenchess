import React from "react";

export type GuideColor =
  | "emerald"
  | "amber"
  | "red"
  | "blue"
  | "indigo"
  | "violet"
  | "slate";

const getGuideBgColor = (color: GuideColor) => {
  const map: Record<GuideColor, string> = {
    emerald: "bg-emerald-500",
    amber: "bg-amber-500",
    red: "bg-brand-red",
    blue: "bg-brand-blue",
    indigo: "bg-indigo-500",
    violet: "bg-violet-500",
    slate: "bg-slate-500",
  };
  return map[color] || map.slate;
};

interface GuideBulletProps {
  color?: GuideColor;
  className?: string;
  size?: "sm" | "md";
}

export const GuideBullet: React.FC<GuideBulletProps> = ({
  color = "slate",
  className = "",
  size = "md",
}) => {
  const bg = getGuideBgColor(color);
  const sizeClass = size === "sm" ? "w-1.5 h-1.5 mt-2" : "w-2 h-2 mt-2.5";
  return (
    <div
      className={`${sizeClass} rounded-full ${bg}/60 shrink-0 ${className}`}
    />
  );
};
