import React, { useState, useEffect, useCallback } from "react";
import { Outlet } from "react-router-dom";
import { TerminalOverlay } from "./components";
import { useTerminal } from "@/shared/context/TerminalContext";
import { useCommandDispatcher } from "@/shared/hooks/interface/useCommandDispatcher";
import { useGameState } from "@hooks/engine/useGameState";

const ConsoleView: React.FC = () => {
  const game = useGameState();
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
      addLog("info", "--- TRENCHESS TERMINAL V1.0 ---");
      addLog("info", "Welcome to the Master Protocol Interface.");
      addLog("info", "Type 'help' to see a list of available commands.");
      addLog("info", "Use 'play <style>' to start a session or 'status' to check the engine.");
      addLog("info", "Press ` to toggle this console.");
    }
  }, [addLog, history.length]);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-slate-950 flex flex-col">
      <div className="flex-1 relative overflow-hidden">
        <Outlet />
      </div>

      <TerminalOverlay
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onCommand={handleCommand}
        history={history}
      />
    </div>
  );
};

export default ConsoleView;
