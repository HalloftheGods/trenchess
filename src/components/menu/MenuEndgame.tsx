import React from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChessKing, ChessQueen, Earth } from "lucide-react";
import MenuCard from "../MenuCard";
import SectionDivider from "../ui/SectionDivider";
import { useMenuContext } from "./MenuLayout";

const MenuEndgame: React.FC = () => {
  const navigate = useNavigate();
  const { setHoveredMenu, setCtkBoardMode, darkMode } = useMenuContext();

  return (
    <div className="w-full max-w-7xl animate-in slide-in-from-bottom-8 fade-in duration-700 pb-20 flex flex-col items-center">
      <div className="relative flex items-center justify-center gap-4 mb-8 w-full max-w-7xl">
        <button
          onClick={() => navigate("/learn")}
          className="absolute left-0 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer"
          title="Back to How to Play"
        >
          <ChevronLeft size={24} />
        </button>
        <SectionDivider
          label="The Endgame: Different ways to play"
          className="ml-12"
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
            setCtkBoardMode(Math.random() > 0.5 ? "2p-ns" : "2p-ew");
          }}
          onMouseLeave={() => setHoveredMenu(null)}
          isSelected={false}
          darkMode={darkMode}
          title="Capture the King"
          description="Classic Checkmate"
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
          isSelected={false}
          darkMode={darkMode}
          title="Capture the Army"
          description="4 Player Domination"
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
          isSelected={false}
          darkMode={darkMode}
          title="Capture the World"
          description="Team Co-Op Objective"
          Icon={Earth}
          color="emerald"
          className="bg-emerald-100/50 hover:bg-emerald-200/50 dark:bg-emerald-900/20 dark:hover:bg-emerald-900/40 border-2 border-emerald-500/20 hover:border-emerald-500/50 h-full w-full"
        />
      </div>
    </div>
  );
};

export default MenuEndgame;
