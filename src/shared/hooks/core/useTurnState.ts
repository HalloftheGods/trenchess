import { useState, useCallback } from "react";
import { PLAYER_CONFIGS } from "@/core/constants/unit.constants";
import type { TurnState } from "@/shared/types";

export function useTurnState(): TurnState {
  const [turn, setTurn] = useState("red");
  const [activePlayers, setActivePlayers] = useState(["red", "blue"]);
  const [readyPlayers, setReadyPlayers] = useState<Record<string, boolean>>({});
  const [playerTypes, setPlayerTypes] = useState<
    Record<string, "human" | "computer">
  >({
    red: "human",
    yellow: "human",
    green: "human",
    blue: "human",
  });
  const [winner, setWinner] = useState<string | null>(null);
  const [inCheck, setInCheck] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [localPlayerName, setLocalPlayerName] = useState("");

  const getPlayerDisplayName = useCallback((pid: string) => {
    return PLAYER_CONFIGS[pid]?.name.toUpperCase() || pid.toUpperCase();
  }, []);

  return {
    turn,
    setTurn,
    activePlayers,
    setActivePlayers,
    readyPlayers,
    setReadyPlayers,
    playerTypes,
    setPlayerTypes,
    winner,
    setWinner,
    inCheck,
    setInCheck,
    isThinking,
    setIsThinking,
    localPlayerName,
    setLocalPlayerName,
    getPlayerDisplayName,
  };
}
