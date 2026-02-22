import React, { lazy } from "react";
import { useNavigate } from "react-router-dom";
import { Baby } from "lucide-react";
import { useMenuContext } from "@/app/context/MenuContext";
import { DualToneSwords } from "@/app/routes/menu/components/atoms/MenuIcons";

// Atomic Components
import MenuPageLayout from "@/app/routes/menu/components/templates/MenuPageLayout";
import MenuPageHeader from "@/app/routes/menu/components/organisms/MenuPageHeader";
import MenuGrid from "@/app/routes/menu/components/templates/MenuGrid";
import MenuCard from "@/app/routes/menu/components/molecules/MenuCard";
import TrenchessText from "@/shared/components/atoms/TrenchessText";

const MenuHome: React.FC = () => {
  const navigate = useNavigate();
  const { darkMode, setHoveredMenu, setTerrainSeed } = useMenuContext();

  return (
    <MenuPageLayout>
      <MenuPageHeader label="Main Menu" />

      <MenuGrid cols={2} className="px-4">
        <MenuCard
          onClick={() => navigate("/learn")}
          onMouseEnter={() => {
            setHoveredMenu("how-to-play");
            setTerrainSeed(Math.random());
          }}
          onMouseLeave={() => setHoveredMenu(null)}
          preview={{
            mode: null,
            protocol: "terrainiffic",
            showIcons: true,
            hideUnits: true,
          }}
          isSelected={false}
          darkMode={darkMode}
          title="How to Play"
          description="Learn the Basics"
          Icon={Baby}
          color="slate"
          className="h-full w-full"
        />
        <MenuCard
          onClick={() => navigate("/play")}
          onMouseEnter={() => setHoveredMenu("play-menu")}
          onMouseLeave={() => setHoveredMenu(null)}
          preview={{
            mode: "2p-ns",
            hideUnits: true,
          }}
          isSelected={false}
          darkMode={darkMode}
          title="Enter The Trenchess"
          titleNode={
            <>
              Enter the <TrenchessText />
            </>
          }
          description='"Master its Wisdom"'
          Icon={DualToneSwords}
          color="red"
          className="h-full w-full"
        />
      </MenuGrid>
    </MenuPageLayout>
  );
};

export default MenuHome;
export const LazyMenuHome = lazy(() => import("./MenuHome"));
