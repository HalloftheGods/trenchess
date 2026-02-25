import type { Ctx } from "boardgame.io";
import type { TrenchessState, GameMode, GameState, BoardPiece, TerrainType, PieceType } from "./game";
import type { MultiplayerState } from "./multiplayer";
import type { GameTheme } from "./ui";
import type { BoardState, TurnState, GameConfigState, GameCore, PlacementManager, MoveExecution, BoardInteraction, ZenGardenInteraction, SetupActions } from "./hooks";

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
  lastMove: TrenchessState["lastMove"];
  ready: (pid?: string) => void;
  finishGamemaster: () => void;
  forfeit: (pid?: string) => void;
  startGame: () => void;
  isStarted: boolean;
  multiplayer: MultiplayerState;
}
