import React, { useState, useEffect, useRef } from "react";
import { TerminalInput } from "../atoms/TerminalInput";
import { TerminalHistory } from "../molecules/TerminalHistory";
import TrenchessText from "@/shared/components/atoms/TrenchessText";
import type { GameStateHook } from "@tc.types";

interface TerminalOverlayProps {
  game: GameStateHook;
  isOpen: boolean;
  onClose: () => void;
  onCommand: (command: string) => void;
  history: Array<{
    id: string;
    type: "command" | "response" | "error" | "info" | "game";
    text: string;
    timestamp: string;
  }>;
}

export const TerminalOverlay: React.FC<TerminalOverlayProps> = ({
  game,
  isOpen,
  onCommand,
  history,
}) => {
  const [input, setInput] = useState("");
  const overlayRef = useRef<HTMLDivElement>(null);

  const handleSubmit = () => {
    if (input.trim()) {
      onCommand(input.trim());
      setInput("");
    }
  };

  useEffect(() => {
    if (isOpen) {
      overlayRef.current?.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className={`
        absolute top-0 left-0 z-[100] 
        w-full h-[60vh] 
        bg-slate-950/90 
        shadow-2xl backdrop-blur-2xl 
        border-b border-brand-blue/30 
        transition-all duration-300 ease-in-out transform 
        flex flex-col 
        pointer-events-auto 
        ${
          isOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
        }`}
    >
      <div className="flex-1 overflow-hidden flex flex-col p-4">
        <div className="flex justify-between items-center mb-4 px-6 opacity-30 select-none">
          <span className="font-mono text-[10px] tracking-[0.2em] text-brand-blue uppercase font-black">
            Battle Chess v2 // Console Overlay
          </span>
          <span className="font-mono text-[10px] text-slate-500">
            PID: {game.multiplayer.socketId || "OFFLINE"} | MODE: {game.mode}
          </span>
        </div>

        <TerminalHistory history={history} />

        <div className="px-6 py-4 border-t border-brand-blue/10 bg-slate-950 flex items-center justify-between">
          <div className="flex-1">
            <TerminalInput
              value={input}
              onChange={setInput}
              onSubmit={handleSubmit}
              autoFocus={isOpen}
            />
          </div>
          <div className="opacity-20 hover:opacity-100 transition-opacity select-none pointer-events-none">
            <TrenchessText className="text-xl" />
          </div>
        </div>
      </div>
    </div>
  );
};
