/*
 * Copyright (c) 2006 - 2026 Hall of the Gods, Inc.
 * All Rights Reserved.
 *
 * Header component for menu pages.
 */
import React from "react";
import SectionDivider from "@/shared/components/molecules/SectionDivider";
import GameLogo from "@/shared/components/molecules/GameLogo";
import { useRouteContext } from "@/route.context";

interface RoutePageHeaderProps {
  label: string;
  color?: "slate" | "amber" | "blue" | "emerald" | "red";
  className?: string;
  onBackClick?: () => void;
  backLabel?: string;
}

import { useNavigate, useLocation } from "react-router-dom";
import { Pizza, Dices, Shell, Eye } from "lucide-react";
import {
  DualToneNS,
  DualToneEW,
  QuadTone,
  AllianceTone,
} from "@/shared/components/atoms/RouteIcons";
import { RouteBoardPreview } from "./RouteBoardPreview";
import BackButton from "@/shared/components/molecules/BackButton";
import JumpInButton from "@/shared/components/molecules/JumpInButton";
import RouteBreadcrumbs from "./RouteBreadcrumbs";

const RoutePageHeader: React.FC<RoutePageHeaderProps> = ({
  label,
  color = "slate",
  className = "",
  onBackClick,
  backLabel,
}) => {
  const {
    onLogoClick,
    multiplayer,
    selectedBoard,
    selectedPreset,
    onStartGame,
    playerConfig,
  } = useRouteContext();
  const navigate = useNavigate();
  const location = useLocation();

  const isHome = location.pathname === "/";
  const roomId = multiplayer?.roomId;
  const isResuming = isHome && !!roomId;

  const BoardIcon =
    selectedBoard === "2p-ns"
      ? DualToneNS
      : selectedBoard === "2p-ew"
        ? DualToneEW
        : selectedBoard === "4p"
          ? QuadTone
          : AllianceTone;

  const PresetIcon =
    selectedPreset === "classic"
      ? Pizza
      : selectedPreset === "quick"
        ? Dices
        : selectedPreset === "terrainiffic"
          ? Shell
          : Eye;

  const handleResume = () => {
    if (roomId) {
      navigate(`/game/${roomId}`);
    }
  };

  const handleJumpIn = () => {
    if (isResuming) {
      handleResume();
    } else {
      // "pi" is the classic preset
      const board = selectedBoard || "2p-ns";
      const preset = selectedPreset || "classic";

      // If no config is saved, start with "pi" (classic)
      onStartGame(board, preset, playerConfig);
    }
  };

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
              <GameLogo
                size="medium"
                onResumeClick={isResuming ? handleResume : undefined}
                resumeBoardIcon={isResuming ? <BoardIcon size={32} /> : null}
                resumePresetIcon={isResuming ? <PresetIcon size={32} /> : null}
              />
            </div>
            <RouteBreadcrumbs />
          </div>

          {/* Column 2: Board Preview */}
          <div className="w-full flex items-center justify-end">
            <RouteBoardPreview className="w-full max-w-[480px] aspect-square animate-in fade-in slide-in-from-right-12 duration-700" />
          </div>
        </div>
      </div>

      {/* Action Row (Back/Jump In) - Fixed height prevents layout shift */}
      <div className="w-full h-10 flex items-center justify-start">
        {onBackClick ? (
          <BackButton onClick={onBackClick} label={backLabel} />
        ) : isHome ? (
          <JumpInButton onClick={handleJumpIn} />
        ) : null}
      </div>

      <SectionDivider label={label} color={color} />
    </div>
  );
};

export default RoutePageHeader;
