import React from "react";

interface TerminalLineProps {
  type?: "command" | "response" | "error" | "info" | "game";
  text: string;
  timestamp?: string;
}

export const TerminalLine: React.FC<TerminalLineProps> = ({
  type = "info",
  text,
  timestamp,
}) => {
  const getLineStyle = () => {
    switch (type) {
      case "command":
        return "text-[#8be9fd] font-bold";
      case "response":
        return "text-[#f8f8f2] font-medium";
      case "error":
        return "text-[#ff5555] font-bold italic";
      case "info":
        return "text-[#bd93f9] text-xs tracking-wider";
      case "game":
        return "text-[#ff79c6] font-medium text-[11px]";
      default:
        return "text-[#6272a4]";
    }
  };

  return (
    <div
      className={`flex gap-3 py-1 font-mono text-sm leading-relaxed transition-colors ${getLineStyle()}`}
    >
      {timestamp && (
        <span className="text-[#6272a4] opacity-80 select-none text-[10px] self-center shrink-0">
          [{timestamp}]
        </span>
      )}
      {type === "command" && (
        <span className="text-[#50fa7b] select-none shrink-0 font-bold">❯</span>
      )}
      <span className="break-words w-full">{text}</span>
    </div>
  );
};
