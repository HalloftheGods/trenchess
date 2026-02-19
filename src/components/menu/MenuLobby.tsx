import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { useMenuContext } from "./MenuLayout";

const MenuLobby: React.FC = () => {
  const navigate = useNavigate();
  const { multiplayer } = useMenuContext();
  const [joinLobbyCode, setJoinLobbyCode] = useState("");

  return (
    <div className="w-full max-w-md animate-in slide-in-from-bottom-8 fade-in duration-700 pb-20 flex flex-col items-center">
      <button
        onClick={() => navigate("/play")}
        className="mb-8 flex items-center gap-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
      >
        <ChevronLeft size={20} />
        <span className="text-sm font-bold uppercase tracking-widest">
          Back to Modes
        </span>
      </button>

      <div className="w-full bg-white dark:bg-slate-900 border-4 border-slate-200 dark:border-slate-800 p-8 rounded-[2rem] shadow-2xl flex flex-col gap-6">
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
          className="w-full bg-slate-100 dark:bg-slate-800 border-2 border-transparent focus:border-blue-500 rounded-xl px-4 py-4 text-center font-black text-2xl tracking-[0.5em] outline-none transition-all uppercase placeholder:text-slate-300 dark:placeholder:text-slate-700"
          maxLength={6}
        />

        <button
          onClick={() => {
            if (joinLobbyCode) {
              multiplayer?.onJoinGame(joinLobbyCode);
            }
          }}
          disabled={!joinLobbyCode}
          className={`w-full py-4 rounded-xl font-black text-white uppercase tracking-widest transition-all shadow-lg ${
            joinLobbyCode
              ? "bg-blue-600 hover:bg-blue-700 hover:scale-[1.02]"
              : "bg-slate-300 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
          }`}
        >
          Join Lobby
        </button>
      </div>
    </div>
  );
};

export default MenuLobby;
