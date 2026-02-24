import React from "react";

interface PlayerAvatarProps {
  name?: string;
  empty?: boolean;
  className?: string;
}

export const PlayerAvatar: React.FC<PlayerAvatarProps> = ({
  name,
  empty = false,
  className = "",
}) => {
  if (empty) {
    return (
      <div
        className={`w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-800/50 border-2 border-dashed border-slate-300 dark:border-slate-700 ${className}`}
      />
    );
  }

  return (
    <div
      className={`w-12 h-12 rounded-full bg-slate-900 dark:bg-slate-100 border-2 border-white dark:border-slate-900 flex items-center justify-center text-white dark:text-slate-900 text-sm font-black shadow-xl z-20 relative ${className}`}
      title={name}
    >
      {name?.[0]?.toUpperCase() || "P"}
    </div>
  );
};
