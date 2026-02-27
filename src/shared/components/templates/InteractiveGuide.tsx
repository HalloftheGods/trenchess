import React, { useEffect, useState, useRef } from "react";
import { useRouteContext } from "@context";
import SectionDivider from "@molecules/SectionDivider";
import RoutePageHeader from "@/shared/components/organisms/RoutePageHeader";
import RoutePageLayout from "@/shared/components/templates/RoutePageLayout";
import ForwardButton from "@molecules/ForwardButton";
import { ChevronLeft, ChevronRight } from "lucide-react";

import type { PreviewConfig } from "@/shared/types/game";

export interface Slide {
  id: string;
  title: string;
  subtitle?: string;
  description?: React.ReactNode;
  leftContent?: React.ReactNode;
  icon: React.ReactNode | React.ElementType;
  sideContent?: React.ReactNode;
  infoContent?: React.ReactNode;
  previewConfig: PreviewConfig;
  color:
    | "red"
    | "blue"
    | "emerald"
    | "amber"
    | "slate"
    | "indigo"
    | "purple"
    | "orange";
  topLabel?: string;
}

interface InteractiveGuideProps {
  slides: Slide[];
  title: string;
  onBack: () => void;
  labelColor?:
    | "red"
    | "blue"
    | "emerald"
    | "amber"
    | "slate"
    | "indigo"
    | "purple"
    | "orange";
  footerForward?: {
    label: string;
    onClick: () => void;
    icon: React.ElementType;
  };
  onSlideChange?: (id: string) => void;
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
  purple: {
    border: "border-purple-500/30 hover:border-purple-500/50",
    topBg: "bg-purple-600",
    iconBg: "bg-purple-500/20",
    iconText: "text-purple-500",
    iconBorder: "border-purple-500/30",
    indicatorOn: "bg-purple-500 scale-125",
  },
  orange: {
    border: "border-orange-500/30 hover:border-orange-500/50",
    topBg: "bg-orange-600",
    iconBg: "bg-orange-500/20",
    iconText: "text-orange-500",
    iconBorder: "border-orange-500/30",
    indicatorOn: "bg-orange-500 scale-125",
  },
};

