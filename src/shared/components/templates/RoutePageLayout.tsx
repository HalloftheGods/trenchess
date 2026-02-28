import React from "react";
import CopyrightFooter from "@molecules/CopyrightFooter";
import { TCFlex } from "@atoms/ui/TCFlex";

interface MenuLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const RoutePageLayout: React.FC<MenuLayoutProps> = ({
  children,
  className = "",
}) => {
  return (
    <TCFlex
      direction="col"
      align="center"
      justify="center"
      className={`w-full flex-1 animate-in slide-in-from-bottom-8 fade-in duration-700 py-3 ${className}`}
    >
      <TCFlex
        direction="col"
        align="center"
        justify="center"
        className="w-full flex-1 max-w-7xl mx-auto px-6"
      >
        {children}
      </TCFlex>
      <CopyrightFooter />
    </TCFlex>
  );
};

export default RoutePageLayout;
