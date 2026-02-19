import React from "react";
import { useNavigate } from "react-router-dom";
import MenuCard from "../MenuCard";
import SectionDivider from "../ui/SectionDivider";
import BackButton from "../ui/BackButton";
import { useMenuContext } from "./MenuLayout";
import { INITIAL_ARMY, PIECES } from "../../constants";
import { UNIT_DETAILS, unitColorMap } from "../../data/unitDetails";

const MenuChess: React.FC = () => {
  const navigate = useNavigate();
  const { setHoveredMenu, darkMode } = useMenuContext();

  // Define the order of pieces
  const UNIT_ORDER = [
    PIECES.BOT, // Pawn
    PIECES.HORSEMAN, // Knight
    PIECES.SNIPER, // Bishop
    PIECES.TANK, // Rook
    PIECES.BATTLEKNIGHT, // Queen
    PIECES.COMMANDER, // King
  ];

  // Map piece types to clean display names
  const displayNames: Record<string, string> = {
    [PIECES.BOT]: "Pawn",
    [PIECES.HORSEMAN]: "Knight",
    [PIECES.SNIPER]: "Bishop",
    [PIECES.TANK]: "Rook",
    [PIECES.BATTLEKNIGHT]: "Queen",
    [PIECES.COMMANDER]: "King",
  };

  return (
    <div className="w-full max-w-7xl animate-in slide-in-from-bottom-8 fade-in duration-700 pb-20 flex flex-col items-center">
      <div className="relative flex items-center justify-center gap-4 mb-8 w-full max-w-7xl">
        <BackButton
          onClick={() => navigate("/learn")}
          className="absolute left-0"
        />
        <SectionDivider
          label="The Chess: Field Manual"
          className="ml-24"
          color="blue"
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 w-full max-w-7xl">
        {UNIT_ORDER.map((type) => {
          const unit = INITIAL_ARMY.find((u) => u.type === type);
          if (!unit) return null;

          const details = UNIT_DETAILS[type];
          const colors = unitColorMap[type];

          // Determine card color based on unit color logic or default
          // unitColorMap keys: text, bg, border...
          // MenuCard expects a 'color' prop (red, blue, emerald, amber, slate).
          // Let's map pieces to these colors roughly.
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
          else if (type === PIECES.BATTLEKNIGHT)
            cardColor = "emerald"; // Queen -> Green
          else if (type === PIECES.COMMANDER) cardColor = "fuchsia"; // King -> Purple/Fuchsia

          // Custom styling to match the unit colors exactly if needed,
          // but MenuCard has specific color themes.
          // We can override className.

          // Parse the border color to get the base color (e.g. border-red-500)
          const baseBorderColor = colors.border.split("/")[0];

          return (
            <MenuCard
              key={type}
              onClick={() => navigate(`/learn/chess/${type}`)}
              onMouseEnter={() => setHoveredMenu("chess")}
              onMouseLeave={() => setHoveredMenu(null)}
              isSelected={false}
              darkMode={darkMode}
              title={displayNames[type]}
              description={details?.title || "Unit Details"}
              Icon={unit.lucide}
              color={cardColor}
              // Override border styles to match unit colors
              // We use border-2 to override the default border-4, and apply high-opacity border on hover
              className={`h-full w-full border-2 ${colors.bg.replace("/10", "/30")} hover:${colors.bg.replace("/10", "/50")} ${colors.border.replace("/40", "/20")} hover:${baseBorderColor}`}
            />
          );
        })}
      </div>
    </div>
  );
};

export default MenuChess;
