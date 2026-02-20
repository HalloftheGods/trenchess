// Board cell component
import { Trees as TreeIcon, Waves, Mountain } from "lucide-react";
import { DesertIcon } from "../UnitIcons";
import {
  TERRAIN_TYPES,
  PLAYER_CONFIGS,
  INITIAL_ARMY,
  getQuadrantBaseStyle,
  isUnitProtected,
} from "../constants";
import type {
  BoardPiece,
  TerrainType,
  GameState,
  ArmyUnit,
  PieceType,
} from "../types";

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
  getIcon: (unit: ArmyUnit, className?: string) => React.ReactNode;
  handleCellClick: (r: number, c: number) => void;
  handleCellHover: (r: number, c: number) => void;
  setHoveredCell: (cell: [number, number] | null) => void;
  setPreviewMoves: (moves: number[][]) => void;
  isFlipped: boolean;
}

const BoardCell: React.FC<BoardCellProps> = ({
  r,
  c,
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
  const isSelected = selectedCell?.[0] === r && selectedCell?.[1] === c;
  const isValid = validMoves.some(([vr, vc]) => vr === r && vc === c);
  const isHovered = hoveredCell && hoveredCell[0] === r && hoveredCell[1] === c;
  const isPreviewMove = previewMoves.some(([pr, pc]) => pr === r && pc === c);
  /* Combined check for setup-like states to share rendering logic */
  const isSetupPhase = gameState === "setup" || gameState === "zen-garden";

  const hasUnit = !!piece || (isHovered && isSetupPhase && !!placementPiece);

  let highlightArea = "";
  if (isSetupPhase) {
    if (mode === "2p-ns") {
      if (turn === "player1" && r < 6)
        highlightArea = "ring-1 ring-orange-500/20 ring-inset bg-orange-500/5";
      if (turn === "player4" && r >= 6)
        highlightArea = "ring-1 ring-blue-500/20 ring-inset bg-blue-500/5";
    } else if (mode === "2p-ew") {
      if (turn === "player3" && c < 6)
        highlightArea =
          "ring-1 ring-emerald-500/20 ring-inset bg-emerald-500/5";
      if (turn === "player2" && c >= 6)
        highlightArea = "ring-1 ring-yellow-500/20 ring-inset bg-yellow-500/5";
    } else {
      if (turn === "player1" && r < 6 && c < 6)
        highlightArea = "ring-1 ring-orange-500/20 ring-inset bg-orange-500/5";
      if (turn === "player2" && r < 6 && c >= 6)
        highlightArea = "ring-1 ring-yellow-500/20 ring-inset bg-yellow-500/5";
      if (turn === "player3" && r >= 6 && c < 6)
        highlightArea =
          "ring-1 ring-emerald-500/20 ring-inset bg-emerald-500/5";
      if (turn === "player4" && r >= 6 && c >= 6)
        highlightArea = "ring-1 ring-blue-500/20 ring-inset bg-blue-500/5";
    }
  }

  return (
    <div
      onClick={() => handleCellClick(r, c)}
      onMouseEnter={() => handleCellHover(r, c)}
      onMouseLeave={() => {
        setHoveredCell(null);
        setPreviewMoves([]);
      }}
      className={`relative aspect-square w-full h-full flex items-center justify-center cursor-pointer transition-all border-[0.5px] border-black/20 ${getQuadrantBaseStyle(r, c, mode)} ${highlightArea} ${isSelected ? "ring-4 ring-yellow-400 ring-inset z-30" : ""} ${isValid ? 'after:content-[""] after:absolute after:inset-0 after:bg-emerald-500/40 after:animate-pulse z-20' : ""} ${isPreviewMove ? 'after:content-[""] after:absolute after:inset-0 after:bg-emerald-500/30 z-20' : ""} ${isHovered ? "ring-2 ring-white z-20" : ""}`}
    >
      {!fogged && terrainType === TERRAIN_TYPES.TREES && (
        <div
          className={`absolute inset-0 border border-emerald-600/50 dark:border-emerald-400/50 ${hasUnit ? "bg-emerald-900 dark:bg-emerald-950" : "bg-emerald-600/10 dark:bg-emerald-400/10"} flex items-center justify-center`}
          style={{ transform: isFlipped ? "rotate(180deg)" : "rotate(0deg)" }}
        >
          {!hasUnit && (
            <TreeIcon className="w-[70%] h-[70%] text-emerald-800 dark:text-emerald-300 opacity-40" />
          )}
        </div>
      )}
      {!fogged && terrainType === TERRAIN_TYPES.PONDS && (
        <div
          className={`absolute inset-0 border border-blue-600/50 dark:border-blue-400/50 ${hasUnit ? "bg-blue-900 dark:bg-blue-950" : "bg-blue-600/10 dark:bg-blue-400/10"} flex items-center justify-center`}
          style={{ transform: isFlipped ? "rotate(180deg)" : "rotate(0deg)" }}
        >
          {!hasUnit && (
            <Waves className="w-[70%] h-[70%] text-blue-800 dark:text-blue-300 opacity-40" />
          )}
        </div>
      )}
      {!fogged && terrainType === TERRAIN_TYPES.RUBBLE && (
        <div
          className={`absolute inset-0 border border-brand-red/50 dark:border-brand-red/50 ${hasUnit ? "bg-red-800 dark:bg-red-900" : "bg-brand-red/10 dark:bg-brand-red/10"} flex items-center justify-center`}
          style={{ transform: isFlipped ? "rotate(180deg)" : "rotate(0deg)" }}
        >
          {!hasUnit && (
            <Mountain className="w-[70%] h-[70%] text-brand-red dark:text-brand-red opacity-40" />
          )}
        </div>
      )}
      {!fogged && terrainType === TERRAIN_TYPES.DESERT && (
        <div
          className={`absolute inset-0 border border-amber-500/50 dark:border-amber-400/50 ${hasUnit ? "bg-amber-900/50 dark:bg-amber-950/50" : "bg-amber-100/40 dark:bg-amber-900/10"} flex items-center justify-center`}
          style={{ transform: isFlipped ? "rotate(180deg)" : "rotate(0deg)" }}
        >
          {!hasUnit && (
            <DesertIcon className="w-[70%] h-[70%] text-amber-500 dark:text-amber-400 opacity-40" />
          )}
        </div>
      )}

      {/* Preview for placement */}
      {!fogged &&
        isHovered &&
        isSetupPhase &&
        (placementPiece ? (
          <div
            className={`absolute inset-0 flex items-center justify-center opacity-50 ${PLAYER_CONFIGS[turn].text} z-20`}
            style={{ transform: isFlipped ? "rotate(180deg)" : "rotate(0deg)" }}
          >
            {getIcon(
              INITIAL_ARMY.find((u) => u.type === placementPiece)!,
              "w-3/4 h-3/4",
            )}
          </div>
        ) : placementTerrain ? (
          <div
            className={`absolute inset-0 border-4 opacity-50 ${placementTerrain === TERRAIN_TYPES.TREES ? "border-emerald-500" : placementTerrain === TERRAIN_TYPES.PONDS ? "border-brand-blue" : placementTerrain === TERRAIN_TYPES.DESERT ? "border-amber-500" : "border-brand-red"}`}
          />
        ) : null)}

      {!fogged && piece && (
        <div
          className="absolute inset-0 flex items-center justify-center z-20"
          style={{ transform: isFlipped ? "rotate(180deg)" : "rotate(0deg)" }}
        >
          {(() => {
            const isProtected = isUnitProtected(piece.type, terrainType);
            const unit = INITIAL_ARMY.find((p) => p.type === piece.type)!;

            return (
              <div
                className={`w-full h-full flex items-center justify-center select-none drop-shadow-lg p-1.5
                  ${piece.player === turn ? "animate-float" : ""} 
                  ${pieceStyle !== "emoji" ? `text-4xl ${PLAYER_CONFIGS[piece.player].text}` : "text-5xl"}
                  ${isProtected ? "border-double border-[6px] rounded-2xl border-white/40 dark:border-white/20" : ""}
                `}
              >
                {getIcon(unit, "w-full h-full")}
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};

export default BoardCell;
