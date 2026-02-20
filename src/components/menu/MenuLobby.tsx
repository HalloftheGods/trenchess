import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Globe, Key } from "lucide-react";
import BackButton from "../ui/BackButton";
import { useMenuContext } from "./MenuContext";
import MenuCard from "../MenuCard";
import SectionDivider from "../ui/SectionDivider";
import { GlobeLock } from "lucide-react";

const MenuLobby: React.FC = () => {
  const navigate = useNavigate();
  const { multiplayer, darkMode } = useMenuContext(); // Added darkMode for MenuCard
  const [view, setView] = useState<"menu" | "join" | "host" | "global">("menu");
  const [joinLobbyCode, setJoinLobbyCode] = useState("");

  // Auto-refresh rooms when entering global view
  useEffect(() => {
    if (view === "global" && multiplayer?.refreshRooms) {
      multiplayer.refreshRooms();
      const interval = setInterval(() => multiplayer.refreshRooms(), 5000);
      return () => clearInterval(interval);
    }
  }, [view, multiplayer]);

  // Handle hosting
  const handleCreateLobby = () => {
    if (multiplayer) {
      multiplayer.hostGame();
      setView("host");
    }
  };

  const renderMenu = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-7xl">
      <MenuCard
        onClick={() => setView("global")}
        onMouseEnter={() => {}}
        onMouseLeave={() => {}}
        isSelected={false}
        darkMode={darkMode}
        title="Global Lobby"
        description={`${multiplayer?.onlineCount || 0} players online`}
        Icon={Globe}
        color="red"
        className="h-full w-full"
      />
      <MenuCard
        onClick={handleCreateLobby}
        onMouseEnter={() => {}}
        onMouseLeave={() => {}}
        isSelected={false}
        darkMode={darkMode}
        title="Create Lobby"
        description="Host a private game"
        Icon={GlobeLock}
        color="blue"
        className="h-full w-full"
      />
      <MenuCard
        onClick={() => setView("join")}
        onMouseEnter={() => {}}
        onMouseLeave={() => {}}
        isSelected={false}
        darkMode={darkMode}
        title="Enter Code"
        description="Join with a code"
        Icon={Key}
        color="slate"
        className="h-full w-full"
      />
    </div>
  );

  const renderJoinParams = () => (
    <div className="w-full max-w-md bg-white dark:bg-slate-900 border-4 border-slate-200 dark:border-slate-800 p-8 rounded-[2rem] shadow-2xl flex flex-col gap-6">
      <div className="text-center">
        <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100 uppercase tracking-tighter">
          Enter Lobby Code
        </h3>
        <p className="text-slate-500 font-medium mt-1">
          Join an existing battlefield
        </p>
      </div>

      <input
        type="text"
        value={joinLobbyCode}
        onChange={(e) => setJoinLobbyCode(e.target.value.toUpperCase())}
        placeholder="CODE"
        className="w-full bg-slate-100 dark:bg-slate-800 border-2 border-transparent focus:border-brand-blue rounded-xl px-4 py-4 text-center font-black text-2xl tracking-[0.5em] outline-none transition-all uppercase placeholder:text-slate-300 dark:placeholder:text-slate-700"
        maxLength={6}
      />

      <button
        onClick={() => {
          if (joinLobbyCode) {
            multiplayer?.joinGame(joinLobbyCode);
            // Optionally redirect to a "waiting" state or just stay here showing status
            // For now, let's assume successful join will be reflected in multiplayer state
            // behaving like "host" view but not starting game immediately?
            // Actually, usually we'd go to a dedicated lobby screen (setup).
            // But let's reuse "host" view for now if it shows players.
            setView("host");
          }
        }}
        disabled={!joinLobbyCode}
        className={`w-full py-4 rounded-xl font-black text-white uppercase tracking-widest transition-all shadow-lg ${
          joinLobbyCode
            ? "bg-brand-blue hover:bg-brand-blue/80 hover:scale-[1.02]"
            : "bg-slate-300 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
        }`}
      >
        Join Lobby
      </button>
    </div>
  );

  const renderHost = () => (
    <div className="w-full max-w-md bg-white dark:bg-slate-900 border-4 border-brand-blue/30 p-8 rounded-[2rem] shadow-2xl flex flex-col gap-6">
      <div className="text-center">
        <h3 className="text-xl font-bold text-slate-500 uppercase tracking-widest mb-2">
          Lobby Code
        </h3>
        <div className="text-6xl font-black text-brand-blue dark:text-brand-blue tracking-widest selection:bg-brand-blue/20">
          {multiplayer?.roomId || "...."}
        </div>
      </div>

      <div className="h-px bg-slate-200 dark:bg-slate-700 w-full" />

      <div>
        <h4 className="font-bold text-slate-700 dark:text-slate-300 mb-4 flex items-center justify-between">
          <span>Players</span>
          <span className="text-sm bg-brand-blue/10 dark:bg-brand-blue/20 text-brand-blue dark:text-brand-blue px-2 py-1 rounded-lg">
            {multiplayer?.players.length}/4
          </span>
        </h4>
        <div className="space-y-2">
          {multiplayer?.players.map((p: string, i: number) => (
            <div
              key={p}
              className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-xl"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-blue to-brand-blue/60 flex items-center justify-center text-white font-bold text-sm">
                  P{i + 1}
                </div>
                <span className="font-medium text-slate-700 dark:text-slate-200">
                  {p === multiplayer.socketId
                    ? "You"
                    : `Player ${p.slice(0, 4)}`}
                </span>
              </div>
              {multiplayer.readyPlayers[p] && (
                <span className="text-xs font-bold text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded">
                  READY
                </span>
              )}
            </div>
          ))}
          {multiplayer?.players.length === 0 && (
            <div className="text-center text-slate-400 italic py-4">
              Waiting for players...
            </div>
          )}
        </div>
      </div>

      {/* Only host can start? Or automtic? Logic exists in App usually? 
           For now, just a "Start Game" button if host, or "Ready" toggle?
           The previous flow wasn't fully clear, but let's add a generic action button. */}
      <div className="flex gap-4">
        <button
          onClick={() => multiplayer?.leaveGame()}
          className="flex-1 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          Leave
        </button>
        <button
          // Implementation of start game depends on where we want to go.
          // Usually it navigates to /game or /setup.
          // For now, let's just show "Waiting" if not host, or "Start" if host.
          className="flex-1 py-3 rounded-xl font-bold text-white bg-brand-blue hover:bg-brand-blue/80 transition-all shadow-lg"
          onClick={() => {
            // Check if ready?
            navigate("/play/setup?mode=multiplayer");
          }}
        >
          {multiplayer?.isHost ? "Setup Game" : "Ready"}
        </button>
      </div>
    </div>
  );

  const renderGlobal = () => (
    <div className="w-full max-w-4xl bg-white dark:bg-slate-900 border-4 border-slate-200 dark:border-slate-800 p-8 rounded-[2rem] shadow-2xl flex flex-col gap-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100 uppercase tracking-tighter">
            Global Lobby
          </h3>
          <p className="text-slate-500 font-medium">
            {multiplayer?.onlineCount || 0} Operators Online
          </p>
        </div>
        <button
          onClick={() => multiplayer?.refreshRooms?.()}
          className="p-2 text-slate-400 hover:text-brand-blue transition-colors"
          title="Refresh"
        >
          {/* Refresh Icon */}
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
            <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
            <path d="M16 21h5v-5" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto">
        {multiplayer?.availableRooms?.map((room: any) => (
          <div
            key={room.id}
            className="border-2 border-slate-200 dark:border-slate-700 rounded-xl p-4 hover:border-brand-blue transition-all cursor-pointer bg-slate-50 dark:bg-slate-800/50"
            onClick={() => {
              multiplayer.joinGame(room.id);
              setView("host");
            }}
          >
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-lg text-slate-700 dark:text-slate-200">
                {room.id}
              </span>
              <span className="text-xs font-bold bg-brand-blue/10 text-brand-blue px-2 py-1 rounded">
                {room.players}/{room.maxPlayers || 4}
              </span>
            </div>
            <div className="text-sm text-slate-500">
              {room.status || "Waiting"}
            </div>
          </div>
        ))}
        {(!multiplayer?.availableRooms ||
          multiplayer.availableRooms.length === 0) && (
          <div className="col-span-full py-12 text-center text-slate-400 italic">
            No active operations found.
            <br />
            <button
              onClick={handleCreateLobby}
              className="text-brand-blue hover:underline mt-2 font-bold not-italic"
            >
              Start your own.
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-7xl animate-in slide-in-from-bottom-8 fade-in duration-700 pb-20 flex flex-col items-center">
      <div className="relative w-full max-w-7xl mb-12">
        <SectionDivider
          label={
            view === "menu"
              ? "Worldwide Mode"
              : view === "global"
                ? "Global Operations"
                : view === "host"
                  ? "Lobby"
                  : "Join Operation"
          }
        />
        <BackButton
          onClick={() => {
            if (view !== "menu") {
              if (view === "host") multiplayer?.leaveGame();
              setView("menu");
            } else {
              navigate("/play");
            }
          }}
          label={view !== "menu" ? "Worldwide Mode" : "Play"}
          className="absolute left-0 -top-8"
        />
      </div>

      {view === "menu" && renderMenu()}
      {view === "join" && renderJoinParams()}
      {view === "host" && renderHost()}
      {view === "global" && renderGlobal()}
    </div>
  );
};

export default MenuLobby;
