import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { NavButton } from "../atoms/NavButton";

import type { UnitColors } from "@tc.types";

interface UnitIconSelectorProps {
  icon: React.ReactNode;
  colors: {
    bg: string;
    text: string;
  };
  onPrev: () => void;
  onNext: () => void;
  PrevIcon?: React.ElementType;
  NextIcon?: React.ElementType;
  prevUnitColors?: UnitColors | null;
  nextUnitColors?: UnitColors | null;
}

export const UnitIconSelector: React.FC<UnitIconSelectorProps> = ({
  icon,
  colors,
  onPrev,
  onNext,
  PrevIcon,
  NextIcon,
  prevUnitColors,
  nextUnitColors,
}) => {
  const defaultBtnClass =
    "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800/60 dark:text-white/60";

  return (
    <div className="flex flex-row items-center justify-center gap-10 mb-6">
      <div
        className={`relative w-36 h-36 rounded-[2.5rem] ${colors.bg} ${colors.text} flex items-center justify-center shadow-inner border border-white/5 group transition-transform hover:scale-105 overflow-visible`}
      >
        {icon}

        <NavButton
          onClick={onPrev}
          className={`absolute -left-5 top-1/2 -translate-y-1/2 z-30 p-2 rounded-xl shadow-lg border opacity-40 grayscale hover:opacity-100 hover:grayscale-0 hover:scale-110 active:scale-95 flex items-center justify-center ${
            prevUnitColors
              ? `${prevUnitColors.bg} ${prevUnitColors.border} ${prevUnitColors.text}`
              : defaultBtnClass
          }`}
        >
          {PrevIcon ? <PrevIcon size={18} /> : <ChevronLeft size={18} />}
        </NavButton>

        <NavButton
          onClick={onNext}
          className={`absolute -right-5 top-1/2 -translate-y-1/2 z-30 p-2 rounded-xl shadow-lg border opacity-40 grayscale hover:opacity-100 hover:grayscale-0 hover:scale-110 active:scale-95 flex items-center justify-center ${
            nextUnitColors
              ? `${nextUnitColors.bg} ${nextUnitColors.border} ${nextUnitColors.text}`
              : defaultBtnClass
          }`}
        >
          {NextIcon ? <NextIcon size={18} /> : <ChevronRight size={18} />}
        </NavButton>
      </div>
    </div>
  );
};
