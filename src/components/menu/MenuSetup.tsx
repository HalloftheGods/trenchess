import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Database,
  Sparkles,
  Map as MapIcon,
  Crown,
  Sword,
  Flag,
} from "lucide-react";
import MenuCard from "../MenuCard";
import SectionDivider from "../ui/SectionDivider";
import ChiLayoutModal from "../ChiLayoutModal";
import { useMenuContext } from "./MenuLayout";
import { DualToneNS, DualToneEW, QuadTone, AllianceTone } from "../MenuIcons";
import type { GameMode } from "../../types";

const MenuSetup: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const {
    darkMode,
    onStartGame,
    onOpenLibrary,
    selectedPreset,
    setSelectedPreset,
    selectedBoard,
    setSelectedBoard,
    seeds,
    setPreviewSeedIndex,
    previewSeedIndex,
    playerConfig,
  } = useMenuContext();

  const [step, setStep] = useState(1); // 1 = Board, 2 = Preset
  const [chiModalOpen, setChiModalOpen] = useState(false);

  // Initialize from URL param if present
  useEffect(() => {
    // const mode = searchParams.get("mode");
    // If mode is "couch" or "practice", maybe pre-select board?
    // Current logic in MenuPlay:
    // Couch -> /play/setup?mode=couch
    // Practice -> /play/setup?mode=practice
    // But what does "couch" imply for board? Usually implies local.
    // What does "practice" imply? AI.
    // The board selection (NvS vs EvW) is still up to user?
    // Or maybe Step 1 is board, Step 2 is Preset.
    // Let's keep it simple.
  }, [searchParams]);

  const handleBoardSelect = (mode: GameMode) => {
    setSelectedBoard(mode);
    setStep(2);
  };

  const handlePresetSelect = (
    preset: "classic" | "quick" | "terrainiffic" | "custom" | "zen-garden",
  ) => {
    setSelectedPreset(preset);
    if (preset === "terrainiffic") {
      setChiModalOpen(true);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-12 w-full max-w-7xl animate-in slide-in-from-bottom-8 fade-in duration-700 pb-20 items-start justify-center">
      {/* Left Panel: Tactical Preview (Navigation) */}
      <div className="w-full lg:w-[400px] lg:shrink-0 lg:sticky lg:top-8 space-y-8">
        <div className="flex items-center justify-center gap-4">
          <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1" />
          <h2 className="text-sm font-black text-center text-amber-500 uppercase tracking-[0.2em] whitespace-nowrap">
            Step {step} of 2
          </h2>
          <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1" />
        </div>

        <div className="flex justify-center -mt-2">
          <div className="flex gap-2 w-32">
            <div
              className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${step >= 1 ? "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]" : "bg-slate-200 dark:bg-slate-800"}`}
            />
            <div
              className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${step >= 2 ? "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]" : "bg-slate-200 dark:bg-slate-800"}`}
            />
          </div>
        </div>

        <div className="grid grid-cols-5 gap-4">
          <button
            onClick={() => {
              if (step === 2) {
                setStep(1);
              } else {
                navigate("/play");
              }
            }}
            className="py-4 rounded-2xl font-bold bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-300 dark:hover:bg-slate-700 hover:scale-[1.02] transition-all flex items-center justify-center shadow-lg cursor-pointer"
            title="Back"
          >
            <ChevronLeft size={24} />
          </button>

          <button
            onClick={() => navigate("/learn/manual")}
            className="py-4 rounded-2xl font-bold bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-300 dark:hover:bg-slate-700 hover:scale-[1.02] transition-all flex items-center justify-center shadow-lg cursor-pointer"
            title="Field Manual"
          >
            <BookOpen size={24} />
          </button>

          <button
            onClick={onOpenLibrary}
            className="py-4 rounded-2xl font-bold bg-amber-100 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 hover:bg-amber-200 dark:hover:bg-amber-900/40 hover:scale-[1.02] transition-all flex items-center justify-center shadow-lg border-2 border-amber-500/20 cursor-pointer"
            title="Seed Library"
          >
            <Database size={24} />
          </button>

          <button
            onClick={() => onStartGame(selectedBoard || "2p-ns", "zen-garden")}
            className="py-4 rounded-2xl font-bold bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-emerald-900/40 hover:scale-[1.02] transition-all flex items-center justify-center shadow-lg border-2 border-emerald-500/20 cursor-pointer"
            title="Zen Garden (Editor)"
          >
            <Sparkles size={24} />
          </button>

          <button
            onClick={() => setStep(2)}
            disabled={step === 2 || !selectedBoard}
            className={`py-4 rounded-2xl font-bold transition-all flex items-center justify-center shadow-lg ${
              step === 2
                ? "bg-slate-100 dark:bg-slate-800/50 text-slate-300 dark:text-slate-700 cursor-not-allowed hidden"
                : !selectedBoard
                  ? "bg-slate-100 dark:bg-slate-800/50 text-slate-300 dark:text-slate-700 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white hover:scale-[1.02] shadow-blue-500/25 cursor-pointer"
            }`}
            title="Next Step"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <button
            onClick={() => {
              if (selectedBoard && selectedPreset) {
                onStartGame(selectedBoard, selectedPreset, playerConfig);
              }
            }}
            disabled={!selectedBoard || !selectedPreset}
            className={`w-full py-6 rounded-3xl font-black text-white text-xl uppercase tracking-widest transition-all gap-3 flex justify-center items-center shadow-2xl ${
              selectedBoard && selectedPreset
                ? "bg-red-600 hover:bg-red-700 hover:scale-[1.02] hover:shadow-red-500/25 cursor-pointer"
                : "bg-slate-300 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed opacity-50"
            }`}
          >
            <div className="relative">
              <span className="truncate">Commence Trenchess</span>
              <div className="absolute inset-0 bg-white/20 blur-lg rounded-full animate-pulse opacity-50" />
            </div>
          </button>
        </div>
      </div>

      {/* Right Panel: Options */}
      <div className="flex-1 w-full flex flex-col gap-8">
        <div className="flex flex-col mb-4">
          <SectionDivider
            label={
              step === 1
                ? "Step 1: Choose The Board"
                : "Step 2: Choose The Layout"
            }
          />
        </div>

        <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
          {step === 1 ? (
            <>
              <MenuCard
                onClick={() => handleBoardSelect("2p-ns")}
                isSelected={selectedBoard === "2p-ns"}
                darkMode={darkMode}
                title="North vs South"
                description="2 Player • Top vs Bottom"
                Icon={DualToneNS}
                color="red"
                className={`custom-border-[conic-gradient(from_315deg,_#ef4444_0deg_90deg,_#ffffff_90deg_180deg,_#3b82f6_180deg_270deg,_#ffffff_270deg_360deg)] w-full`}
              />
              <MenuCard
                onClick={() => handleBoardSelect("2p-ew")}
                isSelected={selectedBoard === "2p-ew"}
                darkMode={darkMode}
                title="East vs West"
                description="2 Player • Left vs Right"
                Icon={DualToneEW}
                color="emerald"
                className={`custom-border-[conic-gradient(from_315deg,_#ffffff_0deg_90deg,_#22c55e_90deg_180deg,_#ffffff_180deg_270deg,_#eab308_270deg_360deg)] w-full`}
              />
              <MenuCard
                onClick={() => handleBoardSelect("4p")}
                isSelected={selectedBoard === "4p"}
                darkMode={darkMode}
                title="Ultimate Showdown"
                description="4 Player • Quadrant Combat"
                Icon={QuadTone}
                color="emerald"
                className={`custom-border-[conic-gradient(from_315deg,_#ef4444_0deg_90deg,_#eab308_90deg_180deg,_#3b82f6_180deg_270deg,_#22c55e_270deg_360deg)] w-full`}
              />
              <MenuCard
                onClick={() => handleBoardSelect("2v2")}
                isSelected={selectedBoard === "2v2"}
                darkMode={darkMode}
                title="Capture the World"
                description="4 Player • 2 vs 2 Co-Op"
                Icon={AllianceTone}
                color="slate"
                className={`custom-border-[conic-gradient(from_315deg,_#ef4444_0deg_90deg,_#eab308_90deg_180deg,_#3b82f6_180deg_270deg,_#22c55e_270deg_360deg)] w-full`}
              />
            </>
          ) : (
            <>
              <MenuCard
                onClick={() => {
                  handlePresetSelect("terrainiffic");
                }}
                isSelected={selectedPreset === "terrainiffic"}
                darkMode={darkMode}
                title="Trenchess Chi"
                description="Tactical Layouts from our Zen Garden."
                Icon={MapIcon}
                color="emerald"
                badge="Flow Mode"
                hoverText="χ"
                className="w-full"
              />
              <MenuCard
                onClick={() => handlePresetSelect("quick")}
                isSelected={selectedPreset === "quick"}
                darkMode={darkMode}
                title="Trenchess Alpha"
                description='"Hit me Entropy one more Time!"'
                Icon={Sparkles}
                color="blue"
                badge="Chaos Mode"
                hoverText="α"
                className="w-full"
              />
              <MenuCard
                onClick={() => handlePresetSelect("classic")}
                isSelected={selectedPreset === "classic"}
                darkMode={darkMode}
                title="Trenchess Pi"
                description='A slice of classic topped with "randomness".'
                Icon={Crown}
                color="amber"
                badge="Legacy Mode"
                hoverText="π"
                className="w-full"
              />
              <MenuCard
                onClick={() => handlePresetSelect("custom")}
                isSelected={selectedPreset === "custom"}
                darkMode={darkMode}
                title="Trenchess Omega"
                description="Control over units, terrain, and spaces."
                Icon={Sword}
                color="red"
                badge="God Mode"
                hoverText="Ω"
                className="w-full"
              />
            </>
          )}
        </div>

        {/* Disclaimer for 2v2 */}
        {selectedBoard === "2v2" && step === 1 && (
          <div className="animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="relative p-6 rounded-[2.5rem] bg-slate-900/40 backdrop-blur-md border border-white/5 shadow-2xl overflow-hidden">
              <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-amber-500/30 rounded-tl-[2.5rem]" />
              <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-orange-500/30 rounded-br-[2.5rem]" />

              <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 px-2">
                <div className="p-5 rounded-[1.5rem] bg-gradient-to-br from-red-600 to-red-900 shadow-2xl shadow-red-950/50 -rotate-6 shrink-0 border border-white/10">
                  <Flag
                    className="text-white fill-white/10"
                    size={42}
                    strokeWidth={3}
                  />
                </div>

                <div className="flex-1 flex flex-col lg:flex-row lg:items-center gap-8">
                  <div className="shrink-0 flex flex-col items-center lg:items-start text-center lg:text-left">
                    <h4 className="text-3xl font-black text-white uppercase tracking-tighter leading-[0.9]">
                      Capture
                      <br />
                      The <span className="relative">Flag(s)</span>
                    </h4>
                  </div>

                  <div className="w-full lg:w-px h-px lg:h-12 bg-white/10" />

                  <div className="flex flex-wrap justify-center lg:justify-start gap-6">
                    <div className="flex flex-col items-center lg:items-start">
                      <span className="text-[10px] font-bold text-red-500 uppercase tracking-[0.2em] mb-1">
                        Objective
                      </span>
                      <span className="text-sm font-medium text-slate-300">
                        Recover The Flag
                      </span>
                    </div>
                    <div className="flex flex-col items-center lg:items-start">
                      <span className="text-[10px] font-bold text-red-500 uppercase tracking-[0.2em] mb-1">
                        Victory
                      </span>
                      <span className="text-sm font-medium text-slate-300">
                        Return to Base
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <ChiLayoutModal
        isOpen={chiModalOpen}
        onClose={() => setChiModalOpen(false)}
        seeds={seeds}
        onSelect={setPreviewSeedIndex}
        selectedIndex={previewSeedIndex}
        activeMode={selectedBoard}
      />
    </div>
  );
};

export default MenuSetup;
