import React from "react";
import { useNavigate } from "react-router-dom";
import { RouteOff, RouteIcon, Sword, ShieldPlus, Waves } from "lucide-react";
import { useRouteContext } from "@context";

// Shared Route Components
import RoutePageLayout from "@/shared/components/templates/RoutePageLayout";
import RoutePageHeader from "@/shared/components/organisms/RoutePageHeader";
import RouteGrid from "@/shared/components/templates/RouteGrid";
import RouteCard from "@/shared/components/molecules/RouteCard";
import RoutePageFooter from "@/shared/components/organisms/RoutePageFooter";

export const LearnMathMainView: React.FC = () => {
  const navigate = useNavigate();
  const { setHoveredMenu, darkMode } = useRouteContext();

  return (
    <RoutePageLayout>
      <RoutePageHeader
        label='"...and so, a rise in Precision Calculation."'
        color="emerald"
        onBackClick={() => navigate("/learn")}
      />

      <RouteGrid cols={2}>
        <RouteCard
          onClick={() => navigate("/tutorial")}
          onMouseEnter={() => setHoveredMenu("how-to-play")}
          onMouseLeave={() => setHoveredMenu(null)}
          preview={{
            mode: "2p-ns",
            hideUnits: true,
          }}
          isSelected={false}
          darkMode={darkMode}
          title="Interactive Guide"
          description='"Visual Learning & Simulation"'
          Icon={RouteIcon}
          HoverIcon={RouteOff}
          color="emerald"
          className="h-full w-full py-12"
        />

        <RouteCard
          onClick={() => navigate("/stats")}
          onMouseEnter={() => setHoveredMenu(null)}
          onMouseLeave={() => setHoveredMenu(null)}
          preview={{
            mode: "2p-ns",
            hideUnits: true,
          }}
          isSelected={false}
          darkMode={darkMode}
          title="Combat Stats"
          description='"Unit Threat Analysis"'
          Icon={Sword}
          HoverIcon={ShieldPlus}
          color="slate"
          className="h-full w-full py-12"
        />
      </RouteGrid>

      <RoutePageFooter
        onBackClick={() => navigate("/learn/chess")}
        backLabel="Face the Chess"
        backIcon={Waves}
      />
    </RoutePageLayout>
  );
};

export default LearnMathMainView;
