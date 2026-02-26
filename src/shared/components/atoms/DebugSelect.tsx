import React from "react";

interface DebugSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: { value: string; label: string }[];
}

export const DebugSelect: React.FC<DebugSelectProps> = ({
  options,
  className = "",
  ...props
}) => {
  const baseClasses =
    "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded px-2 py-0.5 outline-none text-right cursor-pointer hover:border-amber-500/50 transition-colors text-xs font-mono";

  const combinedClasses = `${baseClasses} ${className}`;

  return (
    <select className={combinedClasses} {...props}>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default DebugSelect;
