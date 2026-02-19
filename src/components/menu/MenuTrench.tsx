import React from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Trees, Waves, Mountain } from "lucide-react";
import MenuCard from "../MenuCard";
import SectionDivider from "../ui/SectionDivider";
import { useMenuContext } from "./MenuLayout";
import { DesertIcon } from "../../UnitIcons";
import type { TerrainType } from "../../types";

const MenuTrench: React.FC = () => {
  const navigate = useNavigate();
  const {
    setHoveredMenu,
    setHoveredTerrain,
    setTerrainSeed,
    darkMode,
    onTrenchGuide,
  } = useMenuContext();

  const handleTrenchClick = (terrain: TerrainType) => {
    // Navigate to trench guide with param
    // or use the callback if we keep it. Use Router!
    navigate(`/learn/trench/${terrain}`);
  };

  return (
    <div className="w-full max-w-7xl animate-in slide-in-from-bottom-8 fade-in duration-700 pb-20 flex flex-col items-center">
      <div className="relative flex items-center justify-center gap-4 mb-4 w-full max-w-7xl">
        <button
          onClick={() => navigate("/learn")}
          className="absolute left-0 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer"
          title="Back to How to Play"
        >
          <ChevronLeft size={24} />
        </button>
        <SectionDivider
          label="The Trench: Trials & Tribulations"
          className="ml-12"
          color="red"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-7xl">
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
          description="Protects Bishops"
          Icon={Trees}
          color="emerald"
          className="bg-emerald-100/30 hover:bg-emerald-200/50 dark:bg-emerald-900/20 dark:hover:bg-emerald-900/40 border-2 border-emerald-500/20 hover:border-emerald-500/50 h-full w-full"
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
          title="Swamp"
          description="Protects Pawns & Rooks"
          Icon={Waves}
          color="blue"
          className="bg-blue-100/30 hover:bg-blue-200/50 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 border-2 border-blue-500/20 hover:border-blue-500/50 h-full w-full"
        />
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
          description="Protects Knights"
          Icon={Mountain}
          color="slate"
          className="bg-slate-100/30 hover:bg-slate-200/50 dark:bg-slate-900/20 dark:hover:bg-slate-900/40 border-2 border-slate-500/20 hover:border-slate-500/50 h-full w-full"
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
          title="Desert"
          description="Protects Rooks"
          Icon={DesertIcon}
          color="amber"
          className="bg-amber-100/30 hover:bg-amber-200/50 dark:bg-amber-900/20 dark:hover:bg-amber-900/40 border-2 border-amber-500/20 hover:border-amber-500/50 h-full w-full"
        />
      </div>
    </div>
  );
};

export default MenuTrench;
