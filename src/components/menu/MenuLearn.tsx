import React from "react";
import { useNavigate } from "react-router-dom";
import { ChessRook, Mountain } from "lucide-react";
import MenuCard from "../MenuCard";
import SectionDivider from "../ui/SectionDivider";
import BackButton from "../ui/BackButton";
import { useMenuContext } from "./MenuContext";

const MenuLearn: React.FC = () => {
  const navigate = useNavigate();
  const { setHoveredMenu, setTerrainSeed, darkMode } = useMenuContext();

  return (
    <div className="w-full max-w-7xl animate-in slide-in-from-bottom-8 fade-in duration-700 pb-20 flex flex-col items-center">
      <div className="relative w-full max-w-7xl mb-12">
        <SectionDivider label="There's a Prophecy on the wind..." />
        <BackButton
          onClick={() => navigate("/")}
          className="absolute left-0 -top-8"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl">
        <MenuCard
          onClick={() => navigate("/learn/trench")}
          onMouseEnter={() => {
            setHoveredMenu("how-to-play");
            setTerrainSeed(Math.random());
          }}
          onMouseLeave={() => setHoveredMenu(null)}
          isSelected={false}
          darkMode={darkMode}
          title="Open The Trench"
          description="One day, out of NOWHERE, the Trench opens..."
          Icon={Mountain}
          color="red"
          className="h-full w-full"
        />
        <MenuCard
          onClick={() => navigate("/learn/chess")}
          onMouseEnter={() => setHoveredMenu("chess")}
          onMouseLeave={() => setHoveredMenu(null)}
          isSelected={false}
          darkMode={darkMode}
          title="Advance The Chess"
          description="...the Royal Family's form, never the same, if not insane."
          Icon={ChessRook}
          color="blue"
          className="h-full w-full"
        />
      </div>
    </div>
  );
};

export default MenuLearn;
