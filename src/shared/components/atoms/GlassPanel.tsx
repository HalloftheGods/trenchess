import type { ReactNode } from "react";
import { TCCard } from "./ui";

interface GlassPanelProps {
  children: ReactNode;
  className?: string;
}

/** @deprecated Use TCCard with variant="glass" directly */
export const GlassPanel = ({ children, className = "" }: GlassPanelProps) => {
  return (
    <TCCard variant="glass" padding="none" className={className}>
      {children}
    </TCCard>
  );
};
