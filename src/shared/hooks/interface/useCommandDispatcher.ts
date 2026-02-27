import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useTerminal } from "@/shared/context/TerminalContext";
import { ROUTES } from "@constants/routes";
import type { GameStateHook, GameMode } from "@/shared/types";

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
            "COMMANDS: play <style>, mode <type>, player <pid> <type>, board <layout>, mmo, zen, master, turn <pid>, phase <name>, clear, exit, goto <path>, status",
          );
          break;
        case "status":
          addLog(
            "info",
            `ENGINE STATUS: Phase=${game.gameState}, Turn=${game.turn}, Mode=${game.mode}`,
          );
          break;
        case "info":
          if (args.length > 0) {
            addLog("info", args.join(" "));
          }
          break;
        case "turn":
        case "setturn":
          if (args[0]) {
            game.setTurn?.(args[0]);
            addLog("response", `Forcing turn to ${args[0]}...`);
          } else {
            addLog("error", "Usage: turn <pid>");
          }
          break;
        case "finishgamemaster":
          game.finishGamemaster();
          addLog("response", "Exiting Gamemaster mode...");
          break;
        case "phase":
          if (args[0]) {
            if (args[0] === "master" || args[0] === "rules") {
              game.setShowRules(true);
              addLog("response", "Opening Master Protocol Console...");
            } else if (args[0] === "zen") {
              navigate(ROUTES.GAME_CONSOLE.build({ style: "zen" }));
              addLog("response", "Entering Zen Garden...");
            } else {
              game.setPhase(args[0]);
              addLog("response", `Forcing phase to ${args[0]}...`);
            }
          } else {
            addLog("error", "Usage: phase <name>");
          }
          break;
        case "play":
          if (args[0]) {
            const style = args[0].toLowerCase();
            if (style === "none") {
              game.setMode(null as unknown as GameMode);
              addLog("response", "Engine mode cleared.");
            } else if (game.isStarted) {
              game.setMode(style as GameMode);
              addLog("response", `Engine mode executed: SET_MODE to ${style}`);
            } else {
              navigate(ROUTES.GAME_CONSOLE.build({ style: style }));
              addLog("response", `Navigating to ${style} session...`);
            }
          } else {
            addLog(
              "error",
              "Usage: play <style> (alpha, battle, pi, chi, omega, none)",
            );
          }
          break;
        case "mode":
          if (args[0]) {
            const mode = args[0].toLowerCase();
            game.setMode(mode as GameMode);
            addLog("response", `Engine mode set to ${mode}`);
          } else {
            addLog("error", "Usage: mode <2p-ns|2p-ew|4p>");
          }
          break;
        case "player":
          if (args[0] && args[1]) {
            const pid = args[0].toLowerCase();
            const type =
              args[1].toLowerCase() === "ai" ||
              args[1].toLowerCase() === "computer"
                ? "computer"
                : "human";
            game.setPlayerTypes((prev) => ({ ...prev, [pid]: type }));
            addLog("response", `Set player ${pid} to ${type}.`);
          } else {
            addLog("error", "Usage: player <pid> <human|ai>");
          }
          break;
        case "board":
          if (args[0]) {
            const layout = args[0].toLowerCase();
            switch (layout) {
              case "omega":
                game.resetToOmega();
                addLog("response", "Board reset to Omega layout.");
                break;
              case "pi":
                game.setClassicalFormation();
                addLog("response", "Board set to Pi (Classical).");
                break;
              case "chi":
                game.applyChiGarden();
                addLog("response", "Board set to Chi (Zen).");
                break;
              case "random":
                game.randomizeTerrain();
                game.randomizeUnits();
                addLog("response", "Board randomized.");
                break;
              case "mirror":
                game.mirrorBoard();
                addLog("response", "Board mirrored.");
                break;
              case "clear":
                game.resetUnits();
                game.resetTerrain();
                addLog("response", "Board cleared.");
                break;
              default:
                addLog(
                  "error",
                  "Usage: board <omega|pi|chi|random|mirror|clear>",
                );
            }
          } else {
            addLog("error", "Usage: board <omega|pi|chi|random|mirror|clear>");
          }
          break;
        case "omega":
          game.resetToOmega();
          addLog("response", "Board reset to Omega layout.");
          break;
        case "pi":
          game.setClassicalFormation();
          addLog("response", "Board set to Pi (Classical).");
          break;
        case "chi":
          game.applyChiGarden();
          addLog("response", "Board set to Chi (Zen).");
          break;
        case "random":
          game.randomizeTerrain();
          game.randomizeUnits();
          addLog("response", "Board randomized.");
          break;
        case "mirror":
          game.mirrorBoard();
          addLog("response", "Board mirrored.");
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
          game.setShowRules(true);
          addLog("response", "Opening Master Protocol Interface...");
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
        default:
          addLog("error", `Unknown command: ${action}`);
      }
    },
    [addLog, clearHistory, navigate, game],
  );

  return { dispatch };
};
