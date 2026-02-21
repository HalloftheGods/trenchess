import React from "react";
import { useNavigate } from "react-router-dom";
import { Sofa, Bot, Sword, GamepadDirectional } from "lucide-react";
import MenuCard from "../MenuCard";
import SectionDivider from "../ui/SectionDivider";
import BackButton from "../ui/BackButton";
import HeaderLobby from "../HeaderLobby";
import { useMenuContext } from "./MenuContext";

const MenuPlay: React.FC = () => {
  const navigate = useNavigate();
  const { setHoveredMenu, darkMode, multiplayer } = useMenuContext();

  return (
    <div className="w-full max-w-7xl animate-in slide-in-from-bottom-8 fade-in duration-700 pb-20 flex flex-col items-center">
      <div className="relative w-full max-w-7xl mb-12">
        <SectionDivider label='"And so it begins..."' />
        <BackButton
          onClick={() => navigate("/")}
          className="absolute left-0 -top-8"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full px-4">
        <MenuCard
          onClick={() => navigate("/play/setup?mode=practice&players=1")}
          onMouseEnter={() => setHoveredMenu("practice")}
          onMouseLeave={() => setHoveredMenu(null)}
          isSelected={false}
          darkMode={darkMode}
          title="Masters Practice"
          description='"Fools become Masters." (A.I. Play)'
          Icon={GamepadDirectional}
          color="slate"
          className="h-full w-full"
        />
        <MenuCard
          onClick={() => navigate("/play/local")}
          onMouseEnter={() => setHoveredMenu("couch")}
          onMouseLeave={() => setHoveredMenu(null)}
          isSelected={false}
          darkMode={darkMode}
          title="Locals Gather"
          description='"Friends become families." (Local Play)'
          Icon={Sofa}
          color="red"
          className="h-full w-full"
        />
        <HeaderLobby
          multiplayer={multiplayer}
          onClick={() => navigate("/play/lobby")}
          onMouseEnter={() => setHoveredMenu("worldwide")}
          onMouseLeave={() => setHoveredMenu(null)}
        />
      </div>
    </div>
  );
};

export default MenuPlay;
