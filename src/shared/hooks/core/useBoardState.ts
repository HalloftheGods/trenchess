import { useState } from "react";
import type {
  BoardState,
  BoardPiece,
  TerrainType,
  PieceType,
} from "@/shared/types";

/**
 * useBoardState — Manages transient board state and fallbacks.
 * In production, most of this data is driven by boardgame.io (G).
 */
export function useBoardState(): BoardState {
  const [board, setBoard] = useState<(BoardPiece | null)[][]>(() =>
    Array(12)
      .fill(null)
      .map(() => Array(12).fill(null)),
  );
  const [terrain, setTerrain] = useState<TerrainType[][]>(() =>
    Array(12)
      .fill(null)
      .map(() => Array(12).fill("flat" as TerrainType)),
  );
  const [inventory, setInventory] = useState<Record<string, PieceType[]>>({});
  const [terrainInventory, setTerrainInventory] = useState<
    Record<string, TerrainType[]>
  >({});
  const [capturedBy, setCapturedBy] = useState<Record<string, BoardPiece[]>>({
    red: [],
    yellow: [],
    green: [],
    blue: [],
  });

  return {
    board,
    setBoard,
    terrain,
    setTerrain,
    inventory,
    setInventory,
    terrainInventory,
    setTerrainInventory,
    capturedBy,
    setCapturedBy,
  };
}
