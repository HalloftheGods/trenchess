import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Eye, Pizza, Shell, Dices, Globe } from "lucide-react";
import MenuCard from "../MenuCard";
import SectionDivider from "../ui/SectionDivider";
import BackButton from "../ui/BackButton";
import { useMenuContext } from "./MenuContext";
import { DualToneNS, DualToneEW, QuadTone, AllianceTone } from "../MenuIcons";
import type { GameMode } from "../../types/game";

const MenuSetup: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const {
    darkMode,
    onStartGame,
    selectedPreset,
    setSelectedPreset,
    selectedBoard,
    setSelectedBoard,
    playerConfig,
    previewConfig,
  } = useMenuContext();

  const [step, setStep] = useState(1); // 1 = Board, 2 = Preset

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
    if (selectedBoard) {
      onStartGame(selectedBoard, preset, playerConfig);
    }
  };

  const playerCount = parseInt(searchParams.get("players") || "2");
  const isMultiplayerMode = playerCount >= 3;

  return (
    <div className="w-full max-w-7xl animate-in slide-in-from-bottom-8 fade-in duration-700 pb-20 flex flex-col items-center gap-8">
      {/* Header Row */}
      <div className="relative w-full mb-8">
        <SectionDivider
          label={step === 1 ? "A dance was chosen" : "And the Stage was flung"}
          color="amber"
          animate
        />
        <BackButton
          onClick={() => {
            if (step === 2) {
              setStep(1);
            } else {
              navigate("/play/local");
            }
          }}
          label={step === 2 ? "Choose Board" : "Local Gathering"}
          className="absolute left-0 -top-8"
        />
      </div>
      {/* Cards Grid */}
      <div
        className={`grid gap-4 w-full grid-cols-1 md:grid-cols-2 ${
          step === 2 ? "lg:grid-cols-4" : "lg:grid-cols-2"
        }`}
      >
        {step === 1 ? (
          <>
            {!isMultiplayerMode ? (
              <>
                <MenuCard
                  onClick={() => handleBoardSelect("2p-ns")}
                  isSelected={selectedBoard === "2p-ns"}
                  preview={{
                    mode: "2p-ns",
                    hideUnits: true,
                  }}
                  darkMode={darkMode}
                  title="North vs South"
                  description="Roses are Red, Violets are Blue..."
                  Icon={DualToneNS}
                  color="red"
                  className={`custom-border-[conic-gradient(from_315deg,_#ef4444_0deg_90deg,_#ffffff_90deg_180deg,_#3b82f6_180deg_270deg,_#ffffff_270deg_360deg)] w-full`}
                />
                <MenuCard
                  onClick={() => handleBoardSelect("2p-ew")}
                  isSelected={selectedBoard === "2p-ew"}
                  preview={{
                    mode: "2p-ew",
                    hideUnits: true,
                  }}
                  darkMode={darkMode}
                  title="West vs East"
                  description="Zinnias come in Green, and Tulips dress Yellow too..."
                  Icon={DualToneEW}
                  color="emerald"
                  className={`custom-border-[conic-gradient(from_315deg,_#ffffff_0deg_90deg,_#22c55e_90deg_180deg,_#ffffff_180deg_270deg,_#eab308_270deg_360deg)] w-full`}
                />
              </>
            ) : (
              <>
                <MenuCard
                  onClick={() => handleBoardSelect("4p")}
                  isSelected={selectedBoard === "4p"}
                  preview={{
                    mode: "4p",
                    hideUnits: true,
                  }}
                  darkMode={darkMode}
                  title="Capture the Army"
                  description="4 Player • Quadrant Combat"
                  Icon={QuadTone}
                  color="emerald"
                  className={`custom-border-[conic-gradient(from_315deg,_#ef4444_0deg_90deg,_#eab308_90deg_180deg,_#3b82f6_180deg_270deg,_#22c55e_270deg_360deg)] w-full`}
                />
                <MenuCard
                  onClick={() => handleBoardSelect("2v2")}
                  isSelected={selectedBoard === "2v2"}
                  preview={{
                    mode: "2v2",
                    hideUnits: true,
                  }}
                  darkMode={darkMode}
                  title="Capture the World"
                  description="4 Player • 2 vs 2 Co-Op"
                  Icon={AllianceTone}
                  color="slate"
                  className={`custom-border-[conic-gradient(from_315deg,_#ef4444_0deg_90deg,_#eab308_90deg_180deg,_#3b82f6_180deg_270deg,_#22c55e_270deg_360deg)] w-full`}
                />
              </>
            )}
          </>
        ) : (
          <>
            <MenuCard
              onClick={() => handlePresetSelect("custom")}
              isSelected={selectedPreset === "custom"}
              preview={{
                mode: selectedBoard,
                protocol: "custom",
                hideUnits: true,
              }}
              darkMode={darkMode}
              title="Ω Omega"
              description="Setup the board Gamemaster."
              Icon={Eye}
              color="red"
              badge="Custom"
              hoverText="Ω"
              className="w-full"
            />
            <MenuCard
              onClick={() => handlePresetSelect("classic")}
              isSelected={selectedPreset === "classic"}
              preview={{
                mode: selectedBoard,
                protocol: "classic",
                hideUnits: false,
                useDefaultFormation: true,
              }}
              darkMode={darkMode}
              title="π Pi"
              description="Hot Slice of Classic - ready to go."
              Icon={Pizza}
              color="amber"
              badge="EZ as Pi"
              hoverText="π"
              className="w-full"
            />
            <MenuCard
              onClick={() => {
                handlePresetSelect("terrainiffic");
              }}
              isSelected={selectedPreset === "terrainiffic"}
              preview={{
                mode: selectedBoard,
                protocol: "terrainiffic",
                showIcons: true,
                hideUnits: true,
              }}
              darkMode={darkMode}
              title="χ Chi"
              description="Walk the community garden."
              Icon={Shell}
              color="emerald"
              badge="Feng Shui"
              hoverText="χ"
              className="w-full"
            />
            <MenuCard
              onClick={() => handlePresetSelect("quick")}
              isSelected={selectedPreset === "quick"}
              preview={{
                mode: selectedBoard,
                protocol: "quick",
                hideUnits: true,
              }}
              darkMode={darkMode}
              title="α Alpha"
              description="Roll the dice of Entropy."
              Icon={Dices}
              color="blue"
              badge="Random Chaos"
              hoverText="α"
              className="w-full"
            />
          </>
        )}
      </div>

      {/* Disclaimer for 2v2 */}
      {previewConfig.mode === "2v2" && (
        <div className="w-full animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="relative p-6 rounded-[2.5rem] bg-slate-900/40 backdrop-blur-md border border-white/5 shadow-2xl overflow-hidden">
            <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-amber-500/30 rounded-tl-[2.5rem]" />
            <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-orange-500/30 rounded-br-[2.5rem]" />
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 px-2">
              <div className="p-5 rounded-[1.5rem] bg-gradient-to-br from-red-600 to-red-900 shadow-2xl shadow-red-950/50 -rotate-6 shrink-0 border border-white/10">
                <Globe
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
                    The <span className="relative">World</span>
                  </h4>
                </div>
                <div className="w-full lg:w-px h-px lg:h-12 bg-white/10" />
                <div className="flex flex-wrap justify-center lg:justify-start gap-6">
                  <div className="flex flex-col items-center lg:items-start">
                    <span className="text-[10px] font-bold text-brand-red uppercase tracking-[0.2em] mb-1">
                      Objective
                    </span>
                    <span className="text-sm font-medium text-slate-300">
                      Capture The World
                    </span>
                  </div>
                  <div className="flex flex-col items-center lg:items-start">
                    <span className="text-[10px] font-bold text-brand-red uppercase tracking-[0.2em] mb-1">
                      Victory
                    </span>
                    <span className="text-sm font-medium text-slate-300">
                      Land in the the Center or Corners of the board
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuSetup;
