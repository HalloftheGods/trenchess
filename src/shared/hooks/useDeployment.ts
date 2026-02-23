import { useState, useEffect } from "react";
import { serializeGame } from "@utils/gameUrl";
import { INITIAL_ARMY } from "@/core/data/unitDetails";
import { TERRAIN_TYPES } from "@/core/data/terrainDetails";
import { getPlayerCells } from "@/core/setup/setupLogic";
import { MAX_TERRAIN_PER_PLAYER } from "@/shared/constants/terrain.constants";
import type {
  GameMode,
  GameState,
  TerrainType,
  BoardPiece,
  PieceType,
} from "@/shared/types/game";

export interface UseDeploymentProps {
  mode: GameMode;
  gameState: GameState;
  terrain?: TerrainType[][];
  setTerrain?: (terrain: TerrainType[][]) => void;
  board?: (BoardPiece | null)[][];
  setBoard?: (board: (BoardPiece | null)[][]) => void;
  activePlayers: string[];
  turn: string;
  localPlayerName?: string;
  layoutName?: string;
  setInventory?: (inventory: Record<string, PieceType[]>) => void;
}

export function useDeployment({
  mode,
  gameState,
  terrain,
  setTerrain,
  board,
  setBoard,
  activePlayers,
  turn,
  localPlayerName,
  layoutName,
  setInventory,
}: UseDeploymentProps) {
  const [copied, setCopied] = useState(false);
  const [librarySeeds, setLibrarySeeds] = useState<
    {
      id: string;
      name: string;
      seed: string;
      mode: string;
      createdAt: string;
    }[]
  >([]);

  useEffect(() => {
    if (gameState === "zen-garden") {
      try {
        const stored = localStorage.getItem("trenchess_seeds");
        if (stored) {
          const data = JSON.parse(stored);
          if (Array.isArray(data)) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setLibrarySeeds(
              data.sort(
                (a, b) =>
                  new Date(b.createdAt).getTime() -
                  new Date(a.createdAt).getTime(),
              ),
            );
          }
        }
      } catch (e) {
        console.error("Failed to load seeds from localStorage", e);
      }
    }
  }, [gameState]);

  const maxPlacement =
    activePlayers.length === 2
      ? MAX_TERRAIN_PER_PLAYER.TWO_PLAYER
      : MAX_TERRAIN_PER_PLAYER.FOUR_PLAYER;

  const perspectiveTurn =
    gameState === "setup" ? localPlayerName || turn : turn;
  const myCells = getPlayerCells(perspectiveTurn, mode);

  let placedCount = 0;
  if (terrain && terrain.length) {
    for (const [r, c] of myCells) {
      if (terrain[r][c] !== TERRAIN_TYPES.FLAT) placedCount++;
    }
  }

  const isZen = gameState === "zen-garden";

  const handleSave = () => {
    if (!board || !terrain) return;
    const seed = serializeGame(mode, board, terrain, layoutName);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("seed", seed);
      window.history.pushState({}, "", url.toString());
      navigator.clipboard.writeText(url.toString()).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });

      try {
        const stored = localStorage.getItem("trenchess_seeds");
        const currentLibrary = stored ? JSON.parse(stored) : [];
        const newSeed = {
          id: Date.now().toString(),
          name: layoutName || `Untitled ${new Date().toLocaleDateString()}`,
          seed,
          mode,
          createdAt: new Date().toISOString(),
        };

        const updatedLibrary = [newSeed, ...currentLibrary];
        localStorage.setItem("trenchess_seeds", JSON.stringify(updatedLibrary));
        setLibrarySeeds(updatedLibrary);
      } catch (e) {
        console.error("Failed to save to library", e);
      }
    }
  };

  const handleClearBoard = () => {
    if (
      confirm("Clear entire layout?") &&
      setBoard &&
      setTerrain &&
      board &&
      terrain
    ) {
      setBoard(board.map((row) => row.map(() => null)));
      setTerrain(
        terrain.map((row) => row.map(() => TERRAIN_TYPES.FLAT as TerrainType)),
      );
      if (setInventory) {
        const newInv: Record<string, PieceType[]> = {};
        activePlayers.forEach((p) => {
          newInv[p] = INITIAL_ARMY.flatMap((u) => Array(u.count).fill(u.type));
        });
        setInventory(newInv);
      }
    }
  };

  return {
    copied,
    librarySeeds,
    setLibrarySeeds,
    maxPlacement,
    placedCount,
    isZen,
    handleSave,
    handleClearBoard,
  };
}
