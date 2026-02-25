import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Baby,
  BookOpen,
  BrickWallShield,
  Shovel,
  Trophy,
  ScrollText,
  Gamepad2,
  ChartArea,
  ChartBar,
  Apple,
} from "lucide-react";
import { useRouteContext } from "@context";
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
  const { darkMode, setHoveredMenu, setTerrainSeed, onZenGarden } =
    useRouteContext();

  return (
    <RoutePageLayout>
      <RoutePageHeader label="Main Menu" />

      <RouteGrid cols={3} className="px-0">
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
          title="Hello Trenchess"
          description="Understand the Fundementals and Prophecy."
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
          title="The Battlefield"
          titleNode={
            <>
              Play <TrenchessText />
            </>
          }
          description="Master a whole new way to play chess."
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
          description="Share your setup with the community."
          Icon={Shovel}
          HoverIcon={BrickWallShield}
          color="emerald"
          className="h-full w-full"
        />
        {/* New Links */}
        <RouteCard
          onClick={() => navigate("/scoreboard")}
          onMouseEnter={() => setHoveredMenu("leaderboard")}
          onMouseLeave={() => setHoveredMenu(null)}
          preview={{
            label: "LEADERBOARD",
            highlightOuterSquares: true,
          }}
          isSelected={false}
          darkMode={darkMode}
          title="Lead Trenchess"
          description="Get in the game!"
          Icon={Trophy}
          HoverIcon={Gamepad2}
          color="amber"
          className="h-full w-full"
        />

        <RouteCard
          onClick={() => navigate("/rules")}
          onMouseEnter={() => setHoveredMenu("rules")}
          onMouseLeave={() => setHoveredMenu(null)}
          preview={{
            mode: "2v2",
            hideUnits: false,
          }}
          isSelected={false}
          darkMode={darkMode}
          title="Educate Trenchess"
          description="Go! Spread the good word of Trenchess."
          Icon={ScrollText}
          HoverIcon={Apple}
          color="blue"
          className="h-full w-full"
        />

        <RouteCard
          onClick={() => navigate("/stats")}
          onMouseEnter={() => setHoveredMenu("stats")}
          onMouseLeave={() => setHoveredMenu(null)}
          preview={{
            mode: "4p",
            hideUnits: false,
          }}
          isSelected={false}
          darkMode={darkMode}
          title="Study Trenchess"
          description="Numbers for the hungry nerds to crunch on."
          Icon={ChartArea}
          HoverIcon={ChartBar}
          color="purple"
          className="h-full w-full"
        />
      </RouteGrid>
    </RoutePageLayout>
  );
};

export default HomeView;
