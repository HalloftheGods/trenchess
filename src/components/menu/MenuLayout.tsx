import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import PageLayout from "../PageLayout";
import PageHeader from "../PageHeader";
import BoardPreview from "../BoardPreview";
import { DEFAULT_SEEDS } from "../../data/defaultSeeds";
import type { GameMode, TerrainType } from "../../types";
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
  const [selectedBoard, setSelectedBoard] = useState<GameMode | null>(null); // Might track this for setup

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
    setSeeds([...loadedSeeds.reverse(), ...DEFAULT_SEEDS]);
  }, []);

  const currentSeed = seeds[previewSeedIndex];

  /* cycleSeed was here but unused */

  const togglePlayerType = (pid: string) => {
    setPlayerConfig((prev) => ({
      ...prev,
      [pid]: prev[pid] === "human" ? "computer" : "human",
    }));
  };

  // Logic to determine what to show on the preview
  // Based on MenuScreen.tsx getPreviewState
  const activeCustomSeed =
    previewConfig.protocol === "terrainiffic"
      ? seeds[Math.floor(Math.abs(terrainSeed) * seeds.length) % seeds.length]
          ?.seed
      : currentSeed?.seed;

  // We are "Ready" (showing the interactive board) if the user is in a "Setup" phase.
  // In the original, this was currentStep >= 2.
  // In Router land, maybe if route is /setup?
  const isPreviewReady = false; // For now in the menu nav, we are mostly previewing.

  const boardPreviewNode = (
    <>
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
      />
      {/* Layout Switcher (Only if in Terrainiffic setup, which we might handle later) */}
    </>
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
  };

  // Handle Logo Click to reset
  const handleLogoClick = () => {
    navigate("/");
    onLogoClick();
    setHoveredMenu(null);
  };

  return (
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
          showTerrain={true}
        />
      }
    >
      <MenuContext.Provider value={contextValue}>
        <Outlet />
      </MenuContext.Provider>
    </PageLayout>
  );
};

export default MenuLayout;
