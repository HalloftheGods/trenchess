/*
 * Copyright (c) 2006 - 2026 Hall of the Gods, Inc.
 * All Rights Reserved.
 */
import React from "react";
import { X, Map as MapIcon, ChevronRight } from "lucide-react";
import { MiniBoard } from "@/client/game/components/organisms/SeedLibrary";
import type { GameMode, SeedItem } from "@/core/types/game";

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
                  className={`relative w-full aspect-square rounded-[2rem] overflow-hidden border-2 transition-all duration-300 ${
                    selectedIndex === index
                      ? "border-emerald-500 shadow-xl shadow-emerald-500/20"
                      : "border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/20 shadow-lg"
                  }`}
                >
                  <MiniBoard
                    seed={item.seed}
                    mode={item.mode}
                    activeMode={activeMode}
                  />

                  {/* Overlay for selection state */}
                  {selectedIndex === index && (
                    <div className="absolute inset-0 bg-emerald-500/10 flex items-center justify-center">
                      <div className="bg-emerald-500 text-white p-2 rounded-full shadow-lg">
                        <ChevronRight size={24} />
                      </div>
                    </div>
                  )}

                  {/* Badge for Mode */}
                  <div className="absolute bottom-4 left-0 right-0 z-30 flex items-center justify-center pointer-events-none">
                    <div className="bg-slate-900/80 backdrop-blur-md text-white px-3 py-1.5 rounded-full border border-white/10 shadow-xl flex items-center justify-center">
                      <span className="text-[8px] font-black uppercase tracking-[0.2em] leading-none">
                        {item.mode}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 px-2">
                  <h3
                    className={`text-sm font-black uppercase tracking-tight truncate transition-colors ${
                      selectedIndex === index
                        ? "text-emerald-500"
                        : "text-slate-800 dark:text-slate-200 group-hover:text-emerald-400"
                    }`}
                  >
                    {item.name || "Unnamed Layout"}
                  </h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                    {item.id ? "Saved Layout" : "Default Layout"}
                  </p>
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
