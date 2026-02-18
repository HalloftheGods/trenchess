/*
 * Copyright (c) 2006 - 2026 Hall of the Gods, Inc.
 * All Rights Reserved.
 *
 * This software is the confidential and proprietary information of Trenchess.
 */
import { useState, useEffect } from "react";
import {
  BookOpen,
  Crown,
  Map as MapIcon,
  Sparkles,
  Sword,
  ChevronLeft,
  ChevronRight,
  Flag,
  Database,
  Rocket,
  Swords,
  Users,
  Sofa,
} from "lucide-react";
import type { GameMode } from "../types";
import type { PieceStyle } from "../constants";
import ThemeControls from "./ThemeControls";
import { DualToneNS, DualToneEW, QuadTone, AllianceTone } from "./MenuIcons";
import GameLogo from "./GameLogo";
import MenuCard from "./MenuCard";
import BoardPreview from "./BoardPreview";
import CopyrightFooter from "./CopyrightFooter";
import { DEFAULT_SEEDS } from "../data/defaultSeeds";
import HeaderLobby from "./HeaderLobby";
import ChiLayoutModal from "./ChiLayoutModal";

interface MenuScreenProps {
  darkMode: boolean;
  pieceStyle: PieceStyle;
  toggleTheme: () => void;
  togglePieceStyle: () => void;
  initGame: (mode: GameMode) => void;
  onStartGame: (
    mode: GameMode,
    preset: "classic" | "quick" | "terrainiffic" | "custom" | "zen-garden",
    playerTypes?: Record<string, "human" | "computer">,
    seed?: string,
  ) => void;
  onHowToPlay: () => void;
  onTutorial: () => void;
  onCtfGuide: () => void;
  onOpenLibrary: () => void;
  multiplayer: any;
}

