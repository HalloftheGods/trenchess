import React from "react";
import { useNavigate } from "react-router-dom";
import { Trees, Waves, Mountain } from "lucide-react";
import MenuCard from "../MenuCard";
import SectionDivider from "../ui/SectionDivider";
import BackButton from "../ui/BackButton";
import { useMenuContext } from "./MenuContext";
import { DesertIcon } from "../../UnitIcons";
import type { TerrainType } from "../../types";

import { useParams } from "react-router-dom";
import { TERRAIN_DETAILS } from "../../data/terrainDetails";
import MenuDetailModal from "./MenuDetailModal";
import TrenchCardDetail from "./TrenchCardDetail";

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
    <div className="w-full max-w-7xl animate-in slide-in-from-bottom-8 fade-in duration-700 pb-20 flex flex-col items-center">
      <div className="relative flex items-center justify-center gap-4 mb-4 w-full max-w-7xl">
        <BackButton
          onClick={() => navigate("/learn")}
          className="absolute left-0"
        />
        <SectionDivider
          label="The Trench came as four terrains."
          className="ml-24"
          color="red"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-7xl">
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
          isSelected={false}
          darkMode={darkMode}
          title="Mountains"
          description="Favored the Knights"
          Icon={Mountain}
          color="red"
          className="bg-red-100/30 hover:bg-red-200/50 dark:bg-red-900/20 dark:hover:bg-red-900/40 border-2 border-red-500/20 hover:border-red-500/50 h-full w-full"
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
          isSelected={false}
          darkMode={darkMode}
          title="Swamps"
          description="Favored the Rooks"
          Icon={Waves}
          color="blue"
          className="bg-blue-100/30 hover:bg-blue-200/50 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 border-2 border-blue-500/20 hover:border-blue-500/50 h-full w-full"
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
          isSelected={false}
          darkMode={darkMode}
          title="Forests"
          description="Favored the Bishops"
          Icon={Trees}
          color="emerald"
          className="bg-emerald-100/30 hover:bg-emerald-200/50 dark:bg-emerald-900/20 dark:hover:bg-emerald-900/40 border-2 border-emerald-500/20 hover:border-emerald-500/50 h-full w-full"
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
          isSelected={false}
          darkMode={darkMode}
          title="Deserts"
          description="Favored no one."
          Icon={DesertIcon}
          color="amber"
          className="bg-amber-100/30 hover:bg-amber-200/50 dark:bg-amber-900/20 dark:hover:bg-amber-900/40 border-2 border-amber-500/20 hover:border-amber-500/50 h-full w-full"
        />
      </div>
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
    </div>
  );
};

export default MenuTrench;
