import React, { useMemo } from "react";
import { Earth, Crown, Replace, Swords } from "lucide-react";
import { useNavigate } from "react-router-dom";
import InteractiveGuide, {
  type Slide,
} from "@/shared/components/templates/InteractiveGuide";
import { DEFAULT_SEEDS } from "@/core/data/defaultSeeds";

// Shared Route Components
import { GuideListItem } from "@/shared/components/molecules/GuideListItem";
import {
  CornerStartingPositionsGraphic,
  TransContinentalGraphic,
  TroopConversionGraphic,
} from "@/shared/components/molecules/CtwGraphics";

interface CaptureTheWorldGuideProps {
  onBack: () => void;
}

export const LearnEndgameCtwView: React.FC<CaptureTheWorldGuideProps> = ({
  onBack,
}) => {
  const randomSeed = useMemo(() => {
    const seeds = DEFAULT_SEEDS;
    if (seeds.length === 0) return undefined;
    const idx = Math.floor(Math.random() * seeds.length);
    return seeds[idx]?.seed;
  }, []);

  const customPreviewConfig = useMemo(() => {
    return {
      mode: "2v2",
      protocol: "terrainiffic",
      customSeed: randomSeed,
      showIcons: true,
      hideUnits: false,
    };
  }, [randomSeed]);

  const slides: Slide[] = [
    {
      id: "pregame",
      title: "Strategic Origin",
      subtitle: "King Starts in the Corner",
      color: "amber",
      topLabel: "Pregame Setup",
      icon: Crown,
      previewConfig: customPreviewConfig as any,
      description: (
        <ul className="space-y-4">
          <GuideListItem color="amber">
            The King is the only piece that has a strict starting location. All
            Kings must begin in the absolute corner of their starting zone.
          </GuideListItem>
          <GuideListItem color="amber">
            This forces a perilous journey across the world.
          </GuideListItem>
        </ul>
      ),
      sideContent: <CornerStartingPositionsGraphic />,
    },
    {
      id: "win",
      title: "Race Across the World",
      subtitle: "Avoid Checkmate & Reach the Goal",
      color: "emerald",
      topLabel: "Win Conditions",
      icon: Earth,
      previewConfig: customPreviewConfig as any,
      description: (
        <ul className="space-y-6">
          <GuideListItem color="emerald">
            <strong className="text-slate-800 dark:text-slate-100 block mb-1 uppercase tracking-widest text-xs font-black">
              The Objective
            </strong>
            <p>
              Make it to the square opposite your king's starting tile color.
              Landing there achieves world domination.
            </p>
          </GuideListItem>
          <GuideListItem color="emerald">
            <strong className="text-slate-800 dark:text-slate-100 block mb-1 uppercase tracking-widest text-xs font-black">
              2v2 Protocol
            </strong>
            <p>
              In a team match, BOTH kings must make it to their respective
              opposing corners to secure the victory.
            </p>
          </GuideListItem>
        </ul>
      ),
      sideContent: <TransContinentalGraphic />,
    },
    {
      id: "threat",
      title: "Rules of Succession",
      subtitle: "Checkmate Still Applies",
      color: "indigo",
      topLabel: "Army Assimilation",
      icon: Replace,
      previewConfig: customPreviewConfig as any,
      description: (
        <ul className="space-y-4">
          <GuideListItem color="indigo">
            Just like in Capture the Army, avoiding checkmate is crucial.
          </GuideListItem>
          <GuideListItem color="indigo">
            If your king is cornered, the victorious player inherits your entire
            remaining army. The world is cruel.
          </GuideListItem>
        </ul>
      ),
      sideContent: <TroopConversionGraphic />,
    },
  ];

  const navigate = useNavigate();

  return (
    <InteractiveGuide
      title="Capture the World"
      slides={slides}
      onBack={onBack}
      labelColor="emerald"
      footerForward={{
        label: "Enter The Trenchess",
        onClick: () => navigate("/play"),
        icon: Swords,
      }}
    />
  );
};

export default LearnEndgameCtwView;
