import React from "react";
import SectionDivider from "@molecules/SectionDivider";
import ForwardButton from "@molecules/ForwardButton";

interface MenuPageFooterProps {
  label?: string;
  onForwardClick: () => void;
  color?: "slate" | "amber" | "blue" | "emerald" | "red";
  className?: string;
  forwardIcon?: React.ElementType;
  forwardLabel?: string;
}

const MenuPageFooter: React.FC<MenuPageFooterProps> = ({
  label = "",
  onForwardClick,
  color = "slate",
  className = "",
  forwardIcon,
  forwardLabel,
}) => {
  return (
    <div className={`relative w-full max-w-7xl mt-6 space-y-2 ${className}`}>
      <SectionDivider label={label} color={color} />
      <ForwardButton
        onClick={onForwardClick}
        label={forwardLabel || ""}
        className="float-right"
        Icon={forwardIcon}
      />
    </div>
  );
};

export default MenuPageFooter;
