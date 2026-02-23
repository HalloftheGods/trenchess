import React, { lazy } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { CornerControls } from "@/client/game/components/organisms/CornerControls";
import { IconButton } from "@/shared/components/atoms/IconButton";
import { FileText, Trophy, AudioWaveform } from "lucide-react";
import ThemeControls from "@/shared/components/molecules/ThemeControls";
import BackButton from "@/shared/components/molecules/BackButton";
import type { GameMode, MultiplayerState } from "@/shared/types";

interface MenuLayoutProps {
  darkMode: boolean;
  pieceStyle: "bold" | "emoji" | "outlined" | "custom" | "lucide";
  toggleTheme: () => void;
  togglePieceStyle: () => void;
  onTutorial: () => void;
  onLogoClick: () => void;
  onZenGarden: () => void;
  multiplayer: MultiplayerState;
  onStartGame: (
    mode: GameMode,
    preset: string | null,
    playerTypes: Record<string, "human" | "computer">,
    seed?: string,
  ) => void;
  selectedBoard: GameMode | null;
  setSelectedBoard: (m: GameMode | null) => void;
  selectedPreset:
    | "classic"
    | "quick"
    | "terrainiffic"
    | "custom"
    | "zen-garden"
    | null;
  setSelectedPreset: (
    p: "classic" | "quick" | "terrainiffic" | "custom" | "zen-garden" | null,
  ) => void;
  onCtwGuide: () => void;
  onChessGuide: () => void;
  onTrenchGuide: (t?: string) => void;
  onOpenLibrary: () => void;
  playerTypes: Record<string, "human" | "computer">;
  activePlayers: string[];
}

const RouteLayout: React.FC<MenuLayoutProps> = (props) => {
  const location = useLocation();
  const navigate = useNavigate();

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
    <>
      <CornerControls
        topLeft={
          <div className="flex items-center gap-4">
            {!isRoot && <BackButton onClick={handleBack} />}
            <IconButton
              icon={<AudioWaveform size={20} />}
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
            pieceStyle={props.pieceStyle}
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
    </>
  );
};

export default RouteLayout;
export const LazyRouteLayout = lazy(() => import("./RouteLayout"));
