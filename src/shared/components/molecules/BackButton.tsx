import React from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import { useBreadcrumbs } from "@/shared/hooks/navigation/useBreadcrumbs";

interface BackButtonProps {
  onClick: () => void;
  /** Override the primary back button label. */
  label?: string;
  className?: string;
}

/**
 * A navigational breadcrumb component that gracefully integrates
 * a specific back action into the trail, removing the need for a separate back button.
 */
const BackButton: React.FC<BackButtonProps> = ({
  onClick,
  label,
  className = "",
}) => {
  const navigate = useNavigate();
  const breadcrumbs = useBreadcrumbs();

  if (breadcrumbs.length === 0) return null;

  const currentCrumb = breadcrumbs[breadcrumbs.length - 1];
  const ancestors = breadcrumbs.slice(0, -1);
  const backActionIsHome = ancestors.length === 0 && !label;

  return (
    <div
      className={`flex items-center gap-1 ${className} animate-in fade-in slide-in-from-left-2 duration-300`}
    >
      {/* Home Link (Always rendering the icon, never text) */}
      <button
        onClick={backActionIsHome ? onClick : () => navigate("/")}
        className="px-1.5 py-1 text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 transition-colors cursor-pointer border-b border-transparent hover:border-slate-300 dark:hover:border-slate-700 flex items-center justify-center"
        title="Main Menu"
      >
        <Home size={13} />
      </button>

      {/* Render Middle Ancestors (all except the last one, which is used for the Back Action) */}
      {!backActionIsHome &&
        ancestors.slice(0, -1).map((ancestor) => (
          <React.Fragment key={ancestor.path}>
            <div className="flex items-center text-slate-300 dark:text-slate-800">
              <ChevronRight size={12} />
            </div>
            <button
              onClick={() => navigate(ancestor.path)}
              className="px-1.5 py-1 text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 transition-colors cursor-pointer font-black text-[11px] border-b border-transparent hover:border-slate-300 dark:hover:border-slate-700 whitespace-nowrap capitalize"
            >
              {ancestor.label}
            </button>
          </React.Fragment>
        ))}

      {/* The "Back" Action (acts as the immediate ancestor of the current page) */}
      {!backActionIsHome && (
        <>
          <div className="flex items-center text-slate-300 dark:text-slate-800">
            <ChevronRight size={12} />
          </div>
          <button
            onClick={onClick}
            className="px-1.5 py-1 text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 transition-colors cursor-pointer font-black text-[11px] border-b border-transparent hover:border-slate-300 dark:hover:border-slate-700 whitespace-nowrap capitalize"
            title={`Back to ${label ?? ancestors[ancestors.length - 1].label}`}
          >
            {label ?? ancestors[ancestors.length - 1].label}
          </button>
        </>
      )}

      {/* Current Page */}
      <div className="flex items-center text-slate-300 dark:text-slate-800">
        <ChevronRight size={12} />
      </div>
      <span className="px-1.5 py-1 text-brand-blue font-black text-[11px] whitespace-nowrap capitalize border-b border-transparent">
        {currentCrumb.label}
      </span>
    </div>
  );
};

export default BackButton;
