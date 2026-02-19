import React, { useState, useEffect, useContext, createContext } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import PageLayout from "../PageLayout";
import PageHeader from "../PageHeader";
import BoardPreview from "../BoardPreview";
import { DEFAULT_SEEDS } from "../../data/defaultSeeds";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { GameMode, TerrainType } from "../../types";
import type { PieceStyle } from "../../constants";

// Define the Context Type
interface MenuContextType {
  darkMode: boolean;
  pieceStyle: PieceStyle;
  hoveredMenu: string | null;
  setHoveredMenu: (menu: string | null) => void;
  hoveredTerrain: TerrainType | null;
  setHoveredTerrain: (terrain: TerrainType | null) => void;
  terrainSeed: number;
  setTerrainSeed: (seed: number) => void;
  selectedPreset: string | null;
  setSelectedPreset: (preset: any) => void;
  selectedBoard: GameMode | null;
  setSelectedBoard: (mode: GameMode | null) => void;
  seeds: any[];
  previewSeedIndex: number;
  setPreviewSeedIndex: React.Dispatch<React.SetStateAction<number>>;
  playerConfig: Record<string, "human" | "computer">;
  setPlayerConfig: React.Dispatch<
    React.SetStateAction<Record<string, "human" | "computer">>
  >;
  togglePlayerType: (pid: string) => void;
  setCtkBoardMode: (mode: GameMode) => void;
  multiplayer: any;
  onStartGame: (
    mode: GameMode,
    preset: any,
    playerTypes?: any,
    seed?: string,
  ) => void;
  onTutorial: () => void;
  onCtfGuide: () => void;
  onChessGuide: () => void;
  onTrenchGuide: (terrain?: TerrainType) => void;
  onOpenLibrary: () => void;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export const useMenuContext = () => {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error("useMenuContext must be used within a MenuLayout");
  }
  return context;
};

interface MenuLayoutProps {
  darkMode: boolean;
  pieceStyle: PieceStyle;
  toggleTheme: () => void;
  togglePieceStyle: () => void;
  onTutorial: () => void;
  onLogoClick: () => void;
  multiplayer: any;
  onStartGame: (
    mode: GameMode,
    preset: any,
    playerTypes?: any,
    seed?: string,
  ) => void;
  onCtfGuide: () => void;
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
  multiplayer,
  onStartGame,
  onCtfGuide,
  onChessGuide,
  onTrenchGuide,
  onOpenLibrary,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  // State lifted from MenuScreen
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);
  const [hoveredTerrain, setHoveredTerrain] = useState<TerrainType | null>(
    null,
  );
  const [terrainSeed, setTerrainSeed] = useState<number>(0);
  const [selectedPreset, setSelectedPreset] = useState<
    "classic" | "quick" | "terrainiffic" | "custom" | "zen-garden" | null
  >(null);
  const [selectedBoard, setSelectedBoard] = useState<GameMode | null>(null); // Might track this for setup
  const [ctkBoardMode, setCtkBoardMode] = useState<GameMode>("2p-ns");

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
  const getPreviewState = () => {
    // 1. Hover trench terrain items
    if (hoveredMenu === "how-to-play" && hoveredTerrain) {
      return {
        mode: null as GameMode | null,
        protocol: "terrainiffic",
        showIcons: true,
        hideUnits: true,
        forcedTerrain: hoveredTerrain,
      };
    }
    // 1b. Hover how-to-play (general) - Random
    if (hoveredMenu === "how-to-play") {
      return {
        mode: null as GameMode | null,
        protocol: "terrainiffic",
        showIcons: true,
        hideUnits: true,
        forcedTerrain: null,
      };
    }
    // 2. Hover "The Chess"
    if (hoveredMenu === "chess") {
      return {
        mode: "2p-ns" as GameMode,
        protocol: "classic",
        showIcons: false,
        hideUnits: false, // Show units
        forcedTerrain: null,
      };
    }
    // 3. Hover "Capture the King"
    if (hoveredMenu === "ctk") {
      return {
        mode: ctkBoardMode,
        protocol: null,
        showIcons: false,
        hideUnits: true,
        forcedTerrain: null,
      };
    }
    // 4. Hover "Capture the Board"
    if (hoveredMenu === "ctboard") {
      return {
        mode: "4p" as GameMode,
        protocol: null,
        showIcons: false,
        hideUnits: true,
        forcedTerrain: null,
      };
    }
    // 5. Hover "Capture the World" / "Worldwide"
    if (hoveredMenu === "ctf" || hoveredMenu === "worldwide") {
      return {
        mode: "2v2" as GameMode,
        protocol: null,
        showIcons: false,
        hideUnits: true,
        forcedTerrain: null,
      };
    }
    // 6. Hover Play Menu -> 2p-ns Board
    if (
      hoveredMenu === "play-menu" ||
      hoveredMenu === "practice" ||
      hoveredMenu === "couch"
    ) {
      return {
        mode: "2p-ns" as GameMode,
        protocol: null,
        showIcons: false,
        hideUnits: true,
        forcedTerrain: null,
      };
    }

    // 7. Route based defaults (if we are in setup)
    // If we are at /play/setup (which we haven't fully defined yet, but assuming)
    // For now, default to empty/logo state if nothing hovered.
    return {
      mode: null as GameMode | null,
      protocol: null,
      showIcons: false,
      hideUnits: true,
      forcedTerrain: null,
    };
  };

  const previewState = getPreviewState();
  const activeCustomSeed =
    hoveredMenu === "how-to-play" && seeds.length > 0
      ? seeds[Math.floor(Math.abs(terrainSeed) * seeds.length) % seeds.length]
          ?.seed
      : !hoveredMenu && selectedPreset === "terrainiffic"
        ? currentSeed?.seed
        : undefined;

  // We are "Ready" (showing the interactive board) if the user is in a "Setup" phase.
  // In the original, this was currentStep >= 2.
  // In Router land, maybe if route is /setup?
  const isPreviewReady = false; // For now in the menu nav, we are mostly previewing.

  const boardPreviewNode = (
    <>
      <BoardPreview
        selectedMode={previewState.mode}
        selectedProtocol={previewState.protocol as any}
        darkMode={darkMode}
        pieceStyle={pieceStyle}
        isReady={isPreviewReady}
        terrainSeed={terrainSeed}
        customSeed={activeCustomSeed}
        playerConfig={isPreviewReady ? playerConfig : undefined}
        onTogglePlayerType={isPreviewReady ? togglePlayerType : undefined}
        showTerrainIcons={previewState.showIcons}
        hideUnits={previewState.hideUnits}
        forcedTerrain={previewState.forcedTerrain}
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
    playerConfig,
    setPlayerConfig,
    togglePlayerType,
    setCtkBoardMode,
    multiplayer,
    onStartGame,
    onTutorial,
    onCtfGuide,
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
          onLogoClick={handleLogoClick}
          boardPreview={boardPreviewNode}
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
