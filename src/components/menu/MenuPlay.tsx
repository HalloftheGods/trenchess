import React from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Sofa, Bot } from "lucide-react";
import MenuCard from "../MenuCard";
import SectionDivider from "../ui/SectionDivider";
import HeaderLobby from "../HeaderLobby";
import { useMenuContext } from "./MenuLayout";

// Assuming HeaderLobby is reusable or needs refactoring.
// It takes `multiplayer` prop. We'll need to pass that from context too.

const MenuPlay: React.FC = () => {
  const navigate = useNavigate();
  const { setHoveredMenu, darkMode, multiplayer, setSelectedPreset } =
    useMenuContext();

  return (
    <div className="w-full max-w-7xl animate-in slide-in-from-bottom-8 fade-in duration-700 pb-20 flex flex-col items-center">
      <div className="relative flex items-center justify-center gap-4 mb-8 w-full max-w-7xl">
        <button
          onClick={() => navigate("/")}
          className="absolute left-0 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer"
          title="Back to Menu"
        >
          <ChevronLeft size={24} />
        </button>
        <SectionDivider label="Play Trenchress" className="ml-12" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-7xl">
        <MenuCard
          onClick={() => {
            setSelectedPreset("quick");
            // Setup couch mode defaults?
            // navigate('/game'); // Or some intermediate setup
            // For now, let's assume we go to a setup screen or direct play if configured
            // But main app handles "onStartGame".
            // We might need a "Setup" route.
            // Let's assume we navigate to a setup route or specific game route.
            // For now, mirroring existing behavior which set step to 2 (setup?).
            // Let's assume there is a /play/setup route or similar.
            // Actually, existing code: setCurrentStep(2).
            navigate("/play/setup?mode=couch");
          }}
          onMouseEnter={() => setHoveredMenu("couch")}
          onMouseLeave={() => setHoveredMenu(null)}
          isSelected={false}
          darkMode={darkMode}
          title="Couch Mode"
          description="Local play with friends"
          Icon={Sofa}
          color="red"
          className="border-2 border-red-500/20 hover:border-red-500/50 h-full w-full"
        />
        <HeaderLobby
          multiplayer={multiplayer}
          onClick={() => {
            // setCurrentStep(1); // Mode selection / Join
            navigate("/play/lobby");
          }}
          onMouseEnter={() => setHoveredMenu("worldwide")}
          onMouseLeave={() => setHoveredMenu(null)}
        />
        <MenuCard
          onClick={() => {
            // setCurrentStep(2);
            navigate("/play/setup?mode=practice");
          }}
          onMouseEnter={() => setHoveredMenu("practice")}
          onMouseLeave={() => setHoveredMenu(null)}
          isSelected={false}
          darkMode={darkMode}
          title="Practice Mode"
          description="Play against the AI"
          Icon={Bot}
          color="slate"
          className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/50 dark:hover:bg-slate-800 h-full w-full"
        />
      </div>
    </div>
  );
};

export default MenuPlay;
