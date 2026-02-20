import React, { useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { ChessPawn, Trophy, Mountain } from "lucide-react";

import MenuCard from "../MenuCard";
import SectionDivider from "../ui/SectionDivider";
import BackButton from "../ui/BackButton";
import ForwardButton from "../ui/ForwardButton";
import MenuDetailModal from "./MenuDetailModal";
import ChessCardDetail from "./ChessCardDetail";
import { useMenuContext } from "./MenuContext";
import {
  INITIAL_ARMY,
  PIECES,
  UNIT_DETAILS,
  unitColorMap,
} from "../../data/unitDetails";

const MenuChess: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { unitType } = useParams<{ unitType: string }>();
  const { setHoveredMenu, darkMode } = useMenuContext();

  // Define piece groups
  const CHESS_PIECES = [
    PIECES.HORSEMAN, // Knight
    PIECES.SNIPER, // Bishop
    PIECES.TANK, // Rook
    PIECES.BOT, // Pawn
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
    <div className="w-full max-w-7xl animate-in slide-in-from-bottom-8 fade-in duration-700 pb-20 flex flex-col items-center">
      <div className="relative w-full max-w-7xl mb-12">
        <SectionDivider
          label={
            view === "chessmen"
              ? '"From the trench, the Chessmen grow stronger"'
              : '"The world cracks into 3, and with it, the Endgame."'
          }
          color={view === "chessmen" ? "blue" : "red"}
        />
        <BackButton
          onClick={() => {
            if (view !== "selection") {
              setView("selection");
            } else {
              navigate("/learn");
            }
          }}
          className="absolute left-0 -top-8"
        />
      </div>

      {view === "selection" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
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
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-7xl">
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
                className="h-full w-full py-10"
              />
            );
          })}
        </div>
      )}

      {view === "selection" && !unitType && (
        <div className="relative w-full max-w-7xl mt-6 space-y-2">
          <SectionDivider label="" />
          <ForwardButton
            onClick={() => navigate("/learn/trench")}
            label="Open the Trench"
            className="float-right"
            Icon={Mountain}
          />
        </div>
      )}

      {view === "chessmen" && !unitType && (
        <div className="relative w-full max-w-7xl mt-6 space-y-2">
          <SectionDivider label="" />
          <ForwardButton
            onClick={() => navigate("/learn/endgame")}
            label="The Endgame"
            className="float-right"
            Icon={Trophy}
          />
        </div>
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
    </div>
  );
};

export default MenuChess;
