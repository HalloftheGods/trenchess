import React from "react";
import { TCButton } from "./ui";

interface DebugButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "success";
  active?: boolean;
}

/** @deprecated Use TCButton directly */
export const DebugButton: React.FC<DebugButtonProps> = ({
  variant = "secondary",
  active = false,
  className = "",
  children,
  ...props
}) => {
  // Map debug variants to TCButton variants
  const mappedVariant =
    variant === "primary"
      ? "brand"
      : variant === "danger"
        ? "danger"
        : "secondary";

  const activeClasses = active
    ? "ring-1 ring-amber-500/50 bg-amber-500/20 text-amber-400 border-amber-500/50"
    : "";

  return (
    <TCButton
      variant={mappedVariant as "brand" | "danger" | "secondary"}
      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider h-auto min-h-0 ${activeClasses} ${className}`}
      {...props}
    >
      {children}
    </TCButton>
  );
};

export default DebugButton;
