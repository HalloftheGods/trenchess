import React from "react";
import { useNavigate } from "react-router-dom";
import { Baby } from "lucide-react";
import MenuCard from "./MenuCard";
import SectionDivider from "../ui/SectionDivider";
import TrenchessText from "../ui/TrenchessText";
import { useMenuContext } from "./MenuContext";
import { DualToneSwords } from "./MenuIcons";

const MenuHome: React.FC = () => {
  const navigate = useNavigate();
  const { darkMode, setHoveredMenu, setTerrainSeed } = useMenuContext();

  return (
    <div className="w-full max-w-7xl animate-in slide-in-from-bottom-8 fade-in duration-700 pb-20 flex flex-col items-center">
      <SectionDivider label="Main Menu" className="mb-8 max-w-7xl" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl px-4">
        <MenuCard
          onClick={() => navigate("/learn")}
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
          title="How to Play"
          description="Learn the Basics"
          Icon={Baby}
          color="slate"
          className="h-full w-full"
        />
        <MenuCard
          onClick={() => navigate("/play")}
          onMouseEnter={() => setHoveredMenu("play-menu")}
          onMouseLeave={() => setHoveredMenu(null)}
          preview={{
            mode: "2p-ns",
            hideUnits: true,
          }}
          isSelected={false}
          darkMode={darkMode}
          title="Enter The Trenchess"
          titleNode={
            <>
              Enter the <TrenchessText />
            </>
          }
          description='"Master its Wisdom"'
          Icon={DualToneSwords}
          color="red"
          className="h-full w-full"
        />
      </div>
    </div>
  );
};

export default MenuHome;
