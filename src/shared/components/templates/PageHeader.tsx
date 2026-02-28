/*
 * Copyright (c) 2006 - 2026 Hall of the Gods, Inc.
 * All Rights Reserved.
 *
 * Reusable page header with GameLogo + optional BoardPreview slot.
 */
import React from "react";
import GameLogo from "@/shared/components/molecules/GameLogo";

interface PageHeaderProps {
  logoText?: string;
  topText?: string;
  onLogoClick?: () => void;
  boardPreview?: React.ReactNode;
  breadcrumbs?: React.ReactNode;
  showTerrain?: boolean;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  logoText,
  topText,
  onLogoClick,
  boardPreview,
  breadcrumbs,
  showTerrain = true,
}) => {
  return (
    <>
      <div className="w-full max-w-7xl mt-4 mb-8 flex flex-col lg:flex-row items-center justify-between gap-8 px-4 z-10 relative">
        <div className="flex-1 flex flex-col items-center">
          <div
            className={`${onLogoClick ? "cursor-pointer hover:scale-105" : ""} transition-transform flex justify-center w-full`}
            onClick={onLogoClick}
          >
            <GameLogo
              size="medium"
              logoText={logoText}
              topText={topText}
              showTerrain={showTerrain}
            />
          </div>
          {breadcrumbs}
        </div>

        {boardPreview && (
          <div className="w-full max-w-[400px] lg:w-[400px] shrink-0">
            {boardPreview}
          </div>
        )}
      </div>
    </>
  );
};

export default PageHeader;
