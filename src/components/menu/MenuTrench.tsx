import React from "react";
import { useNavigate } from "react-router-dom";
import { Trees, Waves, Mountain, ChessRook } from "lucide-react";
import MenuCard from "./MenuCard";
import SectionDivider from "../ui/SectionDivider";
import BackButton from "../ui/BackButton";
import ForwardButton from "../ui/ForwardButton";
import { useMenuContext } from "./MenuContext";
import { DesertIcon } from "../../UnitIcons";
import { Route } from "lucide-react";
import type { TerrainType } from "../../types/game";

import { useParams } from "react-router-dom";
import { TERRAIN_DETAILS } from "../../data/configs/terrainDetails";
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
      <div className="relative w-full max-w-7xl mb-12">
        <SectionDivider
          label='"From Nowhere - Rains terror to terrains with never-ending tethers"'
          color="red"
        />
        <BackButton
          onClick={() => navigate("/learn")}
          className="absolute left-0 -top-8"
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
          description='"Bishops shall protect Forests"'
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
      </div>

      {!terrain && (
        <div className="relative w-full max-w-7xl mt-6 space-y-2">
          <SectionDivider label="" />
          <ForwardButton
            onClick={() =>
              navigate("/learn/chess", { state: { view: "chessmen" } })
            }
            label="Advance the Chessmen"
            className="float-right"
            Icon={ChessRook}
          />
        </div>
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
    </div>
  );
};

export default MenuTrench;
