import React, { lazy } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Trees, Waves, Mountain, ChessRook } from "lucide-react";
import { DesertIcon } from "@/app/routes/game/components/atoms/UnitIcons";
import { useMenuContext } from "@/app/context/MenuContext";
import type { TerrainType } from "@engineTypes/game";
import { TERRAIN_DETAILS } from "@engineConfigs/terrainDetails";

// Atomic Components
import MenuPageLayout from "@/app/routes/menu/components/templates/MenuPageLayout";
import MenuPageHeader from "@/app/routes/menu/components/organisms/MenuPageHeader";
import MenuPageFooter from "@/app/routes/menu/components/organisms/MenuPageFooter";
import MenuGrid from "@/app/routes/menu/components/templates/MenuGrid";
import MenuCard from "@/app/routes/menu/components/molecules/MenuCard";
import MenuDetailModal from "@/app/routes/menu/components/organisms/MenuDetailModal";
import TrenchCardDetail from "@/app/routes/game/components/molecules/TrenchCardDetail";

const MenuTrench: React.FC = () => {
  const navigate = useNavigate();
  const { terrain } = useParams<{ terrain: string }>();
  const {
    setHoveredMenu,
    setHoveredTerrain,
    setTerrainSeed,
    darkMode,
    pieceStyle,
  } = useMenuContext();

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
    <MenuPageLayout>
      <MenuPageHeader
        label='"From Nowhere - Rains terror to terrains with never-ending tethers"'
        color="red"
        onBackClick={() => navigate("/learn")}
      />

      <MenuGrid cols={4}>
        <MenuCard
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

        <MenuCard
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

        <MenuCard
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
          description='"Bishops shall heal Forests"'
          Icon={Trees}
          color="emerald"
          className="h-full w-full"
        />

        <MenuCard
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
      </MenuGrid>

      {!terrain && (
        <MenuPageFooter
          onForwardClick={() =>
            navigate("/learn/chess", { state: { view: "chessmen" } })
          }
          forwardLabel="Close the Cracks"
          forwardIcon={ChessRook}
        />
      )}

      <MenuDetailModal
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
          prevTerrain
            ? {
                icon: prevTerrain.icon,
                label: prevTerrain.label,
                onClick: () => handleTrenchClick(prevTerrain.key),
                className: prevTerrain.color.text,
              }
            : undefined
        }
        next={
          nextTerrain
            ? {
                icon: nextTerrain.icon,
                label: nextTerrain.label,
                onClick: () => handleTrenchClick(nextTerrain.key),
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
      </MenuDetailModal>
    </MenuPageLayout>
  );
};

export default MenuTrench;
export const LazyMenuTrench = lazy(() => import("./MenuTrench"));
