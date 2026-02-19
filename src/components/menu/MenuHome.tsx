import React from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen } from "lucide-react";
import MenuCard from "../MenuCard";
import SectionDivider from "../ui/SectionDivider";
import TrenchessText from "../ui/TrenchessText";

// Define the icon locally or import it if it's shared
// It was defined in MenuScreen.tsx, let's redefine it here or move it to a shared file later.
// For now, duplicating the simple component to avoid breaking changes in other files.
const DualColorSwordsIcon: React.FC<{ size?: number; className?: string }> = ({
  size = 64,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5" stroke="#2563eb" />
    <line x1="13" x2="19" y1="19" y2="13" stroke="#2563eb" />
    <line x1="16" x2="20" y1="16" y2="20" stroke="#2563eb" />
    <line x1="19" x2="21" y1="21" y2="19" stroke="#2563eb" />
    <polyline points="14.5 6.5 18 3 21 3 21 6 17.5 9.5" stroke="#dc2626" />
    <line x1="5" x2="9" y1="14" y2="18" stroke="#dc2626" />
    <line x1="7" x2="4" y1="17" y2="20" stroke="#dc2626" />
    <line x1="3" x2="5" y1="19" y2="21" stroke="#dc2626" />
  </svg>
);

interface MenuHomeProps {
  darkMode: boolean;
  setHoveredMenu: (menu: string | null) => void;
  setTerrainSeed: (seed: number) => void;
}

const MenuHome: React.FC<MenuHomeProps> = ({
  darkMode,
  setHoveredMenu,
  setTerrainSeed,
}) => {
  const navigate = useNavigate();

  return (
    <div className="w-full max-w-7xl animate-in slide-in-from-bottom-8 fade-in duration-700 pb-20 flex flex-col items-center">
      <SectionDivider label="Main Menu" className="mb-8 max-w-7xl" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-7xl">
        <MenuCard
          onClick={() => navigate("/learn")}
          onMouseEnter={() => {
            setHoveredMenu("how-to-play");
            setTerrainSeed(Math.random());
          }}
          onMouseLeave={() => setHoveredMenu(null)}
          isSelected={false}
          darkMode={darkMode}
          title="How to Play"
          description="Learn the Basics"
          Icon={BookOpen}
          color="slate"
          className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/50 dark:hover:bg-slate-800 h-full w-full"
        />
        <MenuCard
          onClick={() => navigate("/play")}
          onMouseEnter={() => setHoveredMenu("play-menu")}
          onMouseLeave={() => setHoveredMenu(null)}
          isSelected={false}
          darkMode={darkMode}
          title="Play Trenchess"
          titleNode={
            <>
              Play <TrenchessText />
            </>
          }
          description="Choose your battleground"
          Icon={DualColorSwordsIcon}
          color="red"
          className="border-2 border-red-500/20 hover:border-blue-500/30 h-full w-full"
        />
      </div>
    </div>
  );
};

export default MenuHome;
