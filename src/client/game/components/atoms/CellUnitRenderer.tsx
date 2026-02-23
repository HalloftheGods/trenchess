import React from "react";
import { Flex } from "@atoms";
import { PLAYER_CONFIGS, INITIAL_ARMY } from "@/client/game/theme";
import { isUnitProtected } from "@/core/mechanics/gameLogic";
import type { BoardPiece, TerrainType, ArmyUnit } from "@/shared/types/game";

interface CellUnitRendererProps {
  piece: BoardPiece | null;
  terrainType: TerrainType;
  turn: string;
  pieceStyle: string;
  rotationStyle: React.CSSProperties;
  getIcon: (unit: ArmyUnit, className?: string, filled?: boolean) => React.ReactNode;
}

/**
 * CellUnitRenderer — Atom for rendering the inhabitants of a board cell.
 */
export const CellUnitRenderer: React.FC<CellUnitRendererProps> = ({
  piece,
  terrainType,
  turn,
  pieceStyle,
  rotationStyle,
  getIcon,
}) => {
  if (!piece) return null;

  const unitProtected = isUnitProtected(piece.type, terrainType);
  const unitTheme = INITIAL_ARMY.find((p) => p.type === piece.type);
  if (!unitTheme) return null;

  const playerConfig = PLAYER_CONFIGS[piece.player];
  const isMyTurn = piece.player === turn;
  
  const animationClass = isMyTurn ? "animate-float" : "";
  const textColorClass = pieceStyle !== "emoji" ? `text-4xl ${playerConfig?.text || ""}` : "text-5xl";
  const protectionClass = unitProtected ? "border-double border-[6px] rounded-2xl border-white/40 dark:border-white/20" : "";

  return (
    <Flex
      align="center"
      justify="center"
      className="absolute inset-0 z-20"
      style={rotationStyle}
    >
      <Flex
        align="center"
        justify="center"
        className={`w-full h-full select-none drop-shadow-lg p-1.5
          ${animationClass} 
          ${textColorClass}
          ${protectionClass}
        `}
      >
        {getIcon(unitTheme, "w-full h-full", !isMyTurn)}
      </Flex>
    </Flex>
  );
};
