import React from "react";

interface TCToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  size?: "sm" | "md";
  className?: string;
}

export const TCToggle: React.FC<TCToggleProps> = ({
  checked,
  onChange,
  label,
  disabled = false,
  size = "md",
  className = "",
}) => {
  const sizes = {
    sm: {
      track: "w-8 h-4",
      thumb: "w-3 h-3",
      translate: "translate-x-4",
    },
    md: {
      track: "w-11 h-6",
      thumb: "w-5 h-5",
      translate: "translate-x-5",
    },
  };

  const currentSize = sizes[size];

  const handleToggle = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };

  return (
    <div
      className={`flex items-center gap-3 cursor-pointer group select-none ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
      onClick={handleToggle}
    >
      <div
        className={`
          relative flex items-center p-0.5 rounded-full transition-colors duration-200 ease-in-out
          ${currentSize.track}
          ${checked ? "bg-brand-blue" : "bg-slate-700"}
          group-hover:${checked ? "bg-brand-blue/80" : "bg-slate-600"}
        `}
      >
        <div
          className={`
            bg-white rounded-full shadow-md transform transition-transform duration-200 ease-in-out
            ${currentSize.thumb}
            ${checked ? currentSize.translate : "translate-x-0"}
          `}
        />
      </div>
      {label && (
        <span className="text-xs font-black uppercase tracking-widest text-slate-400 group-hover:text-white transition-colors">
          {label}
        </span>
      )}
    </div>
  );
};
