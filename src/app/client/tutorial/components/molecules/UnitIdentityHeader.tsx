import React from "react";
import { SectionRibbon } from "../atoms/SectionRibbon";
import { UnitTitle, UnitSubtitle } from "../atoms/Typography";

interface UnitIdentityHeaderProps {
  role: string;
  title: string;
  subtitle?: string;
  Icon: React.ElementType;
  colors: {
    ribbonBg: string;
    text: string;
    bg: string;
  };
  textColor: string;
}

export const UnitIdentityHeader: React.FC<UnitIdentityHeaderProps> = ({
  role,
  title,
  subtitle,
  Icon,
  colors,
  textColor,
}) => (
  <>
    <SectionRibbon label={subtitle || ""} bgClass={colors.ribbonBg} />

    {subtitle && (
      <UnitSubtitle subtitle={role} Icon={Icon} colorClass={colors.text} />
    )}
    <UnitTitle title={title} textColor={textColor} glowBg={colors.bg} />
  </>
);
