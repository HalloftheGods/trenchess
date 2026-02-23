import React from "react";
import { useNavigate } from "react-router-dom";
import { Zap, RouteOff, RouteIcon, Sword, ShieldPlus } from "lucide-react";
import { useRouteContext } from "@/app/context/RouteContext";

// Shared Route Components
import RoutePageLayout from "@/app/routes/shared/components/templates/RoutePageLayout";
import RoutePageHeader from "@/app/routes/shared/components/organisms/RoutePageHeader";
import RouteGrid from "@/app/routes/shared/components/templates/RouteGrid";
import RouteCard from "@/app/routes/shared/components/molecules/RouteCard";
import RoutePageFooter from "@/app/routes/shared/components/organisms/RoutePageFooter";

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
        backLabel="Claim the Chess"
        backIcon={Zap}
      />
    </RoutePageLayout>
  );
};

export default LearnMathMainView;
