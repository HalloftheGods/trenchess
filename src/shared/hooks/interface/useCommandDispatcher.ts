import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useTerminal } from "@/shared/context/TerminalContext";
import { ROUTES } from "@constants/routes";
import type { GameStateHook } from "@/shared/types";

export const useCommandDispatcher = (game: GameStateHook) => {
  const { addLog, clearHistory } = useTerminal();
  const navigate = useNavigate();

  const dispatch = useCallback(
    (command: string) => {
      addLog("command", command);
      const [cmd, ...args] = command.trim().split(" ");
      const action = cmd.toLowerCase();

      switch (action) {
        case "help":
          addLog(
            "info",
            "COMMANDS: play <style>, mmo, zen, master, turn <pid>, phase <name>, clear, exit, goto <path>, reset, omega, pi, chi, random, mirror, status",
          );
          break;
        case "status":
          addLog(
            "info",
            `ENGINE STATUS: Phase=${game.gameState}, Turn=${game.turn}, Mode=${game.mode}`,
          );
          break;
        case "turn":
          if (args[0]) {
            game.setTurn?.(args[0]);
            addLog("response", `Forcing turn to ${args[0]}...`);
          } else {
            addLog("error", "Usage: turn <pid>");
          }
          break;
        case "phase":
          if (args[0]) {
            if (args[0] === "master") {
              navigate(ROUTES.GAMEMASTER.url);
              addLog("response", "Entering Gamemaster Mode...");
            } else if (args[0] === "zen") {
              navigate(ROUTES.GAME_CONSOLE.build({ style: "zen" }));
              addLog("response", "Entering Zen Garden...");
            } else if (args[0] === "rules") {
              game.setShowRules(true);
              addLog("response", "Opening Rules Protocol Overlay...");
            } else {
              game.setGameState?.(args[0] as any);
              addLog("response", `Forcing phase to ${args[0]}...`);
            }
          } else {
            addLog("error", "Usage: phase <name>");
          }
          break;
        case "play":
          if (args[0]) {
            const mode = args[0].toLowerCase();
            navigate(ROUTES.GAME_CONSOLE.build({ style: mode }));
            addLog("response", `Switching to ${mode} mode...`);
          } else {
            addLog(
              "error",
              "Usage: play <style> (alpha, battle, pi, chi, omega)",
            );
          }
          break;
        case "mmo":
          navigate(ROUTES.GAME_MMO.path);
          addLog("response", "Joining MMO...");
          break;
        case "zen":
          navigate(ROUTES.GAME_CONSOLE.build({ style: "zen" }));
          addLog("response", "Entering Zen Garden...");
          break;
        case "master":
          navigate(ROUTES.MASTER_CONSOLE.url);
          addLog("response", "Entering Unified Master Console...");
          break;
        case "goto":
          if (args[0]) {
            navigate(args[0]);
            addLog("response", `Navigating to ${args[0]}...`);
          } else {
            addLog("error", "Usage: goto <path>");
          }
          break;
        case "clear":
          clearHistory();
          break;
        case "exit":
          // handled by the component
          break;
        case "reset":
          game.resetToOmega();
          addLog("response", "Board reset to Omega layout.");
          break;
        case "omega":
          game.resetToOmega();
          addLog("response", "Applying Omega layout...");
          break;
        case "pi":
          game.setClassicalFormation();
          addLog("response", "Applying Pi (Classical) layout...");
          break;
        case "chi":
          game.applyChiGarden();
          addLog("response", "Applying Chi (Zen) layout...");
          break;
        case "random":
          game.randomizeTerrain();
          game.randomizeUnits();
          addLog("response", "Randomizing layout...");
          break;
        case "mirror":
          game.mirrorBoard();
          addLog("response", "Mirroring board...");
          break;
        default:
          addLog("error", `Unknown command: ${action}`);
      }
    },
    [addLog, clearHistory, navigate, game],
  );

  return { dispatch };
};
