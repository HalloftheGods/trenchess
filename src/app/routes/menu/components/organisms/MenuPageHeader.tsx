/*
 * Copyright (c) 2006 - 2026 Hall of the Gods, Inc.
 * All Rights Reserved.
 *
 * Header component for menu pages.
 */
import React from "react";
import SectionDivider from "@/shared/components/molecules/SectionDivider";
import GameLogo from "@/shared/components/molecules/GameLogo";
import { useMenuContext } from "@/app/context/MenuContext";

interface MenuPageHeaderProps {
  label: string;
  color?: "slate" | "amber" | "blue" | "emerald" | "red";
  className?: string;
  onBackClick?: () => void;
  backLabel?: string;
}

import { MenuBoardPreview } from "./MenuBoardPreview";
import BackButton from "@/shared/components/molecules/BackButton";

const MenuPageHeader: React.FC<MenuPageHeaderProps> = ({
  label,
  color = "slate",
  className = "",
  onBackClick,
  backLabel,
}) => {
  const { onLogoClick } = useMenuContext();

  return (
    <div className={`w-full flex flex-col items-center pt-3 mb-4 ${className}`}>
      {/* 2-Column Desktop Layout */}
      <div className="w-full max-w-7xl px-0">
        <div className="flex flex-col lg:grid lg:grid-cols-2 items-center gap-12 lg:gap-16 min-h-[300px]">
          {/* Column 1: Logo & Controls */}
          <div className="w-full flex flex-col items-center justify-center relative">
            <div
              className="cursor-pointer transition-transform hover:scale-105"
              onClick={onLogoClick || (() => {})}
            >
              <GameLogo size="medium" />
            </div>
          </div>

          {/* Column 2: Board Preview */}
          <div className="w-full flex items-center justify-end">
            <MenuBoardPreview className="w-full max-w-[480px] aspect-square animate-in fade-in slide-in-from-right-12 duration-700" />
          </div>
        </div>
      </div>

      {/* Back Button Row */}
      {onBackClick && (
        <div className="w-full">
          <div className="flex justify-start">
            <BackButton onClick={onBackClick} label={backLabel} />
          </div>
        </div>
      )}

      <SectionDivider label={label} color={color} />
    </div>
  );
};

export default MenuPageHeader;
