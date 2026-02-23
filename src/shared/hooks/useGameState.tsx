import { useRef, useEffect, useCallback, useState } from "react";
import { useGameTheme } from "@hooks/useGameTheme";
import { useGameCore } from "@hooks/useGameCore";
import { useGameInteraction } from "@hooks/useGameInteraction";
import { useGameSetup } from "@hooks/useGameSetup";
import { useComputerOpponent } from "@hooks/useComputerOpponent";
import { useMultiplayer, getServerUrl } from "@hooks/useMultiplayer";

import { Client } from "boardgame.io/client";
import { SocketIO } from "boardgame.io/multiplayer";
import { TrenchGame } from "@game/Game";

export function useGameState() {
  const theme = useGameTheme();
  const core = useGameCore();
  const multiplayer = useMultiplayer();

  const [bgioState, setBgioState] = useState<{ G: any; ctx: any } | null>(null);

  const clientRef = useRef<any>(null);
  const unsubscribeRef = useRef<(() => void) | null>(null);
  const lastClientParamsRef = useRef<{
    playerID?: string;
    numPlayers?: number;
    gameState?: string;
    roomId?: string;
    debug?: boolean;
  }>({});

  const gameStateRef = useRef(core.gameState);
  const roomIdRef = useRef(multiplayer.roomId);
  const isConnectedRef = useRef(multiplayer.isConnected);
  const latestSetupDataRef = useRef({
    board: core.board,
    terrain: core.terrain,
    inventory: core.inventory,
    terrainInventory: core.terrainInventory,
  });

  useEffect(() => {
    gameStateRef.current = core.gameState;
    roomIdRef.current = multiplayer.roomId;
    isConnectedRef.current = multiplayer.isConnected;

    latestSetupDataRef.current = {
      board: core.board,
      terrain: core.terrain,
      inventory: core.inventory,
      terrainInventory: core.terrainInventory,
    };

    // Reset local identity if we are not in a room
    if (!multiplayer.roomId && core.localPlayerName) {
      core.setLocalPlayerName("");
    }
  }, [
    core.gameState,
    multiplayer.roomId,
    multiplayer.isConnected,
    core.localPlayerName,
    core.board,
    core.terrain,
    core.inventory,
    core.terrainInventory,
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
        setReadyPlayers,
      } = core;

      unsubscribeRef.current = client.subscribe((state: any) => {
        if (!state) return;
        const { G, ctx } = state;

        setBgioState({ G, ctx });

        // Only update if state actually changed to prevent infinite render loops
        setBoard((prev: any) =>
          JSON.stringify(prev) === JSON.stringify(G.board) ? prev : G.board,
        );
        setTerrain((prev: any) =>
          JSON.stringify(prev) === JSON.stringify(G.terrain) ? prev : G.terrain,
        );
        setInventory((prev: any) =>
          JSON.stringify(prev) === JSON.stringify(G.inventory)
            ? prev
            : G.inventory,
        );
        setTerrainInventory((prev: any) =>
          JSON.stringify(prev) === JSON.stringify(G.terrainInventory)
            ? prev
            : G.terrainInventory,
        );
        setCapturedBy((prev: any) =>
          JSON.stringify(prev) === JSON.stringify(G.capturedBy)
            ? prev
            : G.capturedBy,
        );
        setMode((prev: any) => (prev === G.mode ? prev : G.mode));
        setActivePlayers((prev: any) =>
          JSON.stringify(prev) === JSON.stringify(G.activePlayers)
            ? prev
            : G.activePlayers,
        );
        setReadyPlayers((prev: any) =>
          JSON.stringify(prev) === JSON.stringify(G.readyPlayers || {})
            ? prev
            : G.readyPlayers || {},
        );

        if (gameStateRef.current !== "setup") {
          if (G.playerMap && G.playerMap[ctx.currentPlayer]) {
            setTurn(G.playerMap[ctx.currentPlayer]);
          } else {
            setTurn("player1");
          }
        }

        if (ctx.phase && core.gameState !== ctx.phase) {
          core.setGameState(ctx.phase);
        }

        // Sync local player identity
        const myPid = client.playerID; // "0", "1", etc.
        if (myPid && G.playerMap && G.playerMap[myPid]) {
          core.setLocalPlayerName(G.playerMap[myPid]);
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
      core.setReadyPlayers,
      core.setGameState,
      core.gameState,
    ],
  );

  const initClient = useCallback(() => {
    console.log("useGameState: Initializing client");
    const numPlayers = core.mode === "4p" ? 4 : 2;
    const playerID =
      multiplayer.playerIndex !== null ? String(multiplayer.playerIndex) : "0";

    // Grab the current state JUST for initial setup. We don't want to re-init
    // the client every time these states change during gameplay.
    const setupData = {
      mode: core.mode,
      ...latestSetupDataRef.current,
    };

    const clientConfig: any = {
      game: TrenchGame,
      numPlayers,
      debug: core.showBgDebug,
      playerID,
      setupData,
    };

    if (multiplayer.roomId && multiplayer.playerCredentials) {
      clientConfig.multiplayer = SocketIO({ server: getServerUrl() });
      clientConfig.matchID = multiplayer.roomId;
      clientConfig.credentials = multiplayer.playerCredentials;
    }

    if (clientRef.current) {
      clientRef.current.stop();
      if (unsubscribeRef.current) unsubscribeRef.current();
    }

    clientRef.current = Client(clientConfig);
    clientRef.current.start();

    lastClientParamsRef.current = {
      playerID,
      numPlayers,
      gameState: core.gameState,
      roomId: multiplayer.roomId || undefined,
    };

    syncWithClient(clientRef.current);
  }, [
    core.mode,
    core.gameState,
    multiplayer.playerIndex,
    multiplayer.roomId,
    multiplayer.playerCredentials,
    syncWithClient,
    core.showBgDebug,
    // We EXCLUDE board, terrain, inventory, terrainInventory here because
    // the client handles its own internal state after initialization.
    // Including them causes an infinite re-render loop when syncWithClient sets them.
  ]);

  // Initial setup OR when core connectivity params change OR transitions from setup->play
  useEffect(() => {
    const playerID =
      multiplayer.playerIndex !== null ? String(multiplayer.playerIndex) : "0";

    const localParams = lastClientParamsRef.current;
    if (
      localParams.playerID !== playerID ||
      localParams.roomId !== multiplayer.roomId ||
      localParams.debug !== core.showBgDebug
    ) {
      initClient();
      localParams.playerID = playerID;
      localParams.roomId = multiplayer.roomId || undefined;
      localParams.debug = core.showBgDebug;
      localParams.gameState = core.gameState;
    }
  }, [
    multiplayer.playerIndex,
    multiplayer.roomId,
    core.showBgDebug,
    core.gameState,
    initClient,
  ]);

  const interaction = useGameInteraction(
    core,
    multiplayer,
    (move) => {
      // Execute the move directly through the boardgame.io client, which handles syncing
      clientRef.current?.moves.movePiece(move.from, move.to);
    },
    clientRef.current,
  );

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
    bgioState,
    multiplayer: {
      ...multiplayer,
      toggleReady: (_isReady: boolean) => {
        if (clientRef.current) {
          clientRef.current.moves.ready();
        }
      },
    },
  } as any;
}
