/*
 * Copyright (c) 2006 - 2026 Hall of the Gods, Inc.
 * All Rights Reserved.
 */
import React, { useState } from "react";
import {
  ChevronLeft,
  Play,
  Share2,
  Calendar,
  Search,
  Database,
  Pencil,
  Bomb,
} from "lucide-react";
import { deserializeGame, adaptSeedToMode } from "@utils/gameUrl";
import { PLAYER_CONFIGS } from "@constants";
import { INITIAL_ARMY } from "@constants";
import type { GameMode } from "@/shared/types/game";

interface SeedItem {
  id: string;
  name: string;
  seed: string;
  mode: string;
  createdAt: string;
}

interface SeedLibraryProps {
  onBack: () => void;
  onLoadSeed: (seed: string) => void;
  onEditInZen: (seed: string) => void;
  activeMode?: GameMode | null;
}

import { TERRAIN_INTEL } from "@constants";

export const MiniBoard: React.FC<{
  seed: string;
  mode: string;
  activeMode?: GameMode | null;
}> = ({ seed, mode, activeMode }) => {
  let data = deserializeGame(seed);
  if (!data)
    return (
      <div className="w-full aspect-square bg-slate-800 rounded-xl flex items-center justify-center text-[10px] text-slate-500 uppercase font-black">
        Invalid Seed
      </div>
    );

  // Adapt to active mode if provided
  if (activeMode) {
    data = adaptSeedToMode(data, activeMode);
  }

  const { board, terrain } = data;
  const displayMode = activeMode || (mode as GameMode);
  const size = 12;
  const cells = [];

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const piece = board[r][c];
      const terr = terrain[r][c];
      const isAlt = (r + c) % 2 === 1;

      // Subtle tactical background
      const isTop = r < 6;
      const isLeft = c < 6;
      const territoryTint =
        displayMode === "2p-ns"
          ? isTop
            ? "bg-red-500/10"
            : "bg-blue-500/10"
          : displayMode === "2p-ew"
            ? isLeft
              ? "bg-emerald-500/10"
              : "bg-yellow-500/10"
            : isTop && isLeft
              ? "bg-red-500/10"
              : isTop && !isLeft
                ? "bg-yellow-500/10"
                : !isTop && isLeft
                  ? "bg-emerald-500/10"
                  : "bg-blue-500/10";

      const terrainInfo = TERRAIN_INTEL[terr];
      const TerrainIcon = terrainInfo?.icon as React.ElementType;

      const cellClass =
        terr !== "flat" && terrainInfo
          ? `${terrainInfo.bg.replace("/10", "/60")} shadow-inner`
          : `${isAlt ? "bg-slate-800/40 dark:bg-black/20" : "bg-slate-700/40 dark:bg-white/5"} ${territoryTint}`;

      cells.push(
        <div
          key={`${r}-${c}`}
          className={`${cellClass} w-full h-full rounded-[1px] relative flex items-center justify-center transition-colors`}
        >
          {TerrainIcon && (
            <div className={`opacity-40 scale-[0.6] ${terrainInfo.text}`}>
              <TerrainIcon size={10} />
            </div>
          )}
          {piece && (
            <div
              className={`text-[8px] absolute z-10 drop-shadow-sm ${PLAYER_CONFIGS[piece.player]?.text || "text-white"}`}
            >
              {INITIAL_ARMY.find((u) => u.type === piece.type)?.bold || "•"}
            </div>
          )}
        </div>,
      );
    }
  }

  return (
    <div className="w-full aspect-square grid grid-cols-12 gap-[1px] bg-slate-950 border border-white/10 rounded-xl overflow-hidden p-1 shadow-2xl">
      {cells}
    </div>
  );
};

