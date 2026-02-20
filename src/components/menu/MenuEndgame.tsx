import React from "react";
import { useNavigate } from "react-router-dom";
import { ChessKing, ChessQueen, Earth } from "lucide-react";
import MenuCard from "../MenuCard";
import SectionDivider from "../ui/SectionDivider";
import BackButton from "../ui/BackButton";
import { useMenuContext } from "./MenuContext";

const MenuEndgame: React.FC = () => {
  const navigate = useNavigate();
  const { setHoveredMenu, darkMode } = useMenuContext();

  return (
    <div className="w-full max-w-7xl animate-in slide-in-from-bottom-8 fade-in duration-700 pb-20 flex flex-col items-center">
      <div className="relative flex items-center justify-center gap-4 mb-8 w-full max-w-7xl">
        <BackButton
          onClick={() => navigate("/learn")}
          className="absolute left-0"
        />
        <SectionDivider
          label="The Endgame brought different win conditions"
          className="ml-24"
          color="emerald"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-7xl">
        {/* Capture the King */}
        <MenuCard
          onClick={() => {
            // Navigate to CTK guide or placeholder
            // navigate('/learn/endgame/ctk');
          }}
          onMouseEnter={() => {
            setHoveredMenu("ctk");
          }}
          onMouseLeave={() => setHoveredMenu(null)}
          preview={{
            mode: Math.random() > 0.5 ? "2p-ns" : "2p-ew",
            hideUnits: true,
          }}
          isSelected={false}
          darkMode={darkMode}
          title="Capture the King"
          description="Some Stayed True to the Classic Checkmate"
          Icon={ChessKing}
          color="red"
          className="bg-red-100/30 hover:bg-red-200/50 dark:bg-red-900/20 dark:hover:bg-red-900/40 border-2 border-red-500/20 hover:border-red-500/50 h-full w-full"
        />
        {/* Capture the Board */}
        <MenuCard
          onClick={() => {
            // Navigate to 4-player guide
            // navigate('/learn/endgame/army');
          }}
          onMouseEnter={() => setHoveredMenu("ctboard")}
          onMouseLeave={() => setHoveredMenu(null)}
          preview={{
            mode: "4p",
            hideUnits: true,
          }}
          isSelected={false}
          darkMode={darkMode}
          title="Capture the Army"
          description="Others Wanted to be the Last Army Standing"
          Icon={ChessQueen}
          color="blue"
          className="bg-blue-100/30 hover:bg-blue-200/50 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 border-2 border-blue-500/20 hover:border-blue-500/50 h-full w-full"
        />
        {/* Capture the World */}
        <MenuCard
          onClick={() => {
            // navigate('/learn/ctf'); // Or use the callback from props if kept
            // onCtfGuide() was passed in MenuScreen.
            // In new router, we should navigate to the route.
            navigate("/learn/ctf");
          }}
          onMouseEnter={() => setHoveredMenu("ctf")}
          onMouseLeave={() => setHoveredMenu(null)}
          preview={{
            mode: "2v2",
            hideUnits: true,
          }}
          isSelected={false}
          darkMode={darkMode}
          title="Capture the World"
          description="But  most wanted to dominate the world"
          Icon={Earth}
          color="emerald"
          className="bg-emerald-100/50 hover:bg-emerald-200/50 dark:bg-emerald-900/20 dark:hover:bg-emerald-900/40 border-2 border-emerald-500/20 hover:border-emerald-500/50 h-full w-full"
        />
      </div>
    </div>
  );
};

export default MenuEndgame;
