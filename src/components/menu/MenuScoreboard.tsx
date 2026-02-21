import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { io, Socket } from "socket.io-client";
import { ArrowLeft, RefreshCw, Trophy, Eye } from "lucide-react";
import MenuCard from "./MenuCard";

const getServerUrl = () => {
  if (typeof window === "undefined") return "http://localhost:3001";
  return window.location.protocol + "//" + window.location.hostname + ":3001";
};

interface Match {
  id: string;
  players: number;
  mode: string;
  turn?: string;
  winner?: string;
  date?: string;
}

interface ScoreboardData {
  active: Match[];
  history: Match[];
}

const Scoreboard = () => {
  const [data, setData] = useState<ScoreboardData>({ active: [], history: [] });
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState<Socket | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const newSocket = io(getServerUrl());
    setSocket(newSocket);

    newSocket.on("connect", () => {
      newSocket.emit("request_scoreboard");
    });

    newSocket.on("scoreboard_data", (receivedData: ScoreboardData) => {
      setData(receivedData);
      setLoading(false);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const handleRefresh = () => {
    if (socket) {
      setLoading(true);
      socket.emit("request_scoreboard");
    }
  };

  const handleSpectate = (roomId: string) => {
    // Actually we just use the join lobby route with a param or just rely on the existing multiplayer lobby
    navigate(`/play/lobby?join=${roomId}`);
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex flex-col items-center py-12 px-4 transition-colors">
      <div className="w-full max-w-4xl flex items-center justify-between mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors uppercase tracking-widest text-xs font-black"
        >
          <ArrowLeft size={16} />
          Back
        </button>
        <div className="flex items-center gap-4">
          <Trophy className="w-8 h-8 text-brand-red" />
          <h1 className="text-3xl font-black text-slate-800 dark:text-slate-100 uppercase tracking-widest text-center">
            Global Scoreboard
          </h1>
        </div>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 text-slate-500 hover:text-brand-blue transition-colors uppercase tracking-widest text-xs font-black"
          disabled={loading}
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Active Matches Column */}
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-black text-brand-blue uppercase tracking-widest flex items-center gap-2 mb-2">
            <Eye size={20} /> Active Matches
          </h2>
          {loading && <p className="text-slate-500 text-sm">Loading...</p>}
          {!loading && data.active.length === 0 && (
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 text-center text-slate-500 font-bold tracking-widest text-sm uppercase">
              No active matches right now.
            </div>
          )}
          {data.active.map((match) => (
            <MenuCard
              key={match.id}
              title={`Room ${match.id.substring(0, 4)}`}
              description={`Mode: ${match.mode} | Players: ${match.players}/4`}
              Icon={Eye}
              color="blue"
              onClick={() => handleSpectate(match.id)}
              badge="Spectate"
            />
          ))}
        </div>

        {/* Match History Column */}
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-2 border-slate-300 dark:border-slate-700">
            <Trophy size={20} /> Recent Results
          </h2>
          {loading && <p className="text-slate-500 text-sm">Loading...</p>}
          {!loading && data.history.length === 0 && (
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 text-center text-slate-500">
              No completed matches yet.
            </div>
          )}
          {/* Reverse array to show most recent first */}
          {[...data.history].reverse().map((match, i) => (
            <div
              key={i}
              className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border-[3px] border-slate-200 dark:border-slate-700 flex justify-between items-center"
            >
              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold text-slate-400">
                  {new Date(match.date || "").toLocaleString()}
                </span>
                <span className="text-sm font-bold text-slate-700 dark:text-slate-300 capitalize">
                  {match.mode} Match
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Trophy
                  size={16}
                  className={`text-${match.winner === "player1" ? "brand-red" : match.winner === "player2" ? "brand-blue" : "emerald-500"}`}
                />
                <span className="font-black text-slate-800 dark:text-slate-100 uppercase tracking-widest text-sm">
                  {match.winner} Win
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Scoreboard;
