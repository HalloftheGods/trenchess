import type {
  GameMode,
  GameState,
  SetupMode,
  BoardPiece,
  TerrainType,
  PieceType,
  TrenchessState,
} from "./game";
import type { Ctx } from "boardgame.io";
import type { MultiplayerState } from "./multiplayer";
import type { GameTheme } from "./ui";

export interface BoardState {
  board: (BoardPiece | null)[][];
  setBoard: React.Dispatch<React.SetStateAction<(BoardPiece | null)[][]>>;
  terrain: TerrainType[][];
  setTerrain: React.Dispatch<React.SetStateAction<TerrainType[][]>>;
  inventory: Record<string, PieceType[]>;
  setInventory: React.Dispatch<
    React.SetStateAction<Record<string, PieceType[]>>
  >;
  terrainInventory: Record<string, TerrainType[]>;
  setTerrainInventory: React.Dispatch<
    React.SetStateAction<Record<string, TerrainType[]>>
  >;
  capturedBy: Record<string, BoardPiece[]>;
  setCapturedBy: React.Dispatch<
    React.SetStateAction<Record<string, BoardPiece[]>>
  >;
}

export interface TurnState {
  turn: string;
  setTurn: React.Dispatch<React.SetStateAction<string>>;
  activePlayers: string[];
  setActivePlayers: React.Dispatch<React.SetStateAction<string[]>>;
  readyPlayers: Record<string, boolean>;
  setReadyPlayers: React.Dispatch<
    React.SetStateAction<Record<string, boolean>>
  >;
  playerTypes: Record<string, "human" | "computer">;
  setPlayerTypes: React.Dispatch<
    React.SetStateAction<Record<string, "human" | "computer">>
  >;
  winner: string | null;
  setWinner: React.Dispatch<React.SetStateAction<string | null>>;
  inCheck: boolean;
  setInCheck: React.Dispatch<React.SetStateAction<boolean>>;
  isThinking: boolean;
  setIsThinking: React.Dispatch<React.SetStateAction<boolean>>;
  localPlayerName: string;
  setLocalPlayerName: React.Dispatch<React.SetStateAction<string>>;
  getPlayerDisplayName: (pid: string) => string;
}

export interface GameConfigState {
  mode: GameMode;
  setMode: React.Dispatch<React.SetStateAction<GameMode>>;
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  setupMode: SetupMode;
  setSetupMode: React.Dispatch<React.SetStateAction<SetupMode>>;
  isFlipped: boolean;
  setIsFlipped: React.Dispatch<React.SetStateAction<boolean>>;
  autoFlip: boolean;
  setAutoFlip: React.Dispatch<React.SetStateAction<boolean>>;
  layoutName: string;
  setLayoutName: React.Dispatch<React.SetStateAction<string>>;
  selectedPreset:
    | "classic"
    | "quick"
    | "terrainiffic"
    | "custom"
    | "zen-garden"
    | null;
  setSelectedPreset: React.Dispatch<
    React.SetStateAction<
      "classic" | "quick" | "terrainiffic" | "custom" | "zen-garden" | null
    >
  >;
  showBgDebug: boolean;
  setShowBgDebug: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface BgioClient {
  moves: Record<string, (...args: unknown[]) => void>;
  stop: () => void;
  start: () => void;
  subscribe: (
    cb: (state: { G: TrenchessState; ctx: Ctx } | null) => void,
  ) => () => void;
  playerID: string | null;
  matchID: string | null;
}

export interface GameCore {
  boardState: BoardState;
  turnState: TurnState;
  configState: GameConfigState;
  isAllPlaced: boolean;
  isPlayerReady: (p: string) => boolean;
  initFromSeed: (seed: string, targetState?: GameState) => boolean;
}

export interface PlacementManager {
  selectedCell: [number, number] | null;
  setSelectedCell: React.Dispatch<
    React.SetStateAction<[number, number] | null>
  >;
  hoveredCell: [number, number] | null;
  setHoveredCell: React.Dispatch<React.SetStateAction<[number, number] | null>>;
  validMoves: number[][];
  setValidMoves: React.Dispatch<React.SetStateAction<number[][]>>;
  previewMoves: number[][];
  setPreviewMoves: React.Dispatch<React.SetStateAction<number[][]>>;
  placementPiece: PieceType | null;
  setPlacementPiece: React.Dispatch<React.SetStateAction<PieceType | null>>;
  placementTerrain: TerrainType | null;
  setPlacementTerrain: React.Dispatch<React.SetStateAction<TerrainType | null>>;
  getValidMovesForPiece: (
    r: number,
    c: number,
    piece: BoardPiece,
    player: string,
    depth?: number,
  ) => number[][];
}

export interface MoveExecution {
  executeMove: (
    fromR: number,
    fromC: number,
    toR: number,
    toC: number,
    isAiMove?: boolean,
  ) => void;
}

export interface BoardInteraction {
  handleCellHover: (r: number, c: number, overrideTurn?: string) => void;
  handleCellClick: (r: number, c: number, overrideTurn?: string) => void;
}

export interface ZenGardenInteraction {
  handleZenGardenHover: (r: number, c: number, overrideTurn?: string) => void;
  handleZenGardenClick: (r: number, c: number, overrideTurn?: string) => void;
}

export interface SetupActions {
  initGame: (selectedMode: GameMode) => void;
  initGameWithPreset: (
    selectedMode: GameMode,
    preset: string | null,
    newPlayerTypes?: Record<string, "human" | "computer">,
    seed?: string,
  ) => void;
  randomizeTerrain: () => void;
  generateElementalTerrain: () => void;
  randomizeUnits: () => void;
  setClassicalFormation: () => void;
  mirrorBoard: () => void;
  resetTerrain: () => void;
  resetUnits: () => void;
}

export interface BgioSync {
  synced: boolean;
}

export interface GameStateHook
  extends
    GameTheme,
    BoardState,
    TurnState,
    GameConfigState,
    GameCore,
    PlacementManager,
    MoveExecution,
    BoardInteraction,
    ZenGardenInteraction,
    SetupActions {
  bgioState: { G: TrenchessState; ctx: Ctx } | null;
  ready: () => void;
  startGame: () => void;
  multiplayer: MultiplayerState;
}
