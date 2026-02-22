import React from "react";

interface ScoreboardLayoutProps {
  children: React.ReactNode;
  sidebar: React.ReactNode;
  darkMode: boolean;
}

const ScoreboardLayout: React.FC<ScoreboardLayoutProps> = ({
  children,
  sidebar,
  darkMode,
}) => {
  return (
    <div
      className={`min-h-screen ${darkMode ? "bg-[#050b15]" : "bg-stone-100"} flex transition-colors overflow-hidden`}
    >
      {/* Left Column: Scrollable Content */}
      <div className="flex-1 overflow-y-auto scrollbar-hide flex flex-col items-center">
        {/* Minimalist Header for the list area if needed, but user wants corner buttons. 
            Actually, let's just make it the content. */}
        <div className="w-full max-w-5xl py-12 px-8 lg:px-12 flex flex-col gap-12">
          {children}
        </div>
      </div>

      {/* Right Column: Sticky Preview Sidebar */}
      <div className="hidden lg:flex w-[480px] h-screen sticky top-0 border-l border-slate-200 dark:border-white/5 bg-white/40 dark:bg-slate-900/40 backdrop-blur-3xl shrink-0 p-12 flex-col items-center justify-center gap-12">
        <div className="w-full flex-1 flex items-center justify-center">
          {sidebar}
        </div>

        {/* Optional: Descriptive title for the preview */}
        <div className="text-center">
          <h2 className="text-slate-400 dark:text-slate-600 font-black uppercase tracking-[0.2em] text-xs">
            Match Intel
          </h2>
          <p className="text-slate-300 dark:text-slate-700 text-[10px] mt-2 font-bold max-w-[200px] mx-auto opacity-50 uppercase tracking-widest">
            Visualizing battlefield and troop configurations in real-time
          </p>
        </div>
      </div>
    </div>
  );
};

export default ScoreboardLayout;
