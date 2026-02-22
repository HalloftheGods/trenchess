import React from "react";
import SectionDivider from "@/shared/components/molecules/SectionDivider";
import ForwardButton from "@/shared/components/molecules/ForwardButton";

interface RoutePageFooterProps {
  label?: string;
  onForwardClick?: () => void;
  onBackClick?: () => void;
  color?: "slate" | "amber" | "blue" | "emerald" | "red";
  className?: string;
  forwardIcon?: React.ElementType;
  forwardLabel?: string;
  backIcon?: React.ElementType;
  backLabel?: string;
}

const RoutePageFooter: React.FC<RoutePageFooterProps> = ({
  label = "",
  onForwardClick,
  onBackClick,
  color = "slate",
  className = "",
  forwardIcon,
  forwardLabel,
  backIcon,
  backLabel,
}) => {
  return (
    <div className={`relative w-full max-w-7xl mt-6 space-y-2 ${className}`}>
      <SectionDivider label={label} color={color} />
      <div className="flex items-center justify-between">
        {onBackClick ? (
          <ForwardButton
            onClick={onBackClick}
            label={backLabel || ""}
            Icon={backIcon}
            className="flex-row-reverse"
          />
        ) : (
          <div />
        )}
        {onForwardClick && (
          <ForwardButton
            onClick={onForwardClick}
            label={forwardLabel || ""}
            Icon={forwardIcon}
          />
        )}
      </div>
    </div>
  );
};

export default RoutePageFooter;
