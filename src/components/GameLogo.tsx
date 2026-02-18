import LogoAsset from "../assets/logo.svg";
import { Waves, Trees, Mountain } from "lucide-react";
import { DesertIcon } from "../UnitIcons";

interface GameLogoProps {
  size?: "small" | "large";
  className?: string;
  onClick?: () => void;
}

const GameLogo: React.FC<GameLogoProps> = ({
  size = "small",
  className = "",
  onClick,
}) => {
  const isLarge = size === "large";

  return (
    <div
      className={`flex flex-col items-center text-center ${
        onClick ? "cursor-pointer group" : ""
      } ${className}`}
      onClick={onClick}
    >
      {/* Large Math Equation Layout */}
      {isLarge && (
        <div className="flex items-end gap-2 md:gap-6 mt-4 group">
          {/* Logo on the left, tucked close to the result */}
          <div
            className={`
              transform -rotate-6 transition-transform
              w-32 h-32 md:w-56 md:h-56 lg:w-64 lg:h-64
              group-hover:rotate-0 group-hover:scale-105
              shrink-0 mb-2 md:mb-4
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
              <span className="text-3xl md:text-5xl lg:text-6xl">Chess</span>

              <div className="flex items-center gap-3 md:gap-5">
                <span className="text-2xl md:text-4xl">+</span>
                <div className="flex items-center gap-1.5 md:gap-3">
                  <div className="p-2 md:p-3 rounded-2xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                    <Trees className="w-5 h-5 md:w-8 md:h-8" />
                  </div>
                  <div className="p-2 md:p-3 rounded-2xl bg-blue-500/10 text-blue-500 border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]">
                    <Waves className="w-5 h-5 md:w-8 md:h-8" />
                  </div>
                  <div className="p-2 md:p-3 rounded-2xl bg-stone-500/10 text-stone-500 dark:text-stone-400 border border-stone-500/20 shadow-[0_0_15px_rgba(120,113,108,0.1)]">
                    <Mountain className="w-5 h-5 md:w-8 md:h-8" />
                  </div>
                  <div className="p-2 md:p-3 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.1)]">
                    <DesertIcon className="w-5 h-5 md:w-8 md:h-8" />
                  </div>
                </div>
              </div>
            </div>

            {/* Middle: Equation Bar */}
            <div className="w-full h-1 md:h-1.5 rounded-full bg-slate-300 dark:bg-slate-700 opacity-60 mb-2 md:mb-4" />

            {/* Bottom: The Result */}
            <h1 className="text-7xl md:text-9xl lg:text-[11rem]  leading-none whitespace-nowrap">
              <span className="text-red-600">TREN</span>
              <span className="text-blue-600">CHESS</span>
            </h1>
          </div>
        </div>
      )}

      {/* Compact Layout (Small) */}
      {!isLarge && (
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 transform -rotate-6">
            <img src={LogoAsset} alt="Logo" className="w-full h-full" />
          </div>
          <h1 className="text-4xl font-black tracking-tighter">
            <span className="text-red-600">TREN</span>
            <span className="text-blue-600">CHESS</span>
          </h1>
        </div>
      )}
    </div>
  );
};

export default GameLogo;
