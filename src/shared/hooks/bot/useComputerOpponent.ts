import { useEffect, useRef } from "react";
import { useAiDecision } from "./useAiDecision";
import { engineService } from "@/app/core/bot/stockfishLogic";
import { PHASES } from "@constants/game";
import type { GameMode, BoardPiece, TerrainType, BgioClient } from "@tc.types";

interface UseComputerOpponentProps {
  gameState: string;
  turn: string;
  board: (BoardPiece | null)[][];
  terrain: TerrainType[][];
  mode: GameMode;
  playerTypes: Record<string, "human" | "computer">;
  executeMove: (
    fr: number,
    fc: number,
    tr: number,
    tc: number,
    isAi?: boolean,
  ) => void;
  winner: string | null;
  setIsThinking: (thinking: boolean) => void;
  activePlayers?: string[];
  readyPlayers?: Record<string, boolean>;
  clientRef?: React.RefObject<BgioClient | undefined>;
}

export function useComputerOpponent({
  gameState,
  turn,
  board,
  terrain,
  mode,
  playerTypes,
  executeMove,
  winner,
  setIsThinking,
  activePlayers = [],
  readyPlayers = {},
  clientRef,
}: UseComputerOpponentProps) {
  const { getDecision } = useAiDecision();
  const isThinkingRef = useRef(false);

  useEffect(() => {
    const hasComputer = Object.values(playerTypes).includes("computer");
    if (hasComputer) {
      engineService.preload();
    }
  }, [playerTypes]);

  // COMBAT Turn Handling
  useEffect(() => {
    let isCancelled = false;

    const shouldThink =
      gameState === PHASES.COMBAT &&
      !winner &&
      playerTypes[turn] === "computer";

    if (!shouldThink) {
      if (isThinkingRef.current) {
        isThinkingRef.current = false;
        setIsThinking(false);
      }
      return;
    }

    const runAi = async () => {
      if (isThinkingRef.current) return;

      isThinkingRef.current = true;
      setIsThinking(true);

      const move = await getDecision(board, terrain, turn, mode);

      if (isCancelled) return;

      isThinkingRef.current = false;
      setIsThinking(false);

      if (move) {
        executeMove(move.from[0], move.from[1], move.to[0], move.to[1], true);
      }
    };

    // No setTimeout, we yield control purely by async Stockfish requests which run in Workers.
    void runAi();

    return () => {
      isCancelled = true;
    };
  }, [
    gameState,
    turn,
    board,
    terrain,
    mode,
    playerTypes,
    winner,
    executeMove,
    setIsThinking,
    getDecision,
  ]);

  // GENESIS Deployment Handling
  useEffect(() => {
    if (gameState === PHASES.GENESIS) {
      const client = clientRef?.current;
      if (!client) return;

      activePlayers.forEach((pid) => {
        if (playerTypes[pid] === "computer" && !readyPlayers[pid]) {
          console.log(`[GENESIS] Auto-deploying computer player: ${pid}`);
          // Force apply classical deployment and mark explicitly ready
          client.moves.setClassicalFormation(pid);
          client.moves.ready(pid);
        }
      });
    }
  }, [gameState, activePlayers, playerTypes, readyPlayers, clientRef]);

  // GAMEMASTER Deployment Handling
  useEffect(() => {
    if (gameState === PHASES.GAMEMASTER) {
      const client = clientRef?.current;
      if (!client) return;

      if (playerTypes[turn] === "computer") {
        console.log(`[GAMEMASTER] Auto-deploying computer player: ${turn}`);
        // Force apply classical deployment and mark explicitly ready
        client.moves.setClassicalFormation(turn);
        client.moves.ready(turn);

        // Advance turn automatically
        const currentIndex = activePlayers.indexOf(turn);
        const nextIndex = (currentIndex + 1) % activePlayers.length;
        client.moves.setTurn(activePlayers[nextIndex]);
      }
    }
  }, [gameState, turn, activePlayers, playerTypes, clientRef]);
}
