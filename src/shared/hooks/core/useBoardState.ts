import { useState } from "react";
import type { BoardPiece, TerrainType, PieceType } from "@/core/types/game";

export interface BoardState {
  board: (BoardPiece | null)[][];
  setBoard: React.Dispatch<React.SetStateAction<(BoardPiece | null)[][]>>;
  terrain: TerrainType[][];
  setTerrain: React.Dispatch<React.SetStateAction<TerrainType[][]>>;
  inventory: Record<string, PieceType[]>;
  setInventory: React.Dispatch<
    React.SetStateAction<Record<string, PieceType[]>>
  >;
  terrainInventory: Record<string, TerrainType[]>;
  setTerrainInventory: React.Dispatch<
    React.SetStateAction<Record<string, TerrainType[]>>
  >;
  capturedBy: Record<string, BoardPiece[]>;
  setCapturedBy: React.Dispatch<
    React.SetStateAction<Record<string, BoardPiece[]>>
  >;
}

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
