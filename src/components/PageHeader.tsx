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
import GameLogo from "./GameLogo";

interface PageHeaderProps {
  darkMode: boolean;
  pieceStyle: PieceStyle;
  toggleTheme: () => void;
  togglePieceStyle: () => void;
  logoText?: string;
  topText?: string;
  onLogoClick?: () => void;
  onBack?: () => void;
  boardPreview?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  darkMode,
  pieceStyle,
  toggleTheme,
  togglePieceStyle,
  logoText,
  topText,
  onLogoClick,
  onBack,
  boardPreview,
}) => {
  return (
    <>
      {onBack && (
        <button
          onClick={onBack}
          className={`fixed top-6 left-6 z-50 flex items-center gap-2 px-4 py-3 rounded-2xl font-bold transition-all backdrop-blur-xl border shadow-lg hover:scale-110 ${
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
      />

      <div className="w-full max-w-7xl mt-4 mb-8 flex flex-col lg:flex-row items-center justify-between gap-8 px-4 z-10 relative">
        <div
          className={`${onLogoClick ? "cursor-pointer hover:scale-105" : ""} transition-transform flex-1 flex justify-center w-full`}
          onClick={onLogoClick}
        >
          <GameLogo size="medium" logoText={logoText} topText={topText} />
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
