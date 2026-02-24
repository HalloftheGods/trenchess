/*
 * Copyright (c) 2006 - 2026 Hall of the Gods, Inc.
 * All Rights Reserved.
 */
import React from "react";
import { X, Map as MapIcon, ChevronRight } from "lucide-react";
import BoardPreview from "@/client/game/shared/components/organisms/BoardPreview";
import { useRouteContext } from "@/route.context";
import type { GameMode, SeedItem } from "@/shared/types/game";

interface ChiLayoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  seeds: SeedItem[];
  onSelect: (index: number) => void;
  selectedIndex: number;
  activeMode?: GameMode | null;
}

const ChiLayoutModal: React.FC<ChiLayoutModalProps> = ({
  isOpen,
  onClose,
  seeds,
  onSelect,
  selectedIndex,
  activeMode,
}) => {
  const { darkMode, pieceStyle } = useRouteContext();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-5xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-white/10 shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="p-8 border-b border-slate-100 dark:border-white/5 flex items-center justify-between bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
              <MapIcon size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black uppercase tracking-tighter">
                Select Chi Layout
              </h2>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                Choose from {seeds.length} available configurations
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all hover:rotate-90 cursor-pointer"
          >
            <X size={24} />
          </button>
        </div>

        {/* Scrollable Grid */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {seeds.map((item, index) => (
              <button
                key={`${item.id || index}`}
                onClick={() => {
                  onSelect(index);
                  onClose();
                }}
                className={`flex flex-col text-left group transition-all duration-300 cursor-pointer ${
                  selectedIndex === index
                    ? "ring-4 ring-emerald-500/30 scale-[1.02]"
                    : "hover:scale-[1.02]"
                }`}
              >
                <div
                  className={`relative w-full aspect-square rounded-2xl overflow-hidden border-2 transition-all duration-500 ${
                    selectedIndex === index
                      ? "border-emerald-500 shadow-[0_0_25px_rgba(16,185,129,0.3)] scale-[1.02] z-10"
                      : "border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/20 shadow-lg"
                  }`}
                >
                  <BoardPreview
                    selectedMode={(item.mode as GameMode) || activeMode}
                    selectedProtocol="terrainiffic"
                    customSeed={item.seed}
                    darkMode={darkMode}
                    pieceStyle={pieceStyle}
                    showTerrainIcons
                    hideUnits={true}
                    variant="mini"
                  />

                  {/* Overlay for selection state */}
                  {selectedIndex === index && (
                    <div className="absolute inset-0 bg-emerald-500/5 flex items-center justify-center pointer-events-none z-40">
                      <div className="bg-emerald-500 text-white p-2 rounded-full shadow-lg scale-110 animate-in zoom-in duration-300">
                        <ChevronRight size={24} />
                      </div>
                    </div>
                  )}

                  {/* Badge for Mode */}
                  <div className="absolute top-3 right-3 z-30 pointer-events-none">
                    <div className="bg-slate-900/90 backdrop-blur-md text-white px-2 py-1 rounded-md border border-white/10 shadow-xl">
                      <span className="text-[7px] font-black uppercase tracking-[0.2em] leading-none">
                        {item.mode}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 px-1">
                  <h3
                    className={`text-sm font-black uppercase tracking-tight truncate transition-colors ${
                      selectedIndex === index
                        ? "text-emerald-500"
                        : "text-slate-800 dark:text-slate-200 group-hover:text-emerald-400"
                    }`}
                  >
                    {item.name || "Unnamed Layout"}
                  </h3>
                  <div className="flex items-center gap-2 mt-1 opacity-60">
                    <div className={`w-1 h-1 rounded-full ${selectedIndex === index ? "bg-emerald-500" : "bg-slate-400"}`} />
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                      {item.id ? "Tactical Blueprint" : "Default Field"}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-white/5 flex justify-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">
            Tip: You can also use the arrows in the preview board to cycle
            through layouts.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChiLayoutModal;
