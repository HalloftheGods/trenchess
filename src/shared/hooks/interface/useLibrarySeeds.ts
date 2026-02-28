import { useState, useCallback } from "react";
import { serializeGame } from "@/shared/utilities/gameUrl";
import type { SeedItem, GameMode, BoardPiece, TerrainType } from "@tc.types";

export function useLibrarySeeds() {
  const [librarySeeds, setLibrarySeeds] = useState<SeedItem[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("trenchess_seeds");
        if (stored) {
          const data = JSON.parse(stored);
          if (Array.isArray(data)) {
            return data.sort(
              (a: SeedItem, b: SeedItem) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime(),
            );
          }
        }
      } catch (e) {
        console.error("Failed to load seeds from localStorage", e);
      }
    }
    return [];
  });

  const saveSeed = useCallback(
    (
      mode: GameMode,
      board: (BoardPiece | null)[][],
      terrain: TerrainType[][],
      layoutName: string,
    ) => {
      if (!board || !terrain) return;
      const seed = serializeGame(mode, board, terrain, layoutName);

      try {
        const stored = localStorage.getItem("trenchess_seeds");
        const currentLibrary = stored ? JSON.parse(stored) : [];
        const newSeed: SeedItem = {
          id: Date.now().toString(),
          name: layoutName || `Untitled ${new Date().toLocaleDateString()}`,
          seed,
          mode: mode || "4p",
          createdAt: new Date().toISOString(),
        };

        const updatedLibrary = [newSeed, ...currentLibrary];
        localStorage.setItem("trenchess_seeds", JSON.stringify(updatedLibrary));
        setLibrarySeeds(updatedLibrary);
        return seed;
      } catch (e) {
        console.error("Failed to save to library", e);
        return null;
      }
    },
    [],
  );

  return { librarySeeds, saveSeed };
}
