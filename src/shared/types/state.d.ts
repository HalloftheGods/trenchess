import type { Ctx } from "boardgame.io";
import type { TrenchessState } from "./game";
import type { MultiplayerState } from "./multiplayer";
import type { GameTheme } from "./ui";
import type {
  GameConfigState,
  GameCore,
  PlacementManager,
  MoveExecution,
  BoardInteraction,
  ZenGardenInteraction,
  SetupActions,
} from "./hooks";

export interface GameStateHook
  extends
    GameTheme,
    GameConfigState,
    GameCore,
    PlacementManager,
    MoveExecution,
    BoardInteraction,
    ZenGardenInteraction,
    SetupActions {
  bgioState: { G: TrenchessState; ctx: Ctx } | null;
  board: TrenchessState["board"];
  terrain: TrenchessState["terrain"];
  inventory: TrenchessState["inventory"];
  terrainInventory: TrenchessState["terrainInventory"];
  capturedBy: TrenchessState["capturedBy"];
  lastMove: TrenchessState["lastMove"];
  activePlayers: TrenchessState["activePlayers"];
  readyPlayers: TrenchessState["readyPlayers"];
  localPlayerName: string;
  turn: string;
  winner: string | null;
  winnerReason: string | null;
  isStarted: boolean;

  // UI Side State (Promoted from turnState)
  playerTypes: Record<string, "human" | "computer">;
  setPlayerTypes: React.Dispatch<
    React.SetStateAction<Record<string, "human" | "computer">>
  >;
  setLocalPlayerName: React.Dispatch<React.SetStateAction<string>>;
  getPlayerDisplayName: (pid: string) => string;
  inCheck: boolean;

  // Setters for Design/Simulation Modes
  setTurn?: (turn: string) => void;
  setActivePlayers?: (players: string[]) => void;
  setBoard?: (board: (BoardPiece | null)[][]) => void;
  setTerrain?: (terrain: TerrainType[][]) => void;
  setInventory?: (inventory: Record<string, PieceType[]>) => void;
  setReadyPlayers?: React.Dispatch<
    React.SetStateAction<Record<string, boolean>>
  >;

  multiplayer: MultiplayerState & {
    readyPlayers: Record<string, boolean>;
    toggleReady: () => void;
  };
  dispatch: (command: string) => void;
  patchG: (patch: Partial<TrenchessState>) => void;
  authorizeMasterProtocol: () => void;
  ready: (pid?: string) => void;
  startGame: () => void;
  finishGamemaster: () => void;
  forfeit: (pid?: string) => void;
  setPhase: (phase: string) => void;
  setGameState: (phase: string) => void;
  setMode: (mode: GameMode) => void;
  mode: GameMode;
  activeMode: GameMode;
  gameState: GameState;
}
