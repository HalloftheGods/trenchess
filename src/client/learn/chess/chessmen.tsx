import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Tornado,
  Rabbit,
  ChessKing,
  VenetianMask,
  Castle,
  SunMoon,
  TreePine,
} from "lucide-react";
import type { PieceType } from "@/shared/types/game";

import { useRouteContext } from "@/route.context";

// Shared Route Components
import RoutePageLayout from "@/shared/components/templates/RoutePageLayout";
import RoutePageHeader from "@/shared/components/organisms/RoutePageHeader";
import RoutePageFooter from "@/shared/components/organisms/RoutePageFooter";
import RouteGrid from "@/shared/components/templates/RouteGrid";
import RouteCard from "@/shared/components/molecules/RouteCard";
import RouteDetailModal from "@/shared/components/organisms/RouteDetailModal";
import ChessCardDetail from "@/client/game/shared/components/organisms/ChessCardDetail";
import { INITIAL_ARMY, PIECES, UNIT_DETAILS, unitColorMap } from "@/constants";
import { DualToneSwordsFlipped } from "@/shared/components";

export const LearnChessmenView: React.FC = () => {
  const navigate = useNavigate();
  const { unitType } = useParams<{ unitType: string }>();
  const { setHoveredMenu, darkMode, getIcon } = useRouteContext();

  // Define piece groups
  const CHESS_PIECES = [
    PIECES.PAWN, // Pawn
    PIECES.KNIGHT, // Knight
    PIECES.BISHOP, // Bishop
    PIECES.ROOK, // Rook
    PIECES.QUEEN, // Queen
    PIECES.KING, // King
  ];

  const closeModal = () => {
    navigate("/learn/chess/chessmen");
  };

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

  // Navigation Logic
  const chessIndex = UNIT_ORDER.indexOf(unitType as PieceType);
  const prevUnitType =
    chessIndex !== -1
      ? UNIT_ORDER[(chessIndex - 1 + UNIT_ORDER.length) % UNIT_ORDER.length]
      : null;
  const nextUnitType =
    chessIndex !== -1 ? UNIT_ORDER[(chessIndex + 1) % UNIT_ORDER.length] : null;

  const prevUnit = INITIAL_ARMY.find((u) => u.type === prevUnitType);
  const nextUnit = INITIAL_ARMY.find((u) => u.type === nextUnitType);

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
            HoverIconComponent = TreePine;
          } else if (type === PIECES.ROOK) {
            cardColor = "amber";
            HoverIconComponent = Castle;
          } else if (type === PIECES.QUEEN) {
            cardColor = "purple";
            HoverIconComponent = SunMoon;
          } else if (type === PIECES.KING) {
            cardColor = "red";
            HoverIconComponent = DualToneSwordsFlipped;
          }

          return (
            <RouteCard
              key={type}
              onClick={() => navigate(`/learn/chess/chessmen/${type}`)}
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

      {!unitType && (
        <RoutePageFooter
          onBackClick={() => navigate("/learn/trench")}
          backLabel="Open the Trench"
          backIcon={Tornado}
          onForwardClick={() => navigate("/learn/endgame")}
          forwardLabel="The Endgame"
          forwardIcon={ChessKing}
        />
      )}

      <RouteDetailModal
        isOpen={!!unitType}
        onClose={closeModal}
        darkMode={darkMode}
        color={
          unitType === PIECES.QUEEN
            ? "purple"
            : unitType === PIECES.KING
              ? "red"
              : unitType === PIECES.BISHOP
                ? "emerald"
                : unitType === PIECES.ROOK
                  ? "amber"
                  : unitType === PIECES.PAWN
                    ? "blue"
                    : "slate"
        }
        prev={
          prevUnit
            ? {
                icon: (props: { className?: string; size?: number }) =>
                  getIcon(prevUnit, props.className, props.size),
                label:
                  UNIT_DETAILS[prevUnit.type]?.title ||
                  displayNames[prevUnit.type],
                onClick: () =>
                  navigate(`/learn/chess/chessmen/${prevUnit.type}`),
                className: unitColorMap[prevUnit.type].text,
              }
            : undefined
        }
        next={
          nextUnit
            ? {
                icon: (props: { className?: string; size?: number }) =>
                  getIcon(nextUnit, props.className, props.size),
                label:
                  UNIT_DETAILS[nextUnit.type]?.title ||
                  displayNames[nextUnit.type],
                onClick: () =>
                  navigate(`/learn/chess/chessmen/${nextUnit.type}`),
                className: unitColorMap[nextUnit.type].text,
              }
            : undefined
        }
      >
        {unitType && (
          <ChessCardDetail unitType={unitType} darkMode={darkMode} />
        )}
      </RouteDetailModal>
    </RoutePageLayout>
  );
};

export default LearnChessmenView;
