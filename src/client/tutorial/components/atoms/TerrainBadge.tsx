import React from "react";
import { ShieldPlus, X } from "lucide-react";

interface TerrainBadgeProps {
  icon: React.ElementType;
  bg: string;
  text: string;
  border: string;
  ring: string;
  isProtected: boolean;
  canTraverse: boolean;
  isActive: boolean;
  onClick: () => void;
  shieldBorderColor?: string;
  shieldTextColor?: string;
}

export const TerrainBadge: React.FC<TerrainBadgeProps> = ({
  icon: Icon,
  bg,
  text,
  border,
  ring,
  isProtected,
  canTraverse,
  isActive,
  onClick,
  shieldBorderColor,
  shieldTextColor,
}) => {
  return (
    <div
      onClick={onClick}
      className={`p-2.5 rounded-2xl ${bg} ${text} border ${border} shadow-sm backdrop-blur-md relative transition-all group/t cursor-pointer hover:scale-110 hover:shadow-lg hover:border-white/20 ${isActive ? "opacity-100" : !canTraverse ? "opacity-[0.42] grayscale-[0.5]" : "opacity-[0.85]"} ${isActive ? `ring-2 ${ring} scale-110 shadow-lg` : ""} ${isProtected ? "border-double border-4" : !canTraverse ? "border-dotted border-4" : ""}`}
    >
      <Icon size={24} className="fill-current/10" />

      {/* Shield Badge for Protection */}
      {isProtected && (
        <div
          className={`absolute -top-2 -right-2 p-1 rounded-full bg-white dark:bg-slate-900 border-2 ${shieldBorderColor || ""} shadow-lg z-10 flex items-center justify-center animate-pulse`}
          title="Protected in this terrain"
        >
          <ShieldPlus size={10} className={shieldTextColor} strokeWidth={4} />
        </div>
      )}

      {/* Red X Badge for Untraversable Terrain */}
      {!canTraverse && (
        <div className="absolute -top-1 -right-1 p-0.5 rounded-full bg-brand-red/10 border border-brand-red/20 shadow-sm z-10 flex items-center justify-center">
          <X size={8} className="text-brand-red" strokeWidth={6} />
        </div>
      )}
    </div>
  );
};
