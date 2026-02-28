import React from "react";
import { EyeOff } from "lucide-react";

interface FogRegion {
  top: string;
  left: string;
  width: string;
  height: string;
  label: string;
}

interface FogOverlayProps {
  regions: FogRegion[];
}

export const FogOverlay: React.FC<FogOverlayProps> = ({ regions }) => {
  if (regions.length === 0) return null;

  return (
    <>
      {regions.map((fog, i) => (
        <div
          key={i}
          className="absolute z-50 flex flex-col items-center justify-center bg-slate-950/75 pointer-events-none"
          style={{
            top: fog.top,
            left: fog.left,
            width: fog.width,
            height: fog.height,
          }}
        >
          <EyeOff className="w-12 h-12 text-slate-600 mb-3" />
          <span className="text-slate-500 text-xs font-bold uppercase tracking-[0.3em]">
            Confidential
          </span>
        </div>
      ))}
    </>
  );
};

export type { FogRegion };
