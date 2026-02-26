import React from "react";
import { TCBadge } from "./ui";
import type { BadgeVariant } from "./ui";

interface BadgeProps {
  icon?: React.ElementType;
  label: string;
  variant?: BadgeVariant;
  className?: string;
  size?: "sm" | "md";
  /** @deprecated use variant */
  colorTheme?: BadgeVariant;
}

/** @deprecated Use TCBadge directly */
const Badge: React.FC<BadgeProps> = ({
  icon,
  label,
  variant,
  colorTheme,
  className = "",
  size = "md",
}) => {
  return (
    <TCBadge
      icon={icon}
      label={label}
      variant={variant || colorTheme}
      className={className}
      size={size}
    />
  );
};

export default Badge;
