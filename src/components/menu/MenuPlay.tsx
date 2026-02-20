import React from "react";
import { useNavigate } from "react-router-dom";
import { Sofa } from "lucide-react";
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
        <SectionDivider label="And so it began..." />
        <BackButton
          onClick={() => navigate("/")}
          className="absolute left-0 -top-8"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl px-4">
        <MenuCard
          onClick={() => navigate("/play/local")}
          onMouseEnter={() => setHoveredMenu("couch")}
          onMouseLeave={() => setHoveredMenu(null)}
          isSelected={false}
          darkMode={darkMode}
          title="Locals Gathered"
          description="Friends became families. (Local Play)"
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
