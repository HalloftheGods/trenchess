import type { PieceType } from "@/shared/types/game";

export const PIECES = {
  KING: { id: "king" as PieceType, name: "King", initialCount: 1 },
  QUEEN: { id: "queen" as PieceType, name: "Queen", initialCount: 1 },
  ROOK: { id: "rook" as PieceType, name: "Rook", initialCount: 2 },
  BISHOP: { id: "bishop" as PieceType, name: "Bishop", initialCount: 2 },
  KNIGHT: { id: "knight" as PieceType, name: "Knight", initialCount: 2 },
  PAWN: { id: "pawn" as PieceType, name: "Pawn", initialCount: 8 },
} as const;
