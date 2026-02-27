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

export interface UseDeploymentProps {
  mode: GameMode;
  gameState: GameState;
  terrain?: TerrainType[][];
  setTerrain?: (terrain: TerrainType[][]) => void;
  board?: (BoardPiece | null)[][];
  setBoard?: (board: (BoardPiece | null)[][]) => void;
  activePlayers: string[];
  turn: string;
  localPlayerName?: string;
  layoutName?: string;
  setInventory?: (inventory: Record<string, PieceType[]>) => void;
}

export interface UseBoardPreviewProps {
  selectedMode: GameMode | null;
  selectedProtocol:
    | "classic"
    | "quick"
    | "terrainiffic"
    | "custom"
    | "zen-garden"
    | null;
  customSeed?: string;
  terrainSeed?: number;
  forcedTerrain?: TerrainType | null;
  isReady?: boolean;
  pieceStyle: PieceStyle;
  hideUnits?: boolean;
}

export interface GameConfigState {
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
  showRules: boolean;
  setShowRules: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface BgioClient {
  moves: {
    ready: (pid?: string) => void;
    placePiece: (
      r: number,
      c: number,
      type: PieceType | null,
      explicitPid?: string,
      isGM?: boolean,
    ) => void;
    placeTerrain: (
      r: number,
      c: number,
      type: TerrainType,
      explicitPid?: string,
      isGM?: boolean,
    ) => void;
    movePiece: (from: [number, number], to: [number, number]) => void;
    forfeit: (pid?: string) => void;
    randomizeTerrain: (pid?: string) => void;
    applyChiGarden: (pid?: string) => void;
    randomizeUnits: (pid?: string) => void;
    setClassicalFormation: (pid?: string) => void;
    resetToOmega: (pid?: string) => void;
    resetTerrain: (pid?: string) => void;
    resetUnits: (pid?: string) => void;
    finishGamemaster: () => void;
    setMode: (mode: GameMode) => void;
    mirrorBoard: (pid?: string) => void;
    setTurn: (pid: string) => void;
    setPhase: (phase: string) => void;
    patchG: (patch: Partial<TrenchessState>) => void;
    authorizeMasterProtocol: () => void;
  };
  stop: () => void;
  start: () => void;
  subscribe: (
    cb: (state: { G: TrenchessState; ctx: Ctx } | null) => void,
  ) => () => void;
  playerID: string | null;
  matchID: string | null;
}

// (Will fix GameStateHook in state.d.ts after viewing it)
export interface GameCore {
  configState: GameConfigState;
  turnState: {
    playerTypes: Record<string, "human" | "computer">;
    setPlayerTypes: React.Dispatch<
      React.SetStateAction<Record<string, "human" | "computer">>
    >;
    isThinking: boolean;
    setIsThinking: React.Dispatch<React.SetStateAction<boolean>>;
    localPlayerName: string;
    setLocalPlayerName: React.Dispatch<React.SetStateAction<string>>;
    getPlayerDisplayName: (pid: string) => string;
    inCheck: boolean;
  };
  isAllPlaced: boolean;
  isPlayerReady: (p: string) => boolean;
  initFromSeed: (seed: string, targetState?: GameState) => boolean;
  mode: GameMode;
  gameState: GameState;
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
    skipCheck?: boolean,
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
    isMercenary?: boolean,
  ) => void;
  randomizeTerrain: () => void;
  generateElementalTerrain: () => void;
  randomizeUnits: () => void;
  setClassicalFormation: () => void;
  applyChiGarden: () => void;
  resetToOmega: () => void;
  mirrorBoard: () => void;
  resetTerrain: () => void;
  resetUnits: () => void;
  setMode: (mode: GameMode) => void;
}

export interface BgioSync {
  synced: boolean;
}
