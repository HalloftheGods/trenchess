import { useState } from "react";
import { ArrowLeft, Target, Shield, Crosshair } from "lucide-react";
import { useNavigate } from "react-router-dom";
import statsDataObj from "@/assets/statistics.json";
import {
  PIECES,
  unitColorMap,
  UNIT_DETAILS,
  INITIAL_ARMY,
} from "@engineConfigs/unitDetails";
import { TERRAIN_DETAILS, TERRAIN_TYPES } from "@engineConfigs/terrainDetails";
import { useRouteContext } from "@/app/context/RouteContext";
import type { PieceStyle } from "@constants/unit.constants";

// Cast the imported JSON to our type
const statsData = statsDataObj as unknown as Record<
  string,
  Record<
    string,
    {
      total: number;
      captures: number;
      rate: number;
      terrainStats: Record<
        string,
        {
          total: number;
          captures: number;
          rate: number;
        }
      >;
    }
  >
>;

const getUnitIcon = (type: string, pieceStyle: PieceStyle) => {
  const armyUnit = INITIAL_ARMY.find((u) => u.type === type);
  if (!armyUnit) return null;

  if (pieceStyle === "lucide") {
    const Icon = armyUnit.lucide;
    return <Icon className="w-full h-full" />;
  }
  if (pieceStyle === "custom") {
    const Icon = armyUnit.custom;
    return <Icon className="w-full h-full" />;
  }

  return (
    <span className="text-lg leading-none">
      {armyUnit[pieceStyle as "emoji" | "bold" | "outlined"]}
    </span>
  );
};

const StatBar = ({
  rate,
  colorClass,
}: {
  rate: number;
  colorClass: string;
}) => {
  return (
    <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden mt-2 border border-white/10 shadow-inner">
      <div
        className={`h-full rounded-full transition-all duration-1000 ease-out ${colorClass}`}
        style={{ width: `${Math.max(rate, 2)}%` }} // Minimum width to show it's 0 if needed, but actual % width
      />
    </div>
  );
};

