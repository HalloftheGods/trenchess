import React from "react";
import { Box } from "@atoms";
import { getQuadrantBaseStyle } from "@/client/game/shared/utils/boardStyles";
import { TerrainOverlay } from "../atoms/TerrainOverlay";
import { CellUnitRenderer } from "../atoms/CellUnitRenderer";
import { CellHighlight } from "../atoms/CellHighlight";
import { CellPlacementPreview } from "../atoms/CellPlacementPreview";
import { getSetupHighlightArea } from "@/client/game/shared/utils/boardCellHelpers";
import type {
  BoardPiece,
  TerrainType,
  GameState,
  ArmyUnit,
  PieceType,
} from "@/shared/types/game";

interface BoardCellProps {
  r: number;
  c: number;
  piece: BoardPiece | null;
  terrainType: TerrainType;
  mode: string;
  gameState: GameState;
  turn: string;
  pieceStyle: string;
  selectedCell: [number, number] | null;
  hoveredCell: [number, number] | null;
  validMoves: number[][];
  previewMoves: number[][];
  placementPiece: PieceType | null;
  placementTerrain: TerrainType | null;
  setupMode: string;
  fogged: boolean;
  inCheck: boolean;
  lastMove: {
    from: [number, number];
    to: [number, number];
    path: [number, number][];
  } | null;
  getIcon: (
    unit: ArmyUnit,
    className?: string,
    filled?: boolean,
  ) => React.ReactNode;
  handleCellClick: (r: number, c: number) => void;
  handleCellHover: (r: number, c: number) => void;
  isFlipped: boolean;
}

/**
 * BoardCell — The primary structural organism of the Trenchess board.
 * Refactored for Atomic Purification.
 */
const BoardCell: React.FC<BoardCellProps> = ({
  r: row,
  c: col,
  piece,
  terrainType,
  mode,
  gameState,
  turn,
  pieceStyle,
  selectedCell,
  hoveredCell,
  validMoves,
  previewMoves,
  placementPiece,
  placementTerrain,
  setupMode: _setupMode,
  fogged,
  inCheck,
  lastMove,
  getIcon,
  handleCellClick,
  handleCellHover,
  isFlipped,
}) => {
  const isSelected = selectedCell?.[0] === row && selectedCell?.[1] === col;
  const isHovered = !!(
    hoveredCell &&
    hoveredCell[0] === row &&
    hoveredCell[1] === col
  );
  const isValid = validMoves.some(([vr, vc]) => vr === row && vc === col);
  const isPreviewMove = previewMoves.some(
    ([pr, pc]) => pr === row && pc === col,
  );

  const isOrigin = lastMove?.from[0] === row && lastMove?.from[1] === col;
  const isDestination = lastMove?.to[0] === row && lastMove?.to[1] === col;
  const isInPath = lastMove?.path.some(([pr, pc]) => pr === row && pc === col);

  const isSetupActive = gameState === "setup" || gameState === "zen-garden";
  const hasInhabitant = !!(
    piece ||
    (isHovered && isSetupActive && !!placementPiece)
  );

  const rotationStyle: React.CSSProperties = {
    transform: isFlipped ? "rotate(180deg)" : "rotate(0deg)",
  };

  const setupHighlight = getSetupHighlightArea(
    isSetupActive,
    mode,
    turn,
    row,
    col,
  );

  return (
    <Box
      onClick={() => handleCellClick(row, col)}
      onMouseEnter={() => handleCellHover(row, col)}
      className={`relative aspect-square w-full h-full flex items-center justify-center cursor-pointer transition-all border-[0.5px] border-black/20 ${getQuadrantBaseStyle(row, col, mode)}`}
    >
      <TerrainOverlay
        terrainType={terrainType}
        hasUnit={!!hasInhabitant}
        rotationStyle={rotationStyle}
        fogged={fogged}
      />

      <CellHighlight
        isSelected={isSelected}
        isValid={isValid}
        isPreviewMove={isPreviewMove}
        isHovered={!!isHovered}
        setupHighlightArea={setupHighlight}
      />

      {/* Path Trail Overlay */}
      {isInPath && !isSetupActive && (
        <div className="absolute inset-0 z-10 animate-path-trail pointer-events-none" />
      )}

      {/* Origin Ghost (Spin-Shrink) */}
      {isOrigin && !piece && !isSetupActive && lastMove && (
        <div className="absolute inset-0 z-20 flex items-center justify-center animate-spin-shrink pointer-events-none opacity-50">
          <div className={`w-full h-full p-1.5 grayscale blur-[1px] flex items-center justify-center ${PLAYER_CONFIGS[lastMove.player]?.text || ""}`}>
            {getIcon(INITIAL_ARMY.find(u => u.type === lastMove.type)!, "w-full h-full", true)}
          </div>
        </div>
      )}

      {!fogged && isHovered && isSetupActive && (
        <CellPlacementPreview
          placementPiece={placementPiece}
          placementTerrain={placementTerrain}
          currentPiece={piece}
          currentTerrain={terrainType}
          turn={turn}
          rotationStyle={rotationStyle}
          getIcon={getIcon}
        />
      )}

      {!fogged && (
        <CellUnitRenderer
          piece={piece}
          terrainType={terrainType}
          turn={turn}
          pieceStyle={pieceStyle}
          rotationStyle={rotationStyle}
          getIcon={getIcon}
          row={row}
          col={col}
          gameState={gameState}
          inCheck={inCheck}
          isDestination={isDestination}
        />
      )}
    </Box>
  );
};

export default BoardCell;
