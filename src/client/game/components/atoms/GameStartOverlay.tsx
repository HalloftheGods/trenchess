import TrenchessText from "@/shared/components/atoms/TrenchessText";
import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

interface GameStartOverlayProps {
  isOnline: boolean;
  isLocked: boolean;
  onLockIn: () => void;
  onStart: () => void;
}

export const GameStartOverlay: React.FC<GameStartOverlayProps> = ({
  isOnline,
  isLocked,
  onLockIn,
  onStart,
}) => {
  const [visible, setVisible] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    setVisible(true);
  }, []);

  const handleStart = () => {
    setIsFadingOut(true);
    setTimeout(onStart, 500);
  };

  const handleLockIn = () => {
    onLockIn();
  };

  return (
    <div
      className={`
        fixed inset-0 z-[100] flex items-center justify-center
        bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl transition-opacity duration-500
        ${visible && !isFadingOut ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
      `}
    >
      <div className="relative group scale-110 lg:scale-150">
        <div className="absolute inset-0 -m-20 bg-gradient-radial from-brand-red/20 via-brand-blue/10 to-transparent blur-3xl animate-pulse" />

        <div className="relative flex flex-col items-center gap-6">
          <div className="relative">
            <h1 className="text-6xl lg:text-8xl font-black italic tracking-tighter drop-shadow-[0_0_30px_rgba(0,0,0,0.1)] dark:drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]">
              <TrenchessText />
            </h1>
            <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-brand-red via-white to-brand-blue animate-shimmer" />
          </div>

          <div className="overflow-hidden mb-8">
            <h2 className="text-2xl lg:text-3xl font-black uppercase tracking-[0.5em] text-slate-400 animate-[reveal-up_0.8s_ease-out_forwards]">
              Play Trenchess!
            </h2>
          </div>

          {isOnline ? (
            isLocked ? (
              <div className="flex flex-col items-center gap-3">
                <Loader2 size={28} className="text-slate-400 animate-spin" />
                <span className="text-sm font-bold uppercase tracking-[0.3em] text-slate-500">
                  Waiting for others...
                </span>
              </div>
            ) : (
              <button
                onClick={handleLockIn}
                className="group relative px-12 py-4 rounded-full bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/50 overflow-hidden transition-all duration-300 hover:scale-105 hover:bg-slate-200 dark:hover:bg-slate-800 hover:border-brand-red/50 hover:shadow-[0_0_30px_-5px_var(--tw-shadow-color)] shadow-brand-red/30 focus:outline-none focus:ring-2 focus:ring-brand-red/50 active:scale-95"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-brand-red/20 to-brand-blue/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative z-10 text-xl font-bold tracking-[0.2em] uppercase text-slate-800 dark:text-white drop-shadow-sm group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-slate-800 dark:group-hover:from-white group-hover:via-slate-800 dark:group-hover:via-white group-hover:to-brand-red transition-all duration-300">
                  Lock In
                </span>
                <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-slate-800/50 dark:via-white/50 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out" />
              </button>
            )
          ) : (
            <button
              onClick={handleStart}
              className="group relative px-12 py-4 rounded-full bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/50 overflow-hidden transition-all duration-300 hover:scale-105 hover:bg-slate-200 dark:hover:bg-slate-800 hover:border-brand-red/50 hover:shadow-[0_0_30px_-5px_var(--tw-shadow-color)] shadow-brand-red/30 focus:outline-none focus:ring-2 focus:ring-brand-red/50 active:scale-95"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-brand-red/20 to-brand-blue/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative z-10 text-xl font-bold tracking-[0.2em] uppercase text-slate-800 dark:text-white drop-shadow-sm group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-slate-800 dark:group-hover:from-white group-hover:via-slate-800 dark:group-hover:via-white group-hover:to-brand-red transition-all duration-300">
                Start
              </span>
              <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-slate-800/50 dark:via-white/50 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
