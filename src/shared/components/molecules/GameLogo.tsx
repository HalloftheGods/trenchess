import React from "react";
import { DesertIcon } from "@/shared/components/atoms/UnitIcons";
import LogoAsset from "@assets/trenchess.png";
import { Waves, Trees, Mountain } from "lucide-react";
import { TCFlex, TCText, TCHeading, TCHero } from "@/shared/components/atoms";

interface GameLogoProps {
  size?: "small" | "medium" | "large";
  className?: string;
  onClick?: () => void;
  logoText?: string;
  topText?: string;
  showTerrain?: boolean;
  onResumeClick?: () => void;
  resumeBoardIcon?: React.ReactNode;
  resumePresetIcon?: React.ReactNode;
}

const GameLogo: React.FC<GameLogoProps> = ({
  size = "small",
  className = "",
  onClick,
  logoText,
  topText,
  showTerrain = true,
  onResumeClick,
  resumeBoardIcon,
  resumePresetIcon,
}) => {
  const isLarge = size === "large";
  const isMedium = size === "medium";

  const terrainBadgeClass = isMedium ? "p-2" : "p-2 md:p-3";
  const iconSizeClass = isMedium
    ? "w-6 h-6 md:w-8 md:h-8"
    : "w-5 h-5 md:w-8 md:h-8";

  return (
    <TCFlex
      direction="col"
      align="center"
      className={`${onClick ? "cursor-pointer group" : ""} ${className}`}
      onClick={onClick}
    >
      {/* Large Math Equation Layout */}
      {(isLarge || isMedium) && (
        <TCFlex align="end" gap={2} className="md:gap-6 mt-4 group">
          {/* Logo on the left, tucked close to the result */}
          <div
            className={`
              transform -rotate-6 transition-transform
              shrink-0 mb-2 md:mb-4
              group-hover:rotate-0 group-hover:scale-105
              ${
                isMedium
                  ? "w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48"
                  : "w-32 h-32 md:w-56 md:h-56 lg:w-64 lg:h-64"
              }
            `}
          >
            <img
              src={LogoAsset}
              alt="Trenchess Logo"
              className="w-full h-full drop-shadow-[0_15px_15px_rgba(0,0,0,0.4)]"
            />
          </div>

          {/* Vertical Equation Column on the Right */}
          <TCFlex
            direction="col"
            align="end"
            className="font-black uppercase tracking-[0.2em]"
          >
            {/* Top: Chess + Terrain */}
            <TCFlex
              direction="col"
              align="end"
              gap={1}
              className="md:gap-2 text-slate-500 dark:text-slate-400 mb-2"
            >
              <TCHeading
                level={4}
                variant="brand"
                className={
                  isMedium
                    ? "text-2xl md:text-3xl lg:text-4xl"
                    : "text-3xl md:text-5xl lg:text-6xl"
                }
              >
                {topText || "Chess"}
              </TCHeading>

              {showTerrain && (
                <TCFlex align="center" gap={2} className="md:gap-5">
                  <TCText
                    variant="none"
                    className={
                      isMedium
                        ? "text-xl md:text-2xl lg:text-3xl"
                        : "text-2xl md:text-4xl"
                    }
                  >
                    +
                  </TCText>
                  <TCFlex
                    align="center"
                    className={isMedium ? "gap-1" : "gap-1.5 md:gap-3"}
                  >
                    <div
                      className={`terrain-badge terrain-badge-green ${terrainBadgeClass}`}
                    >
                      <Trees className={iconSizeClass} />
                    </div>
                    <div
                      className={`terrain-badge terrain-badge-blue ${terrainBadgeClass}`}
                    >
                      <Waves className={iconSizeClass} />
                    </div>
                    <div
                      className={`terrain-badge terrain-badge-red ${terrainBadgeClass}`}
                    >
                      <Mountain className={iconSizeClass} />
                    </div>
                    <div
                      className={`terrain-badge terrain-badge-amber ${terrainBadgeClass}`}
                    >
                      <DesertIcon className={iconSizeClass} />
                    </div>
                  </TCFlex>
                </TCFlex>
              )}
            </TCFlex>

            {/* Middle: Equation Bar */}
            <div className="w-full h-1 md:h-1.5 rounded-full bg-slate-300 dark:bg-slate-700 opacity-60 mb-2 md:mb-4" />

            {/* Bottom: The Result */}
            <TCHero
              className={`leading-none whitespace-nowrap relative ${
                logoText ? "text-4xl md:text-5xl lg:text-6xl" : ""
              }`}
            >
              {logoText ? (
                <TCText variant="none" className="text-slate-100">
                  {logoText}
                </TCText>
              ) : (
                <>
                  <TCText variant="none" className="brand-title-red">
                    TREN
                  </TCText>
                  <TCText variant="none" className="brand-title-blue">
                    CHESS
                  </TCText>
                </>
              )}

              {onResumeClick && (
                <div
                  className="absolute -top-4 -right-8 md:-top-6 md:-right-12 animate-bounce cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    onResumeClick();
                  }}
                >
                  <div className="bg-emerald-500 text-white px-3 py-1 md:px-4 md:py-2 rounded-full shadow-lg border-2 border-white dark:border-slate-900 flex items-center gap-2 transform rotate-12 hover:rotate-0 transition-transform">
                    <TCText
                      variant="none"
                      className="text-xs md:text-sm font-bold tracking-normal"
                    >
                      RESUME
                    </TCText>
                    {resumeBoardIcon}
                    {resumePresetIcon}
                  </div>
                </div>
              )}
            </TCHero>
          </TCFlex>
        </TCFlex>
      )}

      {/* Compact Layout (Small) */}
      {!isLarge && !isMedium && (
        <TCFlex align="center" gap={4}>
          <div className="w-12 h-12 transform -rotate-6">
            <img src={LogoAsset} alt="Logo" className="w-full h-full" />
          </div>
          <TCHeading
            level={1}
            variant="brand"
            className="text-4xl tracking-tighter"
          >
            {logoText ? (
              <TCText variant="none" className="text-slate-100">
                {logoText}
              </TCText>
            ) : (
              <>
                <TCText variant="none" className="brand-title-red">
                  TREN
                </TCText>
                <TCText variant="none" className="brand-title-blue">
                  CHESS
                </TCText>
              </>
            )}
          </TCHeading>
        </TCFlex>
      )}
    </TCFlex>
  );
};

export default GameLogo;
