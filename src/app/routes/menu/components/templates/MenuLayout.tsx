import React, { lazy, useMemo, useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { MenuProvider } from "@/app/context/MenuContext";
import { CornerControls } from "@/app/routes/game/components/organisms/CornerControls";
import { IconButton } from "@/shared/components/atoms/IconButton";
import { FileText, Trophy, Calculator } from "lucide-react";
import ThemeControls from "@/shared/components/molecules/ThemeControls";
import BackButton from "@/shared/components/molecules/BackButton";

interface MenuLayoutProps {
  darkMode: boolean;
  pieceStyle: string;
  toggleTheme: () => void;
  togglePieceStyle: () => void;
  onTutorial: () => void;
  onLogoClick: () => void;
  onZenGarden: () => void;
  multiplayer: any;
  onStartGame: (mode: any, preset: any, playerTypes: any, seed?: any) => void;
  selectedBoard: any;
  setSelectedBoard: (m: any) => void;
  selectedPreset: any;
  setSelectedPreset: (p: any) => void;
  onCtwGuide: () => void;
  onChessGuide: () => void;
  onTrenchGuide: (t?: string) => void;
  onOpenLibrary: () => void;
  playerTypes: any;
  activePlayers: any[];
}

import { DEFAULT_SEEDS } from "@engineConfigs/defaultSeeds";

const MenuLayout: React.FC<MenuLayoutProps> = (props) => {
  const location = useLocation();
  const navigate = useNavigate();

  // State lifted from old MenuLayout for seed management
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
    setSeeds([...loadedSeeds.reverse(), ...DEFAULT_SEEDS]);
  }, []);

  const contextValue = useMemo(() => {
    const isOnline = !!props.multiplayer?.roomId;
    const playMode = isOnline
      ? "online"
      : location.pathname.includes("/play/local")
        ? "local"
        : "practice";

    return {
      ...props,
      playerConfig: props.playerTypes,
      playMode,
      playerCount: props.activePlayers.length,
      previewConfig: { mode: props.selectedBoard },
      seeds,
      previewSeedIndex,
      setPreviewSeedIndex,
    };
  }, [props, location.pathname, seeds, previewSeedIndex]);

  const pathnames = location.pathname.split("/").filter(Boolean);
  const isRoot = pathnames.length === 0;
  const isScoreboard = location.pathname.includes("scoreboard");
  const isRules = location.pathname.includes("rules");

  const handleBack = () => {
    if (pathnames.length === 0) return;
    const parentPath = "/" + pathnames.slice(0, -1).join("/");
    navigate(parentPath);
  };

  return (
    <MenuProvider value={contextValue}>
      <CornerControls
        topLeft={
          <div className="flex items-center gap-4">
            {!isRoot && <BackButton onClick={handleBack} />}
            <IconButton
              icon={<Calculator size={20} />}
              label="Interactive Guide"
              onClick={props.onTutorial}
            />
            {!isRules && (
              <IconButton
                icon={<FileText size={20} />}
                label="Rules"
                onClick={() => navigate("/rules")}
              />
            )}
          </div>
        }
        topRight={
          <ThemeControls
            darkMode={props.darkMode}
            pieceStyle={props.pieceStyle as any}
            toggleTheme={props.toggleTheme}
            togglePieceStyle={props.togglePieceStyle}
          />
        }
        bottomRight={
          !isScoreboard && (
            <IconButton
              icon={<Trophy size={20} className="text-amber-500" />}
              label="Scoreboard"
              onClick={() => navigate("/scoreboard")}
            />
          )
        }
      />

      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
    </MenuProvider>
  );
};

export default MenuLayout;
export const LazyMenuLayout = lazy(() => import("./MenuLayout"));
