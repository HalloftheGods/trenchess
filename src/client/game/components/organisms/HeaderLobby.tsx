import React from "react";
import { Users, Copy, Wifi, LogOut, GlobeLock, Globe } from "lucide-react";
import RouteCard from "@/shared/components/molecules/RouteCard";

import type { MultiplayerState, MultiplayerPlayer } from "@/types/multiplayer";

interface HeaderLobbyProps {
  multiplayer: MultiplayerState;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

const HeaderLobby: React.FC<HeaderLobbyProps> = ({
  multiplayer,
  onClick,
  onMouseEnter,
  onMouseLeave,
}) => {
  if (!multiplayer) return null;

  const { isConnected, roomId, players, leaveGame, isHost } = multiplayer;

  const copyCode = () => {
    if (roomId) {
      navigator.clipboard.writeText(roomId);
    }
  };

  // CONTAINER STYLE (Matching MenuCard)
  const containerClass =
    "group flex flex-col items-center gap-6 bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border-4 border-slate-200/30 dark:border-white/5 hover:border-brand-blue shadow-2xl w-full h-full animate-in fade-in slide-in-from-bottom-8 duration-700 relative overflow-hidden transition-all hover:-translate-y-2 cursor-pointer";

  if (!isConnected) {
    return (
      <RouteCard
        onClick={() => {}}
        title="Connecting"
        description="Establishing server uplink"
        Icon={() => (
          <div className="relative w-16 h-16 flex items-center justify-center">
            <Wifi size={64} className="text-brand-blue animate-pulse" />
          </div>
        )}
        color="blue"
        className="w-full h-full"
      />
    );
  }

  if (roomId) {
    // IN LOBBY STATE
    return (
      <div className={containerClass}>
        <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/0 to-brand-blue/0 group-hover:from-brand-blue/5 group-hover:to-brand-blue/10" />

        <div className="relative w-16 h-16 flex items-center justify-center">
          <Users size={64} className="text-brand-blue" />
        </div>

        <div className="text-center relative z-10">
          <h3 className="text-2xl font-black uppercase tracking-widest text-slate-900 dark:text-white">
            Battle <span className="text-brand-blue">Lobby</span>
          </h3>
          <p className="text-slate-400 dark:text-slate-500 mt-2 font-medium leading-relaxed">
            Room Code:{" "}
            <span className="text-brand-blue font-bold">{roomId}</span>
          </p>
        </div>

        <div className="flex flex-col items-center gap-1 w-full text-center relative z-10">
          <button
            onClick={copyCode}
            className="group/copy flex items-center justify-center gap-3 w-full py-4 rounded-2xl bg-brand-blue/5 hover:bg-brand-blue/10 border border-brand-blue/20 transition-all cursor-pointer overflow-hidden"
            title="Click to Copy Link"
          >
            <span className="text-3xl font-black tracking-[0.2em] font-mono text-brand-blue dark:text-brand-blue group-hover/copy:scale-105 transition-transform">
              {roomId}
            </span>
            <Copy
              size={16}
              className="text-brand-blue opacity-50 group-hover/copy:opacity-100"
            />
          </button>
        </div>

        <div className="w-full h-px bg-slate-200 dark:bg-slate-800 relative z-10" />

        <div className="flex flex-col items-center gap-4 w-full relative z-10">
          <div className="flex -space-x-3">
            {players.map((p: MultiplayerPlayer, i: number) => (
              <div
                key={i}
                className="w-12 h-12 rounded-full bg-slate-900 dark:bg-slate-100 border-2 border-white dark:border-slate-900 flex items-center justify-center text-white dark:text-slate-900 text-sm font-black shadow-xl z-20 relative"
                title={p.name}
              >
                {p.name?.[0]?.toUpperCase() || "P"}
              </div>
            ))}
            {Array.from({ length: Math.max(0, 4 - players.length) }).map(
              (_, i) => (
                <div
                  key={`empty-${i}`}
                  className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-800/50 border-2 border-dashed border-slate-300 dark:border-slate-700"
                />
              ),
            )}
          </div>
          <span className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">
            {players.length} / 4 PLAYERS
          </span>
        </div>

        <div className="w-full h-px bg-slate-200 dark:bg-slate-800 relative z-10" />

        <div className="flex flex-col items-center gap-4 w-full relative z-10">
          <p className="text-[10px] font-bold text-center text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] px-4 leading-relaxed">
            {isHost
              ? "Lobby active. Configure the board and begin."
              : "Waiting for host to commence."}
          </p>

          <button
            onClick={leaveGame}
            className="group flex items-center gap-2 text-xs font-black text-brand-red hover:text-brand-red uppercase tracking-[0.2em] transition-all cursor-pointer"
          >
            <LogOut
              size={14}
              className="group-hover:-translate-x-1 transition-transform"
            />
            Abandon Room
          </button>
        </div>
      </div>
    );
  }

  // NO LOBBY - CLEAN CARD
  return (
    <RouteCard
      onClick={onClick || (() => {})}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      title="Worlds Change"
      description='"Borders become Barbeques." (Online Play)'
      Icon={Globe}
      HoverIcon={GlobeLock}
      color="blue"
      className="w-full h-full"
    />
  );
};

export default HeaderLobby;
