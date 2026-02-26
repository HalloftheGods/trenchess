import React from "react";

interface TCCardProps {
  children: React.ReactNode;
  variant?: "glass" | "solid" | "ghost";
  padding?: "none" | "sm" | "md" | "lg" | "xl";
  className?: string;
}

export const TCCard: React.FC<TCCardProps> = ({
  children,
  variant = "glass",
  padding = "md",
  className = "",
}) => {
  const baseStyles =
    "relative overflow-hidden rounded-[2rem] border transition-all duration-300";

  const variants = {
    glass: "bg-slate-900/40 backdrop-blur-xl border-white/10 shadow-2xl",
    solid: "bg-slate-900 border-white/5 shadow-xl",
    ghost: "bg-transparent border-transparent",
  };

  const paddings = {
    none: "p-0",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
    xl: "p-10",
  };

  const currentVariant = variants[variant];
  const currentPadding = paddings[padding];
  const combinedClassName = `${baseStyles} ${currentVariant} ${currentPadding} ${className}`;

  return <div className={combinedClassName}>{children}</div>;
};
