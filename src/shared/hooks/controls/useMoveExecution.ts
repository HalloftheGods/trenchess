import { useCallback } from "react";
import type { MoveExecution, GameCore, BgioClient } from "@/shared/types";

export function useMoveExecution(
  _core: GameCore, // core is unused now that we delegate to bgioClient
  bgioClientRef?: React.RefObject<BgioClient | undefined>,
  onMoveExecuted?: (move: {
    from: [number, number];
    to: [number, number];
  }) => void,
): MoveExecution {
  const executeMove = useCallback(
    (
      fromR: number,
      fromC: number,
      toR: number,
      toC: number,
      isAiMove = false,
    ) => {
      const bgioClient = bgioClientRef?.current;
      if (bgioClient) {
        bgioClient.moves.movePiece([fromR, fromC], [toR, toC]);

        if (!isAiMove && onMoveExecuted) {
          onMoveExecuted({ from: [fromR, fromC], to: [toR, toC] });
        }
      }
    },
    [bgioClientRef, onMoveExecuted],
  );

  return { executeMove };
}
