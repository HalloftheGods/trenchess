import React from "react";
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

import {
  DualToneSwords,
  DualToneSwordsFlipped,
  RoutePageLayout,
  RoutePageHeader,
  RouteGrid,
  RouteCard,
  TrenchessText,
} from "@shared";

interface MenuScreenProps {
  darkMode: boolean;
  onNavigate: (path: string) => void;
  onHoverMenu: (menu: string | null) => void;
  onSetTerrainSeed: () => void;
  onZenGarden?: () => void;
}

export const MenuScreen: React.FC<MenuScreenProps> = ({
  darkMode,
  onNavigate,
  onHoverMenu,
  onSetTerrainSeed,
  onZenGarden,
}) => {
  return (
    <RoutePageLayout>
      <RoutePageHeader label="Main Menu" />

      <RouteGrid cols={3} className="px-0">
        <RouteCard
          onClick={() => onNavigate("/learn")}
          onMouseEnter={() => {
            onHoverMenu("how-to-play");
            onSetTerrainSeed();
          }}
          onMouseLeave={() => onHoverMenu(null)}
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
          onClick={() => onNavigate("/play")}
          onMouseEnter={() => onHoverMenu("play-menu")}
          onMouseLeave={() => onHoverMenu(null)}
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
          onMouseEnter={() => onHoverMenu("create")}
          onMouseLeave={() => onHoverMenu(null)}
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
        <RouteCard
          onClick={() => onNavigate("/scoreboard")}
          onMouseEnter={() => onHoverMenu("leaderboard")}
          onMouseLeave={() => onHoverMenu(null)}
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
          onClick={() => onNavigate("/rules")}
          onMouseEnter={() => onHoverMenu("rules")}
          onMouseLeave={() => onHoverMenu(null)}
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
          onClick={() => onNavigate("/stats")}
          onMouseEnter={() => onHoverMenu("stats")}
          onMouseLeave={() => onHoverMenu(null)}
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

export default MenuScreen;
