import React from "react";
import type { GameMode } from "../core/GameMode";
import type { GameState } from "../core/GameState";
import type { GameConfigState } from "./GameConfigState";
import type { Dictionary, PlayerID } from "../../base";

export interface GameCore {
  configState: GameConfigState;
  turnState: {
    playerTypes: Dictionary<"human" | "computer">;
    setPlayerTypes: React.Dispatch<
      React.SetStateAction<Dictionary<"human" | "computer">>
    >;
    isThinking: boolean;
    setIsThinking: React.Dispatch<React.SetStateAction<boolean>>;
    localPlayerName: string;
    setLocalPlayerName: React.Dispatch<React.SetStateAction<string>>;
    getPlayerDisplayName: (pid: PlayerID) => string;
    inCheck: boolean;
  };
  isAllPlaced: boolean;
  isPlayerReady: (p: PlayerID) => boolean;
  initFromSeed: (seed: string, targetState?: GameState) => boolean;
  mode: GameMode;
  gameState: GameState;
}
