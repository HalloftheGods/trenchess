import React, { useState } from "react";
import { Globe, X, Settings2, Key, GlobeLock } from "lucide-react";
import { useGameState } from "@hooks/engine/useGameState";
import { useRouteContext } from "@context";
import { Shoutbox } from "@/app/client/console/components";
import { MultiplayerLobbyStatus } from "@/app/core/components/hud/atoms/MultiplayerLobbyStatus";

export const GlobalOnlinePortal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const game = useGameState();
  const { multiplayer, darkMode } = useRouteContext();

  // Render the portal even if we don't have socket connection active, because we want it available
  // if the user is in worldwide mode, or if they have the portal open to check things.
  // Actually, we should probably only show it if multiplayer exists and there's a reason to show it.
  // But wait, what if they aren't in a multiplayer match? Let's check `multiplayer?.roomId`
  // Wait, if they are just in the lobby menu, they might not have a roomId yet.
  // Let's hide it completely if `!multiplayer` exists.

  if (!multiplayer) return null;

  const togglePanel = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const closePanel = () => {
    setIsOpen(false);
  };

  const inRoom = !!multiplayer.roomId;

  return (
    <>
      {/* Toggle Button Container */}
      <div className="fixed bottom-6 right-6 z-[10000] pointer-events-none">
        <button
          onClick={togglePanel}
          className={`
            p-3.5 rounded-full shadow-2xl transition-all duration-500 pointer-events-auto
            flex items-center justify-center outline-none
            ${
              isOpen
                ? "bg-brand-blue text-white -translate-x-[372px] rotate-0 shadow-brand-blue/30 scale-100"
                : "bg-slate-900/90 text-brand-blue backdrop-blur-md border border-white/10 hover:scale-110 hover:bg-slate-800 rotate-0 shadow-black/60"
            }
          `}
          title={isOpen ? "Close Online Portal" : "Open Online Portal"}
        >
          {isOpen ? (
            <X
              size={22}
              strokeWidth={2.5}
              className="animate-in fade-in zoom-in duration-300"
            />
          ) : (
            <Globe
              size={22}
              strokeWidth={2}
              className={inRoom ? "animate-pulse" : "hover:animate-pulse"}
            />
          )}
        </button>
      </div>

      {/* Debug Sheet Sidebar */}
      <div
        className={`
          fixed inset-y-0 right-0 z-[9999] w-96 max-w-[95vw]
          bg-slate-950/98 backdrop-blur-3xl border-l border-white/10 
          shadow-[-25px_0_80px_-20px_rgba(0,0,0,0.8)]
          transform transition-transform duration-500 cubic-bezier(0.16, 1, 0.3, 1)
          flex flex-col
          ${isOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <div className="flex flex-col h-full overflow-hidden">
          {/* Header Section */}
          <div className="flex items-center justify-between px-6 py-6 border-b border-white/5 bg-white/[0.02]">
            <div className="flex flex-col gap-0.5">
              <h3 className="text-[13px] font-black uppercase tracking-[0.4em] text-brand-blue flex items-center gap-2">
                <Globe
                  size={14}
                  strokeWidth={3}
                  className={inRoom ? "animate-pulse" : ""}
                />
                Online Portal
              </h3>
              <div className="flex items-center gap-2">
                <p className="text-[10px] text-slate-500 font-bold tracking-[0.2em] leading-none uppercase">
                  Global Net
                </p>
                <div className="h-px w-6 bg-white/5" />
                <p
                  className={`text-[9px] font-mono font-bold ${inRoom ? "text-emerald-500" : "text-amber-600/60"}`}
                >
                  {inRoom ? "CONNECTED" : "DISCONNECTED"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex flex-col items-end">
                <span className="text-[9px] font-black text-slate-600 tracking-tighter uppercase mb-0.5">
                  Players
                </span>
                <span
                  className={`text-[11px] font-mono text-slate-400 bg-slate-900/50 px-1.5 py-0.5 rounded border ${inRoom ? "border-emerald-500/30 text-emerald-400" : "border-white/5"}`}
                >
                  {multiplayer.onlineCount || 0}
                </span>
              </div>
            </div>
          </div>

          {/* Main Inspection View */}
          <div className="flex-1 overflow-y-auto custom-scrollbar px-6 py-6 pb-32 flex flex-col gap-6">
            <div className="pointer-events-auto">
              {inRoom ? (
                <div className="bg-slate-900/60 border border-white/5 rounded-xl p-4 flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-300">
                      {multiplayer.isPrivate ? (
                        <GlobeLock size={16} className="text-amber-500" />
                      ) : (
                        <Globe size={16} className="text-brand-blue" />
                      )}
                      <span className="font-bold text-sm uppercase tracking-widest">
                        {multiplayer.roomId}
                      </span>
                    </div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 bg-slate-800 px-2 py-1 rounded">
                      {multiplayer.isHost ? "Host" : "Client"}
                    </div>
                  </div>

                  <div className="h-px bg-white/5 w-full my-1" />

                  <MultiplayerLobbyStatus multiplayer={multiplayer} />

                  <div className="h-px bg-white/5 w-full my-1" />

                  <div className="flex items-center gap-2 text-[10px] uppercase font-bold text-slate-400">
                    <Settings2 size={12} />
                    Mode:{" "}
                    <span className="text-slate-300">
                      {game?.mode || "Unknown"}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-900/50 border border-slate-800 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center gap-3">
                  <Key size={32} className="text-slate-600 mb-2" />
                  <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">
                    No Active Room
                  </p>
                  <p className="text-slate-600 text-xs">
                    Join or host an operation to access command channels.
                  </p>
                </div>
              )}
            </div>

            {/* Shoutbox */}
            {inRoom && (
              <div className="pointer-events-auto flex-1 flex flex-col min-h-[300px]">
                <Shoutbox
                  multiplayer={multiplayer}
                  darkMode={darkMode || false}
                />
              </div>
            )}
          </div>

          {/* System Status Footer */}
          <div className="px-6 py-4 border-t border-white/5 bg-black/40 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className={`w-1.5 h-1.5 rounded-full animate-pulse ${inRoom ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" : "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]"}`}
              />
              <p className="text-[9px] text-slate-500 font-mono uppercase tracking-widest">
                {inRoom ? "Synced" : "Awaiting Link"}
              </p>
            </div>
            <p className="text-[9px] text-slate-700 font-black uppercase tracking-tighter">
              // TacNet Uplink //
            </p>
          </div>
        </div>
      </div>

      {/* Persistent Backdrop */}
      <div
        className={`
          fixed inset-0 bg-slate-950/40 backdrop-blur-[2px] z-[9998] cursor-pointer
          transition-opacity duration-500 ease-in-out
          ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
        `}
        onClick={closePanel}
      />
    </>
  );
};
