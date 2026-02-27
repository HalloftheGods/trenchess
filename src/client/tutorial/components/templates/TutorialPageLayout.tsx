import React from "react";

interface TutorialPageLayoutProps {
  darkMode: boolean;
  HeaderSlot: React.ReactNode;
  PortfolioSlot: React.ReactNode;
  TerrainDetailsSlot: React.ReactNode;
  SimulationPreviewSlot: React.ReactNode;
  Divider1: React.ReactNode; // Usually "+"
  Divider2: React.ReactNode; // Usually "="
  FooterSlot: React.ReactNode;
}

export const TutorialPageLayout: React.FC<TutorialPageLayoutProps> = ({
  darkMode,
  HeaderSlot,
  PortfolioSlot,
  TerrainDetailsSlot,
  SimulationPreviewSlot,
  Divider1,
  Divider2,
  FooterSlot,
}) => {
  return (
    <div
      className={`min-h-screen w-full flex flex-col ${darkMode ? "bg-[#02030f]" : "bg-stone-100"} p-4 md:p-8 overflow-y-auto`}
    >
      <div className="max-w-7xl mx-auto flex flex-col gap-6 min-h-[calc(100vh-8rem)] w-full">
        {HeaderSlot}

        {/* Mobile/Tablet Fallback (Stacked) */}
        <div className="lg:hidden flex flex-col gap-8 w-full">
          {PortfolioSlot}
          <div className="text-center text-4xl font-black text-slate-700/20 dark:text-white/10">
            {Divider1}
          </div>
          {TerrainDetailsSlot}
          <div className="text-center text-4xl font-black text-slate-700/20 dark:text-white/10">
            {Divider2}
          </div>
          {SimulationPreviewSlot}
        </div>

        {/* Desktop 5-Column Grid */}
        <div className="hidden lg:grid grid-cols-[1.4fr_3rem_1fr_3rem_0.8fr] gap-0 items-stretch flex-1 w-full">
          <div className="h-full">{PortfolioSlot}</div>
          <div className="h-full">{Divider1}</div>
          <div className="h-full">{TerrainDetailsSlot}</div>
          <div className="h-full">{Divider2}</div>
          <div className="h-full">{SimulationPreviewSlot}</div>
        </div>

        {FooterSlot}
      </div>
    </div>
  );
};
