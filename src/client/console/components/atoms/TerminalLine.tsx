import React from "react";

interface TerminalLineProps {
  type?: "command" | "response" | "error" | "info";
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
        return "text-brand-blue font-black";
      case "response":
        return "text-slate-200";
      case "error":
        return "text-red-400 font-bold italic";
      case "info":
        return "text-emerald-400 opacity-80 text-xs tracking-wider";
      default:
        return "text-slate-400";
    }
  };

  return (
    <div className={`flex gap-3 py-1 font-mono text-sm leading-relaxed ${getLineStyle()}`}>
      {timestamp && (
        <span className="opacity-20 select-none text-[10px] self-center shrink-0">
          [{timestamp}]
        </span>
      )}
      {type === "command" && (
        <span className="opacity-40 select-none shrink-0">❯</span>
      )}
      <span className="break-words w-full">{text}</span>
    </div>
  );
};
