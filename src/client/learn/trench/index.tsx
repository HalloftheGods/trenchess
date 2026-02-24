import React from "react";
import { useNavigate } from "react-router-dom";
import { Trees, Waves, Mountain } from "lucide-react";
import { DesertIcon } from "@/client/game/shared/components/atoms/UnitIcons";
import { useRouteContext } from "@/route.context";
import type { TerrainType } from "@/shared/types/game";

// Shared Route Components
import RoutePageLayout from "@/shared/components/templates/RoutePageLayout";
import RoutePageHeader from "@/shared/components/organisms/RoutePageHeader";
import RoutePageFooter from "@/shared/components/organisms/RoutePageFooter";
import RouteGrid from "@/shared/components/templates/RouteGrid";
import RouteCard from "@/shared/components/molecules/RouteCard";

export const LearnTrenchMainView: React.FC = () => {
  const navigate = useNavigate();
  const { setHoveredMenu, setHoveredTerrain, setTerrainSeed, darkMode } =
    useRouteContext();

  const handleTrenchClick = (t: TerrainType) => {
    navigate(`/learn/trench/${t}`);
  };

  return (
    <RoutePageLayout>
      <RoutePageHeader
        label='"From Nowhere - Rains terror to terrains with never-ending tethers"'
        color="red"
        onBackClick={() => navigate("/learn")}
      />

      <RouteGrid cols={4}>
        <RouteCard
          onClick={() => handleTrenchClick("mountains")}
          onMouseEnter={() => {
            setHoveredMenu("how-to-play");
            setHoveredTerrain("mountains");
            setTerrainSeed(Math.random());
          }}
          onMouseLeave={() => {
            setHoveredMenu(null);
            setHoveredTerrain(null);
          }}
          preview={{
            mode: null,
            forcedTerrain: "mountains",
            showIcons: true,
            hideUnits: true,
          }}
          isSelected={false}
          darkMode={darkMode}
          title="Mountains"
          description='"Knights shall ride Mountains"'
          Icon={Mountain}
          color="red"
          className="h-full w-full"
        />

        <RouteCard
          onClick={() => handleTrenchClick("swamps")}
          onMouseEnter={() => {
            setHoveredMenu("how-to-play");
            setHoveredTerrain("swamps");
            setTerrainSeed(Math.random());
          }}
          onMouseLeave={() => {
            setHoveredMenu(null);
            setHoveredTerrain(null);
          }}
          preview={{
            mode: null,
            forcedTerrain: "swamps",
            showIcons: true,
            hideUnits: true,
          }}
          isSelected={false}
          darkMode={darkMode}
          title="Swamps"
          description='"Rooks shall guard Swamps"'
          Icon={Waves}
          color="blue"
          className="h-full w-full"
        />

        <RouteCard
          onClick={() => handleTrenchClick("forests")}
          onMouseEnter={() => {
            setHoveredMenu("how-to-play");
            setHoveredTerrain("forests");
            setTerrainSeed(Math.random());
          }}
          onMouseLeave={() => {
            setHoveredMenu(null);
            setHoveredTerrain(null);
          }}
          preview={{
            mode: null,
            forcedTerrain: "forests",
            showIcons: true,
            hideUnits: true,
          }}
          isSelected={false}
          darkMode={darkMode}
          title="Forests"
          description='"Bishops shall outlast Forests"'
          Icon={Trees}
          color="emerald"
          className="h-full w-full"
        />

        <RouteCard
          onClick={() => handleTrenchClick("desert")}
          onMouseEnter={() => {
            setHoveredMenu("how-to-play");
            setHoveredTerrain("desert");
            setTerrainSeed(Math.random());
          }}
          onMouseLeave={() => {
            setHoveredMenu(null);
            setHoveredTerrain(null);
          }}
          preview={{
            mode: null,
            forcedTerrain: "desert",
            showIcons: true,
            hideUnits: true,
          }}
          isSelected={false}
          darkMode={darkMode}
          title="Deserts"
          description='"The Deserts shall test all"'
          Icon={DesertIcon}
          color="amber"
          className="h-full w-full"
        />
      </RouteGrid>

      <RoutePageFooter
        onForwardClick={() => navigate("/learn/chess")}
        forwardLabel="Face the Chess"
        forwardIcon={Waves}
      />
    </RoutePageLayout>
  );
};

export default LearnTrenchMainView;
