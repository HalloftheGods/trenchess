import React, { lazy } from "react";
import { useNavigate } from "react-router-dom";
import { Sofa, GamepadDirectional } from "lucide-react";
import { useMenuContext } from "@/app/context/MenuContext";

// Atomic Components
import MenuPageLayout from "@/app/routes/menu/components/templates/MenuPageLayout";
import MenuPageHeader from "@/app/routes/menu/components/organisms/MenuPageHeader";
import MenuGrid from "@/app/routes/menu/components/templates/MenuGrid";
import MenuCard from "@/app/routes/menu/components/molecules/MenuCard";
import HeaderLobby from "@/app/routes/game/components/organisms/HeaderLobby";

const MenuPlay: React.FC = () => {
  const navigate = useNavigate();
  const { setHoveredMenu, darkMode, multiplayer } = useMenuContext();

  return (
    <MenuPageLayout>
      <MenuPageHeader
        label='"And so it begins..."'
        onBackClick={() => navigate("/")}
      />

      <MenuGrid cols={3} className="px-4">
        <MenuCard
          onClick={() => navigate("/play/setup?mode=practice&players=1")}
          onMouseEnter={() => setHoveredMenu("practice")}
          onMouseLeave={() => setHoveredMenu(null)}
          preview={{
            mode: "4p",
            protocol: "classic",
          }}
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
          preview={{
            mode: "2p-ns",
            protocol: "classic",
          }}
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
      </MenuGrid>
    </MenuPageLayout>
  );
};

export default MenuPlay;
export const LazyMenuPlay = lazy(() => import("./MenuPlay"));
