import React from "react";
import { Flex } from "@atoms";
import { PLAYER_CONFIGS, INITIAL_ARMY, PIECES } from "@constants";
import { isUnitProtected } from "@/core/mechanics/gameLogic";
import type { BoardPiece, TerrainType, ArmyUnit } from "@/shared/types/game";

interface CellUnitRendererProps {
  piece: BoardPiece | null;
  terrainType: TerrainType;
  turn: string;
  pieceStyle: string;
  rotationStyle: React.CSSProperties;
  getIcon: (
    unit: ArmyUnit,
    className?: string,
    size?: number | string,
    filled?: boolean,
  ) => React.ReactNode;
  row: number;
  col: number;
  gameState: string;
  inCheck: boolean;
  isDestination: boolean;
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
  row,
  col,
  gameState,
  inCheck,
  isDestination,
}) => {
  if (!piece) return null;

  const unitProtected = isUnitProtected(piece.type, terrainType);
  const unitTheme = INITIAL_ARMY.find((p) => p.type === piece.type);
  if (!unitTheme) return null;

  const playerConfig = PLAYER_CONFIGS[piece.player];
  const isMyTurn = piece.player === turn;

  const isKing = piece.type === PIECES.KING;
  const isKingInCheck = isKing && inCheck && isMyTurn;

  const isSetup = gameState === "setup" || gameState === "zen-garden";

  // Tactical Entrance Hierarchy: Setup (Drop) > Move (Spin-Grow) > Default Arrive
  const entranceClass = isSetup
    ? "animate-drop-in"
    : isDestination
      ? "animate-spin-grow"
      : "animate-move-arrive";

  const animationClass = isMyTurn ? "animate-float" : "";
  const textColorClass =
    pieceStyle !== "emoji"
      ? `text-4xl ${playerConfig?.text || ""}`
      : "text-5xl";

  const checkClass = isKingInCheck
    ? "bg-red-500/20 rounded-full animate-pulse ring-4 ring-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.5)]"
    : "";

  const protectionClass = unitProtected
    ? "border-double border-[6px] rounded-2xl border-white/40 dark:border-white/20"
    : "";

  // Staggered delay only for setup phase cascading effect
  const staggerDelay = isSetup ? `${(row + col) * 0.02}s` : "0s";

  return (
    <Flex
      align="center"
      justify="center"
      className="absolute inset-0 z-20"
      style={rotationStyle}
    >
      {/* 1. Global Tactical Feedback Layer (Glow) */}
      <div
        key={`glow-${piece.player}-${piece.type}-${row}-${col}`}
        className={`absolute inset-2 rounded-xl animate-land-glow pointer-events-none z-10 bg-current ${playerConfig?.text || "text-white"}`}
        style={{ animationDelay: staggerDelay }}
      />

      {/* 2. Entrance Animation Layer (Drop-in / Arrive) */}
      <div
        key={`entrance-${piece.player}-${piece.type}-${row}-${col}`}
        className={`w-full h-full flex items-center justify-center ${entranceClass}`}
        style={{ animationDelay: staggerDelay }}
      >
        {/* 3. Idle Animation Layer (Floating) */}
        <Flex
          align="center"
          justify="center"
          className={`w-full h-full select-none drop-shadow-lg p-1.5
            ${animationClass} 
            ${textColorClass}
            ${protectionClass}
            ${checkClass}
          `}
        >
          {getIcon(unitTheme, "w-full h-full", undefined, !isMyTurn)}
        </Flex>
      </div>
    </Flex>
  );
};
