import React from "react";
import { Box } from "@atoms";
import { getQuadrantBaseStyle } from "@/core/setup/boardLayouts";
import { TerrainOverlay } from "../atoms/TerrainOverlay";
import { CellUnitRenderer } from "../atoms/CellUnitRenderer";
import { CellHighlight } from "../atoms/CellHighlight";
import { CellPlacementPreview } from "../atoms/CellPlacementPreview";
import { getSetupHighlightArea } from "../../utils/boardCellHelpers";
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
  getIcon: (
    unit: ArmyUnit,
    className?: string,
    filled?: boolean,
  ) => React.ReactNode;
  handleCellClick: (r: number, c: number) => void;
  handleCellHover: (r: number, c: number) => void;
  setHoveredCell: (cell: [number, number] | null) => void;
  setPreviewMoves: (moves: number[][]) => void;
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
  getIcon,
  handleCellClick,
  handleCellHover,
  setHoveredCell,
  setPreviewMoves,
  isFlipped,
}) => {
  const isSelected = selectedCell?.[0] === row && selectedCell?.[1] === col;
  const isHovered = !!(hoveredCell && hoveredCell[0] === row && hoveredCell[1] === col);
  const isValid = validMoves.some(([vr, vc]) => vr === row && vc === col);
  const isPreviewMove = previewMoves.some(([pr, pc]) => pr === row && pc === col);
  
  const isSetupActive = gameState === "setup" || gameState === "zen-garden";
  const hasInhabitant = !!(piece || (isHovered && isSetupActive && !!placementPiece));

  const rotationStyle: React.CSSProperties = {
    transform: isFlipped ? "rotate(180deg)" : "rotate(0deg)",
  };

  const setupHighlight = getSetupHighlightArea(isSetupActive, mode, turn, row, col);

  return (
    <Box
      onClick={() => handleCellClick(row, col)}
      onMouseEnter={() => handleCellHover(row, col)}
      onMouseLeave={() => {
        setHoveredCell(null);
        setPreviewMoves([]);
      }}
      className={`relative aspect-square w-full h-full flex items-center justify-center cursor-pointer transition-all border-[0.5px] border-black/20 ${getQuadrantBaseStyle(row, col, mode)}`}
    >
      <TerrainOverlay
        terrainType={terrainType}
        hasUnit={hasInhabitant}
        rotationStyle={rotationStyle}
        fogged={fogged}
      />

      <CellHighlight
        isSelected={isSelected}
        isValid={isValid}
        isPreviewMove={isPreviewMove}
        isHovered={isHovered}
        setupHighlightArea={setupHighlight}
      />

      {!fogged && isHovered && isSetupActive && (
        <CellPlacementPreview
          placementPiece={placementPiece}
          placementTerrain={placementTerrain}
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
        />
      )}
    </Box>
  );
};

export default BoardCell;
