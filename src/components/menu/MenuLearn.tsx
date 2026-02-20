import React from "react";
import { useNavigate } from "react-router-dom";
import { ChessRook, Mountain } from "lucide-react";
import MenuCard from "../MenuCard";
import SectionDivider from "../ui/SectionDivider";
import BackButton from "../ui/BackButton";
import ForwardButton from "../ui/ForwardButton";
import { useMenuContext } from "./MenuContext";
import { Route } from "lucide-react";

const MenuLearn: React.FC = () => {
  const navigate = useNavigate();
  const { setHoveredMenu, setTerrainSeed, darkMode } = useMenuContext();

  return (
    <div className="w-full max-w-7xl animate-in slide-in-from-bottom-8 fade-in duration-700 pb-20 flex flex-col items-center">
      <div className="relative w-full max-w-7xl mb-12">
        <SectionDivider label='"There&apos;s a Prophecy on the wind..."' />
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
          description='"One day, out of NOWHERE, the Trench opens..."'
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
          title="Advance The Chessmen"
          description='"...then come the Chessmen with advanced formations."'
          Icon={ChessRook}
          color="blue"
          className="h-full w-full"
        />
      </div>

      {/* <div className="relative w-full max-w-7xl mt-16">
        <SectionDivider label="Begin Your Journey" color="red" />
        <ForwardButton
          onClick={() => navigate("/learn/trench")}
          label="Open the Trench"
          className="absolute right-0 -top-8"
          Icon={Route}
        />
      </div> */}
    </div>
  );
};

export default MenuLearn;
