import React from "react";
import { X } from "lucide-react";

interface NavItem {
  icon: React.ElementType;
  className?: string; // For custom colors
  onClick: () => void;
  label: string;
}

interface MenuDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  color?: "red" | "blue" | "emerald" | "amber" | "slate" | "fuchsia";
  prev?: NavItem;
  next?: NavItem;
  darkMode?: boolean;
}

const MenuDetailModal: React.FC<MenuDetailModalProps> = ({
  isOpen,
  onClose,
  children,
  color = "slate",
  prev,
  next,
  darkMode = true,
}) => {
  if (!isOpen) return null;

  const colorMap = {
    red: "border-red-500/50 shadow-red-900/20 shadow-2xl",
    blue: "border-blue-500/50 shadow-blue-900/20 shadow-2xl",
    emerald: "border-emerald-500/50 shadow-emerald-900/20 shadow-2xl",
    amber: "border-amber-500/50 shadow-amber-900/20 shadow-2xl",
    slate: "border-slate-500/50 shadow-slate-900/20 shadow-2xl",
    fuchsia: "border-fuchsia-500/50 shadow-fuchsia-900/20 shadow-2xl",
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 ${darkMode ? "bg-slate-950/80" : "bg-white/60"} backdrop-blur-md animate-in fade-in duration-300`}
        onClick={onClose}
      />

      {/* Modal Content */}
      <div
        className={`relative w-full max-w-5xl ${darkMode ? "bg-slate-900" : "bg-white"} rounded-[2.5rem] border-4 ${colorMap[color]} shadow-2xl flex flex-col animate-in zoom-in-95 duration-300`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className={`absolute -top-4 -right-4 z-[60] w-12 h-12 rounded-2xl ${darkMode ? "bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white" : "bg-white hover:bg-slate-50 text-slate-500 hover:text-slate-900"} flex items-center justify-center transition-all hover:rotate-90 cursor-pointer shadow-2xl border ${darkMode ? "border-white/10" : "border-slate-200"}`}
        >
          <X size={24} />
        </button>

        {/* Navigation - PREV */}
        {prev && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              prev.onClick();
            }}
            className="hidden lg:flex absolute -left-12 top-1/2 -translate-y-1/2 z-[60] flex-col items-center gap-2 group cursor-pointer"
          >
            <div
              className={`w-24 h-24 rounded-[2rem] ${darkMode ? "bg-slate-900 border-slate-800 hover:bg-slate-800" : "bg-white border-slate-200 hover:bg-slate-50"} border-4 flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(0,0,0,0.5)] group-hover:border-white/10 group-active:scale-95 shadow-2xl relative overflow-hidden`}
            >
              {/* Ghost icon in background */}
              <prev.icon
                className={`w-16 h-16 absolute opacity-5 group-hover:opacity-20 transition-opacity blur-sm scale-150 ${prev.className}`}
              />
              <prev.icon
                className={`w-12 h-12 relative z-10 text-slate-500/40 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500 ${prev.className?.replace(
                  "text-",
                  "group-hover:text-",
                )}`}
              />
            </div>
            <span
              className={`text-[10px] font-black uppercase tracking-[0.3em] ${darkMode ? "text-slate-500 group-hover:text-white" : "text-slate-400 group-hover:text-slate-900"} transition-all duration-500`}
            >
              {prev.label}
            </span>
          </button>
        )}

        {/* Navigation - NEXT */}
        {next && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              next.onClick();
            }}
            className="hidden lg:flex absolute -right-12 top-1/2 -translate-y-1/2 z-[60] flex-col items-center gap-2 group cursor-pointer"
          >
            <div
              className={`w-24 h-24 rounded-[2rem] ${darkMode ? "bg-slate-900 border-slate-800 hover:bg-slate-800" : "bg-white border-slate-200 hover:bg-slate-50"} border-4 flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(0,0,0,0.5)] group-hover:border-white/10 group-active:scale-95 shadow-2xl relative overflow-hidden`}
            >
              {/* Ghost icon in background */}
              <next.icon
                className={`w-16 h-16 absolute opacity-5 group-hover:opacity-20 transition-opacity blur-sm scale-150 ${next.className}`}
              />
              <next.icon
                className={`w-12 h-12 relative z-10 text-slate-500/40 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500 ${next.className?.replace(
                  "text-",
                  "group-hover:text-",
                )}`}
              />
            </div>
            <span
              className={`text-[10px] font-black uppercase tracking-[0.3em] ${darkMode ? "text-slate-500 group-hover:text-white" : "text-slate-400 group-hover:text-slate-900"} transition-all duration-500`}
            >
              {next.label}
            </span>
          </button>
        )}

        <div
          className={`relative w-full h-full ${darkMode ? "bg-slate-900" : "bg-white"} rounded-[2.5rem] overflow-hidden flex flex-col`}
        >
          <div className="flex-1 overflow-x-hidden overflow-y-auto scrollbar-hide flex flex-col">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuDetailModal;
