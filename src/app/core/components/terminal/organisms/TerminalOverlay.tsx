import React, { useState, useEffect, useRef } from "react";
import { Copy, Check } from "lucide-react";
import { TerminalInput } from "../atoms/TerminalInput";
import { TerminalHistory } from "../molecules/TerminalHistory";
import TrenchessText from "@/shared/components/atoms/TrenchessText";
import { useGameState } from "@hooks/engine/useGameState";

interface TerminalOverlayProps {
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
  isOpen,
  onCommand,
  history,
}) => {
  const game = useGameState();
  const [input, setInput] = useState("");
  const [copied, setCopied] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  const handleSubmit = () => {
    if (input.trim()) {
      onCommand(input.trim());
      setInput("");
    }
  };

  const handleCopy = () => {
    const text = history
      .map((line) => `[${line.timestamp}] ${line.type.toUpperCase()}: ${line.text}`)
      .join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
        bg-[#282a36] 
        shadow-2xl backdrop-blur-xl 
        border-b border-[#44475a] 
        transition-all duration-300 ease-in-out transform 
        flex flex-col 
        pointer-events-auto 
        ${
          isOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
        }`}
    >
      <div className="flex-1 overflow-hidden flex flex-col p-4">
        <div className="flex justify-between items-center mb-4 px-6 select-none">
          <span className="font-mono text-[10px] tracking-[0.2em] text-[#8be9fd] uppercase font-black">
            Battle Chess v2 // Master Protocol Interface
          </span>
          <div className="flex items-center gap-4">
            <span className="font-mono text-[10px] text-[#6272a4]">
              PID: {game.multiplayer.socketId || "OFFLINE"} | MODE: {game.mode}
            </span>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 font-mono text-[10px] text-[#8be9fd] hover:text-[#50fa7b] transition-colors cursor-pointer"
              title="Copy terminal history"
            >
              {copied ? (
                <>
                  <Check size={12} className="text-[#50fa7b]" />
                  <span className="text-[#50fa7b]">COPIED</span>
                </>
              ) : (
                <>
                  <Copy size={12} />
                  <span>COPY</span>
                </>
              )}
            </button>
          </div>
        </div>

        <TerminalHistory history={history} />

        <div className="px-6 py-4 border-t border-[#44475a] bg-[#21222c] flex items-center justify-between">
          <div className="flex-1">
            <TerminalInput
              value={input}
              onChange={setInput}
              onSubmit={handleSubmit}
              autoFocus={isOpen}
            />
          </div>
          <div className="opacity-20 hover:opacity-100 transition-opacity select-none pointer-events-none grayscale brightness-200">
            <TrenchessText className="text-xl" />
          </div>
        </div>
      </div>
    </div>
  );
};
