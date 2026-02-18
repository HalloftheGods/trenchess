import { useRef, useEffect, useCallback } from "react";
import { useGameTheme } from "./useGameTheme";
import { useGameCore } from "./useGameCore";
import { useGameInteraction } from "./useGameInteraction";
import { useGameSetup } from "./useGameSetup";
import { useComputerOpponent } from "./useComputerOpponent";
import { useMultiplayer } from "./useMultiplayer";

export function useGameState() {
  const theme = useGameTheme();
  const core = useGameCore();

  // Ref to hold the move handler to avoid circular dependency
  // between useMultiplayer (needs handler) and useGameInteraction (provides handler)
  const onRemoteMoveRef = useRef<((move: any) => void) | null>(null);

  const onGameStateReceived = useCallback(
    (state: any) => {
      if (state.board) core.setBoard(state.board);
      if (state.terrain) core.setTerrain(state.terrain);
      if (state.turn) core.setTurn(state.turn);
      if (state.capturedBy) core.setCapturedBy(state.capturedBy);
      if (state.mode) core.setMode(state.mode);
      if (state.activePlayers) core.setActivePlayers(state.activePlayers);
      if (state.gameState) core.setGameState(state.gameState);
    },
    [core],
  );

  const multiplayer = useMultiplayer(onGameStateReceived, (move) => {
    if (onRemoteMoveRef.current) {
      onRemoteMoveRef.current(move);
    }
  });

  // Sync Game Start: When host enters "play", broadcast the initial state
  useEffect(() => {
    if (
      multiplayer.isHost &&
      multiplayer.isConnected &&
      core.gameState === "play"
    ) {
      multiplayer.sendGameState({
        gameState: "play",
        mode: core.mode,
        board: core.board,
        terrain: core.terrain,
        turn: core.turn,
        capturedBy: core.capturedBy,
        activePlayers: core.activePlayers,
      });
    }
    // We only want to trigger this when gameState changes to play.
    // Adding core.board to dependency might trigger excessive updates?
    // But we need the *current* board.
    // Let's rely on gameState transition.
  }, [core.gameState, multiplayer.isHost, multiplayer.isConnected]);

  const interaction = useGameInteraction(core, (move) => {
    if (multiplayer.isConnected) {
      // Send local move to server
      multiplayer.sendMove(move);
    }
  });

  // Update the ref to point to the current executeMove
  useEffect(() => {
    onRemoteMoveRef.current = (move: any) => {
      const { from, to } = move;
      // Execute as AI move (true) to skip broadcasting back
      interaction.executeMove(from[0], from[1], to[0], to[1], true);
    };
  }, [interaction.executeMove]);

  const setup = useGameSetup(core, interaction);

  useComputerOpponent({
    gameState: core.gameState,
    turn: core.turn,
    board: core.board,
    terrain: core.terrain,
    mode: core.mode,
    playerTypes: core.playerTypes,
    executeMove: interaction.executeMove,
    winner: core.winner,
  });

  return {
    ...theme,
    ...core,
    ...interaction,
    ...setup,
    multiplayer, // Expose multiplayer controls to UI
  };
}
