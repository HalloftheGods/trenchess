import React from "react";
import { useNavigate } from "react-router-dom";
import { Bot, User, Users, UserPlus } from "lucide-react";
import MenuCard from "../MenuCard";
import SectionDivider from "../ui/SectionDivider";
import BackButton from "../ui/BackButton";
import { useMenuContext } from "./MenuContext";

const MenuLocal: React.FC = () => {
  const navigate = useNavigate();
  const { setHoveredMenu, darkMode } = useMenuContext();

  return (
    <div className="w-full max-w-7xl animate-in slide-in-from-bottom-8 fade-in duration-700 pb-20 flex flex-col items-center">
      <div className="relative flex items-center justify-center gap-4 mb-8 w-full max-w-7xl">
        <BackButton
          onClick={() => navigate("/play")}
          label="Play"
          className="absolute left-0"
        />
        <SectionDivider
          label="Local Mode"
          className="ml-24"
          color="amber"
          animate
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-7xl">
        <MenuCard
          onClick={() => navigate("/play/setup?mode=practice&players=1")}
          onMouseEnter={() => setHoveredMenu("practice")}
          onMouseLeave={() => setHoveredMenu(null)}
          isSelected={false}
          darkMode={darkMode}
          title="One Player"
          description="Play your AI friends today!"
          Icon={Bot}
          color="red"
          className="border-2 border-red-500/20 hover:border-red-500/50 h-full w-full"
        />
        <MenuCard
          onClick={() => navigate("/play/setup?mode=couch&players=2")}
          onMouseEnter={() => setHoveredMenu("couch")}
          onMouseLeave={() => setHoveredMenu(null)}
          isSelected={false}
          darkMode={darkMode}
          title="Two Players"
          description="Your good ol' 1 v 1 pow-wow."
          Icon={User}
          color="blue"
          className="border-2 border-blue-500/20 hover:border-blue-500/50 h-full w-full"
        />
        <MenuCard
          onClick={() => navigate("/play/setup?mode=couch&players=3")}
          onMouseEnter={() => setHoveredMenu("couch")}
          onMouseLeave={() => setHoveredMenu(null)}
          isSelected={false}
          darkMode={darkMode}
          title="Three Players"
          description="1 v 2 or Free-for-all."
          Icon={Users}
          color="emerald"
          className="border-2 border-emerald-500/20 hover:border-emerald-500/50 h-full w-full"
        />
        <MenuCard
          onClick={() => navigate("/play/setup?mode=couch&players=4")}
          onMouseEnter={() => setHoveredMenu("couch")}
          onMouseLeave={() => setHoveredMenu(null)}
          isSelected={false}
          darkMode={darkMode}
          title="Four Players"
          description="Good Luck!"
          Icon={UserPlus}
          color="amber"
          className="border-2 border-amber-500/20 hover:border-amber-500/50 h-full w-full"
        />
      </div>
    </div>
  );
};

export default MenuLocal;
