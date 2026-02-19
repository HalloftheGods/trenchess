import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Map as MapIcon,
  ChessPawn,
  ChessKing,
  MountainSnow,
} from "lucide-react";
import MenuCard from "../MenuCard";
import SectionDivider from "../ui/SectionDivider";
import BackButton from "../ui/BackButton";
import { useMenuContext } from "./MenuContext";

const MenuLearn: React.FC = () => {
  const navigate = useNavigate();
  const { setHoveredMenu, setTerrainSeed, darkMode } = useMenuContext();

  return (
    <div className="w-full max-w-7xl animate-in slide-in-from-bottom-8 fade-in duration-700 pb-20 flex flex-col items-center">
      <div className="relative flex items-center justify-center gap-4 mb-8 w-full max-w-7xl">
        <BackButton onClick={() => navigate("/")} className="absolute left-0" />
        <SectionDivider label="How to Play" className="ml-24" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-7xl">
        <MenuCard
          onClick={() => navigate("/learn/trench")}
          onMouseEnter={() => {
            setHoveredMenu("how-to-play");
            setTerrainSeed(Math.random());
          }}
          onMouseLeave={() => setHoveredMenu(null)}
          isSelected={false}
          darkMode={darkMode}
          title="The Trench"
          description="Terrain & Tactics"
          Icon={MountainSnow}
          color="red"
          className="bg-red-100/30 hover:bg-red-200/50 dark:bg-red-900/20 dark:hover:bg-red-900/40 border-2 border-red-500/20 hover:border-red-500/50 h-full w-full"
        />
        <MenuCard
          onClick={() => navigate("/learn/chess")}
          onMouseEnter={() => setHoveredMenu("chess")}
          onMouseLeave={() => setHoveredMenu(null)}
          isSelected={false}
          darkMode={darkMode}
          title="The Chess"
          description="New Jobs!"
          Icon={ChessPawn}
          color="blue"
          className="bg-blue-100 hover:bg-blue-200 dark:bg-blue-800/50 dark:hover:bg-blue-800 h-full w-full !border-blue-500/20 hover:!border-blue-500/50"
        />
        <MenuCard
          onClick={() => navigate("/learn/endgame")}
          onMouseEnter={() => setHoveredMenu("boardgame")}
          onMouseLeave={() => setHoveredMenu(null)}
          isSelected={false}
          darkMode={darkMode}
          title="The Endgame"
          description="Modes & Objectives"
          Icon={ChessKing}
          color="emerald"
          className="bg-emerald-100/50 hover:bg-emerald-200/50 dark:bg-emerald-900/20 dark:hover:bg-emerald-900/40 border-2 border-emerald-500/20 hover:border-emerald-500/50 h-full w-full"
        />
      </div>
    </div>
  );
};

export default MenuLearn;