const SeedLibrary: React.FC<SeedLibraryProps> = ({
  onBack,
  onLoadSeed,
  onEditInZen,
  activeMode,
}) => {
  const [seeds, setSeeds] = useState<SeedItem[]>(() => {
    const stored = localStorage.getItem("trenchess_seeds");
    if (stored) {
      try {
        const data = JSON.parse(stored);
        if (Array.isArray(data)) {
          return data.sort(
            (a: SeedItem, b: SeedItem) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          );
        }
      } catch (e) {
        console.error("Failed to parse seeds", e);
      }
    }
    return [];
  });
  const [search, setSearch] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    if (confirm("Permanently delete this seed?")) {
      const updated = seeds.filter((s) => s.id !== id);
      setSeeds(updated);
      localStorage.setItem("trenchess_seeds", JSON.stringify(updated));
    }
  };

  const handleCopyLink = (seed: string, id: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set("seed", seed);
    navigator.clipboard.writeText(url.toString()).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const filteredSeeds = seeds.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.mode.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-stone-100 dark:bg-[#050b15] text-slate-900 dark:text-slate-100 flex flex-col items-center p-4 md:p-8 transition-colors">
      <div className="w-full max-w-7xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-6">
            <button
              onClick={onBack}
              className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 shadow-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
            >
              <ChevronLeft size={24} />
            </button>
            <div>
              <h1 className="text-4xl font-black uppercase tracking-tighter flex items-center gap-3">
                <Database className="text-amber-500" size={32} />
                Seed Library
              </h1>
              <p className="text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">
                Your Vault of Tactical Formations
              </p>
            </div>
          </div>

          <div className="relative group w-full md:w-96">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-amber-500 transition-colors"
              size={18}
            />
            <input
              type="text"
              placeholder="SEARCH BY NAME OR MODE..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 rounded-2xl py-4 pl-12 pr-4 text-xs font-black uppercase tracking-widest focus:outline-none focus:border-amber-500/50 transition-all placeholder:text-slate-300 dark:placeholder:text-slate-700 shadow-xl"
            />
          </div>
        </div>

        {filteredSeeds.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center opacity-30">
            <Database size={64} className="mb-4" />
            <h3 className="text-2xl font-black uppercase tracking-tighter">
              No Seeds Found
            </h3>
            <p className="text-sm font-bold uppercase tracking-widest mt-2">
              Save your first layout in Zen Garden to see it here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {filteredSeeds.map((item) => (
              <div
                key={item.id}
                className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 rounded-[2.5rem] p-6 shadow-2xl hover:scale-[1.02] transition-all group relative overflow-hidden flex flex-col"
              >
                {/* Mini Board Preview */}
                <div className="mb-6 relative">
                  <MiniBoard
                    seed={item.seed}
                    mode={item.mode}
                    activeMode={activeMode}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white/10 dark:from-black/40 to-transparent pointer-events-none rounded-lg" />

                  {/* Board Mode Badge */}
                  <div className="absolute bottom-4 left-0 right-0 z-10 flex items-center justify-center pointer-events-none">
                    <div className="bg-slate-900/80 backdrop-blur-md text-white px-3 py-1.5 rounded-full border border-white/10 shadow-xl flex items-center justify-center">
                      <span className="text-[8px] font-black uppercase tracking-[0.2em] leading-none">
                        {item.mode}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Seed Info */}
                <div className="flex-1">
                  <h3 className="text-lg font-black uppercase tracking-tighter truncate leading-tight group-hover:text-amber-500 transition-colors">
                    {item.name}
                  </h3>
                  <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-2">
                    <Calendar size={12} />
                    {new Date(item.createdAt).toLocaleDateString()}
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-6 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onLoadSeed(item.seed)}
                    className="flex items-center justify-center gap-2 bg-brand-red hover:bg-brand-red/80 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-brand-red/20 cursor-pointer"
                  >
                    <Play size={14} /> Play
                  </button>
                  <button
                    onClick={() => onEditInZen(item.seed)}
                    className="flex items-center justify-center gap-2 bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-600 dark:text-emerald-400 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-emerald-500/20 cursor-pointer"
                  >
                    <Pencil size={14} /> Edit
                  </button>
                </div>

                <div className="mt-2 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleCopyLink(item.seed, item.id)}
                    className={`flex items-center justify-center gap-2 ${copiedId === item.id ? "bg-amber-500 text-white cursor-default" : "bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400 cursor-pointer"} py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all`}
                  >
                    {copiedId === item.id ? (
                      <>
                        <Play size={14} /> Copied
                      </>
                    ) : (
                      <>
                        <Share2 size={14} /> Share
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="flex items-center justify-center gap-2 bg-slate-100 dark:bg-white/5 hover:bg-brand-red/10 hover:text-brand-red text-slate-500 dark:text-slate-400 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer"
                  >
                    <Bomb size={14} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SeedLibrary;
