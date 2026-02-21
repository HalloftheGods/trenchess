/*
 * Copyright (c) 2006 - 2026 Hall of the Gods, Inc.
 * All Rights Reserved.
 *
 * Reusable page header with GameLogo + optional BoardPreview slot.
 */
import React from "react";
import { ArrowLeft } from "lucide-react";
import type { PieceStyle } from "../constants";
import ThemeControls from "./ThemeControls";
import HelpControls from "./HelpControls";
import GameLogo from "./GameLogo";

interface PageHeaderProps {
  darkMode: boolean;
  pieceStyle: PieceStyle;
  toggleTheme: () => void;
  togglePieceStyle: () => void;
  onTutorial?: () => void;
  onZenGarden?: () => void;
  logoText?: string;
  topText?: string;
  onLogoClick?: () => void;
  onBack?: () => void;
  boardPreview?: React.ReactNode;
  breadcrumbs?: React.ReactNode;
  showTerrain?: boolean;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  darkMode,
  pieceStyle,
  toggleTheme,
  togglePieceStyle,
  onTutorial,
  onZenGarden,
  logoText,
  topText,
  onLogoClick,
  onBack,
  boardPreview,
  breadcrumbs,
  showTerrain = true,
}) => {
  return (
    <>
      {onBack && (
        <button
          onClick={onBack}
          className={`fixed top-6 left-6 z-50 flex items-center gap-2 px-4 py-3 rounded-2xl font-bold transition-all backdrop-blur-xl border shadow-lg hover:scale-110 cursor-pointer ${
            darkMode
              ? "bg-slate-800/80 hover:bg-slate-700/90 text-slate-200 border-white/10"
              : "bg-white/80 hover:bg-white/95 text-slate-700 border-slate-200"
          }`}
          title="Back to Menu"
        >
          <ArrowLeft size={20} />
        </button>
      )}

      <ThemeControls
        darkMode={darkMode}
        pieceStyle={pieceStyle}
        toggleTheme={toggleTheme}
        togglePieceStyle={togglePieceStyle}
        onTutorial={onTutorial}
        onZenGarden={onZenGarden}
      />

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

      <HelpControls onTutorial={onTutorial} />
    </>
  );
};

export default PageHeader;
