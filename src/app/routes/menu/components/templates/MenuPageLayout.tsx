import React from "react";
import CopyrightFooter from "@/shared/components/molecules/CopyrightFooter";

interface MenuLayoutProps {
  children: React.ReactNode;
  className?: string;
}

const MenuPageLayout: React.FC<MenuLayoutProps> = ({
  children,
  className = "",
}) => {
  return (
    <div
      className={`w-full flex-1 flex flex-col items-center justify-center animate-in slide-in-from-bottom-8 fade-in duration-700 py-3 ${className}`}
    >
      <div className="w-full flex flex-col items-center justify-center flex-1 max-w-7xl mx-auto px-6">
        {children}
      </div>
      <CopyrightFooter />
    </div>
  );
};

export default MenuPageLayout;
