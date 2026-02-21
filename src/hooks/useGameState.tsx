import { useRef, useEffect, useCallback } from "react";
import { useGameTheme } from "./useGameTheme";
import { useGameCore } from "./useGameCore";
import { useGameInteraction } from "./useGameInteraction";
import { useGameSetup } from "./useGameSetup";
import { useComputerOpponent } from "./useComputerOpponent";
import { useMultiplayer } from "./useMultiplayer";
import { useNavigate, useLocation } from "react-router-dom";
import { getPlayerCells } from "../utils/setupLogic";

import { Client } from "boardgame.io/client";
import { TrenchGame } from "../game/Game";

export function useGameState() {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useGameTheme();
  const core = useGameCore();

  const clientRef = useRef<any>(null);

  // Initialize boardgame.io client
  useEffect(() => {
    clientRef.current = Client({
      game: TrenchGame,
      numPlayers: 2, // Default
      // multiplayer: Local(), // For local testing
    });
    clientRef.current.start();

    const unsubscribe = clientRef.current.subscribe((state: any) => {
      if (!state) return;
      const { G, ctx } = state;

      // Map boardgame.io state (G) back to our existing core state
      // This is a bridge during migration
      core.setBoard(G.board);
      core.setTerrain(G.terrain);
      core.setInventory(G.inventory);
      core.setTerrainInventory(G.terrainInventory);
      core.setCapturedBy(G.capturedBy);
      core.setMode(G.mode);
      core.setActivePlayers(G.activePlayers);

      // Map turn (ctx.currentPlayer is "0", "1", etc)
      const PLAYER_ID_MAP: Record<string, string> = {
        "0": "player1",
        "1": "player2",
        "2": "player3",
        "3": "player4",
      };
      core.setTurn(PLAYER_ID_MAP[ctx.currentPlayer] || "player1");
    });

    return () => {
      clientRef.current.stop();
      unsubscribe();
    };
  }, [core]);

  // Ref to break circular dependency: onGameStateReceived needs multiplayer,
  // and useMultiplayer needs onGameStateReceived.
  const onGameStateReceivedRef = useRef<((state: any) => void) | null>(null);
  const onRemoteMoveRef = useRef<((move: any) => void) | null>(null);

  const multiplayer = useMultiplayer(
    (state) => onGameStateReceivedRef.current?.(state),
    (move) => {
      if (onRemoteMoveRef.current) {
        onRemoteMoveRef.current(move);
      }
    },
  );

  const onGameStateReceived = useCallback(
    (state: any) => {
      // Guard: Ignore our own updates if we're the sender
      if (state.senderId && state.senderId === multiplayer.socketId) {
        return;
      }

      // Menu Sync Handling
      if (state.type === "menu_sync") {
        if (state.selectedBoard) core.setMode(state.selectedBoard);
        if (state.selectedPreset) core.setSelectedPreset(state.selectedPreset);

        // Path sync
        const currentPath = location.pathname;
        const targetPath = state.path;
        if (targetPath && currentPath !== targetPath) {
          const step = state.step;
          const fullPath = step ? `${targetPath}?step=${step}` : targetPath;
          navigate(fullPath);
        }
        return;
      }

      if (state.board) {
        if (core.gameState === "setup" && state.senderId) {
          const players = multiplayer.players;
          const senderIdx = players.indexOf(state.senderId);
          if (senderIdx !== -1) {
            const playerKey = core.activePlayers[senderIdx];
            const senderCells = getPlayerCells(playerKey, core.mode);

            core.setBoard((prev) => {
              if (!prev || prev.length === 0) return state.board;
              const next = prev.map((row) => [...row]);
              const incoming = state.board;
              for (const [r, c] of senderCells) {
                if (incoming[r] && incoming[r][c] !== undefined) {
                  next[r][c] = incoming[r][c];
                }
              }
              return next;
            });
          }
        } else {
          core.setBoard(state.board);
        }
      }
      if (state.terrain) {
        if (core.gameState === "setup" && state.senderId) {
          const players = multiplayer.players;
          const senderIdx = players.indexOf(state.senderId);
          if (senderIdx !== -1) {
            const playerKey = core.activePlayers[senderIdx];
            const senderCells = getPlayerCells(playerKey, core.mode);

            core.setTerrain((prev) => {
              if (!prev || prev.length === 0) return state.terrain;
              const next = prev.map((row) => [...row]);
              const incoming = state.terrain;
              for (const [r, c] of senderCells) {
                if (incoming[r] && incoming[r][c]) {
                  next[r][c] = incoming[r][c];
                }
              }
              return next;
            });
          }
        } else {
          core.setTerrain(state.terrain);
        }
      }

      // Inventory Sync (Crucial for stats stability)
      if (state.inventory) {
        if (core.gameState === "setup" && state.senderId) {
          const players = multiplayer.players;
          const senderIdx = players.indexOf(state.senderId);
          if (senderIdx !== -1) {
            const playerKey = core.activePlayers[senderIdx];
            core.setInventory((prev) => ({
              ...prev,
              [playerKey]: state.inventory[playerKey] || [],
            }));
          }
        } else {
          core.setInventory(state.inventory);
        }
      }

      if (state.terrainInventory) {
        if (core.gameState === "setup" && state.senderId) {
          const players = multiplayer.players;
          const senderIdx = players.indexOf(state.senderId);
          if (senderIdx !== -1) {
            const playerKey = core.activePlayers[senderIdx];
            core.setTerrainInventory((prev) => ({
              ...prev,
              [playerKey]: state.terrainInventory[playerKey] || [],
            }));
          }
        } else {
          core.setTerrainInventory(state.terrainInventory);
        }
      }

      if (state.turn) core.setTurn(state.turn);
      if (state.capturedBy) core.setCapturedBy(state.capturedBy);
      if (state.mode) core.setMode(state.mode);
      if (state.activePlayers) core.setActivePlayers(state.activePlayers);
      if (state.gameState) core.setGameState(state.gameState);
    },
    [
      core,
      navigate,
      location.pathname,
      multiplayer.socketId,
      multiplayer.players,
    ],
  );

  // Sync the ref
  useEffect(() => {
    onGameStateReceivedRef.current = onGameStateReceived;
  }, [onGameStateReceived]);

  // Sync Game Start: When host enters "play", broadcast the initial state
  useEffect(() => {
    if (
      multiplayer.isHost &&
      multiplayer.isConnected &&
      multiplayer.roomId &&
      (core.gameState === "play" || core.gameState === "setup")
    ) {
      multiplayer.sendGameState({
        senderId: multiplayer.socketId,
        gameState: core.gameState,
        mode: core.mode,
        board: core.board,
        terrain: core.terrain,
        turn: core.turn,
        capturedBy: core.capturedBy,
        activePlayers: core.activePlayers,
      });
    }
  }, [
    core.gameState,
    multiplayer.isHost,
    multiplayer.isConnected,
    multiplayer.roomId,
    core.mode,
    core.board,
    core.terrain,
    core.turn,
    core.capturedBy,
    core.activePlayers,
  ]);

  // Handle local setup changes broadcasting
  useEffect(() => {
    if (
      core.gameState === "setup" &&
      multiplayer.isConnected &&
      multiplayer.roomId &&
      multiplayer.socketId
    ) {
      multiplayer.sendGameState({
        type: "setup_update",
        senderId: multiplayer.socketId,
        board: core.board,
        terrain: core.terrain,
        inventory: core.inventory,
        terrainInventory: core.terrainInventory,
      });
    }
  }, [
    core.board,
    core.terrain,
    core.gameState,
    multiplayer.isConnected,
    multiplayer.roomId,
    multiplayer.socketId,
  ]);

  const interaction = useGameInteraction(
    core,
    multiplayer,
    (move) => {
      if (multiplayer.isConnected) {
        // Send local move to server (Legacy sync - keep for now as fallback)
        multiplayer.sendMove(move);
      }
      // boardgame.io moves go here
      clientRef.current?.moves.movePiece(move.from, move.to);
    },
    clientRef.current,
  );

  // Update the ref to point to the current executeMove
  useEffect(() => {
    onRemoteMoveRef.current = (move: any) => {
      const { from, to } = move;
      // Execute as AI move (true) to skip broadcasting back
      interaction.executeMove(from[0], from[1], to[0], to[1], true);
    };
  }, [interaction.executeMove]);

  const setup = useGameSetup(core, interaction, clientRef.current);

  useComputerOpponent({
    gameState: core.gameState,
    turn: core.turn,
    board: core.board,
    terrain: core.terrain,
    mode: core.mode,
    playerTypes: core.playerTypes,
    executeMove: interaction.executeMove,
    winner: core.winner,
    setIsThinking: core.setIsThinking,
  });

  return {
    ...theme,
    ...core,
    ...interaction,
    ...setup,
    multiplayer, // Expose multiplayer controls to UI
  };
}
