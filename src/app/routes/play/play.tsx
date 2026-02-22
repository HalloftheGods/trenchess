import React from "react";
import { useNavigate } from "react-router-dom";
import { Sofa, GamepadDirectional, Joystick, PartyPopper } from "lucide-react";
import { useRouteContext } from "@/app/context/RouteContext";

// Shared Route Components
import RoutePageLayout from "@/app/routes/shared/components/templates/RoutePageLayout";
import RoutePageHeader from "@/app/routes/shared/components/organisms/RoutePageHeader";
import RouteGrid from "@/app/routes/shared/components/templates/RouteGrid";
import RouteCard from "@/app/routes/shared/components/molecules/RouteCard";
import HeaderLobby from "@/app/routes/game/components/organisms/HeaderLobby";

export const PlayView: React.FC = () => {
  const navigate = useNavigate();
  const { setHoveredMenu, darkMode, multiplayer } = useRouteContext();

  return (
    <RoutePageLayout>
      <RoutePageHeader
        label='"And so it begins..."'
        onBackClick={() => navigate("/")}
      />

      <RouteGrid cols={3} className="px-4">
        <RouteCard
          onClick={() => navigate("/play/setup?mode=practice&players=1")}
          onMouseEnter={() => setHoveredMenu("practice")}
          onMouseLeave={() => setHoveredMenu(null)}
          preview={{
            mode: "4p",
            protocol: "classic",
          }}
          isSelected={false}
          darkMode={darkMode}
          title="Master's Practice"
          description='"Fools become Masters." (A.I. Play)'
          Icon={Joystick}
          HoverIcon={GamepadDirectional}
          color="slate"
          className="h-full w-full"
        />
        <RouteCard
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
          HoverIcon={PartyPopper}
          color="red"
          className="h-full w-full"
        />
        <HeaderLobby
          multiplayer={multiplayer}
          onClick={() => navigate("/play/lobby")}
          onMouseEnter={() => setHoveredMenu("worldwide")}
          onMouseLeave={() => setHoveredMenu(null)}
        />
      </RouteGrid>
    </RoutePageLayout>
  );
};

export default PlayView;
