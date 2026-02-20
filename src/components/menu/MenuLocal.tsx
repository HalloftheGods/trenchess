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
      <div className="relative w-full max-w-7xl mb-12">
        <SectionDivider
          label="Locals Gathered - Songs were sung"
          color="amber"
          animate
        />
        <BackButton
          onClick={() => navigate("/play")}
          label="Play"
          className="absolute left-0 -top-8"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-7xl">
        <MenuCard
          onClick={() => navigate("/play/setup?mode=practice&players=1")}
          onMouseEnter={() => setHoveredMenu("practice")}
          onMouseLeave={() => setHoveredMenu(null)}
          preview={{
            mode: "2p-ns",
            hideUnits: true,
          }}
          isSelected={false}
          darkMode={darkMode}
          title="One Player"
          description="Nocturne of the A.I. Battles"
          Icon={Bot}
          color="red"
          className="h-full w-full"
        />
        <MenuCard
          onClick={() => navigate("/play/setup?mode=couch&players=2")}
          onMouseEnter={() => setHoveredMenu("couch")}
          onMouseLeave={() => setHoveredMenu(null)}
          preview={{
            mode: "2p-ns",
            hideUnits: true,
          }}
          isSelected={false}
          darkMode={darkMode}
          title="Two Players"
          description="Duet of the Two Rivals"
          Icon={User}
          color="blue"
          className="h-full w-full"
        />
        <MenuCard
          onClick={() => navigate("/play/setup?mode=couch&players=3")}
          onMouseEnter={() => setHoveredMenu("couch")}
          onMouseLeave={() => setHoveredMenu(null)}
          preview={{
            mode: "4p",
            hideUnits: true,
          }}
          isSelected={false}
          darkMode={darkMode}
          title="Three Players"
          description="Ballad of the Three for All"
          Icon={Users}
          color="emerald"
          className="h-full w-full"
        />
        <MenuCard
          onClick={() => navigate("/play/setup?mode=couch&players=4")}
          onMouseEnter={() => setHoveredMenu("couch")}
          onMouseLeave={() => setHoveredMenu(null)}
          preview={{
            mode: "2v2",
            hideUnits: true,
          }}
          isSelected={false}
          darkMode={darkMode}
          title="Four Players"
          description="Ode to the Corners of the World"
          Icon={UserPlus}
          color="amber"
          className="h-full w-full"
        />
      </div>
    </div>
  );
};

export default MenuLocal;
