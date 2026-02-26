import React, { useRef, useEffect } from "react";
import { TerminalLine } from "../atoms/TerminalLine";

interface HistoryItem {
  id: string;
  type: "command" | "response" | "error" | "info" | "game";
  text: string;
  timestamp: string;
}

interface TerminalHistoryProps {
  history: HistoryItem[];
}

export const TerminalHistory: React.FC<TerminalHistoryProps> = ({
  history,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [history]);

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto px-6 py-4 space-y-1 custom-scrollbar bg-slate-900/40 backdrop-blur-sm border-b border-white/5"
    >
      {history.map((item) => (
        <TerminalLine
          key={item.id}
          type={item.type}
          text={item.text}
          timestamp={item.timestamp}
        />
      ))}
    </div>
  );
};
