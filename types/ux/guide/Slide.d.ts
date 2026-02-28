import type { PreviewConfig } from "@tc.types";

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
