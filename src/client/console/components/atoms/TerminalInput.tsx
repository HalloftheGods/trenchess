import React, { useRef, useEffect } from "react";

interface TerminalInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  autoFocus?: boolean;
}

export const TerminalInput: React.FC<TerminalInputProps> = ({
  value,
  onChange,
  onSubmit,
  autoFocus = true,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus) {
      inputRef.current?.focus();
    }
  }, [autoFocus]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onSubmit();
    }
  };

  return (
    <div className="flex items-center gap-2 font-mono text-brand-blue text-sm">
      <span className="animate-pulse">❯</span>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        className="flex-1 bg-transparent border-none outline-none text-slate-100 placeholder-slate-700"
        placeholder="Type a command..."
        spellCheck={false}
        autoComplete="off"
      />
    </div>
  );
};
