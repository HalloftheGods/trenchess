import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Trees, Waves, Mountain } from "lucide-react";
import { DesertIcon } from "@/client/game/components/atoms/UnitIcons";
import { useRouteContext } from "@/route.context";
import type { TerrainType } from "@/shared/types/game";
import { TERRAIN_DETAILS } from "@/client/game/theme";

// Shared Route Components
import RoutePageLayout from "@/shared/components/templates/RoutePageLayout";
import RoutePageHeader from "@/shared/components/organisms/RoutePageHeader";
import RoutePageFooter from "@/shared/components/organisms/RoutePageFooter";
import RouteGrid from "@/shared/components/templates/RouteGrid";
import RouteCard from "@/shared/components/molecules/RouteCard";
import RouteDetailModal from "@/shared/components/organisms/RouteDetailModal";
import TrenchCardDetail from "@/client/game/components/organisms/TrenchCardDetail";

export const LearnTrenchMainView: React.FC = () => {
  const navigate = useNavigate();
  const { terrain } = useParams<{ terrain: string }>();
  const {
    setHoveredMenu,
    setHoveredTerrain,
    setTerrainSeed,
    darkMode,
    pieceStyle,
  } = useRouteContext();

  const handleTrenchClick = (t: TerrainType) => {
    navigate(`/learn/trench/${t}`);
  };

  const closeModal = () => {
    navigate("/learn/trench");
  };

  // Navigation Logic
  const currentIndex = TERRAIN_DETAILS.findIndex((t) => t.key === terrain);
  const prevTerrain =
    currentIndex !== -1
      ? TERRAIN_DETAILS[
          (currentIndex - 1 + TERRAIN_DETAILS.length) % TERRAIN_DETAILS.length
        ]
      : null;
  const nextTerrain =
    currentIndex !== -1
      ? TERRAIN_DETAILS[(currentIndex + 1) % TERRAIN_DETAILS.length]
      : null;

  return (
    <RoutePageLayout>
      <RoutePageHeader
        label='"From Nowhere - Rains terror to terrains with never-ending tethers"'
        color="red"
        onBackClick={() => navigate("/learn")}
      />

      <RouteGrid cols={4}>
        <RouteCard
          onClick={() => handleTrenchClick("rubble")}
          onMouseEnter={() => {
            setHoveredMenu("how-to-play");
            setHoveredTerrain("rubble");
            setTerrainSeed(Math.random());
          }}
          onMouseLeave={() => {
            setHoveredMenu(null);
            setHoveredTerrain(null);
          }}
          preview={{
            mode: null,
            forcedTerrain: "rubble",
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
          onClick={() => handleTrenchClick("ponds")}
          onMouseEnter={() => {
            setHoveredMenu("how-to-play");
            setHoveredTerrain("ponds");
            setTerrainSeed(Math.random());
          }}
          onMouseLeave={() => {
            setHoveredMenu(null);
            setHoveredTerrain(null);
          }}
          preview={{
            mode: null,
            forcedTerrain: "ponds",
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
          onClick={() => handleTrenchClick("trees")}
          onMouseEnter={() => {
            setHoveredMenu("how-to-play");
            setHoveredTerrain("trees");
            setTerrainSeed(Math.random());
          }}
          onMouseLeave={() => {
            setHoveredMenu(null);
            setHoveredTerrain(null);
          }}
          preview={{
            mode: null,
            forcedTerrain: "trees",
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

      {!terrain && (
        <RoutePageFooter
          onForwardClick={() => navigate("/learn/chess")}
          forwardLabel="Claim the Chess"
          forwardIcon={Waves}
        />
      )}

      <RouteDetailModal
        isOpen={!!terrain}
        onClose={closeModal}
        darkMode={darkMode}
        color={
          terrain === "rubble"
            ? "red"
            : terrain === "ponds"
              ? "blue"
              : terrain === "trees"
                ? "emerald"
                : "amber"
        }
        prev={
          prevTerrain && prevTerrain.icon
            ? {
                icon: prevTerrain.icon,
                label: prevTerrain.label,
                onClick: () =>
                  handleTrenchClick(prevTerrain.key as TerrainType),
                className: prevTerrain.color.text,
              }
            : undefined
        }
        next={
          nextTerrain && nextTerrain.icon
            ? {
                icon: nextTerrain.icon,
                label: nextTerrain.label,
                onClick: () =>
                  handleTrenchClick(nextTerrain.key as TerrainType),
                className: nextTerrain.color.text,
              }
            : undefined
        }
      >
        {terrain && (
          <TrenchCardDetail
            terrainType={terrain as TerrainType}
            darkMode={darkMode}
            pieceStyle={pieceStyle}
          />
        )}
      </RouteDetailModal>
    </RoutePageLayout>
  );
};

export default LearnTrenchMainView;
