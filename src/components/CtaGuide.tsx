import React from "react";
import { Users, Crown, RefreshCcw } from "lucide-react";
import InteractiveGuide, { type Slide } from "./InteractiveGuide";

interface CtaGuideProps {
  onBack: () => void;
}

const CtaGuide: React.FC<CtaGuideProps> = ({ onBack }) => {
  const slides: Slide[] = [
    {
      id: "multi",
      title: "A Global Conflict",
      subtitle: "Best Played with 4 Players",
      color: "blue",
      topLabel: "Multi-Commander",
      icon: Users,
      previewConfig: { mode: "4p" },
      description: (
        <ul className="space-y-4">
          <li className="text-xl font-bold text-slate-500 dark:text-slate-400 leading-relaxed flex items-start gap-4">
            <div className="w-2 h-2 rounded-full bg-blue-500/60 mt-2.5 shrink-0" />
            Capture the Army is designed for games with more than 2 players,
            creating a dynamic web of alliances and betrayals.
          </li>
          <li className="text-xl font-bold text-slate-500 dark:text-slate-400 leading-relaxed flex items-start gap-4">
            <div className="w-2 h-2 rounded-full bg-blue-500/60 mt-2.5 shrink-0" />
            It shines brightest when 4 commanders take the field.
          </li>
        </ul>
      ),
      sideContent: (
        <div className="w-full aspect-square bg-slate-900/40 rounded-[2.5rem] border-2 border-blue-500/20 flex flex-col items-center justify-center p-4 relative bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/5 to-transparent">
          <div className="grid grid-cols-2 grid-rows-2 gap-4 w-full h-full p-6 opacity-60">
            <div className="bg-blue-500/10 rounded-2xl border border-blue-500/40 flex flex-col items-center justify-center shadow-lg">
              <Crown className="text-blue-500" size={40} />
            </div>
            <div className="bg-emerald-500/10 rounded-2xl border border-emerald-500/40 flex flex-col items-center justify-center shadow-lg">
              <Crown className="text-emerald-500" size={40} />
            </div>
            <div className="bg-amber-500/10 rounded-2xl border border-amber-500/40 flex flex-col items-center justify-center shadow-lg">
              <Crown className="text-amber-500" size={40} />
            </div>
            <div className="bg-red-500/10 rounded-2xl border border-red-500/40 flex flex-col items-center justify-center shadow-lg">
              <Crown className="text-red-500" size={40} />
            </div>
          </div>
          <span className="mt-auto text-[10px] font-black uppercase text-blue-500/60 tracking-[0.3em] pt-2">
            Multi-Player Zones
          </span>
        </div>
      ),
    },
    {
      id: "inheritance",
      title: "Army Assimilation",
      subtitle: "To the Victor Go the Spoils",
      color: "indigo",
      topLabel: "Inheritance",
      icon: RefreshCcw,
      previewConfig: { mode: "4p" },
      description: (
        <ul className="space-y-4">
          <li className="text-xl font-bold text-slate-500 dark:text-slate-400 leading-relaxed flex items-start gap-4">
            <div className="w-2 h-2 rounded-full bg-indigo-500/60 mt-2.5 shrink-0" />
            When a player is checkmated, they are not simply eliminated from the
            board.
          </li>
          <li className="text-xl font-bold text-slate-500 dark:text-slate-400 leading-relaxed flex items-start gap-4">
            <div className="w-2 h-2 rounded-full bg-indigo-500/60 mt-2.5 shrink-0" />
            The player who delivered the final blow inherits all remaining
            pieces of the defeated army.
          </li>
        </ul>
      ),
      sideContent: (
        <div className="w-full aspect-square bg-slate-900/40 rounded-[2.5rem] border-2 border-indigo-500/20 flex flex-col items-center justify-center p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-indigo-950/20 animate-pulse" />
          <div className="relative z-10 flex gap-4 w-full justify-center">
            <div className="flex flex-col gap-2 items-center w-1/2">
              <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center border-2 border-blue-400 shadow-xl">
                <Crown className="text-white" size={32} />
              </div>
              <div className="text-3xl font-black text-indigo-500/80 my-2">
                →
              </div>
              <div className="flex gap-2 flex-wrap justify-center mt-2">
                <div className="w-5 h-5 rounded-full bg-blue-500/60 shadow-lg" />
                <div className="w-5 h-5 rounded-full bg-blue-500/60 shadow-lg" />
                <div className="w-5 h-5 rounded-full bg-blue-500/60 shadow-lg" />
              </div>
            </div>
            <div className="flex flex-col gap-2 items-center w-1/2 opacity-30 grayscale">
              <div className="w-16 h-16 rounded-2xl bg-red-600 flex items-center justify-center border-2 border-red-400">
                <Crown className="text-white" size={32} />
              </div>
              <div className="text-3xl font-black text-transparent my-2">→</div>
              <div className="flex gap-2 flex-wrap justify-center mt-2">
                <div className="w-5 h-5 rounded-full bg-red-500/60" />
                <div className="w-5 h-5 rounded-full bg-red-500/60" />
                <div className="w-5 h-5 rounded-full bg-red-500/60" />
              </div>
            </div>
          </div>
          <span className="mt-auto text-[10px] font-black uppercase text-indigo-500/60 tracking-[0.3em] text-center z-20">
            Troop Conversion
          </span>
        </div>
      ),
    },
  ];

  return (
    <InteractiveGuide
      title="Capture the Army"
      slides={slides}
      onBack={onBack}
      labelColor="blue"
    />
  );
};

export default CtaGuide;
