import React from "react";
import { Sword } from "lucide-react";

interface MultiplayerLobbyStatusProps {
  multiplayer: any;
}

export const MultiplayerLobbyStatus: React.FC<MultiplayerLobbyStatusProps> = ({
  multiplayer,
}) => {
  if (!multiplayer?.roomId) return null;

  return (
    <div className="flex flex-col gap-2">
      {/* Readiness Status of others */}
      <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
        <span>Lobby Status</span>
        <span>
          {
            multiplayer.players.filter(
              (p: string) => multiplayer.readyPlayers[p],
            ).length
          }
          /{multiplayer.players.length} Ready
        </span>
      </div>

      <div className="flex gap-2 justify-center">
        {multiplayer.players.map((pid: string, i: number) => {
          const isReady = multiplayer.readyPlayers[pid];
          const isMe = pid === multiplayer.socketId;
          return (
            <div
              key={pid}
              className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${isReady ? "bg-emerald-500 border-emerald-400 text-white" : "bg-slate-200 dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-400"}`}
              title={isMe ? "You" : `Player ${i + 1}`}
            >
              {isReady ? (
                <Sword size={14} />
              ) : (
                <span className="text-[10px]">{i + 1}</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
