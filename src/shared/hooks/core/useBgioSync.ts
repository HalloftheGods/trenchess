import { useState, useEffect, useRef } from "react";
import type { TrenchGameState } from "@game/Game";
import type { Ctx } from "boardgame.io";
import type { GameCore, BgioClient } from "./useGameLifecycle";

export interface BgioSync {
  synced: boolean;
}

export function useBgioSync(
  core: GameCore,
  bgioClientRef: React.MutableRefObject<BgioClient | undefined>,
): BgioSync {
  const { boardState, turnState, configState } = core;
  const {
    setBoard,
    setTerrain,
    setInventory,
    setTerrainInventory,
    setCapturedBy,
  } = boardState;
  const {
    setTurn,
    setWinner,
    setPlayerTypes,
    setLocalPlayerName,
    setActivePlayers,
    setReadyPlayers,
  } = turnState;
  const { mode, gameState, setGameState, setMode } = configState;

  const [synced, setSynced] = useState(false);
  const unsubscribeRef = useRef<() => void>(undefined);
  const gameStateRef = useRef(gameState);

  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  useEffect(() => {
    const bgioClient = bgioClientRef.current;
    if (!bgioClient) return;

    unsubscribeRef.current = bgioClient.subscribe(
      (state: { G: TrenchGameState; ctx: Ctx } | null) => {
        if (!state) return;

        const { G, ctx } = state;
        setBoard(G.board);
        setTerrain(G.terrain);
        setInventory(G.inventory);
        setTerrainInventory(G.terrainInventory);
        setCapturedBy(
          G.capturedBy || {
            red: [],
            yellow: [],
            green: [],
            blue: [],
          },
        );
        if (G.activePlayers) setActivePlayers(G.activePlayers);
        if (G.readyPlayers) setReadyPlayers(G.readyPlayers);
        if (G.mode && G.mode !== mode) setMode(G.mode);

        if (ctx.gameover !== undefined) {
          setWinner(ctx.gameover.winner || "draw");
        } else {
          setWinner(null);
        }

        const myPid = bgioClient.playerID;
        if (myPid && G.playerMap && G.playerMap[myPid]) {
          setLocalPlayerName(G.playerMap[myPid]);
        }

        if (G.playerMap && G.playerMap[ctx.currentPlayer]) {
          if (gameStateRef.current !== "setup") {
            setTurn(G.playerMap[ctx.currentPlayer]);
          } else if (bgioClient.matchID && myPid && G.playerMap[myPid]) {
            // In online games during setup, force the local UI turn to match their assigned slot
            setTurn(G.playerMap[myPid]);
          }
        }

        if (ctx.phase === "play" && gameStateRef.current === "setup") {
          setGameState("play");
        } else if (ctx.phase === "setup" && gameStateRef.current === "play") {
          setGameState("setup");
        }

        setSynced(true);
      },
    );

    return () => {
      if (unsubscribeRef.current) unsubscribeRef.current();
    };
  }, [
    bgioClientRef,
    setBoard,
    setCapturedBy,
    setGameState,
    setInventory,
    setPlayerTypes,
    setTerrain,
    setTerrainInventory,
    setTurn,
    setWinner,
    setMode,
    setActivePlayers,
    setReadyPlayers,
    setLocalPlayerName,
    mode,
  ]);

  return { synced };
}
