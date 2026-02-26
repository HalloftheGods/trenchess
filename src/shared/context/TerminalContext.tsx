import React, { createContext, useContext, useState, useCallback } from "react";

export type TerminalLogType = "command" | "response" | "error" | "info" | "game";

export interface TerminalHistoryItem {
  id: string;
  type: TerminalLogType;
  text: string;
  timestamp: string;
}

interface TerminalContextValue {
  history: TerminalHistoryItem[];
  addLog: (type: TerminalLogType, text: string) => void;
  clearHistory: () => void;
}

const TerminalContext = createContext<TerminalContextValue | undefined>(undefined);

export const TerminalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [history, setHistory] = useState<TerminalHistoryItem[]>([]);

  const addLog = useCallback((type: TerminalLogType, text: string) => {
    const item: TerminalHistoryItem = {
      id: Math.random().toString(36).substring(2, 11),
      type,
      text,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
    };
    setHistory((prev) => [...prev, item]);
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  return (
    <TerminalContext.Provider value={{ history, addLog, clearHistory }}>
      {children}
    </TerminalContext.Provider>
  );
};

export const useTerminal = () => {
  const context = useContext(TerminalContext);
  if (!context) {
    throw new Error("useTerminal must be used within a TerminalProvider");
  }
  return context;
};
