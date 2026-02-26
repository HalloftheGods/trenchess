import React from "react";

interface TCInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  variant?: "brand" | "terminal" | "ghost";
  leftIcon?: React.ReactNode;
}

export const TCInput: React.FC<TCInputProps> = ({
  label,
  error,
  variant = "brand",
  leftIcon,
  className = "",
  ...props
}) => {
  const baseInputStyles =
    "w-full rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-3";

  const variants = {
    brand:
      "bg-slate-900 border border-white/10 text-white placeholder:text-slate-500 focus:ring-brand-blue/50 focus:border-brand-blue/50",
    terminal:
      "bg-black border-l-2 border-brand-red text-green-500 font-mono placeholder:text-green-900 focus:ring-0",
    ghost:
      "bg-transparent border border-transparent text-slate-300 placeholder:text-slate-600 hover:bg-white/5 focus:bg-white/10",
  };

  const currentVariant = variants[variant];
  const combinedInputClassName = `${baseInputStyles} ${currentVariant} ${leftIcon ? "pl-11" : ""} ${error ? "border-brand-red focus:ring-brand-red/50" : ""} ${className}`;

  return (
    <div className="w-full space-y-1.5 pt-4">
      {label && (
        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">
          {label}
        </label>
      )}
      <div className="relative group">
        {leftIcon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-white transition-colors">
            {leftIcon}
          </div>
        )}
        <input className={combinedInputClassName} {...props} />
      </div>
      {error && (
        <p className="text-[10px] font-bold text-brand-red uppercase tracking-wider ml-2">
          {error}
        </p>
      )}
    </div>
  );
};
