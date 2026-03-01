import React from "react";
import type { Ctx } from "boardgame.io";
import type { GameMode, GameState } from "../core";
import type { TrenchessState } from "../state";
import type { MultiplayerState } from "../multiplayer";
import type { GameTheme } from "../../ux";
import type { GameConfigState } from "./GameConfigState";
import type { GameCore } from "./GameCore";
import type { PlacementManager } from "./PlacementManager";
import type { MoveExecution } from "./MoveExecution";
import type { BoardInteraction } from "./BoardInteraction";
import type { ZenGardenInteraction } from "./ZenGardenInteraction";
import type { SetupActions } from "./SetupActions";
import type {
  BooleanDictionary,
  Dictionary,
  PlayerID,
  PieceInventory,
  TerrainInventory,
  BoardGrid,
  TerrainGrid,
} from "../../base";

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
  isConnected: boolean;
  isOnline: boolean;
  board: BoardGrid;
  terrain: TerrainGrid;
  inventory: PieceInventory;
  terrainInventory: TerrainInventory;
  capturedBy: TrenchessState["capturedBy"];
  lastMove: TrenchessState["lastMove"];
  activePlayers: TrenchessState["activePlayers"];
  readyPlayers: BooleanDictionary;
  localPlayerName: string;
  turn: PlayerID;
  winner: PlayerID | null;
  winnerReason: string | null;
  isStarted: boolean;

  // UI Side State (Promoted from turnState)
  playerTypes: Dictionary<"human" | "computer">;
  setPlayerTypes: React.Dispatch<
    React.SetStateAction<Dictionary<"human" | "computer">>
  >;
  setLocalPlayerName: React.Dispatch<React.SetStateAction<string>>;
  getPlayerDisplayName: (pid: PlayerID) => string;
  inCheck: boolean;

  // Setters for Design/Simulation Modes
  setTurn?: (turn: PlayerID) => void;
  setActivePlayers?: (players: PlayerID[]) => void;
  setBoard?: (board: BoardGrid) => void;
  setTerrain?: (terrain: TerrainGrid) => void;
  setInventory?: (inventory: PieceInventory) => void;
  setReadyPlayers?: React.Dispatch<React.SetStateAction<BooleanDictionary>>;

  multiplayer: MultiplayerState & {
    readyPlayers: BooleanDictionary;
    toggleReady: () => void;
  };
  dispatch: (command: string) => void;
  patchG: (patch: Partial<TrenchessState>) => void;
  authorizeMasterProtocol: () => void;
  setActiveScreen: (screenId: string | undefined) => void;
  ready: (pid?: PlayerID) => void;
  startGame: () => void;
  finishGamemaster: () => void;
  forfeit: (pid?: PlayerID) => void;
  setPhase: (phase: string) => void;
  setGameState: (phase: string) => void;
  setMode: (mode: GameMode) => void;
  mode: GameMode;
  activeMode: GameMode;
  gameState: GameState;
  saveConfig: () => void;
  loadConfig: () => boolean;
}
