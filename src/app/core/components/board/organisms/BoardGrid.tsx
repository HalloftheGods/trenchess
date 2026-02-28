import React from "react";
import BoardCell from "@engine/components/board/molecules/BoardCell";
import { GridFrame, FogOverlay } from "@engine/components/board/atoms";
import { useStrategicMask } from "./useStrategicMask";
import { useBoardInteractions } from "./useBoardInteractions";
import type { BoardProps } from "@tc.types/game/ux/BoardProps";

export const BoardGrid: React.FC<BoardProps> = (props) => {
  const { geometry, identity, tactical, callbacks, fogOfWar = true } = props;
  const { board, terrain } = geometry;

  const { regions, isCellMasked } = useStrategicMask({
    tactical,
    identity,
    fogOfWarEnabled: fogOfWar,
  });

  const { onBoardMouseLeave } = useBoardInteractions({
    callbacks,
  });

  return (
    <GridFrame isFlipped={identity.isFlipped} onMouseLeave={onBoardMouseLeave}>
      {board.flatMap((row, r) =>
        row.map((_, c) => (
          <BoardCell
            key={`${r}-${c}`}
            r={r}
            c={c}
            piece={board[r][c]}
            terrainType={terrain[r][c]}
            {...props}
            fogged={isCellMasked(r, c)}
          />
        )),
      )}

      <FogOverlay regions={regions} />
    </GridFrame>
  );
};
