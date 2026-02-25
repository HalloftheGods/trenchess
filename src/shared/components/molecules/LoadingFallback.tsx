import { Trees, Mountain, Waves } from "lucide-react";
import TrenchessText from "../atoms/TrenchessText";
import { Box } from "../atoms/Box";
import { Flex } from "../atoms/Flex";
import { DesertIcon } from "../atoms/UnitIcons";

const LOADING_MESSAGES = [
  "Opening Trench...",
  "Pouring the Chessmen...",
  "Cracking the Endgame...",
];

export const LoadingFallback = ({
  fullScreen = false,
}: {
  fullScreen?: boolean;
}) => {
  const waveSequence = [0, 1, 2, 3, 4];
  const interval = 3;
  const totalDuration = LOADING_MESSAGES.length * interval;

  const containerClass = fullScreen
    ? "fixed inset-0 z-[9999] w-full h-full min-h-screen"
    : "w-full min-h-[400px] h-full p-8 shadow-inner rounded-[3rem]";

  return (
    <Box
      className={`flex flex-col items-center justify-center bg-slate-950 text-white p-6 text-center animate-in fade-in duration-700 ${containerClass}`}
    >
      {/* Background Atmosphere (only for full screen) */}
      {fullScreen && (
        <Box className="absolute inset-0 overflow-hidden pointer-events-none">
          <Box className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-brand-red/5 rounded-full blur-[150px] animate-pulse" />
          <Box className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-brand-blue/5 rounded-full blur-[120px] animate-pulse [animation-delay:2s]" />
        </Box>
      )}

      {/* DesertIcon (Sun/Snow) on top */}
      <Box className="mb-10 text-amber-500 animate-pulse">
        <DesertIcon
          size={56}
          className="drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]"
        />
      </Box>

      {/* Row of Trees and mountains - constrained to logo width (~w-64) */}
      <Flex justify="between" className="w-64 mb-8 px-4">
        <Box className="text-emerald-500 animate-float">
          <Trees
            size={48}
            className="drop-shadow-[0_0_12px_rgba(16,185,129,0.4)]"
          />
        </Box>
        <Box className="text-brand-red animate-float [animation-delay:1.5s]">
          <Mountain
            size={48}
            className="drop-shadow-[0_0_12px_rgba(239,68,68,0.4)]"
          />
        </Box>
      </Flex>

      <h2 className="text-4xl font-black uppercase tracking-tighter mb-10">
        Loading <TrenchessText />
      </h2>

      {/* Animated Waves sequence */}
      <Flex gap={3} className="text-brand-blue mb-12">
        {waveSequence.map((index) => (
          <Box
            key={index}
            className="animate-wave-pulse"
            style={{ animationDelay: `${index * 0.15}s` }}
          >
            <Waves
              size={36}
              className="drop-shadow-[0_0_8px_rgba(37,99,235,0.3)]"
            />
          </Box>
        ))}
      </Flex>

      {/* Rotating Loading Message */}
      <Box className="mt-4 relative h-10 w-full overflow-hidden italic text-slate-400 font-medium">
        {LOADING_MESSAGES.map((message, index) => (
          <div
            key={index}
            className="absolute inset-0 flex items-center justify-center opacity-0"
            style={{
              animation: `message-cycle-3 ${totalDuration}s linear infinite`,
              animationDelay: `${index * interval}s`,
            }}
          >
            {message}
          </div>
        ))}
      </Box>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        .animate-float {
          animation: float 3s infinite ease-in-out;
        }
        @keyframes wave-pulse {
          0%, 100% { transform: scale(1); opacity: 0.2; }
          50% { transform: scale(1.15); opacity: 1; }
        }
        .animate-wave-pulse {
          animation: wave-pulse 1.2s ease-in-out infinite;
        }
        @keyframes message-cycle-3 {
          0% { transform: translateY(15px); opacity: 0; }
          8% { transform: translateY(0); opacity: 1; }
          25% { transform: translateY(0); opacity: 1; }
          33% { transform: translateY(-15px); opacity: 0; }
          33.001%, 100% { opacity: 0; }
        }
      `,
        }}
      />
    </Box>
  );
};
