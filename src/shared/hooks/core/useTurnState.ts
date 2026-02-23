import { useState, useCallback } from "react";
import { PLAYER_CONFIGS } from "@constants/unit.constants";

export interface TurnState {
  turn: string;
  setTurn: React.Dispatch<React.SetStateAction<string>>;
  activePlayers: string[];
  setActivePlayers: React.Dispatch<React.SetStateAction<string[]>>;
  readyPlayers: Record<string, boolean>;
  setReadyPlayers: React.Dispatch<
    React.SetStateAction<Record<string, boolean>>
  >;
  playerTypes: Record<string, "human" | "computer">;
  setPlayerTypes: React.Dispatch<
    React.SetStateAction<Record<string, "human" | "computer">>
  >;
  winner: string | null;
  setWinner: React.Dispatch<React.SetStateAction<string | null>>;
  inCheck: boolean;
  setInCheck: React.Dispatch<React.SetStateAction<boolean>>;
  isThinking: boolean;
  setIsThinking: React.Dispatch<React.SetStateAction<boolean>>;
  localPlayerName: string;
  setLocalPlayerName: React.Dispatch<React.SetStateAction<string>>;
  getPlayerDisplayName: (pid: string) => string;
}

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
