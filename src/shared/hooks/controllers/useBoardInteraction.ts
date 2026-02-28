import { useCallback } from "react";
import {
  useSetupBoardInteraction,
  usePlayBoardInteraction,
} from "@controllers";
import type {
  BoardInteraction,
  MultiplayerState,
  GameCore,
  BgioClient,
  PlacementManager,
} from "@tc.types";
import type { TrenchessState, BoardPiece, TerrainType } from "@tc.types/game";
import type { Ctx } from "boardgame.io";
import { PHASES } from "@constants/game";

const EMPTY_BOARD: (BoardPiece | null)[][] = [];
const EMPTY_TERRAIN: TerrainType[][] = [];

/**
 * useBoardInteraction — Direct board input orchestrator.
 * strictly derived from boardgame.io state.
 */
export function useBoardInteraction(
  bgioState: { G: TrenchessState; ctx: Ctx } | null,
  core: GameCore,
  placementManager: PlacementManager,
  executeMove: (
    fromRow: number,
    fromCol: number,
    toRow: number,
    toCol: number,
    isAiMove?: boolean,
  ) => void,
  _multiplayer?: MultiplayerState,
  bgioClientRef?: React.RefObject<BgioClient | undefined>,
  playerID?: string,
): BoardInteraction {
  const { configState } = core;

  // Derive Authoritative Truths
  const G = bgioState?.G;
  const ctx = bgioState?.ctx;
  const board = G?.board || EMPTY_BOARD;
  const terrain = G?.terrain || EMPTY_TERRAIN;
  const mode = G?.mode || core.mode;

  const currentTurn = G && ctx ? G.playerMap[ctx.currentPlayer] : "red";

  // Perspective: Who is the local user? (Derived inline for zero-lag)
  const localPlayer =
    playerID && G?.playerMap[playerID] ? G.playerMap[playerID] : currentTurn;

  const currentPhase = ctx?.phase || PHASES.MENU;
  const isSetupPhase =
    currentPhase === PHASES.MAIN || currentPhase === PHASES.GENESIS;

  // Specialized interaction hooks
  const { handleSetupHover, handleSetupClick } = useSetupBoardInteraction({
    localPlayer,
    mode,
    board,
    terrain,
    configState,
    placementManager,
    bgioClientRef,
  });

  const { handlePlayHover, handlePlayClick } = usePlayBoardInteraction({
    currentTurn,
    board,
    placementManager,
    executeMove,
  });

  const handleCellHover = useCallback(
    (row: number, col: number) => {
      if (isSetupPhase) {
        handleSetupHover(row, col);
      } else {
        handlePlayHover(row, col);
      }
    },
    [isSetupPhase, handleSetupHover, handlePlayHover],
  );

  const handleCellClick = useCallback(
    (row: number, col: number) => {
      if (isSetupPhase) {
        handleSetupClick(row, col);
      } else {
        handlePlayClick(row, col);
      }
    },
    [isSetupPhase, handleSetupClick, handlePlayClick],
  );

  return { handleCellHover, handleCellClick };
}
