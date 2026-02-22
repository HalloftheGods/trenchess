import React, { lazy } from "react";
import { useNavigate } from "react-router-dom";
import { Calculator, Shovel, Wind } from "lucide-react";
import { useMenuContext } from "@/app/context/MenuContext";

// Atomic Components
import MenuPageLayout from "@/app/routes/menu/components/templates/MenuPageLayout";
import MenuPageHeader from "@/app/routes/menu/components/organisms/MenuPageHeader";
import MenuGrid from "@/app/routes/menu/components/templates/MenuGrid";
import MenuCard from "@/app/routes/menu/components/molecules/MenuCard";

const MenuLearn: React.FC = () => {
  const navigate = useNavigate();
  const { setHoveredMenu, setTerrainSeed, darkMode } = useMenuContext();

  return (
    <MenuPageLayout>
      <MenuPageHeader
        label='"There&apos;s a Prophecy on the wind..."'
        onBackClick={() => navigate("/")}
      />

      <MenuGrid cols={3}>
        <MenuCard
          onClick={() => navigate("/learn/trench")}
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
          title="Open The Trench"
          description='"One day the Trench opens..."'
          Icon={Wind}
          color="red"
          className="h-full w-full"
        />
        <MenuCard
          onClick={() => navigate("/learn/chess")}
          onMouseEnter={() => setHoveredMenu("chess")}
          onMouseLeave={() => setHoveredMenu(null)}
          preview={{
            mode: "2p-ns",
            protocol: "classic",
            hideUnits: false,
          }}
          isSelected={false}
          darkMode={darkMode}
          title="Close the Cracks"
          description='"...the Chessmen march to close them..."'
          Icon={Shovel}
          color="blue"
          className="h-full w-full"
        />

        {/* Do the math */}
        <MenuCard
          onClick={() => navigate("/tutorial")}
          onMouseEnter={() => setHoveredMenu("chess")}
          onMouseLeave={() => setHoveredMenu(null)}
          preview={{
            mode: "2p-ns",
            protocol: "classic",
            hideUnits: false,
          }}
          isSelected={false}
          darkMode={darkMode}
          title="The Math"
          description='" ...using Precision Calculation."'
          Icon={Calculator}
          color="emerald"
          className="h-full w-full"
        />
      </MenuGrid>
    </MenuPageLayout>
  );
};

export default MenuLearn;
export const LazyMenuLearn = lazy(() => import("./MenuLearn"));
