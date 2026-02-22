import React, { lazy } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { CornerControls } from "@/app/routes/game/components/organisms/CornerControls";
import { IconButton } from "@/shared/components/atoms/IconButton";
import { FileText, Trophy, AudioWaveform } from "lucide-react";
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
    </>
  );
};

export default RouteLayout;
export const LazyRouteLayout = lazy(() => import("./RouteLayout"));
