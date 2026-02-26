import React from "react";

type ButtonVariant = "brand" | "danger" | "ghost" | "outline" | "secondary";
type ButtonSize = "sm" | "md" | "lg" | "xl";

interface TCButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const TCButton: React.FC<TCButtonProps> = ({
  children,
  variant = "brand",
  size = "md",
  isLoading = false,
  leftIcon,
  rightIcon,
  className = "",
  disabled,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center rounded-xl font-black uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none";

  const variants: Record<ButtonVariant, string> = {
    brand:
      "bg-brand-blue text-white hover:bg-brand-blue/80 shadow-lg shadow-brand-blue/20",
    danger:
      "bg-brand-red text-white hover:bg-brand-red/80 shadow-lg shadow-brand-red/20",
    secondary: "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white",
    outline: "border border-white/10 text-white hover:bg-white/5",
    ghost: "text-slate-400 hover:text-white hover:bg-white/5",
  };

  const sizes: Record<ButtonSize, string> = {
    sm: "px-4 py-2 text-xs gap-1.5",
    md: "px-6 py-3 text-sm gap-2",
    lg: "px-8 py-4 text-base gap-2.5",
    xl: "px-10 py-5 text-lg gap-3",
  };

  const currentVariant = variants[variant];
  const currentSize = sizes[size];
  const combinedClassName = `${baseStyles} ${currentVariant} ${currentSize} ${className}`;

  return (
    <button
      className={combinedClassName}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      )}
      {!isLoading && leftIcon}
      <span>{children}</span>
      {!isLoading && rightIcon}
    </button>
  );
};
