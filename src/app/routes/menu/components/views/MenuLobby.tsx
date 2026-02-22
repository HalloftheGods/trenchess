import React, { lazy, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Globe, Key, GlobeLock } from "lucide-react";
import { useMenuContext } from "@/app/context/MenuContext";
import Shoutbox from "@/app/routes/game/components/organisms/Shoutbox";

// Atomic Components
import MenuPageLayout from "@/app/routes/menu/components/templates/MenuPageLayout";
import MenuPageHeader from "@/app/routes/menu/components/organisms/MenuPageHeader";
import MenuGrid from "@/app/routes/menu/components/templates/MenuGrid";
import MenuCard from "@/app/routes/menu/components/molecules/MenuCard";

const MenuLobby: React.FC = () => {
  const navigate = useNavigate();
  const { multiplayer, darkMode } = useMenuContext();
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

  const headerLabel =
    view === "menu"
      ? "Worldwide Mode"
      : view === "global"
        ? "Global Operations"
        : view === "host"
          ? "Lobby"
          : "Join Operation";

  const backLabel = view !== "menu" ? "Worldwide Mode" : "Play";

  const renderMenu = () => (
    <MenuGrid cols={3}>
      <MenuCard
        onClick={handleCreateLobby}
        onMouseEnter={() => {}}
        onMouseLeave={() => {}}
        isSelected={false}
        darkMode={darkMode}
        title="Host Lobby"
        description='"Leaders shall host gatherings."'
        Icon={GlobeLock}
        color="red"
        className="h-full w-full"
      />
      <MenuCard
        onClick={() => setView("join")}
        onMouseEnter={() => {}}
        onMouseLeave={() => {}}
        isSelected={false}
        darkMode={darkMode}
        title="Join Code"
        description='"Invitations shall come in code."'
        Icon={Key}
        color="blue"
        className="h-full w-full"
      />
      <MenuCard
        onClick={() => setView("global")}
        onMouseEnter={() => {}}
        onMouseLeave={() => {}}
        isSelected={false}
        darkMode={darkMode}
        title="Worldwide Webwork"
        description={`${multiplayer?.onlineCount || 0} players online`}
        Icon={Globe}
        color="emerald"
        className="h-full w-full"
      />
    </MenuGrid>
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
            navigate(`/game/${joinLobbyCode}`);
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
          {multiplayer?.players.map((p: string, i: number) => {
            const isMe = p === multiplayer.socketId;
            const pIdx = i; // Server should ideally provide this, but order is consistent
            const isWhite = pIdx === 0;
            const isBlack = pIdx === 1;

            return (
              <div
                key={p}
                className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-sm ${
                      isWhite
                        ? "bg-white text-slate-900 border border-slate-300"
                        : isBlack
                          ? "bg-slate-900 text-white"
                          : "bg-slate-500 text-white"
                    }`}
                  >
                    {isWhite ? "W" : isBlack ? "B" : `P${i + 1}`}
                  </div>
                  <span
                    className={`font-medium ${isMe ? "text-brand-blue font-bold" : "text-slate-700 dark:text-slate-200"}`}
                  >
                    {isMe ? "You (Operator)" : `Player ${p.slice(0, 4)}`}
                  </span>
                </div>
                {multiplayer.readyPlayers[p] && (
                  <span className="text-xs font-bold text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded">
                    READY
                  </span>
                )}
              </div>
            );
          })}
          {multiplayer?.players.length === 0 && (
            <div className="text-center text-slate-400 italic py-4">
              Waiting for players...
            </div>
          )}
        </div>
      </div>

      <div className="h-px bg-slate-200 dark:bg-slate-700 w-full" />

      {/* Shoutbox Integration */}
      <Shoutbox multiplayer={multiplayer} darkMode={darkMode} />

      <div className="flex gap-4">
        <button
          onClick={() => multiplayer?.leaveGame()}
          className="flex-1 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          Leave
        </button>
        <button
          className="flex-1 py-3 rounded-xl font-bold text-white bg-brand-blue hover:bg-brand-blue/80 transition-all shadow-lg"
          onClick={() => {
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
            {multiplayer?.availableRooms?.length || 0} Operations Active |{" "}
            {multiplayer?.onlineCount || 0} Online
          </p>
        </div>
        <button
          onClick={() => multiplayer?.refreshRooms?.()}
          className="p-2 text-slate-400 hover:text-brand-blue transition-colors"
          title="Refresh"
        >
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
        {multiplayer?.availableRooms?.map((room: any) => {
          const isPrivate = room.isPrivate;
          return (
            <div
              key={room.id}
              className={`border-2 rounded-xl p-4 transition-all bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between group ${
                isPrivate
                  ? "border-amber-200 dark:border-amber-900/30"
                  : "border-slate-200 dark:border-slate-700 hover:border-brand-blue"
              }`}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-lg text-slate-700 dark:text-slate-200">
                    {isPrivate ? "Private Operation" : room.id}
                  </span>
                  {isPrivate && <Key size={14} className="text-amber-500" />}
                </div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  {room.mode} • {room.status}
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                <span className="text-xs font-black bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-1 rounded">
                  {room.players}/{room.maxPlayers || 4}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isPrivate) {
                      setView("join");
                    } else {
                      multiplayer.joinGame(room.id);
                      setView("host");
                    }
                  }}
                  className={`px-4 py-2 rounded-lg font-black text-xs uppercase tracking-widest transition-all ${
                    isPrivate
                      ? "bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-500/20"
                      : "bg-brand-blue hover:bg-brand-blue/80 text-white shadow-lg shadow-brand-blue/20"
                  }`}
                >
                  {isPrivate ? "Enter Code" : "Join"}
                </button>
              </div>
            </div>
          );
        })}
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
    <MenuPageLayout>
      <MenuPageHeader
        label={headerLabel}
        backLabel={backLabel}
        onBackClick={() => {
          if (view !== "menu") {
            if (view === "host") multiplayer?.leaveGame();
            setView("menu");
          } else {
            navigate("/play");
          }
        }}
      />

      {view === "menu" && renderMenu()}
      {view === "join" && renderJoinParams()}
      {(view === "host" || multiplayer?.roomId) && renderHost()}
      {view === "global" && renderGlobal()}
    </MenuPageLayout>
  );
};

export default MenuLobby;
export const LazyMenuLobby = lazy(() => import("./MenuLobby"));
