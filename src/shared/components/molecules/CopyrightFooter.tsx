import React from "react";

const CopyrightFooter: React.FC = () => {
  return (
    <div className="w-full py-8 mt-6 text-center border-t border-slate-200 dark:border-white/5 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <p className="text-[10px] md:text-xs font-black text-slate-400 dark:text-slate-500 tracking-[0.4em] uppercase mb-3">
        trenchess.forthexp.com - A Hall of the Gods Production
      </p>
      <p className="text-xs font-medium text-slate-400 dark:text-slate-600 tracking-widest uppercase">
        &copy; 2006 - 2026 Hall of the Gods, Inc. All Rights Reserved.
      </p>
      <p className="text-[10px] text-slate-400 dark:text-slate-700 mt-1 uppercase tracking-widest font-bold">
        Patent Pending
      </p>
      <p className="text-[10px] text-slate-400 dark:text-slate-800 mt-4 uppercase tracking-[0.3em] font-black">
        Version {APP_VERSION}
      </p>
    </div>
  );
};

export default CopyrightFooter;
