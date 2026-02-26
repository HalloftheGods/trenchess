import React from "react";
import { Loader2 } from "lucide-react";
import TrenchessText from "@/shared/components/atoms/TrenchessText";

interface WaitingScreenProps {
  message?: string;
  submessage?: string;
}

const WaitingScreen: React.FC<WaitingScreenProps> = ({
  message = "Waiting for uplink",
  submessage = "Synchronizing battlefield parameters...",
}) => {
  return (
    <div className="w-full h-screen bg-slate-950 flex flex-col items-center justify-center gap-8">
      <div className="relative">
        <h1 className="text-4xl lg:text-6xl font-black italic tracking-tighter opacity-50">
          <TrenchessText />
        </h1>
        <div className="absolute -bottom-2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
      </div>

      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="absolute inset-0 bg-brand-blue/20 blur-xl rounded-full animate-pulse" />
          <Loader2 className="w-12 h-12 text-brand-blue animate-spin relative" />
        </div>
        
        <div className="text-center space-y-2">
          <h2 className="text-xl font-black uppercase tracking-[0.3em] text-slate-200">
            {message}
          </h2>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
            {submessage}
          </p>
        </div>
      </div>
    </div>
  );
};

export default WaitingScreen;
