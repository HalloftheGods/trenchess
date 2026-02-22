import React, { lazy } from "react";
import { Users, RefreshCcw, Swords } from "lucide-react";
import { useNavigate } from "react-router-dom";
import InteractiveGuide, {
  type Slide,
} from "@/app/routes/guides/components/templates/InteractiveGuide";
import { GuideListItem } from "@/app/routes/guides/components/molecules/GuideListItem";
import {
  MultiPlayerZonesGraphic,
  CtaTroopConversionGraphic,
} from "@/app/routes/guides/components/molecules/CtaGraphics";

interface CtaGuideProps {
  onBack: () => void;
}

const CtaGuide: React.FC<CtaGuideProps> = ({ onBack }) => {
  const slides: Slide[] = [
    {
      id: "multi",
      title: "A Global Conflict",
      subtitle: "Best Played with 4 Players",
      color: "blue",
      topLabel: "Multi-Commander",
      icon: Users,
      previewConfig: { mode: "4p" },
      description: (
        <ul className="space-y-4">
          <GuideListItem color="blue">
            Capture the Army is designed for games with more than 2 players,
            creating a dynamic web of alliances and betrayals.
          </GuideListItem>
          <GuideListItem color="blue">
            It shines brightest when 4 commanders take the field.
          </GuideListItem>
        </ul>
      ),
      sideContent: <MultiPlayerZonesGraphic />,
    },
    {
      id: "inheritance",
      title: "Army Assimilation",
      subtitle: "To the Victor Go the Spoils",
      color: "indigo",
      topLabel: "Inheritance",
      icon: RefreshCcw,
      previewConfig: { mode: "4p" },
      description: (
        <ul className="space-y-4">
          <GuideListItem color="indigo">
            When a player is checkmated, they are not simply eliminated from the
            board.
          </GuideListItem>
          <GuideListItem color="indigo">
            The player who delivered the final blow inherits all remaining
            pieces of the defeated army.
          </GuideListItem>
        </ul>
      ),
      sideContent: <CtaTroopConversionGraphic />,
    },
  ];

  const navigate = useNavigate();

  return (
    <InteractiveGuide
      title="Capture the Army"
      slides={slides}
      onBack={onBack}
      labelColor="blue"
      footerForward={{
        label: "Enter The Trenchess",
        onClick: () => navigate("/play"),
        icon: Swords,
      }}
    />
  );
};

export default CtaGuide;
export const LazyCtaGuide = lazy(() => import("./CtaGuide"));
