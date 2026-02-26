import { useState, useCallback } from "react";
import { useLibrarySeeds } from "../interface/useLibrarySeeds";
import type { GameMode, BoardPiece, TerrainType, BgioClient } from "@/shared/types";

export function useLayoutActions(
  mode: GameMode,
  board: (BoardPiece | null)[][],
  terrain: TerrainType[][],
  layoutName: string,
  clientRef?: React.MutableRefObject<BgioClient | undefined>,
) {
  const [copied, setCopied] = useState(false);
  const { librarySeeds, saveSeed } = useLibrarySeeds();

  const handleSave = useCallback(() => {
    const seed = saveSeed(mode, board, terrain, layoutName);
    if (seed && typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("seed", seed);
      window.history.pushState({}, "", url.toString());
      navigator.clipboard.writeText(url.toString()).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  }, [mode, board, terrain, layoutName, saveSeed]);

  const handleClearBoard = useCallback(() => {
    const isConfirmed = confirm("Clear entire layout?");
    if (isConfirmed && clientRef?.current) {
      clientRef.current.moves.resetToOmega();
    }
  }, [clientRef]);

  return { copied, librarySeeds, handleSave, handleClearBoard };
}
