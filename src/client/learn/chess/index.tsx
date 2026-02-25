import React from "react";
import { useNavigate } from "react-router-dom";
import {
  ChessPawn,
  Trophy,
  Calculator,
  BicepsFlexed,
  Tornado,
  ChessKing,
} from "lucide-react";

import { useRouteContext } from "@context";

// Shared Route Components
import RoutePageLayout from "@/shared/components/templates/RoutePageLayout";
import RoutePageHeader from "@/shared/components/organisms/RoutePageHeader";
import RoutePageFooter from "@/shared/components/organisms/RoutePageFooter";
import RouteGrid from "@/shared/components/templates/RouteGrid";
import RouteCard from "@/shared/components/molecules/RouteCard";

export const LearnChessSelectionView: React.FC = () => {
  const navigate = useNavigate();
  const { setHoveredMenu, darkMode } = useRouteContext();

  return (
    <RoutePageLayout>
      <RoutePageHeader
        label='"The world cracks into 3, and with it, the Endgame."'
        color="red"
        onBackClick={() => navigate("/learn")}
      />

      <RouteGrid cols={2}>
        <RouteCard
          onClick={() => navigate("/learn/chess/chessmen")}
          onMouseEnter={() => setHoveredMenu("chess")}
          onMouseLeave={() => setHoveredMenu(null)}
          preview={{
            mode: "2p-ns",
            hideUnits: true,
          }}
          isSelected={false}
          darkMode={darkMode}
          title="The Chessmen"
          description='"From the trench, the Chessmen grow stronger"'
          Icon={ChessPawn}
          HoverIcon={BicepsFlexed}
          color="blue"
          className="h-full w-full py-12"
        />
        <RouteCard
          onClick={() => navigate("/learn/endgame")}
          onMouseEnter={() => setHoveredMenu("boardgame")}
          onMouseLeave={() => setHoveredMenu(null)}
          preview={{
            mode: "4p",
            hideUnits: true,
          }}
          isSelected={false}
          darkMode={darkMode}
          title="The Endgame"
          description='"The world cracks into 3, and with it, the Endgame."'
          Icon={ChessKing}
          HoverIcon={Trophy}
          color="red"
          className="h-full w-full py-12"
        />
      </RouteGrid>

      <RoutePageFooter
        onForwardClick={() => navigate("/learn/math")}
        forwardLabel="Be Mathematical"
        forwardIcon={Calculator}
        backIcon={Tornado}
        backLabel="Open the Trench"
        onBackClick={() => navigate("/learn/trench")}
      />
    </RoutePageLayout>
  );
};

export default LearnChessSelectionView;
