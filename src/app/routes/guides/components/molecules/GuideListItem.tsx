import React from "react";
import { GuideBullet, type GuideColor } from "../atoms/GuideBullet";
import { Box, Flex } from "@atoms";

interface GuideListItemProps {
  color?: GuideColor;
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md";
}

export const GuideListItem: React.FC<GuideListItemProps> = ({
  color = "slate",
  children,
  className = "",
  size = "md",
}) => {
  const textClass =
    size === "sm"
      ? "text-sm text-slate-500 dark:text-slate-400 font-bold"
      : "text-xl font-bold text-slate-500 dark:text-slate-400";

  return (
    <Flex
      as="li"
      align="start"
      gap={4}
      className={`leading-relaxed ${textClass} ${className}`}
    >
      <GuideBullet color={color} size={size} />
      <Box>{children}</Box>
    </Flex>
  );
};
