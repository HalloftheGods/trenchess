import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { NavButton } from "../atoms/NavButton";

interface LayoutPickerProps {
  label: string;
  currentIndex: number;
  totalItems: number;
  onPrev: () => void;
  onNext: () => void;
  disabled: boolean;
}

export const LayoutPicker: React.FC<LayoutPickerProps> = ({
  label,
  currentIndex,
  totalItems,
  onPrev,
  onNext,
  disabled,
}) => {
  return (
    <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between gap-4 px-3 py-2 bg-slate-900/80 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl border border-white/10">
      <NavButton
        onClick={onPrev}
        disabled={disabled}
        className="p-2 rounded-xl hover:bg-white/10 text-slate-400 hover:text-brand-blue"
      >
        <ChevronLeft size={20} />
      </NavButton>

      <div className="flex flex-col items-center min-w-0">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          Active Formation
        </span>
        <span className="text-sm font-black text-slate-200 uppercase tracking-widest truncate max-w-[120px]">
          {label}
        </span>
        {totalItems > 0 && (
          <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">
            {currentIndex + 2} / {totalItems + 1}
          </span>
        )}
      </div>

      <NavButton
        onClick={onNext}
        disabled={disabled}
        className="p-2 rounded-xl hover:bg-white/10 text-slate-400 hover:text-brand-blue"
      >
        <ChevronRight size={20} />
      </NavButton>
    </div>
  );
};
