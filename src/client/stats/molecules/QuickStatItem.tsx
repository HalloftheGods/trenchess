import React from "react";
import { Flex } from "@/shared/components/atoms/Flex";
import { Box } from "@/shared/components/atoms/Box";
import { Text } from "@/shared/components/atoms/Text";

interface QuickStatItemProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  valueColor?: string;
  align?: "start" | "end" | "center";
}

export const QuickStatItem: React.FC<QuickStatItemProps> = ({
  icon,
  label,
  value,
  valueColor = "text-white",
  align = "start",
}) => {
  return (
    <Box className={align === "end" ? "text-right" : "text-left"}>
      <Flex
        align="center"
        gap={2}
        justify={align === "end" ? "end" : "start"}
        className="text-slate-500 uppercase tracking-widest text-[10px] font-black mb-1"
      >
        {icon}
        {label}
      </Flex>
      <Text weight="black" className={`text-xl leading-none ${valueColor}`}>
        {value}
      </Text>
    </Box>
  );
};
