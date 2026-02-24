import React from "react";
import { useNavigate } from "react-router-dom";
import { EyeOff, LayoutGrid, ShieldAlert, Swords } from "lucide-react";
import InteractiveGuide, {
  type Slide,
} from "@/shared/components/templates/InteractiveGuide";

// Shared Route Components
import { GuideListItem } from "@/shared/components/molecules/GuideListItem";

interface CtkGuideProps {
  onBack: () => void;
  // Others are ignored as we get them from MenuContext inside InteractiveGuide/MenuLayout.
}

export const LearnEndgameCtkView: React.FC<CtkGuideProps> = ({ onBack }) => {
  const slides: Slide[] = [
    {
      id: "board",
      title: "Capture the King",
      subtitle: "12x12 Grid vs 8x8",
      color: "red",
      topLabel: "On a much larger scale",
      icon: LayoutGrid,
      previewConfig: {
        mode: null,
        hideUnits: true,
        highlightOuterSquares: true,
        label: "Capture the King",
      },
      sideContent: (
        <div className="flex flex-col items-center w-full max-w-2xl">
          <ul className="space-y-4">
            <GuideListItem color="red">
              Trenchess is played on a 12x12 grid vs classic 8x8.
            </GuideListItem>
            <GuideListItem color="red">
              This provides more room for tactical maneuvering, unit
              deployments, and terrain integration.
            </GuideListItem>
          </ul>
        </div>
      ),
    },
    {
      id: "deployment",
      title: "Hidden Setup",
      subtitle: "The Static Formation is Lifted",
      color: "slate",
      topLabel: "Deployment Phase",
      icon: EyeOff,
      previewConfig: {
        mode: null,
        protocol: "classic",
        hideUnits: false,
        label: "Capture the King",
      },
      sideContent: (
        <div className="flex flex-col items-center w-full max-w-2xl">
          <ul className="space-y-6">
            <GuideListItem color="slate">
              <strong className="text-slate-800 dark:text-slate-100 block mb-1 uppercase tracking-widest text-xs font-black">
                Custom Formations
              </strong>
              <p>
                Classic formation is encouraged for beginners, but advanced
                players can set up their board however they like pregame.
              </p>
            </GuideListItem>
            <GuideListItem color="slate">
              <strong className="text-slate-800 dark:text-slate-100 block mb-1 uppercase tracking-widest text-xs font-black">
                Fog of War Prep
              </strong>
              <p>
                Similar to Battleship, you cannot see the opposing player's
                strategy or deployment before the game officially commences.
              </p>
            </GuideListItem>
          </ul>
        </div>
      ),
    },
    {
      id: "win",
      title: "Checkmate",
      subtitle: "The King Must Fall",
      color: "amber",
      topLabel: "Base Win Condition",
      icon: ShieldAlert,
      previewConfig: {
        mode: null,
        protocol: "classic",
        hideUnits: false,
        label: "Capture the King",
      },
      sideContent: (
        <div className="flex flex-col items-center w-full max-w-2xl">
          <ul className="space-y-4">
            <GuideListItem color="amber">
              At its core, all games of 'Capture the King' rely on the base
              rules of Checkmate.
            </GuideListItem>
            <GuideListItem color="amber">
              Trap the opposing player's King so that it has no valid moves
              left to escape an attack.
            </GuideListItem>
          </ul>
        </div>
      ),
    },
  ];

  const navigate = useNavigate();

  return (
    <InteractiveGuide
      title="Capture the King"
      slides={slides}
      onBack={onBack}
      labelColor="red"
      footerForward={{
        label: "Enter The Trenchess",
        onClick: () => navigate("/play"),
        icon: Swords,
      }}
    />
  );
};

export default LearnEndgameCtkView;
