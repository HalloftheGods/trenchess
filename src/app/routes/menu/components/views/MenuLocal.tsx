import React, { lazy } from "react";
import { useNavigate } from "react-router-dom";
import { Bot, User, Users, UserPlus } from "lucide-react";
import { useMenuContext } from "@/app/context/MenuContext";

// Atomic Components
import MenuPageLayout from "@/app/routes/menu/components/templates/MenuPageLayout";
import MenuPageHeader from "@/app/routes/menu/components/organisms/MenuPageHeader";
import MenuGrid from "@/app/routes/menu/components/templates/MenuGrid";
import MenuCard from "@/app/routes/menu/components/molecules/MenuCard";

const MenuLocal: React.FC = () => {
  const navigate = useNavigate();
  const { setHoveredMenu, darkMode } = useMenuContext();

  return (
    <MenuPageLayout>
      <MenuPageHeader
        label="Locals Gather - Songs are sung"
        color="amber"
        backLabel="Play"
        onBackClick={() => navigate("/play")}
      />

      <MenuGrid cols={4}>
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
      </MenuGrid>
    </MenuPageLayout>
  );
};

export default MenuLocal;
export const LazyMenuLocal = lazy(() => import("./MenuLocal"));
