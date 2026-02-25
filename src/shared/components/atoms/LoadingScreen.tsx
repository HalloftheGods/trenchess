import React from "react";
import { Trees, Mountain, Waves } from "lucide-react";
import TrenchessText from "./TrenchessText";
import { Box } from "./Box";
import { Flex } from "./Flex";
import { DesertIcon } from "./UnitIcons";

interface LoadingScreenProps {
  message?: string;
  submessage?: string;
}

const LOADING_MESSAGES = [
  "Opening Trench...",
  "Pouring the Chessmen...",
  "Cracking the Endgame...",
  "Scouting the Terrain...",
  "Sharpening the Blades...",
];

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message = "Forging the Battlefield...",
  submessage = "Preparing the board for your arrival.",
}) => {
  const waveSequence = [0, 1, 2, 3, 4];
  const logoWidthClass = "w-64 md:w-80";
  const interval = 3;
  const totalDuration = LOADING_MESSAGES.length * interval;

  const renderLoadingMessage = (msg: string, index: number) => (
    <Box
      key={msg}
      className="absolute inset-0 flex items-center justify-center opacity-0 text-slate-500 font-medium italic"
      style={{
        animation: `message-cycle ${totalDuration}s linear infinite`,
        animationDelay: `${index * interval}s`,
      }}
    >
      {msg}
    </Box>
  );

  return (
    <Box className="fixed inset-0 z-[9999] w-full h-full min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white p-6 text-center animate-in fade-in duration-1000">
      {/* Premium Background Atmosphere */}
      <Box className="absolute inset-0 overflow-hidden pointer-events-none">
        <Box className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-brand-red/5 rounded-full blur-[150px] animate-pulse" />
        <Box className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-brand-blue/5 rounded-full blur-[120px] animate-pulse [animation-delay:2s]" />
      </Box>

      {/* DesertIcon (Sun/Snow) on top */}
      <Box className="mb-14 text-amber-500 animate-pulse">
        <DesertIcon
          size={72}
          className="drop-shadow-[0_0_20px_rgba(245,158,11,0.6)]"
        />
      </Box>

      {/* Hero section with logo and terrain elements */}
      <Flex
        direction="col"
        align="center"
        className={`relative ${logoWidthClass} mb-14`}
      >
        {/* Row of trees and mountains - constrained to logo width */}
        <Flex justify="between" className="w-full mb-10 px-6">
          <Box className="text-emerald-500 animate-float">
            <Trees
              size={64}
              className="drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]"
            />
          </Box>
          <Box className="text-brand-red animate-float [animation-delay:1.5s]">
            <Mountain
              size={64}
              className="drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]"
            />
          </Box>
        </Flex>

        {/* The Trenchess Brand Logo */}
        <Box className="mb-14">
          <TrenchessText className="text-6xl md:text-7xl lg:text-9xl tracking-tight" />
        </Box>

        {/* Animated Waves loading sequence */}
        <Flex gap={4} className="text-brand-blue mb-16">
          {waveSequence.map((index) => (
            <Box
              key={index}
              className="animate-wave-pulse"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <Waves
                size={44}
                className="drop-shadow-[0_0_10px_rgba(37,99,235,0.4)]"
              />
            </Box>
          ))}
        </Flex>

        {/* Rotating Loading Messages */}
        <Box className="relative h-14 w-full overflow-hidden">
          {LOADING_MESSAGES.map(renderLoadingMessage)}
        </Box>
      </Flex>

      {/* Loading status footer */}
      <Box className="mt-12 space-y-4">
        <h2 className="text-2xl font-bold uppercase tracking-[0.4em] text-slate-400 animate-pulse">
          {message}
        </h2>
        <p className="text-[12px] text-slate-700 uppercase tracking-[0.6em] font-black">
          {submessage}
        </p>
      </Box>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        .animate-float {
          animation: float 4s infinite ease-in-out;
        }
        @keyframes wave-pulse {
          0%, 100% { transform: scale(1); opacity: 0.2; }
          50% { transform: scale(1.2); opacity: 1; }
        }
        .animate-wave-pulse {
          animation: wave-pulse 1.5s ease-in-out infinite;
        }
        @keyframes message-cycle {
          0% { transform: translateY(20px); opacity: 0; }
          5% { transform: translateY(0); opacity: 1; }
          15% { transform: translateY(0); opacity: 1; }
          20% { transform: translateY(-20px); opacity: 0; }
          20.001%, 100% { opacity: 0; }
        }
      `,
        }}
      />
    </Box>
  );
};

export default LoadingScreen;
