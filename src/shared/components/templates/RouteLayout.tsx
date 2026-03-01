import React, { memo } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { CornerControls } from "@/app/client/console/components";
import { IconButton } from "@/shared/components/atoms/IconButton";
import { FileText, Trophy, AudioWaveform } from "lucide-react";
import ThemeControls from "@/shared/components/molecules/ThemeControls";
import { useRouteContext } from "@/shared/context/RouteContext";

const RouteLayout: React.FC = memo(() => {
  const { darkMode, pieceStyle, toggleTheme, togglePieceStyle, onTutorial } =
    useRouteContext();
  const location = useLocation();
  const navigate = useNavigate();

  const isScoreboard = location.pathname.includes("scoreboard");
  const isRules = location.pathname.includes("rules");

  return (
    <>
      <CornerControls
        topLeft={
          <div className="flex items-center gap-4">
            {!isRules && (
              <IconButton
                icon={<AudioWaveform size={20} />}
                label="Interactive Guide"
                onClick={onTutorial || (() => {})}
                tooltipPosition="bottom"
              />
            )}
            {!isRules && (
              <IconButton
                icon={<FileText size={20} />}
                label="Rules"
                onClick={() => navigate("/rules")}
                tooltipPosition="bottom"
              />
            )}
          </div>
        }
        topRight={
          !isRules && (
            <ThemeControls
              darkMode={darkMode}
              pieceStyle={pieceStyle}
              toggleTheme={toggleTheme || (() => {})}
              togglePieceStyle={togglePieceStyle || (() => {})}
              tooltipPosition="bottom"
            />
          )
        }
        bottomRight={
          !isScoreboard &&
          !isRules && (
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
});

export default RouteLayout;