const InteractiveGuide: React.FC<InteractiveGuideProps> = ({
  slides,
  title,
  onBack,
  labelColor = "red",
  footerForward,
  onSlideChange,
}) => {
  const { setPreviewConfig, darkMode } = useRouteContext();
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const currentSlide = slides[currentSlideIndex];

  const onSlideChangeRef = useRef(onSlideChange);
  useEffect(() => {
    onSlideChangeRef.current = onSlideChange;
  }, [onSlideChange]);

  const lastSlideIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (currentSlide && currentSlide.id !== lastSlideIdRef.current) {
      lastSlideIdRef.current = currentSlide.id;
      setPreviewConfig(currentSlide.previewConfig);
      if (onSlideChangeRef.current) {
        onSlideChangeRef.current(currentSlide.id);
      }
    }
  }, [currentSlide, setPreviewConfig]);


  // Cleanup only on unmount
  useEffect(() => {
    return () => setPreviewConfig({ mode: null });
  }, [setPreviewConfig]);


  const textColor = darkMode ? "text-slate-100" : "text-slate-800";
  const subtextColor = darkMode ? "text-slate-400" : "text-slate-500";
  const cardBg = darkMode ? "bg-slate-900/50" : "bg-white/70";

  if (!currentSlide) return null;

  const cmap = colorMaps[currentSlide.color] || colorMaps.red;

  return (
    <RoutePageLayout className="pb-8">
      <RoutePageHeader
        label={title}
        color={
          (labelColor === "indigo" || labelColor === "purple"
            ? "blue"
            : labelColor === "orange"
              ? "amber"
              : labelColor) as "slate" | "amber" | "blue" | "emerald" | "red"
        }
        onBackClick={onBack}
        className="mb-0"
      />

      <div className="w-full flex items-center justify-between gap-4 px-4 lg:px-8 mt-8 relative group/nav">
        {/* Navigation Arrows - Absolute on sides for cleaner feel */}
        <button
          onClick={() =>
            setCurrentSlideIndex(
              (currentSlideIndex - 1 + slides.length) % slides.length,
            )
          }
          className="absolute left-4 lg:left-8 z-30 p-4 rounded-full bg-slate-900/40 hover:bg-slate-900/60 text-white/50 hover:text-white border border-white/5 hover:border-white/20 transition-all duration-300 backdrop-blur-md shadow-2xl group/btn"
        >
          <ChevronLeft
            size={32}
            className="group-hover/btn:-translate-x-1 transition-transform"
          />
        </button>

        <div className="flex-1 w-full mx-auto z-10">
          <div
            className={`guide-card group ${cardBg} ${cmap.border} relative overflow-hidden`}
          >
            {/* Background Glow */}
            <div
              className={`absolute -right-32 -top-32 w-96 h-96 rounded-full ${cmap.iconBg} blur-[120px] opacity-30 pointer-events-none`}
            />

            <div className="flex flex-col w-full gap-8 mt-0 relative z-10">
              {/* Row 1: Header */}
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 pb-10 border-b border-slate-200/10">
                <div className="flex items-center gap-6">
                  <div
                    className={`p-5 rounded-[2rem] border-2 shadow-2xl ${cmap.iconBg} ${cmap.iconText} ${cmap.iconBorder} flex items-center justify-center w-28 h-28 shrink-0 transition-all hover:scale-105 hover:rotate-2 duration-500`}
                  >
                    {(() => {
                      const Icon = currentSlide.icon;
                      if (!Icon) return null;

                      if (React.isValidElement(Icon)) return Icon;

                      const IconComponent = Icon as React.ElementType;
                      return <IconComponent size={56} />;
                    })()}
                  </div>
                  <div className="flex flex-col">
                    <h3
                      className={`text-5xl lg:text-7xl font-black uppercase tracking-tighter ${textColor} leading-none mb-1`}
                    >
                      {currentSlide.title}
                    </h3>
                    <div className="flex items-center gap-3">
                      {currentSlide.topLabel && (
                        <p
                          className={`text-xs lg:text-sm font-black ${subtextColor} uppercase tracking-[0.3em] opacity-60`}
                        >
                          {currentSlide.topLabel}
                        </p>
                      )}
                      {currentSlide.subtitle && (
                        <>
                          <div className="w-1.5 h-1.5 rounded-full bg-amber-500/40" />
                          <p
                            className={`text-xs lg:text-sm font-black text-amber-500/80 uppercase tracking-[0.2em]`}
                          >
                            {currentSlide.subtitle}
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {currentSlide.leftContent && (
                  <div className="shrink-0">{currentSlide.leftContent}</div>
                )}
              </div>

              {/* Row 2: Visuals & Side Content */}
              <div className="flex flex-col lg:flex-row items-center justify-center gap-12 w-full pt-4">
                {currentSlide.sideContent && (
                  <div className="flex flex-col items-center justify-center w-full">
                    {currentSlide.sideContent}
                  </div>
                )}
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
          className="absolute right-4 lg:right-8 z-30 p-4 rounded-full bg-slate-900/40 hover:bg-slate-900/60 text-white/50 hover:text-white border border-white/5 hover:border-white/20 transition-all duration-300 backdrop-blur-md shadow-2xl group/btn"
        >
          <ChevronRight
            size={32}
            className="group-hover/btn:translate-x-1 transition-transform"
          />
        </button>
      </div>

      {/* Slide indicators */}
      <div className="flex gap-4 mt-10">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlideIndex(idx)}
            className={`guide-indicator ${idx === currentSlideIndex ? cmap.indicatorOn : "bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 dark:hover:bg-slate-600"}`}
          />
        ))}
      </div>

      {footerForward && (
        <div className="relative w-full max-w-7xl mt-16 space-y-2">
          <SectionDivider label="" />
          <ForwardButton
            onClick={footerForward.onClick}
            label={footerForward.label}
            className="float-right"
            Icon={footerForward.icon}
          />
        </div>
      )}
    </RoutePageLayout>
  );
};

export default InteractiveGuide;
