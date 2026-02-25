import React, { useState, useEffect, useCallback } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { TerminalOverlay } from "./components/organisms/TerminalOverlay";
import type { GameStateHook } from "@/shared/types";
import { ROUTES } from "@constants/routes";

interface ConsoleViewProps {
  game: GameStateHook;
}

interface HistoryItem {
  id: string;
  type: "command" | "response" | "error" | "info";
  text: string;
  timestamp: string;
}

const createHistoryItem = (
  type: HistoryItem["type"],
  text: string,
): HistoryItem => ({
  id: Math.random().toString(36).substring(2, 11),
  type,
  text,
  timestamp: new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }),
});

const ConsoleView: React.FC<ConsoleViewProps> = ({ game }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>(() => [
    createHistoryItem("info", "TRENCHESS TERMINAL READY. Press ` to toggle."),
  ]);
  const navigate = useNavigate();

  const addHistory = useCallback((type: HistoryItem["type"], text: string) => {
    setHistory((prev) => [...prev, createHistoryItem(type, text)]);
  }, []);

  const handleCommand = useCallback(
    (command: string) => {
      addHistory("command", command);
      const [cmd, ...args] = command.trim().split(" ");
      const action = cmd.toLowerCase();

      switch (action) {
        case "help":
          addHistory("info", "COMMANDS: play <style>, mmo, zen, master, clear, exit, goto <path>");
          break;
        case "play":
          if (args[0]) {
            navigate(ROUTES.GAME_CONSOLE.build({ style: args[0] }));
            addHistory("response", `Switching to ${args[0]} mode...`);
          } else {
            addHistory("error", "Usage: play <style> (alpha, battle, pi, chi, omega)");
          }
          break;
        case "mmo":
          navigate(ROUTES.GAME_MMO.path);
          addHistory("response", "Joining MMO...");
          break;
        case "zen":
          navigate(ROUTES.GAME_CONSOLE.build({ style: "zen" }));
          addHistory("response", "Entering Zen Garden...");
          break;
        case "master":
          navigate(ROUTES.GAME_CONSOLE.build({ style: "gamemaster" }));
          addHistory("response", "Entering Gamemaster Mode...");
          break;
        case "goto":
          if (args[0]) {
            navigate(args[0]);
            addHistory("response", `Navigating to ${args[0]}...`);
          } else {
            addHistory("error", "Usage: goto <path>");
          }
          break;
        case "clear":
          setHistory([]);
          break;
        case "exit":
          setIsOpen(false);
          break;
        default:
          addHistory("error", `Unknown command: ${action}`);
      }
    },
    [addHistory, navigate],
  );

  const toggleConsole = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "`") {
        e.preventDefault();
        toggleConsole();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleConsole]);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-slate-950 flex flex-col">
      <div className="flex-1 relative overflow-hidden">
        <Outlet />
      </div>

      <TerminalOverlay
        game={game}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onCommand={handleCommand}
        history={history}
      />
    </div>
  );
};

export default ConsoleView;
