import type {
  BoardPiece,
  TerrainType,
  GameMode,
  GameState,
  ArmyUnit,
  PieceType,
  TrenchessState,
} from "../../";
export interface BoardIdentity {
  isFlipped: boolean;
  localPlayerName?: string;
  pieceStyle: string;
}

export interface BoardGeometry {
  board: (BoardPiece | null)[][];
  terrain: TerrainType[][];
}

export interface BoardTacticalState {
  mode: GameMode;
  gameState: GameState;
  turn: string;
  winner: string | null;
  winnerReason?: string | null;
  inCheck: boolean;
  lastMove: TrenchessState["lastMove"];
}

export interface BoardSelection {
  selectedCell: [number, number] | null;
  hoveredCell: [number, number] | null;
  validMoves: number[][];
  previewMoves: number[][];
}

export interface BoardPlacement {
  placementPiece: PieceType | null;
  placementTerrain: TerrainType | null;
  setupMode: string;
}

export interface BoardCallbacks {
  getIcon: (
    unit: ArmyUnit,
    className?: string,
    size?: number | string,
    filled?: boolean,
  ) => React.ReactNode;
  getPlayerDisplayName: (pid: string) => string;
  handleCellClick: (r: number, c: number) => void;
  handleCellHover: (r: number, c: number) => void;
  setHoveredCell: (cell: [number, number] | null) => void;
  setPreviewMoves: (moves: number[][]) => void;
  setGameState: (state: GameState) => void;
}

export interface BoardProps {
  identity: BoardIdentity;
  geometry: BoardGeometry;
  tactical: BoardTacticalState;
  selection: BoardSelection;
  placement: BoardPlacement;
  callbacks: BoardCallbacks;
  fogOfWar?: boolean;
}
