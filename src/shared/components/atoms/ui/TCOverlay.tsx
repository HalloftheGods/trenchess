import React from "react";

interface TCOverlayProps {
  children?: React.ReactNode;
  isOpen?: boolean;
  onClose?: () => void;
  blur?: "sm" | "md" | "lg" | "xl" | "none";
  opacity?: "light" | "medium" | "heavy";
  className?: string;
}

export const TCOverlay: React.FC<TCOverlayProps> = ({
  children,
  isOpen = true,
  onClose,
  blur = "xl",
  opacity = "heavy",
  className = "",
}) => {
  if (!isOpen) return null;

  const blurs = {
    none: "",
    sm: "backdrop-blur-sm",
    md: "backdrop-blur-md",
    lg: "backdrop-blur-lg",
    xl: "backdrop-blur-xl",
  };

  const opacities = {
    light: "bg-slate-950/20",
    medium: "bg-slate-950/50",
    heavy: "bg-slate-950/90",
  };

  const currentBlur = blurs[blur];
  const currentOpacity = opacities[opacity];
  const combinedClassName = `fixed inset-0 z-[100] flex items-center justify-center p-6 transition-all duration-300 animate-in fade-in ${currentBlur} ${currentOpacity} ${className}`;

  return (
    <div className={combinedClassName} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()}>{children}</div>
    </div>
  );
};
