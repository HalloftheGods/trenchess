import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Tornado,
  Rabbit,
  ChessKing,
  VenetianMask,
  Castle,
  SunMoon,
  Flashlight,
  Orbit,
} from "lucide-react";

import { useRouteContext } from "@context";

// Shared Route Components
import RoutePageLayout from "@/shared/components/templates/RoutePageLayout";
import RoutePageHeader from "@/shared/components/organisms/RoutePageHeader";
import RoutePageFooter from "@/shared/components/organisms/RoutePageFooter";
import RouteGrid from "@/shared/components/templates/RouteGrid";
import RouteCard from "@/shared/components/molecules/RouteCard";
import { INITIAL_ARMY, PIECES, UNIT_DETAILS } from "@constants";
import { analytics } from "@/shared/utils/analytics";

export const LearnChessmenView: React.FC = () => {
  const navigate = useNavigate();
  const { setHoveredMenu, darkMode } = useRouteContext();

  // Define piece groups
  const CHESS_PIECES = [
    PIECES.PAWN, // Pawn
    PIECES.KNIGHT, // Knight
    PIECES.BISHOP, // Bishop
    PIECES.ROOK, // Rook
    PIECES.QUEEN, // Queen
    PIECES.KING, // King
  ];

  const UNIT_ORDER = CHESS_PIECES;

  // Map piece types to clean display names
  const displayNames: Record<string, string> = {
    [PIECES.PAWN]: "Pawn",
    [PIECES.KNIGHT]: "Knight",
    [PIECES.BISHOP]: "Bishop",
    [PIECES.ROOK]: "Rook",
    [PIECES.QUEEN]: "Queen",
    [PIECES.KING]: "King",
  };

  return (
    <RoutePageLayout>
      <RoutePageHeader
        label='"From the trench, the Chessmen grow stronger"'
        color="blue"
        onBackClick={() => navigate("/learn/chess")}
      />

      <RouteGrid cols={3}>
        {UNIT_ORDER.map((type) => {
          const unit = INITIAL_ARMY.find((u) => u.type === type);
          if (!unit) return null;

          const details = UNIT_DETAILS[type];

          let cardColor:
            | "red"
            | "blue"
            | "emerald"
            | "amber"
            | "orange"
            | "purple"
            | "slate" = "slate";

          let HoverIconComponent: React.ElementType = unit.custom;

          if (type === PIECES.PAWN) {
            cardColor = "blue";
            HoverIconComponent = Rabbit;
          } else if (type === PIECES.KNIGHT) {
            cardColor = "slate";
            HoverIconComponent = VenetianMask;
          } else if (type === PIECES.BISHOP) {
            cardColor = "emerald";
            HoverIconComponent = Flashlight;
          } else if (type === PIECES.ROOK) {
            cardColor = "amber";
            HoverIconComponent = Castle;
          } else if (type === PIECES.QUEEN) {
            cardColor = "purple";
            HoverIconComponent = SunMoon;
          } else if (type === PIECES.KING) {
            cardColor = "red";
            // HoverIconComponent = DualToneSwordsFlipped;
            HoverIconComponent = Orbit;
          }

          return (
            <RouteCard
              key={type}
              onClick={() => {
                analytics.trackEvent("Learn", "Explore Unit", type);
                navigate(`/learn/chess/chessmen/${type}`);
              }}
              onMouseEnter={() => setHoveredMenu("chess")}
              onMouseLeave={() => setHoveredMenu(null)}
              preview={{
                mode: "2p-ns",
                hideUnits: true,
              }}
              isSelected={false}
              darkMode={darkMode}
              title={details?.title || displayNames[type]}
              description={details?.role || "Unit Details"}
              unit={unit}
              HoverIcon={HoverIconComponent}
              color={cardColor}
              className="h-full w-full px-2 py-4"
            />
          );
        })}
      </RouteGrid>

      <RoutePageFooter
        onBackClick={() => navigate("/learn/trench")}
        backLabel="Open the Trench"
        backIcon={Tornado}
        onForwardClick={() => navigate("/learn/endgame")}
        forwardLabel="The Endgame"
        forwardIcon={ChessKing}
      />
    </RoutePageLayout>
  );
};

export default LearnChessmenView;
