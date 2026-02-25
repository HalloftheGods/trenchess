import React from "react";
import { TERRAIN_INTEL } from "@/constants/ui/terrain";
import TrenchessText from "@/shared/components/atoms/TrenchessText";

interface LoadingScreenProps {
  message?: string;
  submessage?: string;
}

const LOADING_MESSAGES = [
  "Opening Trench...",
  "Pouring the Chessmen...",
  "Cracking the Endgame...",
  "Scouting the Terrain...",
  "Sharpening the Blades...",
];

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message = "Forging the Battlefield...",
  submessage = "Preparing the board for your arrival.",
}) => {
  const terrainKeys = Object.keys(TERRAIN_INTEL);

  const renderTerrainIcon = (key: string, index: number) => {
    const terrain = TERRAIN_INTEL[key];
    const Icon = terrain.icon;
    const colorClass = terrain.text;
    const delay = `${index * 0.2}s`;

    return (
      <div
        key={key}
        className={`relative flex items-center justify-center w-20 h-20 rounded-[2rem] bg-slate-900 border border-white/5 shadow-2xl animate-terrain-float ${colorClass}`}
        style={{ animationDelay: delay }}
      >
        <Icon className="w-10 h-10 drop-shadow-[0_0_15px_currentColor]" />

        {/* Decorative inner glow */}
        <div
          className={`absolute inset-0 rounded-[2rem] opacity-20 blur-xl ${terrain.bg}`}
        />
      </div>
    );
  };

  const renderLoadingMessage = (msg: string, index: number) => (
    <div
      key={msg}
      className="absolute inset-0 flex items-center justify-center animate-message-fade opacity-0"
      style={{ animationDelay: `${index * 2.5}s` }}
    >
      {msg}
    </div>
  );

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-950 text-white p-6 text-center animate-in fade-in duration-1000">
      {/* Premium Background Atmosphere */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-brand-red/5 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-brand-blue/5 rounded-full blur-[120px] animate-pulse [animation-delay:2s]" />
      </div>

      <div className="relative mb-16 flex gap-6">
        {terrainKeys.map(renderTerrainIcon)}
      </div>

      <h2 className="text-4xl font-black uppercase tracking-tighter mb-4 animate-pulse">
        {message}
      </h2>

      <div className="flex items-center gap-2 mb-4 text-slate-400 font-medium text-lg">
        <span>Initializing</span>
        <TrenchessText />
      </div>

      <div className="relative h-8 w-80 mb-16 text-slate-500 font-medium italic overflow-hidden">
        {LOADING_MESSAGES.map(renderLoadingMessage)}
      </div>

      <div className="relative w-80 h-1.5 bg-slate-950 rounded-full overflow-hidden border border-white/5 shadow-inner">
        <div className="h-full bg-gradient-to-r from-brand-red via-amber-500 to-brand-blue animate-loading-bar shadow-[0_0_20px_rgba(239,68,68,0.5)]" />
      </div>

      <p className="mt-12 text-[10px] text-slate-700 uppercase tracking-[0.4em] font-black">
        {submessage}
      </p>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes loading-bar {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(0); }
          100% { transform: translateX(100%); }
        }
        .animate-loading-bar {
          animation: loading-bar 3s infinite ease-in-out;
        }
        @keyframes terrain-float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(5deg); }
        }
        .animate-terrain-float {
          animation: terrain-float 4s infinite ease-in-out;
        }
        @keyframes message-fade {
          0%, 5% { transform: translateY(10px); opacity: 0; }
          10%, 90% { transform: translateY(0); opacity: 1; }
          95%, 100% { transform: translateY(-10px); opacity: 0; }
        }
        .animate-message-fade {
          animation: message-fade 2.5s infinite;
        }
      `,
        }}
      />
    </div>
  );
};

export default LoadingScreen;
