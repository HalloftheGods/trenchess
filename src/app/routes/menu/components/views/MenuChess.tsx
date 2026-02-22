import React, { lazy, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { ChessPawn, Trophy, Rainbow } from "lucide-react";

import MenuPageLayout from "@/app/routes/menu/components/templates/MenuPageLayout";
import MenuPageHeader from "@/app/routes/menu/components/organisms/MenuPageHeader";
import MenuPageFooter from "@/app/routes/menu/components/organisms/MenuPageFooter";
import MenuGrid from "@/app/routes/menu/components/templates/MenuGrid";
import MenuCard from "@/app/routes/menu/components/molecules/MenuCard";
import MenuDetailModal from "@/app/routes/menu/components/organisms/MenuDetailModal";
import ChessCardDetail from "@/app/routes/game/components/molecules/ChessCardDetail";
import { useMenuContext } from "@/app/context/MenuContext";
import {
  INITIAL_ARMY,
  PIECES,
  UNIT_DETAILS,
  unitColorMap,
} from "@engineConfigs/unitDetails";

const MenuChess: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { unitType } = useParams<{ unitType: string }>();
  const { setHoveredMenu, darkMode } = useMenuContext();

  // Define piece groups
  const CHESS_PIECES = [
    PIECES.BOT, // Pawn
    PIECES.HORSEMAN, // Knight
    PIECES.SNIPER, // Bishop
    PIECES.TANK, // Rook
    PIECES.BATTLEKNIGHT, // Queen
    PIECES.COMMANDER, // King
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
    [PIECES.BOT]: "Pawn",
    [PIECES.HORSEMAN]: "Knight",
    [PIECES.SNIPER]: "Bishop",
    [PIECES.TANK]: "Rook",
    [PIECES.BATTLEKNIGHT]: "Queen",
    [PIECES.COMMANDER]: "King",
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
    <MenuPageLayout>
      <MenuPageHeader
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
        <MenuGrid cols={2}>
          <MenuCard
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
            color="blue"
            className="h-full w-full py-12"
          />
          <MenuCard
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
            Icon={Trophy}
            color="red"
            className="h-full w-full py-12"
          />
        </MenuGrid>
      ) : (
        <MenuGrid cols={3}>
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

            if (type === PIECES.BOT) cardColor = "blue";
            else if (type === PIECES.HORSEMAN) cardColor = "slate";
            else if (type === PIECES.SNIPER) cardColor = "red";
            else if (type === PIECES.TANK) cardColor = "amber";
            else if (type === PIECES.BATTLEKNIGHT) cardColor = "emerald";
            else if (type === PIECES.COMMANDER) cardColor = "fuchsia";

            const previewMode = view === "chessmen" ? "2p-ns" : "4p";

            return (
              <MenuCard
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
                color={cardColor}
                className="h-full w-full px-2 py-4"
              />
            );
          })}
        </MenuGrid>
      )}

      {view === "selection" && !unitType && (
        <MenuPageFooter
          onForwardClick={() => navigate("/learn/trench")}
          forwardLabel="Open the Trench"
          forwardIcon={Rainbow}
        />
      )}

      {view === "chessmen" && !unitType && (
        <MenuPageFooter
          onForwardClick={() => navigate("/learn/endgame")}
          forwardLabel="The Endgame"
          forwardIcon={Trophy}
        />
      )}

      <MenuDetailModal
        isOpen={!!unitType}
        onClose={closeModal}
        darkMode={darkMode}
        color={
          unitType === PIECES.BATTLEKNIGHT
            ? "emerald"
            : unitType === PIECES.COMMANDER
              ? "fuchsia"
              : unitType === PIECES.SNIPER
                ? "red"
                : unitType === PIECES.TANK
                  ? "amber"
                  : unitType === PIECES.BOT
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
      </MenuDetailModal>
    </MenuPageLayout>
  );
};

export default MenuChess;
export const LazyMenuChess = lazy(() => import("./MenuChess"));