export const StatsView = () => {
  const navigate = useNavigate();
  const { pieceStyle } = useRouteContext();
  const [selectedPiece, setSelectedPiece] = useState<string>(PIECES.PAWN);

  const pieceKeys = Object.values(PIECES);

  const currentStats = statsData[selectedPiece];
  const selectedColor = unitColorMap[selectedPiece];

  return (
    <div className="min-h-screen pt-24 pb-12 px-6 flex flex-col items-center animate-fade-in text-white z-10 relative">
      <div className="w-full max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4 border-b border-white/10 pb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-3 bg-white/5 hover:bg-white/10 rounded-full transition-colors border border-white/10 focus:outline-none focus:ring-2 focus:ring-brand-blue"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-4xl font-black uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-500 drop-shadow-sm">
              Combat Statistics
            </h1>
            <p className="text-sm text-gray-400 capitalize font-medium tracking-wide mt-1">
              Threat Geometry & Capture Rates
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Piece Selector (Sidebar) */}
          <div className="lg:col-span-4 bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col gap-2 backdrop-blur-md">
            <h2 className="text-lg font-bold text-gray-300 uppercase tracking-wide mb-2 px-2 flex items-center gap-2">
              <Crosshair className="w-5 h-5 text-gray-500" /> Choose Unit
            </h2>
            {pieceKeys.map((piece) => {
              const isActive = selectedPiece === piece;
              const color = unitColorMap[piece];

              return (
                <button
                  key={piece}
                  onClick={() => setSelectedPiece(piece)}
                  className={`flex items-center gap-4 w-full p-4 rounded-xl transition-all duration-300 text-left relative overflow-hidden group ${
                    isActive
                      ? `${color.bg} border-2 ${color.border} ${color.shadow}`
                      : "hover:bg-white/10 border-2 border-transparent"
                  }`}
                >
                  {isActive && (
                    <div
                      className={`absolute left-0 top-0 bottom-0 w-1 ${color.ribbonBg}`}
                    />
                  )}
                  <div
                    className={`p-2 rounded-lg flex items-center justify-center w-10 h-10 ${isActive ? color.bg : "bg-white/5 group-hover:bg-white/10"} ${isActive ? color.text : "text-gray-400"}`}
                  >
                    {getUnitIcon(piece, pieceStyle)}
                  </div>
                  <div>
                    <div
                      className={`font-bold capitalize text-lg ${isActive ? "text-white" : "text-gray-300"}`}
                    >
                      {UNIT_DETAILS[piece]?.title || piece}
                    </div>
                    <div className="text-xs text-gray-500 capitalize tracking-wider font-semibold">
                      {piece}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Stats Display (Main Content) */}
          <div className="lg:col-span-8 space-y-6">
            <div
              className={`space-y-8 rounded-2xl border bg-black/40 backdrop-blur-xl p-8 relative overflow-hidden border-t-4 shadow-2xl ${selectedColor?.border}`}
            >
              <div
                className={`absolute top-0 right-0 p-8 opacity-10 ${selectedColor?.text}`}
              >
                <Target className="w-32 h-32" />
              </div>

              <div className="relative z-10 flex items-center gap-6 mb-8 pb-8 border-b border-white/10">
                <div
                  className={`p-6 rounded-2xl flex items-center justify-center w-20 h-20 ${selectedColor?.bg} ${selectedColor?.text} ${selectedColor?.shadow} ${selectedColor?.ring} ring-1 text-4xl`}
                >
                  {getUnitIcon(selectedPiece, pieceStyle)}
                </div>
                <div>
                  <h2 className="text-gray-400 text-sm font-bold uppercase tracking-widest mb-1">
                    Threat Profile
                  </h2>
                  <h3 className="text-4xl font-black text-white capitalize drop-shadow-md">
                    {UNIT_DETAILS[selectedPiece]?.title || selectedPiece}
                  </h3>
                  <p className="text-sm text-gray-300 italic mt-2 opacity-80">
                    {UNIT_DETAILS[selectedPiece]?.role ||
                      "Tactical Combat Unit."}
                  </p>
                </div>
              </div>

              <div className="space-y-6 relative z-10">
                <h4 className="text-sm text-gray-400 font-bold uppercase tracking-widest flex items-center gap-2">
                  <Shield className="w-4 h-4" /> Advantage Against
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {pieceKeys.map((defender) => {
                    const matchStats = currentStats[defender];
                    const defenderColor = unitColorMap[defender];
                    const rate = matchStats?.rate || 0;

                    return (
                      <div
                        key={defender}
                        className="bg-white/5 border border-white/5 rounded-xl p-4 hover:border-white/10 transition-colors group"
                      >
                        <div className="flex justify-between items-center mb-1">
                          <div className="flex items-center gap-2">
                            <div
                              className={`p-1.5 rounded-md flex items-center justify-center w-8 h-8 ${defenderColor.bg} ${defenderColor.text}`}
                            >
                              {getUnitIcon(defender, pieceStyle)}
                            </div>
                            <span className="font-semibold text-gray-200 capitalize group-hover:text-white transition-colors">
                              {defender}
                            </span>
                          </div>
                          <div className="text-right">
                            <span
                              className={`text-xl font-bold ${rate > 10 ? "text-green-400" : rate > 4 ? "text-yellow-400" : "text-red-400"}`}
                            >
                              {rate.toFixed(1)}%
                            </span>
                          </div>
                        </div>
                        <StatBar
                          rate={rate}
                          colorClass={
                            rate > 10
                              ? "bg-gradient-to-r from-green-500 to-green-400 shadow-[0_0_10px_rgba(74,222,128,0.5)]"
                              : rate > 4
                                ? "bg-gradient-to-r from-yellow-500 to-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.5)]"
                                : "bg-gradient-to-r from-red-500 to-red-400 shadow-[0_0_10px_rgba(248,113,113,0.5)]"
                          }
                        />
                        <div className="mt-2 text-[10px] text-gray-500 font-medium tracking-wide uppercase flex justify-between">
                          <span>Threat</span>
                          <span>
                            {(matchStats?.captures || 0).toLocaleString()} of{" "}
                            {(matchStats?.total || 1).toLocaleString()}{" "}
                            simulations
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Trench Advantage Analysis */}
              <div className="flex items-center gap-2 mb-6">
                <div className="p-2 bg-indigo-500/20 rounded-lg">
                  <Shield className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <h4 className="text-xs font-black uppercase tracking-[0.2em] text-indigo-400/80">
                    Trench Advantage
                  </h4>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                    Performance gain vs Flat Ground
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {TERRAIN_DETAILS.map((terrain) => {
                  const sanctuaryList =
                    UNIT_DETAILS[selectedPiece]?.levelUp?.sanctuaryTerrain ||
                    [];
                  const isSanctuary = sanctuaryList.includes(
                    terrain.key as any,
                  );

                  // Aggregate stats for this piece starting on this terrain across ALL defenders
                  const allDefenders = Object.values(currentStats);
                  const tStats = allDefenders.map(
                    (d) => d.terrainStats[terrain.key],
                  );
                  const flatStats = allDefenders.map(
                    (d) => d.terrainStats[TERRAIN_TYPES.FLAT],
                  );

                  const totalT = tStats.reduce((acc, s) => acc + s.total, 0);
                  const capsT = tStats.reduce((acc, s) => acc + s.captures, 0);
                  const rateT = totalT > 0 ? (capsT / totalT) * 100 : 0;

                  const totalF = flatStats.reduce((acc, s) => acc + s.total, 0);
                  const capsF = flatStats.reduce(
                    (acc, s) => acc + s.captures,
                    0,
                  );
                  const rateF = totalF > 0 ? (capsF / totalF) * 100 : 0;

                  const advantage = rateT - rateF;

                  return (
                    <div
                      key={terrain.key}
                      className={`p-4 rounded-xl border transition-all duration-300 ${
                        isSanctuary
                          ? "bg-emerald-500/5 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.05)]"
                          : "bg-white/[0.02] border-white/5"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2 rounded-lg ${terrain.color.bg} ${terrain.color.text}`}
                          >
                            <terrain.icon className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-sm font-bold text-white flex items-center gap-2">
                              {terrain.label}
                              {isSanctuary && (
                                <span className="text-[8px] bg-emerald-500 text-black px-1.5 py-0.5 rounded-full font-black uppercase tracking-tighter">
                                  Sanctuary
                                </span>
                              )}
                            </div>
                            <div className="text-[9px] text-slate-500 font-bold uppercase tracking-tight">
                              {totalT.toLocaleString()} sims
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div
                            className={`text-lg font-black ${advantage > 0 ? "text-emerald-400" : advantage < 0 ? "text-rose-400" : "text-slate-400"}`}
                          >
                            {advantage > 0 ? "+" : ""}
                            {advantage.toFixed(1)}%
                          </div>
                          <div className="text-[9px] text-slate-600 font-bold uppercase">
                            vs flat
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-between text-[10px] items-center">
                        <span className="text-slate-500">Capture Rate</span>
                        <span className="text-slate-300 font-mono">
                          {rateT.toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full h-1 bg-white/5 rounded-full mt-2 overflow-hidden">
                        <div
                          className={`h-full transition-all duration-1000 ${advantage > 0 ? "bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]" : "bg-white/10"}`}
                          style={{ width: `${Math.min(rateT * 2, 100)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsView;
