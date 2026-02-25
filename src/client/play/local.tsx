import React from "react";
import { useNavigate } from "react-router-dom";
import { Bot, User, Users, UserPlus } from "lucide-react";
import { useRouteContext } from "@context";
import { ROUTES } from "@constants/routes";

// Shared Route Components
import RoutePageLayout from "@/shared/components/templates/RoutePageLayout";
import RoutePageHeader from "@/shared/components/organisms/RoutePageHeader";
import RouteGrid from "@/shared/components/templates/RouteGrid";
import RouteCard from "@/shared/components/molecules/RouteCard";

export const PlayLocalView: React.FC = () => {
  const navigate = useNavigate();
  const { setHoveredMenu, darkMode } = useRouteContext();

  return (
    <RoutePageLayout>
      <RoutePageHeader
        label="Locals Gather - Songs are sung"
        color="amber"
        backLabel="Play"
        onBackClick={() => navigate("/play")}
      />

      <RouteGrid cols={4}>
        <RouteCard
          onClick={() => navigate(ROUTES.PLAY_SETUP.build({ playMode: "practice", players: "1", step: "1" }))}
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
        <RouteCard
          onClick={() => navigate(ROUTES.PLAY_SETUP.build({ playMode: "couch", players: "2", step: "1" }))}
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
        <RouteCard
          onClick={() => navigate(ROUTES.PLAY_SETUP.build({ playMode: "couch", players: "3", step: "1" }))}
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
        <RouteCard
          onClick={() => navigate(ROUTES.PLAY_SETUP.build({ playMode: "couch", players: "4", step: "1" }))}
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
      </RouteGrid>
    </RoutePageLayout>
  );
};

export default PlayLocalView;
