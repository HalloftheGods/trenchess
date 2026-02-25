import React from "react";
import { useNavigate } from "react-router-dom";
import {
  ChessPawn,
  Flame,
  FlameKindling,
  Tornado,
  Waves,
  Wind,
} from "lucide-react";
import { useRouteContext } from "@context";
import { ROUTES } from "@constants/routes";

// Shared Route Components
import RoutePageLayout from "@/shared/components/templates/RoutePageLayout";
import RoutePageHeader from "@/shared/components/organisms/RoutePageHeader";
import RouteGrid from "@/shared/components/templates/RouteGrid";
import RouteCard from "@/shared/components/molecules/RouteCard";
import RoutePageFooter from "@/shared/components/organisms/RoutePageFooter";

export const LearnView: React.FC = () => {
  const navigate = useNavigate();
  const { setHoveredMenu, setTerrainSeed, darkMode } = useRouteContext();

  return (
    <RoutePageLayout>
      <RoutePageHeader
        label='"There&apos;s a Prophecy on the wind..."'
        onBackClick={() => navigate(ROUTES.HOME.url)}
      />
      <RouteGrid cols={3}>
        <RouteCard
          onClick={() => navigate(ROUTES.LEARN_TRENCH.url)}
          onMouseEnter={() => {
            setHoveredMenu("how-to-play");
            setTerrainSeed(Math.random());
          }}
          onMouseLeave={() => setHoveredMenu(null)}
          preview={{
            mode: null,
            protocol: "terrainiffic",
            showIcons: true,
            hideUnits: true,
          }}
          isSelected={false}
          darkMode={darkMode}
          title="Open The Trench"
          description='"One day the Trench opens..."'
          Icon={Wind}
          HoverIcon={Tornado}
          color="red"
          className="h-full w-full"
        />
        <RouteCard
          onClick={() => navigate(ROUTES.LEARN_CHESS.url)}
          onMouseEnter={() => setHoveredMenu("chess")}
          onMouseLeave={() => setHoveredMenu(null)}
          preview={{
            mode: "2p-ns",
            protocol: "classic",
            hideUnits: false,
          }}
          isSelected={false}
          darkMode={darkMode}
          title="Face the Chess"
          description='"...the Chessmen all race for claims..."'
          Icon={Waves}
          HoverIcon={ChessPawn}
          color="blue"
          className="h-full w-full"
        />

        {/* Do the math */}
        <RouteCard
          onClick={() => navigate(ROUTES.LEARN_MATH.url)}
          onMouseEnter={() => setHoveredMenu("chess")}
          onMouseLeave={() => setHoveredMenu(null)}
          preview={{
            mode: "2p-ns",
            protocol: "classic",
            hideUnits: false,
          }}
          isSelected={false}
          darkMode={darkMode}
          title="Be Mathematical"
          description='" ...and so, a rise in Precision Calculation."'
          Icon={Flame}
          HoverIcon={FlameKindling}
          color="emerald"
          className="h-full w-full"
        />
      </RouteGrid>
      <RoutePageFooter
        onForwardClick={() => navigate(ROUTES.LEARN_TRENCH.url)}
        forwardLabel="Open the Trench"
        forwardIcon={Wind}
      />
    </RoutePageLayout>
  );
};

export default LearnView;
