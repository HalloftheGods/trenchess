import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useTerminal } from "@/shared/context/TerminalContext";
import { ROUTES } from "@/app/router/router";
import { buildRoute } from "@/shared/utilities/routes";
import { fromAlgebraic } from "@/shared/utilities/game";
import type {
  GameStateHook,
  GameMode,
  PieceType,
  TerrainType,
} from "@tc.types";

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
          addLog("info", "--- TRENCHESS COMMAND REFERENCE ---");
          addLog("info", "GAME CONTROL:");
          addLog("info", "  play <style>         - Start session (alpha, battle, pi, chi, omega, zen)");
          addLog("info", "  start                - Transition to main gameplay phase");
          addLog("info", "  init <mode> [preset] - Initialize engine with mode and layout");
          addLog("info", "  seed <seed>          - Initialize from deterministic seed string");
          addLog("info", "  status               - Show current engine phase, turn, and mode");
          addLog("info", "BOARD OPERATIONS:");
          addLog("info", "  move <from> <to>     - Move piece using algebraic notation (e.g. E2 E4)");
          addLog("info", "  select <coord>       - Select a cell at the given coordinate");
          addLog("info", "  board <layout>       - Apply layout (omega, pi, chi, random, mirror, clear)");
          addLog("info", "  unit <type>          - Set active unit for placement");
          addLog("info", "  terrain <type>       - Set active terrain for placement");
          addLog("info", "SYSTEM & NAVIGATION:");
          addLog("info", "  mmo | zen | master   - Quick-jump to specific environments");
          addLog("info", "  player <pid> <type>  - Set player controller (pid: red|..., type: human|ai)");
          addLog("info", "  phase <name>         - Force engine into a specific phase");
          addLog("info", "  goto <path>          - Navigate to a specific application route");
          addLog("info", "  clear | exit         - Terminal session management");
          break;
        case "move":
          if (args[0] && args[1]) {
            const from = fromAlgebraic(args[0]);
            const to = fromAlgebraic(args[1]);
            if (from && to) {
              game.executeMove(from[0], from[1], to[0], to[1]);
              addLog("response", `Executing move ${args[0]} to ${args[1]}...`);
            } else {
              addLog("error", "Invalid coordinates. Use A1, B12, etc.");
            }
          } else {
            addLog("error", "Usage: move <from> <to>");
          }
          break;
        case "select":
          if (args[0]) {
            const coord = fromAlgebraic(args[0]);
            if (coord) {
              game.handleCellClick(coord[0], coord[1]);
              addLog("response", `Selecting cell ${args[0]}...`);
            } else {
              addLog("error", "Invalid coordinates. Use A1, B12, etc.");
            }
          } else {
            addLog("error", "Usage: select <coord>");
          }
          break;
        case "unit":
          if (args[0]) {
            const unit = args[0].toLowerCase();
            game.setPlacementPiece(unit as PieceType);
            addLog("response", `Selected unit for placement: ${unit}`);
          } else {
            addLog("error", "Usage: unit <pawn|knight|bishop|rook|queen|king>");
          }
          break;
        case "terrain":
          if (args[0]) {
            const terrain = args[0].toLowerCase();
            game.setPlacementTerrain(terrain as TerrainType);
            addLog("response", `Selected terrain for placement: ${terrain}`);
          } else {
            addLog(
              "error",
              "Usage: terrain <flat|forests|swamps|mountains|desert>",
            );
          }
          break;
        case "start":
          game.startGame();
          addLog("response", "Game started.");
          break;
        case "init":
          if (args[0]) {
            const mode = args[0] as GameMode;
            const preset = args[1] || null;
            game.initGameWithPreset(mode, preset);
            addLog(
              "response",
              `Game initialized with mode ${mode} and preset ${preset || "none"}.`,
            );
          } else {
            addLog("error", "Usage: init <mode> [preset]");
          }
          break;
        case "forfeit":
          game.forfeit(args[0]);
          addLog(
            "response",
            args[0]
              ? `Player ${args[0]} forfeited.`
              : "Local player forfeited.",
          );
          break;
        case "ready":
          game.ready(args[0]);
          addLog(
            "response",
            args[0] ? `Player ${args[0]} is ready.` : "Local player is ready.",
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
              navigate(
                buildRoute(ROUTES.console.game as string, { style: "zen" }),
              );
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
              navigate(
                buildRoute(ROUTES.console.game as string, { style: style }),
              );
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
                game.randomizeUnits();
                game.randomizeTerrain();
                addLog("response", "Board randomized.");
                break;
              case "random_terrain":
                game.randomizeTerrain();
                addLog("response", "Terrain randomized.");
                break;
              case "random_units":
                game.randomizeUnits();
                addLog("response", "Units randomized.");
                break;
              case "elemental":
                game.generateElementalTerrain();
                addLog("response", "Elemental terrain generated.");
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
                  "Usage: board <omega|pi|chi|random|random_terrain|random_units|elemental|mirror|clear>",
                );
            }
          } else {
            addLog(
              "error",
              "Usage: board <omega|pi|chi|random|random_terrain|random_units|elemental|mirror|clear>",
            );
          }
          break;
        case "seed":
          if (args[0]) {
            const success = game.initFromSeed(args[0]);
            if (success) {
              addLog("response", `Game initialized from seed ${args[0]}.`);
            } else {
              addLog("error", "Failed to initialize from seed.");
            }
          } else {
            addLog("error", "Usage: seed <seed_string>");
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
          game.randomizeUnits();
          game.randomizeTerrain();
          addLog("response", "Board randomized.");
          break;
        case "mirror":
          game.mirrorBoard();
          addLog("response", "Board mirrored.");
          break;
        case "mmo":
          navigate(ROUTES.console.mmo as string);
          addLog("response", "Joining MMO...");
          break;
        case "zen":
          navigate(buildRoute(ROUTES.console.game as string, { style: "zen" }));
          addLog("response", "Entering Zen Garden...");
          break;
        case "master":
          game.setShowRules(true);
          addLog("response", "Opening Master Protocol Interface...");
          break;
        case "screen":
          if (args[0]) {
            const screenId = args[0].toLowerCase();
            if (screenId === "none" || screenId === "clear") {
              game.setActiveScreen?.(undefined);
              addLog("response", "Screen override cleared.");
            } else {
              game.setActiveScreen?.(screenId);
              addLog("response", `Loading screen: ${screenId}...`);
            }
          } else {
            addLog("error", "Usage: screen <id|none>");
          }
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
