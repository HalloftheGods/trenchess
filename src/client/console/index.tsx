import React, { useState, useEffect, useCallback } from "react";
import { Outlet } from "react-router-dom";
import { TerminalOverlay } from "./components";
import type { GameStateHook } from "@/shared/types";
import { useTerminal } from "@/shared/context/TerminalContext";
import { useCommandDispatcher } from "@/shared/hooks/interface/useCommandDispatcher";

interface ConsoleViewProps {
  game: GameStateHook;
}

const ConsoleView: React.FC<ConsoleViewProps> = ({ game }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { history, addLog } = useTerminal();
  const { dispatch } = useCommandDispatcher(game);

  const handleCommand = useCallback(
    (command: string) => {
      const action = command.trim().toLowerCase();
      if (action === "exit") {
        setIsOpen(false);
      } else {
        dispatch(command);
      }
    },
    [dispatch],
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

  // Initial welcome log
  useEffect(() => {
    if (history.length === 0) {
      addLog("info", "TRENCHESS TERMINAL READY. Press ` to toggle.");
    }
  }, [addLog, history.length]);

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
