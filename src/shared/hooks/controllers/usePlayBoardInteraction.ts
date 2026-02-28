import { useCallback } from "react";
import type { BoardPiece } from "@tc.types/game";
import type { PlacementManager } from "@tc.types";

interface PlayInteractionProps {
  currentTurn: string;
  board: (BoardPiece | null)[][];
  placementManager: PlacementManager;
  executeMove: (
    fromRow: number,
    fromCol: number,
    toRow: number,
    toCol: number,
    isAiMove?: boolean,
  ) => void;
}

export function usePlayBoardInteraction({
  currentTurn,
  board,
  placementManager,
  executeMove,
}: PlayInteractionProps) {
  const {
    selectedCell,
    setSelectedCell,
    setHoveredCell,
    validMoves,
    setValidMoves,
    setPreviewMoves,
    getValidMovesForPiece,
  } = placementManager;

  const handlePlayHover = useCallback(
    (_row: number, _col: number) => {
      // In play phase, we don't have hover previews for unit/terrain placement
      setHoveredCell(null);
      setPreviewMoves([]);
    },
    [setHoveredCell, setPreviewMoves],
  );

  const handlePlayClick = useCallback(
    (row: number, col: number) => {
      const isPieceSelected = !!selectedCell;

      if (isPieceSelected) {
        const [selectedRow, selectedCol] = selectedCell!;
        const isTargetValid = validMoves.some(
          ([vr, vc]) => vr === row && vc === col,
        );

        if (isTargetValid) {
          executeMove(selectedRow, selectedCol, row, col);
        }

        setSelectedCell(null);
        setValidMoves([]);
      } else {
        const piece = board[row][col];
        const isMyTurn = piece?.player === currentTurn;

        if (isMyTurn) {
          setSelectedCell([row, col]);
          setValidMoves(getValidMovesForPiece(row, col, piece!, currentTurn));
        }
      }
    },
    [
      selectedCell,
      validMoves,
      executeMove,
      setSelectedCell,
      setValidMoves,
      board,
      currentTurn,
      getValidMovesForPiece,
    ],
  );

  return { handlePlayHover, handlePlayClick };
}