const MenuScreen: React.FC<MenuScreenProps> = ({
  darkMode,
  pieceStyle,
  toggleTheme,
  togglePieceStyle,
  onStartGame,
  onHowToPlay,
  onTutorial,
  onCtfGuide,
  onOpenLibrary,
  multiplayer,
}) => {
  const [selectedBoard, setSelectedBoard] = useState<GameMode | null>(null);
  const [selectedPreset, setSelectedPreset] = useState<
    "classic" | "quick" | "terrainiffic" | "custom" | "zen-garden" | null
  >(null);
  const [terrainSeed, setTerrainSeed] = useState<number>(0);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [joinLobbyCode, setJoinLobbyCode] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  const [playerConfig, setPlayerConfig] = useState<
    Record<string, "human" | "computer">
  >({
    player1: "human",
    player2: "human",
    player3: "human",
    player4: "computer", // Default Opponent
  });
  const [chiModalOpen, setChiModalOpen] = useState(false);
  const [showLearnMenu, setShowLearnMenu] = useState(false);
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);

  const togglePlayerType = (pid: string) => {
    setPlayerConfig((prev) => ({
      ...prev,
      [pid]: prev[pid] === "human" ? "computer" : "human",
    }));
  };

  const handleBoardSelect = (mode: GameMode) => {
    setSelectedBoard(mode);
    // Reset config based on mode potentially, or just keep it
  };

  const handlePresetSelect = (
    preset: "classic" | "quick" | "terrainiffic" | "custom" | "zen-garden",
  ) => {
    setSelectedPreset(preset);
    if (preset === "classic" || preset === "quick") {
      setTerrainSeed(Math.random());
    }
  };

  const handleStart = () => {
    if (selectedBoard && selectedPreset) {
      const seed =
        selectedPreset === "terrainiffic" ? currentSeed?.seed : undefined;
      onStartGame(selectedBoard, selectedPreset, playerConfig, seed);
    }
  };

  /* Seed Loading & Management */
  const [seeds, setSeeds] = useState<any[]>([]);
  const [previewSeedIndex, setPreviewSeedIndex] = useState(0);

  // Load seeds on mount
  useEffect(() => {
    const stored = localStorage.getItem("trenchess_seeds");
    let loadedSeeds: any[] = [];
    if (stored) {
      try {
        loadedSeeds = JSON.parse(stored);
      } catch (e) {
        console.error(e);
      }
    }
    // Combine defaults + user saved seeds
    // Reverse user seeds so newest are first, then defaults
    // Use functional update to avoid dependency issues if needed, or just set it
    setSeeds([...loadedSeeds.reverse(), ...DEFAULT_SEEDS]);
  }, []);

  const cycleSeed = (direction: -1 | 1) => {
    setPreviewSeedIndex((prev) => {
      const next = prev + direction;
      if (next < 0) return seeds.length - 1;
      if (next >= seeds.length) return 0;
      return next;
    });
  };

  // Derived state for the persistent BoardPreview
  const getPreviewState = () => {
    // 1. Hover: How to Play -> Terrain Only, Bland Board, Icons, No Units, Random Seed
    if (hoveredMenu === "how-to-play") {
      return {
        mode: null, // Neutral board
        protocol: "terrainiffic", // Use custom seed
        showIcons: true,
        hideUnits: true,
      };
    }
    // 2. Hover: Couch -> 2p-ns Board Only, No Terrain, No Units
    if (hoveredMenu === "couch") {
      return {
        mode: "2p-ns" as GameMode,
        protocol: null, // No protocol = No terrain/units logic usually (unless custom seed passed)
        showIcons: false,
        hideUnits: true,
      };
    }
    // 3. Hover: Worldwide -> 2v2 Board Only, No Terrain, No Units
    if (hoveredMenu === "worldwide") {
      return {
        mode: "2v2" as GameMode,
        protocol: null,
        showIcons: false,
        hideUnits: true,
      };
    }
    // 4. Default Flow
    if (currentStep >= 2) {
      return {
        mode: selectedBoard || "2p-ns",
        protocol: selectedPreset,
        showIcons: false,
        hideUnits: false, // Show units if selected
      };
    }
    return {
      mode: null,
      protocol: null,
      showIcons: false,
      hideUnits: true,
    };
  };

  const previewState = getPreviewState();
  const isPreviewReady =
    currentStep < 2
      ? false
      : !!selectedBoard && !!selectedPreset && currentStep !== 2;

  const currentSeed = seeds[previewSeedIndex];

  // For How to Play, we want a random seed from the library.
  const getRandomLibrarySeed = () => {
    if (seeds.length === 0) return undefined;
    // Hash terrainSeed to pick an index
    const idx = Math.floor(Math.abs(terrainSeed) * seeds.length) % seeds.length;
    return seeds[idx]?.seed;
  };

  const activeCustomSeed =
    hoveredMenu === "how-to-play"
      ? getRandomLibrarySeed()
      : !hoveredMenu && selectedPreset === "terrainiffic"
        ? currentSeed?.seed
        : undefined;

  return (
    <div className="min-h-screen bg-stone-100 dark:bg-[#050b15] text-slate-900 dark:text-slate-100 flex flex-col items-center p-8 transition-colors overflow-y-auto w-full">
      <ThemeControls
        darkMode={darkMode}
        pieceStyle={pieceStyle}
        toggleTheme={toggleTheme}
        togglePieceStyle={togglePieceStyle}
      />

      <div className="w-full max-w-7xl mt-4 mb-8 flex flex-col lg:flex-row items-center justify-between gap-8 px-4 z-10 relative">
        <div
          className="cursor-pointer hover:scale-105 transition-transform flex-1 flex justify-center w-full"
          onClick={() => {
            setCurrentStep(0);
            setShowLearnMenu(false);
            setIsJoining(false);
            setHoveredMenu(null);
          }}
        >
          <GameLogo size="medium" />
        </div>

        {/* Persistent Board Preview */}
        <div className="w-full max-w-[400px] lg:w-[400px] shrink-0">
          <BoardPreview
            selectedMode={previewState.mode}
            selectedProtocol={previewState.protocol as any}
            darkMode={darkMode}
            pieceStyle={pieceStyle}
            isReady={isPreviewReady}
            terrainSeed={terrainSeed}
            customSeed={activeCustomSeed}
            playerConfig={currentStep < 2 ? undefined : playerConfig}
            onTogglePlayerType={currentStep < 2 ? undefined : togglePlayerType}
            showTerrainIcons={previewState.showIcons}
            hideUnits={previewState.hideUnits}
          />
          {/* Layout Switcher (Moved from Preview) */}
          {selectedPreset === "terrainiffic" && currentStep >= 3 && (
            <div className="flex items-center justify-between gap-4 px-4 py-2 bg-slate-200/50 dark:bg-slate-800/50 rounded-2xl backdrop-blur-sm mt-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  cycleSeed(-1);
                }}
                className="p-2 rounded-xl hover:bg-white dark:hover:bg-slate-700 transition-all text-slate-600 dark:text-slate-400 hover:text-amber-500"
              >
                <ChevronLeft size={20} />
              </button>

              <div className="flex flex-col items-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Active Layout
                </span>
                <span className="text-sm font-black text-slate-700 dark:text-slate-200 uppercase tracking-widest">
                  {currentSeed?.name || "Unknown"}
                </span>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  cycleSeed(1);
                }}
                className="p-2 rounded-xl hover:bg-white dark:hover:bg-slate-700 transition-all text-slate-600 dark:text-slate-400 hover:text-amber-500"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Step 0: Main Menu (Landing) */}
      {currentStep === 0 && !showLearnMenu && (
        <div className="w-full max-w-7xl animate-in slide-in-from-bottom-8 fade-in duration-700 pb-20 flex flex-col items-center">
          <div className="flex items-center justify-center gap-4 mb-8 w-full max-w-md">
            <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1" />
            <h2 className="text-sm font-bold text-center text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap">
              Main Menu
            </h2>
            <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-7xl">
            <MenuCard
              onClick={() => setShowLearnMenu(true)}
              onMouseEnter={() => {
                setHoveredMenu("how-to-play");
                setTerrainSeed(Math.random()); // Randomize on hover
              }}
              onMouseLeave={() => setHoveredMenu(null)}
              isSelected={false}
              darkMode={darkMode}
              title="How to Play"
              description="Learn the Basics"
              Icon={BookOpen}
              color="slate"
              className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/50 dark:hover:bg-slate-800 h-full"
            />
            <MenuCard
              onClick={() => {
                setSelectedPreset("quick"); // Default for quick start
                setCurrentStep(2);
              }}
              onMouseEnter={() => setHoveredMenu("couch")}
              onMouseLeave={() => setHoveredMenu(null)}
              isSelected={false}
              darkMode={darkMode}
              title="Couch Mode"
              description="Local Lobby"
              Icon={Sofa}
              color="red"
              className="border-2 border-red-500/20 hover:border-red-500/50 h-full"
            />
            <HeaderLobby
              multiplayer={multiplayer}
              onClick={() => setCurrentStep(1)}
              onMouseEnter={() => setHoveredMenu("worldwide")}
              onMouseLeave={() => setHoveredMenu(null)}
            />
          </div>
        </div>
      )}

      {/* Step 0.5: Learn Menu */}
      {currentStep === 0 && showLearnMenu && (
        <div className="w-full max-w-7xl animate-in slide-in-from-bottom-8 fade-in duration-700 pb-20 flex flex-col items-center">
          <div className="relative flex items-center justify-center gap-4 mb-8 w-full max-w-md">
            <button
              onClick={() => setShowLearnMenu(false)}
              className="absolute left-0 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors rounded-full hover:bg-slate-200 dark:hover:bg-slate-800"
              title="Back to Menu"
            >
              <ChevronLeft size={24} />
            </button>
            <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1 ml-12" />
            <h2 className="text-sm font-bold text-center text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap">
              How to Play
            </h2>
            <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1 ml-12" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
            <MenuCard
              onClick={onHowToPlay}
              isSelected={false}
              darkMode={darkMode}
              title="Field Manual"
              description="Read the Rules"
              Icon={BookOpen}
              color="slate"
              className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/50 dark:hover:bg-slate-800 h-full"
            />
            <MenuCard
              onClick={onTutorial}
              isSelected={false}
              darkMode={darkMode}
              title="Learn Interactively"
              description="Learn by Doing"
              Icon={MapIcon}
              color="emerald"
              className="bg-emerald-100/50 hover:bg-emerald-200/50 dark:bg-emerald-900/20 dark:hover:bg-emerald-900/40 border-2 border-emerald-500/20 hover:border-emerald-500/50 h-full"
            />
            <MenuCard
              onClick={onCtfGuide}
              isSelected={false}
              darkMode={darkMode}
              title="Capture the Flag(s)"
              description="Review the Objectives"
              Icon={Flag}
              color="red"
              className="bg-red-100/50 hover:bg-red-200/50 dark:bg-red-900/20 dark:hover:bg-red-900/40 border-2 border-red-500/20 hover:border-red-500/50 h-full"
            />
          </div>
        </div>
      )}

      {/* Step 1: Mode Selection (Play Menu) */}
      {currentStep === 1 && !isJoining && (
        <div className="w-full max-w-7xl animate-in slide-in-from-bottom-8 fade-in duration-700 pb-20 flex flex-col items-center">
          <div className="relative flex items-center justify-center gap-4 mb-8 w-full max-w-md">
            <button
              onClick={() => setCurrentStep(0)}
              className="absolute left-0 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors rounded-full hover:bg-slate-200 dark:hover:bg-slate-800"
              title="Back to Main Menu"
            >
              <ChevronLeft size={24} />
            </button>
            <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1 ml-12" />
            <h2 className="text-sm font-bold text-center text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap">
              Worldwide Mode
            </h2>
            <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1 ml-12" />
          </div>

          <div className="grid gap-6 grid-cols-1 md:grid-cols-3 w-full max-w-7xl">
            <MenuCard
              onClick={() => setCurrentStep(2)}
              isSelected={false}
              darkMode={darkMode}
              title="Practice Mode"
              description="Local Play"
              Icon={Rocket}
              color="slate"
              className="border-2 border-slate-500/20 hover:border-slate-500/50"
            />
            <MenuCard
              onClick={() => {
                multiplayer?.onOpenHost();
                setCurrentStep(2);
              }}
              isSelected={false}
              darkMode={darkMode}
              title="Create Lobby Code"
              description="Host Game"
              Icon={Swords}
              color="red"
              className="border-2 border-red-500/20 hover:border-red-500/50"
            />
            <MenuCard
              onClick={() => setIsJoining(true)}
              isSelected={false}
              darkMode={darkMode}
              title="Enter Lobby Code"
              description="Join Game"
              Icon={Users}
              color="blue"
              className="border-2 border-blue-500/20 hover:border-blue-500/50"
            />
          </div>
        </div>
      )}

      {/* Step 1.5: Join Game Input */}
      {currentStep === 1 && isJoining && (
        <div className="w-full max-w-md animate-in slide-in-from-bottom-8 fade-in duration-700 pb-20 flex flex-col items-center">
          <button
            onClick={() => setIsJoining(false)}
            className="mb-8 flex items-center gap-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
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
      )}

      {/* Step 2 & 3: Split Layout (Preview + Options) */}
      {currentStep >= 2 && (
        <div className="flex flex-col lg:flex-row gap-12 w-full max-w-7xl animate-in slide-in-from-bottom-8 fade-in duration-700 pb-20 items-start justify-center">
          {/* Left Panel: Tactical Preview */}
          <div className="w-full lg:w-[400px] lg:shrink-0 lg:sticky lg:top-8 space-y-8">
            <div className="flex items-center justify-center gap-4">
              <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1" />
              <h2 className="text-sm font-black text-center text-amber-500 uppercase tracking-[0.2em] whitespace-nowrap">
                Step {currentStep - 1} of 2
              </h2>
              <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1" />
            </div>

            <div className="flex justify-center -mt-2">
              <div className="flex gap-2 w-32">
                <div
                  className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${currentStep >= 2 ? "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]" : "bg-slate-200 dark:bg-slate-800"}`}
                />
                <div
                  className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${currentStep >= 3 ? "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]" : "bg-slate-200 dark:bg-slate-800"}`}
                />
              </div>
            </div>

            <div className="grid grid-cols-5 gap-4">
              <button
                onClick={() => setCurrentStep((prev) => (prev - 1) as number)}
                disabled={currentStep === 2}
                className={`py-4 rounded-2xl font-bold transition-all flex items-center justify-center shadow-lg ${
                  currentStep === 2
                    ? "bg-slate-100 dark:bg-slate-800/50 text-slate-300 dark:text-slate-700 cursor-not-allowed"
                    : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-300 dark:hover:bg-slate-700 hover:scale-[1.02]"
                }`}
                title="Back"
              >
                <ChevronLeft size={24} />
              </button>

              <button
                onClick={onHowToPlay}
                className="py-4 rounded-2xl font-bold bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-300 dark:hover:bg-slate-700 hover:scale-[1.02] transition-all flex items-center justify-center shadow-lg"
                title="Field Manual"
              >
                <BookOpen size={24} />
              </button>

              <button
                onClick={onOpenLibrary}
                className="py-4 rounded-2xl font-bold bg-amber-100 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 hover:bg-amber-200 dark:hover:bg-amber-900/40 hover:scale-[1.02] transition-all flex items-center justify-center shadow-lg border-2 border-amber-500/20"
                title="Seed Library"
              >
                <Database size={24} />
              </button>

              <button
                onClick={() =>
                  onStartGame(selectedBoard || "2p-ns", "zen-garden")
                }
                className="py-4 rounded-2xl font-bold bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-emerald-900/40 hover:scale-[1.02] transition-all flex items-center justify-center shadow-lg border-2 border-emerald-500/20"
                title="Zen Garden (Editor)"
              >
                <Sparkles size={24} />
              </button>

              <button
                onClick={() => setCurrentStep(3)}
                disabled={currentStep === 3 || !selectedBoard}
                className={`py-4 rounded-2xl font-bold transition-all flex items-center justify-center shadow-lg ${
                  currentStep === 3
                    ? "bg-slate-100 dark:bg-slate-800/50 text-slate-300 dark:text-slate-700 cursor-not-allowed hidden"
                    : !selectedBoard
                      ? "bg-slate-100 dark:bg-slate-800/50 text-slate-300 dark:text-slate-700 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 text-white hover:scale-[1.02] shadow-blue-500/25"
                }`}
                title="Next Step"
              >
                <ChevronRight size={24} />
              </button>
            </div>

            {/* Removed BoardPreview and Switcher from here */}

            <div className="flex flex-col gap-4">
              <button
                onClick={handleStart}
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

          <div className="flex-1 w-full flex flex-col gap-8">
            <div className="flex flex-col mb-4">
              <div className="flex items-center justify-center gap-4">
                <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1" />
                <h2 className="text-sm font-bold text-center text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap">
                  {currentStep === 2
                    ? "Step 1: Choose The Board"
                    : "Step 2: Choose The Layout"}
                </h2>
                <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1" />
              </div>
            </div>

            <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
              {currentStep === 2 ? (
                <>
                  <MenuCard
                    onClick={() => handleBoardSelect("2p-ns")}
                    isSelected={selectedBoard === "2p-ns"}
                    darkMode={darkMode}
                    title="North vs South"
                    description="2 Player • Top vs Bottom"
                    Icon={DualToneNS}
                    color="red"
                    className={`custom-border-[conic-gradient(from_315deg,_#ef4444_0deg_90deg,_#ffffff_90deg_180deg,_#3b82f6_180deg_270deg,_#ffffff_270deg_360deg)]`}
                  />
                  <MenuCard
                    onClick={() => handleBoardSelect("2p-ew")}
                    isSelected={selectedBoard === "2p-ew"}
                    darkMode={darkMode}
                    title="East vs West"
                    description="2 Player • Left vs Right"
                    Icon={DualToneEW}
                    color="emerald"
                    className={`custom-border-[conic-gradient(from_315deg,_#ffffff_0deg_90deg,_#22c55e_90deg_180deg,_#ffffff_180deg_270deg,_#eab308_270deg_360deg)]`}
                  />
                  <MenuCard
                    onClick={() => handleBoardSelect("4p")}
                    isSelected={selectedBoard === "4p"}
                    darkMode={darkMode}
                    title="Ultimate Showdown"
                    description="4 Player • Quadrant Combat"
                    Icon={QuadTone}
                    color="emerald"
                    className={`custom-border-[conic-gradient(from_315deg,_#ef4444_0deg_90deg,_#eab308_90deg_180deg,_#3b82f6_180deg_270deg,_#22c55e_270deg_360deg)]`}
                  />
                  <MenuCard
                    onClick={() => handleBoardSelect("2v2")}
                    isSelected={selectedBoard === "2v2"}
                    darkMode={darkMode}
                    title="Capture the Flag(s)"
                    description="4 Player • 2 vs 2 Co-Op"
                    Icon={AllianceTone}
                    color="slate"
                    className={`custom-border-[conic-gradient(from_315deg,_#ef4444_0deg_90deg,_#eab308_90deg_180deg,_#3b82f6_180deg_270deg,_#22c55e_270deg_360deg)]`}
                  />
                </>
              ) : (
                <>
                  <MenuCard
                    onClick={() => {
                      handlePresetSelect("terrainiffic");
                      setChiModalOpen(true);
                    }}
                    isSelected={selectedPreset === "terrainiffic"}
                    darkMode={darkMode}
                    title="Trenchess Chi"
                    description="Tactical Layouts from our Zen Garden."
                    Icon={MapIcon}
                    color="emerald"
                    badge="Flow Mode"
                    hoverText="χ"
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
                  />
                </>
              )}
            </div>

            {/* Capture the Flag Rules (Shown in Step 1 if Alliance selected) */}
            {selectedBoard === "2v2" && currentStep === 2 && (
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
                          The{" "}
                          <span className="relative">
                            Flag(s)
                            <div className="absolute -bottom-2.5 left-0 right-0 h-1.5 bg-red-600 rounded-full hidden lg:block" />
                          </span>
                        </h4>
                      </div>

                      <div className="hidden lg:block h-16 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />

                      <ul className="space-y-3 text-sm text-slate-300 font-semibold list-disc pl-5 text-left bg-white/5 p-5 rounded-2xl border border-white/5 flex-1 shadow-inner">
                        <li>The flag(s) are the white and black squares.</li>
                        <li>
                          Reach the opposite center square with your King to
                          win.
                        </li>
                        <li>If checkmated, you are out of the game.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      <CopyrightFooter />
      <ChiLayoutModal
        isOpen={chiModalOpen}
        onClose={() => setChiModalOpen(false)}
        seeds={seeds}
        onSelect={(index) => setPreviewSeedIndex(index)}
        selectedIndex={previewSeedIndex}
        activeMode={selectedBoard}
      />
    </div>
  );
};

export default MenuScreen;
