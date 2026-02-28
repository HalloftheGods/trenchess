import type { BoardCallbacks } from "@tc.types/game/ux/BoardProps";

interface UseBoardInteractionsProps {
  callbacks: BoardCallbacks;
}

export const useBoardInteractions = ({
  callbacks,
}: UseBoardInteractionsProps) => {
  const { setHoveredCell, setPreviewMoves, handleCellClick, handleCellHover } =
    callbacks;

  const onBoardMouseLeave = () => {
    setHoveredCell(null);
    setPreviewMoves([]);
  };

  const onCellInteraction = (row: number, col: number) => {
    handleCellHover(row, col);
  };

  const onCellSelect = (row: number, col: number) => {
    handleCellClick(row, col);
  };

  return {
    onBoardMouseLeave,
    onCellInteraction,
    onCellSelect,
  };
};
