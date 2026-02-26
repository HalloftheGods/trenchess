import React from "react";
import { PIECES, unitColorMap, INITIAL_ARMY } from "@constants";
import type { PieceStyle } from "@/shared/types/game";
import { Flex } from "@/shared/components/atoms/Flex";
import { Box } from "@/shared/components/atoms/Box";

interface UnitStatTabsProps {
  selectedPiece: string;
  onSelect: (piece: string) => void;
  pieceStyle: PieceStyle;
}

const getUnitIcon = (type: string, pieceStyle: PieceStyle) => {
  const armyUnit = INITIAL_ARMY.find((u) => u.type === type);
  if (!armyUnit) return null;

  if (pieceStyle === "lucide") {
    const Icon = armyUnit.lucide;
    return <Icon className="w-full h-full" />;
  }
  if (pieceStyle === "custom") {
    const Icon = armyUnit.custom;
    return <Icon className="w-full h-full" />;
  }

  return (
    <Box as="span" className="text-lg leading-none">
      {armyUnit[pieceStyle as "emoji" | "bold" | "outlined"]}
    </Box>
  );
};

export const UnitStatTabs: React.FC<UnitStatTabsProps> = ({
  selectedPiece,
  onSelect,
  pieceStyle,
}) => {
  const pieceKeys = Object.values(PIECES);

  return (
    <Flex gap={8} className="px-4 flex-wrap">
      {pieceKeys.map((piece) => {
        const isActive = selectedPiece === piece;
        const color = unitColorMap[piece];
        const handleSelect = () => onSelect(piece);

        return (
          <Box
            key={piece}
            as="button"
            id={`tab-${piece}`}
            onClick={handleSelect}
            className={`group relative flex items-center justify-center transition-all duration-500 ease-out focus:outline-none ${
              isActive
                ? "scale-125 -translate-y-2"
                : "opacity-30 hover:opacity-100 hover:scale-110 grayscale hover:grayscale-0"
            }`}
          >
            {isActive && (
              <Box
                className={`absolute inset-0 blur-2xl opacity-40 rounded-full animate-pulse ${color.bg}`}
              />
            )}

            <Box
              className={`relative z-10 w-12 h-12 flex items-center justify-center transition-all duration-300 ${
                isActive
                  ? `${color.text} drop-shadow-[0_0_8px_currentColor]`
                  : "text-gray-400"
              }`}
            >
              {getUnitIcon(piece, pieceStyle)}
            </Box>

            <Box
              className={`absolute -bottom-3 left-1/2 -translate-x-1/2 h-1 rounded-full transition-all duration-500 overflow-hidden ${
                isActive ? "w-8 opacity-100" : "w-0 opacity-0"
              }`}
            >
              <Box className={`h-full w-full ${color.bg}`} />
            </Box>
          </Box>
        );
      })}
    </Flex>
  );
};
