import React from "react";
import { useLocation, Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

import { ROUTE_NAME_MAP } from "@/core/constants/core.constants";

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  if (pathnames.length === 0) return null;

  return (
    <div className="flex items-center gap-2 text-sm font-bold text-slate-500 uppercase tracking-widest bg-slate-100 dark:bg-slate-800/50 px-4 py-2 rounded-full backdrop-blur-sm self-start mb-4 animate-in fade-in slide-in-from-left-4">
      <Link
        to="/"
        className="hover:text-amber-500 transition-colors flex items-center gap-1"
      >
        <Home size={14} className="mb-0.5" />
        <span>Menu</span>
      </Link>
      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join("/")}`;
        const isLast = index === pathnames.length - 1;
        const name = ROUTE_NAME_MAP[value] || value;

        return (
          <React.Fragment key={to}>
            <ChevronRight size={14} className="text-slate-300" />
            {isLast ? (
              <span className="text-slate-800 dark:text-slate-200">{name}</span>
            ) : (
              <Link to={to} className="hover:text-amber-500 transition-colors">
                {name}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default Breadcrumbs;
