import React from "react";
import { useNavigate } from "react-router-dom";
import MenuCard from "../MenuCard";
import SectionDivider from "../ui/SectionDivider";
import BackButton from "../ui/BackButton";
import { useMenuContext } from "./MenuContext";
import { INITIAL_ARMY, PIECES } from "../../data/unitDetails";
import { UNIT_DETAILS, unitColorMap } from "../../data/unitDetails";

import { useParams } from "react-router-dom";
import { ChessPawn, ChessBishop, Trophy } from "lucide-react";
import MenuDetailModal from "./MenuDetailModal";
import ChessCardDetail from "./ChessCardDetail";

const MenuChess: React.FC = () => {
  const navigate = useNavigate();
  const { unitType } = useParams<{ unitType: string }>();
  const { setHoveredMenu, darkMode } = useMenuContext();

  // Define piece groups
  const TRENCH_PIECES = [
    PIECES.HORSEMAN, // Knight
    PIECES.SNIPER, // Bishop
    PIECES.TANK, // Rook
  ];

  const MOVE_PIECES = [
    PIECES.BOT, // Pawn
    PIECES.BATTLEKNIGHT, // Queen
    PIECES.COMMANDER, // King
  ];

  const getCategoryForUnit = (type: string | undefined) => {
    if (!type) return null;
    if (TRENCH_PIECES.includes(type as any)) return "trench";
    if (MOVE_PIECES.includes(type as any)) return "moves";
    return null;
  };

  const [view, setView] = React.useState<"selection" | "trench" | "moves">(
    unitType
      ? (getCategoryForUnit(unitType) as any) || "selection"
      : "selection",
  );

  const closeModal = () => {
    navigate("/learn/chess");
  };

  // Define the order of pieces based on current view
  const UNIT_ORDER =
    view === "trench" ? TRENCH_PIECES : view === "moves" ? MOVE_PIECES : [];

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
            view === "trench"
              ? "Although divided, new jobs meant solace."
              : view === "moves"
                ? "The Evoloved gained new Skills through their jobs"
                : "Some divide, Others evolve - New jobs Come - The Endgame cracks "
          }
          color={view === "trench" ? "red" : view === "moves" ? "blue" : "blue"}
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          <MenuCard
            onClick={() => setView("trench")}
            onMouseEnter={() => setHoveredMenu("how-to-play")}
            onMouseLeave={() => setHoveredMenu(null)}
            preview={{
              mode: "2p-ns",
              hideUnits: true,
            }}
            isSelected={false}
            darkMode={darkMode}
            title="The Divided"
            description="The Knights, Bishops, Rooks, found favor..."
            Icon={ChessBishop}
            color="red"
            className="h-full w-full py-12"
          />
          <MenuCard
            onClick={() => setView("moves")}
            onMouseEnter={() => setHoveredMenu("chess")}
            onMouseLeave={() => setHoveredMenu(null)}
            preview={{
              mode: "2p-ew",
              hideUnits: true,
            }}
            isSelected={false}
            darkMode={darkMode}
            title="The Evolved"
            description="... the Pawns, Queens, and Kings found flavor."
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
            description="Cracked, the Endgame splits into 3."
            Icon={Trophy}
            color="yellow"
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

            const previewMode =
              view === "trench" ? "2p-ns" : view === "moves" ? "2p-ew" : "4p";

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
