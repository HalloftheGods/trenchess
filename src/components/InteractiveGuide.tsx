import React, { useEffect, useState } from "react";
import { useMenuContext } from "./menu/MenuContext";
import SectionDivider from "./ui/SectionDivider";
import BackButton from "./ui/BackButton";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface Slide {
  id: string;
  title: string;
  subtitle?: string;
  description: React.ReactNode;
  leftContent?: React.ReactNode;
  icon: React.ElementType;
  sideContent?: React.ReactNode;
  infoContent?: React.ReactNode;
  previewConfig: any;
  color: "red" | "blue" | "emerald" | "amber" | "slate" | "indigo";
  topLabel?: string;
}

interface InteractiveGuideProps {
  slides: Slide[];
  title: string;
  onBack: () => void;
  labelColor?: "red" | "blue" | "emerald" | "amber" | "slate" | "indigo";
}

const colorMaps = {
  red: {
    border: "border-brand-red/30 hover:border-brand-red/50",
    topBg: "bg-brand-red/70",
    iconBg: "bg-brand-red/20",
    iconText: "text-brand-red",
    iconBorder: "border-brand-red/30",
    indicatorOn: "bg-brand-red scale-125",
  },
  blue: {
    border: "border-brand-blue/30 hover:border-brand-blue/50",
    topBg: "bg-brand-blue/70",
    iconBg: "bg-brand-blue/20",
    iconText: "text-brand-blue",
    iconBorder: "border-brand-blue/30",
    indicatorOn: "bg-brand-blue scale-125",
  },
  emerald: {
    border: "border-emerald-500/30 hover:border-emerald-500/50",
    topBg: "bg-emerald-600",
    iconBg: "bg-emerald-500/20",
    iconText: "text-emerald-500",
    iconBorder: "border-emerald-500/30",
    indicatorOn: "bg-emerald-500 scale-125",
  },
  amber: {
    border: "border-amber-500/30 hover:border-amber-500/50",
    topBg: "bg-amber-600",
    iconBg: "bg-amber-500/20",
    iconText: "text-amber-500",
    iconBorder: "border-amber-500/30",
    indicatorOn: "bg-amber-500 scale-125",
  },
  slate: {
    border: "border-slate-500/30 hover:border-slate-500/50",
    topBg: "bg-slate-600",
    iconBg: "bg-slate-500/20",
    iconText: "text-slate-500",
    iconBorder: "border-slate-500/30",
    indicatorOn: "bg-slate-500 scale-125",
  },
  indigo: {
    border: "border-indigo-500/30 hover:border-indigo-500/50",
    topBg: "bg-indigo-600",
    iconBg: "bg-indigo-500/20",
    iconText: "text-indigo-500",
    iconBorder: "border-indigo-500/30",
    indicatorOn: "bg-indigo-500 scale-125",
  },
};

const InteractiveGuide: React.FC<InteractiveGuideProps> = ({
  slides,
  title,
  onBack,
  labelColor = "red",
}) => {
  const { setPreviewConfig, darkMode } = useMenuContext();
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const currentSlide = slides[currentSlideIndex];

  useEffect(() => {
    if (currentSlide) {
      setPreviewConfig(currentSlide.previewConfig);
    }
    // Cleanup if unmounted to a default state?
    // MenuLayout usually defaults it when not hovered, but here we enforce it persistently.
    return () => setPreviewConfig({ mode: null });
  }, [currentSlide, setPreviewConfig]);

  const textColor = darkMode ? "text-slate-100" : "text-slate-800";
  const subtextColor = darkMode ? "text-slate-400" : "text-slate-500";
  const cardBg = darkMode ? "bg-slate-900/50" : "bg-white/70";

  if (!currentSlide) return null;

  const cmap = colorMaps[currentSlide.color] || colorMaps.red;

  return (
    <div className="w-full max-w-7xl animate-in slide-in-from-bottom-8 fade-in duration-700 pb-20 flex flex-col items-center">
      <div className="relative w-full max-w-7xl mb-12">
        <SectionDivider
          label={title}
          color={labelColor === "indigo" ? "blue" : labelColor}
          animate={true}
        />
        <BackButton onClick={onBack} className="absolute left-0 top-8" />
      </div>

      <div className="w-full flex items-center justify-between gap-4 px-4 lg:px-0">
        <button
          onClick={() =>
            setCurrentSlideIndex(
              (currentSlideIndex - 1 + slides.length) % slides.length,
            )
          }
          className="p-4 rounded-full bg-slate-800/10 hover:bg-slate-800/20 dark:bg-slate-800/40 dark:hover:bg-slate-700/60 transition-all text-slate-800 dark:text-slate-100"
        >
          <ChevronLeft size={32} />
        </button>

        <div className="flex-1 max-w-4xl mx-auto">
          <div
            className={`p-10 rounded-[2.5rem] border-4 ${cardBg} ${cmap.border} flex flex-col relative overflow-hidden group shadow-2xl transition-all`}
          >
            <div className="flex flex-col w-full gap-8 mt-0">
              {/* Row 1: Header */}
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 pb-2 border-b border-slate-200/10">
                <div className="flex flex-col">
                  {currentSlide.topLabel && (
                    <p
                      className={`text-sm font-bold ${subtextColor} uppercase tracking-widest mb-1`}
                    >
                      {currentSlide.topLabel}
                    </p>
                  )}
                  <h3
                    className={`text-5xl font-black uppercase tracking-tight ${textColor}`}
                  >
                    {currentSlide.title}
                  </h3>
                </div>

                {currentSlide.leftContent && (
                  <div className="shrink-0">{currentSlide.leftContent}</div>
                )}
              </div>

              {/* Row 3: Visuals (Icon and Preview) */}
              <div className="flex flex-col lg:flex-row items-center lg:items-stretch justify-center gap-10">
                <div className="flex-0 flex items-center justify-center">
                  <div
                    className={`p-4 rounded-[2.5rem] border-2 shadow-2xl ${cmap.iconBg} ${cmap.iconText} ${cmap.iconBorder} flex items-center justify-center w-48 h-48 sm:w-64 sm:h-64 transition-transform hover:scale-105 duration-500`}
                  >
                    <currentSlide.icon size={128} />
                  </div>
                </div>
                {currentSlide.sideContent && (
                  <div className="flex-0 flex flex-col items-center justify-center">
                    {currentSlide.sideContent}
                  </div>
                )}
                {/* Row 2: Description (Simple List) */}
                <div className="w-full h-full flex flex-col justify-center text-left">
                  {currentSlide.description}
                </div>
              </div>

              {/* Row 4: Info/Legend (Bottom Row) */}
              {currentSlide.infoContent && (
                <div className="w-full mt-4 border-t border-slate-200/10 pt-8">
                  {currentSlide.infoContent}
                </div>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={() =>
            setCurrentSlideIndex((currentSlideIndex + 1) % slides.length)
          }
          className="p-4 rounded-full bg-slate-800/10 hover:bg-slate-800/20 dark:bg-slate-800/40 dark:hover:bg-slate-700/60 transition-all text-slate-800 dark:text-slate-100"
        >
          <ChevronRight size={32} />
        </button>
      </div>

      {/* Slide indicators */}
      <div className="flex gap-4 mt-10">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlideIndex(idx)}
            className={`w-3 h-3 rounded-full transition-all ${idx === currentSlideIndex ? cmap.indicatorOn : "bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 dark:hover:bg-slate-600"}`}
          />
        ))}
      </div>
    </div>
  );
};

export default InteractiveGuide;
