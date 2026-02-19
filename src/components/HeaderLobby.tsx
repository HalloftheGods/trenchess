import React from "react";
import { Users, Copy, Wifi, LogOut, GlobeLock } from "lucide-react";

interface HeaderLobbyProps {
  multiplayer: any;
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
    "group flex flex-col items-center gap-6 bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border-2 border-blue-500/20 hover:border-blue-500/50 shadow-2xl w-full h-full animate-in fade-in slide-in-from-bottom-8 duration-700 relative overflow-hidden transition-all hover:-translate-y-2 cursor-pointer";

  if (!isConnected) {
    return (
      <div className={containerClass}>
        <div className="relative w-16 h-16 flex items-center justify-center">
          <Wifi size={64} className="text-blue-500 animate-pulse" />
        </div>
        <div className="text-center">
          <h3 className="text-2xl font-black uppercase tracking-tighter text-slate-900 dark:text-white">
            Connecting<span className="text-blue-500">...</span>
          </h3>
          <p className="text-slate-400 dark:text-slate-500 mt-2 font-medium leading-relaxed">
            Establishing server uplink
          </p>
        </div>
      </div>
    );
  }

  if (roomId) {
    // IN LOBBY STATE
    return (
      <div className={containerClass}>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-500/0 group-hover:from-blue-500/5 group-hover:to-blue-500/10" />

        <div className="relative w-16 h-16 flex items-center justify-center">
          <Users size={64} className="text-blue-500" />
        </div>

        <div className="text-center relative z-10">
          <h3 className="text-2xl font-black uppercase tracking-tighter text-slate-900 dark:text-white">
            Battle <span className="text-blue-500">Lobby</span>
          </h3>
          <p className="text-slate-400 dark:text-slate-500 mt-2 font-medium leading-relaxed">
            Room Code: <span className="text-blue-500 font-bold">{roomId}</span>
          </p>
        </div>

        <div className="flex flex-col items-center gap-1 w-full text-center relative z-10">
          <button
            onClick={copyCode}
            className="group/copy flex items-center justify-center gap-3 w-full py-4 rounded-2xl bg-blue-500/5 hover:bg-blue-500/10 border border-blue-500/20 transition-all cursor-pointer overflow-hidden"
            title="Click to Copy Link"
          >
            <span className="text-3xl font-black tracking-[0.2em] font-mono text-blue-600 dark:text-blue-400 group-hover/copy:scale-105 transition-transform">
              {roomId}
            </span>
            <Copy
              size={16}
              className="text-blue-500 opacity-50 group-hover/copy:opacity-100"
            />
          </button>
        </div>

        <div className="w-full h-px bg-slate-200 dark:bg-slate-800 relative z-10" />

        <div className="flex flex-col items-center gap-4 w-full relative z-10">
          <div className="flex -space-x-3">
            {players.map((p: any, i: number) => (
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
            className="group flex items-center gap-2 text-xs font-black text-red-500 hover:text-red-400 uppercase tracking-[0.2em] transition-all cursor-pointer"
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
    <div
      className={`${containerClass} cursor-pointer group hover:scale-[1.02]`}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-500/0 group-hover:from-blue-500/5 group-hover:to-blue-500/10" />

      <div className="relative w-16 h-16 flex items-center justify-center">
        <GlobeLock size={64} className="text-blue-500" />
      </div>

      <div className="text-center relative z-10">
        <h3 className="text-2xl font-black uppercase tracking-tighter text-slate-900 dark:text-white">
          Worldwide <span className="text-blue-500">Change</span>
        </h3>
        <p className="text-slate-400 dark:text-slate-500 mt-2 font-medium leading-relaxed">
          Borders become Barbeques.
        </p>
      </div>
    </div>
  );
};

export default HeaderLobby;
