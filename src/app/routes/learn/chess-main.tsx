import React, { useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  ChessPawn,
  Trophy,
  Calculator,
  BicepsFlexed,
  Trees,
  Waves,
  Mountain,
  ChessKnight,
  RotateCcw,
  HeartCrack,
  Swords,
  Tornado,
} from "lucide-react";

import { useRouteContext } from "@/app/context/RouteContext";

// Shared Route Components
import RoutePageLayout from "@/app/routes/shared/components/templates/RoutePageLayout";
import RoutePageHeader from "@/app/routes/shared/components/organisms/RoutePageHeader";
import RoutePageFooter from "@/app/routes/shared/components/organisms/RoutePageFooter";
import RouteGrid from "@/app/routes/shared/components/templates/RouteGrid";
import RouteCard from "@/app/routes/shared/components/molecules/RouteCard";
import RouteDetailModal from "@/app/routes/shared/components/organisms/RouteDetailModal";
import ChessCardDetail from "@/app/routes/game/components/organisms/ChessCardDetail";
import {
  INITIAL_ARMY,
  PIECES,
  UNIT_DETAILS,
  unitColorMap,
} from "@engineConfigs/unitDetails";

export const LearnChessMainView: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { unitType } = useParams<{ unitType: string }>();
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

  const getCategoryForUnit = (type: string | undefined) => {
    if (!type) return null;
    if (CHESS_PIECES.includes(type as any)) return "chessmen";
    return null;
  };

  const [view, setView] = useState<"selection" | "chessmen">(() => {
    if (unitType) {
      return (getCategoryForUnit(unitType) as any) || "selection";
    }
    const state = location.state as { view?: "selection" | "chessmen" } | null;
    return state?.view || "selection";
  });

  const closeModal = () => {
    navigate("/learn/chess");
  };

  // Define the order of pieces based on current view
  const UNIT_ORDER = view === "chessmen" ? CHESS_PIECES : [];

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
  const chessIndex = UNIT_ORDER.indexOf(unitType as any);
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
        label={
          view === "chessmen"
            ? '"From the trench, the Chessmen grow stronger"'
            : '"The world cracks into 3, and with it, the Endgame."'
        }
        color={view === "chessmen" ? "blue" : "red"}
        onBackClick={() => {
          if (view !== "selection") {
            setView("selection");
          } else {
            navigate("/learn");
          }
        }}
      />

      {view === "selection" ? (
        <RouteGrid cols={2}>
          <RouteCard
            onClick={() => setView("chessmen")}
            onMouseEnter={() => setHoveredMenu("chess")}
            onMouseLeave={() => setHoveredMenu(null)}
            preview={{
              mode: "2p-ns",
              hideUnits: true,
            }}
            isSelected={false}
            darkMode={darkMode}
            title="The Chessmen"
            description='"From the trench, the Chessmen grow stronger"'
            Icon={ChessPawn}
            HoverIcon={BicepsFlexed}
            color="blue"
            className="h-full w-full py-12"
          />
          <RouteCard
            onClick={() => navigate("/learn/endgame")}
            onMouseEnter={() => setHoveredMenu("boardgame")}
            onMouseLeave={() => setHoveredMenu(null)}
            preview={{
              mode: "4p",
              hideUnits: true,
            }}
            isSelected={false}
            darkMode={darkMode}
            title="The Endgame"
            description='"The world cracks into 3, and with it, the Endgame."'
            Icon={HeartCrack}
            HoverIcon={Trophy}
            color="red"
            className="h-full w-full py-12"
          />
        </RouteGrid>
      ) : (
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
              | "slate"
              | "fuchsia" = "slate";

            let HoverIconComponent: any = unit.custom;

            if (type === PIECES.PAWN) {
              cardColor = "blue";
              HoverIconComponent = RotateCcw;
            } else if (type === PIECES.KNIGHT) {
              cardColor = "slate";
              HoverIconComponent = Mountain;
            } else if (type === PIECES.BISHOP) {
              cardColor = "red";
              HoverIconComponent = Trees;
            } else if (type === PIECES.ROOK) {
              cardColor = "amber";
              HoverIconComponent = Waves;
            } else if (type === PIECES.QUEEN) {
              cardColor = "emerald";
              HoverIconComponent = ChessKnight;
            } else if (type === PIECES.KING) {
              cardColor = "fuchsia";
              HoverIconComponent = Swords;
            }

            const previewMode = view === "chessmen" ? "2p-ns" : "4p";

            return (
              <RouteCard
                key={type}
                onClick={() => navigate(`/learn/chess/${type}`)}
                onMouseEnter={() => setHoveredMenu("chess")}
                onMouseLeave={() => setHoveredMenu(null)}
                preview={{
                  mode: previewMode,
                  hideUnits: true,
                }}
                isSelected={false}
                darkMode={darkMode}
                title={details?.title || displayNames[type]}
                description={details?.role || "Unit Details"}
                Icon={unit.lucide}
                HoverIcon={HoverIconComponent}
                color={cardColor}
                className="h-full w-full px-2 py-4"
              />
            );
          })}
        </RouteGrid>
      )}

      {view === "selection" && !unitType && (
        <RoutePageFooter
          onForwardClick={() => navigate("/learn/math")}
          forwardLabel="Be Mathematical"
          forwardIcon={Calculator}
          backIcon={Tornado}
          backLabel="Open the Trench"
          onBackClick={() => navigate("/learn/trench")}
        />
      )}

      {view === "chessmen" && !unitType && (
        <RoutePageFooter
          onBackClick={() => navigate("/learn/trench")}
          backLabel="Open the Trench"
          backIcon={Tornado}
          onForwardClick={() => navigate("/learn/endgame")}
          forwardLabel="The Endgame"
          forwardIcon={HeartCrack}
        />
      )}

      <RouteDetailModal
        isOpen={!!unitType}
        onClose={closeModal}
        darkMode={darkMode}
        color={
          unitType === PIECES.QUEEN
            ? "emerald"
            : unitType === PIECES.KING
              ? "fuchsia"
              : unitType === PIECES.BISHOP
                ? "red"
                : unitType === PIECES.ROOK
                  ? "amber"
                  : unitType === PIECES.PAWN
                    ? "blue"
                    : "slate"
        }
        prev={
          prevUnit
            ? {
                icon: prevUnit.lucide,
                label:
                  UNIT_DETAILS[prevUnit.type]?.title ||
                  displayNames[prevUnit.type],
                onClick: () => navigate(`/learn/chess/${prevUnit.type}`),
                className: unitColorMap[prevUnit.type].text,
              }
            : undefined
        }
        next={
          nextUnit
            ? {
                icon: nextUnit.lucide,
                label:
                  UNIT_DETAILS[nextUnit.type]?.title ||
                  displayNames[nextUnit.type],
                onClick: () => navigate(`/learn/chess/${nextUnit.type}`),
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

export default LearnChessMainView;
