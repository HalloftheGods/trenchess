import TrenchessText from "@/shared/components/atoms/TrenchessText";
import React, { useState } from "react";
import { Loader2, Play } from "lucide-react";
import {
  TCOverlay,
  TCHeading,
  TCText,
  TCButton,
} from "@/shared/components/atoms/ui";

interface GameStartOverlayProps {
  isOnline: boolean;
  isLocked: boolean;
  onLockIn: () => void;
  onStart: () => void;
}

export const GameStartOverlay: React.FC<GameStartOverlayProps> = ({
  isOnline,
  isLocked,
  onLockIn,
  onStart,
}) => {
  const [isFadingOut, setIsFadingOut] = useState(false);

  const handleStart = () => {
    setIsFadingOut(true);
    setTimeout(onStart, 500);
  };

  const handleLockIn = () => {
    onLockIn();
  };

  return (
    <TCOverlay
      blur="xl"
      opacity="heavy"
      className={isFadingOut ? "opacity-0 pointer-events-none" : "opacity-100"}
    >
      <div className="relative group scale-110 lg:scale-150">
        <div className="absolute inset-0 -m-20 bg-gradient-radial from-brand-red/20 via-brand-blue/10 to-transparent blur-3xl animate-pulse" />

        <div className="relative flex flex-col items-center gap-6">
          <div className="relative">
            <TCHeading level={1} className="italic drop-shadow-xl">
              <TrenchessText />
            </TCHeading>
            <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-brand-red via-white to-brand-blue animate-shimmer" />
          </div>

          <div className="overflow-hidden mb-8">
            <TCHeading
              level={2}
              variant="plain"
              className="tracking-[0.5em] animate-[reveal-up_0.8s_ease-out_forwards]"
            >
              Play Trenchess!
            </TCHeading>
          </div>

          {isOnline ? (
            isLocked ? (
              <div className="flex flex-col items-center gap-3">
                <Loader2 size={28} className="text-slate-400 animate-spin" />
                <TCText variant="small" className="font-bold uppercase tracking-[0.3em]">
                  Waiting for others...
                </TCText>
              </div>
            ) : (
              <TCButton
                variant="brand"
                size="xl"
                onClick={handleLockIn}
                className="px-12"
              >
                Lock In
              </TCButton>
            )
          ) : (
            <TCButton
              variant="brand"
              size="xl"
              onClick={handleStart}
              leftIcon={<Play size={20} />}
              className="px-12"
            >
              Start
            </TCButton>
          )}
        </div>
      </div>
    </TCOverlay>
  );
};
