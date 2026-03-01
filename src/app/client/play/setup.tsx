import { getPath } from "@/app/router/router";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Eye,
  Pizza,
  Shell,
  Dices,
  Globe,
  Omega,
  Pi,
  LandPlot,
  ShieldQuestion,
} from "lucide-react";
import { useRouteContext } from "@context";
import {
  DualToneNS,
  DualToneEW,
  QuadTone,
  AllianceTone,
  DualToneSwords,
  DualToneSwordsEw,
} from "@/shared/components/atoms/RouteIcons";
import type { GameMode } from "@tc.types/game";

import { buildRoute } from "@/shared/utilities/routes";

// Shared Route Components
import RoutePageLayout from "@/shared/components/templates/RoutePageLayout";
import RoutePageHeader from "@/shared/components/organisms/RoutePageHeader";
import RouteGrid from "@/shared/components/templates/RouteGrid";
import RouteCard from "@/shared/components/molecules/RouteCard";

export const PlaySetupView: React.FC = () => {
  const navigate = useNavigate();
  const {
    playMode,
    players: playersParam,
    step: stepParam,
  } = useParams<{ playMode: string; players: string; step?: string }>();

  const {
    darkMode,
    onStartGame,
    onZenGarden,
    selectedPreset,
    setSelectedPreset,
    selectedBoard,
    setSelectedBoard,
    playerConfig,
    setPlayerTypes,
    previewConfig,
    playerCount,
    multiplayer,
  } = useRouteContext();

  const step = stepParam === "2" ? 2 : 1;

  // Initialize from URL parameters if needed
  React.useEffect(() => {
    if (playersParam && setPlayerTypes) {
      const count = parseInt(playersParam, 10);
      const defaultTypes = {
        red: "computer",
        yellow: "computer",
        green: "computer",
        blue: "computer",
      } as Record<string, "human" | "computer">;

      // Determine which slots are human based on the count and the likely board
      // If we don't have a board yet, we'll assume standard 2p (red/blue) or 4p
      const pids =
        count <= 2 ? ["red", "blue"] : ["red", "yellow", "green", "blue"];
      pids.forEach((pid, i) => {
        if (i < count) defaultTypes[pid] = "human";
      });

      // Avoid infinite loop by checking if different
      let isDifferent = false;
      for (const pid of ["red", "yellow", "green", "blue"]) {
        if (playerConfig[pid] !== defaultTypes[pid]) {
          isDifferent = true;
          break;
        }
      }

      if (isDifferent) {
        setPlayerTypes(defaultTypes);
      }
    }

    if (!selectedBoard) {
      if (playersParam) {
        const count = parseInt(playersParam, 10);
        if (count <= 2) {
          setSelectedBoard("2p-ns");
        } else {
          setSelectedBoard("4p");
        }
      }
    }
  }, [
    playersParam,
    playMode,
    selectedBoard,
    setSelectedBoard,
    setPlayerTypes,
    playerConfig,
  ]);

  const handleBoardSelect = (mode: GameMode) => {
    setSelectedBoard(mode);
    navigate(
      buildRoute(getPath("play.setup"), {
        playMode: playMode || "couch",
        players: playersParam || "2",
        step: "2",
      }),
    );
  };

  const handlePresetSelect = (
    preset: "classic" | "quick" | "terrainiffic" | "custom" | "zen-garden",
    seed?: string,
  ) => {
    setSelectedPreset(preset);

    if (preset === "zen-garden") {
      onZenGarden?.();
      return;
    }

    if (selectedBoard) {
      // Auto-detect player configuration from URL
      let finalPlayerConfig = { ...playerConfig };

      if (playersParam) {
        const count = parseInt(playersParam, 10);
        // Find which players are active for this board
        const activePids =
          selectedBoard === "2p-ns"
            ? ["red", "blue"]
            : selectedBoard === "2p-ew"
              ? ["green", "yellow"]
              : ["red", "yellow", "green", "blue"];

        // Default all to computer first
        finalPlayerConfig = {
          red: "computer",
          yellow: "computer",
          green: "computer",
          blue: "computer",
        };

        // Set the first 'count' active players to human, others to computer
        activePids.forEach((pid, index) => {
          if (index < count) {
            finalPlayerConfig[pid] = "human";
          } else {
            finalPlayerConfig[pid] = "computer";
          }
        });
      }

      onStartGame(selectedBoard, preset, finalPlayerConfig, seed);
    }
  };

  const urlPlayerCount =
    multiplayer?.roomId && multiplayer?.players.length > 0
      ? multiplayer.players.length
      : playersParam
        ? parseInt(playersParam, 10)
        : (playerCount ?? 2);
  const isFourPlayerRequested = urlPlayerCount >= 3;

  const isOnline = !!multiplayer?.roomId;
  const isHost = multiplayer?.isHost || !isOnline;

  const headerLabel =
    isOnline && !isHost
      ? '"Observing the Host\'s Will"'
      : step === 1
        ? `A dancefloor for ${urlPlayerCount} is chosen`
        : "And we set the Stage";

  const backLabel =
    step === 2 ? "Choose Board" : isOnline ? "Lobby" : "Local Gathering";

  return (
    <RoutePageLayout>
      <RoutePageHeader
        label={headerLabel}
        color={isOnline && !isHost ? "blue" : "amber"}
        backLabel={backLabel}
        onBackClick={() => {
          if (isOnline && !isHost) return;
          if (step === 2) {
            navigate(
              buildRoute(getPath("play.setup"), {
                playMode: playMode || "couch",
                players: playersParam || "2",
                step: "1",
              }),
            );
          } else {
            navigate(isOnline ? getPath("play.lobby") : getPath("play.local"));
          }
        }}
        className={isOnline && !isHost ? "opacity-30 pointer-events-none" : ""}
      />

      <RouteGrid cols={step === 2 ? 4 : 2}>
        {step === 1 ? (
          <>
            {!isFourPlayerRequested ? (
              <>
                <RouteCard
                  onClick={() => isHost && handleBoardSelect("2p-ns")}
                  isSelected={selectedBoard === "2p-ns"}
                  preview={{
                    mode: "2p-ns",
                    hideUnits: true,
                  }}
                  darkMode={darkMode}
                  title="North vs South"
                  titleNode={
                    <>
                      <span className="text-brand-red">North</span> vs{" "}
                      <span className="text-brand-blue">South</span>
                    </>
                  }
                  description='"Roses are Red, Violets are Blue..."'
                  Icon={DualToneNS}
                  HoverIcon={DualToneSwords}
                  color="red"
                  className={`custom-border-[conic-gradient(from_315deg,_#ef4444_0deg_90deg,_#ffffff_90deg_180deg,_#3b82f6_180deg_270deg,_#ffffff_270deg_360deg)] w-full`}
                />
                <RouteCard
                  onClick={() => isHost && handleBoardSelect("2p-ew")}
                  isSelected={selectedBoard === "2p-ew"}
                  preview={{
                    mode: "2p-ew",
                    hideUnits: true,
                  }}
                  darkMode={darkMode}
                  title="West vs East"
                  titleNode={
                    <>
                      <span className="text-green-500">West</span> vs{" "}
                      <span className="text-yellow-500">East</span>
                    </>
                  }
                  description='"Zinnias come in Green, and Tulips dress Yellow too..."'
                  Icon={DualToneEW}
                  HoverIcon={DualToneSwordsEw}
                  color="emerald"
                  className={`custom-border-[conic-gradient(from_315deg,_#ffffff_0deg_90deg,_#22c55e_90deg_180deg,_#ffffff_180deg_270deg,_#eab308_270deg_360deg)] w-full`}
                />
              </>
            ) : (
              <>
                <RouteCard
                  onClick={() => isHost && handleBoardSelect("4p")}
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
                <RouteCard
                  onClick={() => isHost && handleBoardSelect("2v2")}
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
            <RouteCard
              onClick={() => isHost && handlePresetSelect("custom")}
              isSelected={selectedPreset === "custom"}
              preview={{
                mode: selectedBoard,
                protocol: "custom",
                hideUnits: true,
              }}
              darkMode={darkMode}
              title="Ω Omega"
              description='"Set the stage, Gamemaster."'
              Icon={Eye}
              color="red"
              badge="Gamemaster Mode"
              HoverIcon={Omega}
              className="w-full"
            />
            <RouteCard
              onClick={() => {
                if (isHost) handlePresetSelect("terrainiffic");
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
              description='"The Trench part, done for you."'
              Icon={Shell}
              color="emerald"
              badge="Instant Play"
              HoverIcon={LandPlot}
              className="w-full"
            />
            <RouteCard
              onClick={() => isHost && handlePresetSelect("classic")}
              isSelected={selectedPreset === "classic"}
              preview={{
                mode: selectedBoard,
                protocol: "classic",
                hideUnits: false,
                useDefaultFormation: true,
              }}
              darkMode={darkMode}
              title="π Pi"
              description='"Classic with random toppings."'
              Icon={Pizza}
              color="amber"
              badge="Instant Play"
              HoverIcon={Pi}
              className="w-full"
            />
            <RouteCard
              onClick={() => isHost && handlePresetSelect("quick")}
              isSelected={selectedPreset === "quick"}
              preview={{
                mode: selectedBoard,
                protocol: "quick",
                hideUnits: true,
              }}
              darkMode={darkMode}
              badge="Chaos Mode"
              title="α Alpha"
              description='"Entropy unleashed."'
              color="blue"
              className="w-full"
              HoverIcon={Dices}
              Icon={ShieldQuestion}
            />
          </>
        )}
      </RouteGrid>

      {/* Disclaimer for 2v2 */}
      {previewConfig.mode === "2v2" && (
        <div className="w-full animate-in fade-in slide-in-from-top-4 duration-500 mt-8">
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
    </RoutePageLayout>
  );
};

export default PlaySetupView;
