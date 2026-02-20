import React from "react";
import { useNavigate } from "react-router-dom";
import MenuCard from "../MenuCard";
import SectionDivider from "../ui/SectionDivider";
import BackButton from "../ui/BackButton";
import { useMenuContext } from "./MenuContext";
import { INITIAL_ARMY, PIECES } from "../../constants";
import { UNIT_DETAILS, unitColorMap } from "../../data/unitDetails";

import { useParams } from "react-router-dom";
import {
  MountainSnow,
  HeartPlus,
  RouteOff,
  ChessKing,
  ChessPawn,
  ChessKnight,
  ChessBishop,
} from "lucide-react";
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
      <div className="relative flex items-center justify-center gap-4 mb-8 w-full max-w-7xl">
        <BackButton
          onClick={() => {
            if (view !== "selection") {
              setView("selection");
            } else {
              navigate("/learn");
            }
          }}
          className="absolute left-0"
        />
        <SectionDivider
          label={
            view === "trench"
              ? "The Divided forged their own Classes"
              : view === "moves"
                ? "Leveled Up - They learned new Jobs."
                : " Everyone learned new jobs - While some divided, others evolved - The Endgame changed "
          }
          className="ml-24"
          color={view === "trench" ? "red" : view === "moves" ? "blue" : "blue"}
        />
      </div>

      {view === "selection" ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          <MenuCard
            onClick={() => setView("trench")}
            onMouseEnter={() => setHoveredMenu("how-to-play")}
            onMouseLeave={() => setHoveredMenu(null)}
            isSelected={false}
            darkMode={darkMode}
            title="The Divided"
            description="The Knights, Bishops, Rooks, found recluse..."
            Icon={ChessBishop}
            color="red"
            className="bg-red-100/30 hover:bg-red-200/50 dark:bg-red-900/20 dark:hover:bg-red-900/40 border-2 border-red-500/20 hover:border-red-500/50 h-full w-full py-12"
          />
          <MenuCard
            onClick={() => setView("moves")}
            onMouseEnter={() => setHoveredMenu("chess")}
            onMouseLeave={() => setHoveredMenu(null)}
            isSelected={false}
            darkMode={darkMode}
            title="The Evolved"
            description="...while the Pawns, Queens, and Kings danced."
            Icon={ChessPawn}
            color="blue"
            className="bg-blue-100/30 hover:bg-blue-200/50 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 border-2 border-blue-500/20 hover:border-blue-500/50 h-full w-full py-12"
          />
          <MenuCard
            onClick={() => navigate("/learn/endgame")}
            onMouseEnter={() => setHoveredMenu("boardgame")}
            onMouseLeave={() => setHoveredMenu(null)}
            isSelected={false}
            darkMode={darkMode}
            title="The Endgame"
            description="Needless to say, objectives changed."
            Icon={ChessKing}
            color="emerald"
            className="bg-emerald-100/50 hover:bg-emerald-200/50 dark:bg-emerald-900/20 dark:hover:bg-emerald-900/40 border-2 border-emerald-500/20 hover:border-emerald-500/50 h-full w-full py-12"
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-7xl">
          {UNIT_ORDER.map((type) => {
            const unit = INITIAL_ARMY.find((u) => u.type === type);
            if (!unit) return null;

            const details = UNIT_DETAILS[type];
            const colors = unitColorMap[type];

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

            const baseBorderColor = colors.border.split("/")[0];

            return (
              <MenuCard
                key={type}
                onClick={() => navigate(`/learn/chess/${type}`)}
                onMouseEnter={() => setHoveredMenu("chess")}
                onMouseLeave={() => setHoveredMenu(null)}
                isSelected={false}
                darkMode={darkMode}
                title={details?.title || displayNames[type]}
                description={details?.role || "Unit Details"}
                Icon={unit.lucide}
                color={cardColor}
                className={`h-full w-full border-2 ${colors.bg.replace("/10", "/30")} hover:${colors.bg.replace("/10", "/50")} ${colors.border.replace("/40", "/20")} hover:${baseBorderColor} py-10`}
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
