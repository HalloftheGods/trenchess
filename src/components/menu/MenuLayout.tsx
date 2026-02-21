import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, useSearchParams } from "react-router-dom";
import PageLayout from "../PageLayout";
import PageHeader from "../PageHeader";
import BoardPreview from "../BoardPreview";
import MenuBreadcrumbs from "./MenuBreadcrumbs";
import { DEFAULT_SEEDS } from "../../data/defaultSeeds";
import type { GameMode, TerrainType } from "../../types/game";
import type { PieceStyle } from "../../constants";
import {
  MenuContext,
  type MenuContextType,
  type PreviewConfig,
} from "./MenuContext";

interface MenuLayoutProps {
  darkMode: boolean;
  pieceStyle: PieceStyle;
  toggleTheme: () => void;
  togglePieceStyle: () => void;
  onTutorial: () => void;
  onLogoClick: () => void;
  onZenGarden: () => void;
  multiplayer: any;
  onStartGame: (
    mode: GameMode,
    preset: any,
    playerTypes?: any,
    seed?: string,
  ) => void;
  onCtwGuide: () => void;
  onChessGuide: () => void;
  onTrenchGuide: (terrain?: TerrainType) => void;
  onOpenLibrary: () => void;
}

const MenuLayout: React.FC<MenuLayoutProps> = ({
  darkMode,
  pieceStyle,
  toggleTheme,
  togglePieceStyle,
  onTutorial,
  onLogoClick,
  onZenGarden,
  multiplayer,
  onStartGame,
  onCtwGuide,
  onChessGuide,
  onTrenchGuide,
  onOpenLibrary,
}) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // State lifted from MenuScreen
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);
  const [hoveredTerrain, setHoveredTerrain] = useState<TerrainType | null>(
    null,
  );
  const [previewConfig, setPreviewConfig] = useState<PreviewConfig>({
    mode: null,
  });
  const [terrainSeed, setTerrainSeed] = useState<number>(0);
  const [selectedPreset, setSelectedPreset] = useState<
    "classic" | "quick" | "terrainiffic" | "custom" | "zen-garden" | null
  >(null);
  const [selectedBoard, setSelectedBoard] = useState<GameMode | null>(null);

  const [playMode, setPlayMode] = useState<
    "local" | "online" | "practice" | null
  >(null);
  const [playerCount, setPlayerCount] = useState<number | null>(null);

  const [playerConfig, setPlayerConfig] = useState<
    Record<string, "human" | "computer">
  >({
    player1: "human",
    player2: "human",
    player3: "human",
    player4: "computer",
  });

  /* Seed Loading & Management */
  const [seeds, setSeeds] = useState<any[]>([]);
  const [previewSeedIndex, setPreviewSeedIndex] = useState(0);

  // Load last config on mount
  useEffect(() => {
    const lastConfig = localStorage.getItem("trenchess_last_config");
    if (lastConfig) {
      try {
        const config = JSON.parse(lastConfig);
        if (config.selectedBoard) setSelectedBoard(config.selectedBoard);
        if (config.selectedPreset) setSelectedPreset(config.selectedPreset);
        if (config.playMode) setPlayMode(config.playMode);
        if (config.playerCount) setPlayerCount(config.playerCount);
      } catch (e) {
        console.error(e);
      }
    }

    const stored = localStorage.getItem("trenchess_seeds");
    let loadedSeeds: any[] = [];
    if (stored) {
      try {
        loadedSeeds = JSON.parse(stored);
      } catch (e) {
        console.error(e);
      }
    }
    setSeeds([...loadedSeeds.reverse(), ...DEFAULT_SEEDS]);
  }, []);

  // Sync playMode and playerCount with URL and multiplayer state
  useEffect(() => {
    const mode = searchParams.get("mode") as any;
    const players = searchParams.get("players");
    const path = window.location.pathname;

    // Handle Online Mode Detection
    if (multiplayer?.roomId || path.includes("/play/lobby")) {
      setPlayMode("online");
      if (multiplayer?.players) {
        setPlayerCount(multiplayer.players.length);
      }
      return;
    }

    // Handle URL parameters (Don't wipe if missing, unless at root play)
    if (mode) {
      if (mode === "practice") setPlayMode("practice");
      else if (mode === "couch") setPlayMode("local");
    } else if (path === "/play") {
      // Clear if we explicitly return to the start
      setPlayMode(null);
    } else if (path.includes("/play/local")) {
      setPlayMode("local");
    }

    if (players) {
      setPlayerCount(parseInt(players));
    } else if (path === "/play") {
      setPlayerCount(null);
    }
  }, [
    searchParams,
    multiplayer?.roomId,
    multiplayer?.players?.length,
    window.location.pathname,
  ]);

  // Save config when changed
  useEffect(() => {
    if (selectedBoard || selectedPreset || playMode || playerCount) {
      const config = {
        selectedBoard,
        selectedPreset,
        playMode,
        playerCount,
      };
      localStorage.setItem("trenchess_last_config", JSON.stringify(config));
    }
  }, [selectedBoard, selectedPreset, playMode, playerCount]);

  const currentSeed = seeds[previewSeedIndex];

  const togglePlayerType = (pid: string) => {
    setPlayerConfig((prev) => ({
      ...prev,
      [pid]: prev[pid] === "human" ? "computer" : "human",
    }));
  };

  const activeCustomSeed = previewConfig.useDefaultFormation
    ? undefined
    : previewConfig.protocol === "terrainiffic"
      ? seeds[Math.floor(Math.abs(terrainSeed) * seeds.length) % seeds.length]
          ?.seed
      : currentSeed?.seed;

  const isPreviewReady = false;

  const boardPreviewNode = (
    <BoardPreview
      selectedMode={previewConfig.mode}
      selectedProtocol={previewConfig.protocol as any}
      darkMode={darkMode}
      pieceStyle={pieceStyle}
      isReady={isPreviewReady}
      terrainSeed={terrainSeed}
      customSeed={activeCustomSeed}
      playerConfig={isPreviewReady ? playerConfig : undefined}
      onTogglePlayerType={isPreviewReady ? togglePlayerType : undefined}
      showTerrainIcons={previewConfig.showIcons}
      hideUnits={previewConfig.hideUnits}
      forcedTerrain={previewConfig.forcedTerrain}
      highlightOuterSquares={previewConfig.highlightOuterSquares}
      labelOverride={previewConfig.label}
    />
  );

  const contextValue: MenuContextType = {
    darkMode,
    pieceStyle,
    hoveredMenu,
    setHoveredMenu,
    hoveredTerrain,
    setHoveredTerrain,
    terrainSeed,
    setTerrainSeed,
    selectedPreset,
    setSelectedPreset,
    selectedBoard,
    setSelectedBoard,
    seeds,
    previewSeedIndex,
    setPreviewSeedIndex,
    previewConfig,
    setPreviewConfig,
    playerConfig,
    setPlayerConfig,
    togglePlayerType,
    multiplayer,
    onStartGame,
    onTutorial,
    onCtwGuide,
    onChessGuide,
    onTrenchGuide,
    onOpenLibrary,
    playMode,
    setPlayMode,
    playerCount,
    setPlayerCount,
  };

  const handleLogoClick = () => {
    navigate("/");
    onLogoClick();
    setHoveredMenu(null);
    setPlayMode(null);
    setPlayerCount(null);
    setSelectedBoard(null);
    setSelectedPreset(null);
  };

  return (
    <MenuContext.Provider value={contextValue}>
      <PageLayout
        darkMode={darkMode}
        header={
          <PageHeader
            darkMode={darkMode}
            pieceStyle={pieceStyle}
            toggleTheme={toggleTheme}
            togglePieceStyle={togglePieceStyle}
            onTutorial={onTutorial}
            onZenGarden={onZenGarden}
            onLogoClick={handleLogoClick}
            boardPreview={boardPreviewNode}
            breadcrumbs={<MenuBreadcrumbs />}
            showTerrain={true}
          />
        }
      >
        <Outlet />
      </PageLayout>
    </MenuContext.Provider>
  );
};

export default MenuLayout;
