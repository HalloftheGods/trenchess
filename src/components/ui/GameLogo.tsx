import LogoAsset from "../../assets/logo.svg";
import { Waves, Trees, Mountain } from "lucide-react";
import { DesertIcon } from "../../UnitIcons";

interface GameLogoProps {
  size?: "small" | "medium" | "large";
  className?: string;
  onClick?: () => void;
  logoText?: string;
  topText?: string;
  showTerrain?: boolean;
}

const GameLogo: React.FC<GameLogoProps> = ({
  size = "small",
  className = "",
  onClick,
  logoText,
  topText,
  showTerrain = true,
}) => {
  const isLarge = size === "large";
  const isMedium = size === "medium";

  return (
    <div
      className={`flex flex-col items-center text-center ${
        onClick ? "cursor-pointer group" : ""
      } ${className}`}
      onClick={onClick}
    >
      {/* Large Math Equation Layout */}
      {(isLarge || isMedium) && (
        <div className="flex items-end gap-2 md:gap-6 mt-4 group">
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
          <div className="flex flex-col items-end font-black uppercase tracking-[0.2em]">
            {/* Top: Chess + Terrain */}
            <div className="flex flex-col items-end gap-1 md:gap-2 text-slate-500 dark:text-slate-400 mb-2">
              <span
                className={
                  isMedium
                    ? "text-2xl md:text-3xl lg:text-4xl"
                    : "text-3xl md:text-5xl lg:text-6xl"
                }
              >
                {topText || "Chess"}
              </span>

              {showTerrain && (
                <div className="flex items-center gap-2 md:gap-5">
                  <span
                    className={
                      isMedium
                        ? "text-xl md:text-2xl lg:text-3xl"
                        : "text-2xl md:text-4xl"
                    }
                  >
                    +
                  </span>
                  <div
                    className={`flex items-center ${
                      isMedium ? "gap-1" : "gap-1.5 md:gap-3"
                    }`}
                  >
                    <div
                      className={`rounded-2xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)] ${
                        isMedium ? "p-2" : "p-2 md:p-3"
                      }`}
                    >
                      <Trees
                        className={
                          isMedium
                            ? "w-6 h-6 md:w-8 md:h-8"
                            : "w-5 h-5 md:w-8 md:h-8"
                        }
                      />
                    </div>
                    <div
                      className={`rounded-2xl bg-brand-blue/10 text-brand-blue border border-brand-blue/20 shadow-[0_0_15px_rgba(59,130,246,0.1)] ${
                        isMedium ? "p-2" : "p-2 md:p-3"
                      }`}
                    >
                      <Waves
                        className={
                          isMedium
                            ? "w-6 h-6 md:w-8 md:h-8"
                            : "w-5 h-5 md:w-8 md:h-8"
                        }
                      />
                    </div>
                    <div
                      className={`rounded-2xl bg-brand-red/10 text-brand-red border border-brand-red/20 shadow-[0_0_15px_rgba(239,68,68,0.1)] ${
                        isMedium ? "p-2" : "p-2 md:p-3"
                      }`}
                    >
                      <Mountain
                        className={
                          isMedium
                            ? "w-6 h-6 md:w-8 md:h-8"
                            : "w-5 h-5 md:w-8 md:h-8"
                        }
                      />
                    </div>
                    <div
                      className={`rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.1)] ${
                        isMedium ? "p-2" : "p-2 md:p-3"
                      }`}
                    >
                      <DesertIcon
                        className={
                          isMedium
                            ? "w-6 h-6 md:w-8 md:h-8"
                            : "w-5 h-5 md:w-8 md:h-8"
                        }
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Middle: Equation Bar */}
            <div className="w-full h-1 md:h-1.5 rounded-full bg-slate-300 dark:bg-slate-700 opacity-60 mb-2 md:mb-4" />

            {/* Bottom: The Result */}
            <h1
              className={`leading-none whitespace-nowrap ${
                logoText
                  ? "text-4xl md:text-5xl lg:text-6xl"
                  : isMedium
                    ? "text-6xl md:text-7xl lg:text-8xl"
                    : "text-7xl md:text-xl lg:text-[11rem]"
              }`}
            >
              {logoText ? (
                <span className="text-slate-100">{logoText}</span>
              ) : (
                <>
                  <span className="text-brand-red">TREN</span>
                  <span className="text-brand-blue">CHESS</span>
                </>
              )}
            </h1>
          </div>
        </div>
      )}

      {/* Compact Layout (Small) */}
      {!isLarge && !isMedium && (
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 transform -rotate-6">
            <img src={LogoAsset} alt="Logo" className="w-full h-full" />
          </div>
          <h1 className="text-4xl font-black tracking-tighter">
            {logoText ? (
              <span className="text-slate-100">{logoText}</span>
            ) : (
              <>
                <span className="text-brand-red">TREN</span>
                <span className="text-brand-blue">CHESS</span>
              </>
            )}
          </h1>
        </div>
      )}
    </div>
  );
};

export default GameLogo;
