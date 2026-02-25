import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Baby,
  BookOpen,
  Shell,
  Trees,
  Wand2,
  ShieldCheck,
  BrickWallShield,
  Wand,
  Pencil,
  Medal,
  Shovel,
} from "lucide-react";
import { useRouteContext } from "@/route.context";
import {
  DualToneSwords,
  DualToneSwordsFlipped,
} from "@/shared/components/atoms/RouteIcons";

// Shared Route Components
import RoutePageLayout from "@/shared/components/templates/RoutePageLayout";
import RoutePageHeader from "@/shared/components/organisms/RoutePageHeader";
import RouteGrid from "@/shared/components/templates/RouteGrid";
import RouteCard from "@/shared/components/molecules/RouteCard";
import TrenchessText from "@/shared/components/atoms/TrenchessText";

export const HomeView: React.FC = () => {
  const navigate = useNavigate();
  const {
    darkMode,
    setHoveredMenu,
    setTerrainSeed,
    onZenGarden,
    onGamemaster,
  } = useRouteContext();

  return (
    <RoutePageLayout>
      <RoutePageHeader label="Main Menu" />

      <RouteGrid cols={3} className="px-4">
        <RouteCard
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
          HoverIcon={BookOpen}
          color="slate"
          className="h-full w-full"
        />
        <RouteCard
          onClick={() => navigate("/play")}
          onMouseEnter={() => setHoveredMenu("play-menu")}
          onMouseLeave={() => setHoveredMenu(null)}
          preview={{
            mode: "2p-ns",
            hideUnits: true,
          }}
          isSelected={false}
          darkMode={darkMode}
          title="Play Trenchess"
          titleNode={
            <>
              Play <TrenchessText />
            </>
          }
          description="Master the Elements"
          Icon={DualToneSwords}
          HoverIcon={DualToneSwordsFlipped}
          color="red"
          className="h-full w-full"
        />
        <RouteCard
          onClick={() => onZenGarden?.()}
          onMouseEnter={() => setHoveredMenu("create")}
          onMouseLeave={() => setHoveredMenu(null)}
          preview={{
            mode: "4p",
            protocol: "zen-garden",
            showIcons: true,
            hideUnits: true,
          }}
          isSelected={false}
          darkMode={darkMode}
          title="Lay Trenchess"
          description="Contribute to the Labyrinth Gardens"
          Icon={Shovel}
          HoverIcon={BrickWallShield}
          color="emerald"
          className="h-full w-full"
        />
      </RouteGrid>
    </RoutePageLayout>
  );
};

export default HomeView;
