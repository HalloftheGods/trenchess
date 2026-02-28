import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import {
  Trophy,
  Clock,
  Hash,
  Users,
  Activity,
  Swords,
  Bot,
  User,
  ChevronRight,
} from "lucide-react";
import ScoreboardLayout from "@/app/core/blueprints/layouts/ScoreboardLayout";
import { RouteBoardPreview } from "@/shared/components/organisms/RouteBoardPreview";
import type { GameMode } from "@tc.types/game";
import RoutePageHeader from "@/shared/components/organisms/RoutePageHeader";
import { useRouteContext } from "@context";
import { analytics } from "@/shared/utilities/analytics";
import { ROUTES } from "@/app/routes";

import { getServerUrl } from "@/shared/utilities/env";

interface Match {
  id: string;
  players: number;
  mode: string;
  turn?: string;
  winner?: string;
  date?: string;
  playerTypes?: Record<string, "human" | "computer">;
  seed?: string;
}

interface ScoreboardData {
  active: Match[];
  history: Match[];
}

interface ScoreboardProps {
  darkMode: boolean;
}

export const ScoreboardView = ({ darkMode }: ScoreboardProps) => {
  const { setPreviewConfig, setTerrainSeed } = useRouteContext();
  const [data, setData] = useState<ScoreboardData>({ active: [], history: [] });
  const [loading, setLoading] = useState(true);
  const [hoveredMatch, setHoveredMatch] = useState<Match | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const newSocket = io(getServerUrl());

    newSocket.on("connect", () => {
      newSocket.emit("request_scoreboard");
    });

    newSocket.on("scoreboard_data", (receivedData: ScoreboardData) => {
      setData(receivedData);
      setLoading(false);
      if (receivedData.active.length > 0)
        setHoveredMatch(receivedData.active[0]);
      else if (receivedData.history.length > 0)
        setHoveredMatch(receivedData.history[receivedData.history.length - 1]);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const getModeLabel = (mode: string) => {
    switch (mode) {
      case "2p-ns":
        return "North vs South";
      case "2p-ew":
        return "East vs West";
      case "2v2":
        return "Alliance Mode";
      case "4p":
        return "Showdown";
      default:
        return mode;
    }
  };

  useEffect(() => {
    const isHoveredMatchFound = hoveredMatch !== null;

    if (isHoveredMatchFound) {
      setPreviewConfig({
        mode: (hoveredMatch.mode as GameMode) || "2p-ns",
        protocol: "custom",
        showIcons: true,
        label: getModeLabel(hoveredMatch.mode),
      });
      if (hoveredMatch.seed) {
        setTerrainSeed(Number(hoveredMatch.seed));
      }
    } else {
      setPreviewConfig({ mode: null, label: "Ready for Deployment" });
    }
  }, [hoveredMatch, setPreviewConfig, setTerrainSeed]);

  const handleSpectate = (roomId: string) => {
    analytics.trackEvent("Scoreboard", "Spectate", roomId);
    navigate(`${ROUTES.play.lobby}?join=${roomId}`);
  };

  const sidebar = (
    <div className="w-full flex flex-col gap-8 animate-in fade-in slide-in-from-right-8 duration-500">
      <div className="w-full flex justify-center">
        <RouteBoardPreview />
      </div>

      {hoveredMatch && (
        <div className="flex flex-col gap-2 p-6 bg-white/5 dark:bg-black/20 rounded-3xl border border-white/5 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
              Match Signature
            </span>
            <span className="text-[10px] font-mono text-brand-red uppercase">
              {hoveredMatch.id.substring(0, 8)}
            </span>
          </div>
          <div className="h-px bg-white/5 my-2" />
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">
                State
              </span>
              <span
                className={`text-xs font-black uppercase tracking-widest ${hoveredMatch.winner ? "text-emerald-500" : "text-brand-blue"}`}
              >
                {hoveredMatch.winner ? "Archive" : "In Progress"}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">
                Players
              </span>
              <span className="text-xs font-black uppercase tracking-widest text-slate-300">
                {hoveredMatch.players}/4 Units
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <ScoreboardLayout darkMode={darkMode} sidebar={sidebar}>
      <RoutePageHeader
        label="Global Scoreboard"
        onBackClick={() => navigate(ROUTES.home)}
        hidePreview
      />

      <section className="flex flex-col gap-8 mt-4">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between border-b-2 border-slate-200 dark:border-white/5 pb-4">
            <h2 className="text-xl font-black text-brand-blue uppercase tracking-[0.2em] flex items-center gap-3">
              <Activity className="w-6 h-6 animate-pulse" /> Active Deployments
            </h2>
            <span className="bg-brand-blue/10 text-brand-blue text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
              {data.active.length} Live
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {loading && (
              <p className="text-slate-500 text-sm font-bold animate-pulse">
                Scanning frequencies...
              </p>
            )}
            {!loading && data.active.length === 0 && (
              <div className="bg-white/50 dark:bg-slate-900/50 rounded-3xl p-12 border-2 border-dashed border-slate-200 dark:border-white/5 text-center text-slate-400 font-bold tracking-widest text-sm uppercase">
                All Fronts Quiet.
              </div>
            )}
            {data.active.map((match) => (
              <div
                key={match.id}
                onMouseEnter={() => setHoveredMatch(match)}
                className="group relative bg-white dark:bg-slate-900/80 p-6 rounded-[2rem] border-2 border-slate-200 dark:border-white/5 hover:border-brand-blue/50 transition-all hover:-translate-y-1 cursor-pointer overflow-hidden"
                onClick={() => handleSpectate(match.id)}
              >
                <div className="absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-brand-blue/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="flex items-center justify-between gap-8 relative z-10">
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 bg-brand-blue/10 rounded-2xl flex items-center justify-center text-brand-blue">
                      <Swords size={28} />
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-black uppercase tracking-widest text-slate-800 dark:text-white">
                          Zone {match.id.substring(0, 4)}
                        </span>
                        <span className="text-[10px] font-black bg-brand-blue text-white px-2 py-0.5 rounded uppercase tracking-tighter">
                          Live
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                        <span className="flex items-center gap-1">
                          <Hash size={12} /> {getModeLabel(match.mode)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users size={12} /> {match.players}/4 Units
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="hidden md:flex items-center gap-2">
                      <Bot size={16} className="text-slate-400" />
                      <div className="flex gap-1">
                        {[1, 2, 3, 4].map((p) => (
                          <div
                            key={p}
                            className={`w-1.5 h-6 rounded-full ${p <= match.players ? "bg-brand-blue" : "bg-slate-200 dark:bg-slate-800 opacity-30"}`}
                          />
                        ))}
                      </div>
                      <User size={16} className="text-slate-400" />
                    </div>
                    <ChevronRight
                      size={24}
                      className="text-slate-300 group-hover:text-brand-blue group-hover:translate-x-1 transition-all"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between border-b-2 border-slate-200 dark:border-white/5 pb-4">
            <h2 className="text-xl font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-3">
              <Clock className="w-6 h-6" /> Declassified Intel
            </h2>
            <span className="bg-slate-100 dark:bg-white/5 text-slate-500 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
              {data.history.length} Archived
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {[...data.history].reverse().map((match, i) => (
              <div
                key={i}
                onMouseEnter={() => setHoveredMatch(match)}
                className="group bg-white/40 dark:bg-slate-900/40 p-4 rounded-2xl border border-slate-200 dark:border-white/5 hover:border-slate-400 dark:hover:border-slate-700 transition-all flex items-center justify-between gap-6 cursor-crosshair"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-400">
                    <Trophy
                      size={18}
                      className={
                        match.winner === "red"
                          ? "text-brand-red"
                          : match.winner === "blue"
                            ? "text-brand-blue"
                            : ""
                      }
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest">
                      Victory: {match.winner || "Draw"}
                    </span>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
                      {new Date(match.date || "").toLocaleString(undefined, {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}{" "}
                      • {getModeLabel(match.mode)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 opacity-40 group-hover:opacity-100 transition-opacity">
                  <div className="text-[10px] font-mono text-slate-500 uppercase">
                    Archive_{match.id.substring(0, 4)}
                  </div>
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </ScoreboardLayout>
  );
};

export default ScoreboardView;
