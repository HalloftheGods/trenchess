import type { PlayerConfig } from "@tc.types";

interface PlayerBadgeProps {
  player?: string;
  config: PlayerConfig;
  isActive: boolean;
}

export const PlayerBadge = ({ config, isActive }: PlayerBadgeProps) => {
  return (
    <div
      className={`px-4 py-3 rounded-xl font-bold text-[10px] uppercase tracking-wider flex items-center gap-2 cursor-default transition-all ${
        isActive ? `${config.bg} text-white shadow-md` : "opacity-30 grayscale"
      }`}
    >
      <div
        className={`w-1.5 h-1.5 rounded-full ${
          isActive ? "bg-white animate-pulse" : "bg-slate-400"
        }`}
      />
      {config.name}
    </div>
  );
};
