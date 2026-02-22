import React from "react";

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

export interface UnitIntelEntry {
  title: string;
  desc: string;
}

export interface UnitIntelPanelEntry {
  title: string;
  role: string;
  points: number | string;
  movePattern: (r: number, c: number) => number[][];
  desc: string;
}

export interface TerrainIntelEntry {
  label: string;
  icon: React.FC<{ className?: string; size?: number | string }>;
  color: string;
  desc: string;
}

export interface TerrainInteraction {
  unit: string;
  status: "allow" | "block" | "special";
  text: string;
}

export interface TerrainIntelPanelEntry {
  label: string;
  icon: React.FC<{ className?: string; size?: number | string }>;
  color: string;
  interactions: TerrainInteraction[];
}
