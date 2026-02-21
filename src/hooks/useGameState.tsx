import { useRef, useEffect, useCallback } from "react";
import { useGameTheme } from "./useGameTheme";
import { useGameCore } from "./useGameCore";
import { useGameInteraction } from "./useGameInteraction";
import { useGameSetup } from "./useGameSetup";
import { useComputerOpponent } from "./useComputerOpponent";
import { useMultiplayer } from "./useMultiplayer";
import { useNavigate, useLocation } from "react-router-dom";
import { getPlayerCells } from "../utils/setup/setupLogic";

import { Client } from "boardgame.io/client";
import { TrenchGame } from "../game/Game";

export function useGameState() {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useGameTheme();
  const core = useGameCore();

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

  const clientRef = useRef<any>(null);
  const unsubscribeRef = useRef<(() => void) | null>(null);
  const lastClientParamsRef = useRef<{
    playerID?: string;
    numPlayers?: number;
    gameState?: string;
  }>({});
  // Use refs for values needed in the boardgame.io subscription
  // to avoid re-subscribing when they change, yet always having latest values.
  const gameStateRef = useRef(core.gameState);
  const roomIdRef = useRef(multiplayer.roomId);
  const isConnectedRef = useRef(multiplayer.isConnected);

  useEffect(() => {
    gameStateRef.current = core.gameState;
    roomIdRef.current = multiplayer.roomId;
    isConnectedRef.current = multiplayer.isConnected;

    // Reset local identity if we are not in a room
    if (!multiplayer.roomId && core.localPlayerName) {
      core.setLocalPlayerName("");
    }
  }, [
    core.gameState,
    multiplayer.roomId,
    multiplayer.isConnected,
    core.localPlayerName,
  ]);

  const syncWithClient = useCallback(
    (client: any) => {
      if (unsubscribeRef.current) unsubscribeRef.current();

      const {
        setBoard,
        setTerrain,
        setInventory,
        setTerrainInventory,
        setCapturedBy,
        setMode,
        setActivePlayers,
        setTurn,
      } = core;

      unsubscribeRef.current = client.subscribe((state: any) => {
        if (!state) return;
        const { G, ctx } = state;

        // In multiplayer setup, the Socket.io sync is the source of truth.
        if (
          gameStateRef.current === "setup" &&
          roomIdRef.current &&
          isConnectedRef.current
        ) {
          // Skip boardgame.io sync during setup to prevent overwriting local placements
        } else {
          setBoard(G.board);
          setTerrain(G.terrain);
          setInventory(G.inventory);
          setTerrainInventory(G.terrainInventory);
          setCapturedBy(G.capturedBy);
          setMode(G.mode);
          setActivePlayers(G.activePlayers);
        }

        const PLAYER_ID_MAP: Record<string, string> = {
          "0": "player1",
          "1": "player2",
          "2": "player3",
          "3": "player4",
        };
        setTurn(PLAYER_ID_MAP[ctx.currentPlayer] || "player1");

        // Sync local player identity
        const myPid = client.playerID; // "0", "1", etc.
        if (myPid && G.playerMap && G.playerMap[myPid]) {
          core.setLocalPlayerName(G.playerMap[myPid]);
        } else if (myPid && PLAYER_ID_MAP[myPid]) {
          core.setLocalPlayerName(PLAYER_ID_MAP[myPid]);
        }
      });
    },
    // Stabilize by only depending on setters which are guaranteed stable by React/hooks
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      core.setBoard,
      core.setTerrain,
      core.setInventory,
      core.setTerrainInventory,
      core.setCapturedBy,
      core.setMode,
      core.setActivePlayers,
      core.setTurn,
    ],
  );

  // Initialize boardgame.io client
  useEffect(() => {
    const numPlayers = core.mode === "4p" ? 4 : 2;
    console.log("useGameState: Initializing client");
    const setupData = {
      mode: core.mode,
      board: core.board,
      terrain: core.terrain,
      inventory: core.inventory,
      terrainInventory: core.terrainInventory,
    };

    clientRef.current = Client({
      game: TrenchGame,
      numPlayers,
      debug: false,
      setupData,
    } as any);
    clientRef.current.start();

    lastClientParamsRef.current = { numPlayers };
    syncWithClient(clientRef.current);

    return () => {
      clientRef.current?.stop();
      if (unsubscribeRef.current) unsubscribeRef.current();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update client with playerID when playerIndex is available
  useEffect(() => {
    if (
      multiplayer.isConnected &&
      multiplayer.playerIndex !== null &&
      multiplayer.playerIndex !== undefined
    ) {
      const playerID = String(multiplayer.playerIndex);
      const numPlayers = core.mode === "4p" ? 4 : 2;

      if (
        lastClientParamsRef.current.playerID === playerID &&
        lastClientParamsRef.current.numPlayers === numPlayers &&
        lastClientParamsRef.current.gameState === core.gameState
      ) {
        return;
      }

      console.log(
        "useGameState: Re-initializing client. Reason: ID/Num/State change",
        { playerID, numPlayers, gameState: core.gameState },
      );

      if (clientRef.current) {
        clientRef.current.stop();
      }

      const setupData = {
        mode: core.mode,
        board: core.board,
        terrain: core.terrain,
        inventory: core.inventory,
        terrainInventory: core.terrainInventory,
      };

      clientRef.current = Client({
        game: TrenchGame,
        numPlayers,
        debug: false,
        playerID,
        setupData,
      } as any);
      clientRef.current.start();

      lastClientParamsRef.current = {
        playerID,
        numPlayers,
        gameState: core.gameState,
      };
      syncWithClient(clientRef.current);
    }
  }, [
    multiplayer.playerIndex,
    multiplayer.isConnected,
    syncWithClient,
    core.mode,
    core.gameState,
  ]);

  const onGameStateReceived = useCallback(
    (state: any) => {
      // Guard: Ignore our own updates if we're the sender
      if (state.senderId && state.senderId === multiplayer.socketId) {
        return;
      }

      // Menu Sync Handling
      if (state.type === "menu_sync") {
        console.log("Multiplayer: Syncing Menu", state);
        if (state.selectedBoard) core.setMode(state.selectedBoard);
        if (state.selectedPreset) core.setSelectedPreset(state.selectedPreset);

        // Path sync
        const currentPath = location.pathname;
        const targetPath = state.path;
        if (targetPath && currentPath !== targetPath) {
          const step = state.step;
          const fullPath = step ? `${targetPath}?step=${step}` : targetPath;
          console.log("Multiplayer: Navigating to", fullPath);
          navigate(fullPath);

          // Force local gameState sync based on path if sync didn't include it
          if (targetPath.includes("/play/lobby")) core.setGameState("menu");
          if (targetPath.includes("/play/setup")) core.setGameState("setup");
          if (targetPath.includes("/play/game")) core.setGameState("play");
        }
        return;
      }

      console.log(
        "Multiplayer: Received Sync:",
        state.type || "state_update",
        state.gameState,
        state.mode,
      );

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

      // When transitioning from setup to play in multiplayer,
      // we need to ensure the boardgame.io client is synced.
      if (
        state.gameState === "play" &&
        core.gameState === "setup" &&
        multiplayer.roomId
      ) {
      }

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

  // --- Consolidated Broadcast Logic ---
  const lastBroadcastRef = useRef<number>(0);
  const broadcastThrottle = 500; // ms

  useEffect(() => {
    if (
      !multiplayer.isConnected ||
      !multiplayer.roomId ||
      !multiplayer.socketId
    )
      return;

    // Only broadcast if we ARE the host (for game state) OR if we are in setup (active placement)
    const isGameActive =
      core.gameState === "play" || core.gameState === "finished";
    const isSetupActive = core.gameState === "setup";

    if (multiplayer.isHost && isGameActive) {
      // Throttle game state broadcasts from host
      const now = Date.now();
      if (now - lastBroadcastRef.current < broadcastThrottle) return;
      lastBroadcastRef.current = now;

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
    } else if (isSetupActive) {
      // Setup updates: every player broadcasts their own state (merged on receiver)
      // We still throttle to prevent flooding
      const now = Date.now();
      if (now - lastBroadcastRef.current < broadcastThrottle) return;
      lastBroadcastRef.current = now;

      multiplayer.sendGameState({
        type: "setup_update",
        senderId: multiplayer.socketId,
        gameState: core.gameState,
        mode: core.mode,
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
    core.turn,
    core.mode,
    core.capturedBy,
    core.activePlayers,
    core.inventory,
    core.terrainInventory,
    multiplayer.isConnected,
    multiplayer.roomId,
    multiplayer.socketId,
    multiplayer.isHost,
  ]);

  // Host-side final sync trigger when starting game
  useEffect(() => {
    if (
      core.gameState === "play" &&
      multiplayer.isHost &&
      multiplayer.roomId &&
      multiplayer.isConnected
    ) {
      console.log("Multiplayer Host: Final Sync started");
    }
  }, [
    core.gameState,
    multiplayer.isHost,
    multiplayer.roomId,
    multiplayer.isConnected,
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
  } as any;
}
