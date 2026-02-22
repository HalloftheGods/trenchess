import React from "react";

interface NavButtonProps {
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
}

export const NavButton: React.FC<NavButtonProps> = ({
  onClick,
  disabled = false,
  className,
  children,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`cursor-pointer transition-all ${disabled ? "opacity-30 cursor-default" : ""} ${className || ""}`}
    >
      {children}
    </button>
  );
};
