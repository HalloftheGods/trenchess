import React from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Home } from "lucide-react";
import { useBreadcrumbs } from "@/shared/hooks/navigation/useBreadcrumbs";

interface BackButtonProps {
  onClick: () => void;
  /** Override the primary back button label. */
  label?: string;
  className?: string;
}

/**
 * A navigational component that renders a breadcrumb trail followed by
 * a primary Back button.
 */
const BackButton: React.FC<BackButtonProps> = ({
  onClick,
  label,
  className = "",
}) => {
  const navigate = useNavigate();
  const breadcrumbs = useBreadcrumbs();

  if (breadcrumbs.length === 0) return null;

  // The "Back" target is the second to last breadcrumb item,
  // or the first if there are only two.
  // Actually, the primary Back action is passed as onClick from the parent,
  // which knows where "back" is for its specific context (e.g. sub-steps).
  // But we need a label for it.

  const parentCrumb =
    breadcrumbs.length >= 2 ? breadcrumbs[breadcrumbs.length - 2] : null;

  // Naked ancestors: everything EXCEPT the last one.
  const ancestors = breadcrumbs.slice(0, -1);
  const backLabel = label ?? (parentCrumb?.label || "Menu");

  return (
    <div
      className={`flex items-center gap-1 ${className} animate-in fade-in slide-in-from-left-2 duration-300`}
    >
      {/* Home Link */}
      <button
        onClick={() => navigate("/")}
        className="p-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors rounded-md hover:bg-slate-200/50 dark:hover:bg-slate-800/50 cursor-pointer"
        title="Main Menu"
      >
        <Home size={14} />
      </button>

      {/* Breadcrumb Ancestors */}
      {ancestors.map((ancestor) => (
        <React.Fragment key={ancestor.path}>
          <div className="flex items-center text-slate-300 dark:text-slate-800">
            <ChevronRight size={12} />
          </div>
          <button
            onClick={() => navigate(ancestor.path)}
            className="px-1.5 py-1 text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 transition-colors cursor-pointer font-bold text-[10px] uppercase tracking-[0.15em] border-b border-transparent hover:border-slate-300 dark:hover:border-slate-700 whitespace-nowrap"
          >
            {ancestor.label}
          </button>
        </React.Fragment>
      ))}

      {/* Divider for the final Back button */}
      <div className="flex items-center text-slate-300 dark:text-slate-800 mx-0.5">
        <ChevronRight size={12} />
      </div>

      {/* Primary Back Button */}
      <button
        onClick={onClick}
        className="flex items-center gap-1.5 p-1.5 pl-1.5 pr-3 text-slate-700 dark:text-slate-200 hover:text-brand-blue dark:hover:text-brand-blue transition-all rounded-full bg-slate-200/50 dark:bg-white/5 border border-slate-300/50 dark:border-white/5 hover:border-brand-blue/30 cursor-pointer font-black text-[10px] uppercase tracking-widest shadow-sm group whitespace-nowrap"
        title={`Back to ${backLabel}`}
      >
        <ChevronLeft
          size={14}
          className="group-hover:-translate-x-0.5 transition-transform"
        />
        <span>{backLabel}</span>
      </button>
    </div>
  );
};

export default BackButton;
