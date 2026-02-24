import React, { useEffect, useState, useRef } from "react";
import { useRouteContext } from "@/route.context";
import SectionDivider from "@molecules/SectionDivider";
import RoutePageHeader from "@/shared/components/organisms/RoutePageHeader";
import RoutePageLayout from "@/shared/components/templates/RoutePageLayout";
import ForwardButton from "@molecules/ForwardButton";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { UNIT_INTEL } from "@/constants";

import type { PreviewConfig } from "@/shared/types/game";

export interface Slide {
  id: string;
  title: string;
  subtitle?: string;
  description: React.ReactNode;
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

  useEffect(() => {
    if (currentSlide) {
      setPreviewConfig(currentSlide.previewConfig);
      if (onSlideChangeRef.current) {
        onSlideChangeRef.current(currentSlide.id);
      }
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

      <div className="w-full flex items-center justify-between gap-4 px-4 lg:px-0 mt-8">
        <button
          onClick={() =>
            setCurrentSlideIndex(
              (currentSlideIndex - 1 + slides.length) % slides.length,
            )
          }
          className="guide-nav-button"
        >
          <ChevronLeft size={32} />
        </button>

        <div className="flex-1 max-w-4xl mx-auto">
          <div className={`guide-card group ${cardBg} ${cmap.border}`}>
            <div className="flex flex-col w-full gap-8 mt-0">
              {/* Row 1: Header */}
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 pb-8 border-b border-slate-200/10">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-4 rounded-[1.5rem] border-2 shadow-xl ${cmap.iconBg} ${cmap.iconText} ${cmap.iconBorder} flex items-center justify-center w-24 h-24 shrink-0 transition-transform hover:scale-105 duration-500`}
                  >
                    {(() => {
                      const Icon = currentSlide.icon;
                      if (!Icon) return null;

                      if (React.isValidElement(Icon)) return Icon;

                      const IconComponent = Icon as React.ElementType;
                      return <IconComponent size={48} />;
                    })()}
                  </div>
                  <div className="flex flex-col">
                    {UNIT_INTEL[currentSlide.id] && (
                      <p
                        className={`text-sm font-bold ${subtextColor} uppercase tracking-widest mb-0`}
                      >
                        The {String(UNIT_INTEL[currentSlide.id]?.title || "")}{" "}
                        Learned a new job!
                      </p>
                    )}
                    <h3
                      className={`text-5xl font-black uppercase tracking-tight ${textColor}`}
                    >
                      {currentSlide.title}
                    </h3>
                    {currentSlide.topLabel && (
                      <p
                        className={`text-sm font-bold ${subtextColor} uppercase tracking-widest mt-1`}
                      >
                        {currentSlide.topLabel}
                      </p>
                    )}
                  </div>
                </div>

                {currentSlide.leftContent && (
                  <div className="shrink-0">{currentSlide.leftContent}</div>
                )}
              </div>

              {/* Row 2: Visuals & Description */}
              <div className="flex flex-col lg:flex-row items-center lg:items-center justify-around gap-12 w-full">
                {currentSlide.sideContent && (
                  <div
                    className={`flex flex-col items-center justify-center ${currentSlide.description ? "flex-1" : "w-full"}`}
                  >
                    {currentSlide.sideContent}
                  </div>
                )}
                {/* Description (Simple List) */}
                {/* {currentSlide.description && (
                  <div
                    className={`flex flex-col justify-center text-left ${currentSlide.sideContent ? "flex-1" : "w-full"}`}
                  >
                    {currentSlide.description}
                  </div>
                )} */}
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
          className="guide-nav-button"
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
